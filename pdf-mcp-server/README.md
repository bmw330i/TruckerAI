# pdf-mcp-server

Normalize load-tender PDFs (rate confirmations, load offers) into a canonical JSON shape consumable by ops/finops tooling.

## Features
- Parse PDFs to text + metadata (`parse_pdf`)
- Extract normalized load attributes (`extract_load_data`)
- Extensible mappings per broker/shipper (planned)

## Install
```
npm install
npm run start
```

## MCP Tools
- parse_pdf
  - input: `{ path?: string, base64?: string }`
  - output: `{ text: string, pages: string[], metadata: { pageCount?: number, fileName?: string } }`
- extract_load_data
  - input: `{ text?: string, path?: string, mappingProfileName?: string }`
  - output: `{ load: LoadOffer }`

`LoadOffer` (subset):
```
{
  "load_id": "RC-12345",
  "equipment": "dry-van",
  "pickup": { "date": "2025-11-18", "location": { "city": "Vacaville", "state": "CA" } },
  "delivery": { "date": "2025-11-19", "location": { "city": "Reno", "state": "NV" } },
  "miles": 200,
  "linehaul_usd": 850
}
```

## Configuration
- `mappings/` directory (optional) for counterparty-specific overrides.
- `ENV`: none required for basic parsing.

## Notes
- OCR is not included. For scanned PDFs, consider integrating tesseract in a later iteration.
- This server currently provides scaffolding with placeholder handlers.
