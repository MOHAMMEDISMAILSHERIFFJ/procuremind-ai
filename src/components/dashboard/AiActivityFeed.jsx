// src/components/dashboard/AiActivityFeed.jsx
/**
 * AI Activity Feed — Real-time AI operation timeline panel.
 *
 * Subscribes to the aiActivityService pub-sub and shows live AI events.
 * Future: replace simulateAiActivity() with real SSE/WebSocket events
 * from the AI API endpoint without any changes to this component.
 */
import React, { useState, useEffect, useRef } from 'react';
import { SparklesIcon, CheckCircleIcon } from '../icons/Icons';
import {
  subscribeToAiActivity,
  simulateAiActivity,
  clearActivityHistory,
} from '../../services/aiActivityService';

// Phase badge styling
const PHASE_STYLES = {
  queued:     { color: '#94A3B8', bg: '#F1F5F9', label: 'Queued'     },
  analyzing:  { color: '#3B82F6', bg: '#EFF6FF', label: 'Analyzing'  },
  processing: { color: '#8B5CF6', bg: '#F5F3FF', label: 'Processing' },
  complete:   { color: '#10B981', bg: '#ECFDF5', label: 'Complete'   },
  error:      { color: '#EF4444', bg: '#FEF2F2', label: 'Error'      },
};

const OPERATION_LABELS = {
  procurement_analysis: 'Procurement Analysis',
  risk_detection:       'Risk Detection',
  vendor_analysis:      'Vendor Intelligence',
  savings_detection:    'Savings Intelligence',
  negotiation:          'Negotiation Strategy',
  subscription_audit:   'Subscription Audit',
  early_warning:        'Early Warning Scan',
};

// Pulse animation dot
function PulseDot({ color }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: color,
        flexShrink: 0,
        animation: 'aiPulse 1.4s ease-in-out infinite',
      }}
    />
  );
}

export function AiActivityFeed() {
  const [events, setEvents] = useState([]);
  const [activeOp, setActiveOp] = useState(null);   // currently running operation
  const [running, setRunning] = useState(false);
  const feedRef = useRef(null);

  // Subscribe to activity events
  useEffect(() => {
    const unsub = subscribeToAiActivity((event) => {
      setEvents((prev) => [event, ...prev].slice(0, 30)); // keep last 30

      if (event.phase === 'complete' || event.phase === 'error') {
        setRunning(false);
        setActiveOp(null);
      }
    });
    return unsub;
  }, []);

  // Auto-scroll to top when new events arrive
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }, [events]);

  const handleRunDemo = async (opType) => {
    if (running) return;
    setRunning(true);
    setActiveOp(opType);
    await simulateAiActivity(opType, 720);
  };

  const handleClear = () => {
    setEvents([]);
    clearActivityHistory();
  };

  return (
    <div className="card ai-activity-feed-card">
      {/* Header */}
      <div className="card-header">
        <div className="card-header-main">
          <div className="card-header-icon ai-activity-icon-wrapper">
            <SparklesIcon size={18} />
          </div>
          <div>
            <h3 className="card-title">AI Activity Monitor</h3>
            <p className="card-subtitle">
              Real-time intelligence operation timeline &bull; Event-driven architecture
            </p>
          </div>
        </div>
        <div className="ai-activity-header-right">
          {running && (
            <span className="ai-running-badge">
              <PulseDot color="#3B82F6" />
              <span>{OPERATION_LABELS[activeOp] || 'Processing'}</span>
            </span>
          )}
          {events.length > 0 && !running && (
            <button
              type="button"
              className="btn-ai-clear"
              onClick={handleClear}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Trigger Buttons */}
      <div className="ai-trigger-row">
        <span className="ai-trigger-label">Simulate AI Operation:</span>
        <div className="ai-trigger-buttons">
          {Object.entries(OPERATION_LABELS).map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={`btn-ai-trigger ${activeOp === key && running ? 'active' : ''}`}
              onClick={() => handleRunDemo(key)}
              disabled={running}
              title={`Run simulated ${label}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Event Feed */}
      <div className="ai-event-feed" ref={feedRef}>
        {events.length === 0 ? (
          <div className="ai-feed-empty">
            <div className="ai-feed-empty-icon">
              <SparklesIcon size={22} />
            </div>
            <p className="ai-feed-empty-title">AI Intelligence Engine Ready</p>
            <p className="ai-feed-empty-sub">
              Trigger an operation above to see the AI activity timeline. In production,
              these events stream live from the AI analysis API.
            </p>
          </div>
        ) : (
          <ul className="ai-event-list">
            {events.map((ev) => {
              const style = PHASE_STYLES[ev.phase] || PHASE_STYLES.analyzing;
              return (
                <li key={ev.id} className="ai-event-item">
                  <div className="ai-event-left">
                    <PulseDot color={style.color} />
                    <div className="ai-event-content">
                      <p className="ai-event-message">{ev.message}</p>
                      <div className="ai-event-meta">
                        <span
                          className="ai-event-phase-badge"
                          style={{
                            color: style.color,
                            backgroundColor: style.bg,
                          }}
                        >
                          {style.label}
                        </span>
                        <span className="ai-event-op-tag">
                          {OPERATION_LABELS[ev.operationType] || ev.operationType}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="ai-event-time">
                    {new Date(ev.timestamp).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Architecture Note */}
      <div className="ai-feed-footer-note">
        <CheckCircleIcon size={12} />
        <span>
          Events are currently simulated. Replace{' '}
          <code>simulateAiActivity()</code> in{' '}
          <code>aiActivityService.js</code> with SSE/WebSocket to connect the real AI API.
        </span>
      </div>
    </div>
  );
}
