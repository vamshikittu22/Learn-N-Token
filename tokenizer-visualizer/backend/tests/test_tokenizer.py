import pytest
from fastapi.testclient import TestClient
from main import app
from pydantic import ValidationError

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200

def test_tokenize_hello_world():
    response = client.post("/api/tokenize", json={"text": "Hello world", "model": "gpt2"})
    assert response.status_code == 200
    data = response.json()
    
    raw_ids = data["raw_ids"]
    assert raw_ids == [15496, 995], f"Expected GPT2 token IDs for 'Hello world' are [15496, 995], got {raw_ids}"
    
    assert data["vocab_size"] == 50257
    assert data["total_tokens"] == 2
    assert data["unique_tokens"] == 2

def test_subword_detection():
    response = client.post("/api/tokenize", json={"text": "tokenization", "model": "gpt2"})
    assert response.status_code == 200
    data = response.json()
    
    tokens = data["tokens"]
    # Usually "token" "ization"
    assert len(tokens) > 1
    # Check types
    assert tokens[0]["type"] == "word"
    assert tokens[1]["type"] == "subword"
    
def test_frequency_count():
    response = client.post("/api/tokenize", json={"text": "cat cat dog", "model": "gpt2"})
    assert response.status_code == 200
    data = response.json()
    
    tokens = data["tokens"]
    assert tokens[0]["text"] == "cat"
    assert tokens[0]["frequency"] == 1 # "cat"
    assert tokens[1]["text"] == "Ġcat" # Because it has a space before it usually
    
def test_validation_errors():
    # Empty string should fail
    response = client.post("/api/tokenize", json={"text": ""})
    assert response.status_code == 422
    data = response.json()
    assert "error" in data
    assert "status_code" in data
    
    # Text too long
    long_text = "A" * 2001
    response = client.post("/api/tokenize", json={"text": long_text})
    assert response.status_code == 422
