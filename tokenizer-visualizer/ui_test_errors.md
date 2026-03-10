# UI & Integration Test Results

**Date Validated**: 2026-03-09
**Status**: 1 Critical Regression Found

## 1. Core Tokenizer Views

* **GPT-2**: ✅ PASS. Normal sentences and empty strings break down perfectly into correct BPE sub-words.
* **BERT Base**: ✅ PASS. Successfully handles edge cases and specific tags.

## 2. Advanced Visualizations

* **Attention Heatmap**: ✅ PASS. Successfully fetched real layer-6 tensors via `/api/attention`.
* **BPE Steps / Animations**: ✅ PASS. Simulation plays smoothly.
* **Context Budget / Vocab Table / Embeddings**: ✅ PASS. All charts render and data maps correctly.
* **Compare Mode Side-by-Side**: ✅ PASS. Split views properly compute intersection and efficiency arrays.

## 3. Discovered Errors & Bugs (Critical)

### 🚨 GPT-4 (tiktoken) Backend Crash

**Description**: When selecting `GPT-4 (tiktoken)` as the model and attempting to tokenize any sequence, a `500 Internal Server Error` is thrown.
**Backend Output**: `Model Processing Error: 'Encoding' object has no attribute 'vocab_size'`
**Root Cause Hypothesis**: The `tiktoken` library does not use `.vocab_size`. It uses `.n_vocab`. The `tokenizer.py` service tries to dynamically read `.vocab_size` for all models uniformly, which fails when hitting the `tiktoken` class.

## Action Plan

* [x] Fix `tokenizer.py` GPT-4 vocab retrieval (`.n_vocab` or hardcode `100277`).
