# 🧠 LLM Tokenizer Visualizer

An interactive, production-quality web application that demonstrates how Large Language Models tokenize text using **real** BPE (Byte Pair Encoding) algorithms from HuggingFace Transformers.

![Project Status](https://img.shields.io/badge/status-in%20development-yellow)
![Backend](https://img.shields.io/badge/backend-FastAPI-009688)
![Frontend](https://img.shields.io/badge/frontend-React%2018-61DAFB)
![Python](https://img.shields.io/badge/python-3.11%2B-blue)
![TypeScript](https://img.shields.io/badge/typescript-5.2%2B-blue)

---

## 🎯 Project Overview

This is a **FAANG-level** educational tool that visualizes how GPT-2 and BERT tokenize text. Unlike approximations, this uses the **actual** HuggingFace tokenizers and models to provide accurate, verifiable results.

### Key Features

- ✅ **Real Tokenization**: Uses `GPT2Tokenizer` and `BertTokenizer` from HuggingFace
- ✅ **Accurate Token IDs**: "Hello world" → `[15496, 995]` (verifiable against GPT-2 spec)
- ✅ **Real Embeddings**: Extracts actual 768-dim vectors from `GPT2Model.wte`
- ✅ **Interactive Visualization**: Click tokens to highlight all instances
- ✅ **BPE Step-by-Step**: Educational visualization of merge process
- ✅ **Type Safety**: Strict TypeScript + Pydantic validation
- ✅ **Production Ready**: Proper error handling, loading states, CORS configuration

---

## 🏗️ Architecture

```mermaid
graph LR
    A[React Frontend<br/>TypeScript + Vite] -->|HTTP POST /api/tokenize| B[FastAPI Backend<br/>Python 3.11+]
    B --> C[HuggingFace<br/>Transformers]
    C --> D[GPT-2 Tokenizer]
    C --> E[BERT Tokenizer]
    C --> F[GPT-2 Model<br/>Embeddings]
    B -->|JSON Response| A
    
    style A fill:#61DAFB
    style B fill:#009688
    style C fill:#FFD43B
    style D fill:#7c6af5
    style E fill:#7c6af5
    style F fill:#7c6af5
```

### Tech Stack

**Backend:**

- Python 3.11+ with FastAPI & Uvicorn
- HuggingFace Transformers (GPT-2, BERT)
- PyTorch for embedding extraction
- Pydantic for strict type validation
- Pytest for testing

**Frontend:**

- React 18 + TypeScript + Vite
- Zustand for state management
- Tailwind CSS for styling
- Recharts for data visualization
- Axios for API communication
- Lucide React for icons

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.11+** (check with `python --version`)
- **Node.js 18+** (check with `node --version`)
- **npm** or **yarn**

### Backend Setup

```bash
# Navigate to backend directory
cd tokenizer-visualizer/backend

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload

# Server will start on http://localhost:8000
```

**Note**: First run will download ~500MB of model weights from HuggingFace.

### Frontend Setup

```bash
# Navigate to frontend directory
cd tokenizer-visualizer/frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Frontend will start on http://localhost:5173
```

### Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

---

## 📡 API Documentation

### Base URL

```
http://localhost:8000
```

### Endpoints

#### 1. Health Check

```bash
GET /health
```

**Response:**

```json
{
  "status": "ok"
}
```

#### 2. List Available Models

```bash
GET /models
```

**Response:**

```json
{
  "models": ["gpt2", "bert-base-uncased"]
}
```

#### 3. Tokenize Text

```bash
POST /api/tokenize
Content-Type: application/json
```

**Request Body:**

```json
{
  "text": "Hello world",
  "model": "gpt2",
  "include_embeddings": true,
  "include_bpe_steps": true
}
```

**Response:**

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

### cURL Examples

**Tokenize with GPT-2:**

```bash
curl -X POST http://localhost:8000/api/tokenize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "The quick brown fox",
    "model": "gpt2",
    "include_embeddings": true,
    "include_bpe_steps": true
  }'
```

**Tokenize with BERT:**

```bash
curl -X POST http://localhost:8000/api/tokenize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "The quick brown fox",
    "model": "bert-base-uncased",
    "include_embeddings": false,
    "include_bpe_steps": false
  }'
```

---

## 🎨 Features

### 1. Token Visualization

- **Colored Pills**: Each token displayed as a colored pill with consistent colors per token ID
- **Interactive**: Click any token to highlight all instances
- **Metadata**: Hover to see token text, ID, type, frequency, and position
- **Type Badges**: Visual indicators for word, subword, punctuation, and special tokens

### 2. Statistics Bar

- Total tokens count
- Unique tokens count
- Token reuse rate
- Vocabulary size
- Processing time

### 3. Raw Sequence View

- Display raw token IDs as JSON array
- Copy to clipboard functionality
- Useful for debugging and verification

### 4. BPE Animation (Planned)

- Step-by-step visualization of BPE merge process
- Play/pause/step controls
- Speed adjustment
- Educational tool for understanding tokenization

### 5. Embedding Visualization (Planned)

- Bar chart of first 16 dimensions
- Top 6 tokens by frequency
- Positive/negative value color coding

### 6. Attention Heatmap (Planned)

- Simulated attention scores
- n×n grid visualization
- Interactive tooltips

---

## 🧪 Testing

### Backend Tests

```bash
cd tokenizer-visualizer/backend
pytest tests/ -v
```

**Test Coverage:**

- Health endpoint verification
- "Hello world" → `[15496, 995]` token ID verification
- Subword detection
- Frequency counting accuracy
- Validation error handling (empty string, >2000 chars)

### Frontend Tests (Planned)

```bash
cd tokenizer-visualizer/frontend
npm run test
```

---

## 📊 Accuracy Verification

This project uses **real** tokenizers, not approximations. Here are verifiable test cases:

| Input | Model | Expected Token IDs | Status |
|-------|-------|-------------------|--------|
| "Hello world" | GPT-2 | `[15496, 995]` | ✅ Verified |
| "The quick brown fox" | GPT-2 | `[464, 2068, 7586, 21831]` | ✅ Verified |
| "tokenization" | GPT-2 | `[30001, 1634]` (token + ization) | ✅ Verified |

**Vocab Size:**

- GPT-2: 50,257 tokens
- BERT: 30,522 tokens

---

## 🎓 How It Works

### 1. Text Input

User enters text (max 2000 characters) and selects a model (GPT-2 or BERT).

### 2. Tokenization

Backend uses HuggingFace's `GPT2Tokenizer.encode()` to convert text into token IDs.

### 3. Token Analysis

- Detects token types (word, subword, punctuation, special)
- Calculates frequency of each token ID
- Assigns consistent color indices

### 4. Embedding Extraction (Optional)

- Loads `GPT2Model` from HuggingFace
- Extracts embeddings from `model.transformer.wte` (word token embeddings)
- Returns first 16 dimensions of 768-dim vectors

### 5. BPE Simulation (Optional)

- Simulates the BPE merge process for educational purposes
- Shows step-by-step how character pairs are merged

### 6. Visualization

- Frontend displays tokens as interactive colored pills
- Shows statistics, raw IDs, and optional visualizations

---

## ⚙️ Configuration

### Backend Configuration

Edit [`backend/config.py`](backend/config.py):

```python
class Settings(BaseSettings):
    cors_origins: list = [
        "http://localhost:5173",  # Vite dev server
        "http://127.0.0.1:5173"
    ]
    supported_models: list = ["gpt2", "bert-base-uncased"]
```

### Frontend Configuration

Edit [`frontend/vite.config.ts`](frontend/vite.config.ts):

```typescript
export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
```

---

## 🚧 Known Limitations

### By Design

1. **Attention is Simulated**
   - Real GPT-2 has 12 heads × 12 layers
   - We show simplified 1-head attention for educational purposes
   - Clearly labeled in UI

2. **Embeddings are Layer-0 Only**
   - We extract from `wte` (word token embeddings)
   - Real GPT-2 transforms these through 12 layers
   - Final embeddings would be context-dependent

3. **BPE Steps are Educational Approximation**
   - We simulate the merge process for visualization
   - Real tokenizer uses pre-computed merge table
   - Good enough for understanding the concept

4. **Text Length Limited to 2000 Characters**
   - Performance constraint
   - Prevents abuse and timeout issues
   - Reasonable for educational tool

5. **CPU-Only Embeddings**
   - No GPU required
   - Slower than GPU but acceptable for demo
   - Target: <500ms response time

---

## 🐛 Troubleshooting

### Backend Issues

**Issue**: `ModuleNotFoundError: No module named 'transformers'`

```bash
pip install -r requirements.txt
```

**Issue**: Model download fails

```bash
# Pre-download models
python -c "from transformers import GPT2Tokenizer, GPT2Model; GPT2Tokenizer.from_pretrained('gpt2'); GPT2Model.from_pretrained('gpt2')"
```

**Issue**: Port 8000 already in use

```bash
# Use different port
uvicorn main:app --reload --port 8001
```

### Frontend Issues

**Issue**: `Cannot find module 'react'`

```bash
npm install
```

**Issue**: API connection refused

- Check backend is running on port 8000
- Check Vite proxy configuration in `vite.config.ts`
- Check CORS settings in `backend/config.py`

**Issue**: TypeScript errors

- Run `npm install` to install dependencies
- Restart VS Code TypeScript server

---

## 📈 Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| Backend cold start | < 8 seconds | ✅ |
| Tokenize endpoint | < 200ms for <500 tokens | ✅ |
| Embedding endpoint | < 500ms (CPU) | ✅ |
| Frontend initial load | < 2 seconds | ⏳ |
| Memory leak prevention | Model loaded once, reused | ✅ |

---

## 🗂️ Project Structure

```
tokenizer-visualizer/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── tokenizer.py         # Core tokenization logic
│   ├── embeddings.py        # Embedding extraction
│   ├── models.py            # Pydantic schemas
│   ├── config.py            # Settings
│   ├── requirements.txt     # Python dependencies
│   ├── __init__.py          # Package init
│   └── tests/
│       ├── __init__.py
│       └── test_tokenizer.py
├── frontend/
│   ├── src/
│   │   ├── main.tsx         # React entry point
│   │   ├── App.tsx          # Main app component
│   │   ├── main.css         # Tailwind CSS
│   │   ├── types/
│   │   │   └── index.ts     # TypeScript types
│   │   ├── api/
│   │   │   └── tokenizer.ts # API client
│   │   ├── store/
│   │   │   └── tokenizerStore.ts # Zustand state
│   │   └── components/
│   │       ├── StatsBar.tsx
│   │       ├── TokenDisplay.tsx
│   │       ├── RawSequence.tsx
│   │       ├── VocabTable.tsx (planned)
│   │       ├── EmbeddingChart.tsx (planned)
│   │       ├── AttentionHeatmap.tsx (planned)
│   │       └── BPEAnimation.tsx (planned)
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   └── package.json
├── plans/
│   ├── tokenizer-visualizer-architecture.md
│   ├── implementation-roadmap.md
│   └── quick-reference.md
└── README.md (this file)
```

---

## 🛠️ Development

### Adding a New Model

1. **Backend**: Add model to `config.py`:

```python
supported_models: list = ["gpt2", "bert-base-uncased", "your-model"]
```

1. **Backend**: Update `tokenizer.py` to handle new model

2. **Frontend**: Update type in `types/index.ts`:

```typescript
model: 'gpt2' | 'bert-base-uncased' | 'your-model'
```

1. **Frontend**: Add option to model selector in `App.tsx`

### Running in Production

**Backend:**

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

**Frontend:**

```bash
npm run build
npm run preview
```

---

## 📝 License

This project is for educational purposes. Model weights are from HuggingFace and subject to their respective licenses.

---

## 🙏 Acknowledgments

- **HuggingFace** for Transformers library and pre-trained models
- **OpenAI** for GPT-2 architecture and tokenizer
- **Google** for BERT architecture and tokenizer
- **FastAPI** for excellent Python web framework
- **React** and **Vite** for modern frontend development

---

## 📧 Contact & Support

For issues, questions, or contributions, please open an issue on the project repository.

---

## 🎯 Roadmap

### Current Status (v0.1)

- ✅ Backend tokenization with GPT-2 and BERT
- ✅ Real embedding extraction
- ✅ Frontend basic UI with token visualization
- ✅ Stats bar and raw sequence view
- ✅ Comprehensive documentation

### Planned Features (v0.2)

- ⏳ BPE step-by-step animation
- ⏳ Embedding bar chart visualization
- ⏳ Attention heatmap (simulated)
- ⏳ Vocabulary table with sorting
- ⏳ Export data as JSON
- ⏳ Dark/light theme toggle

### Future Enhancements (v1.0)

- 🔮 Support for more models (Llama, Claude, etc.)
- 🔮 Batch tokenization
- 🔮 Token comparison between models
- 🔮 Performance benchmarking
- 🔮 Docker containerization
- 🔮 Cloud deployment guide

---

**Built with ❤️ for the AI/ML community**
