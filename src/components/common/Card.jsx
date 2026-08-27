// src/components/common/Card.jsx
import React from 'react';

export const Card = ({
  title,
  subtitle,
  icon,
  action,
  children,
  className = '',
  bodyClassName = '',
  headerClassName = '',
  variant = 'default',
  onClick,
  ...props
}) => {
  const hasHeader = title || subtitle || icon || action;

  return (
    <div
      className={`card card-${variant} ${className}`}
      onClick={onClick}
      {...props}
    >
      {hasHeader && (
        <div className={`card-header ${headerClassName}`}>
          <div className="card-header-main">
            {icon && <div className="card-header-icon">{icon}</div>}
            <div>
              {title && <h3 className="card-title">{title}</h3>}
              {subtitle && <p className="card-subtitle">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="card-header-action">{action}</div>}
        </div>
      )}
      <div className={`card-body ${bodyClassName}`}>{children}</div>
    </div>
  );
};
