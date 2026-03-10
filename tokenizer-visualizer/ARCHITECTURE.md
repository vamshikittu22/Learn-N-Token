# Learn'N'Token: Technical Architecture

This document describes the high-level architecture of the **Learn'N'Token** visualizer, covering the flow of data from user input to the "Kid-Friendly / Cyberpunk" interactive visualizations.

## Overview

The application follows a classic **FastAPI (Backend) + React (Frontend)** decoupled architecture.

- **Frontend**: A high-performance React application using **Vite** for sub-second hot reloading.
- **Backend**: A Python-based **FastAPI** service that encapsulates real NLP heavy-lifting via HuggingFace and tiktoken.

---

## 🏗️ System Components

### 1. Frontend Architecture (React)

Located in `/frontend`, the UI is built as a single-page application (SPA).

- **State Management**: Uses `Zustand`. The `tokenizerStore` acts as the single source of truth for user input, selected models, and the resulting token metadata.
- **Visual Components**:
  - `PipelineDiagram.tsx`: Shows the end-to-end data transformation.
  - `TokenDisplay.tsx`: Renders tokens as **3D LEGO bricks** using complex CSS 3D transforms.
  - `AttentionHeatmap.tsx`: Visualizes neural attention as a **Circular Graph** using SVG.
  - `EmbeddingChart.tsx`: A **Sci-Fi Radar Map** plotting 2D projections of high-dimensional vectors.
  - `BPEAnimation.tsx`: A "Puzzle Forge" animation for Byte-Pair Encoding merges.
  - `TokenBudgetPanel.tsx`: Models context window limits as **Battery Cells** filled with liquid charge.

### 2. Backend Architecture (Python)

Located in `/backend`, the service handles tokenization and vector mathematics.

- **Main API (`main.py`)**: Entry point defining REST endpoints (`/api/tokenize`, `/api/attention`, `/api/compare`).
- **Tokenizer Service (`tokenizer.py`)**:
  - Loads real weights for `GPT-2`, `BERT`, and `cl100k_base` (GPT-4).
  - Implements the logic to track BPE merge steps for visualization.
- **Embedding Service (`embeddings.py`)**: Extracts the weight vectors for specific token IDs from the model's embedding matrix.
- **Attention Service (`attention.py`)**: Performs a partial forward pass through a BERT model (Layer 6) to extract real attention coefficients.

---

## 🔄 Data Lifecycle

1. **Input**: User enters text in the React textarea and selects a model (e.g., GPT-2).
2. **Request**: Frontend dispatches a `POST` request to `/api/tokenize`.
3. **HuggingFace Bridge**: The Python backend loads the specific tokenizer. It converts string characters into an integer sequence.
4. **Feature Extraction**:
    - **IDs**: Native token IDs are retrieved.
    - **BPE History**: For GPT-2, the backend reconstructs the merge tree.
    - **Vectors**: The backend looks up the 768-dimension vectors for the tokens.
5. **Response**: A nested JSON payload containing tokens, IDs, frequencies, embeddings, and context usage flows back to the UI.
6. **Hashing & Styling**:
    - The UI uses a deterministic hash on the token IDs to assign consistent neon colors.
    - CSS 3D and SVG logic render the data into "toy-like" interactive blocks.

---

## 🛠️ Technology Stack Detail

### Frontend

- **React 18**: Component-based UI.
- **Tailwind CSS**: Custom OLED/Cyberpunk design system.
- **Zustand**: Fast, lightweight state.
- **Lucide React**: Vector iconography.
- **SVG / CSS 3D**: Primary engines for kid-friendly visual effects.

### Backend

- **FastAPI**: Asynchronous web framework.
- **Transformers (HuggingFace)**: Tokenizer weights and attention extraction.
- **tiktoken**: Fast BPE tokenizer for OpenAI models.
- **Pydantic**: data validation and serialization.

---

## 🔒 Security & Performance

- **Rate Limiting**: Implemented at the API level to prevent abuse.
- **Lazy Loading**: Models are cached in memory after the first request to ensure sub-100ms response times for subsequent tokenizations.
- **Containerization**: The entire stack is orchestrated via `docker-compose.yml` for predictable deployment.
