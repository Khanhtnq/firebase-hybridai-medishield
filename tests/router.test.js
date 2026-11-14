import { test } from 'node:test';
import assert from 'node:assert';
import { HybridInferenceRouter, InferenceMode } from '../src/router.js';

test('HybridInferenceRouter routes to ON_DEVICE when sensitive PII is detected', () => {
  const router = new HybridInferenceRouter();
  const decision = router.evaluateRoutingDecision({
    text: "Patient health record containing MRN 981241",
    sensitivityScore: 60,
    isOffline: false,
    hasOnDeviceSupport: true,
    mode: InferenceMode.PREFER_ON_DEVICE
  });

  assert.strictEqual(decision.target, 'ON_DEVICE');
  assert.strictEqual(decision.model, 'gemini-nano-local');
  assert.ok(decision.privacyGuarantee.includes('Zero-Egress'));
});

test('HybridInferenceRouter routes to ON_DEVICE when offline (Airplane mode)', () => {
  const router = new HybridInferenceRouter();
  const decision = router.evaluateRoutingDecision({
    text: "Offline document summary",
    sensitivityScore: 0,
    isOffline: true,
    hasOnDeviceSupport: true,
    mode: InferenceMode.PREFER_ON_DEVICE
  });

  assert.strictEqual(decision.target, 'ON_DEVICE');
  assert.ok(decision.reason.includes('Network offline'));
});

test('HybridInferenceRouter routes to CLOUD when token count exceeds local budget and text is clean', () => {
  const router = new HybridInferenceRouter({ maxOnDeviceTokens: 50 });
  const longText = "word ".repeat(200); // ~1000 chars = ~250 tokens > 50

  const decision = router.evaluateRoutingDecision({
    text: longText,
    sensitivityScore: 0,
    isOffline: false,
    hasOnDeviceSupport: true,
    mode: InferenceMode.PREFER_ON_DEVICE
  });

  assert.strictEqual(decision.target, 'CLOUD');
  assert.strictEqual(decision.model, 'gemini-1.5-flash-cloud');
});
