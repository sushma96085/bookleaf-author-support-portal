# BookLeaf Author Support & Communication Portal

Full-stack technical assignment implementation for BookLeaf Publishing.

## Scope
- Author and Admin roles
- Author book/royalty visibility
- Support ticket submission and history
- Admin ticket queue with status/category/priority management
- AI-assisted ticket categorization, prioritization and draft responses
- Knowledge-base-grounded support tone and escalation guidance
- JWT authentication and role-based authorization architecture
- MongoDB database configuration for `bookleaf_portal`
- Environment variables for secrets

## Environment variables
Create a local `.env` file from `.env.example` and provide real values locally only. Never commit secrets.

```env
PORT=5000
MONGODB_URI=mongodb+srv://<DB_USERNAME>:<URL_ENCODED_DB_PASSWORD>@cluster0.fotmi1a.mongodb.net/bookleaf_portal?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=<LONG_RANDOM_SECRET>
OPENAI_API_KEY=<OPTIONAL_OPENAI_API_KEY>
```

## Important
`MONGODB_URI`, `JWT_SECRET`, and `OPENAI_API_KEY` must stay outside GitHub history.

## Demo credentials
Author demo: `priya.sharma@email.com` / `demo123`

## Notes
This repository is being prepared as the source submission for the BookLeaf Full-Stack Developer technical assignment.
