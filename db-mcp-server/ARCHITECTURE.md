# db-mcp-server — Architecture

Purpose: Persist and query normalized JSON load documents for downstream analytics and decisioning. Starts with a file-backed JSON store; allows swapping to a Python-backed lightweight DB in future iterations.

## Capabilities (MCP Tools)
- create_db: Initialize a logical database/collection.
- put_document: Insert or upsert a JSON document by key.
- get_document: Retrieve a JSON document by key.
- find_documents: Filter documents by simple criteria (field equality/range).
- delete_document: Remove a document by key.
- stats: Basic counts and storage stats.

## Storage Backends
- v0: File-based JSON store via Node (low-dependency approach). One folder per collection, one file per doc.
- Future: Optional Python TinyDB adapter (kept in `python/`), invoked via subprocess or IPC.

## Document Keys
- Default key: `load_id` for LoadOffer documents; clients may provide custom `id`.

## Files & Structure
- index.mjs: MCP server startup, tool registration, and handlers (stubs now)
- mcp.json: Client launch config for MCP
- data/: Default root for collections (created on demand)
- package.json: Node module metadata and deps
- README.md: Usage and examples

## Validation
- Zod-based optional schema checks for known document types (e.g., LoadOffer).

