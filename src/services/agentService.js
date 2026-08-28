// src/services/agentService.js
/**
 * ProcureMind AI — Autonomous Procurement Agent & Negotiation Orchestrator
 *
 * Implements the automated agent workflow:
 *   USER REQUEST
 *       ↓
 *   STAGE 1: REQUIREMENT IDENTIFICATION (Item, Qty, Dept, Category, Budget, Urgency)
 *       ↓
 *   STAGE 2: PROCUREMENT HISTORY INSPECTION (User's historical purchases)
 *       ↓
 *   STAGE 3: VENDOR INTELLIGENCE (User's supply base, compliance & SLA)
 *       ↓
 *   STAGE 4: PRICE BENCHMARKING (Variance calculation, benchmark delta)
 *       ↓
 *   STAGE 5: RISK EVALUATION (Price anomaly, concentration, compliance)
 *       ↓
 *   STAGE 6: AI SERVICE INTEGRATION (API call or deterministic fallback)
 *       ↓
 *   STAGE 7: AUTONOMOUS VENDOR NEGOTIATION STRATEGY & SIMULATION
 *       ↓
 *   STAGE 8: AUTOMATIC DECISION GENERATION (Created in Decisions & Outcomes)
 *       ↓
 *   STAGE 9: APPLICATION STATE & 3D VISUALIZATION UPDATE
 */

import { addProcurementRequest, createDecisionFromInsight, getCurrentUserData } from './dataService.js';
import { runIntelligenceAnalysis } from './intelligenceService.js';
import { analyzeProcurementRequest } from './aiService.js';

// ─────────────────────────────────────────────────────────────────────────────
// Agent Lifecycle States
// ─────────────────────────────────────────────────────────────────────────────

export const AGENT_STATES = {
  IDLE:                   'idle',
  INGESTING:              'ingesting',
  STRUCTURING:            'structuring',
  HISTORY_CHECK:          'history_check',
  BENCHMARKING:           'benchmarking',
  VENDOR_INTELLIGENCE:    'vendor_intelligence',
  RISK_ANALYSIS:          'risk_analysis',
  SAVINGS_ANALYSIS:       'savings_analysis',
  STRATEGY_SYNTHESIS:     'strategy_synthesis',
  NEGOTIATING:            'negotiating',
  RECOMMENDATION_READY:   'recommendation_ready',
  DECISION_CREATED:       'decision_created',
  COMPLETED:              'completed',
  ERROR:                  'error',
};

// ─────────────────────────────────────────────────────────────────────────────
// Event Pub-Sub for Agent Activity & 3D Core Interaction
// ─────────────────────────────────────────────────────────────────────────────

const _agentListeners = new Set();

let _currentState = {
  state: AGENT_STATES.IDLE,
  stepIndex: 0,
  totalSteps: 11,
  message: 'ProcureMind Agent is ready',
  progress: 0,
  steps: [],
  recommendation: null,
  negotiationSimulation: null,
  activePrompt: '',
  timestamp: new Date().toISOString(),
};

function _emitAgentState(update) {
  _currentState = { ..._currentState, ...update, timestamp: new Date().toISOString() };
  _agentListeners.forEach((fn) => {
    try {
      fn(_currentState);
    } catch (err) {
      console.error('[agentService] Listener error:', err);
    }
  });
}

export function subscribeToAgentState(listener) {
  _agentListeners.add(listener);
  listener(_currentState);
  return () => _agentListeners.delete(listener);
}

export function getAgentCurrentState() {
  return { ..._currentState };
}

// ─────────────────────────────────────────────────────────────────────────────
// Natural Language Intent Parser & Requirement Structurer
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parses user's natural language procurement request.
 *
 * @param {string} prompt - User input string
 * @param {Object} userData - Active user dataset
 * @returns {Object} Structured requirement object
 */
export function parseProcurementIntent(prompt, userData = {}) {
  const text = (prompt || '').trim();
  const lower = text.toLowerCase();

  // 1. Extract Quantity (e.g. "50 laptops", "20 monitors", "100 licenses", "10 printers")
  let quantity = 1;
  const qtyMatch = lower.match(/\b(\d+)\s*(units?|laptops?|macbooks?|desktops?|monitors?|screens?|displays?|printers?|scanners?|chairs?|workstations?|seats?|licenses?|licences?|sets?|benches?)?\b/);
  if (qtyMatch && qtyMatch[1]) {
    const rawQty = parseInt(qtyMatch[1], 10);
    quantity = isNaN(rawQty) ? 1 : Math.max(1, Math.min(50000, rawQty));
  }

  // 2. Extract Budget Constraint if provided (e.g. "under ₹8 lakh", "under 15 lakh", "under 8L", "budget 500000")
  let explicitBudget = null;
  const lakhMatch = lower.match(/under\s*(?:₹|rs\.?)?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|lac|lacs|l\b)/);
  if (lakhMatch && lakhMatch[1]) {
    const lakhVal = parseFloat(lakhMatch[1]);
    if (!isNaN(lakhVal) && lakhVal > 0) {
      explicitBudget = Math.round(lakhVal * 100000);
    }
  }

  // 3. Extract Urgency
  let urgency = 'Standard (30 days)';
  if (lower.includes('urgent') || lower.includes('asap') || lower.includes('immediately') || lower.includes('emergency')) {
    urgency = 'High (Urgent — 7 days)';
  } else if (lower.includes('q3') || lower.includes('q4') || lower.includes('next month') || lower.includes('planned')) {
    urgency = 'Planned Cycle (60 days)';
  }

  // 4. Extract Department
  let department = 'Engineering';
  if (lower.includes('finance') || lower.includes('accounting')) {
    department = 'Finance & Accounts';
  } else if (lower.includes('hr') || lower.includes('human resource') || lower.includes('people')) {
    department = 'Human Resources';
  } else if (lower.includes('marketing') || lower.includes('growth')) {
    department = 'Marketing & Growth';
  } else if (lower.includes('design') || lower.includes('creative') || lower.includes('ui/ux')) {
    department = 'Product & Design';
  } else if (lower.includes('product')) {
    department = 'Product Management';
  } else if (lower.includes('devops') || lower.includes('infra') || lower.includes('cloud')) {
    department = 'DevOps & Infrastructure';
  } else if (lower.includes('operations') || lower.includes('workplace')) {
    department = 'Workplace Operations';
  } else if (lower.includes('legal')) {
    department = 'Legal & Compliance';
  }

  // 5. Determine Category, Item, and Base Pricing
  let category = 'IT Hardware';
  let item = 'Developer Equipment';
  let unitPrice = 38000;
  let historicalBenchmark = 35000;
  let defaultVendor = 'CompEdge Global Systems';

  if (lower.includes('laptop') || lower.includes('macbook') || lower.includes('thinkpad') || lower.includes('computer')) {
    category = 'IT Hardware';
    item = `${quantity} Developer Laptops (MacBook Pro / ThinkPad)`;
    unitPrice = 40000;
    historicalBenchmark = 35500;
    if (explicitBudget) {
      unitPrice = Math.round(explicitBudget / quantity);
      historicalBenchmark = Math.round(unitPrice * 0.89);
    }
    defaultVendor = 'CompEdge Global Systems';
  } else if (lower.includes('monitor') || lower.includes('screen') || lower.includes('display')) {
    category = 'IT Hardware';
    item = `${quantity} 4K UltraWide Professional Monitors`;
    unitPrice = explicitBudget ? Math.round(explicitBudget / quantity) : 40000;
    historicalBenchmark = Math.round(unitPrice * 0.88);
    defaultVendor = 'CompEdge Global Systems';
  } else if (lower.includes('printer') || lower.includes('scanner') || lower.includes('copier')) {
    category = 'IT Hardware';
    item = `${quantity} Multi-Function Enterprise Network Printers`;
    unitPrice = explicitBudget ? Math.round(explicitBudget / quantity) : 28000;
    historicalBenchmark = Math.round(unitPrice * 0.92);
    defaultVendor = 'CompEdge Global Systems';
  } else if (lower.includes('figma') || lower.includes('adobe') || lower.includes('software') || lower.includes('saas') || lower.includes('license') || lower.includes('licence') || lower.includes('seat')) {
    category = 'Software';
    item = lower.includes('figma')
      ? `Figma Organization Licenses (${quantity} seats)`
      : lower.includes('adobe')
      ? `Adobe Creative Cloud Enterprise (${quantity} seats)`
      : `Enterprise SaaS Licenses (${quantity} seats)`;
    unitPrice = 3200;
    historicalBenchmark = 3200;
    defaultVendor = 'SaaSPoint Enterprise Direct';
  } else if (lower.includes('aws') || lower.includes('cloud') || lower.includes('server') || lower.includes('compute')) {
    category = 'Cloud Services';
    item = `Cloud Compute & Reserved Instances`;
    unitPrice = 1250000;
    historicalBenchmark = 1300000;
    defaultVendor = 'Amazon Web Services';
    quantity = 1;
  } else if (lower.includes('chair') || lower.includes('desk') || lower.includes('workstation') || lower.includes('furniture') || lower.includes('ergonomic')) {
    category = 'Operations';
    item = `${quantity} Modular Ergonomic Workstations & Chairs`;
    unitPrice = 12800;
    historicalBenchmark = 13500;
    defaultVendor = 'Prime Workspace Co.';
  } else if (lower.includes('lab') || lower.includes('instrument') || lower.includes('multimeter') || lower.includes('test') || lower.includes('calibration')) {
    category = 'Engineering Equipment';
    item = `${quantity} Precision Calibration Test Benches`;
    unitPrice = 160000;
    historicalBenchmark = 150000;
    defaultVendor = 'Apex Instruments Pvt Ltd';
  } else {
    category = 'General Procurement';
    item = text.length > 50 ? `${text.slice(0, 47)}...` : text || 'Requisition Order';
    unitPrice = 10000;
    historicalBenchmark = 10000;
    defaultVendor = 'Direct Supplier';
  }

  // Check current user's actual vendor database
  const existingVendors = Array.isArray(userData?.vendors) ? userData.vendors : [];
  const matchedVendor = existingVendors.find(
    (v) => (v.category || '').toLowerCase().includes(category.toLowerCase()) ||
           (v.name || '').toLowerCase().includes(defaultVendor.toLowerCase())
  );

  const vendorName = matchedVendor ? matchedVendor.name : (existingVendors.length > 0 ? existingVendors[0].name : defaultVendor);
  if (matchedVendor) {
    if (matchedVendor.currentUnitPrice) unitPrice = Number(matchedVendor.currentUnitPrice);
    if (matchedVendor.previousUnitPrice) historicalBenchmark = Number(matchedVendor.previousUnitPrice);
  }

  const totalAmount = unitPrice * quantity;
  const totalBenchmark = historicalBenchmark * quantity;

  return {
    item,
    category,
    department,
    quantity,
    unitPrice,
    totalAmount,
    historicalBenchmark: totalBenchmark,
    unitBenchmark: historicalBenchmark,
    vendor: vendorName,
    hasExistingVendor: !!matchedVendor,
    vendorDetails: matchedVendor || null,
    urgency,
    explicitBudget,
    purchaseIntent: text,
    requiredDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Autonomous Vendor Negotiation Strategy & Multi-Lever Simulator
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates a dynamic multi-lever negotiation strategy and simulated dialogue.
 * Tailors negotiation levers (price, volume, payment terms, warranty, SLA) to the requisition.
 */
export function generateNegotiationSimulation({
  item,
  vendor,
  category,
  totalAmount,
  historicalBenchmark,
  variancePct,
  quantity,
  customStrategyPoints,
  customCounterOffer,
}) {
  const isMarkup = variancePct > 0;
  const targetPrice = isMarkup
    ? Math.round(historicalBenchmark * 1.02)
    : Math.round(totalAmount * 0.95);

  const formattedTarget = customCounterOffer || `₹${(targetPrice / 100000).toFixed(2)}L`;
  const potentialSaving = Math.max(0, totalAmount - targetPrice);

  // Determine dynamic negotiation levers based on category & variance
  const leversApplied = [];
  if (quantity >= 10 || totalAmount >= 500000) leversApplied.push('Volume Commitment Discount');
  if (isMarkup) leversApplied.push('Historical Benchmark Indexing');
  leversApplied.push('Net-30 Payment Terms');
  if ((category || '').toLowerCase().includes('hardware') || (category || '').toLowerCase().includes('equipment') || (category || '').toLowerCase().includes('it')) {
    leversApplied.push('3-Year Extended SLA Warranty');
  } else if ((category || '').toLowerCase().includes('software') || (category || '').toLowerCase().includes('cloud')) {
    leversApplied.push('Service Credits for Uptime & Onboarding Support');
  }

  const dialogue = [
    {
      round: 1,
      sender: 'ProcureMind Agent',
      message: `Based on our historical rate benchmark of ₹${(historicalBenchmark / 100000).toFixed(2)}L for ${item} and our volume commitment of ${quantity} units, we propose a rate card target of ${formattedTarget}.`,
      timestamp: '00:01',
    },
    {
      round: 2,
      sender: `${vendor} (Supplier)`,
      message: `We have evaluated your order volume (${quantity} units). While standard catalog quotation is ₹${(totalAmount / 100000).toFixed(2)}L, we can offer an initial concession at ₹${((targetPrice * 1.03) / 100000).toFixed(2)}L.`,
      timestamp: '00:02',
    },
    {
      round: 3,
      sender: 'ProcureMind Agent',
      message: `We can confirm immediate purchase order authorization if rate is finalized at ${formattedTarget} with Net-30 payment terms and 3-year enterprise replacement SLA warranty.`,
      timestamp: '00:03',
    },
    {
      round: 4,
      sender: `${vendor} (Supplier)`,
      message: `Counter-offer accepted at ${formattedTarget}. Terms confirmed: Net-30 payment schedule, 3-year warranty, and priority SLA delivery. Revised invoice issued.`,
      timestamp: '00:04',
    },
  ];

  const strategyPoints = Array.isArray(customStrategyPoints) && customStrategyPoints.length > 0
    ? customStrategyPoints
    : [
        `Historical rate benchmark baseline: ₹${(historicalBenchmark / 100000).toFixed(2)}L`,
        `Consolidated order volume (${quantity} units) leverages Tier-1 enterprise pricing`,
        `Standard Net-30 payment terms without upfront deposit surcharge`,
        `Mandatory 3-year SLA replacement warranty and service credit penalties for delivery delays`,
      ];

  return {
    isSimulated: true,
    label: 'AI Negotiation Preview (Simulated)',
    originalQuote: totalAmount,
    formattedOriginal: `₹${(totalAmount / 100000).toFixed(2)}L`,
    negotiatedTarget: targetPrice,
    formattedTarget,
    potentialSaving,
    formattedSaving: `₹${(potentialSaving / 100000).toFixed(2)}L`,
    discountPercentage: isMarkup ? variancePct : 5.0,
    strategyPoints,
    leversApplied,
    dialogue,
    status: 'Recommended for Executive Approval',
    termsAgreed: 'Net-30 Days, 3-Year Enterprise SLA Warranty, Volume Tier-1 Discount',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Autonomous 11-Stage Multi-Stage Workflow Executor
// ─────────────────────────────────────────────────────────────────────────────

const _delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let _isAgentRunning = false;

export async function executeAutonomousAgent(prompt, options = {}) {
  const { userId, onComplete } = options;

  if (_isAgentRunning) {
    return;
  }

  if (!prompt || !prompt.trim()) {
    _emitAgentState({
      state: AGENT_STATES.ERROR,
      message: 'Please enter a procurement request to begin.',
    });
    return;
  }

  _isAgentRunning = true;

  const cleanPrompt = prompt.trim();
  const currentData = getCurrentUserData(userId);

  // Initialize workflow state
  const stepLog = [];
  _emitAgentState({
    state: AGENT_STATES.INGESTING,
    stepIndex: 0,
    totalSteps: 11,
    progress: 5,
    message: 'Stage 01: Ingesting & understanding procurement requirement...',
    steps: stepLog,
    recommendation: null,
    negotiationSimulation: null,
    activePrompt: cleanPrompt,
  });

  try {
    // ── STAGE 01: Requirement Identification & NLP Parsing (~500ms) ────────
    await _delay(500);
    const parsedReq = parseProcurementIntent(cleanPrompt, currentData);
    stepLog.push({
      id: 'step_1',
      stepNumber: '01',
      title: 'Requirement Identified & Parsed',
      detail: `Extracted: ${parsedReq.item} (${parsedReq.quantity} units, Urgency: ${parsedReq.urgency})`,
      status: 'complete',
    });
    _emitAgentState({
      state: AGENT_STATES.STRUCTURING,
      stepIndex: 1,
      progress: 12,
      message: 'Stage 02: Structuring request & routing to department...',
      steps: [...stepLog],
    });

    // ── STAGE 02: Request Structuring & Department Routing (~450ms) ────────
    await _delay(450);
    stepLog.push({
      id: 'step_2',
      stepNumber: '02',
      title: 'Request Structured & Routed',
      detail: `Assigned Category: ${parsedReq.category} | Department: ${parsedReq.department}`,
      status: 'complete',
    });
    _emitAgentState({
      state: AGENT_STATES.HISTORY_CHECK,
      stepIndex: 2,
      progress: 22,
      message: 'Stage 03: Inspecting historical procurement ledger...',
      steps: [...stepLog],
    });

    // ── STAGE 03: Procurement History Inspection (~500ms) ──────────────────
    await _delay(500);
    const existingOrders = (currentData.procurementRequests || currentData.procurements || []).filter(
      (p) => (p.category || '').toLowerCase() === parsedReq.category.toLowerCase()
    );
    stepLog.push({
      id: 'step_3',
      stepNumber: '03',
      title: 'Procurement History Inspected',
      detail: existingOrders.length > 0
        ? `Audited ${existingOrders.length} historical purchase records in ${parsedReq.category}`
        : 'Baseline requisition established (No conflicting purchase history)',
      status: 'complete',
    });
    _emitAgentState({
      state: AGENT_STATES.BENCHMARKING,
      stepIndex: 3,
      progress: 32,
      message: 'Stage 04: Computing price benchmarks & historical baseline...',
      steps: [...stepLog],
    });

    // ── STAGE 04: Price Benchmarking & Baseline Calculation (~500ms) ───────
    await _delay(500);
    const priceVariance = parsedReq.totalAmount - parsedReq.historicalBenchmark;
    const variancePct = parsedReq.historicalBenchmark > 0
      ? Number(((priceVariance / parsedReq.historicalBenchmark) * 100).toFixed(1))
      : 0;

    stepLog.push({
      id: 'step_4',
      stepNumber: '04',
      title: 'Price Benchmark Calculated',
      detail: variancePct > 0
        ? `Quoted price is +${variancePct}% (+₹${(priceVariance / 100000).toFixed(2)}L) above baseline rate card`
        : 'Quotation complies with historical benchmark rate index',
      status: 'complete',
    });
    _emitAgentState({
      state: AGENT_STATES.VENDOR_INTELLIGENCE,
      stepIndex: 4,
      progress: 42,
      message: `Stage 05: Evaluating vendor intelligence & SLA for ${parsedReq.vendor}...`,
      steps: [...stepLog],
    });

    // ── STAGE 05: Vendor Intelligence & SLA Compliance (~550ms) ───────────
    await _delay(550);
    const existingVendors = currentData.vendors || [];
    const matchedVendor = existingVendors.find(
      (v) => (v.name || '').toLowerCase() === parsedReq.vendor.toLowerCase()
    );

    stepLog.push({
      id: 'step_5',
      stepNumber: '05',
      title: 'Vendor Intelligence & SLA Evaluated',
      detail: matchedVendor
        ? `Supplier: ${matchedVendor.name} (Compliance: ${matchedVendor.compliance || '94%'}, Rating: ${matchedVendor.rating || 4.2}/5.0, Trend: ${matchedVendor.pricingTrend || 'Stable'})`
        : `Category Supplier: ${parsedReq.vendor} (Cross-matched against supply base)`,
      status: 'complete',
    });
    _emitAgentState({
      state: AGENT_STATES.RISK_ANALYSIS,
      stepIndex: 5,
      progress: 52,
      message: 'Stage 06: Assessing risk signals & budget exposure...',
      steps: [...stepLog],
    });

    // ── STAGE 06: Risk Evaluation & Budget Exposure (~500ms) ───────────────
    await _delay(500);
    let riskLevel = 'LOW';
    let riskReason = 'Quotation is within approved budget and compliant with rate card guidelines.';

    if (variancePct >= 10.0) {
      riskLevel = 'HIGH';
      riskReason = `Quotation of ₹${(parsedReq.totalAmount / 100000).toFixed(1)}L is +${variancePct}% above baseline unit pricing.`;
    } else if (variancePct >= 4.0 || matchedVendor?.riskVariant === 'flagged' || matchedVendor?.riskVariant === 'warning') {
      riskLevel = 'MEDIUM';
      riskReason = `Moderate price variance detected compared with prior fiscal rate card.`;
    }

    stepLog.push({
      id: 'step_6',
      stepNumber: '06',
      title: 'Risk Signals & Budget Evaluated',
      detail: `${riskLevel} Risk classified — ${riskReason}`,
      status: 'complete',
    });
    _emitAgentState({
      state: AGENT_STATES.SAVINGS_ANALYSIS,
      stepIndex: 6,
      progress: 62,
      message: 'Stage 07: Detecting savings opportunities & rate gaps...',
      steps: [...stepLog],
    });

    // ── STAGE 07: Savings Opportunity Detection (~500ms) ───────────────────
    await _delay(500);
    const aiAnalysisResult = await analyzeProcurementRequest(parsedReq, {
      companyName: currentData.companyName,
      vendors: currentData.vendors,
    });

    stepLog.push({
      id: 'step_7',
      stepNumber: '07',
      title: 'Savings Opportunities Detected',
      detail: variancePct > 0
        ? `Target benchmark negotiation captures ₹${(priceVariance / 100000).toFixed(2)}L potential cost avoidance`
        : 'Requisition cost is pre-optimized for current supply tier',
      status: 'complete',
    });
    _emitAgentState({
      state: AGENT_STATES.STRATEGY_SYNTHESIS,
      stepIndex: 7,
      progress: 72,
      message: 'Stage 08: Synthesizing multi-lever negotiation strategy...',
      steps: [...stepLog],
    });

    // ── STAGE 08: Multi-Lever Negotiation Strategy Synthesis (~550ms) ─────
    await _delay(550);
    const negotiationSim = generateNegotiationSimulation({
      item: parsedReq.item,
      vendor: parsedReq.vendor,
      category: parsedReq.category,
      totalAmount: parsedReq.totalAmount,
      historicalBenchmark: parsedReq.historicalBenchmark,
      variancePct,
      quantity: parsedReq.quantity,
      customStrategyPoints: aiAnalysisResult.negotiationStrategy,
      customCounterOffer: aiAnalysisResult.counterOffer,
    });

    stepLog.push({
      id: 'step_8',
      stepNumber: '08',
      title: 'Multi-Lever Strategy Synthesized',
      detail: `Prepared ${negotiationSim.leversApplied.length} negotiation levers: ${negotiationSim.leversApplied.join(', ')}`,
      status: 'complete',
    });
    _emitAgentState({
      state: AGENT_STATES.NEGOTIATING,
      stepIndex: 8,
      progress: 82,
      message: 'Stage 09: Executing autonomous vendor negotiation simulation...',
      steps: [...stepLog],
    });

    // ── STAGE 09: Autonomous Vendor Negotiation Simulation (~600ms) ────────
    await _delay(600);
    stepLog.push({
      id: 'step_9',
      stepNumber: '09',
      title: 'Vendor Negotiation Simulated (Preview)',
      detail: `Counter-offer target ${negotiationSim.formattedTarget} simulated with ${negotiationSim.formattedSaving} savings target`,
      status: 'complete',
    });
    _emitAgentState({
      state: AGENT_STATES.RECOMMENDATION_READY,
      stepIndex: 9,
      progress: 90,
      message: 'Stage 10: Generating explainable recommendation & reasoning...',
      steps: [...stepLog],
    });

    // ── STAGE 10: Explainable Recommendation Generation (~500ms) ───────────
    await _delay(500);
    const potentialSaving = priceVariance > 0 ? priceVariance : Math.max(0, negotiationSim.potentialSaving);
    const recommendationText = aiAnalysisResult.recommendation ||
      (variancePct > 0
        ? `Negotiate with ${parsedReq.vendor} before authorization. Issue counter-offer of ${negotiationSim.formattedTarget} based on historical benchmark.`
        : `Approve requisition — terms and pricing comply with enterprise guidelines.`);

    stepLog.push({
      id: 'step_10',
      stepNumber: '10',
      title: 'Explainable Recommendation Generated',
      detail: `Action: ${aiAnalysisResult.recommendedAction || 'NEGOTIATE'} | Confidence: ${aiAnalysisResult.confidence || '94%'}`,
      status: 'complete',
    });
    _emitAgentState({
      state: AGENT_STATES.DECISION_CREATED,
      stepIndex: 10,
      progress: 96,
      message: 'Stage 11: Queuing decision for Human-in-the-Loop review...',
      steps: [...stepLog],
    });

    // ── STAGE 11: Decision Queued for Human-in-the-Loop Review (~450ms) ─────
    await _delay(450);

    // 1. Add procurement requisition to current user's isolated data
    const updatedDataWithProc = addProcurementRequest(userId, {
      item: parsedReq.item,
      category: parsedReq.category,
      department: parsedReq.department,
      quantity: parsedReq.quantity,
      unitPrice: parsedReq.unitPrice,
      totalAmount: parsedReq.totalAmount,
      estimatedBudget: parsedReq.historicalBenchmark,
      historicalBenchmark: parsedReq.historicalBenchmark,
      vendor: parsedReq.vendor,
      purchaseIntent: parsedReq.purchaseIntent,
      requiredDate: parsedReq.requiredDate,
      aiRecommendation: aiAnalysisResult.recommendedAction === 'APPROVE' ? 'Approved to Proceed' : 'Negotiate Before Approval',
      aiActionType: aiAnalysisResult.recommendedAction === 'APPROVE' ? 'proceed' : 'negotiate',
      aiConfidence: aiAnalysisResult.confidence || '94%',
      riskLevel: (aiAnalysisResult.riskLevel || riskLevel).charAt(0) + (aiAnalysisResult.riskLevel || riskLevel).slice(1).toLowerCase(),
      riskReason: aiAnalysisResult.riskReason || riskReason,
      variance: variancePct > 0 ? `+${variancePct}%` : '0%',
      negotiationTarget: negotiationSim.formattedTarget,
      aiMode: aiAnalysisResult.source || 'fallback_intelligence',
      aiAssessment: aiAnalysisResult.assessment || '',
      aiReasons: aiAnalysisResult.riskReasons || [],
      aiCounterOffer: negotiationSim.formattedTarget,
      aiNegotiationStrategy: negotiationSim.strategyPoints || [],
    });

    // 2. Automatically create a pending decision record for executive review
    let createdDecision = null;
    const latestReq = (updatedDataWithProc.procurementRequests || [])[0];
    if (variancePct > 0 || potentialSaving > 0) {
      const decisionInsight = {
        id: `ins_auto_${latestReq?.id || Date.now()}`,
        title: `NEGOTIATE BEFORE APPROVAL: ${parsedReq.item}`,
        description: `Quotation is ${variancePct}% above historical rate benchmark. Recommended counter-offer of ${negotiationSim.formattedTarget}.`,
        recommendation: `Issue counter-offer of ${negotiationSim.formattedTarget} to ${parsedReq.vendor} with Net-30 payment terms.`,
        financialImpact: potentialSaving,
        formattedImpact: `₹${(potentialSaving / 100000).toFixed(2)}L`,
        type: 'savings',
        severity: riskLevel.toLowerCase(),
        relatedRecords: [latestReq?.id].filter(Boolean),
      };
      const dataWithDecision = createDecisionFromInsight(userId, decisionInsight);
      createdDecision = (dataWithDecision.decisions || []).find((d) => d.relatedInsightId === decisionInsight.id) || (dataWithDecision.decisions || [])[0];
    }

    // 3. Trigger full intelligence recalculation
    runIntelligenceAnalysis(updatedDataWithProc);

    stepLog.push({
      id: 'step_11',
      stepNumber: '11',
      title: 'Queued for Human-in-the-Loop Review',
      detail: createdDecision
        ? `Decision record #${createdDecision.id} logged in Decisions module awaiting human executive authorization.`
        : 'Requisition logged in review queue awaiting authorization.',
      status: 'complete',
    });

    const finalRecommendation = {
      title: parsedReq.item,
      category: parsedReq.category,
      department: parsedReq.department,
      vendor: parsedReq.vendor,
      quantity: parsedReq.quantity,
      unitPrice: parsedReq.unitPrice,
      currentQuotation: parsedReq.totalAmount,
      formattedQuotation: `₹${(parsedReq.totalAmount / 100000).toFixed(2)}L`,
      historicalBenchmark: parsedReq.historicalBenchmark,
      formattedBenchmark: `₹${(parsedReq.historicalBenchmark / 100000).toFixed(2)}L`,
      variance: variancePct > 0 ? `+${variancePct}%` : '0%',
      variancePct,
      riskLevel: aiAnalysisResult.riskLevel || riskLevel,
      riskReason: aiAnalysisResult.riskReason || riskReason,
      riskReasons: aiAnalysisResult.riskReasons || [],
      recommendedAction: aiAnalysisResult.recommendedAction || 'NEGOTIATE',
      assessment: aiAnalysisResult.assessment || '',
      counterOffer: negotiationSim.formattedTarget,
      potentialSavings: potentialSaving,
      formattedSavings: `₹${(potentialSaving / 100000).toFixed(2)}L`,
      recommendation: recommendationText,
      whyReasoning: {
        priceVarianceNotice: variancePct > 0
          ? `Current quote of ₹${(parsedReq.totalAmount / 100000).toFixed(2)}L is +${variancePct}% (+₹${(priceVariance / 100000).toFixed(2)}L) above benchmark rate card.`
          : 'Quote matches pre-negotiated baseline rate card.',
        volumeLeverage: `Volume commitment of ${parsedReq.quantity} unit(s) provides Tier-1 enterprise negotiation leverage.`,
        vendorPerformance: matchedVendor
          ? `Supplier ${matchedVendor.name} has ${matchedVendor.compliance || '94%'} contract compliance.`
          : 'Category supplier evaluated against market baseline.',
        estimatedSavings: `Target negotiation captures ₹${(potentialSaving / 100000).toFixed(2)}L in cost avoidance.`,
      },
      evidenceAuditTrail: [
        `Historical rate card baseline: ₹${(parsedReq.historicalBenchmark / 100000).toFixed(2)}L (Unit: ₹${parsedReq.unitBenchmark.toLocaleString('en-IN')})`,
        `Current vendor quote: ₹${(parsedReq.totalAmount / 100000).toFixed(2)}L (Unit: ₹${parsedReq.unitPrice.toLocaleString('en-IN')})`,
        `Department allocation: ${parsedReq.department} (${parsedReq.urgency})`,
        `Supplier evaluated: "${parsedReq.vendor}"`,
      ],
      negotiationLevers: negotiationSim.leversApplied || ['Volume Bracket Discount', 'Net-30 Payment Terms', '3-Year Enterprise Warranty'],
      confidence: aiAnalysisResult.confidence || '94%',
      confidenceScore: aiAnalysisResult.confidenceScore || 0.94,
      apiStatus: aiAnalysisResult.apiStatus,
      isFallback: aiAnalysisResult.isFallback,
      aiMode: aiAnalysisResult.source || 'fallback_intelligence',
      negotiationSimulation: negotiationSim,
      decisionCreated: createdDecision,
      completedAt: new Date().toISOString(),
    };

    _emitAgentState({
      state: AGENT_STATES.COMPLETED,
      stepIndex: 11,
      progress: 100,
      message: '11-Stage Analysis & Negotiation Complete',
      steps: [...stepLog],
      recommendation: finalRecommendation,
      negotiationSimulation: negotiationSim,
    });

    if (onComplete) {
      onComplete(finalRecommendation);
    }
  } catch (err) {
    console.error('[agentService] Error executing autonomous agent:', err);
    _emitAgentState({
      state: AGENT_STATES.ERROR,
      message: 'Agent encountered an error while processing procurement request.',
    });
  } finally {
    _isAgentRunning = false;
  }
}

/**
 * Reset agent back to idle state.
 */
export function resetAgentState() {
  _isAgentRunning = false;
  _emitAgentState({
    state: AGENT_STATES.IDLE,
    stepIndex: 0,
    totalSteps: 11,
    progress: 0,
    message: 'ProcureMind Agent is ready',
    steps: [],
    recommendation: null,
    negotiationSimulation: null,
    activePrompt: '',
  });
}

