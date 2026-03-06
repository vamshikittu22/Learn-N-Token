from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Tuple

# All request/response types must be strictly typed
class TokenizeRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000)
    model: Literal["gpt2", "bert-base-uncased"] = "gpt2"
    include_embeddings: bool = False
    include_bpe_steps: bool = True

class TokenInfo(BaseModel):
    text: str           # Raw token string e.g. "Ġquick"
    display: str        # Human-readable e.g. " quick"
    id: int             # Real vocab ID e.g. 2068
    type: str           # "word" | "subword" | "punctuation" | "special"
    position: int       # Position in sequence
    frequency: int      # How many times this ID appears in the full text
    color_index: int    # For consistent coloring in UI

class BPEStep(BaseModel):
    step: int
    description: str
    tokens: List[str]
    merged_pair: Optional[Tuple[str, str]] = None
    result_token: Optional[str] = None

class EmbeddingInfo(BaseModel):
    token_id: int
    token_text: str
    vector: List[float]   # Real 768-dim vector, truncated to first 16 for viz
    full_dim: int         # 768

class TokenizeResponse(BaseModel):
    tokens: List[TokenInfo]
    raw_ids: List[int]
    vocab_size: int
    total_tokens: int
    unique_tokens: int
    reuse_rate: float
    bpe_steps: Optional[List[BPEStep]] = None
    embeddings: Optional[List[EmbeddingInfo]] = None
    model_used: str
    processing_time_ms: float
