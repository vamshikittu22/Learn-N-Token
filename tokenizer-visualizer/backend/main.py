import re as stdlib_re
import time
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from models import TokenizeRequest, TokenizeResponse, ErrorResponse, AttentionRequest, AttentionResponse, CompareRequest, CompareResponse
from config import settings
from tokenizer import tokenizer_service, tokenize_process
from embeddings import embedding_service
from attention import attention_service


def sanitize_input(text: str) -> str:
    """Strip null bytes, control characters (except newline/tab), and zero-width spaces."""
    # Remove null bytes
    text = text.replace("\x00", "")
    # Remove zero-width spaces and other zero-width characters
    text = stdlib_re.sub(r"[\u200b\u200c\u200d\ufeff\u2060]", "", text)
    # Remove control characters except \n (0x0a) and \t (0x09)
    text = "".join(c for c in text if c in ("\n", "\t") or (ord(c) >= 0x20))
    return text.strip()


limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="FAANG Tokenizer Visualizer API",
    description="A high-performance LLM Tokenizer Visualizer backend supporting GPT-2, BERT, and GPT-4 (tiktoken).",
    version="0.2.0",
    contact={
        "name": "FAANG Engineer",
        "url": "https://github.com/vamshikittu22",
    },
    license_info={
        "name": "MIT",
    }
)
app.state.limiter = limiter

# Setup CORS for Vite UI
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _status_to_error_type(status_code: int) -> str:
    return {
        400: "bad_request",
        404: "not_found",
        422: "validation_error",
        429: "rate_limit_exceeded",
        500: "internal_error",
    }.get(status_code, "unknown_error")


@app.exception_handler(RateLimitExceeded)
async def rate_limit_exception_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content=ErrorResponse(
            message="rate_limit_exceeded",
            detail="Rate limit exceeded: 30 per minute. Please wait before retrying.",
            status_code=429
        ).model_dump()
    )

from starlette.exceptions import HTTPException as StarletteHTTPException

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            message=_status_to_error_type(exc.status_code),
            detail=str(exc.detail),
            status_code=exc.status_code
        ).model_dump()
    )


@app.exception_handler(RequestValidationError)
async def request_validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content=ErrorResponse(
            message="validation_error",
            detail=str(exc),
            status_code=422
        ).model_dump()
    )


@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    return JSONResponse(
        status_code=422,
        content=ErrorResponse(
            message="validation_error",
            detail=str(exc),
            status_code=422
        ).model_dump()
    )


@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    return JSONResponse(
        status_code=400,
        content=ErrorResponse(
            message="value_error",
            detail=str(exc),
            status_code=400
        ).model_dump()
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            message="internal_error",
            detail=f"Internal server error: {str(exc)}",
            status_code=500
        ).model_dump()
    )


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = f"{process_time:.4f} sec"
    return response

@app.on_event("startup")
async def startup_event():
    # Pre-load GPT-2 in background into memory singleton
    tokenizer_service.preload_models()
    embedding_service.preload_model()
    attention_service.preload_model()
    print("Models preloaded into memory on startup.")

@app.get("/health", summary="Health Check", description="Returns standard application health status.", response_description="Status ok message.", tags=["System"])
def health_check():
    return {"status": "ok"}

@app.get("/models", summary="List Supported Models", description="Returns a list of all currently supported tokenizer models.", response_description="List of model strings.", tags=["System"])
def list_models():
    return {"models": settings.supported_models}

@app.post("/api/tokenize", summary="Tokenize Text", description="Tokenize input text using the specified model.", response_description="Full tokenization details including tokens, BPE steps, and context usage.", tags=["Tokenizer"], response_model=TokenizeResponse)
@limiter.limit("30/minute")
async def tokenize(request: Request, req: TokenizeRequest):
    # Sanitize input
    clean_text = sanitize_input(req.text)
    if not clean_text:
        raise HTTPException(status_code=400, detail="Text is empty after sanitization")

    try:
        start_ms = time.time() * 1000
        
        tokens, raw_ids, vocab_size, bpe_steps = \
            tokenize_process(clean_text, req.model, req.include_bpe_steps)
            
        embeddings_info = None
        if req.include_embeddings and req.model == 'gpt2':
            # Extract basic embeddings
            token_texts = [t.text for t in tokens]
            embeddings_info = embedding_service.get_embeddings(raw_ids, token_texts)
            
        end_ms = time.time() * 1000
        
        # Aggregation Stats
        total_tokens = len(raw_ids)
        unique_tokens = len(set(raw_ids))
        reuse_rate = 0.0
        if unique_tokens > 0:
            reuse_rate = round((total_tokens - unique_tokens) / total_tokens, 4)
            
        
        # Calculate Context Window Usage
        context_window_usage = {
            "gpt2": round((total_tokens / 1024) * 100, 4),
            "gpt35": round((total_tokens / 4096) * 100, 4),
            "gpt4": round((total_tokens / 8192) * 100, 4),
            "gpt4_32k": round((total_tokens / 32768) * 100, 4),
            "llama3": round((total_tokens / 131072) * 100, 4),
        }

        return TokenizeResponse(
            tokens=tokens,
            raw_ids=raw_ids,
            vocab_size=vocab_size,
            total_tokens=total_tokens,
            unique_tokens=unique_tokens,
            reuse_rate=reuse_rate,
            bpe_steps=bpe_steps if req.include_bpe_steps else None,
            embeddings=embeddings_info,
            model_used=req.model,
            processing_time_ms=end_ms - start_ms,
            context_window_usage=context_window_usage
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model Processing Error: {str(e)}")


@app.post("/api/attention", summary="Extract Attention Weights", description="Gets real layer 6 attention weights from BERT for visualization.", response_description="Attention tokens and adjacency matrix.", tags=["Transformers"], response_model=AttentionResponse)
@limiter.limit("30/minute")
async def attention(request: Request, req: AttentionRequest):
    """Extract BERT attention weights for the given text."""
    # Sanitize input
    clean_text = sanitize_input(req.text)
    if not clean_text:
        raise HTTPException(status_code=400, detail="Text is empty after sanitization")

    try:
        start_ms = time.time() * 1000
        result = attention_service.get_attention(clean_text)
        end_ms = time.time() * 1000

        return AttentionResponse(
            tokens=result["tokens"],
            attention_matrix=result["attention_matrix"],
            layer=result["layer"],
            model_used=req.model,
            processing_time_ms=end_ms - start_ms
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Attention Extraction Error: {str(e)}")


@app.post("/api/compare", summary="Compare Tokenization", description="Tokenizes two texts and compares their tokens and context window usage.", response_description="Comparison metrics including tokens, intersection, and efficiency.", tags=["Tokenizer"], response_model=CompareResponse)
@limiter.limit("30/minute")
async def compare(request: Request, req: CompareRequest):
    """Compare tokenization of two texts."""
    # Sanitize inputs
    clean_text1 = sanitize_input(req.text1)
    clean_text2 = sanitize_input(req.text2)
    
    if not clean_text1:
        raise HTTPException(status_code=400, detail="Text 1 is empty after sanitization")
    if not clean_text2:
        raise HTTPException(status_code=400, detail="Text 2 is empty after sanitization")

    try:
        start_ms = time.time() * 1000
        
        # Tokenize both texts using existing tokenize_process
        tokens1, raw_ids1, _, _ = tokenize_process(clean_text1, req.model, False)
        tokens2, raw_ids2, _, _ = tokenize_process(clean_text2, req.model, False)
        
        text1_tokens_str = [t.text for t in tokens1]
        text2_tokens_str = [t.text for t in tokens2]
        
        # Extract token text sets
        set1 = set(text1_tokens_str)
        set2 = set(text2_tokens_str)
        
        # Compute shared tokens
        shared_tokens = sorted(list(set1 & set2))
        
        # Efficiency Ratio (tokens per word)
        # simplistic word count by split
        word_count1 = max(1, len(clean_text1.split()))
        word_count2 = max(1, len(clean_text2.split()))
        
        t1_count = len(raw_ids1)
        t2_count = len(raw_ids2)
        
        t1_efficiency = round(t1_count / word_count1, 3)
        t2_efficiency = round(t2_count / word_count2, 3)
        
        context_window_usage = {
            "text1": round((t1_count / 4096) * 100, 4),
            "text2": round((t2_count / 4096) * 100, 4),
        }
        
        end_ms = time.time() * 1000
        
        return CompareResponse(
            text1_tokens=text1_tokens_str,
            text2_tokens=text2_tokens_str,
            text1_ids=raw_ids1,
            text2_ids=raw_ids2,
            text1_token_count=t1_count,
            text2_token_count=t2_count,
            shared_tokens=shared_tokens,
            text1_efficiency_ratio=t1_efficiency,
            text2_efficiency_ratio=t2_efficiency,
            context_window_usage=context_window_usage,
            model_used=req.model,
            processing_time_ms=end_ms - start_ms
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Compare Error: {str(e)}")
