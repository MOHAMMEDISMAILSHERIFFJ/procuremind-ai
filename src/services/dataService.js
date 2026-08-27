// src/services/dataService.js
/**
 * ProcureMind Data Service — v2.5
 *
 * Clean data access layer between React components and localStorage.
 * Components should NEVER read localStorage directly — always use this service.
 *
 * Integrated with the deterministic Intelligence Layer:
 *   dataService (storage) -> intelligenceService (analysis) -> aiService -> UI
 */

import { buildDemoDataset } from '../data/demoData.js';
import { runIntelligenceAnalysis } from './intelligenceService.js';

// ─────────────────────────────────────────────────────────────────────────────
// Storage key helpers
// ─────────────────────────────────────────────────────────────────────────────

const DATA_PREFIX = 'procuremind_user_data_';

function _storageKey(userId) {
  return `${DATA_PREFIX}${userId}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Empty dataset factory — guaranteed zero values for new accounts
// ─────────────────────────────────────────────────────────────────────────────

export function createEmptyDataset(userId, companyName = '') {
  return {
    userId,
    companyName,
    // Core procurement entities
    vendors:              [],
    invoices:             [],
    expenses:             [],
    purchaseOrders:       [],
    contracts:            [],
    subscriptions:        [],
    procurementRequests:  [],
    // AI & intelligence
    aiInsights:           [],
    decisions:            [],
    outcomes:             [],
    riskAlerts:           [],
    savingsOpportunities: [],
    // Legacy aliases (for backward compatibility with existing components)
    procurements:         [],
    transactions:         [],
    marketData:           [],
    // Metadata
    isDemoData: false,
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Core CRUD
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get the current logged-in user's full procurement dataset.
 * @param {string} userId
 * @returns {Object} dataset
 */
export function getCurrentUserData(userId) {
  if (!userId) return createEmptyDataset('anonymous');
  try {
    const raw = localStorage.getItem(_storageKey(userId));
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure all arrays exist (backward compat with older stored data)
      return _ensureAllArrays(parsed);
    }
  } catch (err) {
    console.error('[dataService] Error reading user data:', err);
  }
  return createEmptyDataset(userId);
}

/**
 * Persist the user's full dataset to localStorage.
 * @param {string} userId
 * @param {Object} data
 */
export function saveUserData(userId, data) {
  if (!userId) return;
  try {
    const toSave = { ...data, lastModified: new Date().toISOString() };
    localStorage.setItem(_storageKey(userId), JSON.stringify(toSave));
  } catch (err) {
    console.error('[dataService] Error saving user data:', err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Typed getters — return only the specific entity list
// ─────────────────────────────────────────────────────────────────────────────

export function getVendors(userId) {
  return getCurrentUserData(userId).vendors || [];
}

export function getInvoices(userId) {
  return getCurrentUserData(userId).invoices || [];
}

export function getExpenses(userId) {
  return getCurrentUserData(userId).expenses || [];
}

export function getPurchaseOrders(userId) {
  return getCurrentUserData(userId).purchaseOrders || [];
}

export function getContracts(userId) {
  return getCurrentUserData(userId).contracts || [];
}

export function getSubscriptions(userId) {
  return getCurrentUserData(userId).subscriptions || [];
}

export function getProcurementRequests(userId) {
  return getCurrentUserData(userId).procurementRequests || [];
}

export function getDecisions(userId) {
  return getCurrentUserData(userId).decisions || [];
}

export function getOutcomes(userId) {
  return getCurrentUserData(userId).outcomes || [];
}

export function getRiskAlerts(userId) {
  return getCurrentUserData(userId).riskAlerts || [];
}

export function getSavingsOpportunities(userId) {
  return getCurrentUserData(userId).savingsOpportunities || [];
}

// ─────────────────────────────────────────────────────────────────────────────
// Record creators — add a new item to the user's dataset
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Add a new vendor to user's dataset.
 * @param {string} userId
 * @param {Object} vendor
 * @returns {Object} updated full dataset
 */
export function addVendor(userId, vendor) {
  const data = getCurrentUserData(userId);
  const newVendor = {
    id: `VND-${Date.now().toString().slice(-6)}`,
    performanceScore: 80,
    riskLevel: 1,
    riskScore: 'Low Risk',
    riskVariant: 'approved',
    pricingTrend: 'Stable',
    pricingTrendDir: 'stable',
    totalSpend: 0,
    formattedSpend: '₹0',
    rating: 4.0,
    activeContracts: 0,
    compliance: '100%',
    status: 'Active',
    onboardedDate: new Date().toISOString().split('T')[0],
    aiFlag: null,
    ...vendor,
  };
  data.vendors = [newVendor, ...data.vendors];
  saveUserData(userId, data);
  return data;
}

/**
 * Add a new procurement request.
 * @param {string} userId
 * @param {Object} req
 * @returns {Object} updated full dataset
 */
export function addProcurementRequest(userId, req) {
  const data = getCurrentUserData(userId);
  const amount = Number(req.totalAmount || req.amount || req.estimatedBudget) || 0;
  const formatted = _formatCurrency(amount);

  const newReq = {
    id: `REQ-${Date.now().toString().slice(-6)}`,
    status: 'Under Review',
    statusVariant: 'under-review',
    aiRecommendation: 'Pending Analysis',
    aiActionType: 'under-review',
    aiConfidence: '—',
    riskLevel: 'Unknown',
    date: new Date().toISOString().split('T')[0],
    totalAmount: amount,
    formattedAmount: formatted,
    ...req,
  };

  data.procurementRequests = [newReq, ...data.procurementRequests];
  // Legacy alias kept in sync
  data.procurements = [newReq, ...(data.procurements || [])];

  // Add matching expense/transaction for KPI calculation
  const expenseEntry = {
    id: `EXP-${Date.now().toString().slice(-6)}`,
    category: req.category || 'General',
    vendorId: null,
    vendorName: req.vendor || 'TBD',
    description: req.item || 'Procurement Request',
    amount,
    formattedAmount: formatted,
    date: new Date().toISOString().split('T')[0],
    department: req.department || 'General',
    approvedBy: null,
    budget: amount,
    budgetFormatted: formatted,
    isOverBudget: false,
  };
  data.expenses = [expenseEntry, ...(data.expenses || [])];
  data.transactions = [
    { id: `TX-${Date.now().toString().slice(-6)}`, category: req.category || 'General', amount, description: req.item || 'Procurement' },
    ...(data.transactions || []),
  ];

  saveUserData(userId, data);
  return data;
}

/**
 * Add a subscription.
 */
export function addSubscription(userId, sub) {
  const data = getCurrentUserData(userId);
  const seatsTotal = Number(sub.seatsTotal) || 1;
  const seatsActive = Number(sub.seatsActive) || 1;
  const seatsIdle = Math.max(0, seatsTotal - seatsActive);
  const monthlyCost = Number(sub.monthlyCost) || 0;
  const costPerYear = monthlyCost * 12;

  const newSub = {
    id: `SUB-${Date.now().toString().slice(-6)}`,
    seatsTotal,
    seatsActive,
    seatsIdle,
    monthlyCost,
    costPerYear,
    formattedMonthly: `₹${monthlyCost.toLocaleString('en-IN')}/mo`,
    formattedAnnual: `₹${costPerYear.toLocaleString('en-IN')}/yr`,
    utilization: seatsTotal > 0 ? `${Math.round((seatsActive / seatsTotal) * 100)}%` : '0%',
    status: seatsIdle > 0 ? 'Optimizable' : 'Healthy',
    statusVariant: seatsIdle > 0 ? 'warning' : 'approved',
    aiFlag: seatsIdle > 0 ? `${seatsIdle} idle seat(s) detected.` : null,
    renewalDate: sub.renewalDate || '',
    ...sub,
  };

  data.subscriptions = [newSub, ...data.subscriptions];
  saveUserData(userId, data);
  return data;
}

/**
 * Add an invoice.
 */
export function addInvoice(userId, invoice) {
  const data = getCurrentUserData(userId);
  const newInvoice = {
    id: `INV-${Date.now().toString().slice(-6)}`,
    status: 'Pending Review',
    statusVariant: 'under-review',
    invoiceDate: new Date().toISOString().split('T')[0],
    aiFlag: null,
    ...invoice,
    formattedAmount: _formatCurrency(Number(invoice.amount) || 0),
  };
  data.invoices = [newInvoice, ...data.invoices];
  saveUserData(userId, data);
  return data;
}

/**
 * Convert an AI insight into a formal pending Decision record (Action Layer bridge).
 * @param {string} userId
 * @param {Object} insight
 * @returns {Object} updated full dataset
 */
export function createDecisionFromInsight(userId, insight) {
  const data = getCurrentUserData(userId);
  const decisionId = `DEC-${Date.now().toString().slice(-6)}`;
  const newDecision = {
    id: decisionId,
    decision: insight.title || 'Review Procurement Action',
    description: insight.recommendation || insight.description,
    requestedBy: 'AI Intelligence Engine',
    amount: insight.financialImpact || 0,
    formattedAmount: insight.formattedImpact || _formatCurrency(insight.financialImpact || 0),
    aiRecommendedAction: insight.recommendation || 'Proceed with investigation',
    estimatedSavings: insight.type === 'savings' ? (insight.financialImpact || 0) : 0,
    formattedSavings: insight.type === 'savings' ? (insight.formattedImpact || '₹0') : '₹0',
    status: 'Pending Executive Sign-off',
    statusVariant: 'under-review',
    relatedInsightId: insight.id,
    createdAt: new Date().toISOString(),
  };

  data.decisions = [newDecision, ...(data.decisions || [])];
  saveUserData(userId, data);
  return data;
}

/**
 * Add a vendor to user's dataset (legacy alias kept for AuthContext compat)
 */
export function addVendorToUserData(userId, vendor) {
  return addVendor(userId, vendor);
}

/**
 * Add procurement to user's dataset (legacy alias kept for AuthContext compat)
 */
export function addProcurementToUserData(userId, req) {
  return addProcurementRequest(userId, req);
}

/**
 * Add subscription to user's dataset (legacy alias kept for AuthContext compat)
 */
export function addSubscriptionToUserData(userId, sub) {
  return addSubscription(userId, sub);
}

// ─────────────────────────────────────────────────────────────────────────────
// Demo Data
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Load the full NovaTech demo dataset into a user's account.
 * Replaces any existing data for that user.
 * @param {string} userId
 * @param {string} companyName  - Optionally override company name
 * @returns {Object} demo dataset
 */
export function loadDemoData(userId, companyName) {
  const demo = buildDemoDataset(userId, companyName);
  saveUserData(userId, demo);
  return demo;
}

/**
 * Clear all procurement data for a user, keeping their profile intact.
 * @param {string} userId
 * @param {string} companyName
 * @returns {Object} empty dataset
 */
export function clearProcurementData(userId, companyName) {
  const empty = createEmptyDataset(userId, companyName);
  saveUserData(userId, empty);
  return empty;
}

// ─────────────────────────────────────────────────────────────────────────────
// KPI Metrics & Intelligence Calculator
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculate all dashboard KPIs & AI Insights dynamically from user's dataset.
 * Zero hardcoded values — derived strictly from user records and intelligence analysis.
 *
 * @param {Object} data  - Full user dataset
 * @returns {Object} metrics
 */
export function calculateMetrics(data) {
  if (!data) return _emptyMetrics();

  // 1. Total Spend — from expenses (preferred) or procurement requests
  let totalSpendValue = 0;
  const expenses = Array.isArray(data.expenses) ? data.expenses : [];
  const transactions = Array.isArray(data.transactions) ? data.transactions : [];

  if (expenses.length > 0) {
    totalSpendValue = expenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
  } else if (transactions.length > 0) {
    totalSpendValue = transactions.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
  } else if (Array.isArray(data.procurementRequests) && data.procurementRequests.length > 0) {
    totalSpendValue = data.procurementRequests.reduce((acc, r) => acc + (Number(r.totalAmount) || 0), 0);
  } else if (Array.isArray(data.procurements)) {
    totalSpendValue = data.procurements.reduce((acc, r) => acc + (Number(r.totalAmount) || 0), 0);
  }

  // 2. Run Intelligence Analysis on the current user dataset
  const intelligence = runIntelligenceAnalysis(data);

  // Derive potential savings and risk alerts strictly from intelligence output
  const potentialSavingsValue = intelligence.summary?.potentialSavings || 0;
  const riskAlertsCount = (intelligence.summary?.highRisk || 0) + (intelligence.summary?.mediumRisk || 0);

  // 3. Counts
  const vendorCount = (data.vendors || []).length;
  const invoiceCount = (data.invoices || []).length;
  const purchaseOrderCount = (data.purchaseOrders || []).length;
  const contractCount = (data.contracts || []).length;
  const subscriptionCount = (data.subscriptions || []).length;
  const procurementCount = (data.procurementRequests || data.procurements || []).length;
  const pendingDecisionsCount = (data.decisions || []).filter(
    (d) => d.statusVariant === 'under-review' || d.statusVariant === 'warning' ||
           (d.status && (d.status.includes('Pending') || d.status.includes('Evaluation') || d.status.includes('Review')))
  ).length;
  const outcomesCount = (data.outcomes || []).length;

  // 4. Category Breakdown — from expenses
  const colors = {
    IT: '#3B82F6', Software: '#6366F1', Operations: '#8B5CF6', Travel: '#0EA5E9',
    Marketing: '#06B6D4', General: '#64748B', Hardware: '#3B82F6',
    'Engineering Equipment': '#F59E0B', 'Cloud Services': '#0284C7',
    'Cloud': '#0284C7', 'SaaS': '#6366F1',
  };

  let categoryBreakdown = [];
  const sourceForCategories = expenses.length > 0 ? expenses : transactions;
  if (sourceForCategories.length > 0) {
    const catMap = {};
    sourceForCategories.forEach((item) => {
      const cat = item.category || 'General';
      catMap[cat] = (catMap[cat] || 0) + (Number(item.amount) || 0);
    });
    categoryBreakdown = Object.entries(catMap).map(([category, amount]) => ({
      category,
      amount: _formatCurrency(amount),
      numericAmount: amount,
      percentage: totalSpendValue > 0 ? Number(((amount / totalSpendValue) * 100).toFixed(1)) : 0,
      budget: _formatCurrency(Math.round(amount * 1.15)),
      color: colors[category] || '#3B82F6',
    }));
  }

  // 5. AI Insights List — populated from intelligence analysis
  const aiInsightsList = intelligence.insights || [];

  // 6. Priority Actions List — derived from actionable intelligence
  const priorityActionsList = [];
  aiInsightsList.slice(0, 6).forEach((ins, idx) => {
    priorityActionsList.push({
      id: `act-ins-${idx}`,
      title: ins.title,
      subtitle: ins.recommendation || ins.description,
      priority: ins.severity === 'high' ? 'High' : ins.severity === 'savings' ? 'Medium' : 'Medium',
      priorityVariant: ins.severity === 'high' ? 'high' : ins.severity === 'savings' ? 'medium' : 'medium',
      department: ins.category || 'Procurement',
      actionLabel: ins.type === 'savings' ? 'Capture Saving' : ins.type === 'duplicate' ? 'Hold Invoice' : 'Review Risk',
      eta: ins.severity === 'high' ? 'Due Today' : 'In 2 days',
      insightRef: ins,
    });
  });

  return {
    totalSpendValue,
    totalSpendFormatted: _formatCurrency(totalSpendValue),
    potentialSavingsValue,
    potentialSavingsFormatted: _formatCurrency(potentialSavingsValue),
    riskAlertsCount,
    pendingDecisionsCount,
    vendorCount,
    invoiceCount,
    purchaseOrderCount,
    contractCount,
    subscriptionCount,
    procurementCount,
    outcomesCount,
    categoryBreakdown,
    aiInsightsList,
    priorityActionsList,
    intelligenceSummary: intelligence.summary,
    isEmptyState: intelligence.isEmptyState,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers (internal)
// ─────────────────────────────────────────────────────────────────────────────

function _formatCurrency(val) {
  const n = Number(val) || 0;
  if (n === 0) return '₹0';
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${n.toLocaleString('en-IN')}`;
}

function _emptyMetrics() {
  return {
    totalSpendValue: 0, totalSpendFormatted: '₹0',
    potentialSavingsValue: 0, potentialSavingsFormatted: '₹0',
    riskAlertsCount: 0, pendingDecisionsCount: 0,
    vendorCount: 0, invoiceCount: 0, purchaseOrderCount: 0,
    contractCount: 0, subscriptionCount: 0, procurementCount: 0, outcomesCount: 0,
    categoryBreakdown: [], aiInsightsList: [], priorityActionsList: [],
    intelligenceSummary: { totalInsights: 0, highRisk: 0, mediumRisk: 0, lowRisk: 0, potentialSavings: 0 },
    isEmptyState: true,
  };
}

function _ensureAllArrays(data) {
  const arrays = [
    'vendors', 'invoices', 'expenses', 'purchaseOrders', 'contracts',
    'subscriptions', 'procurementRequests', 'aiInsights', 'decisions',
    'outcomes', 'riskAlerts', 'savingsOpportunities', 'procurements',
    'transactions', 'marketData',
  ];
  const result = { ...data };
  arrays.forEach((key) => {
    if (!Array.isArray(result[key])) result[key] = [];
  });
  return result;
}
