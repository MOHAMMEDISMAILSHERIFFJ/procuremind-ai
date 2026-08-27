// src/components/layout/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { BellIcon, SparklesIcon, XCircleIcon } from '../icons/Icons';
import { useAuth } from '../../context/useAuth';

export const Header = () => {
  const { currentUser, logout } = useAuth();
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
        {/* Notification Bell */}
        <button
          type="button"
          className="header-icon-button"
          aria-label="Notifications"
          title="Notifications"
        >
          <BellIcon size={20} />
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
