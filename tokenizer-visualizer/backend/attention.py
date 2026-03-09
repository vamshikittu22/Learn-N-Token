import torch
from transformers import BertModel, BertTokenizer
from typing import Dict, List


class AttentionService:
    """Singleton service for extracting BERT attention weights."""
    
    def __init__(self):
        self.bert_model = None
        self.bert_tokenizer = None
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    def preload_model(self):
        """Load BERT model and tokenizer once, caching in memory."""
        if self.bert_model is None:
            self.bert_model = BertModel.from_pretrained(
                "bert-base-uncased",
                output_attentions=True
            ).to(self.device)
            self.bert_model.eval()  # Set to evaluation mode
            
        if self.bert_tokenizer is None:
            self.bert_tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")

    def get_attention(self, text: str) -> Dict:
        """
        Extract attention weights from BERT for the given text.
        
        Args:
            text: Input text to analyze (should be pre-sanitized, max 100 chars)
            
        Returns:
            Dict with keys:
                - tokens: List of token strings
                - attention_matrix: n x n list of floats (layer 6 averaged across heads)
                - layer: int (6)
        """
        if not self.bert_model or not self.bert_tokenizer:
            self.preload_model()
            
        # Tokenize with special tokens
        inputs = self.bert_tokenizer(
            text,
            return_tensors="pt",
            add_special_tokens=True
        ).to(self.device)
        
        # Run forward pass
        with torch.no_grad():
            outputs = self.bert_model(**inputs)
        
        # Extract attentions tuple - shape is (layers, batch, heads, seq_len, seq_len)
        attentions = outputs.attentions  # tuple of 12 layers
        
        # Get layer 6 (7th layer, 0-indexed)
        layer_6_attention = attentions[6]  # Shape: (1, 12, seq_len, seq_len)
        
        # Average across all 12 heads (dim=1)
        averaged_attention = layer_6_attention.mean(dim=1).squeeze(0)  # Shape: (seq_len, seq_len)
        
        # Convert to Python list of lists (n x n float matrix)
        attention_matrix = averaged_attention.cpu().numpy().tolist()
        
        # Get token strings
        token_ids = inputs["input_ids"].squeeze(0).cpu().tolist()
        tokens = self.bert_tokenizer.convert_ids_to_tokens(token_ids)
        
        return {
            "tokens": tokens,
            "attention_matrix": attention_matrix,
            "layer": 6
        }


# Singleton instance
attention_service = AttentionService()


def extract_attention(text: str) -> Dict:
    """Convenience function that delegates to the singleton service."""
    return attention_service.get_attention(text)
