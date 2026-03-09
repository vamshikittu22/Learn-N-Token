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

def test_error_response_format():
    """BFIX-03: All errors return {error, detail, status_code}."""
    response = client.post("/api/tokenize", json={"text": ""})
    assert response.status_code == 422
    data = response.json()
    assert "error" in data
    assert "detail" in data
    assert "status_code" in data
    assert data["status_code"] == 422

def test_sanitize_null_bytes():
    """BFIX-05: Null bytes are stripped from input."""
    response = client.post("/api/tokenize", json={"text": "Hello\x00world"})
    assert response.status_code == 200
    data = response.json()
    # Should tokenize "Helloworld" (null byte removed)
    assert data["total_tokens"] > 0

def test_sanitize_zero_width_spaces():
    """BFIX-05: Zero-width spaces are stripped."""
    response = client.post("/api/tokenize", json={"text": "Hello\u200bworld"})
    assert response.status_code == 200

def test_sanitize_empty_after():
    """BFIX-05: Empty text after sanitization returns 400."""
    response = client.post("/api/tokenize", json={"text": "\u200b\u200c"})
    # This should first pass Pydantic min_length=1 (it has 2 chars),
    # then fail sanitization (empty after stripping)
    assert response.status_code == 400
    data = response.json()
    assert data["error"] == "bad_request"
    assert data["status_code"] == 400

def test_rate_limit_format():
    """BFIX-04: Rate limit returns 429 with standard error format."""
    # We can't easily trigger 30 req/min in tests without mocking,
    # but we can verify the rate limiter is attached by checking
    # that the endpoint still works (not broken by limiter setup)
    response = client.post("/api/tokenize", json={"text": "test", "model": "gpt2"})
    assert response.status_code == 200


# === New endpoint tests for BFET-01 and BFET-02 ===

def test_attention_basic():
    """BFET-01: POST /api/attention returns tokens and attention matrix."""
    response = client.post("/api/attention", json={"text": "Hello", "model": "bert-base-uncased"})
    assert response.status_code == 200
    data = response.json()
    
    assert "tokens" in data
    assert "attention_matrix" in data
    assert "layer" in data
    
    # Matrix should be square (n x n)
    matrix = data["attention_matrix"]
    n = len(matrix)
    assert n == len(data["tokens"])
    for row in matrix:
        assert len(row) == n
        # All values should be floats between 0 and 1
        for val in row:
            assert 0 <= val <= 1


def test_attention_char_limit():
    """BFET-01: POST /api/attention enforces 100-char text limit."""
    # Text of 101 characters should fail with 422
    long_text = "A" * 101
    response = client.post("/api/attention", json={"text": long_text})
    assert response.status_code == 422


def test_attention_empty():
    """BFET-01: Empty text after sanitization returns 400."""
    # Zero-width characters become empty after sanitization
    response = client.post("/api/attention", json={"text": "\u200b\u200c"})
    assert response.status_code == 400
    data = response.json()
    assert data["error"] == "bad_request"


def test_compare_basic():
    """BFET-02: POST /api/compare returns token counts and shared/unique tokens."""
    response = client.post("/api/compare", json={
        "text1": "Hello world",
        "text2": "Hello there",
        "model": "gpt2"
    })
    assert response.status_code == 200
    data = response.json()
    
    assert "text1_token_count" in data
    assert "text2_token_count" in data
    assert "shared_tokens" in data
    assert "text1_unique_tokens" in data
    assert "text2_unique_tokens" in data
    
    # Should have shared tokens
    assert "Hello" in data["shared_tokens"] or any("Hello" in t for t in data["shared_tokens"])
    # Both should have unique tokens
    assert len(data["text1_unique_tokens"]) > 0
    assert len(data["text2_unique_tokens"]) > 0


def test_compare_same_text():
    """BFET-02: Identical texts have empty unique lists."""
    response = client.post("/api/compare", json={
        "text1": "test",
        "text2": "test",
        "model": "gpt2"
    })
    assert response.status_code == 200
    data = response.json()
    
    # Unique lists should be empty
    assert data["text1_unique_tokens"] == []
    assert data["text2_unique_tokens"] == []
    # Shared should contain all tokens
    assert len(data["shared_tokens"]) == data["text1_token_count"]


def test_compare_empty_text():
    """BFET-02: Empty text returns 422 (Pydantic min_length)."""
    response = client.post("/api/compare", json={"text1": "", "text2": "Hello"})
    assert response.status_code == 422
