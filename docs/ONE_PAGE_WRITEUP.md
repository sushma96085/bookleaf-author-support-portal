# BookLeaf Author Support & Communication Portal — One-page Write-up

**Problem.** Authors need visibility into book status, sales and royalty figures, while BookLeaf support needs a structured, prioritized way to respond to ISBN, printing, royalty, distribution and production queries.

**Solution.** A single responsive portal offers author and admin roles. Authors authenticate, view only their own books and royalty data, submit book-specific or general support tickets and read support responses. Admins manage the ticket queue, update status and priority, compose replies and keep internal notes hidden from authors. The frontend polls for new tickets every ten seconds.

**Architecture.** A Node.js/Express REST API uses MongoDB/Mongoose for users, books and tickets. Passwords are hashed with bcrypt; JWT middleware and role checks protect APIs. Book ownership is verified when creating a ticket. The repository includes a seed script for the original assignment dataset of ten authors and eighteen books.

**AI workflow.** Incoming tickets receive a category, priority and draft response. The optional OpenAI integration uses the provided BookLeaf knowledge base to ground draft responses; a deterministic rules-based fallback operates without an API key or during provider failures. AI never sends messages automatically: an admin reviews/edits the draft and explicitly sends it. This reduces hallucination and keeps humans accountable for customer communications.

**Error handling and efficiency.** Zod validates request payloads; API errors return structured JSON. A timeout limits AI calls, and deterministic fallback avoids blocking tickets if the model is unavailable. Knowledge-base context is compact, and a single request produces category, priority and draft together to limit token use and API cost. The frontend uses ten-second polling rather than a more complex real-time infrastructure.

**Testing and limitations.** Ten local unit/dataset checks passed (five classification checks and five dataset integrity checks). Source-structure checks exist in the repo. Live MongoDB integration, browser end-to-end tests and real OpenAI-provider execution have not been verified. Attachment uploads, true push updates and production security hardening remain future work. The code should not be represented as 100% production-ready until these checks are complete.

**Run.** Configure environment variables locally, `npm install`, `npm run seed`, `npm test`, `npm start`; open http://localhost:5000. The private GitHub repository requires reviewer collaborator access.
