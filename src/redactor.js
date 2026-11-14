/**
 * MediShield & PrivacyScrub Core Redactor
 * Deterministic local-first PII, HIPAA, secret, and PHI scrubbing engine.
 */

export const SENSITIVITY_PATTERNS = {
  SSN: /\b\d{3}[-]?\d{2}[-]?\d{4}\b/g,
  EMAIL: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  PHONE: /(?:\+?1[-. ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})\b/g,
  CREDIT_CARD: /\b(?:\d{4}[- ]?){3}\d{4}\b/g,
  API_KEY: /(?:api[_-]?key|secret|token|bearer|ghp|sk-proj)[=:\s'"]*([A-Za-z0-9_\-]{20,})/gi,
  MEDICAL_RECORD_NUM: /\b(?:MRN|MEDREC|PATIENT)[#:\s]*([A-Z0-9]{6,12})\b/gi,
  DATE_OF_BIRTH: /\b(?:DOB|Birthdate|Born)[\s:]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\b/gi,
  IP_ADDRESS: /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g
};

export class PrivacyScrubRedactor {
  constructor(options = {}) {
    this.maskFormat = options.maskFormat || '[REDACTED_{TYPE}]';
  }

  scrub(text) {
    if (!text || typeof text !== 'string') {
      return { scrubbedText: '', detectedEntities: [], sensitivityScore: 0 };
    }

    let result = text;
    const detectedEntities = [];

    for (const [type, pattern] of Object.entries(SENSITIVITY_PATTERNS)) {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const rawValue = match[1] || match[0];
        detectedEntities.push({
          type,
          index: match.index,
          length: match[0].length,
          preview: rawValue.substring(0, 3) + '***'
        });
      }
      result = result.replace(pattern, (m, g1) => {
        return `[REDACTED_${type}]`;
      });
    }

    // Calculate sensitivity score (0 to 100)
    const sensitivityScore = Math.min(100, detectedEntities.length * 20);

    return {
      scrubbedText: result,
      detectedEntities,
      sensitivityScore,
      isClean: detectedEntities.length === 0
    };
  }

  restorePlaceholders(templateText, entityMap) {
    let output = templateText;
    for (const [placeholder, original] of Object.entries(entityMap)) {
      output = output.split(placeholder).join(original);
    }
    return output;
  }
}
