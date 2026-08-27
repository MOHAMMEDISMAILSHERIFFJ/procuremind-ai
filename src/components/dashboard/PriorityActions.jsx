// src/components/dashboard/PriorityActions.jsx
import React, { useState } from 'react';
import {
  CheckSquareIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ClockIcon,
} from '../icons/Icons';
import { Badge } from '../common/Badge';
import { useAuth } from '../../context/useAuth';

export const PriorityActions = ({ onNavigateToTab }) => {
  const { metrics, currentUser, createDecisionFromInsight } = useAuth();
  const [completedActions, setCompletedActions] = useState([]);
  const [selectedActionModal, setSelectedActionModal] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  const actions = metrics.priorityActionsList || [];

  const toggleAction = (id) => {
    setCompletedActions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExecuteAction = (item) => {
    if (item.insightRef && createDecisionFromInsight) {
      createDecisionFromInsight(item.insightRef);
      setActionSuccess(item.id);
      setCompletedActions((prev) => [...new Set([...prev, item.id])]);
      setTimeout(() => {
        setActionSuccess(null);
        setSelectedActionModal(null);
      }, 2000);
    } else {
      toggleAction(item.id);
      setSelectedActionModal(null);
    }
  };

  const getPriorityBadge = (priority, variant) => {
    switch (variant) {
      case 'high':
        return (
          <Badge variant="risk-high" size="sm">
            High Priority
          </Badge>
        );
      case 'medium':
        return (
          <Badge variant="warning" size="sm">
            Medium Priority
          </Badge>
        );
      case 'low':
      default:
        return (
          <Badge variant="neutral" size="sm">
            Low Priority
          </Badge>
        );
    }
  };

  const pendingCount = actions.length - completedActions.length;

  return (
    <div className="card priority-actions-card">
      <div className="section-storytelling-tag">07 • EXECUTIVE PRIORITY ACTIONS</div>
      <div className="card-header">
        <div className="card-header-main">
          <div className="card-header-icon priority-icon-wrapper">
            <CheckSquareIcon size={20} />
          </div>
          <div>
            <h3 className="card-title">Priority Actions</h3>
            <p className="card-subtitle">
              High-leverage tasks prioritized by financial risk and potential savings
            </p>
          </div>
        </div>
        <div className="priority-header-count">
          <span className="priority-count-badge">
            {pendingCount > 0 ? `${pendingCount} Pending` : '0 Pending'}
          </span>
        </div>
      </div>

      <div className="card-body priority-body">
        {actions.length > 0 ? (
          <div className="priority-items-list">
            {actions.map((item, index) => {
              const isCompleted = completedActions.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`priority-item-row ${isCompleted ? 'completed' : ''}`}
                >
                  <div className="priority-item-left">
                    <button
                      type="button"
                      className={`priority-check-circle ${isCompleted ? 'checked' : ''}`}
                      onClick={() => toggleAction(item.id)}
                      aria-label={`Mark "${item.title}" as complete`}
                    >
                      {isCompleted ? (
                        <CheckCircleIcon size={16} />
                      ) : (
                        <span className="priority-number">{index + 1}</span>
                      )}
                    </button>

                    <div className="priority-text-block">
                      <div className="priority-title-line">
                        <h4 className={`priority-item-title ${isCompleted ? 'line-through' : ''}`}>
                          {item.title}
                        </h4>
                        {getPriorityBadge(item.priority, item.priorityVariant)}
                      </div>
                      <p className="priority-item-subtitle">{item.subtitle}</p>
                      <div className="priority-meta-line">
                        <span className="priority-dept-tag">{item.department}</span>
                        <span className="priority-eta">
                          <ClockIcon size={12} />
                          {item.eta}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="priority-action-cta">
                    <button
                      type="button"
                      className="btn-priority-action"
                      onClick={() => setSelectedActionModal(item)}
                    >
                      <span>{isCompleted ? '✓ Completed' : item.actionLabel}</span>
                      <ChevronRightIcon size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state-card" style={{ padding: '32px 16px' }}>
            <div className="empty-state-icon-wrapper">
              <CheckCircleIcon size={22} className="text-emerald-500" />
            </div>
            <h4 className="empty-state-title">No Pending Actions</h4>
            <p className="empty-state-desc">
              All procurement workflows for {currentUser?.companyName || 'organization'} are currently in order.
            </p>
          </div>
        )}
      </div>

      {/* Priority Action Execution Modal */}
      {selectedActionModal && (
        <div className="modal-backdrop" onClick={() => setSelectedActionModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Executive Action: {selectedActionModal.actionLabel}</h3>
              <button type="button" className="modal-close-btn" onClick={() => setSelectedActionModal(null)}>&times;</button>
            </div>
            <div className="modal-form" style={{ padding: '16px 20px 20px' }}>
              <div style={{ marginBottom: 14 }}>
                <h4 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                  {selectedActionModal.title}
                </h4>
                <p style={{ margin: 0, fontSize: 13, color: '#475569', lineHeight: 1.5 }}>
                  {selectedActionModal.subtitle}
                </p>
              </div>

              <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 4 }}>
                  <span>Target Department:</span>
                  <strong style={{ color: '#0f172a' }}>{selectedActionModal.department}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b' }}>
                  <span>Execution Timeline:</span>
                  <strong style={{ color: '#0f172a' }}>{selectedActionModal.eta}</strong>
                </div>
              </div>

              {actionSuccess === selectedActionModal.id && (
                <div className="demo-load-success-banner" style={{ marginBottom: 12 }}>
                  <span>✓ Action executed! Logged into Decisions &amp; Outcomes ledger.</span>
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="btn-register-back" onClick={() => setSelectedActionModal(null)}>
                  Cancel
                </button>
                {onNavigateToTab && (
                  <button
                    type="button"
                    className="btn-decision-negotiate"
                    style={{ padding: '8px 14px' }}
                    onClick={() => {
                      setSelectedActionModal(null);
                      onNavigateToTab('decisions');
                    }}
                  >
                    <span>View Decisions &rarr;</span>
                  </button>
                )}
                <button
                  type="button"
                  className="btn-login-submit"
                  onClick={() => handleExecuteAction(selectedActionModal)}
                >
                  <CheckSquareIcon size={14} />
                  <span>Execute {selectedActionModal.actionLabel}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

