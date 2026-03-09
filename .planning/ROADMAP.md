# Roadmap: Learn'N'Token

## Overview

Elevate an existing tokenizer visualizer (backend ~90%, frontend ~50%) into a FAANG-quality portfolio piece with 7 visualization tabs, backend hardening, and full containerization. The journey starts with fixing and hardening the existing backend, then adding new API capabilities, extending the frontend data layer, building 5 visualization components, assembling the full 7-tab experience, polishing code quality, containerizing, and documenting. Each phase delivers a coherent, verifiable capability that unblocks the next.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Backend Fixes & Hardening** - Fix tests, add CORS config, error standardization, rate limiting, and input sanitization
- [ ] **Phase 2: Backend New Features** - Add attention, compare, tiktoken, budget, and OpenAPI endpoints
- [ ] **Phase 3: Frontend Data Layer** - Update types, store, and API layer for new backend capabilities
- [ ] **Phase 4: Visualization Components** - Build all 5 visualization components with performance optimizations
- [ ] **Phase 5: App Assembly & Accessibility** - Wire 7-tab layout, accessibility, and code organization
- [ ] **Phase 6: TypeScript Strict & Error Handling** - Enable strict mode, eliminate `any`, standardize error handling
- [ ] **Phase 7: DevOps & Containerization** - Dockerfiles, compose, and CI pipeline
- [ ] **Phase 8: Documentation** - README rewrite and architecture doc update

## Phase Details

### Phase 1: Backend Fixes & Hardening
**Goal**: The existing backend is reliable, secure, and testable — all tests pass, errors are standardized, and inputs are validated
**Depends on**: Nothing (first phase)
**Requirements**: BFIX-01, BFIX-02, BFIX-03, BFIX-04, BFIX-05, DEVP-05
**Success Criteria** (what must be TRUE):
  1. `pytest` runs from the project root and all existing backend tests pass without import errors
  2. CORS origins are configurable via the `CORS_ORIGINS` environment variable, and `.env.example` documents all environment variables
  3. Every API error response (400, 404, 422, 429, 500) returns a consistent `{error, detail, status_code}` JSON structure
  4. Sending more than 30 requests/minute to `/api/tokenize` from one IP returns a 429 response
  5. Submitting text containing null bytes, control characters, or zero-width spaces returns sanitized results (or 400 if empty after sanitization)
**Plans:** 2 plans

Plans:
- [x] 01-01-PLAN.md — Fix test infrastructure + CORS env config + .env.example
- [ ] 01-02-PLAN.md — Error standardization + rate limiting + input sanitization

### Phase 2: Backend New Features
**Goal**: The backend exposes all API capabilities needed for the full 7-tab visualization experience
**Depends on**: Phase 1
**Requirements**: BFET-01, BFET-02, BFET-03, BFET-04, BFET-05
**Success Criteria** (what must be TRUE):
  1. POST `/api/attention` returns an attention matrix for BERT tokenized text (100-char limit enforced), and the response is a valid n x n float array
  2. POST `/api/compare` returns token counts, shared tokens, and unique tokens for two input texts
  3. Selecting "gpt4" as the model option tokenizes text using tiktoken's cl100k_base encoding with vocab_size 100277
  4. Every `/api/tokenize` response includes `context_window_usage` showing usage percentages across 5 model context windows
  5. The Swagger UI at `/docs` shows organized, tagged, and documented endpoints at API version 0.2.0
**Plans**: TBD

Plans:
- [ ] 02-01: TBD
- [ ] 02-02: TBD

### Phase 3: Frontend Data Layer
**Goal**: The frontend TypeScript types, Zustand store, and API layer fully support all new backend capabilities
**Depends on**: Phase 2
**Requirements**: FINT-02, FINT-03, FINT-04
**Success Criteria** (what must be TRUE):
  1. TypeScript types exist for AttentionResponse, CompareResponse, context_window_usage, and the 'gpt4' model literal — and compile without errors
  2. The Zustand store includes a 'gpt4' model option and actions for fetching attention and comparison data
  3. The API layer exports `getAttention()` and `compareTokens()` functions that correctly call the new backend endpoints
**Plans**: TBD

Plans:
- [ ] 03-01: TBD

### Phase 4: Visualization Components
**Goal**: All 5 visualization components render their data correctly with proper performance optimizations
**Depends on**: Phase 3
**Requirements**: FCMP-01, FCMP-02, FCMP-03, FCMP-04, FCMP-05, QUAL-04
**Success Criteria** (what must be TRUE):
  1. BPEAnimation shows step-by-step merge operations with play/pause/step controls, highlighting which tokens merge at each step
  2. VocabTable displays a sortable, filterable table of tokens (token, ID, type, frequency) with useMemo preventing unnecessary re-sorts
  3. EmbeddingChart renders a Recharts bar chart of embedding dimensions with a token selector dropdown
  4. AttentionHeatmap displays an n x n color-scaled grid of attention weights between tokens fetched from the backend
  5. TokenBudgetPanel shows context window usage bars for each model context window (GPT-2 1K, GPT-3.5 4K, GPT-4 8K, GPT-4 32K, LLaMA 128K)
**Plans**: TBD

Plans:
- [ ] 04-01: TBD
- [ ] 04-02: TBD
- [ ] 04-03: TBD

### Phase 5: App Assembly & Accessibility
**Goal**: The full 7-tab application is assembled, accessible, and well-organized
**Depends on**: Phase 4
**Requirements**: FINT-01, QUAL-03, QUAL-05
**Success Criteria** (what must be TRUE):
  1. App.tsx presents 7 functional tabs (BPE, Tokens, Embeddings, Attention, Vocab, Raw, Context Budget) and switching tabs renders the correct component
  2. All interactive elements have ARIA labels, contrast ratios meet 4.5:1 minimum, and the UI is fully keyboard-navigable
  3. BPEAnimation respects `prefers-reduced-motion` by disabling animations
  4. No component file exceeds 300 lines; shared logic is extracted into utils/hooks; no inline hex colors appear in component files
**Plans**: TBD

Plans:
- [ ] 05-01: TBD
- [ ] 05-02: TBD

### Phase 6: TypeScript Strict & Error Handling
**Goal**: The codebase meets production-grade TypeScript and error handling standards
**Depends on**: Phase 5
**Requirements**: QUAL-01, QUAL-02
**Success Criteria** (what must be TRUE):
  1. `tsconfig.json` has `strict: true` and `tsc --noEmit` passes with zero errors and zero `any` types in the codebase
  2. All frontend async operations display user-facing error messages via Zustand error state (not silent failures)
  3. All explicit return types are present on exported functions and component props are fully typed
**Plans**: TBD

Plans:
- [ ] 06-01: TBD

### Phase 7: DevOps & Containerization
**Goal**: The application runs in Docker containers with automated CI checks
**Depends on**: Phase 1 (backend tests must pass for CI)
**Requirements**: DEVP-01, DEVP-02, DEVP-03, DEVP-04
**Success Criteria** (what must be TRUE):
  1. `docker build` succeeds for both backend (python:3.11-slim) and frontend (multi-stage node:18-alpine -> nginx:alpine) Dockerfiles
  2. `docker compose up` starts both services on a named network with a model-cache volume, and the frontend proxies to the backend
  3. The GitHub Actions CI workflow runs backend pytest and frontend tsc/build checks on push and PR to main
  4. Both containers run as non-root users and the backend container has a healthcheck
**Plans**: TBD

Plans:
- [ ] 07-01: TBD
- [ ] 07-02: TBD

### Phase 8: Documentation
**Goal**: The project is portfolio-ready with comprehensive documentation reflecting the actual built state
**Depends on**: Phase 6 (all features complete)
**Requirements**: DOCS-01, DOCS-02
**Success Criteria** (what must be TRUE):
  1. The README includes badges, a feature list, a Mermaid architecture diagram, API endpoint documentation, a "How It Works" section, and known limitations
  2. The architecture document reflects the actual post-implementation state (not the pre-build plan)
**Plans**: TBD

Plans:
- [ ] 08-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8
(Phase 7 can execute in parallel with Phases 3-6 since it depends only on Phase 1)

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Backend Fixes & Hardening | 1/2 | In progress | - |
| 2. Backend New Features | 0/TBD | Not started | - |
| 3. Frontend Data Layer | 0/TBD | Not started | - |
| 4. Visualization Components | 0/TBD | Not started | - |
| 5. App Assembly & Accessibility | 0/TBD | Not started | - |
| 6. TypeScript Strict & Error Handling | 0/TBD | Not started | - |
| 7. DevOps & Containerization | 0/TBD | Not started | - |
| 8. Documentation | 0/TBD | Not started | - |

---
*Roadmap created: 2026-03-09*
*Last updated: 2026-03-09 (01-01 complete)*
