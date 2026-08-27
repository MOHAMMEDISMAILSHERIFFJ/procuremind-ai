// src/components/modules/ModuleViews.jsx
import React from 'react';
import {
  ProcurementIcon,
  AiAnalysisIcon,
  VendorsIcon,
  SubscriptionsIcon,
  DecisionsIcon,
  SparklesIcon,
  FilterIcon,
  SearchIcon,
} from '../icons/Icons';
import { Badge } from '../common/Badge';
import {
  rawProcurementDataset,
  vendorsDataset,
  subscriptionsDataset,
  aiAnalysisDataset,
  decisionsDataset,
} from '../../data/procureMindData';

export const ModuleContainer = ({ title, subtitle, icon, badge, children }) => (
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
      <div className="module-header-org">
        <span className="org-label">Entity:</span>
        <span className="org-value">NovaTech Industries</span>
      </div>
    </div>
    {children}
  </main>
);

// 1. Procurement Module View
export const ProcurementModule = () => (
  <ModuleContainer
    title="Procurement Requisitions & Pipeline"
    subtitle="Active purchase requests, approvals, and contract fulfillment tracking"
    icon={<ProcurementIcon size={24} />}
    badge="12 Active Orders"
  >
    <div className="kpi-grid">
      <div className="kpi-card">
        <span className="kpi-card-title">TOTAL REQUISITIONS</span>
        <div className="kpi-main-number">5 Active</div>
        <span className="kpi-supporting-text">Across 4 Departments</span>
      </div>
      <div className="kpi-card">
        <span className="kpi-card-title">PIPELINE VALUE</span>
        <div className="kpi-main-number">₹63.5L</div>
        <span className="kpi-supporting-text">Q3 FY26-27</span>
      </div>
      <div className="kpi-card">
        <span className="kpi-card-title">UNDER AI REVIEW</span>
        <div className="kpi-main-number">2 Requisitions</div>
        <span className="kpi-supporting-text">Price Benchmark Anomaly</span>
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
          <h3 className="card-title">NovaTech Requisition Master Log</h3>
        </div>
        <div className="table-header-controls">
          <div className="search-mockup">
            <SearchIcon size={14} />
            <span>Search requisitions...</span>
          </div>
          <button type="button" className="btn-table-filter">
            <FilterIcon size={14} />
            <span>Filter</span>
          </button>
        </div>
      </div>
      <div className="table-card-body">
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
              {rawProcurementDataset.map((req) => (
                <tr key={req.id} className="procurement-table-row">
                  <td>
                    <div className="request-cell">
                      <span className="request-title">{req.item}</span>
                      <span className="request-meta">{req.id} &bull; {req.date}</span>
                    </div>
                  </td>
                  <td><span className="dept-tag">{req.department}</span></td>
                  <td><span className="vendor-text">{req.vendor}</span></td>
                  <td><span className="amount-value">{req.formattedAmount}</span></td>
                  <td><Badge variant={req.statusVariant} size="sm">{req.status}</Badge></td>
                  <td><Badge variant={req.aiActionType} size="sm">{req.aiRecommendation}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </ModuleContainer>
);

// 2. AI Analysis Module View
export const AiAnalysisModule = () => (
  <ModuleContainer
    title="AI Neural Spend & Contract Intelligence"
    subtitle="Automated pricing anomaly detection, variance models, and benchmark telemetry"
    icon={<AiAnalysisIcon size={24} />}
    badge="AI Neural Engine Active"
  >
    <div className="kpi-grid">
      <div className="kpi-card">
        <span className="kpi-card-title">TOTAL ANALYZED SPEND</span>
        <div className="kpi-main-number">{aiAnalysisDataset.totalAnalyzedVolume}</div>
        <span className="kpi-supporting-text">100% telemetry coverage</span>
      </div>
      <div className="kpi-card">
        <span className="kpi-card-title">SAVINGS IDENTIFIED</span>
        <div className="kpi-main-number">{aiAnalysisDataset.identifiedSavings}</div>
        <span className="kpi-supporting-text">Across 14 actionable areas</span>
      </div>
      <div className="kpi-card">
        <span className="kpi-card-title">ANOMALIES FLAGGED</span>
        <div className="kpi-main-number">{aiAnalysisDataset.anomaliesDetected} Alerts</div>
        <span className="kpi-supporting-text">Variance &gt; 5% vs index</span>
      </div>
      <div className="kpi-card">
        <span className="kpi-card-title">CONTRACTS AUDITED</span>
        <div className="kpi-main-number">{aiAnalysisDataset.contractsReviewed} Active</div>
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
        <table className="procurement-table">
          <thead>
            <tr>
              <th>Procurement Item</th>
              <th>Quoted Rate</th>
              <th>Market Benchmark</th>
              <th>Variance</th>
              <th>AI Strategic Recommendation</th>
            </tr>
          </thead>
          <tbody>
            {aiAnalysisDataset.vendorVariances.map((item, idx) => (
              <tr key={idx} className="procurement-table-row">
                <td className="request-title">{item.item}</td>
                <td><span className="amount-value">{item.currentQuote}</span></td>
                <td><span className="text-muted">{item.benchmark}</span></td>
                <td>
                  <Badge variant={item.variance.startsWith('+') ? 'risk-high' : 'savings'} size="sm">
                    {item.variance}
                  </Badge>
                </td>
                <td>
                  <span className="font-semibold text-blue-600">{item.recommendation}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </ModuleContainer>
);

// 3. Vendors Module View
export const VendorsModule = () => (
  <ModuleContainer
    title="Vendor Management & Performance Directory"
    subtitle="Commercial supplier scorecards, annual spend allocation, and contract compliance"
    icon={<VendorsIcon size={24} />}
    badge="142 Active Suppliers"
  >
    <div className="card">
      <div className="card-header">
        <div className="card-header-main">
          <h3 className="card-title">Approved Suppliers Directory & Scorecards</h3>
        </div>
      </div>
      <div className="table-card-body">
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
            {vendorsDataset.map((v) => (
              <tr key={v.id} className="procurement-table-row">
                <td>
                  <div className="request-cell">
                    <span className="request-title">{v.name}</span>
                    <span className="request-meta">{v.id} &bull; Rating: {v.rating} / 5.0</span>
                  </div>
                </td>
                <td><span className="dept-tag">{v.category}</span></td>
                <td><span className="amount-value">{v.annualSpend}</span></td>
                <td><span className="text-emerald-600 font-bold">{v.compliance}</span></td>
                <td><Badge variant={v.riskVariant} size="sm">{v.riskScore}</Badge></td>
                <td><span className="status-pill">{v.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </ModuleContainer>
);

// 4. Subscriptions Module View
export const SubscriptionsModule = () => (
  <ModuleContainer
    title="SaaS & Software License Intelligence"
    subtitle="Seat utilization telemetry, idle account detection, and annual renewal management"
    icon={<SubscriptionsIcon size={24} />}
    badge="4 Enterprise Suites"
  >
    <div className="card">
      <div className="card-header">
        <div className="card-header-main">
          <h3 className="card-title">Active SaaS Licenses & Seat Utilization</h3>
        </div>
      </div>
      <div className="table-card-body">
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
            {subscriptionsDataset.map((sub) => (
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
                <td><Badge variant={sub.statusVariant} size="sm">{sub.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </ModuleContainer>
);

// 5. Decisions & Outcomes Module View
export const DecisionsModule = () => (
  <ModuleContainer
    title="Decisions & Optimization Outcomes"
    subtitle="AI-driven executive recommendations, savings realizations, and procurement sign-offs"
    icon={<DecisionsIcon size={24} />}
    badge="3 Pending Review"
  >
    <div className="card">
      <div className="card-header">
        <div className="card-header-main">
          <h3 className="card-title">Strategic AI Decision Queue</h3>
        </div>
      </div>
      <div className="table-card-body">
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
            {decisionsDataset.map((dec) => (
              <tr key={dec.id} className="procurement-table-row">
                <td className="request-title">{dec.decision}</td>
                <td><span className="dept-tag">{dec.requestedBy}</span></td>
                <td><span className="amount-value">{dec.amount}</span></td>
                <td><span className="text-blue-600 font-semibold">{dec.aiRecommendedAction}</span></td>
                <td><Badge variant="savings" size="sm">Save {dec.estimatedSavings}</Badge></td>
                <td><Badge variant={dec.statusVariant} size="sm">{dec.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </ModuleContainer>
);
