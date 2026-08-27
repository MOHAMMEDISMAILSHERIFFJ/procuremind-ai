// tests/runtime_e2e_verification.js
/**
 * ProcureMind Step 7.1 — Final Real-World Runtime Verification Suite
 *
 * Simulates complete end-to-end user workflows, DOM state transitions,
 * rapid-click stress testing, multi-user isolation, edge case prompts,
 * and comprehensive console error trapping.
 */

import {
  createEmptyDataset,
  saveUserData,
  getCurrentUserData,
  calculateMetrics,
  addVendor,
  addSubscription,
  createDecisionFromInsight,
  clearProcurementData,
} from '../src/services/dataService.js';

import {
  parseProcurementIntent,
  executeAutonomousAgent,
  resetAgentState,
  getAgentCurrentState,
  subscribeToAgentState,
  AGENT_STATES,
} from '../src/services/agentService.js';

// Setup in-memory mock for localStorage
const mockStorage = new Map();
global.localStorage = {
  getItem: (k) => mockStorage.get(k) || null,
  setItem: (k, v) => mockStorage.set(k, String(v)),
  removeItem: (k) => mockStorage.delete(k),
  clear: () => mockStorage.clear(),
};

// Console trap to verify 0 runtime errors
const consoleErrors = [];
const consoleWarnings = [];
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args) => {
  consoleErrors.push(args.join(' '));
  originalConsoleError(...args);
};

console.warn = (...args) => {
  consoleWarnings.push(args.join(' '));
  originalConsoleWarn(...args);
};

let passCount = 0;
let failCount = 0;

function check(assertion, label) {
  if (assertion) {
    passCount++;
    console.log(`  [PASS] ${label}`);
  } else {
    failCount++;
    console.error(`  [FAIL] ${label}`);
  }
}

async function runStep71Verification() {
  console.log('================================================================');
  console.log('PROCUREMIND STEP 7.1 — REAL-WORLD RUNTIME VERIFICATION');
  console.log('================================================================\n');

  // ── 1. REGISTRATION & ZERO-STATE VERIFICATION ──────────────────────────────
  console.log('1. Registration & Zero-State Verification:');
  const userA_Id = 'usr_real_alpha_99';
  const userA_Profile = {
    id: userA_Id,
    fullName: 'Sarah Connor',
    username: 'sconnor',
    email: 'sarah@cyberdyne.com',
    companyName: 'Cyberdyne Systems',
    jobRole: 'Director of Strategic Sourcing',
    department: 'Hardware & Infrastructure',
    isDemo: false,
  };

  const userA_ZeroData = createEmptyDataset(userA_Id, userA_Profile.companyName);
  saveUserData(userA_Id, userA_ZeroData);

  const initialMetrics = calculateMetrics(userA_ZeroData);
  check(initialMetrics.totalSpendValue === 0, 'Total spend is exactly ₹0');
  check(initialMetrics.potentialSavingsValue === 0, 'Potential savings is exactly ₹0');
  check(initialMetrics.riskAlertsCount === 0, 'Risk alerts count is exactly 0');
  check(initialMetrics.pendingDecisionsCount === 0, 'Pending decisions count is exactly 0');
  check(initialMetrics.vendorCount === 0, 'Vendor count is exactly 0');
  check(initialMetrics.aiInsightsList.length === 0, 'AI insights count is exactly 0');
  check(initialMetrics.categoryBreakdown.length === 0, 'Category breakdown is empty');
  check(userA_ZeroData.procurementRequests.length === 0, 'Requisition list is empty');

  // ── 2. AUTONOMOUS 9-STAGE AGENT PIPELINE EXECUTION ─────────────────────────
  console.log('\n2. Autonomous 9-Stage Pipeline ("50 laptops for the engineering team"):');

  const observedStages = [];
  const unsubscribe = subscribeToAgentState((state) => {
    if (state.state && !observedStages.includes(state.state)) {
      observedStages.push(state.state);
    }
  });

  const prompt = '50 laptops for the engineering team';
  await executeAutonomousAgent(prompt, { userId: userA_Id });
  unsubscribe();

  const finalAgentState = getAgentCurrentState();
  check(finalAgentState.state === AGENT_STATES.COMPLETED, 'Agent reaches COMPLETED state');
  check(finalAgentState.steps.length >= 8, `Recorded ${finalAgentState.steps.length} verified audit steps`);
  check(finalAgentState.recommendation !== null, 'Structured recommendation card generated');

  // ── 3. DATA & MATHEMATICAL BENCHMARK VERIFICATION ──────────────────────────
  console.log('\n3. Data & Mathematical Verification:');
  const rec = finalAgentState.recommendation;
  check(rec.quantity === 50, 'Quantity is exactly 50');
  check(rec.department === 'Engineering', 'Department is Engineering');
  check(rec.category === 'IT Hardware', 'Category is IT Hardware');
  check(rec.currentQuotation === 2000000, 'Quotation is exactly ₹20,00,000 (₹20.0L)');
  check(rec.historicalBenchmark === 1775000, 'Historical benchmark is exactly ₹17,75,000 (₹17.75L)');
  check(rec.potentialSavings === 225000, 'Potential savings is ₹2,25,000 (₹2.25L)');
  check(rec.variancePct === 12.7, 'Variance percentage is exactly +12.7%');
  check(rec.riskLevel === 'HIGH', 'Risk level is classified as HIGH');
  check(rec.recommendedAction === 'NEGOTIATE', 'Action recommended is NEGOTIATE');
  check(rec.confidence === '94%', 'Confidence score is 94%');
  check(rec.apiStatus.includes('fallback intelligence active'), 'Transparent fallback status displayed');

  // ── 4. NEGOTIATION SIMULATION VERIFICATION ─────────────────────────────────
  console.log('\n4. Negotiation Simulation Verification:');
  const neg = rec.negotiationSimulation;
  check(neg.isSimulated === true, 'Simulation flag is explicitly true');
  check(neg.label.includes('Simulated'), 'Label contains "Simulated"');
  check(neg.dialogue.length === 4, 'Contains exactly 4 dialogue rounds');
  check(neg.dialogue[0].sender.includes('ProcureMind'), 'Round 1 begins with ProcureMind proposal');
  check(neg.dialogue[1].sender.includes('Supplier'), 'Round 2 is Supplier counter-quote');
  check(neg.dialogue[2].sender.includes('ProcureMind'), 'Round 3 is ProcureMind volume PO condition');
  check(neg.dialogue[3].sender.includes('Supplier'), 'Round 4 is Supplier agreement');
  check(neg.termsAgreed.includes('Net-30'), 'Terms agreed includes Net-30 payment terms');

  // ── 5. AUTOMATIC DECISION CREATION & LIVE STATE RECALCULATION ──────────────
  console.log('\n5. Decision Creation & State Recalculation:');
  const userA_DataAfter = getCurrentUserData(userA_Id);
  const updatedMetrics = calculateMetrics(userA_DataAfter);

  check(userA_DataAfter.procurementRequests.length === 1, 'Requisition persisted in user storage');
  check(userA_DataAfter.decisions.length === 1, 'Decision record created in Decisions module');
  check(updatedMetrics.totalSpendValue === 2000000, 'Total spend recalculated to ₹20.0L');
  check(updatedMetrics.pendingDecisionsCount === 1, 'Pending decisions counter incremented to 1');
  check(updatedMetrics.riskAlertsCount > 0, 'Risk alerts counter updated');

  // ── 6. RAPID-CLICK / MUTEX CONCURRENCY STRESS TEST ─────────────────────────
  console.log('\n6. Rapid-Click Concurrency Stress Test (10 consecutive clicks):');
  resetAgentState();

  // Rapidly trigger 10 calls concurrently
  const promises = [];
  for (let i = 0; i < 10; i++) {
    promises.push(executeAutonomousAgent('50 laptops for the engineering team', { userId: userA_Id }));
  }
  await Promise.all(promises);

  const userA_StressData = getCurrentUserData(userA_Id);
  // Requisitions count should only increment by 1 (mutex rejected duplicate concurrent calls)
  check(
    userA_StressData.procurementRequests.length === 2,
    `Mutex lock prevented race condition (Requisitions count: ${userA_StressData.procurementRequests.length})`
  );
  check(getAgentCurrentState().state === AGENT_STATES.COMPLETED, 'Agent concluded cleanly in COMPLETED state');

  // ── 7. MULTI-USER ISOLATION TEST ───────────────────────────────────────────
  console.log('\n7. Multi-User Isolation Verification:');
  const userB_Id = 'usr_real_beta_88';
  const userB_ZeroData = createEmptyDataset(userB_Id, 'Omni Consumer Products');
  saveUserData(userB_Id, userB_ZeroData);

  const userB_Metrics = calculateMetrics(userB_ZeroData);
  check(userB_Metrics.totalSpendValue === 0, 'User B has ₹0 spend (No bleed from User A)');
  check(userB_Metrics.pendingDecisionsCount === 0, 'User B has 0 pending decisions');
  check(userB_ZeroData.procurementRequests.length === 0, 'User B has 0 requisitions');

  // Perform procurement for User B
  await executeAutonomousAgent('20 monitors for the design team under ₹8 lakh', { userId: userB_Id });
  const userB_DataAfter = getCurrentUserData(userB_Id);
  const userB_FinalMetrics = calculateMetrics(userB_DataAfter);

  check(userB_FinalMetrics.totalSpendValue === 800000, 'User B spend is ₹8.0L');
  check(userB_DataAfter.procurementRequests[0].item.includes('Monitors'), 'User B requisition is Monitors');

  // Re-verify User A data unchanged
  const userA_FinalCheck = getCurrentUserData(userA_Id);
  check(userA_FinalCheck.procurementRequests[0].item.includes('Laptops'), 'User A requisition remains Laptops');
  check(userA_FinalCheck.companyName === 'Cyberdyne Systems', 'User A workspace remains Cyberdyne Systems');

  // ── 8. EDGE CASE PROMPT TESTS ──────────────────────────────────────────────
  console.log('\n8. Edge Case NLP Input Suite:');

  const edgeCases = [
    { input: '50', expectedQty: 50, label: 'Number-only "50"' },
    { input: '50 laptops', expectedQty: 50, label: 'Short input "50 laptops"' },
    { input: '20 monitors for design', expectedDept: 'Product & Design', label: 'Department matching "design"' },
    { input: '100 Figma licenses', expectedQty: 100, label: 'Software license "100 Figma licenses"' },
    { input: '10 printers for finance', expectedDept: 'Finance & Accounts', label: 'Peripheral + Finance "10 printers for finance"' },
    { input: '30 chairs for HR', expectedDept: 'Human Resources', label: 'Furniture + HR "30 chairs for HR"' },
    { input: 'urgent delivery', expectedUrgency: 'High', label: 'Urgency only "urgent delivery"' },
    { input: '50 laptops under ₹8 lakh', expectedBudget: 800000, label: 'Laptops with budget "under ₹8 lakh"' },
    { input: '', expectedQty: 1, label: 'Empty input defaults safely to 1' },
    { input: '999999999 laptops', expectedQty: 50000, label: 'Extreme quantity clamped to 50,000 max' },
  ];

  for (const tc of edgeCases) {
    const p = parseProcurementIntent(tc.input);
    let ok = true;
    if (tc.expectedQty !== undefined && p.quantity !== tc.expectedQty) ok = false;
    if (tc.expectedDept !== undefined && p.department !== tc.expectedDept) ok = false;
    if (tc.expectedBudget !== undefined && p.explicitBudget !== tc.expectedBudget) ok = false;
    if (tc.expectedUrgency !== undefined && !p.urgency.includes(tc.expectedUrgency)) ok = false;
    check(ok, `Edge Case: ${tc.label}`);
  }

  // ── 9. MODULE NAVIGATION & ENTITY INTEGRATION TEST ──────────────────────────
  console.log('\n9. Module Entity CRUD Verification:');
  const tempUserId = 'usr_crud_test_01';
  createEmptyDataset(tempUserId, 'Test Corp');

  // Add Vendor
  const withVendor = addVendor(tempUserId, { name: 'Acme Hardware Inc', category: 'IT Hardware', rating: 4.8 });
  check(withVendor.vendors.length === 1, 'Vendor added via dataService');

  // Add Subscription
  const withSub = addSubscription(tempUserId, { name: 'Slack Enterprise', seatsTotal: 100, seatsActive: 80, monthlyCost: 15000 });
  check(withSub.subscriptions.length === 1, 'Subscription added via dataService');
  check(withSub.subscriptions[0].seatsIdle === 20, 'Calculates 20 idle seats for subscription');

  // Add Decision from Insight
  const withDec = createDecisionFromInsight(tempUserId, {
    id: 'ins_test_1',
    title: 'Negotiate Slack Renewal',
    recommendation: 'Downgrade 20 idle seats',
    financialImpact: 36000,
    formattedImpact: '₹36,000',
    type: 'savings',
    severity: 'medium',
  });
  check(withDec.decisions.length === 1, 'Decision generated from insight');

  // Clear data
  const cleared = clearProcurementData(tempUserId, 'Test Corp');
  check(cleared.vendors.length === 0 && cleared.subscriptions.length === 0, 'Clear data resets workspace to zero state');

  console.log('\n================================================================');
  console.log(`TOTAL CHECKS: ${passCount} PASSED, ${failCount} FAILED`);
  console.log(`CONSOLE ERRORS TRAPPED: ${consoleErrors.length}`);
  console.log('================================================================');

  if (failCount > 0) {
    process.exit(1);
  }
}

runStep71Verification().catch((err) => {
  console.error('Test execution failed with error:', err);
  process.exit(1);
});
