# BookLeaf Author Support & Communication Portal

Full-stack assignment: Express + MongoDB + responsive browser interface for authors and support admins.

## Features
- Email/password login with bcrypt hashes, JWT and author/admin authorization
- Author book/royalty dashboard, support ticket submission and history
- Admin ticket queue, status/priority override, replies and private notes
- AI classification and knowledge-base-grounded response drafts; optional OpenAI provider with deterministic fallback
- Author ticket responses exclude private admin notes and AI drafts
- Tickets refresh every 10 seconds (polling)

## Local setup
Requires Node.js 20+ and MongoDB Atlas or another MongoDB server.

```bash
npm install
cp .env.example .env
# Fill in your own MONGODB_URI, JWT_SECRET, SEED_ADMIN_PASSWORD, SEED_AUTHOR_PASSWORD in .env
npm run seed
npm test
npm start
```

Open http://localhost:5000. Sign in as admin@bookleaf.test or any of the 10 author emails in data/bookleaf_sample_data.json, using your own locally configured seed passwords.

Do not commit .env or share database credentials. Change passwords and JWT_SECRET before any external demo. Never reuse passwords disclosed in chats.

## API
- POST /api/auth/login — email/password; returns JWT
- GET /api/health — health endpoint
- GET /api/books — author only; own books
- GET /api/tickets — own tickets for authors, all tickets for admins
- POST /api/tickets — author creates ticket with subject, description and optional owned bookId
- PATCH /api/admin/tickets/:id — admin status/priority/category/assignment
- POST /api/admin/tickets/:id/reply — admin sends a reply
- POST /api/admin/tickets/:id/notes — admin creates private note

Bearer token required for protected endpoints. Errors use JSON `{error: string}`.

## AI design
`src/ai.js` loads `data/knowledge-base.md`. When OPENAI_API_KEY is configured it requests a JSON classification and grounded draft from OpenAI with a timeout; on failure or absent key it uses a deterministic rule-based fallback. Drafts are never sent to authors automatically; an admin must edit and send.

## Sample data
`data/bookleaf_sample_data.json` contains the assignment's 10 authors and 18 books. `npm run seed` imports all authors/books and one admin; re-running updates them by email/ISBN. Test accounts use passwords from .env, not hard-coded credentials.

## Testing
`npm test` runs AI, dataset and source-structure tests. Unit/static tests do **not** prove live MongoDB or browser end-to-end behavior. Complete live verification requires valid MongoDB credentials, seeded data and running server; see `docs/TESTING.md`.

## Known limitations
- Live MongoDB integration and full end-to-end browser workflow are not verified in this repository's current test evidence.
- Optional OpenAI call requires a valid OPENAI_API_KEY and network access.
- Attachments and true push/WebSocket updates are not implemented; frontend polls.
- Production hardening (rate limiting, audit trails, robust assignment validation) is needed before real customer data use.
- GitHub hosts source; a private GitHub repository is not a live demo URL.

## Submission
Share repository access with reviewers. Include this README, `docs/ARCHITECTURE.md`, `docs/TESTING.md`, and the one-page write-up.
