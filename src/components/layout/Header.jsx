// src/components/layout/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { BellIcon, SparklesIcon, XCircleIcon, SettingsIcon, HelpIcon, ShieldAlertIcon } from '../icons/Icons';
import { useAuth } from '../../context/useAuth';

export const Header = ({ onNavigateToTab }) => {
  const { currentUser, metrics, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const activeInsights = metrics?.aiInsightsList || [];
  const riskCount = metrics?.riskAlertsCount || 0;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'PM';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const fullName = currentUser?.fullName || 'Procurement Officer';
  const companyName = currentUser?.companyName || 'Enterprise';
  const jobRole = currentUser?.jobRole || 'Procurement Lead';
  const email = currentUser?.email || '';

  return (
    <header className="top-header">
      <div className="header-greeting-container">
        <div className="header-title-row">
          <h1 className="header-title">Good afternoon, {fullName.split(' ')[0]}</h1>
          <div className="header-badge-ai">
            <SparklesIcon size={14} />
            <span>AI Live Monitor</span>
          </div>
        </div>
        <p className="header-subtitle">
          Here's {companyName}'s procurement intelligence overview.
        </p>
      </div>

      <div className="header-actions">
        {/* Notification Bell & Flyout */}
        <div className="header-user-profile-wrapper" ref={notifRef}>
          <button
            type="button"
            className="header-icon-button"
            aria-label="Notifications"
            title="Procurement Notifications"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            style={{ position: 'relative' }}
          >
            <BellIcon size={20} />
            {activeInsights.length > 0 && (
              <span className="notif-badge-bubble">
                {activeInsights.length > 9 ? '9+' : activeInsights.length}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="profile-dropdown-menu notif-dropdown-menu" role="menu" style={{ width: '320px', right: 0 }}>
              <div className="dropdown-user-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="dropdown-user-name">Live AI Risk Alerts</div>
                  <div className="dropdown-user-org">{activeInsights.length} actionable finding(s)</div>
                </div>
                <span className="nav-item-pill" style={{ background: '#fef2f2', color: '#dc2626' }}>
                  {riskCount} High Risk
                </span>
              </div>
              <div className="dropdown-divider" />
              <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                {activeInsights.length === 0 ? (
                  <div style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
                    No pending risk alerts or anomalies.
                  </div>
                ) : (
                  activeInsights.slice(0, 5).map((ins) => (
                    <div
                      key={ins.id}
                      className="dropdown-item"
                      style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}
                      onClick={() => {
                        setNotificationsOpen(false);
                        if (onNavigateToTab) {
                          onNavigateToTab('ai-analysis', { insightId: ins.id });
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <ShieldAlertIcon size={14} color={ins.severity === 'high' ? '#ef4444' : '#f59e0b'} />
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>{ins.title}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ins.description}
                      </p>
                    </div>
                  ))
                )}
              </div>
              <div className="dropdown-divider" />
              <button
                type="button"
                className="dropdown-item"
                style={{ justifyContent: 'center', fontWeight: 600, color: '#2563eb', fontSize: '12px' }}
                onClick={() => {
                  setNotificationsOpen(false);
                  if (onNavigateToTab) onNavigateToTab('ai-analysis');
                }}
              >
                <span>View All Findings in AI Analysis &rarr;</span>
              </button>
            </div>
          )}
        </div>

        {/* User Profile Pill & Dropdown */}
        <div className="header-user-profile-wrapper" ref={dropdownRef}>
          <div
            className="header-user-profile"
            onClick={() => setProfileOpen(!profileOpen)}
            role="button"
            tabIndex={0}
            aria-haspopup="true"
            aria-expanded={profileOpen}
            title={`${fullName} • ${jobRole} at ${companyName}`}
          >
            <div className="user-avatar-circle">
              {getInitials(fullName)}
            </div>
            <div className="user-profile-info">
              <span className="user-profile-name">{fullName}</span>
              <span className="user-profile-role">{companyName}</span>
            </div>
          </div>

          {/* Profile Dropdown Menu */}
          {profileOpen && (
            <div className="profile-dropdown-menu" role="menu">
              <div className="dropdown-user-header">
                <div className="dropdown-user-name">{fullName}</div>
                <div className="dropdown-user-org">{companyName}</div>
                <div className="dropdown-user-role">{jobRole}</div>
                {email && <div className="dropdown-user-email">{email}</div>}
              </div>
              <div className="dropdown-divider" />
              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  setProfileOpen(false);
                  if (onNavigateToTab) onNavigateToTab('settings');
                }}
                role="menuitem"
              >
                <SettingsIcon size={15} />
                <span>Account Settings</span>
              </button>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  setProfileOpen(false);
                  if (onNavigateToTab) onNavigateToTab('help');
                }}
                role="menuitem"
              >
                <HelpIcon size={15} />
                <span>Help &amp; Support</span>
              </button>
              <div className="dropdown-divider" />
              <button
                type="button"
                className="dropdown-item dropdown-logout-btn"
                onClick={() => {
                  setProfileOpen(false);
                  logout();
                }}
                role="menuitem"
              >
                <XCircleIcon size={15} />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

