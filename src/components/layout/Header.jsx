// src/components/layout/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { BellIcon, SparklesIcon, XCircleIcon } from '../icons/Icons';
import { userProfile } from '../../data/procureMindData';

export const Header = ({ onLogout }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="top-header">
      <div className="header-greeting-container">
        <div className="header-title-row">
          <h1 className="header-title">Good afternoon</h1>
          <div className="header-badge-ai">
            <SparklesIcon size={14} />
            <span>AI Live Monitor</span>
          </div>
        </div>
        <p className="header-subtitle">
          Here's your organization's procurement intelligence overview.
        </p>
      </div>

      <div className="header-actions">
        {/* Notification Bell */}
        <button
          type="button"
          className="header-icon-button"
          aria-label={`Notifications (${userProfile.unreadNotifications} unread)`}
          title="Notifications"
        >
          <BellIcon size={20} />
          {userProfile.unreadNotifications > 0 && (
            <span className="notification-badge-dot" />
          )}
        </button>

        {/* User Profile Pill & Dropdown */}
        <div className="header-user-profile-wrapper" ref={dropdownRef}>
          <div
            className="header-user-profile"
            onClick={() => setProfileOpen(!profileOpen)}
            role="button"
            tabIndex={0}
            aria-haspopup="true"
            aria-expanded={profileOpen}
            title={`${userProfile.name} • ${userProfile.role}`}
          >
            <div className="user-avatar-circle">
              {userProfile.avatarInitials}
            </div>
            <div className="user-profile-info">
              <span className="user-profile-name">{userProfile.name}</span>
              <span className="user-profile-role">{userProfile.role}</span>
            </div>
          </div>

          {/* Profile Dropdown Menu */}
          {profileOpen && (
            <div className="profile-dropdown-menu" role="menu">
              <div className="dropdown-user-header">
                <div className="dropdown-user-name">{userProfile.name}</div>
                <div className="dropdown-user-org">{userProfile.organization}</div>
                <div className="dropdown-user-email">{userProfile.email}</div>
              </div>
              <div className="dropdown-divider" />
              <button
                type="button"
                className="dropdown-item dropdown-logout-btn"
                onClick={() => {
                  setProfileOpen(false);
                  if (onLogout) onLogout();
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
