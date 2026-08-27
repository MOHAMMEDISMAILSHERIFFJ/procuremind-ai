// src/components/common/Badge.jsx
import React from 'react';
import {
  AlertTriangleIcon,
  ShieldAlertIcon,
  SparklesIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowUpRightIcon,
} from '../icons/Icons';

export const Badge = ({
  variant = 'neutral',
  size = 'md',
  icon = null,
  children,
  className = '',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'risk-high':
      case 'high':
        return {
          bg: '#FEF2F2',
          text: '#991B1B',
          border: '#FECACA',
          dot: '#EF4444',
          defaultIcon: <ShieldAlertIcon size={13} />,
        };
      case 'savings':
      case 'success':
        return {
          bg: '#ECFDF5',
          text: '#065F46',
          border: '#A7F3D0',
          dot: '#10B981',
          defaultIcon: <SparklesIcon size={13} />,
        };
      case 'warning':
      case 'medium':
      case 'alert':
        return {
          bg: '#FFFBEB',
          text: '#92400E',
          border: '#FDE68A',
          dot: '#F59E0B',
          defaultIcon: <AlertTriangleIcon size={13} />,
        };
      case 'under-review':
        return {
          bg: '#EFF6FF',
          text: '#1E40AF',
          border: '#BFDBFE',
          dot: '#3B82F6',
          defaultIcon: <ClockIcon size={13} />,
        };
      case 'flagged':
        return {
          bg: '#FFF1F2',
          text: '#BE123C',
          border: '#FECDD3',
          dot: '#F43F5E',
          defaultIcon: <AlertTriangleIcon size={13} />,
        };
      case 'approved':
        return {
          bg: '#F0FDF4',
          text: '#166534',
          border: '#BBF7D0',
          dot: '#22C55E',
          defaultIcon: <CheckCircleIcon size={13} />,
        };
      case 'ai-recommendation':
      case 'ai':
        return {
          bg: '#EEF2FF',
          text: '#3730A3',
          border: '#C7D2FE',
          dot: '#6366F1',
          defaultIcon: <SparklesIcon size={13} />,
        };
      case 'negotiate':
        return {
          bg: '#FEF3C7',
          text: '#78350F',
          border: '#FCD34D',
          dot: '#D97706',
          defaultIcon: <ArrowUpRightIcon size={13} />,
        };
      case 'cancel':
        return {
          bg: '#FFE4E6',
          text: '#9F1239',
          border: '#FDA4AF',
          dot: '#E11D48',
          defaultIcon: <XCircleIcon size={13} />,
        };
      case 'proceed':
        return {
          bg: '#DCFCE7',
          text: '#14532D',
          border: '#86EFAC',
          dot: '#16A34A',
          defaultIcon: <CheckCircleIcon size={13} />,
        };
      case 'low':
      case 'neutral':
      default:
        return {
          bg: '#F1F5F9',
          text: '#475569',
          border: '#E2E8F0',
          dot: '#94A3B8',
          defaultIcon: null,
        };
    }
  };

  const styleConfig = getVariantStyles();

  return (
    <span
      className={`badge badge-${size} ${className}`}
      style={{
        backgroundColor: styleConfig.bg,
        color: styleConfig.text,
        borderColor: styleConfig.border,
      }}
    >
      {styleConfig.dot && (
        <span
          className="badge-dot"
          style={{ backgroundColor: styleConfig.dot }}
          aria-hidden="true"
        />
      )}
      {icon !== false && (icon || styleConfig.defaultIcon)}
      <span className="badge-text">{children}</span>
    </span>
  );
};
