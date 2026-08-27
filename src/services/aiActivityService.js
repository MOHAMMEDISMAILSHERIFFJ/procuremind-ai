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
  full_pipeline: [
    { phase: 'queued',     message: '1/10 Loading user procurement & ERP data...' },
    { phase: 'analyzing',  message: '2/10 Normalizing purchase orders, invoices, and expense ledger...' },
    { phase: 'analyzing',  message: '3/10 Comparing quoted item prices with historical benchmarks...' },
    { phase: 'processing', message: '4/10 Scanning for duplicate transactions & identical vendor billings...' },
    { phase: 'processing', message: '5/10 Analyzing category spending patterns and budget deviation limits...' },
    { phase: 'processing', message: '6/10 Evaluating vendor compliance, performance scores, and concentration...' },
    { phase: 'processing', message: '7/10 Checking SaaS subscription seat utilization & idle licenses...' },
    { phase: 'processing', message: '8/10 Calculating potential savings opportunities & volume tiers...' },
    { phase: 'processing', message: '9/10 Generating prioritized risk alerts & anomaly scores...' },
    { phase: 'complete',   message: '10/10 Intelligence synthesis complete. Recommendations & insights ready.' },
  ],
  duplicate_scan: [
    { phase: 'queued',     message: 'Initiating duplicate transaction audit...' },
    { phase: 'analyzing',  message: 'Cross-matching invoice numbers, PO references, and amounts...' },
    { phase: 'processing', message: 'Scoring date proximity and vendor duplicate probabilities...' },
    { phase: 'complete',   message: 'Duplicate transaction audit complete.' },
  ],
  price_benchmark: [
    { phase: 'queued',     message: 'Loading market indices & historical unit price index...' },
    { phase: 'analyzing',  message: 'Evaluating unit price variance across historical requisition archives...' },
    { phase: 'processing', message: 'Flagging rate hikes >5% above baseline...' },
    { phase: 'complete',   message: 'Price benchmark analysis complete.' },
  ],
  vendor_risk: [
    { phase: 'queued',     message: 'Vendor intelligence query received...' },
    { phase: 'analyzing',  message: 'Pulling vendor transaction history & compliance certifications...' },
    { phase: 'processing', message: 'Computing composite vendor risk scores (0-100)...' },
    { phase: 'complete',   message: 'Vendor risk evaluation complete.' },
  ],
  savings_detection: [
    { phase: 'queued',     message: 'Savings intelligence scan triggered...' },
    { phase: 'analyzing',  message: 'Evaluating subscription seat utilisation & idle licenses...' },
    { phase: 'processing', message: 'Identifying bulk-order consolidation & volume discount opportunities...' },
    { phase: 'complete',   message: 'Savings opportunities calculated. Review ready.' },
  ],
  early_warning: [
    { phase: 'queued',     message: 'Early warning heuristic monitor initialised...' },
    { phase: 'analyzing',  message: 'Scanning contract renewal dates and single-source dependencies...' },
    { phase: 'processing', message: 'Evaluating price inflation exposure...' },
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
 * @param {number} [stepDelayMs]  - Delay between steps (default 500ms)
 * @returns {Promise<void>}
 */
export async function simulateAiActivity(operationType, stepDelayMs = 500) {
  const sequence = AI_ACTIVITY_SEQUENCES[operationType] || AI_ACTIVITY_SEQUENCES.full_pipeline;

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
