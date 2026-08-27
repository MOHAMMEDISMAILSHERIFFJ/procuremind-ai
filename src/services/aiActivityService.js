// src/services/aiActivityService.js
/**
 * ProcureMind AI Activity System
 *
 * Provides a simulated real-time activity/event stream that the UI can subscribe to.
 * The dashboard uses this to display "what the AI is currently doing" in the activity feed.
 *
 * IMPORTANT FOR FUTURE INTEGRATION:
 * When connecting the real AI model/API, replace the mock emitter with actual
 * Server-Sent Events (SSE) or WebSocket events from the API endpoint.
 * The React hook useAiActivity() remains unchanged on the frontend.
 *
 * Activity phases:
 *   'queued'     → Request received, waiting to process
 *   'analyzing'  → AI is reading context
 *   'processing' → AI is running analysis
 *   'complete'   → Result ready
 *   'error'      → Something went wrong
 */

// ─────────────────────────────────────────────────────────────────────────────
// Predefined AI activity sequences per operation type
// ─────────────────────────────────────────────────────────────────────────────

export const AI_ACTIVITY_SEQUENCES = {
  procurement_analysis: [
    { phase: 'queued',     message: 'Procurement request queued for analysis...' },
    { phase: 'analyzing',  message: 'Reading company procurement profile...' },
    { phase: 'analyzing',  message: 'Comparing historical vendor prices...' },
    { phase: 'processing', message: 'Running market benchmark comparison...' },
    { phase: 'processing', message: 'Calculating deviation from baseline pricing...' },
    { phase: 'processing', message: 'Checking contract terms and compliance...' },
    { phase: 'complete',   message: 'Procurement analysis complete. Recommendation ready.' },
  ],
  risk_detection: [
    { phase: 'queued',     message: 'Risk detection scan initiated...' },
    { phase: 'analyzing',  message: 'Scanning active purchase orders...' },
    { phase: 'processing', message: 'Checking vendor compliance scores...' },
    { phase: 'processing', message: 'Identifying single-source procurement risks...' },
    { phase: 'complete',   message: 'Risk detection complete.' },
  ],
  vendor_analysis: [
    { phase: 'queued',     message: 'Vendor intelligence query received...' },
    { phase: 'analyzing',  message: 'Pulling vendor transaction history...' },
    { phase: 'processing', message: 'Computing performance and risk scores...' },
    { phase: 'processing', message: 'Comparing vendor pricing trends...' },
    { phase: 'complete',   message: 'Vendor analysis complete.' },
  ],
  savings_detection: [
    { phase: 'queued',     message: 'Savings intelligence scan triggered...' },
    { phase: 'analyzing',  message: 'Evaluating subscription seat utilisation...' },
    { phase: 'analyzing',  message: 'Scanning for duplicate invoice patterns...' },
    { phase: 'processing', message: 'Identifying bulk-order consolidation opportunities...' },
    { phase: 'processing', message: 'Calculating potential savings per category...' },
    { phase: 'complete',   message: 'Savings opportunities identified. Review recommended.' },
  ],
  negotiation: [
    { phase: 'queued',     message: 'Negotiation strategy engine initialising...' },
    { phase: 'analyzing',  message: 'Reviewing vendor historical pricing...' },
    { phase: 'processing', message: 'Searching available vendor alternatives...' },
    { phase: 'processing', message: 'Calculating potential negotiation leverage...' },
    { phase: 'processing', message: 'Preparing negotiation recommendation...' },
    { phase: 'complete',   message: 'Negotiation strategy ready.' },
  ],
  subscription_audit: [
    { phase: 'queued',     message: 'Subscription audit queued...' },
    { phase: 'analyzing',  message: 'Reading active SaaS licences...' },
    { phase: 'processing', message: 'Checking seat utilisation data...' },
    { phase: 'processing', message: 'Identifying idle accounts and dormant users...' },
    { phase: 'complete',   message: 'Subscription audit complete. Optimisations identified.' },
  ],
  early_warning: [
    { phase: 'queued',     message: 'Early warning scan triggered...' },
    { phase: 'analyzing',  message: 'Scanning contract renewal timelines...' },
    { phase: 'processing', message: 'Evaluating market price movements...' },
    { phase: 'complete',   message: 'Early warning scan complete.' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Activity Event Emitter (lightweight pub-sub)
// ─────────────────────────────────────────────────────────────────────────────

const _listeners = new Set();

function _emit(event) {
  _listeners.forEach((fn) => fn(event));
}

export function subscribeToAiActivity(listener) {
  _listeners.add(listener);
  return () => _listeners.delete(listener); // Returns unsubscribe function
}

// ─────────────────────────────────────────────────────────────────────────────
// Activity Stream Simulator
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Simulate a sequence of AI activity events for a given operation type.
 * Future: replace with real SSE/WebSocket event listener from AI API.
 *
 * @param {string} operationType  - Key from AI_ACTIVITY_SEQUENCES
 * @param {number} [stepDelayMs]  - Delay between steps (default 700ms)
 * @returns {Promise<void>}
 */
export async function simulateAiActivity(operationType, stepDelayMs = 700) {
  const sequence = AI_ACTIVITY_SEQUENCES[operationType];
  if (!sequence) {
    console.warn(`[aiActivityService] Unknown operation type: ${operationType}`);
    return;
  }

  for (let i = 0; i < sequence.length; i++) {
    const step = sequence[i];
    _emit({
      id: `${operationType}_${Date.now()}_${i}`,
      operationType,
      phase: step.phase,
      message: step.message,
      stepIndex: i,
      totalSteps: sequence.length,
      timestamp: new Date().toISOString(),
      isLast: i === sequence.length - 1,
    });
    if (i < sequence.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, stepDelayMs));
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Convenience function: Run analysis + emit activity simultaneously
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run an AI operation while simultaneously emitting activity events to the UI.
 *
 * @param {string}   operationType  - From AI_ACTIVITY_SEQUENCES keys
 * @param {Function} aiOperation    - async function that returns AI result
 * @returns {Promise<*>} - The AI operation result
 */
export async function runWithActivity(operationType, aiOperation) {
  // Start emitting activity events (non-blocking)
  simulateAiActivity(operationType, 650);

  // Run the actual AI operation in parallel
  const result = await aiOperation();
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// Activity log management (stores last N events)
// ─────────────────────────────────────────────────────────────────────────────

const MAX_HISTORY = 50;
const _activityHistory = [];

// Auto-record all emitted events into history
subscribeToAiActivity((event) => {
  _activityHistory.unshift(event);
  if (_activityHistory.length > MAX_HISTORY) {
    _activityHistory.pop();
  }
});

/**
 * Get the current activity history (most recent first).
 * @returns {Array}
 */
export function getActivityHistory() {
  return [..._activityHistory];
}

/**
 * Clear all stored activity history.
 */
export function clearActivityHistory() {
  _activityHistory.length = 0;
}
