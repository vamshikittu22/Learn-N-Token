# 🚀 Quick Reference Guide - LLM Tokenizer Visualizer

## Project Status at a Glance

```
✅ Backend Core: COMPLETE (90%)
⚠️  Backend Tests: FAILING (import issues)
❌ Frontend: NOT STARTED (0%)
❌ Documentation: NOT STARTED (0%)
```

---

## File Checklist

### Backend Files

| File | Status | Lines | Notes |
|------|--------|-------|-------|
| `backend/main.py` | ✅ Complete | 84 | FastAPI app with all endpoints |
| `backend/models.py` | ✅ Complete | 43 | Pydantic schemas |
| `backend/tokenizer.py` | ✅ Complete | 196 | Core tokenization logic |
| `backend/embeddings.py` | ✅ Complete | 52 | Embedding extraction |
| `backend/config.py` | ✅ Complete | 10 | Settings |
| `backend/requirements.txt` | ✅ Complete | 50 | All dependencies |
| `backend/tests/test_tokenizer.py` | ⚠️ Failing | 54 | Import errors |
| `backend/__init__.py` | ❌ Missing | 0 | Needed for tests |
| `backend/tests/__init__.py` | ❌ Missing | 0 | Needed for tests |

### Frontend Files

| File | Status | Lines | Priority |
|------|--------|-------|----------|
| `frontend/index.html` | ❌ Empty | 0 | HIGH |
| `frontend/vite.config.ts` | ❌ Empty | 0 | HIGH |
| `frontend/tailwind.config.ts` | ❌ Empty | 0 | HIGH |
| `frontend/postcss.config.js` | ❌ Missing | 0 | HIGH |
| `frontend/src/main.tsx` | ❌ Missing | 0 | HIGH |
| `frontend/src/main.css` | ❌ Missing | 0 | HIGH |
| `frontend/src/App.tsx` | ❌ Empty | 0 | HIGH |
| `frontend/src/types/index.ts` | ❌ Empty | 0 | HIGH |
| `frontend/src/api/tokenizer.ts` | ❌ Empty | 0 | HIGH |
| `frontend/src/store/tokenizerStore.ts` | ❌ Empty | 0 | HIGH |
| `frontend/src/components/StatsBar.tsx` | ❌ Empty | 0 | MEDIUM |
| `frontend/src/components/RawSequence.tsx` | ❌ Empty | 0 | MEDIUM |
| `frontend/src/components/TokenDisplay.tsx` | ❌ Empty | 0 | HIGH |
| `frontend/src/components/VocabTable.tsx` | ❌ Empty | 0 | MEDIUM |
| `frontend/src/components/EmbeddingChart.tsx` | ❌ Empty | 0 | MEDIUM |
| `frontend/src/components/AttentionHeatmap.tsx` | ❌ Empty | 0 | LOW |
| `frontend/src/components/BPEAnimation.tsx` | ❌ Empty | 0 | LOW |

### Documentation Files

| File | Status | Lines | Priority |
|------|--------|-------|----------|
| `README.md` | ❌ Empty | 0 | HIGH |
| `plans/tokenizer-visualizer-architecture.md` | ✅ Complete | ~800 | - |
| `plans/implementation-roadmap.md` | ✅ Complete | ~600 | - |
| `plans/quick-reference.md` | ✅ Complete | - | - |

---

## Command Cheat Sheet

### Backend Commands

```bash
# Navigate to backend
cd tokenizer-visualizer/backend

# Install dependencies
pip install -r requirements.txt

# Run tests
pytest tests/ -v

# Start server
uvicorn main:app --reload

# Start server on specific port
uvicorn main:app --reload --port 8000

# Test health endpoint
curl http://localhost:8000/health

# Test tokenize endpoint
curl -X POST http://localhost:8000/api/tokenize \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello world", "model": "gpt2"}'
```

### Frontend Commands

```bash
# Navigate to frontend
cd tokenizer-visualizer/frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test
```

### Full Stack Commands

```bash
# Terminal 1: Start backend
cd tokenizer-visualizer/backend && uvicorn main:app --reload

# Terminal 2: Start frontend
cd tokenizer-visualizer/frontend && npm run dev

# Open browser
# Navigate to http://localhost:5173
```

---

## API Endpoints Reference

### GET /health

**Description**: Health check endpoint

**Response**:

```json
{
  "status": "ok"
}
```

### GET /models

**Description**: List available tokenizer models

**Response**:

```json
{
  "models": ["gpt2", "bert-base-uncased"]
}
```

### POST /api/tokenize

**Description**: Tokenize text and return detailed information

**Request Body**:

```json
{
  "text": "Hello world",
  "model": "gpt2",
  "include_embeddings": true,
  "include_bpe_steps": true
}
```

**Response**:

```json
{
  "tokens": [
    {
      "text": "Hello",
      "display": "Hello",
      "id": 15496,
      "type": "word",
      "position": 0,
      "frequency": 1,
      "color_index": 0
    },
    {
      "text": "Ġworld",
      "display": " world",
      "id": 995,
      "type": "word",
      "position": 1,
      "frequency": 1,
      "color_index": 1
    }
  ],
  "raw_ids": [15496, 995],
  "vocab_size": 50257,
  "total_tokens": 2,
  "unique_tokens": 2,
  "reuse_rate": 0.0,
  "bpe_steps": [...],
  "embeddings": [...],
  "model_used": "gpt2",
  "processing_time_ms": 45.23
}
```

---

## Key Token IDs (GPT-2)

| Text | Token ID | Notes |
|------|----------|-------|
| "Hello" | 15496 | Capital H |
| " world" | 995 | With leading space |
| "." | 13 | Period |
| "The" | 464 | Capital T |
| " quick" | 2068 | With leading space |
| " brown" | 7586 | With leading space |
| " fox" | 21831 | With leading space |

---

## Color Palette

### Dark Theme

```css
/* Background colors */
--dark-bg: #0a0a14;
--dark-card: #0f0f1e;
--dark-border: #1a1a2e;

/* Accent colors */
--accent-primary: #7c6af5;
--accent-secondary: #9d8df7;

/* Token type colors */
--token-word: #4ade80;      /* Green */
--token-subword: #fbbf24;   /* Yellow */
--token-punctuation: #f87171; /* Red */
--token-special: #60a5fa;   /* Blue */
```

### Token Color Generation

```typescript
// Hash-based color generation for consistent token colors
const getTokenColor = (tokenId: number): string => {
  const hue = (tokenId * 137.508) % 360 // Golden angle
  return `hsl(${hue}, 70%, 60%)`
}
```

---

## Component Dependencies

```
App.tsx
├── StatsBar (no deps)
├── RawSequence (no deps)
├── TokenDisplay (needs: result, selectedTokenId, selectToken)
├── VocabTable (needs: result, selectToken)
├── EmbeddingChart (needs: result.embeddings)
├── AttentionHeatmap (needs: result.tokens)
└── BPEAnimation (needs: result.bpe_steps)
```

---

## Type Definitions Quick Reference

### TokenInfo

```typescript
interface TokenInfo {
  text: string          // Raw token e.g. "Ġquick"
  display: string       // Human-readable e.g. " quick"
  id: number           // Vocab ID e.g. 2068
  type: string         // "word" | "subword" | "punctuation" | "special"
  position: number     // Position in sequence
  frequency: number    // Count in full text
  color_index: number  // For consistent coloring
}
```

### TokenizeResponse

```typescript
interface TokenizeResponse {
  tokens: TokenInfo[]
  raw_ids: number[]
  vocab_size: number
  total_tokens: number
  unique_tokens: number
  reuse_rate: number
  bpe_steps?: BPEStep[] | null
  embeddings?: EmbeddingInfo[] | null
  model_used: string
  processing_time_ms: number
}
```

---

## Common Issues & Solutions

### Issue: Backend tests failing with ModuleNotFoundError

**Solution**:

```bash
# Option 1: Add __init__.py files
touch tokenizer-visualizer/backend/__init__.py
touch tokenizer-visualizer/backend/tests/__init__.py

# Option 2: Run tests with PYTHONPATH
cd tokenizer-visualizer/backend
PYTHONPATH=. pytest tests/ -v

# Option 3: Install as package
cd tokenizer-visualizer/backend
pip install -e .
```

### Issue: Frontend can't connect to backend

**Solution**:

1. Check backend is running on port 8000
2. Check Vite proxy configuration in `vite.config.ts`
3. Check CORS settings in `backend/config.py`

### Issue: Model download fails

**Solution**:

```bash
# Pre-download models
python -c "from transformers import GPT2Tokenizer, GPT2Model; GPT2Tokenizer.from_pretrained('gpt2'); GPT2Model.from_pretrained('gpt2')"
```

### Issue: Token IDs don't match expected values

**Solution**:

- Verify using real HuggingFace tokenizer, not custom implementation
- Check for extra spaces or special characters in input
- Verify model name is correct ("gpt2" not "gpt-2")

---

## Testing Checklist

### Backend Tests

- [ ] Health endpoint returns 200
- [ ] "Hello world" → [15496, 995]
- [ ] Subword detection works
- [ ] Frequency counting is accurate
- [ ] Empty string raises 422
- [ ] Text >2000 chars raises 422

### Frontend Tests

- [ ] Can input text
- [ ] Tokenize button triggers API call
- [ ] Loading state shows during request
- [ ] Tokens display as colored pills
- [ ] Stats bar shows correct metrics
- [ ] Raw IDs display correctly
- [ ] Error messages show on failure

### Integration Tests

- [ ] End-to-end tokenization works
- [ ] Token IDs match GPT-2 exactly
- [ ] Embeddings display correctly
- [ ] BPE animation plays
- [ ] Model switching works
- [ ] All tabs render correctly

---

## Performance Targets

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Backend cold start | < 8s | Time from `uvicorn` start to "startup complete" |
| Tokenize endpoint | < 200ms | Check `X-Process-Time` header |
| Embedding endpoint | < 500ms | Check `X-Process-Time` header |
| Frontend load | < 2s | Chrome DevTools Network tab |
| Token display render | < 100ms | React DevTools Profiler |

---

## Sample Texts for Testing

### Story

```
The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet.
```

### Code

```javascript
function tokenize(text) {
  return text.split(" ").map(word => word.toLowerCase());
}
```

### RAG Document

```
Large Language Models use tokenization to convert text into numerical representations. The most common algorithm is Byte Pair Encoding (BPE), which iteratively merges the most frequent character pairs.
```

---

## Git Workflow (If Using Version Control)

```bash
# Create feature branch
git checkout -b feature/frontend-implementation

# Commit frequently
git add .
git commit -m "feat: implement TypeScript types"

# Push to remote
git push origin feature/frontend-implementation

# Create pull request
# Review and merge
```

---

## Deployment Checklist (Future)

- [ ] Backend: Containerize with Docker
- [ ] Backend: Set up environment variables
- [ ] Backend: Configure production CORS
- [ ] Frontend: Build production bundle
- [ ] Frontend: Configure API base URL
- [ ] Frontend: Optimize bundle size
- [ ] Deploy backend to cloud (AWS/GCP/Azure)
- [ ] Deploy frontend to CDN (Vercel/Netlify)
- [ ] Set up monitoring and logging
- [ ] Configure CI/CD pipeline

---

## Resources

### Documentation

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [HuggingFace Transformers](https://huggingface.co/docs/transformers)
- [React Docs](https://react.dev/)
- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [Recharts Docs](https://recharts.org/)
- [Tailwind CSS Docs](https://tailwindcss.com/)

### Tools

- [GPT-2 Tokenizer Playground](https://platform.openai.com/tokenizer)
- [HuggingFace Model Hub](https://huggingface.co/models)

---

## Next Steps

1. **Immediate** (Today):
   - Fix backend test imports
   - Create frontend config files
   - Implement TypeScript types

2. **Short Term** (This Week):
   - Implement API layer and store
   - Build core UI components
   - Get basic tokenization working

3. **Medium Term** (Next Week):
   - Build advanced visualizations
   - Implement BPE animation
   - Write documentation

---

**Last Updated**: 2026-03-06  
**Project Status**: Architecture & Planning Complete, Ready for Implementation
