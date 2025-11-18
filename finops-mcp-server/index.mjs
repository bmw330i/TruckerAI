// finops-mcp-server (scaffold)
// NOTE: Lightweight scaffolding with placeholder handlers.
import fs from 'node:fs/promises';
import path from 'node:path';

const POLICY_PATH = path.join(process.cwd(), 'policy.json');

async function loadPolicy() {
  try {
    const raw = await fs.readFile(POLICY_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {
      region: 'Vacaville-CA',
      weights: { rpm: 0.3, deadhead: 0.15, transit_fit: 0.15, lane_desirability: 0.1, risk_broker: 0.1, operational_friction: 0.1, equip_fit: 0.05, regulatory: 0.05 }
    };
  }
}

async function assessLoadTool(input) {
  const policy = await loadPolicy();
  return {
    recommendation: "counter",
    score: 55,
    factors: [
      { name: "rpm", weight: policy.weights.rpm, contribution: 10, notes: "placeholder" }
    ],
    economics: { rpm: null, revenue: null, est_costs: null, margin: null, margin_pct: null },
    constraints: []
  };
}

async function setPolicyTool(input) {
  await fs.writeFile(POLICY_PATH, JSON.stringify(input?.policy ?? {}, null, 2), 'utf8');
  return { ok: true };
}

async function getPolicyTool() {
  const policy = await loadPolicy();
  return { policy };
}

async function scoreBreakdownTool(input) {
  const res = await assessLoadTool(input);
  return res;
}

if (process.argv[1] && process.argv[1].includes('index.mjs')) {
  console.log("finops-mcp-server scaffold started (tools not wired to MCP yet)");
}

export const tools = {
  assess_load: assessLoadTool,
  set_policy: setPolicyTool,
  get_policy: getPolicyTool,
  score_breakdown: scoreBreakdownTool
};
