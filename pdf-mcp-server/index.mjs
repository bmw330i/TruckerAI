// pdf-mcp-server (updated scaffold)
// Now uses Python script for PDF extraction via subprocess.

import { spawn } from 'child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

const PYTHON_VENV = path.join(process.cwd(), '..', '..', '.venv', 'bin', 'python');
const EXTRACT_SCRIPT = path.join(process.cwd(), 'extract_pdf.py');

// Placeholder tool handlers (to be implemented)
async function parsePdfTool(input) {
  const pdfPath = input?.path;
  if (!pdfPath) return { error: "No PDF path provided" };

  try {
    await fs.access(pdfPath); // Check if file exists
  } catch {
    return { error: "PDF file not found" };
  }

  return new Promise((resolve) => {
    const python = spawn(PYTHON_VENV, [EXTRACT_SCRIPT, pdfPath], { stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';

    python.stdout.on('data', (data) => stdout += data.toString());
    python.stderr.on('data', (data) => stderr += data.toString());

    python.on('close', (code) => {
      if (code !== 0) {
        resolve({ error: `Python script failed: ${stderr}` });
      } else {
        try {
          const result = JSON.parse(stdout);
          resolve(result);
        } catch (e) {
          resolve({ error: `JSON parse error: ${e.message}` });
        }
      }
    });
  });
}

async function extractLoadDataTool(input) {
  const pdfPath = input?.path;
  if (!pdfPath) return { error: "No PDF path provided" };

  const result = await parsePdfTool({ path: pdfPath });
  if (result.error) return { error: result.error };

  return { load: result };
}

// Minimal process binding so clients know it launched
if (process.argv[1] && process.argv[1].includes('index.mjs')) {
  console.log("pdf-mcp-server scaffold started (tools not wired to MCP yet)");
}

export const tools = {
  parse_pdf: parsePdfTool,
  extract_load_data: extractLoadDataTool
};
