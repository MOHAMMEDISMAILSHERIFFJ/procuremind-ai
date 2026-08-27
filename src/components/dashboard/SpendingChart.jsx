// src/components/dashboard/SpendingChart.jsx
import React, { useState } from 'react';
import { CreditCardIcon, TrendingUpIcon } from '../icons/Icons';
import { useAuth } from '../../context/useAuth';

export const SpendingChart = () => {
  const { metrics, currentUser } = useAuth();
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const categories = metrics.categoryBreakdown || [];

  return (
    <div className="card spending-overview-card">
      <div className="section-storytelling-tag">06 • SPEND ALLOCATION &amp; TELEMETRY</div>
      <div className="card-header">
        <div className="card-header-main">
          <div className="card-header-icon chart-icon-wrapper">
            <CreditCardIcon size={20} />
          </div>
          <div>
            <h3 className="card-title">Spending Overview</h3>
            <p className="card-subtitle">
              {currentUser?.companyName || 'Organization'} expenditure breakdown by functional category
            </p>
          </div>
        </div>
        <div className="chart-header-badge">
          <TrendingUpIcon size={14} />
          <span>Total: {metrics.totalSpendFormatted}</span>
        </div>
      </div>

      <div className="card-body chart-body">
        {categories.length > 0 ? (
          <>
            {/* Cumulative Stacked Distribution Bar */}
            <div className="stacked-bar-container" aria-label="Spend Distribution Bar">
              {categories.map((item) => {
                const isHovered = hoveredCategory === item.category;
                return (
                  <div
                    key={item.category}
                    className={`stacked-bar-segment ${
                      hoveredCategory && !isHovered ? 'dimmed' : ''
                    }`}
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                    onMouseEnter={() => setHoveredCategory(item.category)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    title={`${item.category}: ${item.amount} (${item.percentage}%)`}
                  />
                );
              })}
            </div>

            {/* Category Breakdown Rows */}
            <div className="category-breakdown-list">
              {categories.map((item) => {
                const isHovered = hoveredCategory === item.category;
                return (
                  <div
                    key={item.category}
                    className={`category-row ${isHovered ? 'highlighted' : ''}`}
                    onMouseEnter={() => setHoveredCategory(item.category)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <div className="category-meta">
                      <span
                        className="category-color-dot"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="category-name">{item.category}</span>
                    </div>

                    <div className="category-progress-track">
                      <div
                        className="category-progress-fill"
                        style={{
                          width: `${item.percentage * 2}%`,
                          maxWidth: '100%',
                          backgroundColor: item.color,
                        }}
                      />
                    </div>

                    <div className="category-numbers">
                      <span className="category-amount">{item.amount}</span>
                      <span className="category-percentage">{item.percentage}%</span>
                    </div>

                    <div className="category-budget-badge">
                      <span className="budget-label">Cap:</span>
                      <span className="budget-value">{item.budget}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Chart Note */}
            <div className="chart-footer-note">
              <span className="note-dot" />
              <span>
                Real-time telemetry aggregated from {currentUser?.companyName || 'organization'} transactions.
              </span>
            </div>
          </>
        ) : (
          <div className="empty-state-card" style={{ padding: '32px 16px' }}>
            <div className="empty-state-icon-wrapper">
              <CreditCardIcon size={22} className="text-blue-500" />
            </div>
            <h4 className="empty-state-title">No Recorded Expenses</h4>
            <p className="empty-state-desc">
              Start adding procurement records or upload expense sheets to generate your live spending distribution.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
