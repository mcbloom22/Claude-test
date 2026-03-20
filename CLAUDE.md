# CLAUDE.md

This file provides guidance for AI assistants (Claude and others) working in this repository.

## Repository Overview

**Reserve** — a personal restaurant discovery and reservation tracking web app.
Mobile-first, designed to be used from an iPhone via Safari (or added to home screen as a PWA).

### Key Features
- **Discover** — Search restaurants via Google Places + Yelp, with deep links to Beli, The Infatuation, OpenTable, and Resy
- **Saved** — Wishlist of restaurants to try
- **Reservations** — Log and track upcoming (and past) reservations

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | JavaScript (no TypeScript) |
| Styling | Tailwind CSS |
| Database | Vercel Postgres (Neon) via `@vercel/postgres` |
| Deployment | Vercel |
| Date picker | `react-day-picker` v9 + `date-fns` |

## General Development Conventions

### Code Style
- Follow the language-specific conventions and linting rules configured in the project.
- Prefer readability over cleverness; write code that is easy to understand and maintain.
- Keep functions small and focused on a single responsibility.
- Avoid unnecessary abstractions — solve the problem at hand without over-engineering.

### Git Workflow
- Branch names should be descriptive and use the format `<type>/<short-description>` (e.g., `feat/add-auth`, `fix/login-bug`).
- Write clear, concise commit messages in the imperative mood (e.g., "Add user authentication", not "Added user authentication").
- Commits should be atomic — one logical change per commit.
- Never force-push to `main` or shared branches.
- Always create a new branch for changes; do not commit directly to `main`.

### Pull Requests
- PRs should be focused and small when possible.
- Include a summary of what changed and why.
- Reference any related issues in the PR description.

## AI Assistant Guidelines

### What to Do
- Read existing code before suggesting changes.
- Prefer editing existing files over creating new ones.
- Keep changes minimal and focused on the task at hand.
- Run tests before and after making changes when a test suite exists.
- Ask for clarification when requirements are ambiguous.

### What to Avoid
- Do not add features, refactors, or "improvements" beyond what was explicitly requested.
- Do not add unnecessary comments, docstrings, or type annotations to code you didn't change.
- Do not introduce security vulnerabilities (SQL injection, XSS, command injection, etc.).
- Do not commit secrets, credentials, or `.env` files.
- Do not push to branches other than the one designated for the current task.

### Security
- Validate all user inputs at system boundaries.
- Never expose secrets in code, logs, or error messages.
- Follow the principle of least privilege for permissions and access.
- Use environment variables for configuration and secrets; never hard-code them.

## Project Structure

```
app/                     Next.js App Router pages + API routes
  api/
    restaurants/         Google Places + Yelp proxy endpoints
    saved/               Wishlist CRUD
    reservations/        Reservation CRUD
  discover/              Search/discovery page
  saved/                 Wishlist page
  reservations/          Reservations page
components/              Shared React components
lib/
  db.js                  Vercel Postgres setup + table migrations
  api.js                 Client-side fetch helpers
public/
  manifest.json          PWA manifest
```

## Project Setup

### 1. Clone and install

```bash
npm install
```

### 2. Vercel Postgres (database)

1. Push this repo to GitHub and import it into Vercel
2. In your Vercel project, go to **Storage → Create Database → Postgres**
3. Link it to the project — Vercel will auto-add `POSTGRES_URL` and related env vars
4. Pull env vars for local development:
   ```bash
   npx vercel env pull .env.local
   ```

### 3. API keys

Add these to your Vercel project's environment variables (and your local `.env.local`):

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `GOOGLE_PLACES_API_KEY` | Google Places API key | [Google Cloud Console](https://console.cloud.google.com/) — enable **Places API** |
| `YELP_API_KEY` | Yelp Fusion API key | [Yelp Developer Portal](https://docs.developer.yelp.com/) — optional |

### 4. Run locally

```bash
npm run dev
```

App runs at `http://localhost:3000`.

## Database

Tables are auto-created on first request via `lib/db.js` (`initDb()`). No manual migrations needed.

- `saved_restaurants` — wishlist items, keyed by Google `place_id`
- `reservations` — logged reservations with date, time, party size

## Security Notes

- API keys (Google, Yelp) are proxied server-side via Next.js API routes and never sent to the client
- All env vars live in `.env.local` (gitignored) locally and in Vercel's environment variable settings in production

## Testing

No automated test suite yet. Manual checklist:
- [ ] Search returns results
- [ ] Restaurant detail shows Google + Yelp ratings
- [ ] Save/unsave a restaurant
- [ ] Log a reservation (form validates, prevents past dates)
- [ ] Cancel a reservation via confirm dialog
- [ ] External links (Yelp, Beli, Infatuation, OpenTable, Resy) open correctly
- [ ] App is usable when added to iPhone home screen

## CI/CD

Vercel handles builds and deployments automatically on push to `main`.
