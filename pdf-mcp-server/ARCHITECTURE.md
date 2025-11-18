# pdf-mcp-server — Architecture

Purpose: Normalize unstructured/varied load-tender PDFs (rate confirmations, load offers) into a canonical JSON document for downstream pricing, ops, and decisioning.

## Capabilities (MCP Tools)
- parse_pdf: Reads a PDF (path or base64) and returns plain text, pages, and basic metadata.
- extract_load_data: Normalizes load attributes from parsed text, returning canonical `LoadOffer` JSON.
- learn_mapping (optional, future): Creates/updates a mapping profile from a labeled example.

## Canonical Data Model (LoadOffer v0)
Minimal fields commonly present across shippers/brokers:
- load_id: String — ID, reference, or rate-conf number
- shipper: { name, mc_number?, contact? }
- broker: { name, mc_number?, contact? }
- equipment: String — dry-van | reefer | flatbed | stepdeck | power-only, etc.
- commodity: String
- weight_lbs: Number
- pallets?: Number
- hazmat?: Boolean
- temp_requirements?: { min_f, max_f }
- pickup: { date?, window_start?, window_end?, location: { name?, address?, city, state, zip }, notes? }
- delivery: { date?, window_start?, window_end?, location: { name?, address?, city, state, zip }, notes? }
- miles?: Number — contracted or estimated loaded miles
- deadhead_miles?: Number — optional downstream calculation
- linehaul_usd: Number
- fuel_surcharge_usd?: Number
- accessorials?: [{ type, amount_usd, notes? }]
- detention_terms?: { free_hours?: Number, rate_usd_per_hour?: Number, caps? }
- layover_terms?: { rate_usd_per_day?: Number }
- payment_terms?: { days?: Number, quickpay?: { available: Boolean, fee_pct?: Number } }
- notes?: String
- source: { filename?, received_at_iso?, page_count? }

A Zod schema will validate this shape in code, while being tolerant to partials.

## Extraction Approach
- Text-first parsing using Node PDF libraries for fast, dependency-light extraction.
- Rule/heuristics with:
  - Keyword proximity (e.g., "PU Date", "Pickup", "Origin")
  - Regexes for money, weights, dates, times, addresses, phone numbers
  - Table-ish grouping by line breaks
- Optional mapping profiles (YAML/JSON) per counterparty to override heuristics.

## Files & Structure
- index.mjs: MCP server startup, tool registration, and handlers (stubs now)
- mcp.json: Client launch config for MCP
- mappings/: Counterparty-specific patterns (future)
- package.json: Node module metadata and deps
- README.md: Usage and examples

## Limitations & Future Work
- OCR for scans (tesseract or AWS Textract/Google Vision) — out of scope for initial stub.
- Complex table extraction — can be added with PDF table libs.
- ML-based field classification — future enhancement; start with robust heuristics.

