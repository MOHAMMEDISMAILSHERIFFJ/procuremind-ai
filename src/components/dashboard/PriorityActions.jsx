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

export const PriorityActions = () => {
  const { metrics, currentUser } = useAuth();
  const [completedActions, setCompletedActions] = useState([]);

  const actions = metrics.priorityActionsList || [];

  const toggleAction = (id) => {
    setCompletedActions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
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
                      onClick={() => alert(`Opening workflow: ${item.title}`)}
                    >
                      <span>{item.actionLabel}</span>
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
    </div>
  );
};
