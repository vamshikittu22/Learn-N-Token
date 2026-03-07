# 🚀 Setup Guide - LLM Tokenizer Visualizer

## Prerequisites Check

Before starting, verify you have the required tools installed.

### Check Python Installation

Open PowerShell or Command Prompt and try:

```powershell
# Try these commands in order:
python --version
python3 --version
py --version
```

**Expected output**: `Python 3.11.x` or higher

If none work, you need to install Python.

### Check Node.js Installation

```powershell
node --version
npm --version
```

**Expected output**:

- Node: `v18.x.x` or higher
- npm: `9.x.x` or higher

---

## Installing Prerequisites

### Option 1: Install Python from Microsoft Store (Easiest)

1. Open Microsoft Store
2. Search for "Python 3.11" or "Python 3.12"
3. Click "Get" or "Install"
4. After installation, restart your terminal
5. Verify: `python --version`

### Option 2: Install Python from python.org

1. Go to <https://www.python.org/downloads/>
2. Download Python 3.11 or 3.12 for Windows
3. **IMPORTANT**: Check "Add Python to PATH" during installation
4. Complete the installation
5. Restart your terminal
6. Verify: `python --version`

### Option 3: Use Python Launcher (If Python is installed but not in PATH)

If Python is installed but `pip` doesn't work, try:

```powershell
py -m pip --version
```

If this works, use `py -m pip` instead of `pip` for all commands.

### Installing Node.js

1. Go to <https://nodejs.org/>
2. Download the LTS version (recommended)
3. Run the installer
4. Restart your terminal
5. Verify: `node --version` and `npm --version`

---

## Backend Setup

### Step 1: Navigate to Backend Directory

```powershell
cd tokenizer-visualizer\backend
```

### Step 2: Install Python Dependencies

Try these commands in order until one works:

**Option A: Using pip**

```powershell
pip install -r requirements.txt
```

**Option B: Using python -m pip**

```powershell
python -m pip install -r requirements.txt
```

**Option C: Using py -m pip**

```powershell
py -m pip install -r requirements.txt
```

**Option D: Using python3**

```powershell
python3 -m pip install -r requirements.txt
```

### Step 3: Verify Installation

```powershell
# Try these in order:
pip list | findstr fastapi
python -m pip list | findstr fastapi
py -m pip list | findstr fastapi
```

You should see `fastapi`, `transformers`, `torch`, etc.

### Step 4: Start Backend Server

Try these commands in order:

**Option A: Using uvicorn directly**

```powershell
uvicorn main:app --reload
```

**Option B: Using python -m**

```powershell
python -m uvicorn main:app --reload
```

**Option C: Using py -m**

```powershell
py -m uvicorn main:app --reload
```

**Expected output:**

```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
Models preloaded into memory on startup.
```

**Note**: First run will download ~500MB of model weights. This may take 5-10 minutes.

### Step 5: Test Backend

Open a new terminal and test:

```powershell
# Test health endpoint
curl http://localhost:8000/health

# Or open in browser:
# http://localhost:8000/health
```

**Expected response:**

```json
{"status":"ok"}
```

---

## Frontend Setup

### Step 1: Navigate to Frontend Directory

Open a **new terminal** (keep backend running) and:

```powershell
cd tokenizer-visualizer\frontend
```

### Step 2: Install Node Dependencies

```powershell
npm install
```

This will install all dependencies listed in `package.json`. May take 2-5 minutes.

**Expected output:**

```
added 234 packages, and audited 235 packages in 2m
```

### Step 3: Start Frontend Dev Server

```powershell
npm run dev
```

**Expected output:**

```
VITE v5.2.0  ready in 1234 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

### Step 4: Access Application

Open your browser and navigate to:

```
http://localhost:5173
```

You should see the LLM Tokenizer Visualizer interface!

---

## Troubleshooting

### Issue: "pip is not recognized"

**Solution 1**: Use Python module syntax

```powershell
python -m pip install -r requirements.txt
```

**Solution 2**: Add Python to PATH manually

1. Find Python installation directory (usually `C:\Users\YourName\AppData\Local\Programs\Python\Python311`)
2. Add to PATH:
   - Search "Environment Variables" in Windows
   - Edit "Path" variable
   - Add Python directory and `Scripts` subdirectory
3. Restart terminal

**Solution 3**: Reinstall Python with "Add to PATH" checked

### Issue: "uvicorn is not recognized"

**Solution**: Use Python module syntax

```powershell
python -m uvicorn main:app --reload
```

### Issue: "Cannot find module 'react'"

**Solution**: Install frontend dependencies

```powershell
cd tokenizer-visualizer\frontend
npm install
```

### Issue: "Port 8000 already in use"

**Solution**: Kill the process or use different port

```powershell
# Use different port
python -m uvicorn main:app --reload --port 8001

# Update frontend proxy in vite.config.ts to match
```

### Issue: "CORS error" in browser console

**Solution**:

1. Verify backend is running on port 8000
2. Check `backend/config.py` has correct CORS origins
3. Restart both backend and frontend

### Issue: Model download fails

**Solution**: Pre-download models

```powershell
cd tokenizer-visualizer\backend
python -c "from transformers import GPT2Tokenizer, GPT2Model; GPT2Tokenizer.from_pretrained('gpt2'); GPT2Model.from_pretrained('gpt2')"
```

### Issue: "ModuleNotFoundError: No module named 'transformers'"

**Solution**: Install requirements again

```powershell
cd tokenizer-visualizer\backend
python -m pip install -r requirements.txt
```

---

## Quick Start Commands (After Setup)

### Terminal 1: Backend

```powershell
cd tokenizer-visualizer\backend
python -m uvicorn main:app --reload
```

### Terminal 2: Frontend

```powershell
cd tokenizer-visualizer\frontend
npm run dev
```

### Browser

```
http://localhost:5173
```

---

## Verifying Everything Works

### 1. Backend Health Check

Open browser to: `http://localhost:8000/health`

Should see: `{"status":"ok"}`

### 2. Backend API Test

```powershell
curl -X POST http://localhost:8000/api/tokenize -H "Content-Type: application/json" -d "{\"text\": \"Hello world\", \"model\": \"gpt2\"}"
```

Should see JSON response with `"raw_ids": [15496, 995]`

### 3. Frontend Test

1. Open `http://localhost:5173`
2. Enter text: "Hello world"
3. Click "Tokenize"
4. Should see 2 colored token pills
5. Token IDs should be [15496, 995]

---

## Development Workflow

### Making Changes

**Backend changes:**

- Edit Python files in `backend/`
- Server auto-reloads (if using `--reload` flag)
- Refresh browser to see changes

**Frontend changes:**

- Edit TypeScript/React files in `frontend/src/`
- Vite auto-reloads
- Browser updates automatically

### Running Tests

**Backend tests:**

```powershell
cd tokenizer-visualizer\backend
python -m pytest tests/ -v
```

**Frontend tests (when implemented):**

```powershell
cd tokenizer-visualizer\frontend
npm run test
```

---

## Production Build

### Backend

```powershell
cd tokenizer-visualizer\backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend

```powershell
cd tokenizer-visualizer\frontend
npm run build
npm run preview
```

---

## System Requirements

### Minimum

- **OS**: Windows 10/11, macOS 10.15+, Linux
- **RAM**: 4GB (8GB recommended)
- **Disk**: 2GB free space (for models)
- **Python**: 3.11+
- **Node.js**: 18+

### Recommended

- **RAM**: 8GB+
- **CPU**: 4+ cores
- **Disk**: SSD with 5GB+ free space
- **Internet**: For initial model download

---

## Getting Help

### Check Logs

**Backend logs:**

- Look at terminal where `uvicorn` is running
- Check for error messages

**Frontend logs:**

- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for API calls

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "pip is not recognized" | Python not in PATH | Use `python -m pip` |
| "Cannot find module" | Dependencies not installed | Run `npm install` |
| "Port already in use" | Server already running | Kill process or use different port |
| "CORS error" | Backend/frontend mismatch | Check ports and CORS config |
| "Model download failed" | Network issue | Retry or pre-download models |

---

## Next Steps

After successful setup:

1. ✅ Try the sample texts (Story, Code, RAG Document)
2. ✅ Switch between GPT-2 and BERT models
3. ✅ Click tokens to highlight instances
4. ✅ Copy raw token IDs
5. ✅ Explore the stats bar

Enjoy exploring how LLMs tokenize text! 🚀
