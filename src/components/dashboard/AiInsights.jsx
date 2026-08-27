// src/components/dashboard/AiInsights.jsx
import React, { useState } from 'react';
import {
  SparklesIcon,
  ShieldAlertIcon,
  TrendingUpIcon,
  AlertTriangleIcon,
  ChevronRightIcon,
  CheckCircleIcon,
} from '../icons/Icons';
import { Badge } from '../common/Badge';
import { useAuth } from '../../context/useAuth';

export const AiInsights = () => {
  const { metrics, currentUser, createDecisionFromInsight } = useAuth();
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [actionSuccessId, setActionSuccessId] = useState(null);

  const insights = metrics.aiInsightsList || [];

  const getInsightTypeBadge = (insight) => {
    switch (insight.type) {
      case 'duplicate':
        return <Badge variant="risk-high" size="sm">DUPLICATE DETECTED</Badge>;
      case 'price_anomaly':
        return <Badge variant={insight.severity === 'high' ? 'risk-high' : 'warning'} size="sm">PRICE ANOMALY</Badge>;
      case 'spending_anomaly':
        return <Badge variant={insight.severity === 'high' ? 'risk-high' : 'warning'} size="sm">SPENDING ANOMALY</Badge>;
      case 'vendor_alert':
      case 'vendor_risk':
        return <Badge variant={insight.severity === 'high' ? 'risk-high' : 'warning'} size="sm">VENDOR ALERT</Badge>;
      case 'savings':
        return <Badge variant="savings" size="sm">SAVINGS OPPORTUNITY</Badge>;
      case 'budget_deviation':
        return <Badge variant="warning" size="sm">BUDGET DEVIATION</Badge>;
      case 'early_warning':
        return <Badge variant="risk-high" size="sm">EARLY WARNING</Badge>;
      default:
        if (insight.severity === 'high') {
          return <Badge variant="risk-high" size="sm">HIGH RISK</Badge>;
        }
        if (insight.severity === 'savings') {
          return <Badge variant="savings" size="sm">SAVINGS OPPORTUNITY</Badge>;
        }
        if (insight.severity === 'warning') {
          return <Badge variant="warning" size="sm">VENDOR ALERT</Badge>;
        }
        return <Badge variant="neutral" size="sm">{insight.type ? insight.type.toUpperCase() : 'AI INSIGHT'}</Badge>;
    }
  };

  const getInsightIcon = (insight) => {
    if (insight.type === 'savings') {
      return <TrendingUpIcon size={20} className="insight-icon-savings" />;
    }
    if (insight.severity === 'high' || insight.type === 'early_warning' || insight.type === 'duplicate') {
      return <ShieldAlertIcon size={20} className="insight-icon-high" />;
    }
    if (insight.severity === 'warning' || insight.type === 'price_anomaly' || insight.type === 'budget_deviation') {
      return <AlertTriangleIcon size={20} className="insight-icon-warning" />;
    }
    return <SparklesIcon size={20} />;
  };

  const handleTakeAction = (insight) => {
    if (createDecisionFromInsight) {
      createDecisionFromInsight(insight);
      setActionSuccessId(insight.id);
      setTimeout(() => {
        setActionSuccessId(null);
      }, 3000);
    }
  };

  return (
    <section className="dashboard-section" aria-labelledby="ai-insights-heading">
      <div className="section-header-row">
        <div className="section-title-group">
          <div className="section-spark-icon">
            <SparklesIcon size={18} />
          </div>
          <div>
            <h2 id="ai-insights-heading" className="section-title">
              AI Intelligence Insights
            </h2>
            <p className="section-subtitle">
              Deterministic & neural analysis scanning {currentUser?.companyName || 'organization'} transactions, rate cards, and contracts
            </p>
          </div>
        </div>
        <div className="section-actions">
          <span className="insights-active-count">
            <span className="pulse-indicator-emerald" /> {insights.length} actionable items
          </span>
        </div>
      </div>

      {insights.length > 0 ? (
        <div className="ai-insights-grid">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={`insight-card insight-card-${insight.severity || 'info'} ${selectedInsight?.id === insight.id ? 'selected' : ''}`}
            >
              <div className="insight-card-top">
                {getInsightTypeBadge(insight)}
                {insight.confidence && (
                  <span className="insight-confidence-pill">
                    {insight.confidence}
                  </span>
                )}
              </div>

              <div className="insight-card-content">
                <div className="insight-header-wrapper">
                  <div className="insight-card-icon-bubble">
                    {getInsightIcon(insight)}
                  </div>
                  <h3 className="insight-card-title">{insight.title}</h3>
                </div>

                <p className="insight-card-description">{insight.description}</p>

                {insight.impact && (
                  <div className="insight-impact-box">
                    <span className="impact-label">AI Context:</span>
                    <span className="impact-text">{insight.impact}</span>
                  </div>
                )}
                {insight.financialImpact > 0 && (
                  <div className="insight-financial-row">
                    <span className="financial-label">Financial Exposure:</span>
                    <span className="financial-amount">{insight.formattedImpact || `₹${Number(insight.financialImpact).toLocaleString('en-IN')}`}</span>
                  </div>
                )}
              </div>

              <div className="insight-card-footer">
                <span className="insight-category-tag">{insight.category || 'General'}</span>
                <button
                  type="button"
                  className="btn-view-analysis"
                  onClick={() => setSelectedInsight(insight)}
                  aria-label={`View analysis for ${insight.title}`}
                >
                  <span>View Analysis</span>
                  <ChevronRightIcon size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card empty-state-card">
          <div className="empty-state-icon-wrapper">
            <CheckCircleIcon size={24} className="text-emerald-500" />
          </div>
          <h3 className="empty-state-title">AI Intelligence Engine Ready &bull; No Anomalies Found</h3>
          <p className="empty-state-desc">
            ProcureMind intelligence heuristics are actively monitoring {currentUser?.companyName || 'your workspace'}. Add procurement requests, invoices, or load Demo Data to trigger automated anomaly detection and savings analysis.
          </p>
        </div>
      )}

      {/* ── Detailed Evidence & Analysis Modal ─────────────────────────────── */}
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
                  {getInsightIcon(selectedInsight)}
                </div>
                <div>
                  <h3 className="modal-title" style={{ fontSize: '15px', fontWeight: 700 }}>
                    AI Analysis Report & Evidence
                  </h3>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>
                    Reference: {selectedInsight.id}
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
              {/* Header Badges */}
              <div className="analysis-detail-header">
                <div>
                  <h4 className="analysis-detail-title">{selectedInsight.title}</h4>
                  <span className="analysis-detail-category">{selectedInsight.category || 'Procurement Intelligence'}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {getInsightTypeBadge(selectedInsight)}
                  {selectedInsight.confidence && (
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#10B981', marginTop: '4px' }}>
                      {selectedInsight.confidence}
                    </div>
                  )}
                </div>
              </div>

              {/* 1. What was detected */}
              <div className="analysis-section-block">
                <span className="analysis-section-label">WHAT WAS DETECTED</span>
                <p className="analysis-section-text">{selectedInsight.description}</p>
              </div>

              {/* 2. Evidence Points */}
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

              {/* 3. Financial Impact */}
              {selectedInsight.financialImpact > 0 && (
                <div className="analysis-section-block financial-impact-highlight">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="analysis-section-label" style={{ color: '#1E3A8A', margin: 0 }}>
                      FINANCIAL IMPACT / POTENTIAL SAVINGS
                    </span>
                    <span className="analysis-impact-amount">
                      {selectedInsight.formattedImpact || `₹${Number(selectedInsight.financialImpact).toLocaleString('en-IN')}`}
                    </span>
                  </div>
                </div>
              )}

              {/* 4. AI Recommendation */}
              <div className="analysis-section-block recommendation-block">
                <span className="analysis-section-label" style={{ color: '#065F46' }}>
                  RECOMMENDED ACTION
                </span>
                <p className="analysis-section-text" style={{ color: '#064E3B', fontWeight: 500 }}>
                  {selectedInsight.recommendation || selectedInsight.impact || 'Review with procurement committee before authorizing payment.'}
                </p>
              </div>

              {/* Success Banner if Action Taken */}
              {actionSuccessId === selectedInsight.id && (
                <div className="demo-load-success-banner" style={{ marginTop: '12px' }}>
                  <CheckCircleIcon size={16} />
                  <span>
                    Decision record created successfully! Added to Pending Decisions for executive review.
                  </span>
                </div>
              )}

              {/* Modal Actions */}
              <div className="modal-actions" style={{ marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn-register-back"
                  onClick={() => setSelectedInsight(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn-login-submit"
                  onClick={() => handleTakeAction(selectedInsight)}
                >
                  <SparklesIcon size={14} />
                  <span>Create Decision / Take Action</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
