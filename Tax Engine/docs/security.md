# Security controls

- bcrypt cost 12, 12–72 character passwords, normalized unique email addresses; registration never accepts role input.
- Cryptographically random session tokens, SHA-256 token hashes in PostgreSQL, seven-day expiry, HttpOnly and SameSite=Lax cookies; Secure in production.
- Same-origin checks and a per-session CSRF token for all authenticated mutations; JSON-only write bodies.
- Per-IP authentication and API rate limits. Configure trusted proxy topology deliberately before deployment; no arbitrary forwarded-IP trust.
- Fixed resource allowlist, strict Zod schemas, Prisma parameterization, owner-scoped read/update/delete and administrator checks for rule management.
- Financial mutations, transfers, snapshots, rule changes and related audit records execute atomically. Serializable conflicts retry up to three times.
- No financial payloads or passwords in audit logs. CNIC is masked before leaving profile/tax APIs. Protect database volumes and backups; at-rest field encryption is not implemented.
- Helmet headers, production content policy, React escaped text, no raw user HTML. CSV exports neutralize spreadsheet formulas.
- Secrets live in ignored environment files. Never use demonstration accounts in a production environment. There is no FBR password field or unofficial filing integration.

Password reset, email verification, MFA, centralized multi-instance rate-limit storage and operational security monitoring are not implemented. This is a working local FYP application, not a production security certification.
