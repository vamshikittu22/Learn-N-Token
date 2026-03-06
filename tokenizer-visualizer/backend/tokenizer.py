import re
import string
from typing import List, Tuple, Dict, Any
from transformers import GPT2Tokenizer, BertTokenizer
from models import TokenInfo, BPEStep

class TokenizerService:
    def __init__(self):
        self.gpt2_tokenizer = None
        self.bert_tokenizer = None

    def preload_models(self):
        if self.gpt2_tokenizer is None:
            self.gpt2_tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
        if self.bert_tokenizer is None:
            self.bert_tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")

    def get_tokenizer(self, model_name: str):
        if model_name == "gpt2":
            if not self.gpt2_tokenizer:
                self.gpt2_tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
            return self.gpt2_tokenizer
        elif model_name == "bert-base-uncased":
            if not self.bert_tokenizer:
                self.bert_tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
            return self.bert_tokenizer
        raise ValueError(f"Unknown model: {model_name}")

# Singleton instance
tokenizer_service = TokenizerService()

def get_token_type(token_text: str, position: int, model_name: str) -> str:
    """Detects type of token for display purposes."""
    if model_name == "gpt2":
        if token_text in ["<|endoftext|>"]:
            return "special"
        if token_text.startswith("Ġ"):
            return "word"
        if not token_text.strip(string.punctuation):
            return "punctuation"
        if position == 0:
            return "word"
        return "subword"
    else:  # Bert
        if token_text in ["[CLS]", "[SEP]", "[PAD]", "[UNK]", "[MASK]"]:
            return "special"
        if token_text.startswith("##"):
            return "subword"
        if not token_text.strip(string.punctuation):
            return "punctuation"
        return "word"


def get_display_text(token_text: str, model_name: str) -> str:
    """Translates the raw token to human readable display."""
    if model_name == "gpt2":
        # GPT2 uses Ġ to represent space
        return token_text.replace("Ġ", " ")
    elif model_name == "bert-base-uncased":
        # Bert uses ## for subwords
        if token_text.startswith("##"):
            return token_text[2:]
        return token_text
    return token_text

def simulate_bpe_steps(text: str, tokenizer: GPT2Tokenizer) -> List[BPEStep]:
    """
    Simulates the BPE process step-by-step for visualization.
    Only implemented for GPT-2. We apply actual BPE merges dynamically.
    """
    if not text:
        return []

    # First, byte encode strings into unicode chars
    bpe_ranks = tokenizer.bpe_ranks
    byte_encoder = tokenizer.byte_encoder
    
    # Custom tokenization by regex (GPT2 regex)
    pat = re.compile(r"""'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+""")
    import regex
    pat = regex.compile(r"""'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+""")
    
    # For educational visualization, we'll just demonstrate the first word's merges
    # as the full string merge can be extremely verbose. We will take the longest word.
    words = [match.group() for match in pat.finditer(text)]
    if not words:
        return []
        
    target_word = max(words, key=len)
    
    # Encode with byte_encoder
    word_bytes = "".join([byte_encoder[b] for b in target_word.encode("utf-8")])
    
    # Initial state is a list of characters
    word_tokens = list(word_bytes)
    
    steps = [
        BPEStep(
            step=0,
            description=f"Initial characters for '{target_word}'",
            tokens=list(word_tokens)
        )
    ]
    
    step_count = 1
    
    while len(word_tokens) > 1:
        # Find all pairs
        pairs = set(zip(word_tokens[:-1], word_tokens[1:]))
        if not pairs:
            break
            
        # Find pair with lowest rank
        bigram = min(pairs, key=lambda pair: bpe_ranks.get(pair, float("inf")))
        if bigram not in bpe_ranks:
            break
            
        # Merge this bigram everywhere
        new_tokens = []
        i = 0
        while i < len(word_tokens):
            if i < len(word_tokens) - 1 and word_tokens[i] == bigram[0] and word_tokens[i+1] == bigram[1]:
                new_tokens.append(bigram[0] + bigram[1])
                i += 2
            else:
                new_tokens.append(word_tokens[i])
                i += 1
                
        merged_str = "".join(bigram)
        steps.append(
            BPEStep(
                step=step_count,
                description=f"Merged '{bigram[0]}' and '{bigram[1]}' → '{merged_str}'",
                tokens=list(word_tokens), # show tokens before merge, and highlight pairs in UI
                merged_pair=bigram,
                result_token=merged_str
            )
        )
        
        word_tokens = new_tokens
        step_count += 1
        
    # Final step to show final state
    steps.append(
        BPEStep(
            step=step_count,
            description="Final joined BPE tokens",
            tokens=word_tokens
        )
    )
    
    return steps


def tokenize_process(text: str, model_name: str, include_bpe: bool = True) -> Tuple[List[TokenInfo], List[int], int, List[BPEStep]]:
    tokenizer = tokenizer_service.get_tokenizer(model_name)
    
    raw_ids = tokenizer.encode(text, add_special_tokens=True)
    raw_tokens = tokenizer.convert_ids_to_tokens(raw_ids)
    
    # Calculate Frequency
    freq_map = {}
    for tid in raw_ids:
        freq_map[tid] = freq_map.get(tid, 0) + 1
        
    # Map each unique ID to a consistent color index
    color_map = {}
    color_idx = 0
    token_infos = []
    
    for i, (tid, t_text) in enumerate(zip(raw_ids, raw_tokens)):
        if tid not in color_map:
            color_map[tid] = color_idx
            color_idx += 1
            
        display_text = get_display_text(t_text, model_name)
        token_type = get_token_type(t_text, i, model_name)
        
        token_infos.append(
            TokenInfo(
                text=t_text,
                display=display_text,
                id=tid,
                type=token_type,
                position=i,
                frequency=freq_map[tid],
                color_index=color_map[tid]
            )
        )
        
    bpe_steps = []
    if include_bpe and model_name == "gpt2":
        bpe_steps = simulate_bpe_steps(text, tokenizer)
        
    return token_infos, raw_ids, tokenizer.vocab_size, bpe_steps

