// src/components/layout/Sidebar.jsx
import React from 'react';
import {
  BrainSparkleLogo,
  DynamicIcon,
  SparklesIcon,
} from '../icons/Icons';
import { navItems, bottomNavItems } from '../../data/mockData';

export const Sidebar = ({ activeTab, onSelectTab }) => {
  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-logo-container">
          <BrainSparkleLogo size={32} />
          <div className="brand-text">
            <span className="brand-title">ProcureMind</span>
            <span className="brand-badge">AI</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="sidebar-nav-section">
        <div className="sidebar-section-label">PLATFORM INTELLIGENCE</div>
        <nav className="sidebar-nav" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => onSelectTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="nav-item-icon">
                  <DynamicIcon name={item.icon} size={18} />
                </span>
                <span className="nav-item-label">{item.label}</span>
                {item.badge && (
                  <span className="nav-item-pill">
                    <SparklesIcon size={10} />
                    {item.badge}
                  </span>
                )}
                {isActive && <span className="nav-active-pill" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* AI System Status Box */}
      <div className="sidebar-ai-status">
        <div className="ai-status-indicator">
          <span className="ai-pulse-dot" />
          <span className="ai-status-text">Procure Intelligence Active</span>
        </div>
        <p className="ai-status-subtext">Real-time spend & risk analysis synced</p>
      </div>

      {/* Bottom Navigation */}
      <div className="sidebar-footer-nav">
        <nav className="sidebar-nav" aria-label="Support Navigation">
          {bottomNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`sidebar-nav-item sidebar-nav-secondary ${isActive ? 'active' : ''}`}
                onClick={() => onSelectTab(item.id)}
              >
                <span className="nav-item-icon">
                  <DynamicIcon name={item.icon} size={18} />
                </span>
                <span className="nav-item-label">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
