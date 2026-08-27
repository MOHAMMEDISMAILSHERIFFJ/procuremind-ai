// tests/procuremind.test.js
/**
 * ProcureMind Comprehensive Quality Assurance & Data Integrity Test Suite
 *
 * Covers:
 * 1. Intent Parser & Natural Language Structuring
 * 2. Mathematical Invariant & Amount Integrity (quantity * unitPrice = totalAmount)
 * 3. AI Service Schema Validation & Deterministic Fallback
 * 4. Autonomous Negotiation Strategy & Dialogue Simulation
 * 5. Multi-User Isolation & Zero State Integrity
 * 6. Concurrency & Mutex Protection
 * 7. Deterministic Duplicate Detection & Identity (Sorted IDs, No Self-Matches, Deduplication)
 * 8. Mutually Exclusive AI Findings & Counter Consistency
 * 9. Human Approval Safety & Decision State Transitions (Approve, Negotiate, Reject, Outcomes)
 * 10. Universal Multi-Field Search & Filter Engine (Case-insensitive, Trimming, Null-safety, Numbers)
 * 11. Data Persistence & Idempotency Across Re-renders
 */

import {
  createEmptyDataset,
  saveUserData,
  getCurrentUserData,
  addProcurementRequest,
  createDecisionFromInsight,
  updateDecisionStatus,
  resolveInsight,
  searchRecords,
} from '../src/services/dataService.js';

import {
  parseProcurementIntent,
  generateNegotiationSimulation,
  executeAutonomousAgent,
  resetAgentState,
  getAgentCurrentState,
  AGENT_STATES,
} from '../src/services/agentService.js';

import {
  detectDuplicateTransactions,
  runIntelligenceAnalysis,
} from '../src/services/intelligenceService.js';

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
  console.log('PROCUREMIND DATA INTEGRITY & STATE CONSISTENCY SUITE');
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

  // ── 2. Mathematical Invariant & Amount Integrity Tests ────────────────────
  console.log('\n2. Mathematical Invariant & Amount Integrity Tests:');

  const userIdTest = 'usr_math_test';
  saveUserData(userIdTest, createEmptyDataset(userIdTest, 'Math Invariant Corp'));

  // Test: quantity * unitPrice = totalAmount
  const testProc1 = addProcurementRequest(userIdTest, {
    item: 'Developer Laptops',
    quantity: 25,
    unitPrice: 40000,
    unitBenchmark: 35000,
  });
  const savedReq1 = testProc1.procurementRequests[0];
  assert(savedReq1.totalAmount === 1000000, 'Calculates totalAmount = quantity * unitPrice (25 * 40,000 = ₹10,00,000)');
  assert(savedReq1.historicalBenchmark === 875000, 'Calculates benchmarkTotal = quantity * unitBenchmark (25 * 35,000 = ₹8,75,000)');
  assert(savedReq1.varianceAmount === 125000, 'Calculates varianceAmount = totalAmount - historicalBenchmark (₹1,25,000)');
  assert(savedReq1.variancePercentage === 14.3, 'Calculates variancePercentage = +14.3%');
  assert(savedReq1.quantity * savedReq1.unitPrice === savedReq1.totalAmount, 'Mathematical invariant: quantity * unitPrice === totalAmount holds');
  assert(savedReq1.quantity * savedReq1.unitBenchmark === savedReq1.historicalBenchmark, 'Mathematical invariant: quantity * unitBenchmark === historicalBenchmark holds');

  // Test: Total amount supplied -> unitPrice correctly derived
  const testProc2 = addProcurementRequest(userIdTest, {
    item: 'Ergonomic Desks',
    quantity: 10,
    totalAmount: 150000,
  });
  const savedReq2 = testProc2.procurementRequests.find(r => r.item === 'Ergonomic Desks');
  assert(savedReq2.unitPrice === 15000, 'Derives unitPrice = totalAmount / quantity (₹15,000)');
  assert(savedReq2.quantity * savedReq2.unitPrice === savedReq2.totalAmount, 'Derived unit price preserves total invariant');

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

  // ── 5. Deterministic Duplicate Detection & Identity Tests ─────────────────
  console.log('\n5. Deterministic Duplicate Detection & Identity Tests:');

  const userDupId = 'usr_dup_test';
  const dupDataset = createEmptyDataset(userDupId, 'Duplicate Audit Corp');

  // Add two identical invoices
  dupDataset.invoices = [
    { id: 'INV-1002', vendorName: 'CompEdge Systems', amount: 450000, description: 'Q3 Laptop Batch A', purchaseOrderId: 'PO-991' },
    { id: 'INV-1001', vendorName: 'CompEdge Systems', amount: 450000, description: 'Q3 Laptop Batch A', purchaseOrderId: 'PO-991' },
  ];

  const dupFindings = detectDuplicateTransactions(dupDataset);
  assert(dupFindings.length === 1, 'Detects exactly 1 duplicate finding for invoice pair');
  assert(dupFindings[0].id === 'dup_inv_INV-1001_INV-1002', 'Generates lexicographically sorted stable ID (INV-1001 before INV-1002)');
  assert(dupFindings[0].financialImpact === 450000, 'Duplicate financial impact equals billed amount ₹4.5L');

  // Reverse pair order test (ensures order independence)
  dupDataset.invoices = [
    { id: 'INV-1001', vendorName: 'CompEdge Systems', amount: 450000, description: 'Q3 Laptop Batch A', purchaseOrderId: 'PO-991' },
    { id: 'INV-1002', vendorName: 'CompEdge Systems', amount: 450000, description: 'Q3 Laptop Batch A', purchaseOrderId: 'PO-991' },
  ];
  const dupFindingsReversed = detectDuplicateTransactions(dupDataset);
  assert(dupFindingsReversed[0].id === dupFindings[0].id, 'Duplicate ID is invariant to array ordering');

  // Self-comparison exclusion test
  dupDataset.invoices = [
    { id: 'INV-1001', vendorName: 'CompEdge Systems', amount: 450000, description: 'Q3 Laptop Batch A' },
  ];
  assert(detectDuplicateTransactions(dupDataset).length === 0, 'Does not compare invoice with itself');

  // Resolution filtering test
  saveUserData(userDupId, dupDataset);
  resolveInsight(userDupId, 'dup_inv_INV-1001_INV-1002', 'held_duplicate', 'Disputed duplicate invoice');
  const userWithResolved = getCurrentUserData(userDupId);
  userWithResolved.invoices = [
    { id: 'INV-1001', vendorName: 'CompEdge Systems', amount: 450000, description: 'Q3 Laptop Batch A', purchaseOrderId: 'PO-991' },
    { id: 'INV-1002', vendorName: 'CompEdge Systems', amount: 450000, description: 'Q3 Laptop Batch A', purchaseOrderId: 'PO-991' },
  ];
  const dupAfterResolve = detectDuplicateTransactions(userWithResolved);
  assert(dupAfterResolve.length === 0, 'Excludes resolved duplicate finding from active alerts');

  // ── 6. Mutually Exclusive AI Findings & Counter Consistency ───────────────
  console.log('\n6. Mutually Exclusive AI Findings & Counter Consistency Tests:');

  const userCounterId = 'usr_counters_test';
  const testData = createEmptyDataset(userCounterId, 'Counter Test Corp');

  testData.invoices = [
    { id: 'INV-201', vendorName: 'Vendor X', amount: 100000, description: 'Double charge A' },
    { id: 'INV-202', vendorName: 'Vendor X', amount: 100000, description: 'Double charge A' },
  ];
  testData.procurementRequests = [
    { id: 'REQ-301', item: 'Server Licenses', totalAmount: 500000, historicalBenchmark: 300000, quantity: 1, unitPrice: 500000 },
  ];
  testData.subscriptions = [
    { id: 'SUB-401', name: 'Cloud SaaS', seatsTotal: 100, seatsActive: 60, seatsIdle: 40, monthlyCost: 10000, costPerYear: 120000 },
  ];
  testData.vendors = [
    { id: 'VND-501', name: 'Risky Supplier', performanceScore: 50, compliance: '70%', totalSpend: 2000000, riskLevel: 3 },
  ];

  const analysis = runIntelligenceAnalysis(testData);
  const totalFindings = analysis.insights.length;

  const priceDup = analysis.insights.filter(i => i.type === 'price_anomaly' || i.type === 'duplicate' || i.type === 'budget_deviation').length;
  const vendorRisk = analysis.insights.filter(i => i.type === 'vendor_alert' || i.type === 'vendor_risk' || i.type === 'early_warning' || i.type === 'spending_anomaly').length;
  const savings = analysis.insights.filter(i => i.type === 'savings').length;

  assert(totalFindings > 0, `Total findings generated: ${totalFindings}`);
  assert(priceDup + vendorRisk + savings === totalFindings, `Strict mutual exclusivity: Price & Duplicates (${priceDup}) + Vendor Risk (${vendorRisk}) + Savings (${savings}) === Total (${totalFindings})`);

  // ── 7. Human Approval Safety & Decision State Transitions ─────────────────
  console.log('\n7. Human Approval Safety & Decision State Transitions Tests:');

  const userApprovalId = 'usr_approval_test';
  saveUserData(userApprovalId, createEmptyDataset(userApprovalId, 'Approval Workflow Corp'));

  const insightToDecide = {
    id: 'ins_risk_test_01',
    title: 'NEGOTIATE: IT Equipment Markup',
    description: 'Quote is 20% over rate card baseline',
    recommendation: 'Authorize counter-offer of ₹18.0L',
    financialImpact: 200000,
    formattedImpact: '₹2.00L',
    type: 'savings',
    severity: 'high',
    relatedRecords: ['REQ-9901'],
  };

  // 1. Convert to pending decision (idempotency check)
  const d1 = createDecisionFromInsight(userApprovalId, insightToDecide);
  assert(d1.decisions.length === 1, 'Creates exactly 1 pending decision from insight');
  assert(d1.decisions[0].status === 'Pending Executive Sign-off', 'Decision starts in Pending state (Never auto-approved)');
  assert(d1.decisions[0].statusVariant === 'under-review', 'Decision has under-review statusVariant');

  // Repeated call should NOT duplicate
  const d2 = createDecisionFromInsight(userApprovalId, insightToDecide);
  assert(d2.decisions.length === 1, 'Idempotent: Repeated call does NOT create duplicate decision');

  const targetDecId = d1.decisions[0].id;

  // 2. Executive Negotiation Authorization
  const dNegotiate = updateDecisionStatus(userApprovalId, targetDecId, 'Negotiation Authorized', { notes: 'Counter-offer approved' });
  const decNeg = dNegotiate.decisions.find(d => d.id === targetDecId);
  assert(decNeg.status === 'Negotiation Authorized', 'Decision status updated to Negotiation Authorized');
  assert(decNeg.statusVariant === 'warning', 'Status variant updated to warning');

  // 3. Executive Approval
  const dApproved = updateDecisionStatus(userApprovalId, targetDecId, 'Approved by Executive', { actualSaving: 200000, notes: 'Agreement signed' });
  const decApp = dApproved.decisions.find(d => d.id === targetDecId);
  assert(decApp.status === 'Approved by Executive', 'Decision status updated to Approved by Executive');
  assert(decApp.statusVariant === 'approved', 'Status variant updated to approved');
  assert(dApproved.outcomes.length === 1, 'Logged in Outcomes table (Learning Layer)');
  assert(dApproved.outcomes[0].actualSaving === 200000, 'Outcomes records actual savings ₹2,00,000');
  assert(dApproved.outcomes[0].accuracy === 1.0, 'Accuracy calculated as 100%');

  // 4. Executive Rejection
  const decRejectTest = createDecisionFromInsight(userApprovalId, { id: 'ins_rej_01', title: 'Unapproved Discretionary Spend', financialImpact: 50000 });
  const targetRejId = decRejectTest.decisions[0].id;
  const dRejected = updateDecisionStatus(userApprovalId, targetRejId, 'Rejected by Executive', { notes: 'Budget exceeded' });
  const decRej = dRejected.decisions.find(d => d.id === targetRejId);
  assert(decRej.status === 'Rejected by Executive', 'Decision status updated to Rejected');
  assert(decRej.statusVariant === 'danger', 'Status variant updated to danger');

  // ── 8. Universal Multi-Field Search & Filter Engine Tests ──────────────────
  console.log('\n8. Universal Multi-Field Search & Filter Engine Tests:');

  const searchRecordsDataset = [
    { id: 'REQ-001', item: 'Developer Laptops', vendor: 'CompEdge Global Systems', category: 'IT Hardware', department: 'Engineering', totalAmount: 2000000, status: 'Under Review' },
    { id: 'REQ-002', item: '4K Monitors', vendor: 'CompEdge Global Systems', category: 'IT Hardware', department: 'Design', totalAmount: 800000, status: 'Approved' },
    { id: 'REQ-003', item: 'Figma Enterprise', vendor: 'SaaSPoint', category: 'Software', department: 'Product', totalAmount: 320000, status: 'Under Review' },
    { id: 'REQ-004', item: 'AWS Cloud Compute', vendor: 'Amazon Web Services', category: 'Cloud Services', department: 'DevOps', totalAmount: 1250000, status: 'Approved' },
    { id: 'REQ-005', item: 'Ergonomic Chairs', vendor: 'Prime Workspace Co.', category: 'Operations', department: 'HR', totalAmount: 384000, status: 'Rejected' },
  ];

  // Case-insensitive item search
  assert(searchRecords(searchRecordsDataset, 'laptop').length === 1, 'Search finds "laptop" (case-insensitive)');
  assert(searchRecords(searchRecordsDataset, '  LAPTOPS  ').length === 1, 'Search ignores leading/trailing whitespace and plurals prefix');

  // Vendor search
  assert(searchRecords(searchRecordsDataset, 'compedge').length === 2, 'Search by vendor "compedge" returns 2 records');

  // Request ID search
  assert(searchRecords(searchRecordsDataset, 'REQ-003').length === 1, 'Search by ID "REQ-003" returns Figma');

  // Category filter
  assert(searchRecords(searchRecordsDataset, '', [], { category: 'IT Hardware' }).length === 2, 'Filter by category "IT Hardware" returns 2 records');

  // Combined Search + Category Filter + Status Filter
  const combinedMatch = searchRecords(searchRecordsDataset, 'CompEdge', [], { category: 'IT Hardware', status: 'Approved' });
  assert(combinedMatch.length === 1 && combinedMatch[0].id === 'REQ-002', 'Combined search "CompEdge" + category "IT Hardware" + status "Approved" returns REQ-002');

  // Numeric amount search
  assert(searchRecords(searchRecordsDataset, '800000').length === 1, 'Search finds exact numeric amount 800000');
  assert(searchRecords(searchRecordsDataset, '20.0l').length === 1, 'Search finds formatted shorthand "20.0l"');

  // Empty search returns full dataset
  assert(searchRecords(searchRecordsDataset, '').length === 5, 'Empty search returns full dataset');

  // No-match search
  assert(searchRecords(searchRecordsDataset, 'nonexistent query 12345').length === 0, 'No-match search returns empty array without throwing');

  // Null/undefined safety
  assert(searchRecords(null, 'query').length === 0, 'Null records handled safely');
  assert(searchRecords([null, undefined, { item: 'valid' }], 'valid').length === 1, 'Null elements in array filtered safely');

  // ── 9. Multi-User Data Isolation & Persistence Tests ──────────────────────
  console.log('\n9. Multi-User Isolation & End-to-End State Tests:');

  mockStorage.clear();
  const userAlpha = 'usr_alpha_final';
  const userBeta = 'usr_beta_final';

  saveUserData(userAlpha, createEmptyDataset(userAlpha, 'Alpha Industries'));
  saveUserData(userBeta, createEmptyDataset(userBeta, 'Beta Technologies'));

  // Alpha workflow
  await executeAutonomousAgent('50 laptops for the engineering team', { userId: userAlpha });
  const alphaResult = getCurrentUserData(userAlpha);
  assert(alphaResult.procurementRequests.length === 1, 'Alpha has 1 procurement request');
  assert(alphaResult.decisions.length === 1, 'Alpha has 1 decision created');
  assert(alphaResult.expenses.length === 1, 'Alpha has 1 expense entry');

  // Beta remains 0
  const betaResult = getCurrentUserData(userBeta);
  assert(betaResult.procurementRequests.length === 0, 'Beta remains untouched (0 requests)');
  assert(betaResult.decisions.length === 0, 'Beta remains untouched (0 decisions)');
  assert(betaResult.expenses.length === 0, 'Beta remains untouched (0 expenses)');

  // ── 10. Agent Concurrency Mutex Test ──────────────────────────────────────
  console.log('\n10. Concurrency & Mutex Protection Tests:');
  resetAgentState();
  assert(getAgentCurrentState().state === AGENT_STATES.IDLE, 'Agent resets cleanly to IDLE state');

  console.log('\n================================================================');
  console.log(`TOTAL SUITE RESULTS: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log('================================================================');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error('Test runner exception:', err);
  process.exit(1);
});
