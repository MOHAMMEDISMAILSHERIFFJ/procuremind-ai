// src/components/dashboard/ProcureMindAgentPanel.jsx
/**
 * ProcureMind Autonomous Agent Activity, Recommendation & Negotiation Simulation Panel.
 *
 * Provides a real-time conversational agent execution feed, structured
 * recommendation card, and simulated vendor negotiation preview.
 */
import React, { useState, useEffect } from 'react';
import {
  SparklesIcon,
  CheckCircleIcon,
  ArrowUpRightIcon,
  ClockIcon,
  MessageSquareIcon,
  ChevronDownIcon,
  TrendingUpIcon,
} from '../icons/Icons';
import { Badge } from '../common/Badge';
import {
  subscribeToAgentState,
  resetAgentState,
  AGENT_STATES,
} from '../../services/agentService';

export function ProcureMindAgentPanel({ onNavigateToDecisions }) {
  const [agentState, setAgentState] = useState({
    state: AGENT_STATES.IDLE,
    stepIndex: 0,
    totalSteps: 9,
    message: 'ProcureMind Agent is ready',
    progress: 0,
    steps: [],
    recommendation: null,
    negotiationSimulation: null,
    activePrompt: '',
  });
  const [showNegotiationDialog, setShowNegotiationDialog] = useState(true);
  const [showTrace, setShowTrace] = useState(false);

  useEffect(() => {
    const unsub = subscribeToAgentState((state) => {
      setAgentState(state);
    });
    return unsub;
  }, []);

  const isRunning =
    agentState.state === AGENT_STATES.INGESTING ||
    agentState.state === AGENT_STATES.ANALYZING ||
    agentState.state === AGENT_STATES.BENCHMARKING ||
    agentState.state === AGENT_STATES.VENDOR_INTELLIGENCE ||
    agentState.state === AGENT_STATES.RISK_ANALYSIS ||
    agentState.state === AGENT_STATES.NEGOTIATING ||
    agentState.state === AGENT_STATES.RECOMMENDATION_READY;

  const isCompleted = agentState.state === AGENT_STATES.COMPLETED && agentState.recommendation;

  const rec = agentState.recommendation;
  const negSim = rec?.negotiationSimulation || agentState.negotiationSimulation;

  const getRiskBadge = (level) => {
    const l = (level || 'LOW').toUpperCase();
    if (l === 'HIGH' || l === 'CRITICAL') {
      return <Badge variant="risk-high" size="sm">HIGH RISK</Badge>;
    }
    if (l === 'MEDIUM') {
      return <Badge variant="warning" size="sm">MEDIUM RISK</Badge>;
    }
    return <Badge variant="approved" size="sm">LOW RISK</Badge>;
  };

  return (
    <div className="card agent-panel-card">
      {/* Panel Header */}
      <div className="card-header">
        <div className="card-header-main">
          <div className="card-header-icon agent-icon-bubble">
            <SparklesIcon size={18} />
          </div>
          <div>
            <h3 className="card-title">ProcureMind Intelligence Agent</h3>
            <p className="card-subtitle">
              {isRunning
                ? 'Autonomous procurement analysis & negotiation simulation in progress...'
                : isCompleted
                ? 'Autonomous analysis & negotiation strategy complete'
                : 'Ready to evaluate procurement requisitions in real time'}
            </p>
          </div>
        </div>
        <div className="agent-panel-header-right">
          {isRunning && (
            <span className="agent-status-pill running">
              <span className="login-spinner" style={{ width: 12, height: 12 }} />
              <span>{agentState.message}</span>
            </span>
          )}
          {isCompleted && (
            <button
              type="button"
              className="btn-ai-clear"
              onClick={resetAgentState}
            >
              New Procurement
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar when running */}
      {isRunning && (
        <div className="agent-progress-track">
          <div
            className="agent-progress-bar"
            style={{ width: `${agentState.progress}%` }}
          />
        </div>
      )}

      {/* ── State 1: Agent is Idle ── */}
      {agentState.state === AGENT_STATES.IDLE && (
        <div className="agent-idle-view">
          <div className="agent-idle-icon">
            <SparklesIcon size={24} />
          </div>
          <h4 className="agent-idle-title">Autonomous Agent Standing By</h4>
          <p className="agent-idle-desc">
            Type what you need to procure in the input bar above (e.g. <em>&ldquo;50 laptops for the engineering team&rdquo;</em> or <em>&ldquo;20 monitors for design team under ₹8 lakh&rdquo;</em>). ProcureMind will automatically benchmark historical rates, evaluate vendor SLA, simulate supplier negotiation, and generate an actionable decision.
          </p>
        </div>
      )}

      {/* ── State 2: Progressive Activity Step Stream ── */}
      {(isRunning || (isCompleted && agentState.steps.length > 0)) && (
        <div className="agent-steps-timeline">
          <div className="agent-steps-header">
            <span className="agent-steps-title">
              {isRunning ? 'Autonomous Execution Sequence' : 'Verified Agent Audit Trail'}
            </span>
            <span className="agent-prompt-tag">
              &ldquo;{agentState.activePrompt}&rdquo;
            </span>
          </div>

          <div className="agent-step-list">
            {agentState.steps.map((step, idx) => (
              <div key={step.id || idx} className="agent-step-item">
                <div className="agent-step-check">
                  <CheckCircleIcon size={15} />
                </div>
                <div className="agent-step-content">
                  <span className="agent-step-name">{step.title}</span>
                  <span className="agent-step-detail">{step.detail}</span>
                </div>
              </div>
            ))}

            {isRunning && (
              <div className="agent-step-item running">
                <div className="agent-step-spinner">
                  <span className="login-spinner" style={{ width: 14, height: 14 }} />
                </div>
                <div className="agent-step-content">
                  <span className="agent-step-name" style={{ color: '#2563EB' }}>
                    {agentState.message}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── State 3: Completed Recommendation & Negotiation Card ── */}
      {isCompleted && rec && (
        <div className="agent-recommendation-card">
          <div className="rec-card-header">
            <div className="rec-header-left">
              <div className="rec-badge-pill">
                <SparklesIcon size={14} />
                <span>PROCUREMIND RECOMMENDATION</span>
              </div>
              <h3 className="rec-title">{rec.title}</h3>
              <p className="rec-meta">
                Vendor: <strong>{rec.vendor}</strong> &bull; Department: <strong>{rec.department}</strong> &bull; Quantity: <strong>{rec.quantity} units</strong>
              </p>
            </div>
            <div className="rec-header-right">
              {getRiskBadge(rec.riskLevel)}
              {rec.confidence && (
                <span className="rec-confidence-tag">
                  {rec.confidence} confidence
                </span>
              )}
            </div>
          </div>

          {/* Pricing & Benchmark Metric Comparison */}
          <div className="rec-metrics-grid">
            <div className="rec-metric-block">
              <span className="rec-metric-label">Quoted Price</span>
              <span className="rec-metric-val">{rec.formattedQuotation}</span>
              <span className="rec-metric-sub">₹{rec.unitPrice?.toLocaleString('en-IN')}/unit</span>
            </div>
            <div className="rec-metric-block">
              <span className="rec-metric-label">Historical Benchmark</span>
              <span className="rec-metric-val">{rec.formattedBenchmark}</span>
              <span className="rec-metric-sub">Rate card baseline</span>
            </div>
            <div className="rec-metric-block">
              <span className="rec-metric-label">Price Variance</span>
              <span className={`rec-metric-val ${rec.variancePct > 0 ? 'text-amber' : 'text-emerald'}`}>
                {rec.variance}
              </span>
              <span className="rec-metric-sub">
                {rec.variancePct > 0 ? `+₹${(rec.potentialSavings / 100000).toFixed(2)}L delta` : 'Optimal index'}
              </span>
            </div>
            <div className="rec-metric-block highlight">
              <span className="rec-metric-label" style={{ color: '#065F46' }}>
                Estimated Potential Savings
              </span>
              <span className="rec-metric-val" style={{ color: '#047857' }}>
                {rec.formattedSavings}
              </span>
              <span className="rec-metric-sub" style={{ color: '#065F46' }}>
                Negotiated target upside
              </span>
            </div>
          </div>

          {/* ── AUTONOMOUS VENDOR NEGOTIATION SIMULATION PREVIEW ── */}
          {negSim && (
            <div className="neg-simulation-container">
              <div
                className="neg-simulation-header"
                onClick={() => setShowNegotiationDialog(!showNegotiationDialog)}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="neg-sim-badge">
                    <MessageSquareIcon size={13} />
                    <span>AI NEGOTIATION SIMULATION (PREVIEW)</span>
                  </div>
                  <span className="neg-sim-status-chip">
                    Target: <strong>{negSim.formattedTarget}</strong> ({negSim.formattedSaving} saved)
                  </span>
                </div>
                <button type="button" className="btn-toggle-trace" style={{ padding: 0 }}>
                  <ChevronDownIcon size={14} className={showNegotiationDialog ? 'rotate-180' : ''} />
                </button>
              </div>

              {showNegotiationDialog && (
                <div className="neg-simulation-body">
                  {/* Dialogue rounds */}
                  <div className="neg-dialogue-feed">
                    {negSim.dialogue.map((round) => {
                      const isAgent = round.sender.includes('ProcureMind');
                      return (
                        <div
                          key={round.round}
                          className={`neg-bubble-row ${isAgent ? 'agent' : 'vendor'}`}
                        >
                          <div className="neg-bubble">
                            <span className="neg-bubble-author">{round.sender}</span>
                            <p className="neg-bubble-msg">{round.message}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Negotiation Strategy Highlights */}
                  <div className="neg-strategy-box">
                    <span className="neg-strategy-title">
                      <TrendingUpIcon size={13} />
                      <span>Negotiation Strategy Deployed:</span>
                    </span>
                    <ul className="neg-strategy-list">
                      {negSim.strategyPoints.map((pt, idx) => (
                        <li key={idx} className="neg-strategy-item">&bull; {pt}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Strategy & Recommended Action */}
          <div className="rec-strategy-block">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span className="rec-strategy-label">
                STRATEGIC AI REASONING &bull; {rec.recommendedAction || 'NEGOTIATE'}
              </span>
              {rec.apiStatus && (
                <span style={{ fontSize: '11px', color: '#64748B', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <SparklesIcon size={11} />
                  <span>{rec.apiStatus}</span>
                </span>
              )}
            </div>
            {rec.assessment && (
              <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 6px', fontStyle: 'italic' }}>
                {rec.assessment}
              </p>
            )}
            <p className="rec-strategy-text">{rec.recommendation}</p>

            {Array.isArray(rec.riskReasons) && rec.riskReasons.length > 0 && (
              <div style={{ marginTop: 8, paddingTop: 6, borderTop: '1px dashed #E2E8F0' }}>
                <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Identified Signals:
                </span>
                <ul style={{ margin: '4px 0 0', paddingLeft: 18, fontSize: '11.5px', color: '#334155', lineHeight: 1.4 }}>
                  {rec.riskReasons.map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="rec-card-footer">
            <span className="rec-decision-notice">
              ✓ Pending Decision logged &bull; Human Authorization Required
            </span>
            <div className="rec-actions-group">
              {onNavigateToDecisions && (
                <button
                  type="button"
                  className="btn-review-decision"
                  onClick={onNavigateToDecisions}
                >
                  <span>Review Decision</span>
                  <ArrowUpRightIcon size={13} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Expandable Technical Trace */}
      {isCompleted && (
        <div className="agent-trace-toggle">
          <button
            type="button"
            className="btn-toggle-trace"
            onClick={() => setShowTrace(!showTrace)}
          >
            <ClockIcon size={12} />
            <span>{showTrace ? 'Hide execution trace' : 'View execution trace'}</span>
          </button>
          {showTrace && (
            <div className="agent-trace-box">
              <code>
                Completed at: {rec?.completedAt}<br />
                Requisition Item: {rec?.title}<br />
                Decision ID: {rec?.decisionCreated?.id || 'DEC-AUTO-01'}<br />
                Audit Trail: 9/9 verification stages passed<br />
                Decision Status: Pending Executive Sign-off
              </code>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
