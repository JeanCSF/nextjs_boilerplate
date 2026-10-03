# AGENTS.md

Guidelines for AI coding agents working in this repository. These rules are stack-agnostic. Project-specific facts live in **Project Context** below; everything else applies to any language or framework.

**Instruction precedence:** the person's explicit request → Project Context below → the general rules in this file. Security rules are never overridden by convenience.

---

## Project Context

- **Purpose:** A reusable, production-oriented Next.js starter for unrelated web applications. It provides secure defaults, minimal generic examples, automated quality checks, and measured performance guardrails without choosing a business domain or infrastructure provider.
- **Stack and versions:** Node.js 24.21.0 LTS, npm 11.19.0, Next.js 16.3.8 App Router, React/React DOM 19.3.0, TypeScript 6.0.3 (strict), Tailwind CSS 4.3.3, ESLint 10.12.0 with typescript-eslint 8.71.0, Prettier 3.9.9, Vite 8.3.2, Vitest 4.1.11, React Testing Library 16.3.3, Node types 24.19.1, and Zod 4.6.5. `package.json` and `package-lock.json` are the dependency sources of truth; `.nvmrc` pins Node.
- **Commands:**
  - Install: `npm ci`
  - Run locally: `npm run dev`
  - Format: `npm run format` / `npm run format:check`
  - Lint / static analysis: `npm run lint` / `npm run typecheck`
  - Tests: `npm test` / `npm run test:watch`
  - Build / production check: `npm run build` / `npm run test:security:production` / `npm run performance:budget`
  - Full validation (same as CI): `npm ci && npm run validate`
- **Language conventions:** source code, identifiers, comments, docs, tests, and user-facing messages are written in English.
- **Architecture notes:** App Router files and route handlers live in `app/`; shared UI and server-only utilities live under `src/`; unit, component, and integration tests live in `tests/`. The root layout and production pages use nonce-based CSP, so HTML is intentionally dynamically rendered.
- **Do not touch:** `.devin/config.local.json`, generated `.next/` output, or installed `node_modules/`. Keep `.env.local` and other local environment files untracked.
- **Environment and deployment notes:** `APP_URL` is required, server-only, and validated when Next.js configuration loads. Copy `.env.example` to `.env.local` for local development. Production HSTS includes subdomains for two years; use it only when every subdomain remains HTTPS. Preserve the public host in forwarded headers and configure only trusted `experimental.serverActions.allowedOrigins` when needed.

---

## 1. Priorities

When requirements conflict, decide in this order:

**security → correctness → performance → simplicity and readability → modernity → convenience**

Performance matters, but it is achieved through good defaults and measurement, not speculative optimization.

## 2. Understand Before Changing

- Read the relevant code and follow the **existing conventions** (naming, structure, patterns, error handling) before writing anything new. Consistency with the codebase beats personal preference.
- Never assume versions or APIs from memory. Check the manifest and lockfile for what is actually installed, and check the official documentation for **that version**. If you cannot verify something, say so explicitly instead of guessing.
- Use the project's own commands from Project Context. Do not invent scripts.

## 3. Scope Discipline

- Make the smallest change that fully solves the problem.
- Do not refactor, rename, reformat, or "improve" unrelated code in the same change.
- Do not add features, configuration, or abstractions that were not requested.
- If a request is ambiguous in a way that affects the result, ask. Otherwise, state your assumption briefly and proceed.
- Never perform destructive or irreversible actions (deleting data, force-pushing, dropping tables, rewriting history) without explicit confirmation.

## 4. Code Quality

- Apply Clean Code, KISS, DRY, separation of concerns, single responsibility, and composition over inheritance. Apply SOLID only where it solves a real problem.
- Prefer descriptive names, small focused functions, straightforward control flow, minimal nesting, and explicit behavior. Avoid cleverness and hidden magic.
- Use the language's type system and strictness features fully. Avoid escape hatches (untyped values, unchecked casts, suppressed warnings) unless justified in a comment.
- Remove dead code you introduce. Do not leave commented-out code, debug output, or TODOs without context.

## 5. Avoid Overengineering

Do not introduce design patterns, interfaces, service or repository layers, factories, dependency injection, plugin systems, or configuration options unless they solve a **present, concrete problem** in this codebase. Duplication is cheaper than the wrong abstraction: wait until a pattern repeats and is understood before extracting it.

The result should be understandable by a developer who has never seen the project, without reading hundreds of files.

## 6. Dependencies

Keep the dependency tree small. Before adding a package, ask: *can the same result be achieved clearly with the language, the framework, or what is already installed?*

When a new dependency is justified, prefer mature, actively maintained, well-documented options with a compatible license, and state the reason in your summary. Never add experimental or abandoned packages. Always commit lockfile changes together with manifest changes.

## 7. Testing

- New behavior gets tests; bug fixes get a test that fails before the fix and passes after.
- Test **observable behavior**, not implementation details.
- Keep tests fast, deterministic, and independent. No reliance on execution order, wall-clock time, network, or shared mutable state unless explicitly isolated.
- Place and name tests following the project's existing structure.
- Never weaken, skip, or delete a test to make a change pass. If a test is wrong, explain why and fix it deliberately.

## 8. Security

Security is a default, not a follow-up task.

- **Secrets:** never commit secrets, tokens, or credentials. Never print them in logs, errors, or responses. Keep an example env file with placeholders only.
- **Input:** treat all external input (requests, files, query strings, headers, third-party API responses) as untrusted. Validate at the boundary, using allowlists over blocklists.
- **Injection:** use parameterized queries and safe APIs. Never build queries, shell commands, file paths, or markup by concatenating untrusted data. Encode output for its context.
- **Access control:** perform authentication and authorization checks on the server for every protected operation. Never rely on the client or on hidden UI. Apply least privilege.
- **Errors:** never expose stack traces, internal paths, queries, or system details to end users. Return generic messages; log details server-side without sensitive data.
- **Data:** collect and store only what is needed. Do not log personal or sensitive data. Use well-established libraries for cryptography and password hashing; never invent your own.
- **Defaults:** secure cookies and sessions, safe HTTP headers, restrictive CORS, and explicit allowlists for outbound requests and redirects based on user input.
- **Supply chain:** commit lockfiles, review new dependencies, and run the project's vulnerability audit when available.
- If you find a vulnerability or an insecure pattern outside your task, **report it** rather than silently ignoring it.

## 9. Performance

- Measure before optimizing. Do not add caches, memoization, or complexity without evidence of a problem.
- Avoid known costly patterns by default:
  - N+1 queries and unbounded result sets (paginate and limit),
  - queries on unindexed columns used for filtering or sorting,
  - repeated work inside loops,
  - loading large data into memory when streaming or chunking works,
  - blocking operations on request paths that can be deferred to background jobs.
- On the client side, ship less: small bundles, lazy loading for non-critical code, optimized assets, and no unnecessary third-party scripts.
- When adding caching, define its invalidation strategy at the same time.
- Mention any change with a plausible performance impact in your summary.

## 10. Error Handling and Logging

- Be predictable and consistent: follow the project's existing error-handling approach.
- Do not swallow errors silently and do not use exceptions for normal control flow.
- Fail fast on invalid configuration at startup.
- Log at the appropriate level with enough context to debug, and without sensitive data.

## 11. Documentation and Comments

- Comment **why**, not what. Do not write comments that restate the code.
- Document non-obvious decisions and trade-offs where they live (code comment, README, or decision record, following the project's habit).
- Update the README and other docs when behavior, setup, commands, or configuration change.

## 12. Git and Repository Hygiene

- Keep changes focused and reviewable. Do not mix unrelated changes.
- Write clear commit messages in the project's existing style. Do not commit unless asked.
- Never commit generated files, build output, local environment files, or secrets.
- Respect `.gitignore`, formatting, and editor configuration already in the repo.

## 13. Validation Before Finishing

Run the project's checks and confirm they pass. Do not claim success without running them.

- Formatting, lint / static analysis, and type checks
- Tests (at minimum the affected area; the full suite when practical)
- Build or production check, when applicable
- No secrets, debug output, or unrelated changes in the diff
- Documentation updated where needed

If a check cannot be run or fails for reasons outside your change, say so clearly.

## 14. Reporting

End each task with a short summary:

- What changed and why
- Assumptions you made and anything you could not verify
- Checks you ran and their results
- Risks, trade-offs, or follow-ups worth the person's attention (including security or performance concerns)

Be honest about uncertainty. A clearly stated limitation is more valuable than a confident guess.

---

## Standard

Aim for work a professional reviewer would approve without surprises:

- Simple without being simplistic
- Secure by default
- Fast by default
- Consistent with the existing codebase
- Easy for a human to read, change, and test
