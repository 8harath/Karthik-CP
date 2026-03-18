# HealthyBite

HealthyBite is a Next.js application for personalized meal recommendations and subscription-based healthy meal planning. The current repository is best described as a polished MVP: the UI is well-developed, the recommendation flow works end-to-end, and Gemini-backed meal suggestions are integrated, but authentication, persistence, billing, and deployment controls are still demo-grade.

## Repository Snapshot

- Purpose: collect a user's health profile, generate meal recommendations, and drive them into a mock subscription flow.
- Maturity: MVP, not production-ready.
- Deployment target: Vercel-friendly Next.js app, with future backend and infrastructure hardening still required.
- Current versioning: `0.1.0`, following pre-1.0 SemVer.

## Tech Stack

- Framework: Next.js 15 App Router
- Language: TypeScript
- UI: React 18, Tailwind CSS
- Theming: `next-themes`
- AI integration: Google Gemini via `@google/generative-ai`
- Test utilities: custom verification scripts in `scripts/` and a Jest-style test file that currently needs formal test-runner setup

## Architecture

```text
.
|-- app/                 Next.js routes, pages, and API endpoints
|-- components/          Shared UI components
|-- lib/                 Recommendation engine, Gemini service, utilities
|-- scripts/             Verification and smoke-test scripts
|-- __tests__/           Test files (currently incomplete test harness)
|-- docs/                Project, setup, presentation, and validation docs
|-- .github/workflows/   CI definitions
```

## Key Product Flows

1. User signs up or logs in through demo auth routes.
2. User completes a multi-step health questionnaire.
3. The app posts profile data to `/api/recommendations`.
4. Gemini generates recommendations when configured.
5. The app falls back to the rule-based engine if Gemini is unavailable.
6. The user selects a subscription plan and completes a mock payment flow.

## Local Development

### Prerequisites

- Node.js 20+
- npm 10+

### Setup

```bash
npm install
Copy-Item .env.example .env.local
```

Set `GEMINI_API_KEY` in `.env.local` if you want live AI responses.

### Useful Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run check
npm run test:fallback
npm run verify-api
```

## Environment Variables

Use `.env.example` as the canonical template.

- `GEMINI_API_KEY`: required for live Gemini recommendations
- `DEMO_EMAIL`: demo login email
- `DEMO_PASSWORD`: demo login password
- `NEXT_PUBLIC_APP_URL`: public app URL for the active environment

## Current Limitations

- Authentication is mock-only and not session-backed.
- User data, selected plans, and orders are stored in `localStorage`.
- Subscription and payment flows are simulated.
- Rate limiting is in-memory and not suitable for horizontally scaled deployments.
- Observability, audit logging, and environment separation are not yet implemented.
- The test suite is incomplete: there is a Jest-style spec file but no configured Jest or Vitest runner in `package.json`.

## Documentation

Project-specific docs now live under `docs/`:

- `docs/README.md`
- `docs/SETUP.md`
- `docs/QUICKSTART.md`
- `docs/TESTING.md`
- `docs/GEMINI_INTEGRATION_SUMMARY.md`
- `docs/MVP_CHECKLIST.md`

## Engineering Standards

- CI is defined in `.github/workflows/ci.yml`.
- Contribution expectations are defined in `CONTRIBUTING.md`.
- Repository ownership remains private and proprietary under `LICENSE`.
- Versioning should continue with SemVer until the first stable production release.

## Production Readiness Status

HealthyBite has strong MVP presentation quality, but it is not near-production yet. To reach production readiness, the next major investments should be:

1. Replace demo auth and local storage persistence with a real backend.
2. Add database schema management and migrations.
3. Introduce robust API validation, centralized logging, and managed rate limiting.
4. Add CI quality gates beyond lint, typecheck, and build, including real automated tests.
5. Separate environments and secrets cleanly across development, staging, and production.
