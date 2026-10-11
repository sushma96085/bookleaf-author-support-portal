# GitHub-only BookLeaf setup

The source code and tests are stored in this private repository. GitHub Actions runs Node.js tests automatically on every push. GitHub Actions is **not** a persistent web host.

## One-time secure credentials

Open Settings → Secrets and variables → Actions → New repository secret and add:
- `MONGODB_URI`: Atlas Node.js driver URI using database user `bookleaf_app`, including database name `bookleaf_portal`. URL-encode special characters in the password.
- `JWT_SECRET`: a unique long random secret.
- `SEED_ADMIN_PASSWORD`: a strong test admin password.
- `SEED_AUTHOR_PASSWORD`: a different strong test author password.

Never commit these values, share screenshots of them, or paste them into chat.

## Atlas access

GitHub-hosted Actions runners use changing outbound IPs. An Atlas allowlist limited to your laptop's IP will block GitHub Actions. Use a controlled runner with a fixed egress IP for a safer production setup; any temporary broad allowlist should be time-limited and removed promptly.

## Tests

- Every push runs `npm test`.
- Manually start **Actions → BookLeaf CI and MongoDB E2E → Run workflow** to seed the test dataset and exercise the real backend against the configured Atlas database.
- **Warning:** the seed updates the admin and author test account passwords and upserts sample books. Use a dedicated test database, not a live production database.
- A green workflow is evidence for the specific checks executed, not proof of 100% application completeness.
