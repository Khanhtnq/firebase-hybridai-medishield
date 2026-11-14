# MediShield & PrivacyScrub Hybrid Studio — Devpost Submission Details

**Hackathon**: Google Firebase #BuildHybridAI 2026 ($30,000 USD Cash Prize Pool)  
**Project Title**: MediShield & PrivacyScrub Hybrid Studio  
**Author**: Khanhtnq (`218711032+Khanhtnq@users.noreply.github.com`)  
**Repository**: `https://github.com/Khanhtnq/medishield-privacyscrub-hybrid-studio`  
**Demo Video**: `assets/demo_hybrid_1080p.mp4` (40 seconds, 1920x1080 @ 30fps)  
**Live Interactive Dashboard**: `docs/index.html`  

---

## Inspiration
Healthcare providers, legal teams, and software engineers deal with sensitive data daily (medical histories, patient intake forms, API keys, database credentials). Transmitting raw, unscrubbed records to cloud LLMs presents severe HIPAA, GDPR, and security violation liabilities.

With the launch of **Firebase AI Logic (`InferenceMode.PREFER_ON_DEVICE`)**, web developers can now orchestrate hybrid inference: running sensitive, latency-critical, or offline tasks directly on the client machine via Gemini Nano, while delegating complex global summarization to Cloud Gemini only after all private identifiers have been scrubbed locally.

---

## What It Does
1. **Local Privacy Scrubbing**: Runs 100% locally in browser memory to identify and redact SSNs, Medical Record Numbers, phone numbers, email addresses, and API credentials.
2. **Hybrid Routing Matrix**:
   - High sensitivity chunks -> strictly kept `ON_DEVICE` via Gemini Nano / deterministic safe harbor rules.
   - Long sanitized text -> routed to `CLOUD` via Firebase Cloud Gemini when token context exceeds local thresholds.
   - Offline / Airplane Mode -> automatically switches to 100% local execution.
3. **Telemetry & Token Cost Meter**: Calculates live token count and dollars saved by processing prompts locally for free instead of paying cloud API fees.

---

## Technologies Used
- **Firebase AI Logic SDK** (`firebase/ai`: `getAI`, `getGenerativeModel`, `InferenceMode.PREFER_ON_DEVICE`, `InferenceMode.ONLY_ON_DEVICE`)
- **Chrome Built-in AI** (`window.ai` / Gemini Nano)
- **Node.js Native Test Runner** (`node --test`)
- **FFmpeg 8.1.1** for 1080p 30fps video generation
