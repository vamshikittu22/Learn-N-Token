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

from models import TokenizeRequest, TokenizeResponse, ErrorResponse
from config import settings
from tokenizer import tokenizer_service, tokenize_process
from embeddings import embedding_service


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

app = FastAPI(title="FAANG Tokenizer Visualizer API")
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
            error="rate_limit_exceeded",
            detail="Rate limit exceeded: 30 per minute. Please wait before retrying.",
            status_code=429
        ).model_dump()
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            error=_status_to_error_type(exc.status_code),
            detail=str(exc.detail),
            status_code=exc.status_code
        ).model_dump()
    )


@app.exception_handler(RequestValidationError)
async def request_validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content=ErrorResponse(
            error="validation_error",
            detail=str(exc),
            status_code=422
        ).model_dump()
    )


@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    return JSONResponse(
        status_code=422,
        content=ErrorResponse(
            error="validation_error",
            detail=str(exc),
            status_code=422
        ).model_dump()
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            error="internal_error",
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
    print("Models preloaded into memory on startup.")

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/models")
def list_models():
    return {"models": settings.supported_models}

@app.post("/api/tokenize", response_model=TokenizeResponse)
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
            processing_time_ms=end_ms - start_ms
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model Processing Error: {str(e)}")
