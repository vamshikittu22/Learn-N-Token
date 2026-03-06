import torch
from transformers import GPT2Model
from typing import List
from models import EmbeddingInfo

class EmbeddingService:
    def __init__(self):
        self.gpt2_model = None
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    def preload_model(self):
        if self.gpt2_model is None:
            self.gpt2_model = GPT2Model.from_pretrained("gpt2").to(self.device)
            self.gpt2_model.eval()  # Set to evaluation mode

    def get_embeddings(self, token_ids: List[int], token_texts: List[str]) -> List[EmbeddingInfo]:
        """
        Extracts the first 16 dimensions of the 768-D token embeddings from the word token embedding layer.
        """
        if not self.gpt2_model:
            self.preload_model()
            
        # Convert IDs to tensor representation
        input_ids = torch.tensor([token_ids]).to(self.device)
        
        # We only pass through the embedding layer wte (Word Token Embeddings)
        # We don't need the full forward pass for just the embeddings.
        with torch.no_grad():
            full_embeddings = self.gpt2_model.wte(input_ids)
            
        embeddings_list = full_embeddings[0].cpu().numpy().tolist()
        
        results = []
        for i, (tid, text) in enumerate(zip(token_ids, token_texts)):
            # Trucate to first 16 valid dimensions for UI performance
            vector_preview = embeddings_list[i][:16]
            results.append(
                EmbeddingInfo(
                    token_id=tid,
                    token_text=text,
                    vector=vector_preview,
                    full_dim=len(embeddings_list[i]) # should be 768
                )
            )
            
        return results

# Singleton memory cache
embedding_service = EmbeddingService()

def extract_embeddings(token_ids: List[int], token_texts: List[str]) -> List[EmbeddingInfo]:
    return embedding_service.get_embeddings(token_ids, token_texts)
