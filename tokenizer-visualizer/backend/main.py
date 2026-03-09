import time
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError

from models import TokenizeRequest, TokenizeResponse, ErrorResponse
from config import settings
from tokenizer import tokenizer_service, tokenize_process
from embeddings import embedding_service

app = FastAPI(title="FAANG Tokenizer Visualizer API")

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
async def tokenize(req: TokenizeRequest):
    try:
        start_ms = time.time() * 1000
        
        tokens, raw_ids, vocab_size, bpe_steps = \
            tokenize_process(req.text, req.model, req.include_bpe_steps)
            
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
