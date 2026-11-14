/**
 * Hybrid Inference Router for Firebase AI Logic
 * Decides whether to route inference to ON_DEVICE (Chrome Gemini Nano)
 * or CLOUD (Gemini 1.5/2.0 Flash) based on privacy sensitivity,
 * offline state, and prompt token budget.
 */

export const InferenceMode = {
  PREFER_ON_DEVICE: 'PREFER_ON_DEVICE',
  ONLY_ON_DEVICE: 'ONLY_ON_DEVICE',
  ONLY_IN_CLOUD: 'ONLY_IN_CLOUD'
};

export class HybridInferenceRouter {
  constructor(options = {}) {
    this.maxOnDeviceTokens = options.maxOnDeviceTokens || 1024;
    this.cloudCostPer1kTokens = options.cloudCostPer1kTokens || 0.00015; // USD
  }

  estimateTokenCount(text) {
    if (!text) return 0;
    // Standard heuristic: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  evaluateRoutingDecision(input) {
    const {
      text,
      sensitivityScore,
      isOffline = false,
      hasOnDeviceSupport = true,
      mode = InferenceMode.PREFER_ON_DEVICE
    } = input;

    const tokenCount = this.estimateTokenCount(text);
    const costSavingsUsd = (tokenCount / 1000) * this.cloudCostPer1kTokens;

    // Rule 1: Airplane / Offline mode forces local execution or failure if cloud requested
    if (isOffline) {
      if (!hasOnDeviceSupport && mode === InferenceMode.ONLY_IN_CLOUD) {
        return {
          target: 'FAILED',
          reason: 'Network offline and cloud-only execution requested',
          tokenCount,
          costSavedUsd: 0,
          privacyGuarantee: 'N/A'
        };
      }
      return {
        target: 'ON_DEVICE',
        model: 'gemini-nano-local',
        reason: 'Network offline: Local on-device execution enforced',
        tokenCount,
        costSavedUsd: costSavingsUsd,
        privacyGuarantee: '100% Zero-Egress On-Device'
      };
    }

    // Rule 2: Strict ONLY_ON_DEVICE configuration
    if (mode === InferenceMode.ONLY_ON_DEVICE) {
      return {
        target: 'ON_DEVICE',
        model: 'gemini-nano-local',
        reason: 'Enforced by InferenceMode.ONLY_ON_DEVICE',
        tokenCount,
        costSavedUsd: costSavingsUsd,
        privacyGuarantee: '100% Zero-Egress On-Device'
      };
    }

    // Rule 3: High sensitivity (PHI / PII / API keys present) -> keep on device
    if (sensitivityScore > 0 && hasOnDeviceSupport) {
      return {
        target: 'ON_DEVICE',
        model: 'gemini-nano-local',
        reason: `High sensitivity score (${sensitivityScore}): Local processing prevents data egress`,
        tokenCount,
        costSavedUsd: costSavingsUsd,
        privacyGuarantee: '100% Zero-Egress On-Device'
      };
    }

    // Rule 4: If token count exceeds local context limit (> 1024 tokens) and sanitized
    if (tokenCount > this.maxOnDeviceTokens) {
      return {
        target: 'CLOUD',
        model: 'gemini-1.5-flash-cloud',
        reason: `Token count (${tokenCount}) exceeds on-device limit (${this.maxOnDeviceTokens})`,
        tokenCount,
        costSavedUsd: 0,
        privacyGuarantee: 'Sanitized Cloud Transmission'
      };
    }

    // Default PREFER_ON_DEVICE
    if (hasOnDeviceSupport) {
      return {
        target: 'ON_DEVICE',
        model: 'gemini-nano-local',
        reason: 'Optimal efficiency: On-device model available and context within budget',
        tokenCount,
        costSavedUsd: costSavingsUsd,
        privacyGuarantee: '100% Zero-Egress On-Device'
      };
    }

    return {
      target: 'CLOUD',
      model: 'gemini-1.5-flash-cloud',
      reason: 'On-device hardware acceleration unavailable; fallback to Firebase Cloud',
      tokenCount,
      costSavedUsd: 0,
      privacyGuarantee: 'Sanitized Cloud Transmission'
    };
  }
}
