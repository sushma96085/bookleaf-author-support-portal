# BookLeaf verification status
Run locally: `npm install && npm test` after updating package scripts.
Static tests validate code structure only. They are not live end-to-end tests.
Live E2E prerequisites: MongoDB Atlas user/password and network access; .env with MONGODB_URI and JWT_SECRET; seed credentials; server running.
Manual E2E steps:
1. GET /api/health returns ok.
2. POST /api/auth/login with seeded author credentials returns JWT.
3. GET /api/books with author JWT returns only their books.
4. POST /api/tickets with author JWT persists ticket; GET /api/tickets returns it.
5. Login as admin; PATCH /api/admin/tickets/:id; POST /api/admin/tickets/:id/reply; author GET /api/tickets sees response.
6. Attempt admin route with author JWT: expect 403. Attempt request without JWT: expect 401.
7. Restart server and confirm ticket persists in MongoDB.
Not yet implemented: complete sample data import, live AI provider, author-facing realtime interface, attachment uploads.
Do not report 100% end-to-end success until these checks have been executed against a real database.