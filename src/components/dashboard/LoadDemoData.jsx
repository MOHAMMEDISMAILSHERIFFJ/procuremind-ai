// src/components/dashboard/LoadDemoData.jsx
/**
 * Load Demo Procurement Data panel.
 *
 * Allows ANY logged-in user to optionally populate their account with
 * realistic NovaTech Industries demo data.
 *
 * - Not automatic. Requires an explicit click + confirmation.
 * - Uses AuthContext.loadDemoData() which calls dataService.loadDemoData()
 * - After loading, metrics recompute automatically via useMemo in AuthProvider.
 * - Can also be used to reset demo data if already loaded.
 */
import React, { useState } from 'react';
import { SparklesIcon, CheckCircleIcon, ShieldAlertIcon } from '../icons/Icons';
import { useAuth } from '../../context/useAuth';

export function LoadDemoData({ onDataLoaded }) {
  const { loadDemoData, userData, clearData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const isDemoAlreadyLoaded = userData?.isDemoData === true;

  const handleConfirmLoad = async () => {
    setLoading(true);
    setConfirmOpen(false);
    await new Promise((r) => setTimeout(r, 500));
    loadDemoData();
    setLoading(false);
    setLoaded(true);
    if (onDataLoaded) onDataLoaded();
  };

  const handleConfirmClear = async () => {
    setLoading(true);
    setClearConfirmOpen(false);
    await new Promise((r) => setTimeout(r, 400));
    clearData();
    setLoading(false);
    setLoaded(false);
  };

  if (loaded && !clearConfirmOpen) {
    return (
      <div className="demo-load-success-banner">
        <CheckCircleIcon size={16} />
        <span>
          Demo procurement data loaded. All dashboard metrics now reflect the NovaTech Industries dataset.
        </span>
        <button
          type="button"
          className="btn-ai-clear"
          style={{ marginLeft: 'auto' }}
          onClick={() => setClearConfirmOpen(true)}
        >
          Clear Data
        </button>
      </div>
    );
  }

  if (isDemoAlreadyLoaded && !loaded) {
    return (
      <div className="demo-load-success-banner">
        <CheckCircleIcon size={16} />
        <span>Demo procurement data is currently loaded (NovaTech Industries dataset).</span>
        <button
          type="button"
          className="btn-ai-clear"
          style={{ marginLeft: 'auto' }}
          onClick={() => setClearConfirmOpen(true)}
        >
          Clear & Reset
        </button>

        {clearConfirmOpen && (
          <div className="modal-backdrop" onClick={() => setClearConfirmOpen(false)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Clear All Procurement Data?</h3>
                <button type="button" className="modal-close-btn" onClick={() => setClearConfirmOpen(false)}>&times;</button>
              </div>
              <div className="modal-form">
                <p style={{ fontSize: 13, color: '#475569' }}>
                  This will remove all demo procurement data and reset your dashboard to zero. This cannot be undone.
                </p>
                <div className="modal-actions">
                  <button type="button" className="btn-register-back" onClick={() => setClearConfirmOpen(false)}>Cancel</button>
                  <button type="button" className="btn-login-submit" style={{ background: '#EF4444' }} onClick={handleConfirmClear}>
                    Clear All Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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
              Populate your account with the NovaTech Industries dataset — 8 vendors, 5 procurement
              requests, 5 purchase orders, 4 invoices, 5 subscriptions, 3 contracts, 3 risk alerts
              and 3 savings opportunities. Explore ProcureMind AI with realistic data.
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
              Loading...
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
              <h3 className="modal-title">Load NovaTech Industries Demo Data?</h3>
              <button type="button" className="modal-close-btn" onClick={() => setConfirmOpen(false)}>&times;</button>
            </div>
            <div className="modal-form">
              <div style={{ display: 'flex', gap: 10, padding: '12px 16px', background: '#FEF3C7', borderRadius: 8, border: '1px solid #FDE68A', marginBottom: 8 }}>
                <ShieldAlertIcon size={16} style={{ color: '#D97706', flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.5 }}>
                  This will replace any existing data in your account with the demo dataset.
                </p>
              </div>
              <p style={{ fontSize: 13, color: '#475569', margin: 0, lineHeight: 1.7 }}>
                <strong>What's included:</strong><br />
                ✓ 8 vendors with performance & risk scores<br />
                ✓ 5 procurement requests with AI analysis<br />
                ✓ 5 purchase orders cross-referenced to vendors<br />
                ✓ 4 invoices with approval status<br />
                ✓ 5 expenses across 5 categories<br />
                ✓ 3 active contracts<br />
                ✓ 5 SaaS subscriptions with idle seat detection<br />
                ✓ 3 risk alerts &amp; 3 savings opportunities<br />
                ✓ 3 decisions &amp; 1 recorded outcome
              </p>
              <div className="modal-actions">
                <button type="button" className="btn-register-back" onClick={() => setConfirmOpen(false)}>Cancel</button>
                <button type="button" className="btn-login-submit" onClick={handleConfirmLoad}>
                  <CheckCircleIcon size={15} />
                  <span>Load Demo Data</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clear confirm modal (accessible from loaded state) */}
      {clearConfirmOpen && (
        <div className="modal-backdrop" onClick={() => setClearConfirmOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Clear All Procurement Data?</h3>
              <button type="button" className="modal-close-btn" onClick={() => setClearConfirmOpen(false)}>&times;</button>
            </div>
            <div className="modal-form">
              <p style={{ fontSize: 13, color: '#475569' }}>
                This will remove all procurement data and reset your dashboard to zero. This cannot be undone.
              </p>
              <div className="modal-actions">
                <button type="button" className="btn-register-back" onClick={() => setClearConfirmOpen(false)}>Cancel</button>
                <button type="button" className="btn-login-submit" style={{ background: '#EF4444' }} onClick={handleConfirmClear}>
                  Clear All Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
