// pdf-mcp-server (scaffold)
// NOTE: This is a lightweight scaffold. Handlers are placeholders.

// Future: import { Server } from '@modelcontextprotocol/sdk/server';
// Future: import { StdioServerTransport } from '@modelcontextprotocol/sdk/stdio-transport';

// Placeholder tool handlers (to be implemented)
async function parsePdfTool(input) {
  return {
    text: "",
    pages: [],
    metadata: { pageCount: 0, fileName: input?.path || "" }
  };
}

async function extractLoadDataTool(input) {
  return {
    load: {
      load_id: null,
      equipment: null,
      pickup: { date: null, location: { city: null, state: null } },
      delivery: { date: null, location: { city: null, state: null } },
      linehaul_usd: null
    }
  };
}

// Minimal process binding so clients know it launched
if (process.argv[1] && process.argv[1].includes('index.mjs')) {
  console.log("pdf-mcp-server scaffold started (tools not wired to MCP yet)");
}

export const tools = {
  parse_pdf: parsePdfTool,
  extract_load_data: extractLoadDataTool
};
