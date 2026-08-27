// src/components/dashboard/ProcureMindAgentBar.jsx
/**
 * Prominent ProcureMind AI Agent Input Bar.
 *
 * Primary user action on the dashboard:
 * "What would you like to procure?"
 *
 * Automatically triggers the autonomous agent workflow without requiring manual
 * technical pipeline configuration.
 */
import React, { useState } from 'react';
import { SparklesIcon, ArrowUpRightIcon } from '../icons/Icons';
import { useAuth } from '../../context/useAuth';
import { executeAutonomousAgent } from '../../services/agentService';

const SUGGESTIONS = [
  '50 laptops for the engineering team',
  '20 monitors for the design team under ₹8 lakh',
  '100 Figma licenses for the product team',
  'AWS cloud compute infrastructure',
  '25 ergonomic workstations & chairs',
];

export function ProcureMindAgentBar({ isAgentRunning, onTriggerAgent }) {
  const { currentUser, refreshData } = useAuth();
  const [prompt, setPrompt] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || isAgentRunning) return;

    if (onTriggerAgent) onTriggerAgent();

    const textToRun = prompt.trim();
    setPrompt('');

    await executeAutonomousAgent(textToRun, {
      userId: currentUser?.id,
      onComplete: () => {
        if (refreshData) refreshData();
      },
    });
  };

  const handleSuggestionClick = async (suggestion) => {
    if (isAgentRunning) return;
    setPrompt(suggestion);
    if (onTriggerAgent) onTriggerAgent();

    await executeAutonomousAgent(suggestion, {
      userId: currentUser?.id,
      onComplete: () => {
        if (refreshData) refreshData();
      },
    });
  };

  return (
    <div className="card agent-hero-card">
      <div className="agent-hero-header">
        <div className="agent-hero-badge">
          <SparklesIcon size={14} />
          <span>AUTONOMOUS PROCUREMENT AGENT</span>
        </div>
        <h2 className="agent-hero-title">
          What would you like to procure for {currentUser?.companyName || 'your organization'}?
        </h2>
        <p className="agent-hero-subtitle">
          Enter any procurement requirement in natural language. ProcureMind will automatically benchmark historical prices, evaluate vendor compliance, detect risks, and prepare an optimal negotiation strategy.
        </p>
      </div>

      <form className="agent-input-form" onSubmit={handleFormSubmit}>
        <div className="agent-input-wrapper">
          <input
            type="text"
            className="agent-prompt-input"
            placeholder="e.g. 50 laptops for the engineering team, 30 Figma licenses..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isAgentRunning}
          />
          <button
            type="submit"
            className="btn-ask-agent"
            disabled={!prompt.trim() || isAgentRunning}
          >
            {isAgentRunning ? (
              <>
                <span className="login-spinner" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <SparklesIcon size={15} />
                <span>Ask ProcureMind</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Quick Suggestions Chips */}
      <div className="agent-suggestions-row">
        <span className="agent-suggestions-label">Try example:</span>
        <div className="agent-suggestions-chips">
          {SUGGESTIONS.map((sug, idx) => (
            <button
              key={idx}
              type="button"
              className="agent-suggestion-chip"
              onClick={() => handleSuggestionClick(sug)}
              disabled={isAgentRunning}
            >
              <span>{sug}</span>
              <ArrowUpRightIcon size={11} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
