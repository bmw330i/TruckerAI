# db-mcp-server

Persist normalized JSON documents for trucking load data. Initially uses file-based storage for simplicity.

## Features
- Create logical databases/collections
- Insert/Upsert, Get, Find, Delete documents
- Minimal schema validation with Zod (optional)

## Install
```
npm install
npm run start
```

## MCP Tools
- create_db
  - input: `{ name: string }`
  - output: `{ ok: true }`
- put_document
  - input: `{ db: string, collection: string, id?: string, doc: object }`
  - output: `{ id: string }`
- get_document
  - input: `{ db: string, collection: string, id: string }`
  - output: `{ doc: object | null }`
- find_documents
  - input: `{ db: string, collection: string, filter?: object, limit?: number, offset?: number }`
  - output: `{ docs: object[] }`
- delete_document
  - input: `{ db: string, collection: string, id: string }`
  - output: `{ ok: boolean }`
- stats
  - input: `{ db: string }`
  - output: `{ db: string, collections: number, documents: number }`

## Configuration
- Uses `./data/<db>/<collection>/<id>.json` by default.
- `ENV`: `DB_ROOT` to override root path.

## Notes
- Back-pressure and concurrency are simplified for a single-user workflow.
- Future: Python TinyDB adapter (optional) and SQLite/SQLite WASM for more robust indexing.
