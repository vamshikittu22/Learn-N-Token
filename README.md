# 🚀 Learn'N'Token: Tokenizer Visualizer

A stunning, interactive full-stack application designed to demystify how Large Language Models (LLMs) break down and process text. Featuring a premium **OLED Neon/Cyberpunk** aesthetic, Learn'N'Token allows developers and AI enthusiasts to tokenize strings in real-time, visualizing exactly what models like GPT-2 and BERT "see" under the hood.

---

## ✨ Features

- **Interactive Tokenization**: Type any text and instantly see it split into distinct tokens.
- **Support for Major LLMs**: Visualize tokenizations for `GPT-2` and `BERT-base-uncased`.
- **BPE Merge Simulation**: Step-by-step educational breakdown of the Byte-Pair Encoding (BPE) subword merging process.
- **Deep Token Insights**: Hover over and click tokens to view real-time statistics like Token ID, Subword Prefix, and Frequency across the text.
- **Raw Sequence View**: View and copy the pure array of integer Token IDs representing the exact tensor payload fed to the transformer.
- **Detailed Analytics**: Instantly see text stats including Total Tokens, Unique Tokens, Vocabulary Size, and Token Reuse Rates.
- **Sleek UI/UX Design**: Fully custom responsive React interface built with Tailwind CSS, utilizing glowing glassmorphism inputs and dynamic OLED token coloring based on the `ui-ux-pro-max` aesthetic.

---

## 🏗️ Architecture

The project is split into a cleanly separated Python Backend and a React Frontend:

- **Frontend (`/tokenizer-visualizer/frontend`)**: A fast, Vite-powered React application with TypeScript and Tailwind CSS. State management is handled smoothly via Zustand.
- **Backend (`/tokenizer-visualizer/backend`)**: A lightning-fast FastAPI Python server utilizing standard `transformers` libraries to run the models efficiently in-memory, ensuring low-latency data streams to the frontend.

---

## 🛠️ Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [Python](https://www.python.org/downloads/) (3.9+)

### 1. Setup the Backend (FastAPI)

Navigate to the backend directory and set up a Python virtual environment:

```powershell
cd tokenizer-visualizer/backend
python -m venv venv
.\venv\Scripts\activate  # On Windows
pip install -r requirements.txt
```

Launch the backend API server:

```powershell
uvicorn main:app --reload --port 8000
```

*The server will start running at `http://localhost:8000` and automatically download the tokenizer models into memory upon its first startup.*

### 2. Setup the Frontend (React + Vite)

Open a new terminal window, navigate to the frontend directory, install dependencies, and start the development server:

```powershell
cd tokenizer-visualizer/frontend
npm install
npm run dev
```

*The frontend will dynamically stream locally to `http://localhost:5174` (or 5173).*

---

## ⌨️ Usage

1. Open your browser and navigate to the local React frontend URL (e.g., `http://localhost:5174`).
2. Select your desired AI model from the dropdown (GPT-2 or BERT).
3. Type or paste your prompt into the main glowing input bar.
4. Hit **Tokenize**.
5. Explore the interactive visualizer: Click tokens to highlight their occurrences, toggle standard token pills vs. Raw ID sequence sets, and evaluate your statistics!

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! If you'd like to add a new model visualizer (like LLaMA or Claude), feel free to fork this repository, add the HuggingFace integration to the backend, and open a Pull Request!

## 📜 License

This built is open-source and free to be adapted or expanded upon for both educational and developmental purposes.
