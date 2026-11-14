import { test } from 'node:test';
import assert from 'node:assert';
import { MediShieldHybridStudio } from '../src/hybridEngine.js';

test('MediShieldHybridStudio end-to-end execution on sensitive clinical document', async () => {
  const studio = new MediShieldHybridStudio();
  const inputDoc = `
    Clinical Intake Form:
    Patient: Alice Wonderland, DOB: 04/12/1984
    SSN: 987-65-4321
    Diagnosis: Mild hypertension with occasional migraine headaches.
  `;

  const response = await studio.processDocument({
    rawText: inputDoc,
    task: 'CLINICAL_SUMMARY',
    isOffline: false,
    hasOnDevice: true
  });

  assert.strictEqual(response.status, 'SUCCESS');
  assert.strictEqual(response.routing.target, 'ON_DEVICE');
  assert.ok(response.scrubResult.entityCount >= 2);
  assert.ok(response.telemetry.totalTokensProcessed > 0);
  assert.ok(response.output.includes('LOCAL GEMINI NANO'));
});
