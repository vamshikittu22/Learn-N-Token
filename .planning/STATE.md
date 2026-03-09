# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-09)

**Core value:** Users can tokenize any text with real ML models and see exactly what the model "sees" — tokens, IDs, BPE merge steps, embeddings, and attention patterns — through an interactive, visually stunning interface.
**Current focus:** Phase 2 — Backend New Features

## Current Position

Phase: 2 of 8 (Backend New Features)
Plan: 1 of 2 in current phase
Status: In progress
Last activity: 2026-03-09 — Completed 02-01-PLAN.md

Progress: [██░░░░░░░░] 25%

## Performance Metrics

**Velocity:**
- Total plans completed: 3
- Average duration: 12 min
- Total execution time: 0.72 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-backend-fixes-and-hardening | 2 | 10 min | 5 min |
| 02-backend-new-features | 1 | 33 min | 33 min |

**Recent Trend:**
- Last 5 plans: 4 min, 6 min, 33 min
- Trend: stable

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Roadmap]: 8-phase structure derived from 31 requirements across 7 categories
- [Roadmap]: DEVP-05 (.env.example) grouped with Phase 1 since it documents CORS_ORIGINS from BFIX-02
- [Roadmap]: Phase 7 (DevOps) depends only on Phase 1, can run in parallel with Phases 3-6
- [01-01]: Used Union[str, list[str]] type for cors_origins to work around pydantic-settings JSON parsing of list env vars
- [01-01]: Belt-and-suspenders approach for pytest imports: both pytest.ini pythonpath and conftest.py sys.path insertion
- [01-02]: Global FastAPI exception handlers for consistent ErrorResponse format across all error types
- [01-02]: Custom RateLimitExceeded handler instead of slowapi default to maintain ErrorResponse consistency
- [01-02]: sanitize_input preserves newlines/tabs while stripping control characters
- [02-01]: Used singleton pattern for AttentionService matching existing EmbeddingService
- [02-01]: Extracted layer 6 attention averaged across 12 heads for visualization
- [02-01]: Compare endpoint reuses existing tokenize_process for consistency

### Pending Todos

None yet.

### Blockers/Concerns

- ~~Backend tests currently fail due to import path issues~~ ✓ Resolved in 01-01

## Session Continuity

Last session: 2026-03-09
Stopped at: Completed 02-01-PLAN.md — Phase 2 in progress
Resume file: None
