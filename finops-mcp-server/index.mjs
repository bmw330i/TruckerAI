// finops-mcp-server (updated scaffold)
// Added detailed scoring: profit calc, HOS simulation, bidding logic stubs.
import fs from 'node:fs/promises';
import path from 'node:path';

const POLICY_PATH = path.join(process.cwd(), 'policy.json');

async function loadPolicy() {
  try {
    const raw = await fs.readFile(POLICY_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {
      region: 'Winters-CA',
      weights: { rpm: 0.25, deadhead: 0.15, transit_fit: 0.15, lane_desirability: 0.1, risk_broker: 0.1, operational_friction: 0.1, equip_fit: 0.05, regulatory: 0.05, hos_compliance: 0.05 },
      profit_threshold_usd_per_mile: 1.5,
      hos: { max_drive_hours_per_day: 11 }
    };
  }
}

// Simple geocode stub (hardcoded for CA hubs)
function geocode(city) {
  const map = {
    "Sacramento, CA": { lat: 38.5816, lng: -121.4944 },
    "Los Angeles, CA": { lat: 34.0522, lng: -118.2437 },
    "Winters, CA": { lat: 38.5249, lng: -121.9708 }
  };
  return map[city] || { lat: null, lng: null };
}

function calculateProfit(load, policy, context) {
  const miles = load.miles || 0;
  const rate = load.linehaul_usd || 0;
  const rpm = miles > 0 ? rate / miles : 0;
  const equipment = context?.equipment || load.equipment || 'dry-van';
  const mpg = policy.mpg[equipment] || 6.5;
  const fuelCost = (miles / mpg) * policy.fuel_price_usd_per_gal;
  const driverHours = miles / 50; // Rough estimate
  const driverCost = driverHours * policy.driver_cost_usd_per_hour;
  const totalCost = fuelCost + driverCost;
  const profit = rate - totalCost;
  const profitPerMile = miles > 0 ? profit / miles : 0;
  return { rpm, totalCost, profit, profitPerMile };
}

function simulateHOS(load, context) {
  // Stub: Check if pickup/delivery windows fit within HOS
  const maxDrive = policy.hos.max_drive_hours_per_day;
  // Assume 8 hours drive time for simplicity
  const driveHours = 8;
  const compliant = driveHours <= maxDrive;
  return { compliant, estimatedDriveHours: driveHours };
}

async function assessLoadTool(input) {
  const policy = await loadPolicy();
  const load = input?.load || {};
  const context = input?.context || {};

  const profit = calculateProfit(load, policy, context);
  const hos = simulateHOS(load, context);

  // Scoring factors
  const factors = [
    { name: "rpm", weight: policy.weights.rpm, contribution: Math.min(profit.rpm / 3 * 100, 100), notes: `RPM: $${profit.rpm.toFixed(2)}` },
    { name: "deadhead", weight: policy.weights.deadhead, contribution: 80, notes: "Stub: deadhead check" },
    { name: "transit_fit", weight: policy.weights.transit_fit, contribution: 70, notes: "Stub: window fit" },
    { name: "lane_desirability", weight: policy.weights.lane_desirability, contribution: 90, notes: "Stub: I-5/I-80 lane" },
    { name: "risk_broker", weight: policy.weights.risk_broker, contribution: 75, notes: "Stub: broker credit" },
    { name: "operational_friction", weight: policy.weights.operational_friction, contribution: 85, notes: "Stub: detention/port" },
    { name: "equip_fit", weight: policy.weights.equip_fit, contribution: 95, notes: "Stub: equipment match" },
    { name: "regulatory", weight: policy.weights.regulatory, contribution: 100, notes: "Stub: CARB/HOS" },
    { name: "hos_compliance", weight: policy.weights.hos_compliance, contribution: hos.compliant ? 100 : 0, notes: `HOS: ${hos.compliant ? 'OK' : 'Violation'}` }
  ];

  const score = factors.reduce((sum, f) => sum + (f.contribution * f.weight), 0);
  const recommendation = score > 80 ? "accept" : score > 60 ? "counter" : "reject";

  const economics = {
    rpm: profit.rpm,
    revenue: load.linehaul_usd,
    est_costs: profit.totalCost,
    margin: profit.profit,
    margin_pct: load.linehaul_usd > 0 ? (profit.profit / load.linehaul_usd) * 100 : 0
  };

  const constraints = [
    { name: "profit_threshold", status: profit.profitPerMile >= policy.profit_threshold_usd_per_mile ? "ok" : "block", notes: `$${profit.profitPerMile.toFixed(2)}/mile` },
    { name: "hos", status: hos.compliant ? "ok" : "block", notes: "HOS compliance" }
  ];

  return {
    recommendation,
    score: Math.round(score),
    factors,
    economics,
    constraints
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

async function estimateBidTool(input) {
  // Stub: Estimate competitive bid
  const load = input?.load || {};
  const baseRate = load.linehaul_usd || 0;
  const buffer = policy.bidding.competitive_buffer_pct / 100;
  const bid = baseRate * (1 - buffer);
  return { estimatedBid: bid, notes: "Stub: based on market data" };
}

if (process.argv[1] && process.argv[1].includes('index.mjs')) {
  console.log("finops-mcp-server scaffold started (tools not wired to MCP yet)");
}

export const tools = {
  assess_load: assessLoadTool,
  set_policy: setPolicyTool,
  get_policy: getPolicyTool,
  score_breakdown: scoreBreakdownTool,
  estimate_bid: estimateBidTool
};
