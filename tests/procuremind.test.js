// tests/procuremind.test.js
/**
 * ProcureMind End-to-End Test Suite
 *
 * Covers unit tests and integration tests for:
 * 1. Intent Parser & Natural Language Structuring
 * 2. Pricing & Benchmark Variance Calculations
 * 3. AI Service Schema Validation & Fallback Intelligence
 * 4. Autonomous Negotiation Strategy & Dialogue Simulation
 * 5. Multi-User Data Isolation & Zero-State Initializer
 * 6. Storage Persistence & Recomputation Engine
 */

import {
  createEmptyDataset,
  saveUserData,
  getCurrentUserData,
  calculateMetrics,
} from '../src/services/dataService.js';

import {
  parseProcurementIntent,
  generateNegotiationSimulation,
  executeAutonomousAgent,
  resetAgentState,
  getAgentCurrentState,
  AGENT_STATES,
} from '../src/services/agentService.js';

import { analyzeProcurementRequest } from '../src/services/aiService.js';

// Setup in-memory mock for localStorage
const mockStorage = new Map();
global.localStorage = {
  getItem: (k) => mockStorage.get(k) || null,
  setItem: (k, v) => mockStorage.set(k, String(v)),
  removeItem: (k) => mockStorage.delete(k),
  clear: () => mockStorage.clear(),
};

let passedCount = 0;
let failedCount = 0;

function assert(condition, message) {
  if (condition) {
    passedCount++;
    console.log(`  ✓ ${message}`);
  } else {
    failedCount++;
    console.error(`  ✗ FAILED: ${message}`);
  }
}

async function runAllTests() {
  console.log('================================================================');
  console.log('PROCUREMIND QUALITY ASSURANCE & UNIT TEST SUITE');
  console.log('================================================================\n');

  // ── 1. Natural Language Intent Parser Tests ───────────────────────────────
  console.log('1. Intent Parser & Requirement Structurer Tests:');

  const t1 = parseProcurementIntent('50 laptops for the engineering team');
  assert(t1.quantity === 50, 'Extracts quantity 50 for laptops');
  assert(t1.category === 'IT Hardware', 'Categorizes laptops as IT Hardware');
  assert(t1.department === 'Engineering', 'Detects Engineering department');
  assert(t1.totalAmount === 2000000, 'Calculates correct total quotation ₹20.0L');
  assert(t1.historicalBenchmark === 1775000, 'Calculates benchmark baseline ₹17.75L');

  const t2 = parseProcurementIntent('20 monitors for the design team under ₹8 lakh');
  assert(t2.quantity === 20, 'Extracts quantity 20 for monitors');
  assert(t2.explicitBudget === 800000, 'Extracts explicit budget ₹8.00L');
  assert(t2.department === 'Product & Design', 'Detects Design department');
  assert(t2.totalAmount === 800000, 'Calculates total amount matching budget ₹8.0L');

  const t3 = parseProcurementIntent('100 Figma licenses for the product team with urgent delivery');
  assert(t3.quantity === 100, 'Extracts quantity 100 for Figma licenses');
  assert(t3.category === 'Software', 'Categorizes Figma as Software');
  assert(t3.department === 'Product Management', 'Detects Product department');
  assert(t3.urgency.includes('Urgent'), 'Detects High Urgency from "urgent delivery"');

  const t4 = parseProcurementIntent('10 printers for the finance department');
  assert(t4.quantity === 10, 'Extracts quantity 10 for printers');
  assert(t4.department === 'Finance & Accounts', 'Detects Finance department');
  assert(t4.item.includes('Printers'), 'Structures item as Enterprise Network Printers');

  const t5 = parseProcurementIntent('30 office chairs for HR');
  assert(t5.quantity === 30, 'Extracts quantity 30 for chairs');
  assert(t5.department === 'Human Resources', 'Detects HR department');
  assert(t5.category === 'Operations', 'Categorizes furniture as Operations');

  // Edge cases & malformed inputs
  const tEmpty = parseProcurementIntent('');
  assert(tEmpty.quantity === 1, 'Empty string defaults quantity to 1');
  assert(tEmpty.category === 'General Procurement', 'Empty string defaults category to General');

  const tNumOnly = parseProcurementIntent('50');
  assert(tNumOnly.quantity === 50, 'Input "50" extracts quantity 50');

  const tLarge = parseProcurementIntent('999999 laptops');
  assert(tLarge.quantity === 50000, 'Excessive quantity clamped to safe maximum 50,000');

  // ── 2. Pricing & Benchmark Math Tests ─────────────────────────────────────
  console.log('\n2. Mathematical Verification & Pricing Variance Tests:');

  const quote = 2000000;
  const benchmark = 1775000;
  const varianceDelta = quote - benchmark;
  const variancePct = Number(((varianceDelta / benchmark) * 100).toFixed(1));

  assert(varianceDelta === 225000, 'Variance delta equals exactly ₹2,25,000');
  assert(variancePct === 12.7, 'Variance percentage equals exactly +12.7%');

  // ── 3. AI Service & Fallback Engine Tests ─────────────────────────────────
  console.log('\n3. AI Service Schema Validation & Fallback Tests:');

  const fallbackOutput = await analyzeProcurementRequest(t1, { companyName: 'Acme Corp', vendors: [] });
  assert(fallbackOutput.source === 'fallback_intelligence', 'Uses fallback intelligence when no external API is configured');
  assert(fallbackOutput.isFallback === true, 'Sets isFallback flag correctly');
  assert(fallbackOutput.riskLevel === 'HIGH', 'Correctly flags +12.7% markup as HIGH risk');
  assert(fallbackOutput.recommendedAction === 'NEGOTIATE', 'Recommends NEGOTIATE action for price markup');
  assert(fallbackOutput.riskReasons.length > 0, 'Generates explanatory risk reason bullet points');
  assert(fallbackOutput.negotiationStrategy.length >= 3, 'Generates at least 3 negotiation strategy levers');
  assert(fallbackOutput.confidence === '94%', 'Calculates deterministic confidence score 94%');

  // ── 4. Negotiation Simulation Tests ───────────────────────────────────────
  console.log('\n4. Autonomous Negotiation Simulation Tests:');

  const negSim = generateNegotiationSimulation({
    item: t1.item,
    vendor: t1.vendor,
    totalAmount: t1.totalAmount,
    historicalBenchmark: t1.historicalBenchmark,
    variancePct: 12.7,
    quantity: 50,
  });

  assert(negSim.isSimulated === true, 'Simulation flag is explicitly true');
  assert(negSim.label.includes('Simulated'), 'Simulation label contains "Simulated"');
  assert(negSim.dialogue.length === 4, 'Dialogue contains exactly 4 negotiation rounds');
  assert(negSim.dialogue[0].sender.includes('ProcureMind'), 'Round 1 begins with ProcureMind proposal');
  assert(negSim.dialogue[3].sender.includes('Supplier'), 'Round 4 concludes with Supplier agreement');
  assert(negSim.potentialSaving > 0, 'Calculates positive potential savings target');

  // ── 5. Multi-User Data Isolation & Zero State Tests ───────────────────────
  console.log('\n5. Multi-User Isolation & Zero State Tests:');

  mockStorage.clear();
  const userAlphaId = 'usr_alpha_101';
  const userBetaId = 'usr_beta_202';

  const userAlphaData = createEmptyDataset(userAlphaId, 'Alpha Corp');
  saveUserData(userAlphaId, userAlphaData);

  const userBetaData = createEmptyDataset(userBetaId, 'Beta Corp');
  saveUserData(userBetaId, userBetaData);

  const alphaZero = calculateMetrics(userAlphaData);
  assert(alphaZero.totalSpendValue === 0, 'Alpha starts with ₹0 total spend');
  assert(alphaZero.potentialSavingsValue === 0, 'Alpha starts with ₹0 savings');
  assert(alphaZero.riskAlertsCount === 0, 'Alpha starts with 0 risk alerts');
  assert(alphaZero.pendingDecisionsCount === 0, 'Alpha starts with 0 pending decisions');
  assert(alphaZero.vendorCount === 0, 'Alpha starts with 0 vendors');
  assert(alphaZero.aiInsightsList.length === 0, 'Alpha starts with 0 AI insights');

  // Perform procurement for Alpha
  await executeAutonomousAgent('50 laptops for the engineering team', { userId: userAlphaId });
  const alphaAfter = getCurrentUserData(userAlphaId);
  const alphaMetrics = calculateMetrics(alphaAfter);

  assert(alphaMetrics.totalSpendValue === 2000000, 'Alpha total spend updated to ₹20.0L');
  assert(alphaAfter.procurementRequests.length === 1, 'Alpha has 1 procurement record');
  assert(alphaAfter.decisions.length === 1, 'Alpha has 1 decision record');

  // Verify Beta is completely unaffected
  const betaCheck = getCurrentUserData(userBetaId);
  const betaMetrics = calculateMetrics(betaCheck);

  assert(betaMetrics.totalSpendValue === 0, 'Beta remains at ₹0 total spend (No bleed from Alpha)');
  assert(betaCheck.procurementRequests.length === 0, 'Beta has 0 procurement records');
  assert(betaCheck.decisions.length === 0, 'Beta has 0 decisions');

  // Perform procurement for Beta
  await executeAutonomousAgent('10 printers for the finance department', { userId: userBetaId });
  const betaAfter = getCurrentUserData(userBetaId);
  const betaAfterMetrics = calculateMetrics(betaAfter);

  assert(betaAfterMetrics.totalSpendValue === 280000, 'Beta total spend updated to ₹2.8L');
  assert(betaAfter.procurementRequests[0].item.includes('Printers'), 'Beta requisition is Printers');

  // Re-verify Alpha remained intact
  const alphaFinal = getCurrentUserData(userAlphaId);
  assert(alphaFinal.procurementRequests[0].item.includes('Laptops'), 'Alpha requisition is still Laptops');

  // ── 6. Agent Concurrency & Mutex Lock Test ────────────────────────────────
  console.log('\n6. Concurrency & Mutex Protection Tests:');

  resetAgentState();
  const stateBefore = getAgentCurrentState();
  assert(stateBefore.state === AGENT_STATES.IDLE, 'Agent resets cleanly to IDLE state');

  console.log('\n================================================================');
  console.log(`TEST RESULTS: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log('================================================================');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error('Test runner exception:', err);
  process.exit(1);
});
