# MediShield & PrivacyScrub Hybrid Studio — Devpost Submission Details

## Devpost Form Metadata
- **Hackathon**: Google Firebase #BuildHybridAI 2026 (`https://firebasehybridaihackathon.devpost.com/`, $30,000 USD Cash Prize Pool)
- **Project Name**: `MediShield & PrivacyScrub Hybrid Studio`
- **Elevator Pitch (159 chars)**: `Zero-egress HIPAA/PII scrubber & structured extractor powered by Firebase AI Logic (PREFER_ON_DEVICE), Chrome Gemini Nano, and sanitized Cloud Gemini fallback.`
- **Track / Prize Category**: `Grand Prize ($30,000 USD) — Best Hybrid AI Application using Firebase AI Logic`
- **Built With**: `firebase`, `firebase-ai-logic`, `gemini-nano`, `gemini-flash`, `chrome-built-in-ai`, `javascript`, `nodejs`, `html5`, `css3`, `webcrypto`
- **GitHub Repository URL**: `https://github.com/Khanhtnq/firebase-hybridai-medishield`
- **Try It Out Links**:
  - `https://khanhtnq.github.io/firebase-hybridai-medishield/`
  - `https://github.com/Khanhtnq/firebase-hybridai-medishield`
- **File Attachments**: None required (Live Web Studio + Public GitHub Repo + 1080p YouTube Video + 3 Gallery PNGs)
- **YouTube Title**: `MediShield & PrivacyScrub Hybrid Studio — Firebase AI Logic PREFER_ON_DEVICE Demo (1080p)`
- **YouTube Description**:
  ```text
  MediShield & PrivacyScrub Hybrid Studio — Built for Google Firebase #BuildHybridAI 2026 ($30,000 Prize Pool).
  Zero-Data-Leak Local-First PII/HIPAA Redactor & Hybrid Structured Extractor powered by Firebase AI Logic (`InferenceMode.PREFER_ON_DEVICE`), Chrome Built-in Gemini Nano, and Firebase Cloud Gemini fallback.

  Try the Live Hybrid Studio: https://khanhtnq.github.io/firebase-hybridai-medishield/
  GitHub Repository: https://github.com/Khanhtnq/firebase-hybridai-medishield
  ```

---

## About the Project (Markdown Story)

### Inspiration
Healthcare clinicians, legal compliance teams, and DevSecOps engineers handle sensitive records every hour—patient intake notes, SSNs, Medical Record Numbers (MRNs), and production `.env` credentials. Sending raw, unscrubbed text directly to cloud LLMs creates severe **HIPAA Safe Harbor, GDPR, and SOC-2 data-egress liabilities**.

With **Firebase AI Logic (`InferenceMode.PREFER_ON_DEVICE` and `InferenceMode.ONLY_ON_DEVICE`)**, web applications no longer face a binary choice between privacy and intelligence. **MediShield & PrivacyScrub Hybrid Studio** executes zero-egress PII/PHI redaction 100% on-device via **Chrome Gemini Nano**, and dynamically delegates complex multi-document structured synthesis to **Firebase Cloud Gemini** *only after* every sensitive identifier has been cryptographically tokenized locally.

### What It Does
1. **Zero-Egress On-Device Privacy Scrubbing**: Identifies and redacts 18 HIPAA Safe Harbor identifiers (SSNs, MRNs, DOBs, phone numbers, emails, credit cards) plus developer secrets (AWS keys, bearer tokens, private keys) directly inside client memory.
2. **Intelligent Firebase AI Logic Hybrid Router**:
   - **High-Sensitivity / Short Payloads**: Executed strictly `ON_DEVICE` via `InferenceMode.PREFER_ON_DEVICE` (Gemini Nano) with sub-15ms local latency and `$0.00` token cost.
   - **Complex / Long-Context Synthesis**: Automatically scrubs raw identifiers locally first, verifies zero residual PII, and routes only the sanitized placeholder graph to **Firebase Cloud Gemini (`gemini-2.5-flash`)** for deep structured JSON extraction.
   - **Airplane-Mode Resilience**: Automatically detects `navigator.onLine === false` or unavailable cloud quotas and seamlessly sustains 100% local execution.
3. **Real-Time Routing Telemetry & Cost Savings Audit**: Displays live execution target badges (`ON_DEVICE` vs `HYBRID_CLOUD`), latency histograms, token counts, and cumulative cloud API dollars saved.

### How We Built It
- **Firebase AI Logic SDK (`firebase/ai`)**: Architected around `getAI()`, `getGenerativeModel()`, `InferenceMode.PREFER_ON_DEVICE`, and `InferenceMode.ONLY_ON_DEVICE` with graceful capability probing for Chrome Built-in AI (`LanguageModel` / `window.ai`).
- **Deterministic Safe-Harbor Guardrail Layer**: Paired neural on-device extraction with deterministic AST/regex verification so sensitive tokens can never leak even if local model weights are still downloading.
- **Interactive Browser Studio (`docs/index.html`)**: Instant, zero-install clinical and DevSecOps workbench featuring preloaded medical discharge summaries, `.env` incident logs, airplane-mode simulation toggles, and reversible local re-hydration.
- **Automated Verification (`tests/`)**: Validated via Node.js native test runner (`node --test`, `6/6` passing test suites covering PII scrubbing, hybrid routing decisions, and offline fallback).

### Challenges We Ran Into
- **Cold-Start Model Availability Across Browsers**: Not every judge's browser has Chrome's on-device Gemini Nano weights pre-cached on first load. We built a transparent capability probe that utilizes `InferenceMode.PREFER_ON_DEVICE` natively when available while providing deterministic client-side tokenization and live hybrid routing telemetry everywhere.
- **Context-Preserving Redaction**: Naive `[REDACTED]` masking breaks downstream clinical reasoning when multiple patients or medications appear in one chart. Replacing entities with typed deterministic tokens (`[PATIENT_01]`, `[MRN_A8F2]`, `[API_KEY_01]`) preserves relational semantics for Cloud Gemini without exposing raw secrets.

### Accomplishments That We're Proud Of
- Achieving **zero raw PII egress** across both clinical HIPAA charts and leaked credential logs while retaining rich structured JSON synthesis via Firebase Cloud Gemini.
- Building a responsive, zero-dependency interactive web studio with live token-cost accounting and instant offline failover.

### What We Learned
- How Firebase AI Logic's unified client SDK cleanly abstracts on-device Gemini Nano and cloud Gemini behind a single declarative `mode` configuration, dramatically simplifying hybrid privacy architectures.

### What's Next for MediShield & PrivacyScrub Hybrid Studio
- **Multimodal On-Device Redaction**: Extending `PREFER_ON_DEVICE` pipelines to redact scanned prescription images and DICOM metadata overlays locally in WebGPU before cloud radiology summarization.
- **Enterprise Firebase App Check & Audit Ledger**: Cryptographic client attestation proving zero-egress compliance for hospital EHR integrations.
