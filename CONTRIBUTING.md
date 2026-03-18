# Contributing

## Workflow

1. Create a short-lived branch from `main`.
2. Keep changes focused on one concern.
3. Run `npm run check` before opening a pull request.
4. Document any new environment variables in `.env.example`.
5. Update `README.md` or `docs/` when behavior changes.

## Branch Naming

- Feature work: `feature/<area>-<summary>`
- Bug fixes: `bugfix/<area>-<summary>`
- Hotfixes: `hotfix/<area>-<summary>`
- Chores: `chore/<area>-<summary>`

## Pull Request Expectations

- Explain the user impact and technical approach.
- Reference any tickets, issues, or design notes.
- Include screenshots for UI changes.
- Call out config, migration, or deployment implications.
- Do not mix structural cleanup with behavior changes unless tightly related.

## Quality Gates

Before merge, verify:

- `npm run lint`
- `npm run typecheck`
- `npm run build`

If the change affects recommendation logic or Gemini integration, also run:

- `npm run test:fallback`
- `npm run verify-api`

## Coding Standards

- Prefer small, composable modules over large page-level files.
- Keep API validation close to the boundary.
- Avoid storing sensitive or authoritative state in `localStorage`.
- Prefer deterministic IDs over `Math.random()` when data may be persisted or audited.
- Add tests for non-trivial business logic changes.
