# finops-mcp-server — Architecture

Purpose: Score and recommend trucking loads for acceptance/negotiation based on financial and operational criteria, tailored for Northern California (Vacaville hub) lanes.

## Capabilities (MCP Tools)
- assess_load: Score a `LoadOffer` and return accept/hold/reject with breakdown and rationale.
- set_policy: Update scoring weights/thresholds and regional constraints.
- get_policy: Retrieve current policy.
- score_breakdown: Re-score a load and return per-factor contributions for explainability.

## Inputs
- load: `LoadOffer` JSON (from pdf-mcp-server)
- context (optional):
  - truck_home_base: { city, state, lat?, lon? }
  - equipment: type (dry-van | reefer | flatbed | power-only)
  - fuel_price_usd_per_gal?: Number (default from policy)
  - driver_hours_available?: Number
  - current_location?: { lat, lon }
  - broker_credit_score?: 0-100

## Outputs
- recommendation: "accept" | "counter" | "reject"
- score: 0-100
- factors: [{ name, weight, contribution, notes }]
- economics: { rpm, revenue, est_costs, margin, margin_pct }
- constraints: [{ name, status: "ok"|"warn"|"block", notes }]

## Scoring Model (Default Policy, Vacaville CA)
Weights (sum ≈ 1.0):
- Rate per mile (RPM): 0.30 — target by equipment and lane (e.g., DV NorCal outbound min 2.30–2.60, Reefer 2.70–3.10, seasonal).
- Deadhead: 0.15 — penalize > 50 mi; block > 120 mi unless RPM compensates.
- Transit fit (HOS/time windows): 0.15 — feasibility vs. available hours and delivery windows.
- Lane desirability/seasonality: 0.10 — favorable return lanes (e.g., I-80 corridor to NV/UT okay; SoCal returns okay; PNW mixed; AZ moderate; Midwest better if multi-stop backhaul planned).
- Risk & broker credit: 0.10 — payment terms, quick pay cost, days-to-pay, MC-age, credit.
- Operational friction: 0.10 — port/rail pickups, detention risk, appointment rigidity.
- Equipment/commodity fit: 0.05 — reefer temp ranges, flatbed tarping, special gear.
- Regulatory/tolls/mountain: 0.05 — Donner Pass chain control seasons, CARB reefer compliance, Bay Area tolls/bridge fees.

Key constraints (blocks or heavy penalties):
- HOS infeasible given windows and miles + known traffic patterns.
- Donner Pass chain requirements without equipped truck/seasonal policy.
- CARB non-compliance for reefer loads in CA.
- Extremely poor broker credit or >45 day terms without quick pay.

## Cost Model (Simplified)
- Fuel cost: `miles / mpg * fuel_price`; mpg by equipment/load (dv ~6.5, reefer ~6.0, flatbed ~6.0)
- Driver cost: `hours * driver_cost_per_hour` (policy default $32–$40/h all-in)
- Tolls/fees: lane-specific (Bay Bridge, I-80 tolls none; bridge fees for SF/Oakland access)
- Accessorial expectations: expected detention probability * rate * hours; reefer fuel adders.

## Files & Structure
- index.mjs: MCP server startup, tool registration, and handlers (stubs now)
- mcp.json: Client launch config for MCP
- policy.json: Default scoring weights, thresholds, and regional parameters
- package.json: Node module metadata and deps
- README.md: Usage and examples

