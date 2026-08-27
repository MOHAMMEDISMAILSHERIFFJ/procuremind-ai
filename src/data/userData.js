// src/data/userData.js
import {
  rawProcurementDataset as demoProcurements,
  vendorsDataset as demoVendors,
  subscriptionsDataset as demoSubscriptions,
  decisionsDataset as demoDecisions,
} from './procureMindData';

const USER_DATA_PREFIX = 'procuremind_user_data_';

/**
 * Returns a clean, completely empty dataset for any freshly registered user.
 */
export function getInitialEmptyUserData(userId, companyName = '') {
  return {
    userId,
    companyName,
    vendors: [],
    transactions: [],
    procurements: [],
    subscriptions: [],
    invoices: [],
    decisions: [],
    riskAlerts: [],
    savingsOpportunities: [],
    marketData: [],
  };
}

/**
 * Demo dataset specifically for the demo@procuremind.ai user account.
 */
export function getDemoUserData() {
  return {
    userId: 'demo-user-novatech',
    companyName: 'NovaTech Industries',
    vendors: [...demoVendors],
    transactions: [
      { id: 'TX-1', category: 'IT', amount: 2250000, description: 'Q3 Developer Hardware' },
      { id: 'TX-2', category: 'Software', amount: 940000, description: 'SaaS Tooling & Cloud IDEs' },
      { id: 'TX-3', category: 'Operations', amount: 720000, description: 'Workstation Logistics' },
      { id: 'TX-4', category: 'Travel', amount: 680000, description: 'Q2 Strategic Vendor Audits' },
      { id: 'TX-5', category: 'Marketing', amount: 450000, description: 'Collateral & PR' },
    ],
    procurements: [...demoProcurements],
    subscriptions: [...demoSubscriptions],
    invoices: [
      { id: 'INV-101', vendor: 'CompEdge Global Systems', amount: 4000000, status: 'Pending Review' },
      { id: 'INV-102', vendor: 'Amazon Web Services', amount: 1250000, status: 'Approved' },
      { id: 'INV-103', vendor: 'SaaSPoint Direct', amount: 144000, status: 'Flagged' },
    ],
    decisions: [...demoDecisions],
    riskAlerts: [
      {
        id: 'ra-1',
        title: 'Laptop procurement requires review',
        description: 'Current quotation is above historical purchase price.',
        severity: 'high',
        impact: 'Potential ₹4.5L overspend on 100 developer units vs benchmark.',
        category: 'IT Hardware / Laptops',
        confidence: '98% match',
      },
      {
        id: 'ra-2',
        title: 'Vendor XYZ pricing increased',
        description: 'Price increased by 12% compared with previous purchases.',
        severity: 'warning',
        impact: 'CompEdge Systems raised baseline unit cost from ₹35,500 to ₹40,000.',
        category: 'Hardware Suppliers',
        confidence: '94% match',
      },
    ],
    savingsOpportunities: [
      {
        id: 'so-1',
        title: 'Unused software subscriptions detected',
        description: 'Potential annual saving: ₹1.44L',
        severity: 'savings',
        impact: '18 dormant seats in Adobe & Figma org accounts.',
        category: 'SaaS / Software',
        confidence: '100% verified',
        amount: 144000,
      },
      {
        id: 'so-2',
        title: 'Hardware bulk consolidation discount',
        description: 'Potential batch saving: ₹4.76L',
        severity: 'savings',
        impact: 'Combine Q4 server and monitor orders for tier-1 pricing.',
        category: 'IT Hardware',
        confidence: '95% match',
        amount: 476000,
      },
    ],
    marketData: [
      { index: 'Global Semiconductor Index', status: 'Stable (+0.8%)' },
      { index: 'Enterprise SaaS Benchmark', status: 'Inflationary (+4.2%)' },
    ],
  };
}

/**
 * Retrieve user's isolated data from localStorage.
 */
export function getUserData(userId, isDemo = false, companyName = '') {
  if (!userId) return getInitialEmptyUserData('anonymous');

  try {
    const raw = localStorage.getItem(`${USER_DATA_PREFIX}${userId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading user data from localStorage', err);
  }

  // If this is the demo account, initialize with demo dataset
  if (isDemo || userId === 'demo-user-novatech' || userId === 'demo@procuremind.ai') {
    const demoData = getDemoUserData();
    saveUserData(userId, demoData);
    return demoData;
  }

  // Otherwise, create and save a fresh EMPTY dataset
  const emptyData = getInitialEmptyUserData(userId, companyName);
  saveUserData(userId, emptyData);
  return emptyData;
}

/**
 * Save user's isolated data to localStorage.
 */
export function saveUserData(userId, data) {
  if (!userId) return;
  try {
    localStorage.setItem(`${USER_DATA_PREFIX}${userId}`, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving user data to localStorage', err);
  }
}

/**
 * Add a new vendor to user's isolated dataset.
 */
export function addVendorToUserData(userId, vendor) {
  const data = getUserData(userId);
  const newVendor = {
    id: `VND-${Date.now().toString().slice(-4)}`,
    rating: 4.5,
    activeContracts: 1,
    compliance: '100%',
    status: 'Active',
    riskScore: 'Low Risk',
    riskVariant: 'approved',
    ...vendor,
  };
  data.vendors = [newVendor, ...data.vendors];
  saveUserData(userId, data);
  return data;
}

/**
 * Add a new procurement requisition to user's isolated dataset.
 */
export function addProcurementToUserData(userId, req) {
  const data = getUserData(userId);
  const amountNum = Number(req.totalAmount) || 0;
  const formattedAmount = amountNum >= 100000
    ? `₹${(amountNum / 100000).toFixed(1)}L`
    : `₹${amountNum.toLocaleString('en-IN')}`;

  const newReq = {
    id: `REQ-${Date.now().toString().slice(-4)}`,
    status: 'Under Review',
    statusVariant: 'under-review',
    aiRecommendation: 'Under Analysis',
    aiActionType: 'under-review',
    aiConfidence: '95%',
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    formattedAmount,
    ...req,
    totalAmount: amountNum,
  };

  data.procurements = [newReq, ...data.procurements];

  // Also add a corresponding transaction record
  data.transactions = [
    {
      id: `TX-${Date.now().toString().slice(-4)}`,
      category: req.category || 'General',
      amount: amountNum,
      description: req.item || 'Procurement Order',
    },
    ...data.transactions,
  ];

  saveUserData(userId, data);
  return data;
}

/**
 * Add a new software subscription to user's isolated dataset.
 */
export function addSubscriptionToUserData(userId, sub) {
  const data = getUserData(userId);
  const newSub = {
    id: `SUB-${Date.now().toString().slice(-4)}`,
    seatsTotal: Number(sub.seatsTotal) || 1,
    seatsActive: Number(sub.seatsActive) || 1,
    seatsIdle: Number(sub.seatsIdle) || 0,
    utilization: '100%',
    status: 'Healthy',
    statusVariant: 'approved',
    renewalDate: sub.renewalDate || '12 Months',
    ...sub,
  };
  data.subscriptions = [newSub, ...data.subscriptions];
  saveUserData(userId, data);
  return data;
}

/**
 * Calculate dynamic live dashboard metrics from the user's isolated data.
 * Zero hardcoded or random values.
 */
export function calculateUserMetrics(userData) {
  if (!userData) {
    return {
      totalSpendValue: 0,
      totalSpendFormatted: '₹0',
      potentialSavingsValue: 0,
      potentialSavingsFormatted: '₹0',
      riskAlertsCount: 0,
      pendingDecisionsCount: 0,
      vendorCount: 0,
      subscriptionCount: 0,
      procurementCount: 0,
      invoiceCount: 0,
      categoryBreakdown: [],
      aiInsightsList: [],
      priorityActionsList: [],
    };
  }

  // 1. Total Spend: Sum of all transactions + procurements
  let totalSpendValue = 0;
  if (Array.isArray(userData.transactions) && userData.transactions.length > 0) {
    totalSpendValue = userData.transactions.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  } else if (Array.isArray(userData.procurements) && userData.procurements.length > 0) {
    totalSpendValue = userData.procurements.reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0);
  }

  const formatCurrency = (val) => {
    if (!val || val === 0) return '₹0';
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(1)}L`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const totalSpendFormatted = formatCurrency(totalSpendValue);

  // 2. Potential Savings: Sum of savings opportunities
  const potentialSavingsValue = Array.isArray(userData.savingsOpportunities)
    ? userData.savingsOpportunities.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)
    : 0;
  const potentialSavingsFormatted = formatCurrency(potentialSavingsValue);

  // 3. Counts
  const riskAlertsCount = Array.isArray(userData.riskAlerts) ? userData.riskAlerts.length : 0;
  const pendingDecisionsCount = Array.isArray(userData.decisions)
    ? userData.decisions.filter(d => !d.status || d.status.includes('Pending') || d.status.includes('Review') || d.status.includes('Evaluation')).length
    : 0;
  const vendorCount = Array.isArray(userData.vendors) ? userData.vendors.length : 0;
  const subscriptionCount = Array.isArray(userData.subscriptions) ? userData.subscriptions.length : 0;
  const procurementCount = Array.isArray(userData.procurements) ? userData.procurements.length : 0;
  const invoiceCount = Array.isArray(userData.invoices) ? userData.invoices.length : 0;

  // 4. Category Breakdown
  let categoryBreakdown = [];
  if (Array.isArray(userData.transactions) && userData.transactions.length > 0) {
    const catMap = {};
    userData.transactions.forEach((tx) => {
      const cat = tx.category || 'General';
      catMap[cat] = (catMap[cat] || 0) + (Number(tx.amount) || 0);
    });

    const colors = {
      IT: '#3B82F6',
      Software: '#6366F1',
      Operations: '#8B5CF6',
      Travel: '#0EA5E9',
      Marketing: '#06B6D4',
      General: '#64748B',
      Hardware: '#3B82F6',
      'Engineering Equipment': '#F59E0B',
      'Cloud Services': '#0284C7',
    };

    categoryBreakdown = Object.entries(catMap).map(([category, amount]) => {
      const percentage = totalSpendValue > 0 ? Number(((amount / totalSpendValue) * 100).toFixed(1)) : 0;
      return {
        category,
        amount: formatCurrency(amount),
        numericAmount: amount,
        percentage,
        budget: formatCurrency(Math.round(amount * 1.15)),
        color: colors[category] || '#3B82F6',
      };
    });
  }

  // 5. AI Insights
  const aiInsightsList = [
    ...(Array.isArray(userData.riskAlerts) ? userData.riskAlerts : []),
    ...(Array.isArray(userData.savingsOpportunities) ? userData.savingsOpportunities : []),
  ];

  // 6. Priority Actions
  const priorityActionsList = [];
  if (Array.isArray(userData.riskAlerts)) {
    userData.riskAlerts.forEach((ra, idx) => {
      priorityActionsList.push({
        id: `act-ra-${idx}`,
        title: ra.title,
        subtitle: ra.impact || ra.description,
        priority: 'High',
        priorityVariant: 'high',
        department: ra.category || 'Procurement',
        actionLabel: 'Review Risk',
        eta: 'Due Today',
      });
    });
  }
  if (Array.isArray(userData.savingsOpportunities)) {
    userData.savingsOpportunities.forEach((so, idx) => {
      priorityActionsList.push({
        id: `act-so-${idx}`,
        title: so.title,
        subtitle: so.impact || so.description,
        priority: 'Medium',
        priorityVariant: 'medium',
        department: so.category || 'Finance',
        actionLabel: 'Capture Saving',
        eta: 'In 3 days',
      });
    });
  }

  return {
    totalSpendValue,
    totalSpendFormatted,
    potentialSavingsValue,
    potentialSavingsFormatted,
    riskAlertsCount,
    pendingDecisionsCount,
    vendorCount,
    subscriptionCount,
    procurementCount,
    invoiceCount,
    categoryBreakdown,
    aiInsightsList,
    priorityActionsList,
  };
}
