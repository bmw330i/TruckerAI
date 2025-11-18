# TruckerAI

Three MCP servers to support a trucking workflow:
- `pdf-mcp-server`: Parse load PDFs and normalize to JSON (`LoadOffer`).
- `db-mcp-server`: Persist and query JSON documents (file-backed store initially).
- `finops-mcp-server`: Score loads for accept/counter/reject using NorCal (Vacaville) policy.

## Prerequisites
- Node.js 18+ and npm
- Python 3.11+ (venv already created here: `.venv`)

## Quickstart
```bash
# 1) (Optional) Activate Python venv (already created)
source .venv/bin/activate  # macOS/Linux

# 2) Install Node dependencies (per server)
(cd pdf-mcp-server && npm install)
(cd db-mcp-server && npm install)
(cd finops-mcp-server && npm install)

# 3) Run each scaffold (they print a startup message)
(cd pdf-mcp-server && npm start)
(cd db-mcp-server && npm start)
(cd finops-mcp-server && npm start)
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
git commit -m "Initial scaffold: MCP servers (pdf, db, finops) and env setup" || echo "Nothing to commit"
# Force-push so origin exactly matches local main
git push -u origin +main
```

## Notes
- These servers are scaffolds; MCP SDK wiring and full handlers are next steps.
- `db-mcp-server` stores docs in `./data/<db>/<collection>/<id>.json` by default.
- `finops-mcp-server/policy.json` contains tunable weights and constraints.