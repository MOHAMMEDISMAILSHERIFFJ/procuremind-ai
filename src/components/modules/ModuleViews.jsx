// src/components/modules/ModuleViews.jsx
import React, { useState, useMemo } from 'react';
import {
  ProcurementIcon,
  AiAnalysisIcon,
  VendorsIcon,
  SubscriptionsIcon,
  DecisionsIcon,
  SparklesIcon,
  PlusIcon,
  CheckCircleIcon,
  ShieldAlertIcon,
  TrendingUpIcon,
  ChevronRightIcon,
} from '../icons/Icons';
import { Badge } from '../common/Badge';
import { useAuth } from '../../context/useAuth';
import { searchRecords } from '../../services/dataService';

// ─────────────────────────────────────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────────────────────────────────────

function formatCurrency(val) {
  const n = Number(val) || 0;
  if (n === 0) return '₹0';
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${n.toLocaleString('en-IN')}`;
}

function EmptyState({ icon, title, subtitle, action, onAction }) {
  return (
    <div className="module-empty-state">
      <div className="empty-state-icon">{icon || <SparklesIcon size={28} />}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-subtitle">{subtitle}</p>
      {action && (
        <button type="button" className="btn-add-record" onClick={onAction}>
          <PlusIcon size={13} />
          <span>{action}</span>
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Module Container
// ─────────────────────────────────────────────────────────────────────────────

export const ModuleContainer = ({ title, subtitle, icon, badge, onAddAction, addLabel, children }) => {
  const { currentUser } = useAuth();
  return (
    <main className="dashboard-content">
      <div className="module-header-card">
        <div className="module-header-left">
          <div className="module-header-icon">{icon}</div>
          <div>
            <div className="module-title-row">
              <h1 className="module-title">{title}</h1>
              {badge && <span className="module-badge">{badge}</span>}
            </div>
            <p className="module-subtitle">{subtitle}</p>
          </div>
        </div>
        <div className="module-header-right">
          <div className="module-header-org">
            <span className="org-label">Entity:</span>
            <span className="org-value">{currentUser?.companyName || '—'}</span>
          </div>
          {onAddAction && (
            <button type="button" className="btn-add-record" onClick={onAddAction}>
              <PlusIcon size={14} />
              <span>{addLabel || 'Add Record'}</span>
            </button>
          )}
        </div>
      </div>
      {children}
    </main>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. Procurement Module — Requests, POs, Invoices, Expenses
// ─────────────────────────────────────────────────────────────────────────────

export const ProcurementModule = () => {
  const { userData, addProcurement } = useAuth();
  const [activeTab, setActiveTab] = useState('requests');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    item: '', category: 'IT', department: '', quantity: '1',
    estimatedBudget: '', purchaseIntent: '', requiredDate: '', vendor: '',
  });

  const rawProcReqs       = userData?.procurementRequests || userData?.procurements || [];
  const rawPurchaseOrders = userData?.purchaseOrders || [];
  const rawInvoices       = userData?.invoices || [];
  const rawExpenses       = userData?.expenses || [];

  // Filtered lists
  const procReqs = useMemo(() => {
    const filters = {};
    if (categoryFilter !== 'all') filters.category = categoryFilter;
    if (statusFilter !== 'all') filters.status = statusFilter;
    const list = userData?.procurementRequests || userData?.procurements || [];
    return searchRecords(list, searchQuery, ['id', 'item', 'request', 'vendor', 'category', 'department', 'aiRecommendation', 'status', 'totalAmount', 'date'], filters);
  }, [userData?.procurementRequests, userData?.procurements, searchQuery, categoryFilter, statusFilter]);

  const purchaseOrders = useMemo(() => {
    const filters = {};
    if (categoryFilter !== 'all') filters.category = categoryFilter;
    const list = userData?.purchaseOrders || [];
    return searchRecords(list, searchQuery, ['id', 'description', 'vendorName', 'category', 'status', 'totalAmount'], filters);
  }, [userData?.purchaseOrders, searchQuery, categoryFilter]);

  const invoices = useMemo(() => {
    const list = userData?.invoices || [];
    return searchRecords(list, searchQuery, ['id', 'vendorName', 'vendor', 'description', 'status', 'amount', 'aiFlag']);
  }, [userData?.invoices, searchQuery]);

  const expenses = useMemo(() => {
    const filters = {};
    if (categoryFilter !== 'all') filters.category = categoryFilter;
    const list = userData?.expenses || [];
    return searchRecords(list, searchQuery, ['id', 'description', 'vendorName', 'category', 'department', 'amount', 'date'], filters);
  }, [userData?.expenses, searchQuery, categoryFilter]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.item.trim() || !formData.estimatedBudget) return;
    addProcurement({
      item: formData.item.trim(),
      category: formData.category,
      department: formData.department.trim() || 'General',
      quantity: Number(formData.quantity) || 1,
      estimatedBudget: Number(formData.estimatedBudget),
      totalAmount: Number(formData.estimatedBudget),
      purchaseIntent: formData.purchaseIntent.trim(),
      requiredDate: formData.requiredDate,
      vendor: formData.vendor.trim() || 'TBD',
    });
    setFormData({ item: '', category: 'IT', department: '', quantity: '1', estimatedBudget: '', purchaseIntent: '', requiredDate: '', vendor: '' });
    setShowModal(false);
  };

  const TABS = [
    { key: 'requests',  label: 'Procurement Requests', count: rawProcReqs.length },
    { key: 'pos',       label: 'Purchase Orders',      count: rawPurchaseOrders.length },
    { key: 'invoices',  label: 'Invoices',             count: rawInvoices.length },
    { key: 'expenses',  label: 'Expenses',             count: rawExpenses.length },
  ];

  return (
    <ModuleContainer
      title="Procurement Management"
      subtitle="Requests, purchase orders, invoices, and expense tracking"
      icon={<ProcurementIcon size={22} />}
      onAddAction={() => setShowModal(true)}
      addLabel="New Procurement Request"
    >
      {/* Tab Bar */}
      <div className="module-tab-bar">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`module-tab-btn ${activeTab === t.key ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(t.key);
              setSearchQuery('');
              setCategoryFilter('all');
              setStatusFilter('all');
            }}
          >
            {t.label}
            <span className="tab-count-badge">{t.count}</span>
          </button>
        ))}
      </div>

      {/* ── Search & Filter Toolbar ── */}
      <div className="module-filter-toolbar">
        <div className="module-filter-left">
          <div className="module-search-wrapper">
            <span className="module-search-icon">🔍</span>
            <input
              type="text"
              className="module-search-input"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {(activeTab === 'requests' || activeTab === 'pos' || activeTab === 'expenses') && (
            <select
              className="module-select-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="IT">IT Hardware</option>
              <option value="Software">Software & SaaS</option>
              <option value="Cloud Services">Cloud Services</option>
              <option value="Operations">Operations</option>
              <option value="Engineering Equipment">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Travel">Travel</option>
              <option value="General">General</option>
            </select>
          )}

          {activeTab === 'requests' && (
            <select
              className="module-select-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          )}

          {(searchQuery || categoryFilter !== 'all' || statusFilter !== 'all') && (
            <button
              type="button"
              className="btn-filter-clear"
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
                setStatusFilter('all');
              }}
            >
              Clear Filters
            </button>
          )}
        </div>

        <div className="module-filter-right">
          <span className="filter-count-label">
            Showing {
              activeTab === 'requests' ? procReqs.length :
              activeTab === 'pos' ? purchaseOrders.length :
              activeTab === 'invoices' ? invoices.length : expenses.length
            } record(s)
          </span>
        </div>
      </div>

      {/* ── Procurement Requests ── */}
      {activeTab === 'requests' && (
        <div className="card module-table-card">
          {rawProcReqs.length === 0 ? (
            <EmptyState
              icon={<ProcurementIcon size={28} />}
              title="No procurement requests yet"
              subtitle="Create your first procurement request to begin AI-powered analysis."
              action="Create Procurement Request"
              onAction={() => setShowModal(true)}
            />
          ) : procReqs.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
              No procurement requests match the search query "{searchQuery}".
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th><th>Item / Service</th><th>Category</th>
                    <th>Vendor</th><th>Qty</th><th>Amount</th><th>Status</th>
                    <th>AI Recommendation</th><th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {procReqs.map((req) => (
                    <tr key={req.id}>
                      <td className="table-id">{req.id}</td>
                      <td className="table-primary">{req.item || req.request}</td>
                      <td><span className="cat-chip">{req.category}</span></td>
                      <td className="table-secondary">{req.vendor || '—'}</td>
                      <td className="table-secondary center">{req.quantity || 1}</td>
                      <td className="table-amount">{req.formattedAmount || formatCurrency(req.totalAmount)}</td>
                      <td>
                        <Badge variant={req.statusVariant || 'info'}>{req.status}</Badge>
                      </td>
                      <td>
                        {req.aiRecommendation && (
                          <span className={`ai-rec-chip ai-${req.aiActionType || 'info'}`}>
                            {req.aiRecommendation}
                          </span>
                        )}
                      </td>
                      <td className="table-secondary">{req.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Purchase Orders ── */}
      {activeTab === 'pos' && (
        <div className="card module-table-card">
          {rawPurchaseOrders.length === 0 ? (
            <EmptyState
              icon={<ProcurementIcon size={28} />}
              title="No purchase orders yet"
              subtitle="Purchase orders are created automatically when procurement requests are approved."
            />
          ) : purchaseOrders.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
              No purchase orders match your filters.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>PO Number</th><th>Description</th><th>Vendor</th>
                    <th>Category</th><th>Qty</th><th>Amount</th>
                    <th>Status</th><th>Required Date</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseOrders.map((po) => (
                    <tr key={po.id}>
                      <td className="table-id">{po.id}</td>
                      <td className="table-primary">{po.description}</td>
                      <td className="table-secondary">{po.vendorName}</td>
                      <td><span className="cat-chip">{po.category}</span></td>
                      <td className="table-secondary center">{po.quantity || 1}</td>
                      <td className="table-amount">{po.formattedAmount || formatCurrency(po.totalAmount)}</td>
                      <td><Badge variant={po.statusVariant || 'approved'}>{po.status}</Badge></td>
                      <td className="table-secondary">{po.requiredDate || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Invoices ── */}
      {activeTab === 'invoices' && (
        <div className="card module-table-card">
          {rawInvoices.length === 0 ? (
            <EmptyState
              icon={<ProcurementIcon size={28} />}
              title="No invoices yet"
              subtitle="Invoices will appear here once vendors submit billing for approved purchase orders."
            />
          ) : invoices.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
              No invoices match your filters.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Invoice ID</th><th>Vendor</th><th>Description</th>
                    <th>Amount</th><th>Status</th><th>Due Date</th><th>AI Flag</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id}>
                      <td className="table-id">{inv.id}</td>
                      <td className="table-primary">{inv.vendorName || inv.vendor}</td>
                      <td className="table-secondary">{inv.description}</td>
                      <td className="table-amount">{inv.formattedAmount || formatCurrency(inv.amount)}</td>
                      <td><Badge variant={inv.statusVariant || 'info'}>{inv.status}</Badge></td>
                      <td className="table-secondary">{inv.dueDate || inv.invoiceDate || '—'}</td>
                      <td>
                        {inv.aiFlag && (
                          <span className="ai-flag-chip">⚠ {inv.aiFlag}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Expenses ── */}
      {activeTab === 'expenses' && (
        <div className="card module-table-card">
          {rawExpenses.length === 0 ? (
            <EmptyState
              icon={<ProcurementIcon size={28} />}
              title="No expenses recorded yet"
              subtitle="Expenses are recorded when procurement requests or invoices are processed."
            />
          ) : expenses.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
              No expenses match your filters.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th><th>Description</th><th>Category</th>
                    <th>Vendor</th><th>Department</th><th>Amount</th>
                    <th>Budget</th><th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((exp) => (
                    <tr key={exp.id}>
                      <td className="table-id">{exp.id}</td>
                      <td className="table-primary">{exp.description}</td>
                      <td><span className="cat-chip">{exp.category}</span></td>
                      <td className="table-secondary">{exp.vendorName || '—'}</td>
                      <td className="table-secondary">{exp.department || '—'}</td>
                      <td className={`table-amount ${exp.isOverBudget ? 'over-budget' : ''}`}>
                        {exp.formattedAmount || formatCurrency(exp.amount)}
                      </td>
                      <td className="table-secondary">{exp.budgetFormatted || formatCurrency(exp.budget)}</td>
                      <td className="table-secondary">{exp.date || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Create Procurement Request Modal ── */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create Procurement Request</h3>
              <button type="button" className="modal-close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Item / Service *</label>
                <input type="text" className="form-input" placeholder="e.g. 50 Developer Laptops" value={formData.item}
                  onChange={(e) => setFormData((p) => ({ ...p, item: e.target.value }))} required />
              </div>
              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-input" value={formData.category}
                    onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}>
                    {['IT', 'Cloud Services', 'Software', 'Operations', 'Engineering Equipment', 'Marketing', 'Travel', 'General'].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Quantity</label>
                  <input type="number" className="form-input" min="1" placeholder="1" value={formData.quantity}
                    onChange={(e) => setFormData((p) => ({ ...p, quantity: e.target.value }))} />
                </div>
              </div>
              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label">Estimated Budget (₹) *</label>
                  <input type="number" className="form-input" min="0" placeholder="e.g. 500000" value={formData.estimatedBudget}
                    onChange={(e) => setFormData((p) => ({ ...p, estimatedBudget: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input type="text" className="form-input" placeholder="e.g. Engineering" value={formData.department}
                    onChange={(e) => setFormData((p) => ({ ...p, department: e.target.value }))} />
                </div>
              </div>
              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label">Preferred Vendor</label>
                  <input type="text" className="form-input" placeholder="Vendor name (optional)" value={formData.vendor}
                    onChange={(e) => setFormData((p) => ({ ...p, vendor: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Required By</label>
                  <input type="date" className="form-input" value={formData.requiredDate}
                    onChange={(e) => setFormData((p) => ({ ...p, requiredDate: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Purchase Intent / Business Reason</label>
                <textarea className="form-input form-textarea" rows={2}
                  placeholder="Describe why this procurement is needed..."
                  value={formData.purchaseIntent}
                  onChange={(e) => setFormData((p) => ({ ...p, purchaseIntent: e.target.value }))} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-register-back" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-login-submit">
                  <PlusIcon size={14} />
                  <span>Submit Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ModuleContainer>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. AI Analysis Module — Mutually Exclusive Tabs & Non-overlapping Counts
// ─────────────────────────────────────────────────────────────────────────────

export const AiAnalysisModule = ({ initialInsightId, onNavigateToTab }) => {
  const { metrics, userData, createDecisionFromInsight, resolveInsight } = useAuth();
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const allInsights = useMemo(() => metrics.aiInsightsList || [], [metrics.aiInsightsList]);
  const [selectedInsight, setSelectedInsight] = useState(() => {
    if (initialInsightId) {
      return (metrics.aiInsightsList || []).find((i) => i.id === initialInsightId) || null;
    }
    return null;
  });
  const [actionSuccessId, setActionSuccessId] = useState(null);

  const existingDecisions = userData?.decisions || [];
  const hasData = allInsights.length > 0;

  const priceDupInsights = useMemo(() => {
    return (metrics.aiInsightsList || []).filter((ins) => ins.type === 'price_anomaly' || ins.type === 'duplicate' || ins.type === 'budget_deviation');
  }, [metrics.aiInsightsList]);

  const riskInsights = useMemo(() => {
    return (metrics.aiInsightsList || []).filter((ins) => ins.type === 'vendor_alert' || ins.type === 'vendor_risk' || ins.type === 'early_warning' || ins.type === 'spending_anomaly');
  }, [metrics.aiInsightsList]);

  const savingsInsights = useMemo(() => {
    return (metrics.aiInsightsList || []).filter((ins) => ins.type === 'savings');
  }, [metrics.aiInsightsList]);

  // Tab-filtered insights
  const tabInsights = useMemo(() => {
    if (filterType === 'price_dup') return priceDupInsights;
    if (filterType === 'risk') return riskInsights;
    if (filterType === 'savings') return savingsInsights;
    return metrics.aiInsightsList || [];
  }, [filterType, metrics.aiInsightsList, priceDupInsights, riskInsights, savingsInsights]);

  // Search-filtered insights
  const filteredInsights = useMemo(() => {
    return searchRecords(tabInsights, searchQuery, ['id', 'title', 'description', 'category', 'severity', 'type', 'formattedImpact', 'recommendation']);
  }, [tabInsights, searchQuery]);

  const isDecisionCreated = (ins) => {
    return existingDecisions.some((d) => (d.relatedInsightId && d.relatedInsightId === ins.id) || d.decision === ins.title);
  };

  const handleTakeAction = (insight) => {
    if (createDecisionFromInsight) {
      createDecisionFromInsight(insight);
      setActionSuccessId(insight.id);
      setTimeout(() => setActionSuccessId(null), 3000);
    }
  };

  const handleResolveDuplicate = (insight, resolutionType) => {
    if (resolveInsight) {
      resolveInsight(insight.id, resolutionType, `User resolved duplicate as ${resolutionType}`);
      setSelectedInsight(null);
    }
  };

  return (
    <ModuleContainer
      title="AI Intelligence Analysis"
      subtitle="Deterministic heuristic scanners: duplicates, pricing anomalies, vendor risk, and savings"
      icon={<AiAnalysisIcon size={22} />}
      badge="AI"
    >
      {!hasData ? (
        <div className="card" style={{ padding: 36 }}>
          <EmptyState
            icon={<SparklesIcon size={28} />}
            title="AI Intelligence Engine Active — No Anomalies to Display"
            subtitle="Add vendors, procurement requests, or software subscriptions. The deterministic intelligence engine evaluates all records across 8 dimensions automatically."
          />
          <div className="ai-feed-footer-note" style={{ marginTop: 16 }}>
            <SparklesIcon size={12} />
            <span>Deterministic analysis runs live on your data. Connect real AI API via <code>aiService.js</code> when ready.</span>
          </div>
        </div>
      ) : (
        <div className="module-analysis-grid">
          {/* Summary KPIs */}
          <div className="analysis-kpi-row">
            <div className="analysis-kpi-card">
              <span className="analysis-kpi-label">Active AI Insights</span>
              <span className="analysis-kpi-value">{allInsights.length}</span>
            </div>
            <div className="analysis-kpi-card">
              <span className="analysis-kpi-label">High Risk Findings</span>
              <span className="analysis-kpi-value risk">{metrics.riskAlertsCount}</span>
            </div>
            <div className="analysis-kpi-card">
              <span className="analysis-kpi-label">Identified Savings</span>
              <span className="analysis-kpi-value savings">{metrics.potentialSavingsFormatted}</span>
            </div>
            <div className="analysis-kpi-card">
              <span className="analysis-kpi-label">Pending Decisions</span>
              <span className="analysis-kpi-value">{metrics.pendingDecisionsCount}</span>
            </div>
          </div>

          {/* Filter Tab Bar — Mutually Exclusive Badge Counts */}
          <div className="module-tab-bar" style={{ marginTop: 4 }}>
            <button
              type="button"
              className={`module-tab-btn ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              All Findings <span className="tab-count-badge">{allInsights.length}</span>
            </button>
            <button
              type="button"
              className={`module-tab-btn ${filterType === 'price_dup' ? 'active' : ''}`}
              onClick={() => setFilterType('price_dup')}
            >
              Price &amp; Duplicates <span className="tab-count-badge">{priceDupInsights.length}</span>
            </button>
            <button
              type="button"
              className={`module-tab-btn ${filterType === 'risk' ? 'active' : ''}`}
              onClick={() => setFilterType('risk')}
            >
              Vendor &amp; Contract Risks <span className="tab-count-badge">{riskInsights.length}</span>
            </button>
            <button
              type="button"
              className={`module-tab-btn ${filterType === 'savings' ? 'active' : ''}`}
              onClick={() => setFilterType('savings')}
            >
              Savings Opportunities <span className="tab-count-badge">{savingsInsights.length}</span>
            </button>
          </div>

          {/* Search Toolbar */}
          <div className="module-filter-toolbar">
            <div className="module-filter-left">
              <div className="module-search-wrapper">
                <span className="module-search-icon">🔍</span>
                <input
                  type="text"
                  className="module-search-input"
                  placeholder="Search findings by keyword, vendor, category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {searchQuery && (
                <button
                  type="button"
                  className="btn-filter-clear"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </button>
              )}
            </div>
            <div className="module-filter-right">
              <span className="filter-count-label">
                Showing {filteredInsights.length} of {tabInsights.length} findings
              </span>
            </div>
          </div>

          {/* Insights List */}
          <div className="card module-table-card">
            {filteredInsights.length === 0 ? (
              <div style={{ padding: '36px', textAlign: 'center', color: '#64748b' }}>
                No findings match the search query "{searchQuery}".
              </div>
            ) : (
              <div className="analysis-insight-list">
                {filteredInsights.map((ins) => {
                  const hasDecision = isDecisionCreated(ins);
                  return (
                    <div
                      key={ins.id}
                      className={`analysis-insight-item risk-${ins.severity || 'info'}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedInsight(selectedInsight?.id === ins.id ? null : ins)}
                    >
                      <div className={`insight-severity-dot ${ins.type === 'savings' ? 'savings' : ''}`} />
                      <div className="insight-content">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                          <p className="insight-title" style={{ margin: 0 }}>{ins.title}</p>
                          <Badge variant={ins.severity === 'high' ? 'risk-high' : ins.type === 'savings' ? 'savings' : 'warning'} size="sm">
                            {ins.type ? ins.type.replace('_', ' ').toUpperCase() : 'INSIGHT'}
                          </Badge>
                          {hasDecision && (
                            <span className="nav-item-pill" style={{ background: '#ecfdf5', color: '#047857' }}>
                              ✓ Decision Created
                            </span>
                          )}
                        </div>
                        <p className="insight-desc">{ins.description}</p>
                        {ins.evidence && ins.evidence.length > 0 && (
                          <ul style={{ margin: '6px 0 0', paddingLeft: 18, fontSize: 12, color: '#475569' }}>
                            {ins.evidence.map((ev, idx) => (
                              <li key={idx}>{ev}</li>
                            ))}
                          </ul>
                        )}
                        {ins.recommendation && (
                          <p style={{ margin: '6px 0 0', fontSize: 12, color: '#065F46', fontWeight: 500 }}>
                            <strong>Recommendation:</strong> {ins.recommendation}
                          </p>
                        )}
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0, paddingLeft: 16 }}>
                        {ins.financialImpact > 0 && (
                          <div className="insight-amount" style={{ color: ins.type === 'savings' ? '#10B981' : '#1E3A8A' }}>
                            {ins.formattedImpact || formatCurrency(ins.financialImpact)}
                          </div>
                        )}
                        <span className="insight-confidence">{ins.confidence}</span>
                        <div style={{ marginTop: 8, display: 'flex', gap: 6, justifyContent: 'flex-end', alignItems: 'center' }}>
                          <button
                            type="button"
                            className="btn-view-analysis"
                            style={{ padding: '4px 9px', fontSize: 11, background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, color: '#1e40af', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedInsight(ins);
                            }}
                          >
                            <span>View Analysis</span>
                            <ChevronRightIcon size={12} />
                          </button>
                          <button
                            type="button"
                            className="btn-add-record"
                            style={{
                              padding: '4px 10px',
                              fontSize: 11,
                              background: hasDecision ? '#f1f5f9' : undefined,
                              color: hasDecision ? '#047857' : undefined,
                              border: hasDecision ? '1px solid #a7f3d0' : undefined,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTakeAction(ins);
                            }}
                          >
                            <SparklesIcon size={12} />
                            <span>{hasDecision ? '✓ Decision Logged' : 'Take Action'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {actionSuccessId && (
            <div className="demo-load-success-banner" style={{ marginTop: 8 }}>
              <span>Decision created from AI finding and added to Decisions &amp; Outcomes for executive review.</span>
            </div>
          )}

          {/* ── Detail Modal for AI Finding ── */}
          {selectedInsight && (
            <div className="modal-backdrop" onClick={() => setSelectedInsight(null)}>
              <div
                className="modal-card modal-card-analysis"
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '640px' }}
              >
                <div className="modal-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="insight-card-icon-bubble" style={{ width: '28px', height: '28px' }}>
                      {selectedInsight.type === 'savings' ? <TrendingUpIcon size={18} /> : <ShieldAlertIcon size={18} />}
                    </div>
                    <div>
                      <h3 className="modal-title" style={{ fontSize: '15px', fontWeight: 700 }}>
                        AI Finding Investigation: {selectedInsight.id}
                      </h3>
                      <span style={{ fontSize: '11px', color: '#64748B' }}>
                        Type: {selectedInsight.type} &bull; Confidence: {selectedInsight.confidence}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="modal-close-btn"
                    onClick={() => setSelectedInsight(null)}
                  >
                    &times;
                  </button>
                </div>

                <div className="modal-analysis-body">
                  <div className="analysis-detail-header">
                    <div>
                      <h4 className="analysis-detail-title">{selectedInsight.title}</h4>
                      <span className="analysis-detail-category">{selectedInsight.category}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <Badge variant={selectedInsight.severity === 'high' ? 'risk-high' : 'warning'}>
                        {selectedInsight.severity ? selectedInsight.severity.toUpperCase() : 'AI ALERT'}
                      </Badge>
                    </div>
                  </div>

                  <div className="analysis-section-block">
                    <span className="analysis-section-label">OBSERVED FINDING</span>
                    <p className="analysis-section-text">{selectedInsight.description}</p>
                  </div>

                  {selectedInsight.evidence && selectedInsight.evidence.length > 0 && (
                    <div className="analysis-section-block">
                      <span className="analysis-section-label">EVIDENCE &amp; AUDIT TRAIL</span>
                      <ul className="analysis-evidence-list">
                        {selectedInsight.evidence.map((item, idx) => (
                          <li key={idx} className="analysis-evidence-item">
                            <span className="evidence-bullet">&bull;</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedInsight.financialImpact > 0 && (
                    <div className="analysis-section-block financial-impact-highlight">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="analysis-section-label" style={{ color: '#1E3A8A', margin: 0 }}>
                          FINANCIAL EXPOSURE / POTENTIAL VALUE
                        </span>
                        <span className="analysis-impact-amount">
                          {selectedInsight.formattedImpact || formatCurrency(selectedInsight.financialImpact)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="analysis-section-block recommendation-block">
                    <span className="analysis-section-label" style={{ color: '#065F46' }}>
                      RECOMMENDED ACTION
                    </span>
                    <p className="analysis-section-text" style={{ color: '#064E3B', fontWeight: 500 }}>
                      {selectedInsight.recommendation}
                    </p>
                  </div>

                  {/* Duplicate Resolution Options */}
                  {selectedInsight.type === 'duplicate' && (
                    <div className="analysis-section-block" style={{ background: '#fef2f2', border: '1px solid #fecdd3', borderRadius: 8, padding: 12 }}>
                      <span className="analysis-section-label" style={{ color: '#991b1b' }}>
                        RESOLVE DUPLICATE EXPOSURE
                      </span>
                      <p style={{ fontSize: 12, color: '#7f1d1d', margin: '4px 0 10px' }}>
                        Choose a resolution action to update the ledger and dismiss this duplicate finding:
                      </p>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className="btn-decision-reject"
                          style={{ padding: '6px 12px' }}
                          onClick={() => handleResolveDuplicate(selectedInsight, 'held_duplicate')}
                        >
                          Hold &amp; Reject Duplicate
                        </button>
                        <button
                          type="button"
                          className="btn-decision-approve"
                          style={{ padding: '6px 12px' }}
                          onClick={() => handleResolveDuplicate(selectedInsight, 'verified_legitimate')}
                        >
                          Mark as Verified Recurring Bill
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="modal-actions" style={{ marginTop: '20px' }}>
                    <button
                      type="button"
                      className="btn-register-back"
                      onClick={() => setSelectedInsight(null)}
                    >
                      Close
                    </button>
                    {onNavigateToTab && (
                      <button
                        type="button"
                        className="btn-decision-negotiate"
                        style={{ padding: '8px 14px' }}
                        onClick={() => {
                          setSelectedInsight(null);
                          onNavigateToTab('decisions');
                        }}
                      >
                        <span>Review Decisions &rarr;</span>
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn-login-submit"
                      onClick={() => {
                        handleTakeAction(selectedInsight);
                      }}
                    >
                      <SparklesIcon size={14} />
                      <span>{isDecisionCreated(selectedInsight) ? 'Decision Logged (Update)' : 'Create Formal Decision'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </ModuleContainer>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. Vendors Module
// ─────────────────────────────────────────────────────────────────────────────

export const VendorsModule = () => {
  const { userData, addVendor } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: '', contactEmail: '', country: 'India' });

  const rawVendors = userData?.vendors || [];

  const vendors = useMemo(() => {
    const filters = {};
    if (categoryFilter !== 'all') filters.category = categoryFilter;
    if (riskFilter !== 'all') filters.riskVariant = riskFilter;
    const list = userData?.vendors || [];
    return searchRecords(list, searchQuery, ['id', 'name', 'category', 'contactEmail', 'country', 'status', 'aiFlag', 'totalSpend'], filters);
  }, [userData?.vendors, searchQuery, categoryFilter, riskFilter]);

  const TREND_ICONS = { up: '↑', down: '↓', stable: '→' };
  const TREND_COLORS = { up: '#EF4444', down: '#10B981', stable: '#94A3B8' };

  const handleAddVendor = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    addVendor({
      name: formData.name.trim(),
      category: formData.category.trim() || 'General',
      contactEmail: formData.contactEmail.trim(),
      country: formData.country.trim() || 'India',
    });
    setFormData({ name: '', category: '', contactEmail: '', country: 'India' });
    setShowModal(false);
  };

  return (
    <ModuleContainer
      title="Vendor Intelligence"
      subtitle="Supplier performance, risk scores, pricing trends and compliance"
      icon={<VendorsIcon size={22} />}
      onAddAction={() => setShowModal(true)}
      addLabel="Add Vendor"
    >
      {/* Search & Filter Toolbar */}
      <div className="module-filter-toolbar">
        <div className="module-filter-left">
          <div className="module-search-wrapper">
            <span className="module-search-icon">🔍</span>
            <input
              type="text"
              className="module-search-input"
              placeholder="Search vendors by name, email, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="module-select-filter"
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
          >
            <option value="all">All Risk Levels</option>
            <option value="approved">Low Risk</option>
            <option value="warning">Medium Risk</option>
            <option value="flagged">High / Audit Risk</option>
          </select>

          {(searchQuery || categoryFilter !== 'all' || riskFilter !== 'all') && (
            <button
              type="button"
              className="btn-filter-clear"
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
                setRiskFilter('all');
              }}
            >
              Clear Filters
            </button>
          )}
        </div>

        <div className="module-filter-right">
          <span className="filter-count-label">
            Showing {vendors.length} of {rawVendors.length} vendor(s)
          </span>
        </div>
      </div>

      <div className="card module-table-card">
        {rawVendors.length === 0 ? (
          <EmptyState
            icon={<VendorsIcon size={28} />}
            title="No vendors yet"
            subtitle="Add vendors to your account or load demo procurement data to begin vendor intelligence analysis."
            action="Add Your First Vendor"
            onAction={() => setShowModal(true)}
          />
        ) : vendors.length === 0 ? (
          <div style={{ padding: '36px', textAlign: 'center', color: '#64748b' }}>
            No vendors match the search query "{searchQuery}".
          </div>
        ) : (
          <>
            <div className="vendor-summary-bar">
              <span className="vendor-summary-stat">
                <strong>{rawVendors.length}</strong> vendors registered
              </span>
              <span className="vendor-summary-stat">
                <strong>{rawVendors.filter((v) => v.riskLevel >= 3 || v.riskVariant === 'flagged').length}</strong> high risk
              </span>
              <span className="vendor-summary-stat">
                <strong>{rawVendors.filter((v) => v.status === 'Preferred').length}</strong> preferred
              </span>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Vendor</th><th>Category</th><th>Total Spend</th>
                    <th>Performance</th><th>Risk</th><th>Pricing Trend</th>
                    <th>Compliance</th><th>Status</th><th>AI Flag</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((v) => (
                    <tr key={v.id}>
                      <td>
                        <div className="vendor-name-cell">
                          <div className="vendor-avatar">{v.name.charAt(0)}</div>
                          <div>
                            <p className="table-primary">{v.name}</p>
                            <p className="table-secondary">{v.contactEmail || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td><span className="cat-chip">{v.category}</span></td>
                      <td className="table-amount">{v.formattedSpend || formatCurrency(v.totalSpend)}</td>
                      <td>
                        <div className="perf-score-bar">
                          <div className="perf-bar-fill" style={{ width: `${v.performanceScore || 0}%` }} />
                          <span className="perf-score-label">{v.performanceScore || 0}%</span>
                        </div>
                      </td>
                      <td><Badge variant={v.riskVariant || 'info'}>{v.riskScore}</Badge></td>
                      <td>
                        <span style={{ color: TREND_COLORS[v.pricingTrendDir] || '#94A3B8', fontWeight: 600 }}>
                          {TREND_ICONS[v.pricingTrendDir] || '→'} {v.pricingTrend || 'Stable'}
                        </span>
                      </td>
                      <td className="table-secondary">{v.compliance || '—'}</td>
                      <td><Badge variant={v.riskVariant === 'approved' ? 'approved' : v.riskVariant || 'info'}>{v.status}</Badge></td>
                      <td>
                        {v.aiFlag && <span className="ai-flag-chip">⚠ {v.aiFlag}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add New Vendor</h3>
              <button type="button" className="modal-close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form className="modal-form" onSubmit={handleAddVendor}>
              <div className="form-group">
                <label className="form-label">Vendor Name *</label>
                <input type="text" className="form-input" placeholder="e.g. Apex Technologies Pvt Ltd"
                  value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} required />
              </div>
              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input type="text" className="form-input" placeholder="e.g. IT Hardware"
                    value={formData.category} onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input type="text" className="form-input" placeholder="India"
                    value={formData.country} onChange={(e) => setFormData((p) => ({ ...p, country: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Contact Email</label>
                <input type="email" className="form-input" placeholder="contact@vendor.com"
                  value={formData.contactEmail} onChange={(e) => setFormData((p) => ({ ...p, contactEmail: e.target.value }))} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-register-back" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-login-submit">
                  <PlusIcon size={14} /> <span>Add Vendor</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ModuleContainer>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. Subscriptions Module
// ─────────────────────────────────────────────────────────────────────────────

export const SubscriptionsModule = () => {
  const { userData, addSubscription } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', product: '', vendorName: '', department: '',
    seatsTotal: '', seatsActive: '', monthlyCost: '', renewalDate: '',
  });

  const rawSubscriptions = userData?.subscriptions || [];

  const subscriptions = useMemo(() => {
    const filters = {};
    if (statusFilter !== 'all') filters.status = statusFilter;
    const list = userData?.subscriptions || [];
    return searchRecords(list, searchQuery, ['id', 'name', 'product', 'vendorName', 'department', 'status', 'aiFlag', 'monthlyCost', 'costPerYear'], filters);
  }, [userData?.subscriptions, searchQuery, statusFilter]);

  const totalMonthlyCost = rawSubscriptions.reduce((acc, s) => acc + (Number(s.monthlyCost) || 0), 0);
  const totalIdleSeats   = rawSubscriptions.reduce((acc, s) => acc + (Number(s.seatsIdle)   || 0), 0);
  const optimizable      = rawSubscriptions.filter((s) => Number(s.seatsIdle) > 0).length;

  const handleAddSub = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    addSubscription({
      name: formData.name.trim(),
      product: formData.product.trim() || formData.name.trim(),
      vendorName: formData.vendorName.trim() || 'Unknown Vendor',
      department: formData.department.trim() || 'General',
      seatsTotal: Number(formData.seatsTotal) || 1,
      seatsActive: Number(formData.seatsActive) || 1,
      monthlyCost: Number(formData.monthlyCost) || 0,
      renewalDate: formData.renewalDate,
    });
    setFormData({ name: '', product: '', vendorName: '', department: '', seatsTotal: '', seatsActive: '', monthlyCost: '', renewalDate: '' });
    setShowModal(false);
  };

  return (
    <ModuleContainer
      title="Subscription Intelligence"
      subtitle="SaaS licence management, seat utilisation, and renewal optimisation"
      icon={<SubscriptionsIcon size={22} />}
      onAddAction={() => setShowModal(true)}
      addLabel="Add Subscription"
    >
      {rawSubscriptions.length > 0 && (
        <div className="sub-summary-bar">
          <div className="sub-kpi-pill">
            <span className="sub-kpi-label">Total Subscriptions</span>
            <span className="sub-kpi-value">{rawSubscriptions.length}</span>
          </div>
          <div className="sub-kpi-pill">
            <span className="sub-kpi-label">Monthly Cost</span>
            <span className="sub-kpi-value">{formatCurrency(totalMonthlyCost)}/mo</span>
          </div>
          <div className="sub-kpi-pill warn">
            <span className="sub-kpi-label">Total Idle Seats</span>
            <span className="sub-kpi-value">{totalIdleSeats}</span>
          </div>
          <div className="sub-kpi-pill warn">
            <span className="sub-kpi-label">Optimizable</span>
            <span className="sub-kpi-value">{optimizable} subscriptions</span>
          </div>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="module-filter-toolbar">
        <div className="module-filter-left">
          <div className="module-search-wrapper">
            <span className="module-search-icon">🔍</span>
            <input
              type="text"
              className="module-search-input"
              placeholder="Search subscriptions by product, vendor, department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="module-select-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="Optimizable">Optimizable</option>
            <option value="Healthy">Healthy</option>
          </select>

          {(searchQuery || statusFilter !== 'all') && (
            <button
              type="button"
              className="btn-filter-clear"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
            >
              Clear Filters
            </button>
          )}
        </div>

        <div className="module-filter-right">
          <span className="filter-count-label">
            Showing {subscriptions.length} of {rawSubscriptions.length} subscription(s)
          </span>
        </div>
      </div>

      <div className="card module-table-card">
        {rawSubscriptions.length === 0 ? (
          <EmptyState
            icon={<SubscriptionsIcon size={28} />}
            title="No subscriptions tracked yet"
            subtitle="Add your SaaS subscriptions to detect idle seats and get renewal optimisation recommendations."
            action="Add Subscription"
            onAction={() => setShowModal(true)}
          />
        ) : subscriptions.length === 0 ? (
          <div style={{ padding: '36px', textAlign: 'center', color: '#64748b' }}>
            No subscriptions match the search query "{searchQuery}".
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th><th>Vendor</th><th>Department</th>
                  <th>Total Seats</th><th>Active</th><th>Idle</th>
                  <th>Utilisation</th><th>Monthly Cost</th>
                  <th>Annual Cost</th><th>Renewal</th><th>Status</th><th>AI Flag</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((s) => {
                  const idleSavingAnnual = s.seatsIdle > 0 && s.costPerYear
                    ? Math.round((s.seatsIdle / s.seatsTotal) * s.costPerYear)
                    : 0;
                  return (
                    <tr key={s.id}>
                      <td>
                        <div>
                          <p className="table-primary">{s.name}</p>
                          <p className="table-secondary">{s.product || s.name}</p>
                        </div>
                      </td>
                      <td className="table-secondary">{s.vendorName || '—'}</td>
                      <td className="table-secondary">{s.department || '—'}</td>
                      <td className="table-secondary center">{s.seatsTotal}</td>
                      <td className="table-secondary center" style={{ color: '#10B981' }}>{s.seatsActive}</td>
                      <td className="table-secondary center" style={{ color: s.seatsIdle > 0 ? '#EF4444' : '#94A3B8' }}>
                        {s.seatsIdle}
                      </td>
                      <td>
                        <div className="util-bar-wrapper">
                          <div className="util-bar-fill" style={{
                            width: s.utilization || '0%',
                            backgroundColor: parseInt(s.utilization) >= 90 ? '#10B981' : parseInt(s.utilization) >= 70 ? '#F59E0B' : '#EF4444',
                          }} />
                          <span className="util-bar-label">{s.utilization || '—'}</span>
                        </div>
                      </td>
                      <td className="table-amount">{s.formattedMonthly || formatCurrency(s.monthlyCost) + '/mo'}</td>
                      <td className="table-amount">{s.formattedAnnual || formatCurrency(s.costPerYear) + '/yr'}</td>
                      <td className="table-secondary">{s.renewalDate || '—'}</td>
                      <td><Badge variant={s.statusVariant || 'info'}>{s.status}</Badge></td>
                      <td>
                        {s.aiFlag ? (
                          <span className="ai-flag-chip">
                            ⚠ {s.aiFlag}
                            {idleSavingAnnual > 0 && ` Save ${formatCurrency(idleSavingAnnual)}/yr`}
                          </span>
                        ) : (
                          <span className="ai-ok-chip">✓ Optimal</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add Subscription</h3>
              <button type="button" className="modal-close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form className="modal-form" onSubmit={handleAddSub}>
              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input type="text" className="form-input" placeholder="e.g. Figma Organization" value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Vendor</label>
                  <input type="text" className="form-input" placeholder="e.g. Figma Inc." value={formData.vendorName}
                    onChange={(e) => setFormData((p) => ({ ...p, vendorName: e.target.value }))} />
                </div>
              </div>
              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input type="text" className="form-input" placeholder="e.g. Product & Design" value={formData.department}
                    onChange={(e) => setFormData((p) => ({ ...p, department: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Renewal Date</label>
                  <input type="date" className="form-input" value={formData.renewalDate}
                    onChange={(e) => setFormData((p) => ({ ...p, renewalDate: e.target.value }))} />
                </div>
              </div>
              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label">Total Seats</label>
                  <input type="number" className="form-input" min="1" placeholder="e.g. 25" value={formData.seatsTotal}
                    onChange={(e) => setFormData((p) => ({ ...p, seatsTotal: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Active (Used) Seats</label>
                  <input type="number" className="form-input" min="0" placeholder="e.g. 19" value={formData.seatsActive}
                    onChange={(e) => setFormData((p) => ({ ...p, seatsActive: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Monthly Cost (₹)</label>
                <input type="number" className="form-input" min="0" placeholder="e.g. 4000" value={formData.monthlyCost}
                  onChange={(e) => setFormData((p) => ({ ...p, monthlyCost: e.target.value }))} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-register-back" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-login-submit">
                  <PlusIcon size={14} /> <span>Add Subscription</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ModuleContainer>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. Decisions & Outcomes Module — Human Approval Workflow
// ─────────────────────────────────────────────────────────────────────────────

export const DecisionsModule = () => {
  const { userData, metrics, updateDecisionStatus } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeDecisionModal, setActiveDecisionModal] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const rawDecisions = userData?.decisions || [];
  const rawOutcomes  = userData?.outcomes  || [];

  const decisions = useMemo(() => {
    const filters = {};
    if (statusFilter !== 'all') filters.statusVariant = statusFilter;
    const list = userData?.decisions || [];
    return searchRecords(list, searchQuery, ['id', 'decision', 'description', 'requestedBy', 'aiRecommendedAction', 'status', 'amount', 'estimatedSavings'], filters);
  }, [userData?.decisions, searchQuery, statusFilter]);

  const outcomes = useMemo(() => {
    const list = userData?.outcomes || [];
    return searchRecords(list, searchQuery, ['id', 'decision', 'decisionId', 'notes', 'actualSaving', 'aiPredictedSaving']);
  }, [userData?.outcomes, searchQuery]);

  const totalEstimatedSavings = rawDecisions.reduce((acc, d) => acc + (Number(d.estimatedSavings) || 0), 0);
  const totalActualSavings    = rawOutcomes.reduce((acc, o) => acc + (Number(o.actualSaving) || 0), 0);

  const handleApprove = (decision) => {
    if (updateDecisionStatus) {
      updateDecisionStatus(decision.id, 'Approved by Executive', {
        notes: reviewNotes || 'Approved without modifications.',
        actualSaving: decision.estimatedSavings || 0,
      });
      setActiveDecisionModal(null);
      setReviewNotes('');
    }
  };

  const handleNegotiate = (decision) => {
    if (updateDecisionStatus) {
      updateDecisionStatus(decision.id, 'Negotiation Authorized', {
        notes: reviewNotes || 'Counter-offer authorized based on AI benchmark.',
      });
      setActiveDecisionModal(null);
      setReviewNotes('');
    }
  };

  const handleReject = (decision) => {
    if (updateDecisionStatus) {
      updateDecisionStatus(decision.id, 'Rejected by Executive', {
        notes: reviewNotes || 'Requisition rejected by procurement reviewer.',
        actualSaving: 0,
      });
      setActiveDecisionModal(null);
      setReviewNotes('');
    }
  };

  return (
    <ModuleContainer
      title="Decisions & Outcomes"
      subtitle="Executive authorization layer with full audit trails & machine learning outcomes"
      icon={<DecisionsIcon size={22} />}
    >
      {rawDecisions.length === 0 && rawOutcomes.length === 0 ? (
        <div className="card" style={{ padding: 36 }}>
          <EmptyState
            icon={<DecisionsIcon size={28} />}
            title="No decisions recorded yet"
            subtitle="Decisions are generated when AI analyzes your procurement data. Add procurement requests, vendors, or subscriptions to trigger AI decision recommendations."
          />
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="sub-summary-bar">
            <div className="sub-kpi-pill">
              <span className="sub-kpi-label">Total Decisions</span>
              <span className="sub-kpi-value">{rawDecisions.length}</span>
            </div>
            <div className="sub-kpi-pill">
              <span className="sub-kpi-label">Pending Approval</span>
              <span className="sub-kpi-value warn">{metrics.pendingDecisionsCount}</span>
            </div>
            <div className="sub-kpi-pill">
              <span className="sub-kpi-label">Est. Savings</span>
              <span className="sub-kpi-value">{formatCurrency(totalEstimatedSavings)}</span>
            </div>
            <div className="sub-kpi-pill">
              <span className="sub-kpi-label">Actual Savings Logged</span>
              <span className="sub-kpi-value" style={{ color: '#10B981' }}>{formatCurrency(totalActualSavings)}</span>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="module-filter-toolbar">
            <div className="module-filter-left">
              <div className="module-search-wrapper">
                <span className="module-search-icon">🔍</span>
                <input
                  type="text"
                  className="module-search-input"
                  placeholder="Search decisions by requisition, action, requester..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                className="module-select-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Decision Statuses</option>
                <option value="under-review">Pending Sign-off</option>
                <option value="approved">Approved</option>
                <option value="warning">Negotiation in Progress</option>
                <option value="danger">Rejected</option>
              </select>

              {(searchQuery || statusFilter !== 'all') && (
                <button
                  type="button"
                  className="btn-filter-clear"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>

            <div className="module-filter-right">
              <span className="filter-count-label">
                Showing {decisions.length} of {rawDecisions.length} decision(s)
              </span>
            </div>
          </div>

          {/* Decisions Table */}
          {rawDecisions.length > 0 && (
            <div className="card module-table-card">
              <div className="card-header"><h3 className="card-title">Pending &amp; Authorized Decisions</h3></div>
              {decisions.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
                  No decisions match your search filters.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th><th>Decision / Requisition</th><th>Requested By</th>
                        <th>Amount</th><th>AI Action</th><th>Est. Saving</th><th>Status</th><th>Executive Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {decisions.map((d) => {
                        const isPending = d.statusVariant === 'under-review' || (d.status && d.status.includes('Pending'));
                        return (
                          <tr key={d.id}>
                            <td className="table-id">{d.id}</td>
                            <td className="table-primary">
                              <span style={{ cursor: 'pointer', color: '#2563eb', fontWeight: 700 }} onClick={() => setActiveDecisionModal(d)}>
                                {d.decision}
                              </span>
                            </td>
                            <td className="table-secondary">{d.requestedBy}</td>
                            <td className="table-amount">{d.formattedAmount || formatCurrency(d.amount)}</td>
                            <td className="table-secondary">{d.aiRecommendedAction}</td>
                            <td className="table-amount" style={{ color: '#10B981' }}>{d.formattedSavings || formatCurrency(d.estimatedSavings)}</td>
                            <td><Badge variant={d.statusVariant || 'info'}>{d.status}</Badge></td>
                            <td>
                              {isPending ? (
                                <div className="decision-action-group">
                                  <button
                                    type="button"
                                    className="btn-decision-approve"
                                    onClick={() => handleApprove(d)}
                                    title="Approve Requisition & Issue PO"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    type="button"
                                    className="btn-decision-negotiate"
                                    onClick={() => handleNegotiate(d)}
                                    title="Authorize AI Counter-Offer"
                                  >
                                    Negotiate
                                  </button>
                                  <button
                                    type="button"
                                    className="btn-decision-reject"
                                    onClick={() => handleReject(d)}
                                    title="Reject Requisition"
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <span style={{ fontSize: 11.5, color: '#64748b', fontWeight: 600 }}>
                                  Resolved ({d.status})
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Outcomes Table — Learning Layer */}
          {rawOutcomes.length > 0 && (
            <div className="card module-table-card" style={{ marginTop: 20 }}>
              <div className="card-header">
                <h3 className="card-title">
                  Outcomes &amp; Verified Savings — Learning Layer
                  <span className="module-badge" style={{ marginLeft: 8 }}>Audited Outcomes</span>
                </h3>
              </div>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Decision</th><th>AI Predicted Saving</th><th>Actual Saving</th>
                      <th>Model Accuracy</th><th>Review Notes</th><th>Completed Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outcomes.map((o) => (
                      <tr key={o.id}>
                        <td className="table-primary">{o.decision}</td>
                        <td className="table-amount">{formatCurrency(o.aiPredictedSaving)}</td>
                        <td className="table-amount" style={{ color: '#10B981' }}>{formatCurrency(o.actualSaving)}</td>
                        <td>
                          <span style={{ color: (o.accuracy >= 0.9) ? '#10B981' : '#F59E0B', fontWeight: 700 }}>
                            {o.accuracy ? `${(o.accuracy * 100).toFixed(0)}%` : '—'}
                          </span>
                        </td>
                        <td className="table-secondary">{o.notes || '—'}</td>
                        <td className="table-secondary">{o.completedAt || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Human Approval Modal ── */}
          {activeDecisionModal && (
            <div className="modal-backdrop" onClick={() => setActiveDecisionModal(null)}>
              <div
                className="modal-card modal-card-analysis"
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '600px' }}
              >
                <div className="modal-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="insight-card-icon-bubble" style={{ width: 28, height: 28 }}>
                      <CheckCircleIcon size={18} />
                    </div>
                    <div>
                      <h3 className="modal-title" style={{ fontSize: 15, fontWeight: 700 }}>
                        Executive Decision Review: {activeDecisionModal.id}
                      </h3>
                      <span style={{ fontSize: 11, color: '#64748B' }}>
                        Requested by: {activeDecisionModal.requestedBy}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="modal-close-btn"
                    onClick={() => setActiveDecisionModal(null)}
                  >
                    &times;
                  </button>
                </div>

                <div className="modal-analysis-body">
                  <div className="analysis-detail-header">
                    <div>
                      <h4 className="analysis-detail-title">{activeDecisionModal.decision}</h4>
                      <span className="analysis-detail-category">{activeDecisionModal.description}</span>
                    </div>
                    <div>
                      <Badge variant={activeDecisionModal.statusVariant || 'info'}>
                        {activeDecisionModal.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="analysis-section-block">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <span className="analysis-section-label">EXPOSURE AMOUNT</span>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
                          {activeDecisionModal.formattedAmount || formatCurrency(activeDecisionModal.amount)}
                        </div>
                      </div>
                      <div>
                        <span className="analysis-section-label">POTENTIAL SAVINGS</span>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#10B981' }}>
                          {activeDecisionModal.formattedSavings || formatCurrency(activeDecisionModal.estimatedSavings)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="analysis-section-block recommendation-block">
                    <span className="analysis-section-label" style={{ color: '#065F46' }}>
                      AI RECOMMENDED ACTION
                    </span>
                    <p className="analysis-section-text" style={{ color: '#064E3B', fontWeight: 500 }}>
                      {activeDecisionModal.aiRecommendedAction}
                    </p>
                  </div>

                  <div className="form-group" style={{ marginTop: 12 }}>
                    <label className="form-label">Reviewer Notes (Optional)</label>
                    <textarea
                      className="form-input form-textarea"
                      rows={2}
                      placeholder="Add justification or conditions for this decision..."
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                    />
                  </div>

                  <div className="modal-actions" style={{ marginTop: 20 }}>
                    <button
                      type="button"
                      className="btn-decision-reject"
                      style={{ padding: '8px 16px' }}
                      onClick={() => handleReject(activeDecisionModal)}
                    >
                      Reject Requisition
                    </button>
                    <button
                      type="button"
                      className="btn-decision-negotiate"
                      style={{ padding: '8px 16px' }}
                      onClick={() => handleNegotiate(activeDecisionModal)}
                    >
                      Authorize Negotiation
                    </button>
                    <button
                      type="button"
                      className="btn-decision-approve"
                      style={{ padding: '8px 16px' }}
                      onClick={() => handleApprove(activeDecisionModal)}
                    >
                      Approve &amp; Issue PO
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </ModuleContainer>
  );
};
