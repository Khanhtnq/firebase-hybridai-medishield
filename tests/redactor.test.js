import { test } from 'node:test';
import assert from 'node:assert';
import { PrivacyScrubRedactor } from '../src/redactor.js';

test('PrivacyScrubRedactor scrubs SSN, emails, phone numbers and API keys', () => {
  const redactor = new PrivacyScrubRedactor();
  const sample = `
    Patient: John Doe, SSN: 123-45-6789.
    Contact: john.doe@example.hospital.org or 555-019-2834.
    Debug Key: ghp_98124918239081290381029381.
  `;

  const result = redactor.scrub(sample);
  assert.strictEqual(result.isClean, false);
  assert.ok(result.detectedEntities.length >= 3);
  assert.ok(result.sensitivityScore > 50);
  assert.ok(!result.scrubbedText.includes('123-45-6789'));
  assert.ok(!result.scrubbedText.includes('john.doe@example.hospital.org'));
  assert.ok(result.scrubbedText.includes('[REDACTED_SSN]'));
  assert.ok(result.scrubbedText.includes('[REDACTED_EMAIL]'));
});

test('PrivacyScrubRedactor returns clean for benign text', () => {
  const redactor = new PrivacyScrubRedactor();
  const sample = "The quarterly engineering review concluded that our inference latency improved by 40%.";
  const result = redactor.scrub(sample);
  assert.strictEqual(result.isClean, true);
  assert.strictEqual(result.detectedEntities.length, 0);
  assert.strictEqual(result.sensitivityScore, 0);
});
