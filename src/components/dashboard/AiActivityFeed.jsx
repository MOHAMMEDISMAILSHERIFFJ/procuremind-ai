// src/components/dashboard/AiActivityFeed.jsx
/**
 * AI Activity Monitor — Real-time Intelligence Processing Timeline.
 *
 * Subscribes to the aiActivityService pub-sub and visualizes the
 * 10-stage intelligence processing pipeline.
 */
import React, { useState, useEffect, useRef } from 'react';
import { SparklesIcon, CheckCircleIcon } from '../icons/Icons';
import {
  subscribeToAiActivity,
  simulateAiActivity,
  clearActivityHistory,
} from '../../services/aiActivityService';
import { useAuth } from '../../context/useAuth';

// Phase badge styling
const PHASE_STYLES = {
  queued:     { color: '#94A3B8', bg: '#F1F5F9', label: 'Queued'     },
  analyzing:  { color: '#3B82F6', bg: '#EFF6FF', label: 'Analyzing'  },
  processing: { color: '#8B5CF6', bg: '#F5F3FF', label: 'Processing' },
  complete:   { color: '#10B981', bg: '#ECFDF5', label: 'Complete'   },
  error:      { color: '#EF4444', bg: '#FEF2F2', label: 'Error'      },
};

const OPERATION_LABELS = {
  full_pipeline:    '⚡ Run Full Intelligence Pipeline (10 Steps)',
  duplicate_scan:   'Duplicate Detection',
  price_benchmark:  'Price Benchmark',
  vendor_risk:      'Vendor Risk Scan',
  savings_detection:'Savings Detection',
  early_warning:    'Early Warning Scan',
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
  const { refreshData } = useAuth();
  const [events, setEvents] = useState([]);
  const [activeOp, setActiveOp] = useState(null);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const feedRef = useRef(null);

  // Subscribe to activity events
  useEffect(() => {
    const unsub = subscribeToAiActivity((event) => {
      setEvents((prev) => [event, ...prev].slice(0, 40));

      if (event.totalSteps > 0) {
        setProgress(Math.round(((event.stepIndex + 1) / event.totalSteps) * 100));
      }

      if (event.phase === 'complete' || event.phase === 'error') {
        setRunning(false);
        setActiveOp(null);
        if (refreshData) refreshData();
      }
    });
    return unsub;
  }, [refreshData]);

  // Auto-scroll to top when new events arrive
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }, [events]);

  const handleRunOperation = async (opType) => {
    if (running) return;
    setRunning(true);
    setActiveOp(opType);
    setProgress(5);
    const delay = opType === 'full_pipeline' ? 420 : 550;
    await simulateAiActivity(opType, delay);
  };

  const handleClear = () => {
    setEvents([]);
    clearActivityHistory();
    setProgress(0);
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
            <h3 className="card-title">AI Intelligence Processing Engine</h3>
            <p className="card-subtitle">
              Real-time deterministic &amp; neural pipeline monitor &bull; 10-Stage Pipeline
            </p>
          </div>
        </div>
        <div className="ai-activity-header-right">
          {running && (
            <span className="ai-running-badge">
              <PulseDot color="#3B82F6" />
              <span>{OPERATION_LABELS[activeOp] || 'Analyzing Data...'} ({progress}%)</span>
            </span>
          )}
          {events.length > 0 && !running && (
            <button
              type="button"
              className="btn-ai-clear"
              onClick={handleClear}
            >
              Clear Log
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar when running */}
      {running && (
        <div style={{ height: '3px', width: '100%', backgroundColor: '#E2E8F0', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              backgroundColor: '#2563EB',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      )}

      {/* Trigger Buttons */}
      <div className="ai-trigger-row">
        <span className="ai-trigger-label">Trigger Analysis:</span>
        <div className="ai-trigger-buttons">
          {Object.entries(OPERATION_LABELS).map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={`btn-ai-trigger ${activeOp === key && running ? 'active' : ''} ${key === 'full_pipeline' ? 'btn-primary-trigger' : ''}`}
              onClick={() => handleRunOperation(key)}
              disabled={running}
              title={`Execute ${label}`}
              style={key === 'full_pipeline' ? { borderColor: '#3B82F6', fontWeight: 700, color: '#1D4ED8', background: '#EFF6FF' } : {}}
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
            <p className="ai-feed-empty-title">Deterministic Intelligence Engine Active</p>
            <p className="ai-feed-empty-sub">
              Click <strong>"⚡ Run Full Intelligence Pipeline"</strong> above to observe the 10-stage analysis process across duplicates, prices, vendor risks, and savings opportunities.
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
          UI represents the 10-stage intelligence pipeline. When an external model/API is connected in <code>aiService.js</code>, this stream binds to live SSE/WebSocket events.
        </span>
      </div>
    </div>
  );
}
