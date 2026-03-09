---
phase: 02-backend-new-features
plan: 01
subsystem: api
tags: [fastapi, bert, attention, tokenization, pytest]

# Dependency graph
requires:
  - phase: 01-backend-fixes-and-hardening
    provides: "ErrorResponse format, rate limiting, input sanitization, CORS config"
provides:
  - "POST /api/attention endpoint returning BERT attention matrix"
  - "POST /api/compare endpoint for token comparison"
  - "AttentionService singleton with BERT model caching"
  - "6 new tests for attention and compare endpoints"
affects: [03-frontend-data-layer, 04-visualization-components]

# Tech tracking
tech-stack:
  added: [transformers (BERT), torch]
  patterns: ["Singleton service pattern for model caching", "Rate-limited API endpoints", "ErrorResponse consistency"]

key-files:
  created:
    - tokenizer-visualizer/backend/attention.py
  modified:
    - tokenizer-visualizer/backend/main.py
    - tokenizer-visualizer/backend/models.py
    - tokenizer-visualizer/backend/tests/test_tokenizer.py

key-decisions:
  - "Used singleton pattern for AttentionService matching existing EmbeddingService"
  - "Extracted layer 6 attention averaged across 12 heads for visualization"
  - "Reused tokenize_process for compare endpoint for consistency"

patterns-established:
  - "Service singleton pattern with lazy loading and device detection"
  - "Rate-limited endpoints with 30/minute limit"

# Metrics
duration: 33 min
completed: 2026-03-09
---

# Phase 2 Plan 1: Attention & Compare Endpoints Summary

**Attention endpoint with BERT singleton returning layer-6 attention matrix, and compare endpoint for token comparison between two texts**

## Performance

- **Duration:** 33 min
- **Started:** 2026-03-09T20:28:23Z
- **Completed:** 2026-03-09T21:01:13Z
- **Tasks:** 2
- **Files modified:** 4 (1 created, 3 modified)

## Accomplishments
- Created AttentionService singleton that loads BERT model once and caches in memory
- Implemented /api/attention endpoint extracting layer-6 attention weights averaged across heads
- Implemented /api/compare endpoint returning token counts, shared tokens, and unique tokens per text
- Added 6 new tests covering both endpoints (attention: 3, compare: 3)
- All 16 tests pass (10 existing + 6 new)

## Task Commits

Each task was committed atomically:

1. **Task 1: Attention endpoint with BERT singleton service (BFET-01)** - `fc46312` (feat)
2. **Task 2: Compare endpoint + tests for both new endpoints (BFET-02)** - `610acbd` (test)

**Plan metadata:** (to be added after summary commit)

## Files Created/Modified
- `tokenizer-visualizer/backend/attention.py` - AttentionService singleton with BERT attention extraction
- `tokenizer-visualizer/backend/main.py` - Added /api/attention and /api/compare endpoints
- `tokenizer-visualizer/backend/models.py` - Added AttentionRequest, AttentionResponse, CompareRequest, CompareResponse
- `tokenizer-visualizer/backend/tests/test_tokenizer.py` - Added 6 tests for new endpoints

## Decisions Made
- Used singleton pattern matching existing EmbeddingService for consistency
- Layer 6 selected as middle layer for representative attention visualization
- Compare endpoint reuses existing tokenize_process for consistency

## Deviations from Plan

None - plan executed exactly as written.

---

**Total deviations:** 0 auto-fixed
**Impact on plan:** None

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Attention endpoint ready for AttentionHeatmap visualization component (Phase 4)
- Compare endpoint ready for token comparison UI (Phase 4)
- All tests pass, backend ready for Phase 3 frontend data layer integration

---
*Phase: 02-backend-new-features*
*Completed: 2026-03-09*

## Self-Check: PASSED

- [x] .planning/phases/02-backend-new-features/02-01-SUMMARY.md exists
- [x] tokenizer-visualizer/backend/attention.py exists
- [x] tokenizer-visualizer/backend/main.py modified
- [x] tokenizer-visualizer/backend/models.py modified
- [x] tokenizer-visualizer/backend/tests/test_tokenizer.py modified
- [x] Commit fc46312 (feat) exists
- [x] Commit 610acbd (test) exists
- [x] Commit 0a71826 (docs) exists
- [x] All 16 tests pass
