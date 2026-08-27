// src/components/modules/ModuleViews.jsx
import React, { useState } from 'react';
import {
  ProcurementIcon,
  AiAnalysisIcon,
  VendorsIcon,
  SubscriptionsIcon,
  DecisionsIcon,
  SparklesIcon,
  PlusIcon,
  CheckCircleIcon,
} from '../icons/Icons';
import { Badge } from '../common/Badge';
import { useAuth } from '../../context/useAuth';

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
            <span className="org-value">{currentUser?.companyName || 'NovaTech'}</span>
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

// 1. Procurement Module View
export const ProcurementModule = () => {
  const { userData, metrics, addProcurement, currentUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    item: '',
    department: 'Engineering',
    amount: '',
    vendor: '',
    category: 'IT',
  });

  const procurements = userData?.procurements || [];

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.item.trim() || !formData.amount) return;
    addProcurement({
      item: formData.item.trim(),
      department: formData.department,
      totalAmount: Number(formData.amount),
      vendor: formData.vendor.trim() || 'Direct Supplier',
      category: formData.category,
    });
    setFormData({ item: '', department: 'Engineering', amount: '', vendor: '', category: 'IT' });
    setShowModal(false);
  };

  return (
    <ModuleContainer
      title="Procurement Requisitions & Pipeline"
      subtitle="Active purchase requests, approvals, and contract fulfillment tracking"
      icon={<ProcurementIcon size={24} />}
      badge={`${metrics.procurementCount} Orders`}
      onAddAction={() => setShowModal(true)}
      addLabel="Add Requisition"
    >
      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-card-title">TOTAL REQUISITIONS</span>
          <div className="kpi-main-number">{metrics.procurementCount} Active</div>
          <span className="kpi-supporting-text">Logged in workspace</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-card-title">PIPELINE VALUE</span>
          <div className="kpi-main-number">{metrics.totalSpendFormatted}</div>
          <span className="kpi-supporting-text">Active Requisitions</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-card-title">UNDER AI REVIEW</span>
          <div className="kpi-main-number">{metrics.riskAlertsCount} Items</div>
          <span className="kpi-supporting-text">Benchmark Discrepancy</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-card-title">AVG CYCLE TIME</span>
          <div className="kpi-main-number">3.2 Days</div>
          <span className="kpi-supporting-text">42% Faster vs SLA</span>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-header-main">
            <h3 className="card-title">{currentUser?.companyName} Requisition Master Log</h3>
          </div>
        </div>
        <div className="table-card-body">
          {procurements.length > 0 ? (
            <div className="table-responsive-wrapper">
              <table className="procurement-table">
                <thead>
                  <tr>
                    <th>Requisition / Item</th>
                    <th>Department</th>
                    <th>Vendor</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>AI Action</th>
                  </tr>
                </thead>
                <tbody>
                  {procurements.map((req) => (
                    <tr key={req.id} className="procurement-table-row">
                      <td>
                        <div className="request-cell">
                          <span className="request-title">{req.item || req.request}</span>
                          <span className="request-meta">{req.id} &bull; {req.date}</span>
                        </div>
                      </td>
                      <td><span className="dept-tag">{req.department}</span></td>
                      <td><span className="vendor-text">{req.vendor}</span></td>
                      <td><span className="amount-value">{req.formattedAmount || `₹${Number(req.totalAmount).toLocaleString('en-IN')}`}</span></td>
                      <td><Badge variant={req.statusVariant || 'under-review'} size="sm">{req.status || 'Under Review'}</Badge></td>
                      <td><Badge variant={req.aiActionType || 'under-review'} size="sm">{req.aiRecommendation || 'Under Review'}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state-card" style={{ padding: '48px 24px' }}>
              <div className="empty-state-icon-wrapper">
                <ProcurementIcon size={26} className="text-blue-500" />
              </div>
              <h4 className="empty-state-title">0 Procurement Records</h4>
              <p className="empty-state-desc">
                Procurement analysis and purchase-order management will appear here once records are added.
              </p>
              <button
                type="button"
                className="btn-login-submit"
                style={{ maxWidth: '220px', marginTop: '12px' }}
                onClick={() => setShowModal(true)}
              >
                <PlusIcon size={16} />
                <span>Add First Requisition</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create Requisition</h3>
              <button type="button" className="modal-close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Item / Service Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 20 Ergonomic Monitors"
                  value={formData.item}
                  onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                  required
                />
              </div>
              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Engineering"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Total Cost (₹ INR)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 240000"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-register-back" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-login-submit">Add Requisition</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ModuleContainer>
  );
};

// 2. AI Analysis Module View
export const AiAnalysisModule = () => {
  const { metrics, currentUser } = useAuth();
  const insights = metrics.aiInsightsList || [];

  return (
    <ModuleContainer
      title="AI Neural Spend & Contract Intelligence"
      subtitle="Automated pricing anomaly detection, variance models, and benchmark telemetry"
      icon={<AiAnalysisIcon size={24} />}
      badge="AI Engine Active"
    >
      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-card-title">TOTAL ANALYZED SPEND</span>
          <div className="kpi-main-number">{metrics.totalSpendFormatted}</div>
          <span className="kpi-supporting-text">100% telemetry coverage</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-card-title">SAVINGS IDENTIFIED</span>
          <div className="kpi-main-number">{metrics.potentialSavingsFormatted}</div>
          <span className="kpi-supporting-text">Actionable opportunities</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-card-title">ANOMALIES FLAGGED</span>
          <div className="kpi-main-number">{metrics.riskAlertsCount} Alerts</div>
          <span className="kpi-supporting-text">Variance &gt; 5% vs index</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-card-title">RECORDS AUDITED</span>
          <div className="kpi-main-number">{metrics.procurementCount} Active</div>
          <span className="kpi-supporting-text">Auto-benchmarked</span>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-header-main">
            <SparklesIcon size={18} className="text-blue-500" />
            <h3 className="card-title">Pricing Variance & Benchmark Telemetry</h3>
          </div>
        </div>
        <div className="table-card-body">
          {insights.length > 0 ? (
            <table className="procurement-table">
              <thead>
                <tr>
                  <th>Intelligence Insight / Item</th>
                  <th>Category</th>
                  <th>Severity</th>
                  <th>Impact Details</th>
                </tr>
              </thead>
              <tbody>
                {insights.map((item, idx) => (
                  <tr key={idx} className="procurement-table-row">
                    <td className="request-title">{item.title}</td>
                    <td><span className="dept-tag">{item.category}</span></td>
                    <td>
                      <Badge variant={item.severity === 'high' ? 'risk-high' : 'savings'} size="sm">
                        {item.severity?.toUpperCase()}
                      </Badge>
                    </td>
                    <td>
                      <span className="font-semibold text-blue-600">{item.impact || item.description}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state-card" style={{ padding: '48px 24px' }}>
              <div className="empty-state-icon-wrapper">
                <CheckCircleIcon size={26} className="text-emerald-500" />
              </div>
              <h4 className="empty-state-title">AI Engine Initialized & Ready</h4>
              <p className="empty-state-desc">
                0 pricing anomalies detected for {currentUser?.companyName}. Add vendor rates or requisitions to run automated heuristics.
              </p>
            </div>
          )}
        </div>
      </div>
    </ModuleContainer>
  );
};

// 3. Vendors Module View
export const VendorsModule = () => {
  const { userData, metrics, addVendor, currentUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'IT Hardware',
    annualSpend: '',
    compliance: '98%',
    status: 'Active',
  });

  const vendors = userData?.vendors || [];

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    addVendor({
      name: formData.name.trim(),
      category: formData.category,
      annualSpend: formData.annualSpend ? `₹${Number(formData.annualSpend).toLocaleString('en-IN')}` : '₹0',
      compliance: formData.compliance,
      status: formData.status,
    });
    setFormData({ name: '', category: 'IT Hardware', annualSpend: '', compliance: '98%', status: 'Active' });
    setShowModal(false);
  };

  return (
    <ModuleContainer
      title="Vendor Management & Directory"
      subtitle="Commercial supplier scorecards, annual spend allocation, and contract compliance"
      icon={<VendorsIcon size={24} />}
      badge={`${metrics.vendorCount} Vendors`}
      onAddAction={() => setShowModal(true)}
      addLabel="Add Vendor"
    >
      <div className="card">
        <div className="card-header">
          <div className="card-header-main">
            <h3 className="card-title">{currentUser?.companyName} Approved Suppliers</h3>
          </div>
        </div>
        <div className="table-card-body">
          {vendors.length > 0 ? (
            <table className="procurement-table">
              <thead>
                <tr>
                  <th>Vendor Name</th>
                  <th>Category</th>
                  <th>Annual Spend</th>
                  <th>Compliance</th>
                  <th>Risk Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((v) => (
                  <tr key={v.id} className="procurement-table-row">
                    <td>
                      <div className="request-cell">
                        <span className="request-title">{v.name}</span>
                        <span className="request-meta">{v.id} &bull; Rating: {v.rating || '4.5'} / 5.0</span>
                      </div>
                    </td>
                    <td><span className="dept-tag">{v.category}</span></td>
                    <td><span className="amount-value">{v.annualSpend || '₹0'}</span></td>
                    <td><span className="text-emerald-600 font-bold">{v.compliance || '100%'}</span></td>
                    <td><Badge variant={v.riskVariant || 'approved'} size="sm">{v.riskScore || 'Low Risk'}</Badge></td>
                    <td><span className="status-pill">{v.status || 'Active'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state-card" style={{ padding: '48px 24px' }}>
              <div className="empty-state-icon-wrapper">
                <VendorsIcon size={26} className="text-blue-500" />
              </div>
              <h4 className="empty-state-title">0 Vendors</h4>
              <p className="empty-state-desc">
                No vendor data has been added yet. Start adding suppliers to track scorecards and pricing.
              </p>
              <button
                type="button"
                className="btn-login-submit"
                style={{ maxWidth: '200px', marginTop: '12px' }}
                onClick={() => setShowModal(true)}
              >
                <PlusIcon size={16} />
                <span>Add Vendor</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add Supplier / Vendor</h3>
              <button type="button" className="modal-close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Vendor / Company Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. TechCorp Solutions"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. IT Hardware, Cloud, Lab Tools"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Estimated Spend (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 500000"
                    value={formData.annualSpend}
                    onChange={(e) => setFormData({ ...formData, annualSpend: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-register-back" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-login-submit">Save Vendor</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ModuleContainer>
  );
};

// 4. Subscriptions Module View
export const SubscriptionsModule = () => {
  const { userData, metrics, addSubscription, currentUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    department: 'Engineering',
    seatsTotal: '10',
    seatsActive: '10',
    seatsIdle: '0',
    costPerYear: '120000',
  });

  const subscriptions = userData?.subscriptions || [];

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    addSubscription({
      name: formData.name.trim(),
      department: formData.department,
      seatsTotal: Number(formData.seatsTotal),
      seatsActive: Number(formData.seatsActive),
      seatsIdle: Number(formData.seatsIdle),
      costPerYear: `₹${Number(formData.costPerYear).toLocaleString('en-IN')}`,
    });
    setFormData({ name: '', department: 'Engineering', seatsTotal: '10', seatsActive: '10', seatsIdle: '0', costPerYear: '120000' });
    setShowModal(false);
  };

  return (
    <ModuleContainer
      title="SaaS & Software License Intelligence"
      subtitle="Seat utilization telemetry, idle account detection, and annual renewal management"
      icon={<SubscriptionsIcon size={24} />}
      badge={`${metrics.subscriptionCount} Subscriptions`}
      onAddAction={() => setShowModal(true)}
      addLabel="Add Subscription"
    >
      <div className="card">
        <div className="card-header">
          <div className="card-header-main">
            <h3 className="card-title">{currentUser?.companyName} SaaS Licenses</h3>
          </div>
        </div>
        <div className="table-card-body">
          {subscriptions.length > 0 ? (
            <table className="procurement-table">
              <thead>
                <tr>
                  <th>Application</th>
                  <th>Department</th>
                  <th>Total Seats</th>
                  <th>Idle Seats</th>
                  <th>Annual Cost</th>
                  <th>Utilization</th>
                  <th>Action State</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="procurement-table-row">
                    <td className="request-title">{sub.name}</td>
                    <td><span className="dept-tag">{sub.department}</span></td>
                    <td><span className="font-semibold">{sub.seatsTotal}</span></td>
                    <td>
                      <span className={sub.seatsIdle > 0 ? 'text-rose-600 font-bold' : 'text-muted'}>
                        {sub.seatsIdle} seats
                      </span>
                    </td>
                    <td><span className="amount-value">{sub.costPerYear}</span></td>
                    <td><span className="font-semibold">{sub.utilization}</span></td>
                    <td><Badge variant={sub.statusVariant || 'approved'} size="sm">{sub.status || 'Active'}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state-card" style={{ padding: '48px 24px' }}>
              <div className="empty-state-icon-wrapper">
                <SubscriptionsIcon size={26} className="text-blue-500" />
              </div>
              <h4 className="empty-state-title">0 Subscriptions</h4>
              <p className="empty-state-desc">
                No subscription records available. Add software tools to audit seat utilization and renewals.
              </p>
              <button
                type="button"
                className="btn-login-submit"
                style={{ maxWidth: '220px', marginTop: '12px' }}
                onClick={() => setShowModal(true)}
              >
                <PlusIcon size={16} />
                <span>Add Subscription</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add Software Subscription</h3>
              <button type="button" className="modal-close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Software / Platform Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. GitHub Enterprise, Slack, Jira"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label">Total Seats</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.seatsTotal}
                    onChange={(e) => setFormData({ ...formData, seatsTotal: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Annual Cost (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.costPerYear}
                    onChange={(e) => setFormData({ ...formData, costPerYear: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-register-back" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-login-submit">Save Subscription</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ModuleContainer>
  );
};

// 5. Decisions & Outcomes Module View
export const DecisionsModule = () => {
  const { userData, metrics, currentUser } = useAuth();
  const decisions = userData?.decisions || [];

  return (
    <ModuleContainer
      title="Decisions & Optimization Outcomes"
      subtitle="AI-driven executive recommendations, savings realizations, and procurement sign-offs"
      icon={<DecisionsIcon size={24} />}
      badge={`${metrics.pendingDecisionsCount} Queued`}
    >
      <div className="card">
        <div className="card-header">
          <div className="card-header-main">
            <h3 className="card-title">{currentUser?.companyName} Strategic Decision Queue</h3>
          </div>
        </div>
        <div className="table-card-body">
          {decisions.length > 0 ? (
            <table className="procurement-table">
              <thead>
                <tr>
                  <th>Decision Item</th>
                  <th>Requester</th>
                  <th>Value</th>
                  <th>AI Recommended Action</th>
                  <th>Projected Savings</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {decisions.map((dec) => (
                  <tr key={dec.id} className="procurement-table-row">
                    <td className="request-title">{dec.decision}</td>
                    <td><span className="dept-tag">{dec.requestedBy}</span></td>
                    <td><span className="amount-value">{dec.amount}</span></td>
                    <td><span className="text-blue-600 font-semibold">{dec.aiRecommendedAction}</span></td>
                    <td><Badge variant="savings" size="sm">Save {dec.estimatedSavings}</Badge></td>
                    <td><Badge variant={dec.statusVariant || 'under-review'} size="sm">{dec.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state-card" style={{ padding: '48px 24px' }}>
              <div className="empty-state-icon-wrapper">
                <CheckCircleIcon size={26} className="text-emerald-500" />
              </div>
              <h4 className="empty-state-title">0 Decisions in Queue</h4>
              <p className="empty-state-desc">
                No pending procurement decisions. High-value requisitions and AI savings proposals for {currentUser?.companyName} will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </ModuleContainer>
  );
};
