// src/components/dashboard/SpendingChart.jsx
import React, { useState } from 'react';
import { CreditCardIcon, TrendingUpIcon } from '../icons/Icons';
import { spendingByCategory } from '../../data/mockData';

export const SpendingChart = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  return (
    <div className="card spending-overview-card">
      <div className="card-header">
        <div className="card-header-main">
          <div className="card-header-icon chart-icon-wrapper">
            <CreditCardIcon size={20} />
          </div>
          <div>
            <h3 className="card-title">Spending Overview</h3>
            <p className="card-subtitle">
              Expenditure breakdown by core functional category
            </p>
          </div>
        </div>
        <div className="chart-header-badge">
          <TrendingUpIcon size={14} />
          <span>YTD Total: ₹50.4L</span>
        </div>
      </div>

      <div className="card-body chart-body">
        {/* Cumulative Stacked Distribution Bar */}
        <div className="stacked-bar-container" aria-label="Spend Distribution Bar">
          {spendingByCategory.map((item) => {
            const isHovered = hoveredCategory === item.category;
            return (
              <div
                key={item.category}
                className={`stacked-bar-segment ${item.barClass} ${
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

        {/* Legend / Category Breakdown Rows */}
        <div className="category-breakdown-list">
          {spendingByCategory.map((item) => {
            const isHovered = hoveredCategory === item.category;
            return (
              <div
                key={item.category}
                className={`category-row ${isHovered ? 'highlighted' : ''}`}
                onMouseEnter={() => setHoveredCategory(item.category)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                {/* Category Name & Color Tag */}
                <div className="category-meta">
                  <span
                    className="category-color-dot"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="category-name">{item.category}</span>
                </div>

                {/* Progress Bar */}
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

                {/* Amount & Percentage */}
                <div className="category-numbers">
                  <span className="category-amount">{item.amount}</span>
                  <span className="category-percentage">
                    {item.percentage}%
                  </span>
                </div>

                {/* Budget Comparison */}
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
            IT and Software account for 63.3% of total organizational spend. AI recommends batch vendor negotiations.
          </span>
        </div>
      </div>
    </div>
  );
};
