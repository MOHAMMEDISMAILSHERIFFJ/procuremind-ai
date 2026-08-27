// src/components/dashboard/KpiCards.jsx
import React from 'react';
import {
  CreditCardIcon,
  TrendingUpIcon,
  ShieldAlertIcon,
  CheckSquareIcon,
  ArrowUpRightIcon,
  ArrowDownRightIcon,
} from '../icons/Icons';
import { useAuth } from '../../context/useAuth';

export const KpiCards = () => {
  const { metrics, currentUser } = useAuth();

  const cards = [
    {
      id: 'total-spend',
      title: 'TOTAL SPEND',
      value: metrics.totalSpendFormatted,
      supportingText: metrics.totalSpendValue > 0
        ? `YTD Spend for ${currentUser?.companyName || 'Organization'}`
        : 'No transaction data recorded yet',
      icon: <CreditCardIcon size={22} />,
      indicatorType: metrics.totalSpendValue > 0 ? 'neutral' : 'neutral',
      badge: (
        <span className="kpi-tag kpi-tag-neutral">
          <ArrowUpRightIcon size={12} />
          <span>YTD</span>
        </span>
      ),
    },
    {
      id: 'potential-savings',
      title: 'POTENTIAL SAVINGS',
      value: metrics.potentialSavingsFormatted,
      supportingText: metrics.potentialSavingsValue > 0
        ? 'Identified by AI heuristics'
        : '0 savings opportunities detected',
      icon: <TrendingUpIcon size={22} />,
      indicatorType: metrics.potentialSavingsValue > 0 ? 'success' : 'neutral',
      badge: metrics.potentialSavingsValue > 0 ? (
        <span className="kpi-tag kpi-tag-success">
          <ArrowUpRightIcon size={12} />
          <span>Actionable</span>
        </span>
      ) : (
        <span className="kpi-tag kpi-tag-neutral">
          <span>0 Active</span>
        </span>
      ),
    },
    {
      id: 'risk-alerts',
      title: 'RISK ALERTS',
      value: String(metrics.riskAlertsCount),
      supportingText: metrics.riskAlertsCount > 0
        ? `${metrics.riskAlertsCount} price / supplier variance items`
        : 'All requisitions within benchmarks',
      icon: <ShieldAlertIcon size={22} />,
      indicatorType: metrics.riskAlertsCount > 0 ? 'danger' : 'neutral',
      badge: metrics.riskAlertsCount > 0 ? (
        <span className="kpi-tag kpi-tag-danger">
          <span className="kpi-dot-pulse" />
          <span>Review</span>
        </span>
      ) : (
        <span className="kpi-tag kpi-tag-neutral">
          <span>Optimal</span>
        </span>
      ),
    },
    {
      id: 'pending-decisions',
      title: 'PENDING DECISIONS',
      value: String(metrics.pendingDecisionsCount),
      supportingText: metrics.pendingDecisionsCount > 0
        ? `${metrics.pendingDecisionsCount} requisitions awaiting approval`
        : '0 decisions in review queue',
      icon: <CheckSquareIcon size={22} />,
      indicatorType: metrics.pendingDecisionsCount > 0 ? 'info' : 'neutral',
      badge: (
        <span className="kpi-tag kpi-tag-info">
          <ArrowDownRightIcon size={12} />
          <span>Queue</span>
        </span>
      ),
    },
  ];

  return (
    <div className="kpi-section-wrapper">
      <div className="section-storytelling-tag">03 • SPEND &amp; SAVINGS LEDGER</div>
      <section className="kpi-grid" aria-label="Key Performance Indicators">
        {cards.map((metric) => (
          <div key={metric.id} className="kpi-card">
            <div className="kpi-card-header">
              <span className="kpi-card-title">{metric.title}</span>
              <div className={`kpi-icon-wrapper kpi-icon-${metric.indicatorType}`}>
                {metric.icon}
              </div>
            </div>

            <div className="kpi-card-body">
              <div className="kpi-value-row">
                <span className="kpi-main-number">{metric.value}</span>
                {metric.badge}
              </div>

              <div className="kpi-supporting-row">
                <span className="kpi-supporting-text">{metric.supportingText}</span>
              </div>
            </div>

            <div className={`kpi-bottom-accent accent-${metric.indicatorType}`} />
          </div>
        ))}
      </section>
    </div>
  );
};
