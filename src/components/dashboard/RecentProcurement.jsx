// src/components/dashboard/RecentProcurement.jsx
import React from 'react';
import {
  ProcurementIcon,
  SearchIcon,
  FilterIcon,
  ChevronRightIcon,
} from '../icons/Icons';
import { Badge } from '../common/Badge';
import { recentProcurements } from '../../data/mockData';

export const RecentProcurement = () => {
  const getStatusBadge = (status, variant) => {
    return (
      <Badge variant={variant} size="sm">
        {status}
      </Badge>
    );
  };

  const getAiRecommendationBadge = (recommendation, actionType) => {
    return (
      <Badge variant={actionType} size="sm">
        {recommendation}
      </Badge>
    );
  };

  return (
    <div className="card recent-procurement-card">
      <div className="card-header">
        <div className="card-header-main">
          <div className="card-header-icon procurement-icon-wrapper">
            <ProcurementIcon size={20} />
          </div>
          <div>
            <h3 className="card-title">Recent Procurement</h3>
            <p className="card-subtitle">
              Active requisitions with automated AI decision intelligence
            </p>
          </div>
        </div>

        <div className="table-header-controls">
          <div className="search-mockup">
            <SearchIcon size={14} />
            <span>Filter requests...</span>
          </div>
          <button type="button" className="btn-table-filter" title="Filter columns">
            <FilterIcon size={14} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="card-body table-card-body">
        <div className="table-responsive-wrapper">
          <table className="procurement-table">
            <thead>
              <tr>
                <th scope="col" className="th-request">Request</th>
                <th scope="col" className="th-dept">Department</th>
                <th scope="col" className="th-amount">Amount</th>
                <th scope="col" className="th-status">Status</th>
                <th scope="col" className="th-ai">AI Recommendation</th>
                <th scope="col" className="th-actions"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {recentProcurements.map((item) => (
                <tr key={item.id} className="procurement-table-row">
                  {/* Request */}
                  <td className="td-request">
                    <div className="request-cell">
                      <span className="request-title">{item.request}</span>
                      <div className="request-meta">
                        <span className="request-id">{item.id}</span>
                        <span className="request-vendor">• {item.vendor}</span>
                      </div>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="td-dept">
                    <span className="dept-tag">{item.department}</span>
                  </td>

                  {/* Amount */}
                  <td className="td-amount">
                    <span className="amount-value">{item.amount}</span>
                  </td>

                  {/* Status */}
                  <td className="td-status">
                    {getStatusBadge(item.status, item.statusVariant)}
                  </td>

                  {/* AI Recommendation */}
                  <td className="td-ai">
                    {getAiRecommendationBadge(
                      item.aiRecommendation,
                      item.aiActionType
                    )}
                  </td>

                  {/* Actions */}
                  <td className="td-actions">
                    <button
                      type="button"
                      className="btn-row-action"
                      aria-label={`View details for ${item.request}`}
                    >
                      <ChevronRightIcon size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-footer-row">
          <span className="table-pagination-info">
            Showing 3 of 18 active procurement requests
          </span>
          <button type="button" className="btn-view-all-table">
            <span>View All Requisitions</span>
            <ChevronRightIcon size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
