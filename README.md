# TruckerAI

Three MCP servers to support a trucking workflow for spot market load management (inspired by Winters, CA hub near Sacramento/I-5/I-80):
- `pdf-mcp-server`: Parse load PDFs and normalize to JSON (`LoadOffer`) using Python (pdfplumber).
- `db-mcp-server`: Persist and query JSON documents (file-backed store initially).
- `finops-mcp-server`: Score loads for accept/counter/reject using NorCal policy, including profit calc, HOS simulation, and bidding estimates.

## New Features from Grok Suggestion
- **PDF Extraction**: Now uses Python script with pdfplumber for robust text extraction and heuristic field parsing (load ID, rates, locations, etc.).
- **Detailed Scoring**: Profit threshold ($1.50/mile), HOS compliance simulation, geocoords for routing stubs.
- **Bidding Logic**: Estimate competitive bids based on market buffers.
- **Sample PDFs**: Directory with links to real broker PDFs for testing (download manually).
- **Region Focus**: Updated to Winters, CA; policy includes CARB reefer rules, winter chains, I-5/I-80 lanes.
- **Future**: Conversational interface MCP server for natural language queries (e.g., "Top 5 loads to LA").

## Prerequisites
- Node.js 18+ and npm
- Python 3.11+ (venv already created here: `.venv`)

## Quickstart
```bash
# 1) (Optional) Activate Python venv (already created)
source .venv/bin/activate  # macOS/Linux

# 2) Install Node dependencies (per server)
npm run install:all  # Via VS Code task

# 3) Run each scaffold (they print a startup message)
npm run start:pdf
npm run start:db
npm run start:finops
```

## VS Code Tasks
Use Command Palette → "Tasks: Run Task" and pick from:
- `npm install pdf-mcp-server`
- `npm install db-mcp-server`
- `npm install finops-mcp-server`
- `npm install (all)`
- `git: init and push origin (force)` — sets remote and force-pushes local `main` to GitHub

## Force-Push to GitHub (manual)
If you prefer the terminal directly:
```bash
cd /Users/david/Documents/TruckerAI

git init
git checkout -B main
# Ensure remote matches your repo
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/bmw330i/TruckerAI

git add .
git commit -m "Enhanced: Python PDF extraction, detailed finops scoring (profit/HOS), sample PDFs, Winters CA focus"
# Force-push so origin exactly matches local main
git push -u origin +main
```

## Testing with Sample PDFs
1. Download PDFs from `sample-pdfs/README.md` into `sample-pdfs/`.
2. Run `pdf-mcp-server` and call `extract_load_data` with a PDF path.
3. Pipe output to `db-mcp-server` to store, then to `finops-mcp-server` for scoring.

## Notes
- These servers are scaffolds; MCP SDK wiring and full handlers are next steps.
- `db-mcp-server` stores docs in `./data/<db>/<collection>/<id>.json` by default.
- `finops-mcp-server/policy.json` includes profit thresholds, HOS rules, bidding buffers.
- For routing optimization, integrate OR-Tools in Python agents later.