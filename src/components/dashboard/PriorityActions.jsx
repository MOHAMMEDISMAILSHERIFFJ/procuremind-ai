// src/components/dashboard/PriorityActions.jsx
import React, { useState } from 'react';
import {
  CheckSquareIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ClockIcon,
} from '../icons/Icons';
import { Badge } from '../common/Badge';
import { priorityActions } from '../../data/mockData';

export const PriorityActions = () => {
  const [completedActions, setCompletedActions] = useState([]);

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
            {priorityActions.length - completedActions.length} Pending
          </span>
        </div>
      </div>

      <div className="card-body priority-body">
        <div className="priority-items-list">
          {priorityActions.map((item, index) => {
            const isCompleted = completedActions.includes(item.id);
            return (
              <div
                key={item.id}
                className={`priority-item-row ${isCompleted ? 'completed' : ''}`}
              >
                {/* Left index & checkbox indicator */}
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

                {/* Right Action Button */}
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
      </div>
    </div>
  );
};
