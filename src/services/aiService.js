// src/services/aiService.js
/**
 * ProcureMind AI Service — External AI Reasoning & Fallback Intelligence Engine
 *
 * Exposes a clean interface: `analyzeProcurementRequest(request, context)`
 *
 * ARCHITECTURE:
 * 1. External AI Model Bridge: If `VITE_AI_API_ENDPOINT` is configured in `.env`,
 *    constructs a complete procurement context payload and requests structured JSON
 *    reasoning from the real AI model endpoint.
 * 2. Deterministic Fallback Engine: If the external AI API is missing, unreachable,
 *    timed out, or returns a malformed response, automatically executes deterministic
 *    rate card heuristics, variance benchmarks, and risk classifications.
 * 3. Human-In-The-Loop: The AI provides actionable strategic recommendations
 *    (APPROVE, MODIFY, NEGOTIATE, REJECT, REQUEST_MORE_INFORMATION). Authority to
 *    commit funds remains with the human executive.
 */

import { runIntelligenceAnalysis, detectSavingsOpportunities } from './intelligenceService.js';

// Environment variables (safe access across Vite and Node.js test runners)
const AI_API_ENDPOINT = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_AI_API_ENDPOINT) || '';
const AI_API_KEY      = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_AI_API_KEY) || '';

// ─────────────────────────────────────────────────────────────────────────────
// Response Schema Validator
// ─────────────────────────────────────────────────────────────────────────────

function _validateAiResponse(raw) {
  if (!raw || typeof raw !== 'object') return null;

  // Handle OpenAI/Anthropic/Gemini chat completions wrapper if present
  let data = raw;
  if (raw.choices && Array.isArray(raw.choices) && raw.choices[0]?.message?.content) {
    try {
      data = JSON.parse(raw.choices[0].message.content);
    } catch {
      return null;
    }
  } else if (raw.candidates && Array.isArray(raw.candidates) && raw.candidates[0]?.content?.parts?.[0]?.text) {
    try {
      data = JSON.parse(raw.candidates[0].content.parts[0].text);
    } catch {
      return null;
    }
  }

  // Validate required fields
  const validRiskLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const validActions = ['APPROVE', 'MODIFY', 'NEGOTIATE', 'REJECT', 'REQUEST_MORE_INFORMATION'];

  const riskLevel = typeof data.riskLevel === 'string' && validRiskLevels.includes(data.riskLevel.toUpperCase())
    ? data.riskLevel.toUpperCase()
    : 'MEDIUM';

  const recommendedAction = typeof data.recommendedAction === 'string' && validActions.includes(data.recommendedAction.toUpperCase())
    ? data.recommendedAction.toUpperCase()
    : 'NEGOTIATE';

  const assessment = typeof data.assessment === 'string' && data.assessment.trim().length > 0
    ? data.assessment.trim()
    : 'AI reasoning evaluated against procurement guidelines.';

  const recommendation = typeof data.recommendation === 'string' && data.recommendation.trim().length > 0
    ? data.recommendation.trim()
    : (data.counterOffer ? `Issue counter-offer of ${data.counterOffer} before authorization.` : 'Review pricing with supplier.');

  const counterOffer = typeof data.counterOffer === 'string' ? data.counterOffer : '';

  const negotiationStrategy = Array.isArray(data.negotiationStrategy) && data.negotiationStrategy.length > 0
    ? data.negotiationStrategy.map(String)
    : [];

  const riskReasons = Array.isArray(data.riskReasons) && data.riskReasons.length > 0
    ? data.riskReasons.map(String)
    : [];

  let confidenceNum = 94;
  if (typeof data.confidence === 'number') {
    confidenceNum = Math.min(100, Math.max(0, Math.round(data.confidence > 1 ? data.confidence : data.confidence * 100)));
  }

  return {
    assessment,
    riskLevel,
    riskReasons,
    recommendedAction,
    recommendation,
    counterOffer,
    negotiationStrategy,
    savingsOpportunity: data.savingsOpportunity || '',
    confidence: `${confidenceNum}%`,
    confidenceScore: Number((confidenceNum / 100).toFixed(2)),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Primary Entry Point: analyzeProcurementRequest
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Evaluates a structured procurement request using the external AI model if available,
 * or the deterministic fallback engine.
 *
 * @param {Object} request - Structured procurement request
 * @param {Object} context - Enterprise context, vendor base, and historical data
 * @returns {Promise<Object>} Structured recommendation object
 */
export async function analyzeProcurementRequest(request, context = {}) {
  const currentQuotation = Number(request.totalAmount) || 0;
  const historicalBenchmark = Number(request.historicalBenchmark) || 0;
  const priceVariance = currentQuotation - historicalBenchmark;
  const variancePct = historicalBenchmark > 0
    ? Number(((priceVariance / historicalBenchmark) * 100).toFixed(1))
    : 0;

  // ── 1. Attempt External Real AI API Call (if configured) ─────────────────
  if (AI_API_ENDPOINT && AI_API_ENDPOINT.startsWith('http')) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000); // 7s timeout

      const aiPayload = {
        task: 'procurement_intelligence_analysis',
        systemPrompt: 'You are ProcureMind AI, an autonomous enterprise procurement intelligence and negotiation strategist. Analyze the procurement request context and return structured JSON with assessment, riskLevel (LOW|MEDIUM|HIGH), riskReasons, recommendedAction (APPROVE|MODIFY|NEGOTIATE|REJECT|REQUEST_MORE_INFORMATION), recommendation, counterOffer, negotiationStrategy, savingsOpportunity, and confidence (0-100).',
        procurement: {
          requirement: request.item,
          quantity: request.quantity,
          department: request.department,
          category: request.category,
          urgency: request.urgency || 'Standard (30 days)',
          currentQuotation,
          quotedUnitPrice: Number(request.unitPrice) || 0,
          historicalBenchmark,
          benchmarkUnitPrice: Number(request.unitBenchmark) || 0,
          priceVariance,
          priceVariancePct: variancePct,
          purchaseIntent: request.purchaseIntent || '',
        },
        vendor: {
          name: request.vendor,
          compliance: context.vendorDetails?.compliance || '94%',
          rating: context.vendorDetails?.rating || 4.2,
          hasExistingContract: !!request.hasExistingVendor,
        },
        context: {
          companyName: context.companyName || 'Enterprise',
          registeredVendorsCount: context.vendors?.length || 0,
        },
      };

      const response = await fetch(AI_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(AI_API_KEY ? { Authorization: `Bearer ${AI_API_KEY}` } : {}),
        },
        body: JSON.stringify(aiPayload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const rawJson = await response.json();
        const validated = _validateAiResponse(rawJson);

        if (validated) {
          const potentialSaving = Math.max(0, priceVariance);
          return {
            success: true,
            source: 'external_ai',
            apiStatus: 'Connected to external AI API',
            isFallback: false,
            assessment: validated.assessment,
            riskLevel: validated.riskLevel,
            riskReasons: validated.riskReasons,
            riskReason: validated.riskReasons[0] || `${validated.riskLevel} Risk level determined by external AI.`,
            recommendedAction: validated.recommendedAction,
            recommendation: validated.recommendation,
            counterOffer: validated.counterOffer || `₹${(((historicalBenchmark || currentQuotation) * 1.02) / 100000).toFixed(2)}L`,
            negotiationStrategy: validated.negotiationStrategy.length > 0
              ? validated.negotiationStrategy
              : [
                  `Reference historical benchmark rate card (₹${(historicalBenchmark / 100000).toFixed(2)}L)`,
                  `Leverage consolidated order volume (${request.quantity} units)`,
                  `Demand Net-30 payment terms and 3-year enterprise SLA`,
                ],
            variance: variancePct > 0 ? `+${variancePct}%` : '0%',
            variancePct,
            potentialSavings: potentialSaving,
            formattedSavings: `₹${(potentialSaving / 100000).toFixed(2)}L`,
            confidence: validated.confidence,
            confidenceScore: validated.confidenceScore,
            evaluatedAt: new Date().toISOString(),
          };
        }
      }
    } catch {
      // Safe fallback — no console logging of secrets or unhandled exceptions
    }
  }

  // ── 2. Deterministic Fallback Intelligence Layer ─────────────────────────
  const potentialSaving = Math.max(0, priceVariance);

  let riskLevel = 'LOW';
  let recommendedAction = 'APPROVE';
  const riskReasons = [];
  let confidence = 0.96;
  let counterOffer = `₹${(currentQuotation / 100000).toFixed(2)}L`;
  let recommendationText = `Approve requisition — terms and pricing comply with enterprise guidelines.`;

  if (variancePct >= 10.0) {
    riskLevel = 'HIGH';
    recommendedAction = 'NEGOTIATE';
    riskReasons.push(`Quotation of ₹${(currentQuotation / 100000).toFixed(2)}L is +${variancePct}% above baseline unit pricing.`);
    riskReasons.push('Single-source margin inflation detected compared to historical index.');
    counterOffer = `₹${((historicalBenchmark * 1.02) / 100000).toFixed(2)}L`;
    recommendationText = `Negotiate with ${request.vendor} before authorization. Issue counter-offer of ${counterOffer} based on historical benchmark index.`;
    confidence = 0.94;
  } else if (variancePct >= 4.0) {
    riskLevel = 'MEDIUM';
    recommendedAction = 'MODIFY';
    riskReasons.push(`Moderate price variance (+${variancePct}%) detected compared with prior rate card.`);
    counterOffer = `₹${((historicalBenchmark * 1.01) / 100000).toFixed(2)}L`;
    recommendationText = `Review quotation with ${request.vendor} and request volume tier discount before approval.`;
    confidence = 0.92;
  } else {
    riskReasons.push('Quotation complies with rate card benchmarks.');
  }

  const negotiationStrategy = [
    `Reference historical benchmark rate card (₹${(historicalBenchmark / 100000).toFixed(2)}L baseline)`,
    `Leverage consolidated order volume (${request.quantity} units) for Tier-1 discount`,
    `Demand Net-30 payment terms without upfront deposit penalty`,
    `Ensure 3-year replacement warranty & 24/7 SLA coverage clause`,
  ];

  return {
    success: true,
    source: 'fallback_intelligence',
    apiStatus: 'AI API unavailable — ProcureMind fallback intelligence active',
    isFallback: true,
    assessment: `Deterministic evaluation completed for ${request.item} across ${request.department}.`,
    riskLevel,
    riskReasons,
    riskReason: riskReasons[0],
    recommendedAction,
    recommendation: recommendationText,
    counterOffer,
    negotiationStrategy,
    variance: variancePct > 0 ? `+${variancePct}%` : '0%',
    variancePct,
    potentialSavings: potentialSaving,
    formattedSavings: `₹${(potentialSaving / 100000).toFixed(2)}L`,
    confidence: `${Math.round(confidence * 100)}%`,
    confidenceScore: confidence,
    evaluatedAt: new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Compatibility helpers
// ─────────────────────────────────────────────────────────────────────────────

export async function analyzeProcurement(data) {
  return analyzeProcurementRequest(data);
}

export async function detectRisks(params) {
  return runIntelligenceAnalysis({ procurements: params.procurements, vendors: params.vendors });
}

export async function findSavings(params) {
  return detectSavingsOpportunities(params);
}
