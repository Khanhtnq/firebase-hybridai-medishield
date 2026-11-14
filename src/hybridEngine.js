/**
 * MediShield & PrivacyScrub Hybrid Engine
 * Implements the Firebase AI Logic PREFER_ON_DEVICE lifecycle
 */

import { PrivacyScrubRedactor } from './redactor.js';
import { HybridInferenceRouter, InferenceMode } from './router.js';

export class MediShieldHybridStudio {
  constructor(config = {}) {
    this.redactor = new PrivacyScrubRedactor(config);
    this.router = new HybridInferenceRouter(config);
    this.inferenceMode = config.mode || InferenceMode.PREFER_ON_DEVICE;
    this.totalTokensProcessed = 0;
    this.totalCostSavedUsd = 0;
  }

  async processDocument(input) {
    const { rawText, task = 'SUMMARIZE_AND_EXTRACT', isOffline = false, hasOnDevice = true } = input;

    // Step 1: Local-first PII / PHI Redaction
    const scrubResult = this.redactor.scrub(rawText);

    // Step 2: Hybrid Routing Decision
    const routing = this.router.evaluateRoutingDecision({
      text: rawText,
      sensitivityScore: scrubResult.sensitivityScore,
      isOffline,
      hasOnDeviceSupport: hasOnDevice,
      mode: this.inferenceMode
    });

    // Step 3: Inference Simulation (incorporating Chrome Prompt API / Cloud fallback)
    let executionOutput = '';
    const startTime = Date.now();

    if (routing.target === 'ON_DEVICE') {
      // Execute 100% locally via Gemini Nano or Deterministic Safe Harbor Engine
      executionOutput = this._simulateLocalNanoInference(scrubResult.scrubbedText, task);
      this.totalCostSavedUsd += routing.costSavedUsd;
    } else if (routing.target === 'CLOUD') {
      // Execute via Firebase Cloud Gemini (sending ONLY sanitized text)
      executionOutput = this._simulateCloudGeminiInference(scrubResult.scrubbedText, task);
    } else {
      throw new Error(`Execution halted: ${routing.reason}`);
    }

    const latencyMs = Date.now() - startTime;
    this.totalTokensProcessed += routing.tokenCount;

    return {
      status: 'SUCCESS',
      routing,
      scrubResult: {
        entityCount: scrubResult.detectedEntities.length,
        sensitivityScore: scrubResult.sensitivityScore,
        redactedTextPreview: scrubResult.scrubbedText.substring(0, 160) + '...'
      },
      latencyMs,
      output: executionOutput,
      telemetry: {
        totalTokensProcessed: this.totalTokensProcessed,
        cumulativeCostSavedUsd: parseFloat(this.totalCostSavedUsd.toFixed(6))
      }
    };
  }

  _simulateLocalNanoInference(sanitizedText, task) {
    return `[LOCAL GEMINI NANO ON-DEVICE INFERENCE]:
Task: ${task}
Extracted Insights:
- Cleaned context size: ${sanitizedText.length} characters
- Security classification: ZERO_EGRESS_VERIFIED
- Clinical / Privacy summary: Entities safely isolated on client device. Sanitized payload structured without cloud footprint.`;
  }

  _simulateCloudGeminiInference(sanitizedText, task) {
    return `[FIREBASE CLOUD GEMINI INFERENCE]:
Task: ${task}
Complex Reasoning Synthesis:
- Input was thoroughly scrubbed locally before cloud egress.
- High-level multi-step cross-referencing completed via cloud backend.`;
  }
}
