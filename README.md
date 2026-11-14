# MediShield & PrivacyScrub Hybrid Studio

[![Firebase AI Logic](https://img.shields.io/badge/Firebase%20AI%20Logic-PREFER__ON__DEVICE-ff9100.svg)](https://firebasehybridaihackathon.devpost.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/tests-6%20passed-brightgreen.svg)](tests/)

MediShield & PrivacyScrub Hybrid Studio is a zero-data-leak local-first Sensitive Document/Code Redactor & Structured Extractor architected for **Google Firebase #BuildHybridAI 2026**.

It harnesses **Firebase AI Logic (`InferenceMode.PREFER_ON_DEVICE`)** and Chrome's built-in **Gemini Nano** to process PII, HIPAA PHI, and credentials 100% locally on the user's hardware. When deep, multi-step cloud synthesis is required, sanitized reasoning representations are dynamically routed to **Firebase Cloud Gemini** with zero private data egress.

---

## 🌟 Key Features

1. **Firebase AI Logic `PREFER_ON_DEVICE` Integration**:
   - Executes inference directly inside Chrome Gemini Nano / W3C Prompt API when local resources permit.
   - Dynamic fallbacks gracefully route non-sensitive tasks to Cloud Gemini.
2. **HIPAA & PII Safe Harbor Scrubber**:
   - Local-first masking of SSNs, Medical Record Numbers (MRNs), emails, phone numbers, and cloud secrets (API tokens, private keys).
3. **Live Routing Telemetry & Cost Meter**:
   - Real-time display showing target (`ON_DEVICE` vs `CLOUD`), tokens processed, and cumulative API dollar savings.
4. **Airplane Mode Proof**:
   - Complete offline functionality with deterministic AST / regex parsing when network connectivity is severed.
5. **Interactive Local Studio**:
   - Zero-dependency web dashboard at `docs/index.html` allowing hackathon judges to test preloaded samples immediately.

---

## 🚀 Quick Start

```bash
# 1. Run unit tests
npm test

# 2. Open interactive dashboard
# Open docs/index.html in any web browser
```

---

## 📽️ Demo Video
A full 40-second 1080p 30fps demonstration video is available at `assets/demo_hybrid_1080p.mp4` and mirrored at `docs/demo_hybrid_1080p.mp4`.
