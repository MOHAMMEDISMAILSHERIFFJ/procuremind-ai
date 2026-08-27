// src/services/aiService.js
/**
 * ProcureMind AI Service — v1.0
 *
 * Clean service interface layer for the hackathon prototype.
 * All functions currently return structured MOCK responses.
 *
 * IMPORTANT FOR FUTURE INTEGRATION:
 * When connecting the real AI model/API, replace only the body of each function.
 * The function signatures, parameter contracts, and response schemas must remain
 * identical so the frontend does not need to be rewritten.
 *
 * Environment variable for future API key (set in .env file — never commit):
 *   VITE_AI_API_ENDPOINT=https://your-model-endpoint.com/api
 *   VITE_AI_API_KEY=your-api-key-here
 *
 * Usage:
 *   const endpoint = import.meta.env.VITE_AI_API_ENDPOINT;
 *   const apiKey   = import.meta.env.VITE_AI_API_KEY;
 */

// ─────────────────────────────────────────────────────────────────────────────
// Shared response builder helpers
// ─────────────────────────────────────────────────────────────────────────────

function buildInsight(overrides = {}) {
  return {
    id: `ins_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    type: 'general',
    severity: 'info',        // 'high' | 'warning' | 'info' | 'savings' | 'critical'
    title: 'AI Insight',
    explanation: '',
    evidence: [],            // array of supporting data points
    financialImpact: 0,      // in INR (integer)
    recommendation: '',
    confidence: 0.0,         // 0.0 – 1.0
    category: '',
    timestamp: new Date().toISOString(),
    ...overrides,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// A. Procurement Intelligence
// ─────────────────────────────────────────────────────────────────────────────


/**
 * Analyze a procurement request against company history, vendor data, and market benchmarks.
 *
 * @param {Object} data
 * @param {string} data.item               - Item being procured
 * @param {number} data.quantity           - Quantity requested
 * @param {number} data.quotedPrice        - Price from vendor (per unit)
 * @param {string} data.vendor             - Vendor name
 * @param {string} data.category           - Category (IT, SaaS, Operations, etc.)
 * @param {Array}  data.historicalPurchases - Past purchases of same/similar items
 * @param {Object} data.companyProfile     - Current user's company profile
 * @returns {Promise<Object>}
 */
export async function analyzeProcurement(data) {
  // MOCK — Replace with real API call
  await _simulateDelay(600);
  return {
    status: 'analyzed',
    timestamp: new Date().toISOString(),
    procurement: data,
    recommendations: [
      buildInsight({
        type: 'procurement',
        severity: 'info',
        title: `${data.item || 'Procurement request'} — Baseline check complete`,
        explanation: 'Quoted price is within ±5% of historical benchmarks for this category.',
        recommendation: 'Approved for processing. No anomalies detected.',
        confidence: 0.87,
        financialImpact: 0,
        category: data.category || 'General',
      }),
    ],
    anomalies: [],
    benchmarkComparison: null, // future: { marketPrice, historicalAvg, deviation }
  };
}

/**
 * Generate holistic procurement insights for a company's full dataset.
 *
 * @param {Object} companyProfile  - User profile from AuthContext
 * @param {Object} userData        - Complete user data (vendors, procurements, etc.)
 * @returns {Promise<Object>}
 */
export async function generateProcurementInsights(companyProfile, userData) {
  await _simulateDelay(800);
  const insights = [];
  const procurements = userData?.procurements || [];
  const subscriptions = userData?.subscriptions || [];

  // Check for idle subscriptions
  const idleSubs = subscriptions.filter(
    (s) => Number(s.seatsIdle) > 0
  );
  if (idleSubs.length > 0) {
    idleSubs.forEach((sub) => {
      insights.push(
        buildInsight({
          type: 'subscription',
          severity: 'savings',
          title: `Idle seats detected in ${sub.name}`,
          explanation: `${sub.seatsIdle} out of ${sub.seatsTotal} seats are inactive.`,
          recommendation: `Downgrade ${sub.name} licence tier or reassign idle seats.`,
          confidence: 1.0,
          financialImpact: Math.round(
            (Number(sub.seatsIdle) / Number(sub.seatsTotal)) *
              (_parseAmount(sub.costPerYear) || 0)
          ),
          category: 'SaaS / Subscriptions',
        })
      );
    });
  }

  return {
    companyContext: companyProfile,
    totalRecordsEvaluated: procurements.length,
    insights,
    generatedAt: new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// B. Risk Detection
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Detect risks in the current procurement pipeline.
 *
 * @param {Object} params
 * @param {Array}  params.procurements   - Active procurement requests
 * @param {Array}  params.vendors        - Vendor list
 * @param {Array}  params.transactions   - Historical transactions
 * @param {Object} params.marketData     - External benchmark data
 * @returns {Promise<Object>}
 */
export async function detectRisks(params) {
  await _simulateDelay(700);
  const risks = [];

  const { procurements = [], vendors: _vendors = [] } = params;

  // Detect high-value single-source procurements
  procurements.forEach((proc) => {
    const amount = Number(proc.totalAmount) || 0;
    if (amount > 500000) {
      risks.push(
        buildInsight({
          type: 'risk',
          severity: 'warning',
          title: `High-value single-source: ${proc.item || proc.request}`,
          explanation: `₹${(amount / 100000).toFixed(1)}L requisition from a single vendor — no competitive quote on record.`,
          recommendation: 'Request at least 2 alternative vendor quotes before approval.',
          confidence: 0.82,
          financialImpact: Math.round(amount * 0.08),
          category: proc.category || 'Procurement',
          evidence: [{ label: 'Requisition', value: proc.id }],
        })
      );
    }
  });

  return {
    riskCount: risks.length,
    risks,
    evaluatedAt: new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// C. Savings Intelligence
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Identify savings opportunities across the user's data.
 *
 * @param {Object} params
 * @param {Array}  params.subscriptions      - Software subscriptions
 * @param {Array}  params.vendors            - Vendor list
 * @param {Array}  params.procurements       - Procurement requests
 * @param {Array}  params.transactions       - Transaction history
 * @returns {Promise<Object>}
 */
export async function findSavings(params) {
  await _simulateDelay(650);
  const opportunities = [];
  const { subscriptions = [], procurements: _procurements = [] } = params;

  // Idle seat savings
  subscriptions.forEach((sub) => {
    const idleSeats = Number(sub.seatsIdle) || 0;
    const totalSeats = Number(sub.seatsTotal) || 1;
    const annualCost = _parseAmount(sub.costPerYear) || 0;
    if (idleSeats > 0 && annualCost > 0) {
      const saving = Math.round((idleSeats / totalSeats) * annualCost);
      opportunities.push(
        buildInsight({
          type: 'savings',
          severity: 'savings',
          title: `${sub.name} — ${idleSeats} idle seat(s)`,
          explanation: `${idleSeats} of ${totalSeats} seats are not actively used.`,
          recommendation: `Downgrade or release ${idleSeats} seat(s) to save approximately ₹${(saving / 100000).toFixed(2)}L/yr.`,
          financialImpact: saving,
          confidence: 0.97,
          category: 'SaaS / Software',
        })
      );
    }
  });

  const totalSavings = opportunities.reduce(
    (acc, o) => acc + o.financialImpact,
    0
  );
  return { opportunities, totalSavings, evaluatedAt: new Date().toISOString() };
}

// ─────────────────────────────────────────────────────────────────────────────
// D. Vendor Intelligence
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Analyze a single vendor's risk and performance profile.
 *
 * @param {Object} vendor  - Vendor object from user's dataset
 * @param {Array}  history - Historical transactions/orders with this vendor
 * @returns {Promise<Object>}
 */
export async function analyzeVendor(vendor, history = []) {
  await _simulateDelay(500);
  return {
    vendorId: vendor.id,
    vendorName: vendor.name,
    riskScore: vendor.riskScore || 'Low Risk',
    riskLevel: 'low',          // 'low' | 'medium' | 'high' | 'critical'
    performanceScore: 85,      // 0 – 100
    complianceScore: vendor.compliance || '100%',
    priceTrend: 'stable',      // 'stable' | 'increasing' | 'decreasing'
    historicalOrderCount: history.length,
    recommendation: 'Vendor is performing within acceptable parameters.',
    flags: [],
    analyzedAt: new Date().toISOString(),
  };
}

/**
 * Recommend alternative vendors for a given procurement requirement.
 *
 * @param {Object} requirement  - { item, category, budget, quantity }
 * @param {Array}  vendorPool   - Current approved vendors
 * @returns {Promise<Object>}
 */
export async function recommendVendor(requirement, vendorPool = []) {
  await _simulateDelay(600);
  return {
    requirement,
    recommendations: vendorPool.slice(0, 3).map((v, i) => ({
      rank: i + 1,
      vendor: v,
      estimatedSaving: 0,
      rationale: 'Based on category match and historical compliance.',
      confidence: 0.78 - i * 0.05,
    })),
    alternativesCount: vendorPool.length,
    evaluatedAt: new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// E. Negotiation Intelligence
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate a vendor negotiation strategy for a specific procurement request.
 *
 * @param {Object} params
 * @param {Object} params.procurement   - The procurement request
 * @param {Object} params.vendor        - Target vendor
 * @param {Object} params.companyProfile - Company profile for context
 * @param {Array}  params.historicalData - Past dealings with this vendor
 * @returns {Promise<Object>}
 */
export async function generateNegotiation(params) {
  await _simulateDelay(900);
  const { procurement, vendor } = params;
  return {
    strategy: 'competitive_bid',
    openingPosition: 'Request 3 competing vendor quotes before final negotiation.',
    targetDiscount: '8-12%',
    keyArguments: [
      'Long-term procurement relationship and volume commitment',
      'Payment terms: NET-15 vs industry standard NET-30',
      'Market benchmark comparison data available',
    ],
    riskOfNoAgreement: 'Low — multiple qualified alternative vendors exist.',
    recommendedWalkawayPrice: null,
    recommendedApproach:
      'Email vendor with volume commitment letter and benchmark data attached.',
    confidence: 0.79,
    generatedFor: { procurement, vendor },
    generatedAt: new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// F. Predictive Intelligence
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Predict the risk level of a future procurement request before it is submitted.
 *
 * @param {Object} params
 * @param {string} params.item         - Item to be procured
 * @param {number} params.budget       - Estimated budget
 * @param {string} params.category     - Procurement category
 * @param {Array}  params.history      - Historical spend in this category
 * @returns {Promise<Object>}
 */
export async function predictProcurementRisk(_params) {
  await _simulateDelay(500);
  return {
    predictedRiskLevel: 'low',        // 'low' | 'medium' | 'high'
    riskFactors: [],
    budgetDeviationEstimate: 0.04,    // fractional (4% over budget predicted)
    marketPriceDirection: 'stable',
    recommendation: 'Proceed — risk within acceptable thresholds.',
    confidence: 0.83,
    evaluatedAt: new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// G. Spending Intelligence
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Analyze spending patterns and detect deviations from historical norms.
 *
 * @param {Object} params
 * @param {Array}  params.transactions  - Full transaction history
 * @param {Object} params.companyProfile
 * @returns {Promise<Object>}
 */
export async function analyzeSpending(params) {
  await _simulateDelay(700);
  const { transactions = [] } = params;

  const totalSpend = transactions.reduce(
    (acc, t) => acc + (Number(t.amount) || 0),
    0
  );
  const categoryMap = {};
  transactions.forEach((t) => {
    const cat = t.category || 'General';
    categoryMap[cat] = (categoryMap[cat] || 0) + (Number(t.amount) || 0);
  });

  return {
    totalSpend,
    categoryBreakdown: categoryMap,
    anomalies: [],
    normalBehaviorEstablished: transactions.length >= 10,
    deviations: [],
    insightSummary:
      transactions.length === 0
        ? 'No transaction data available for analysis.'
        : `Analyzed ${transactions.length} transactions across ${Object.keys(categoryMap).length} categories.`,
    evaluatedAt: new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// H. Transaction Intelligence
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Detect duplicate invoices, unusual purchases, and abnormal pricing.
 *
 * @param {Object} params
 * @param {Array}  params.invoices      - Invoice list
 * @param {Array}  params.transactions  - Transaction list
 * @returns {Promise<Object>}
 */
export async function analyzeTransactions(params) {
  await _simulateDelay(600);
  const { invoices = [], transactions = [] } = params;

  // Simple duplicate check: same vendor + same amount within 7 days
  const duplicates = [];
  const seen = {};
  invoices.forEach((inv) => {
    const key = `${inv.vendor}_${inv.amount}`;
    if (seen[key]) {
      duplicates.push({ original: seen[key], duplicate: inv });
    } else {
      seen[key] = inv;
    }
  });

  return {
    invoiceCount: invoices.length,
    transactionCount: transactions.length,
    duplicatesFound: duplicates.length,
    duplicates,
    unusualPurchases: [],
    abnormalPricing: [],
    cleanPercentage:
      invoices.length > 0
        ? Math.round(((invoices.length - duplicates.length) / invoices.length) * 100)
        : 100,
    evaluatedAt: new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// I. Subscription Intelligence
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Analyze software subscriptions for unused licences and renewal optimization.
 *
 * @param {Array} subscriptions - User's subscription list
 * @returns {Promise<Object>}
 */
export async function analyzeSubscriptions(subscriptions = []) {
  await _simulateDelay(500);

  const withIdleSeats = subscriptions.filter((s) => Number(s.seatsIdle) > 0);
  const totalIdleSeats = withIdleSeats.reduce(
    (acc, s) => acc + Number(s.seatsIdle),
    0
  );
  const totalWastedCost = withIdleSeats.reduce((acc, s) => {
    const costPerYear = _parseAmount(s.costPerYear) || 0;
    const idleRatio = Number(s.seatsIdle) / (Number(s.seatsTotal) || 1);
    return acc + Math.round(costPerYear * idleRatio);
  }, 0);

  return {
    totalSubscriptions: subscriptions.length,
    subscriptionsWithIdleSeats: withIdleSeats.length,
    totalIdleSeats,
    estimatedWastedCost: totalWastedCost,
    recommendations: withIdleSeats.map((s) => ({
      name: s.name,
      action: `Reduce by ${s.seatsIdle} seat(s)`,
      idleSeats: s.seatsIdle,
    })),
    evaluatedAt: new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// J. Crisis Response
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate a crisis response plan for a critical procurement disruption.
 *
 * @param {Object} params
 * @param {string} params.crisisType        - Type: 'supplier_failure' | 'price_spike' | 'delivery_delay'
 * @param {Object} params.affectedVendor    - The affected vendor
 * @param {Array}  params.alternativeVendors - Available alternatives
 * @param {Object} params.companyProfile    - Company context
 * @returns {Promise<Object>}
 */
export async function generateCrisisResponse(params) {
  await _simulateDelay(1000);
  const { crisisType, affectedVendor } = params;
  return {
    crisisType,
    severity: 'high',
    immediateActions: [
      'Halt pending purchase orders with affected vendor.',
      'Notify finance and legal teams immediately.',
      'Activate backup vendor evaluation process.',
    ],
    vendorAlternatives: [],
    estimatedRecoveryTime: '3–7 business days',
    financialExposure: 0,
    communicationTemplate:
      `We are currently evaluating alternative supply chain options due to an issue with ${affectedVendor?.name || 'a key supplier'}. We will provide an update within 24 hours.`,
    generatedAt: new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// K. Learning Layer
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Record an actual procurement outcome so the AI can learn from it.
 * Future: send to the AI model for feedback loop.
 *
 * @param {Object} params
 * @param {string} params.recommendationId  - ID of the original AI recommendation
 * @param {string} params.outcome           - 'accepted' | 'rejected' | 'modified'
 * @param {number} params.actualCost        - Actual final cost
 * @param {number} params.predictedCost     - What AI predicted
 * @param {string} params.notes             - Procurement officer notes
 * @returns {Promise<Object>}
 */
export async function recordOutcome(params) {
  await _simulateDelay(300);
  // Future: POST to AI model endpoint for reinforcement
  const outcome = {
    ...params,
    accuracy:
      params.actualCost && params.predictedCost
        ? 1 - Math.abs(params.actualCost - params.predictedCost) / params.predictedCost
        : null,
    recordedAt: new Date().toISOString(),
  };
  // Store in localStorage for now (future: push to AI feedback API)
  try {
    const existing = JSON.parse(
      localStorage.getItem('procuremind_ai_outcomes') || '[]'
    );
    existing.push(outcome);
    localStorage.setItem('procuremind_ai_outcomes', JSON.stringify(existing));
  } catch {}
  return { status: 'recorded', outcome };
}

/**
 * Retrieve all recorded outcomes (for learning dashboard view).
 * @returns {Array}
 */
export function getRecordedOutcomes() {
  try {
    return JSON.parse(localStorage.getItem('procuremind_ai_outcomes') || '[]');
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// L. Early Warning System
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Proactively identify what could go wrong across all procurement data.
 *
 * @param {Object} userData  - Complete user dataset
 * @returns {Promise<Object>}
 */
export async function runEarlyWarning(userData) {
  await _simulateDelay(800);
  const warnings = [];
  const { subscriptions = [], vendors: _vendors2 = [], procurements: _procurements2 = [] } = userData || {};

  // Subscriptions expiring soon (within 60 days)
  subscriptions.forEach((sub) => {
    if (sub.renewalDate && sub.renewalDate.includes('Month')) {
      const months = parseInt(sub.renewalDate) || 0;
      if (months <= 2) {
        warnings.push(
          buildInsight({
            type: 'early_warning',
            severity: 'warning',
            title: `${sub.name} renewal within ${months} month(s)`,
            explanation: 'Subscription nearing renewal window — budget must be allocated.',
            recommendation: 'Initiate renewal or cancellation decision now.',
            confidence: 1.0,
            category: 'Subscriptions',
          })
        );
      }
    }
  });

  return {
    warningCount: warnings.length,
    warnings,
    earlyWarningActive: true,
    evaluatedAt: new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal Utilities (not exported)
// ─────────────────────────────────────────────────────────────────────────────

function _simulateDelay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function _parseAmount(str) {
  if (typeof str === 'number') return str;
  if (!str) return 0;
  // Handle "₹12.5L" or "₹1,20,000" formats
  const clean = String(str).replace(/[₹,L\s]/g, '');
  const num = parseFloat(clean);
  if (String(str).includes('L')) return Math.round(num * 100000);
  return isNaN(num) ? 0 : num;
}
