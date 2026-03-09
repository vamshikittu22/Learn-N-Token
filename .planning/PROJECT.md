# Learn'N'Token: LLM Tokenizer Visualizer

## What This Is

An interactive, educational full-stack web application that demystifies how Large Language Models tokenize text. Users type or paste text, select a model (GPT-2, BERT, or GPT-4/tiktoken), and instantly see the tokenization process visualized across 7 tabs: BPE animation, token pills, embedding vectors, attention heatmaps, vocabulary tables, raw ID sequences, and context budget usage. Built with a FastAPI Python backend using real HuggingFace transformers and a React + TypeScript + Vite frontend with a premium OLED Neon/Cyberpunk aesthetic. The target audience is developers and AI enthusiasts learning about tokenization, and this project serves as a FAANG-level portfolio piece.

## Core Value

Users can tokenize any text with real ML models and see exactly what the model "sees" — tokens, IDs, BPE merge steps, embeddings, and attention patterns — through an interactive, visually stunning interface.

## Requirements

### Validated

<!-- Shipped and confirmed working based on existing codebase audit. -->

- [x] Backend FastAPI server with `/health`, `/models`, `/api/tokenize` endpoints
- [x] GPT-2 and BERT-base-uncased tokenization with real HuggingFace tokenizers
- [x] Pydantic models for strict request/response validation (TokenizeRequest, TokenInfo, BPEStep, EmbeddingInfo, TokenizeResponse)
- [x] BPE merge step simulation for GPT-2 (step-by-step educational breakdown)
- [x] GPT-2 embedding extraction (first 16 of 768 dimensions)
- [x] Token type classification (word, subword, punctuation, special)
- [x] Frequency counting and color index assignment
- [x] Frontend React 18 + TypeScript + Vite setup with Tailwind CSS
- [x] Zustand state management store (tokenizerStore)
- [x] Axios API layer with error interceptors
- [x] TypeScript types mirroring backend Pydantic models
- [x] App.tsx with header, input, model selector, sample texts, 2 tabs (tokens/raw)
- [x] StatsBar component showing total tokens, unique tokens, reuse rate, vocab size, processing time
- [x] TokenDisplay component with colored token pills, click-to-highlight, hover info
- [x] RawSequence component with copy-to-clipboard
- [x] OLED Neon/Cyberpunk design system (dark theme, neon colors, glassmorphism)

### Active

<!-- Current scope: elevate to FAANG-quality portfolio piece with all 7 visualization tabs and backend hardening. -->

**Backend Fixes & Enhancements:**
- [ ] Fix pytest path resolution (pytest.ini + conftest.py)
- [ ] CORS configuration via environment variables
- [ ] Standardized ErrorResponse Pydantic model for all exception handlers
- [ ] Rate limiting with slowapi (30 req/min on /api/tokenize)
- [ ] Input sanitization (null bytes, control chars, zero-width spaces)
- [ ] Real attention endpoint (POST /api/attention) using BERT with output_attentions
- [ ] Token comparison endpoint (POST /api/compare)
- [ ] tiktoken/GPT-4 support (cl100k_base encoding as 'gpt4' model option)
- [ ] Token budget calculator (context_window_usage in TokenizeResponse)
- [ ] OpenAPI documentation (summaries, descriptions, tags, version 0.2.0)

**Frontend Components (empty files exist, need implementation):**
- [ ] BPEAnimation component — step-by-step merge visualizer with animation
- [ ] VocabTable component — sortable table with useMemo
- [ ] EmbeddingChart component — bar chart using Recharts
- [ ] AttentionHeatmap component — n*n grid visualization
- [ ] TokenBudgetPanel component — NEW, context budget display (7th tab)

**Frontend Enhancements:**
- [ ] Expand App.tsx from 2 tabs to 7 tabs (bpe, tokens, embeddings, attention, vocab, raw, context budget)
- [ ] Update types/index.ts for new response fields (attention, comparison, context_window_usage, gpt4 model)
- [ ] Update tokenizerStore.ts for new model option and API calls
- [ ] Update api/tokenizer.ts with attention and comparison endpoints

**DevOps & Quality:**
- [ ] Backend Dockerfile (python:3.11-slim)
- [ ] Frontend Dockerfile (multi-stage: node:18-alpine -> nginx:alpine)
- [ ] docker-compose.yml with named network and model-cache volume
- [ ] GitHub Actions CI workflow (.github/workflows/ci.yml)
- [ ] Backend .env.example

**Documentation:**
- [ ] Rewrite tokenizer-visualizer/README.md with badges, Mermaid diagram, API docs
- [ ] Update plans/tokenizer-visualizer-architecture.md with post-implementation notes

### Out of Scope

- Real-time collaborative editing — not needed for educational tool
- User accounts / authentication — static educational app
- Mobile native app — web-only, responsive design sufficient
- Server-side persistence / database — stateless API, no need
- Production deployment to cloud — local/Docker development only
- Additional models beyond GPT-2, BERT, GPT-4/tiktoken — three is sufficient for comparison
- Horizontal scroll journey pattern — mentioned in planning_utf8.md but unnecessary complexity

## Context

**Existing codebase state (brownfield):**
The project has a working backend (~90% complete) and partially implemented frontend (~50%). Backend serves tokenization with GPT-2 and BERT via FastAPI. Frontend has the input UI, StatsBar, TokenDisplay, and RawSequence working. Four component files exist but are empty (VocabTable, EmbeddingChart, AttentionHeatmap, BPEAnimation). The store, API layer, and types are fully implemented for current features.

**Architecture:**
- Backend: `tokenizer-visualizer/backend/` — Python 3.11+, FastAPI, HuggingFace Transformers, PyTorch, Pydantic
- Frontend: `tokenizer-visualizer/frontend/` — React 18, TypeScript, Vite, Zustand, Tailwind CSS, Recharts, Axios
- Both run locally; Vite proxies API calls to backend on port 8000

**Design system:**
- Style: OLED Neon / Cyberpunk (Dark Mode)
- Background: #020617 (near-black blue)
- Primary: #7c6af5 (purple)
- Neon accents: pink #f56a9a, green #6af5a0, yellow #f5c96a, cyan #6ac8f5, orange #f5896a
- Fonts: Fira Code (headings/monospace), Fira Sans (body)
- Token type colors: word=purple, subword=gold, punctuation=red-pink, special=light-blue, number=mint-green
- Effects: Minimal glow (text-shadow), glassmorphism inputs, hover transitions
- Anti-patterns: No light mode, no emojis-as-icons (use Lucide SVGs)

**Known issues:**
- Backend tests fail due to ModuleNotFoundError (pytest can't find `main` module)
- CORS origins are hardcoded in config.py
- No error response standardization
- No rate limiting
- No input sanitization
- Architecture doc claims "Frontend 0% complete" — outdated, ~50% exists

## Constraints

- **Tech Stack**: Python 3.11+ / FastAPI backend, React 18 / TypeScript / Vite frontend — locked
- **State Management**: Zustand — locked (already implemented)
- **Styling**: Tailwind CSS with OLED Neon/Cyberpunk theme — locked
- **Charts**: Recharts — locked (already in package.json)
- **TypeScript**: Strict mode, zero `any`, explicit return types
- **Code Quality**: Max 300 lines per component, extract utils/hooks, no inline hex colors (use Tailwind config)
- **Accessibility**: ARIA labels, 4.5:1 contrast minimum, keyboard navigation, prefers-reduced-motion
- **Performance**: useMemo for VocabTable sorting, useCallback for TokenDisplay clicks, useRef for BPE animation intervals

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use tiktoken for GPT-4 support | Lightweight, OpenAI's official tokenizer, cl100k_base encoding | -- Pending |
| Use slowapi for rate limiting | Standard FastAPI rate limiting library | -- Pending |
| BERT for attention visualization | BERT has bidirectional attention, more educational; use layer 6 averaged across heads | -- Pending |
| 7-tab UI layout | BPE, Tokens, Embeddings, Attention, Vocab, Raw, Context Budget — covers all visualization needs | -- Pending |
| Singleton model caching | Models loaded once at startup, cached in memory — critical for performance | -- Pending |
| 100-char limit on attention endpoint | Attention matrix is n*n, larger inputs would be prohibitively expensive | -- Pending |
| Docker multi-stage for frontend | Minimize image size: build with node:18-alpine, serve with nginx:alpine | -- Pending |

---
*Last updated: 2026-03-09 after initialization*
