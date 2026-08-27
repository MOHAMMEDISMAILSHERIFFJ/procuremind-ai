// src/components/dashboard/AiInsights.jsx
import React, { useState } from 'react';
import {
  SparklesIcon,
  ShieldAlertIcon,
  TrendingUpIcon,
  AlertTriangleIcon,
  ChevronRightIcon,
} from '../icons/Icons';
import { Badge } from '../common/Badge';
import { aiInsights } from '../../data/mockData';

export const AiInsights = () => {
  const [selectedInsight, setSelectedInsight] = useState(null);

  const getInsightTypeBadge = (insight) => {
    switch (insight.severity) {
      case 'high':
        return (
          <Badge variant="risk-high" size="sm">
            HIGH RISK
          </Badge>
        );
      case 'savings':
        return (
          <Badge variant="savings" size="sm">
            SAVINGS OPPORTUNITY
          </Badge>
        );
      case 'warning':
        return (
          <Badge variant="warning" size="sm">
            VENDOR ALERT
          </Badge>
        );
      default:
        return (
          <Badge variant="neutral" size="sm">
            {insight.type}
          </Badge>
        );
    }
  };

  const getInsightIcon = (severity) => {
    switch (severity) {
      case 'high':
        return <ShieldAlertIcon size={20} className="insight-icon-high" />;
      case 'savings':
        return <TrendingUpIcon size={20} className="insight-icon-savings" />;
      case 'warning':
        return <AlertTriangleIcon size={20} className="insight-icon-warning" />;
      default:
        return <SparklesIcon size={20} />;
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
              AI Insights
            </h2>
            <p className="section-subtitle">
              Continuous neural heuristics scanning procurement requests, vendor rates & contracts
            </p>
          </div>
        </div>
        <div className="section-actions">
          <span className="insights-active-count">
            <span className="pulse-indicator-emerald" /> 3 actionable items
          </span>
        </div>
      </div>

      <div className="ai-insights-grid">
        {aiInsights.map((insight) => (
          <div
            key={insight.id}
            className={`insight-card insight-card-${insight.severity} ${selectedInsight === insight.id ? 'selected' : ''}`}
          >
            {/* Top row: Badge & Confidence */}
            <div className="insight-card-top">
              {getInsightTypeBadge(insight)}
              <span className="insight-confidence-pill">
                {insight.confidence}
              </span>
            </div>

            {/* Content */}
            <div className="insight-card-content">
              <div className="insight-header-wrapper">
                <div className="insight-card-icon-bubble">
                  {getInsightIcon(insight.severity)}
                </div>
                <h3 className="insight-card-title">{insight.title}</h3>
              </div>

              <p className="insight-card-description">{insight.description}</p>

              {/* Supporting impact detail */}
              <div className="insight-impact-box">
                <span className="impact-label">AI Context:</span>
                <span className="impact-text">{insight.impact}</span>
              </div>
            </div>

            {/* Footer action */}
            <div className="insight-card-footer">
              <span className="insight-category-tag">{insight.category}</span>
              <button
                type="button"
                className="btn-view-analysis"
                onClick={() => {
                  setSelectedInsight(
                    selectedInsight === insight.id ? null : insight.id
                  );
                }}
                aria-label={`View analysis for ${insight.title}`}
              >
                <span>View Analysis</span>
                <ChevronRightIcon size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
