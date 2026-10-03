# Next.js Boilerplate

A reusable foundation for unrelated web applications. It favors secure defaults, small client bundles, clear boundaries, and measured performance over product-specific examples or infrastructure choices.

## Technology stack

Versions were checked against the official Node.js release schedule, the Next.js documentation, and npm registry metadata on 2026-10-03.

| Technology                 | Version          | Purpose                                                                                      |
| -------------------------- | ---------------- | -------------------------------------------------------------------------------------------- |
| Node.js                    | 24.21.0 LTS      | Pinned runtime with an active LTS support window                                             |
| npm                        | 11.19.0          | Built-in, widely supported package manager; commit the lockfile with project source          |
| Next.js                    | 16.3.8           | App Router, Server Components, route handlers, and request handling                          |
| React / React DOM          | 19.3.0           | UI runtime supported by the selected Next.js release                                         |
| TypeScript                 | 6.0.3            | Strict application and tooling types, compatible with the selected TypeScript ESLint release |
| Tailwind CSS               | 4.3.3            | CSS-first utility styling and centralized design tokens                                      |
| ESLint / TypeScript ESLint | 10.12.0 / 8.71.0 | JavaScript and TypeScript linting using recommended flat configs                             |
| Prettier                   | 3.9.9            | Consistent formatting with automatic Tailwind class sorting                                  |
| Vite                       | 8.3.2            | Build tooling used by Vitest; it is not the production bundler                               |
| Vitest                     | 4.1.11           | Unit, component, and route-handler tests                                                     |
| Node / React type packages | Node 24.19.1     | Compile-time type declarations; React and React DOM types match version 19.3.0               |
| Zod                        | 4.6.5            | One schema library for required environment configuration and external request input         |

The exact versions and transitive resolutions are recorded in `package.json` and `package-lock.json`. Next.js 16.3.8 is the security-patched stable release verified for this boilerplate. TypeScript 7.0.2 was available, but typescript-eslint 8.71.0 declares support only below TypeScript 6.1, so TypeScript 6.0.3 was selected for compatibility. Vitest 5.0.3 is the newest stable release, but it was published within the past week; this starter keeps the patched Vitest 4.1.11 line for a soak period and should revisit the major update through Dependabot. The current Next.js ESLint config pulls in `braces@3.0.3`, which has an unpatched high-severity advisory; the starter uses the general ESLint and typescript-eslint recommended configs instead, and should revisit the Next.js-specific lint config once its dependency tree is patched. The React Compiler is not enabled: the starter does not demonstrate a measured need for it.

Supporting development packages have focused roles: `@eslint/js` and `globals` supply the flat ESLint configuration; `@tailwindcss/postcss` integrates Tailwind with PostCSS; `@vitejs/plugin-react` and `jsdom` support React component tests; Testing Library packages provide DOM rendering and assertions; `@types/*` packages are compile-time declarations; and `server-only` marks server-only imports.

## Requirements

- Node.js 24.21.0 or a compatible Node 24 LTS patch release
- npm 11.19.0 or a compatible npm 11 release

The exact local runtime is pinned in `.nvmrc`; `package.json` also declares supported Node and npm versions.

## Install and run

```bash
npm ci
```

Create the local environment file and set its required application origin:

```bash
cp .env.example .env.local
```

On PowerShell, use `Copy-Item .env.example .env.local`. The example value is suitable for local development. Replace it with the canonical HTTPS origin before deployment. The file is ignored by Git.

```bash
npm run dev
```

For a production build and server:

```bash
npm run build
npm run start
```

The app validates `APP_URL` while loading Next.js configuration. A missing or malformed value fails development startup and production builds rather than silently producing incorrect metadata.

## Commands

| Command                                  | Description                                                                                                            |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`                            | Start the development server                                                                                           |
| `npm run build`                          | Create the production build                                                                                            |
| `npm run start`                          | Serve the production build                                                                                             |
| `npm run typecheck`                      | Generate route types and run strict TypeScript checking                                                                |
| `npm run lint`                           | Run ESLint                                                                                                             |
| `npm run format`                         | Format supported project files                                                                                         |
| `npm run format:check`                   | Check formatting without writing files                                                                                 |
| `npm test`                               | Run the test suite once                                                                                                |
| `npm run test:watch`                     | Run Vitest in watch mode                                                                                               |
| `npm run audit`                          | Fail on high or critical dependency audit findings                                                                     |
| `npm run test:security:production`       | Start the production server and verify response security behavior                                                      |
| `npm run performance:budget`             | Measure the homepage's initial JavaScript transfer against its budget                                                  |
| `npm run performance:budget -- --report` | Report current JavaScript transfer without enforcing the budget                                                        |
| `npm run analyze`                        | Use Next.js's built-in experimental Turbopack bundle analyzer                                                          |
| `npm run validate`                       | Run audit, type check, lint, format check, tests, build, security smoke checks, and the performance budget in CI order |

CI first performs `npm ci`, then runs `npm run validate`.

## Project structure

```text
app/                         App Router pages, layout, route handlers, and boundaries
  api/example/               Input-validation and fail-closed mutation example
  streaming/                 Suspense and streamed Server Component example
src/components/              Small shared UI components
src/lib/                     Server-only environment and reusable validation/security helpers
tests/unit/                  Environment, header, and input schema tests
tests/component/             Accessible component behavior tests
tests/integration/           Route-handler and security-configuration tests
scripts/                     Production response checks and bundle budget measurement
performance/                 Measured route budgets and measurement notes
.github/workflows/            CI workflow
```

Keep route-specific rendering in `app/`, reusable presentation in `src/components/`, and server-only utilities in `src/lib/`. Server Components are the default; add a client boundary only around the smallest interactive leaf.

## Styling and themes

Tailwind CSS 4 is loaded through the official PostCSS integration. Semantic colors, font tokens, the 0.25rem spacing scale, and named radius tokens live in `app/globals.css` using the CSS-first `@theme` mechanism. Primary actions use the theme-aware `primary-foreground` token so their foreground follows the active palette. The `.dark` class selects the dark token values. A tiny nonce-authorized inline script in the root layout reads the saved preference or system color scheme before painting; the toggle persists an explicit choice in local storage.

Use mobile-first utilities, semantic HTML, visible keyboard focus, adequate contrast, and respect reduced-motion preferences. Prettier sorts Tailwind classes. No UI library or runtime CSS-in-JS dependency is included.

## Performance and rendering

Performance targets for the starter routes are LCP ≤ 2.5 s, INP ≤ 200 ms, and CLS ≤ 0.1 on a mobile profile. Treat these as measurement targets, not guarantees across every device or deployment. Uncompressed initial JavaScript budgets for `/` and `/streaming` are stored in `performance/budgets.json`; they are based on production baselines measured for this starter and enforced by `npm run performance:budget`. The Lighthouse baseline and its limitations are recorded in `performance/README.md`.

The production check serves the built app, reads the initial HTML, and sums the uncompressed response bytes of same-origin JavaScript assets referenced by its script tags. It requests identity encoding, so the value is a conservative JavaScript payload budget rather than compressed network transfer. For a current report without enforcement, run `npm run performance:budget -- --report`. Review the report before changing the recorded budget. The check is deterministic and does not run Lighthouse in CI.

The built-in `useReportWebVitals` hook reports metric names and values to the development console only. It adds no analytics provider or third-party request. Use `npm run analyze` for the official Next.js Turbopack bundle analyzer; that analyzer is currently marked experimental and is an optional local investigation tool, not a CI gate.

The starter opts into a per-request nonce CSP as its production default. Next.js requires dynamic rendering to attach a fresh nonce to framework and inline scripts. Consequently, HTML routes are rendered per request and do not use static optimization, ISR, PPR, or CDN page caching by default. Next.js static assets retain their framework caching behavior. This deliberately favors a strict script policy over static HTML delivery; measure both route experience and server/hosting cost before changing that security choice. The Next.js App Router's default fetch behavior is not to persistently cache fetches; opt into caching for individual data sources only after defining their freshness and invalidation requirements. Compression is provided by the framework's production server by default; if a reverse proxy handles compression, configure it deliberately and preserve framework cache headers for static assets.

Use `next/font` for self-hosted, subset fonts to avoid runtime requests to font providers. Use `next/image` with dimensions and responsive `sizes`; keep `images.remotePatterns` empty until a project needs explicit remote hosts. Set priority only for the image proven to be the route's LCP element. Do not add third-party scripts by default; use `next/script` with an appropriate loading strategy and update the CSP only for a reviewed source.

## Testing

- **Unit tests** cover environment validation, security-header policy, and input schemas.
- **Component tests** use React Testing Library to verify accessible theme-toggle behavior and the theme-aware foreground token on primary actions.
- **Integration-level tests** exercise malformed input, the 8 KiB request-body limit, and fail-closed authorization behavior.
- **Production security checks** start `next start` and verify nonce rotation, header presence, framework-header removal, and generic invalid-request responses.

Tests live in `tests/`. Add tests for behavior and user-visible results, not private implementation details. Run `npm test` once or `npm run test:watch` while developing. CI executes the complete validation sequence, including the production security check.

Vitest is used for synchronous components, utilities, and route-handler tests. Next.js documents that Vitest does not currently execute async Server Components; test those through production/browser-level checks instead.

## Environment variables

| Variable  | Required | Exposure    | Purpose                                     | Example                 |
| --------- | -------- | ----------- | ------------------------------------------- | ----------------------- |
| `APP_URL` | Yes      | Server-only | Canonical absolute origin for metadata URLs | `http://localhost:3000` |

No public-prefixed variables or secrets are included. Keep deployment-specific values in the hosting environment or an ignored local environment file, not in source control. `.env.example` contains placeholders only.

## Security model

The starter removes `X-Powered-By` and applies Content Security Policy, HSTS in production, `nosniff`, a restrictive referrer and permissions policy, frame protections, and COOP/CORP same-origin policies. COEP is intentionally omitted, so the app is not cross-origin isolated by default; enable it only after reviewing all cross-origin assets and embeds. The Permissions-Policy baseline disables camera, geolocation, microphone, payment, and USB; extend it for other unused features as needed. HSTS uses `includeSubDomains` and a two-year `max-age`, so deploy it only when the origin and every subdomain will remain HTTPS. Page requests receive a fresh CSP nonce through the Next.js `proxy.ts` convention; the root layout uses it for the no-flash theme script. Development-only CSP relaxations are limited to development. The strict nonce policy forces dynamic page rendering, as described above.

`src/lib/env.ts` is marked `server-only`; environment validation also runs while loading `next.config.ts`, so invalid configuration fails before serving or building the app. The example POST route enforces an 8 KiB body limit before parsing JSON, validates request input with Zod, and always denies otherwise-valid mutations until a project supplies a real server-side authorization policy and persistence. Do not treat hidden UI as authorization.

Next.js Server Actions perform a same-origin `Origin` versus `Host`/`X-Forwarded-Host` check by default. If a reverse proxy changes the forwarded host, configure only the trusted `experimental.serverActions.allowedOrigins` values and ensure the proxy forwards the public host correctly. Route Handlers are ordinary HTTP endpoints: when adding cookie-authenticated mutations, add an explicit CSRF/origin policy and authorization checks rather than assuming the Server Actions check applies to them. At the proxy, terminate TLS, preserve the external host and scheme, and do not trust arbitrary forwarded headers.

This boilerplate intentionally does not include authentication, sessions, a database, rate limiting, or provider-specific abuse controls. For future cookies, use `HttpOnly`, `Secure` in HTTPS deployments, an appropriate `SameSite` value, narrow domain/path scope, and a deliberate lifetime. Add rate limiting at the application edge or trusted infrastructure. Validate outbound destinations and redirect targets against explicit allowlists to prevent SSRF and open redirects. Do not put secrets in `NEXT_PUBLIC_` variables.

See [SECURITY.md](SECURITY.md) for the vulnerability disclosure template and new-project security checklist.

## Upgrading

Review release notes and compatibility requirements before changing Node.js, Next.js, React, TypeScript, or Tailwind CSS. Update `.nvmrc`, `engines`, and `packageManager` together where appropriate; pin compatible package versions and regenerate `package-lock.json` with the selected npm version. Review automated dependency PRs in small groups, run `npm audit`, `npm run validate`, and production measurements, and read migration guides for major upgrades. Do not bypass repository security controls to make an upgrade pass.

## Creating a project from this boilerplate

1. Fork the repository.
2. Clone your fork.
3. Rename the repository and local folder if desired.
4. Update `name`, `description`, and any repository metadata in `package.json`, then run `npm install --package-lock-only` to synchronize the lockfile before the clean install.
5. Configure `APP_URL` and any future project-specific environment variables.
6. Install the pinned dependencies with `npm ci`.
7. Start the development server with `npm run dev`.
8. Review and remove boilerplate-specific examples, tests, and security policy details that do not apply to the new project.
9. Review the resulting changes and create the first project commit.
