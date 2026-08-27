// src/components/dashboard/LoadDemoData.jsx
/**
 * Load Demo Procurement Data Panel
 *
 * Allows ANY logged-in user (including newly registered ones) to
 * optionally load realistic demo procurement data into their account.
 *
 * This is completely separate from the demo@procuremind.ai credentials.
 * A new user can create their own account AND still load demo data to explore.
 *
 * Design requirement: "Load Demo Procurement Data" must be a clear, explicit action
 * — never automatic, never mixed into a new account silently.
 */
import React, { useState } from 'react';
import { SparklesIcon, CheckCircleIcon, ShieldAlertIcon } from '../icons/Icons';
import { useAuth } from '../../context/useAuth';
import { getDemoUserData, saveUserData } from '../../data/userData';

export function LoadDemoData({ onDataLoaded }) {
  const { currentUser, refreshData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleConfirmLoad = async () => {
    if (!currentUser) return;
    setLoading(true);
    setConfirmOpen(false);

    // Small delay for UX
    await new Promise((r) => setTimeout(r, 600));

    // Fetch the canonical demo dataset and stamp it with this user's ID
    const demoData = getDemoUserData();
    demoData.userId = currentUser.id;
    demoData.companyName = currentUser.companyName || demoData.companyName;

    // Save to this user's isolated localStorage slot
    saveUserData(currentUser.id, demoData);

    // Refresh AuthContext state
    if (refreshData) refreshData();

    setLoading(false);
    setLoaded(true);

    if (onDataLoaded) onDataLoaded();
  };

  if (loaded) {
    return (
      <div className="demo-load-success-banner">
        <CheckCircleIcon size={16} />
        <span>
          Demo procurement data loaded successfully into{' '}
          <strong>{currentUser?.companyName || 'your account'}</strong>.
          All dashboard metrics now reflect the demo dataset.
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="demo-load-panel">
        <div className="demo-load-left">
          <div className="demo-load-icon">
            <SparklesIcon size={20} />
          </div>
          <div>
            <h4 className="demo-load-title">Load Demo Procurement Data</h4>
            <p className="demo-load-desc">
              Populate your account with realistic NovaTech Industries demo data — vendors,
              invoices, purchase orders, subscriptions, risk alerts, and savings opportunities.
              This lets you explore ProcureMind AI without adding real records.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="btn-load-demo"
          onClick={() => setConfirmOpen(true)}
          disabled={loading}
        >
          {loading ? (
            <span className="btn-loading-state">
              <span className="login-spinner" />
              Loading Demo Data...
            </span>
          ) : (
            <>
              <SparklesIcon size={14} />
              <span>Load Demo Data</span>
            </>
          )}
        </button>
      </div>

      {/* Confirmation Modal */}
      {confirmOpen && (
        <div className="modal-backdrop" onClick={() => setConfirmOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Load Demo Procurement Data?</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setConfirmOpen(false)}
              >
                &times;
              </button>
            </div>
            <div className="modal-form">
              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  padding: '12px 16px',
                  background: '#FEF3C7',
                  borderRadius: 8,
                  border: '1px solid #FDE68A',
                  marginBottom: 8,
                }}
              >
                <ShieldAlertIcon size={16} style={{ color: '#D97706', flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.5 }}>
                  This will replace your current account data with the NovaTech Industries
                  demo dataset. Any data you have added will be overwritten.
                </p>
              </div>

              <p style={{ fontSize: 13, color: '#475569', margin: 0, lineHeight: 1.6 }}>
                The demo dataset includes:
                <br />
                &bull; 8 active vendors &bull; 12 procurement requests
                <br />
                &bull; 6 SaaS subscriptions &bull; 3 invoices
                <br />
                &bull; 2 risk alerts &bull; 2 savings opportunities
                <br />
                &bull; 5 spend categories &bull; 3 pending decisions
              </p>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-register-back"
                  onClick={() => setConfirmOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-login-submit"
                  onClick={handleConfirmLoad}
                >
                  <CheckCircleIcon size={15} />
                  <span>Load Demo Data</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
