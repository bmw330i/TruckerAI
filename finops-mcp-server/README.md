# finops-mcp-server

Decision-maker for trucking load desirability. Scores loads and returns accept/counter/reject guidance with economic and operational rationale. Defaults tailored to Northern California with Vacaville as a hub.

## Features
- Score `LoadOffer` JSON with configurable policy
- Explain factor contributions and constraints
- Update and retrieve policy at runtime

## Install
```
npm install
npm run start
```

## MCP Tools
- assess_load
  - input: `{ load: LoadOffer, context?: { truck_home_base?, equipment?, fuel_price_usd_per_gal?, driver_hours_available?, current_location?, broker_credit_score? } }`
  - output: `{ recommendation: string, score: number, factors: any[], economics: any, constraints: any[] }`
- set_policy
  - input: `{ policy: object }`
  - output: `{ ok: true }`
- get_policy
  - input: `{}`
  - output: `{ policy: object }`
- score_breakdown
  - input: same as `assess_load`
  - output: detailed per-factor contributions

## Default Policy (Vacaville, CA)
- RPM floors: DV 2.30–2.60, Reefer 2.70–3.10, Flatbed 2.60–3.00; adjust seasonal
- Deadhead: warn > 50mi, reject > 120mi unless high RPM
- HOS/Windows: must be feasible (consider Bay Area traffic corridors)
- Risk: favor brokers with credit ≥ 70/100 or quick pay < 3%
- Seasonal constraints: Donner Pass winter chain periods; add risk buffer
- CARB: enforce reefer compliance

## Notes
- This server currently provides scaffolding with placeholder handlers, not the full MCP wiring.
- Policy is JSON-based for transparency and easy tuning.
