# Deferred model integrations

`src/integrations/providers.ts` contains FinancialAIProvider, OCRProvider, ASRProvider and FinancialTextParser interfaces and explicitly disabled implementations. No fake receipt extraction, transcription, chat response or NLP parser is used.

A future provider must return candidate records for user review, then call the same validated transaction service. It must never bypass owner checks, idempotency or decimal validation. AI may explain persisted deterministic outputs; it must not calculate tax or invent legal rules. OCR/ASR payload storage, consent, retention and vendor credentials must be designed when connecting the real model.

No automatic FBR login exists. Exported dataset/report fields provide the future mapping boundary for an officially supported integration.
