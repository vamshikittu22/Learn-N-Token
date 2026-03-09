# Requirements: Learn'N'Token

**Defined:** 2026-03-09
**Core Value:** Users can tokenize any text with real ML models and see exactly what the model "sees" — tokens, IDs, BPE merge steps, embeddings, and attention patterns — through an interactive, visually stunning interface.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Backend Fixes (BFIX)

- [ ] **BFIX-01**: Backend tests pass — pytest.ini with pythonpath and conftest.py with sys.path insertion resolve ModuleNotFoundError
- [ ] **BFIX-02**: CORS origins configurable via CORS_ORIGINS environment variable (comma-separated), with .env.example documenting defaults
- [ ] **BFIX-03**: All exception handlers return standardized ErrorResponse Pydantic model with {error, detail, status_code}
- [ ] **BFIX-04**: /api/tokenize endpoint is rate limited to 30 requests/minute per IP using slowapi
- [ ] **BFIX-05**: Input text is sanitized — null bytes, control characters, and zero-width spaces are stripped; empty-after-sanitization returns 400

### Backend Features (BFET)

- [ ] **BFET-01**: POST /api/attention endpoint accepts {text, model} with 100-char limit, returns attention matrix from BERT layer 6 averaged across heads, using singleton model caching
- [ ] **BFET-02**: POST /api/compare endpoint accepts {text1, text2, model} and returns comparison object with token counts, shared tokens, unique tokens per text
- [ ] **BFET-03**: tiktoken/GPT-4 support — 'gpt4' model option using cl100k_base encoding, empty bpe_steps, vocab_size 100277
- [ ] **BFET-04**: Token budget calculator — TokenizeResponse includes context_window_usage dict mapping model context windows to usage percentages (gpt2:1024, gpt35:4096, gpt4:8192, gpt4_32k:32768, llama3:131072)
- [ ] **BFET-05**: OpenAPI documentation with summaries, descriptions, and tags on all endpoints; API version 0.2.0 with contact and license metadata

### Frontend Components (FCMP)

- [ ] **FCMP-01**: BPEAnimation component — animated step-by-step merge visualizer with play/pause/step controls, merge highlighting, useRef for animation interval
- [ ] **FCMP-02**: VocabTable component — sortable table of tokens with columns (token, ID, type, frequency), useMemo for sorting, search/filter
- [ ] **FCMP-03**: EmbeddingChart component — bar chart of embedding vector dimensions per token using Recharts, token selector
- [ ] **FCMP-04**: AttentionHeatmap component — n x n grid showing attention weights between tokens, color-scaled, fetched from /api/attention
- [ ] **FCMP-05**: TokenBudgetPanel component — context window usage visualization showing how many tokens used vs available for each model context window

### Frontend Integration (FINT)

- [ ] **FINT-01**: App.tsx expanded from 2 tabs to 7 tabs: BPE, Tokens, Embeddings, Attention, Vocab, Raw, Context Budget
- [ ] **FINT-02**: types/index.ts updated with AttentionResponse, CompareResponse, context_window_usage field, 'gpt4' model literal
- [ ] **FINT-03**: tokenizerStore.ts updated with 'gpt4' model option and attention/comparison API actions
- [ ] **FINT-04**: api/tokenizer.ts updated with getAttention() and compareTokens() API functions

### Quality & Standards (QUAL)

- [ ] **QUAL-01**: TypeScript strict mode enabled with zero `any` types and explicit return types across all frontend files
- [ ] **QUAL-02**: All async operations have error handling — Zustand error state for frontend, standardized ErrorResponse for backend
- [ ] **QUAL-03**: ARIA labels on all interactive elements, 4.5:1 contrast ratios, keyboard navigation, prefers-reduced-motion respected
- [ ] **QUAL-04**: Performance optimizations — useMemo for VocabTable sorting, useCallback for TokenDisplay click handlers, useRef for BPE animation intervals
- [ ] **QUAL-05**: No component exceeds 300 lines; utils and hooks extracted where appropriate; no inline hex colors (use Tailwind config values)

### DevOps (DEVP)

- [ ] **DEVP-01**: Backend Dockerfile — python:3.11-slim base, layer-cached pip install, healthcheck endpoint, non-root user
- [ ] **DEVP-02**: Frontend Dockerfile — multi-stage build (node:18-alpine builder, nginx:alpine runtime), optimized production build
- [ ] **DEVP-03**: docker-compose.yml with backend and frontend services, named network, model-cache volume for HuggingFace models
- [ ] **DEVP-04**: GitHub Actions CI workflow — backend pytest + frontend tsc/build checks on push/PR to main
- [ ] **DEVP-05**: Backend .env.example with CORS_ORIGINS, HOST, PORT, LOG_LEVEL, HF_HOME documented

### Documentation (DOCS)

- [ ] **DOCS-01**: tokenizer-visualizer/README.md rewritten with badges, feature list, Mermaid architecture diagram, API endpoint docs, "How It Works" section, known limitations
- [ ] **DOCS-02**: plans/tokenizer-visualizer-architecture.md updated with "Post-Implementation Architecture Notes" reflecting actual built state

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Advanced Visualizations

- **VIZ-01**: Token diff view showing character-level changes between two tokenizations side-by-side
- **VIZ-02**: 3D embedding space visualization using t-SNE or PCA projection
- **VIZ-03**: Multi-layer attention comparison (not just layer 6)

### Additional Models

- **MDL-01**: LLaMA tokenizer support
- **MDL-02**: Claude tokenizer support (if available)
- **MDL-03**: Custom tokenizer upload

### Advanced Features

- **ADV-01**: Token frequency analysis across a corpus (not just single text)
- **ADV-02**: Export visualizations as PNG/SVG
- **ADV-03**: Shareable URLs with embedded tokenization state
- **ADV-04**: Side-by-side model comparison view

## Out of Scope

| Feature | Reason |
|---------|--------|
| User authentication / accounts | Static educational app, no user data to protect |
| Database / persistence | Stateless API, no need to store tokenizations |
| Real-time collaboration | Educational tool, single-user experience |
| Mobile native app | Responsive web is sufficient |
| Cloud deployment pipeline | Local/Docker development only for portfolio |
| Horizontal scroll journey UI pattern | Mentioned in planning docs but adds unnecessary complexity |
| Light mode toggle | OLED dark theme is core to brand identity |
| Internationalization (i18n) | English-only educational content |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| BFIX-01 | Phase 1: Backend Fixes & Hardening | Pending |
| BFIX-02 | Phase 1: Backend Fixes & Hardening | Pending |
| BFIX-03 | Phase 1: Backend Fixes & Hardening | Pending |
| BFIX-04 | Phase 1: Backend Fixes & Hardening | Pending |
| BFIX-05 | Phase 1: Backend Fixes & Hardening | Pending |
| BFET-01 | Phase 2: Backend New Features | Pending |
| BFET-02 | Phase 2: Backend New Features | Pending |
| BFET-03 | Phase 2: Backend New Features | Pending |
| BFET-04 | Phase 2: Backend New Features | Pending |
| BFET-05 | Phase 2: Backend New Features | Pending |
| FCMP-01 | Phase 4: Visualization Components | Pending |
| FCMP-02 | Phase 4: Visualization Components | Pending |
| FCMP-03 | Phase 4: Visualization Components | Pending |
| FCMP-04 | Phase 4: Visualization Components | Pending |
| FCMP-05 | Phase 4: Visualization Components | Pending |
| FINT-01 | Phase 5: App Assembly & Accessibility | Pending |
| FINT-02 | Phase 3: Frontend Data Layer | Pending |
| FINT-03 | Phase 3: Frontend Data Layer | Pending |
| FINT-04 | Phase 3: Frontend Data Layer | Pending |
| QUAL-01 | Phase 6: TypeScript Strict & Error Handling | Pending |
| QUAL-02 | Phase 6: TypeScript Strict & Error Handling | Pending |
| QUAL-03 | Phase 5: App Assembly & Accessibility | Pending |
| QUAL-04 | Phase 4: Visualization Components | Pending |
| QUAL-05 | Phase 5: App Assembly & Accessibility | Pending |
| DEVP-01 | Phase 7: DevOps & Containerization | Pending |
| DEVP-02 | Phase 7: DevOps & Containerization | Pending |
| DEVP-03 | Phase 7: DevOps & Containerization | Pending |
| DEVP-04 | Phase 7: DevOps & Containerization | Pending |
| DEVP-05 | Phase 1: Backend Fixes & Hardening | Pending |
| DOCS-01 | Phase 8: Documentation | Pending |
| DOCS-02 | Phase 8: Documentation | Pending |

**Coverage:**
- v1 requirements: 31 total
- Mapped to phases: 31
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-09*
*Last updated: 2026-03-09 after roadmap creation*
