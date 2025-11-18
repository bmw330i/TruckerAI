// db-mcp-server (scaffold)
// NOTE: Lightweight scaffolding with placeholder handlers.
import fs from 'node:fs/promises';
import path from 'node:path';

const DB_ROOT = process.env.DB_ROOT || path.join(process.cwd(), 'data');

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function createDbTool(input) {
  const dbPath = path.join(DB_ROOT, input?.name || 'default');
  await ensureDir(dbPath);
  return { ok: true };
}

async function putDocumentTool(input) {
  const db = input?.db || 'default';
  const collection = input?.collection || 'loads';
  const id = input?.id || input?.doc?.load_id || crypto.randomUUID();
  const dir = path.join(DB_ROOT, db, collection);
  await ensureDir(dir);
  const file = path.join(dir, `${id}.json`);
  await fs.writeFile(file, JSON.stringify(input?.doc ?? {}, null, 2), 'utf8');
  return { id };
}

async function getDocumentTool(input) {
  try {
    const file = path.join(DB_ROOT, input.db, input.collection, `${input.id}.json`);
    const raw = await fs.readFile(file, 'utf8');
    return { doc: JSON.parse(raw) };
  } catch {
    return { doc: null };
  }
}

async function findDocumentsTool(input) {
  const db = input?.db || 'default';
  const collection = input?.collection || 'loads';
  const dir = path.join(DB_ROOT, db, collection);
  let docs = [];
  try {
    const entries = await fs.readdir(dir);
    for (const f of entries) {
      if (!f.endsWith('.json')) continue;
      const raw = await fs.readFile(path.join(dir, f), 'utf8');
      docs.push(JSON.parse(raw));
    }
  } catch {}
  return { docs };
}

async function deleteDocumentTool(input) {
  try {
    const file = path.join(DB_ROOT, input.db, input.collection, `${input.id}.json`);
    await fs.unlink(file);
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

async function statsTool(input) {
  const db = input?.db || 'default';
  const dbPath = path.join(DB_ROOT, db);
  let collections = 0;
  let documents = 0;
  try {
    const cols = await fs.readdir(dbPath);
    collections = cols.length;
    for (const c of cols) {
      const dir = path.join(dbPath, c);
      const files = await fs.readdir(dir);
      documents += files.filter(f => f.endsWith('.json')).length;
    }
  } catch {}
  return { db, collections, documents };
}

if (process.argv[1] && process.argv[1].includes('index.mjs')) {
  console.log("db-mcp-server scaffold started (tools not wired to MCP yet)");
}

export const tools = {
  create_db: createDbTool,
  put_document: putDocumentTool,
  get_document: getDocumentTool,
  find_documents: findDocumentsTool,
  delete_document: deleteDocumentTool,
  stats: statsTool
};
