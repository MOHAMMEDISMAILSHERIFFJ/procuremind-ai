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
import { kpiMetrics } from '../../data/mockData';

export const KpiCards = () => {
  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'CreditCard':
        return <CreditCardIcon size={22} />;
      case 'TrendingUp':
        return <TrendingUpIcon size={22} />;
      case 'ShieldAlert':
        return <ShieldAlertIcon size={22} />;
      case 'CheckSquare':
        return <CheckSquareIcon size={22} />;
      default:
        return <CreditCardIcon size={22} />;
    }
  };

  const getIndicatorBadge = (metric) => {
    switch (metric.id) {
      case 'total-spend':
        return (
          <span className="kpi-tag kpi-tag-neutral">
            <ArrowUpRightIcon size={12} />
            <span>MOM</span>
          </span>
        );
      case 'potential-savings':
        return (
          <span className="kpi-tag kpi-tag-success">
            <ArrowUpRightIcon size={12} />
            <span>High Impact</span>
          </span>
        );
      case 'risk-alerts':
        return (
          <span className="kpi-tag kpi-tag-danger">
            <span className="kpi-dot-pulse" />
            <span>Action Required</span>
          </span>
        );
      case 'pending-decisions':
        return (
          <span className="kpi-tag kpi-tag-info">
            <ArrowDownRightIcon size={12} />
            <span>In Pipeline</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section className="kpi-grid" aria-label="Key Performance Indicators">
      {kpiMetrics.map((metric) => (
        <div key={metric.id} className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-title">{metric.title}</span>
            <div className={`kpi-icon-wrapper kpi-icon-${metric.indicatorType}`}>
              {renderIcon(metric.icon)}
            </div>
          </div>

          <div className="kpi-card-body">
            <div className="kpi-value-row">
              <span className="kpi-main-number">{metric.value}</span>
              {getIndicatorBadge(metric)}
            </div>

            <div className="kpi-supporting-row">
              <span className="kpi-supporting-text">{metric.supportingText}</span>
            </div>
          </div>

          <div className={`kpi-bottom-accent accent-${metric.indicatorType}`} />
        </div>
      ))}
    </section>
  );
};
