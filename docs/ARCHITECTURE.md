# BookLeaf Architecture
Node.js/Express API, Mongoose/MongoDB, JWT role checks, and a deterministic classification fallback.
Secrets are read from environment variables, never committed.
Routes: POST /api/auth/login; GET /api/books; GET/POST /api/tickets; PATCH /api/admin/tickets/:id; POST /api/admin/tickets/:id/reply; POST /api/admin/tickets/:id/notes.
Current limitations: AI module is heuristic rather than LLM; author ticket endpoint currently returns internalNotes and must be sanitized before production; ticket category/priority need stronger validation; CORS must be set explicitly; no production rate limiting or audit logs. Do not use with real author information until addressed.