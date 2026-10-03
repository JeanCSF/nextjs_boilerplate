# Security policy

## Reporting a vulnerability

Do not report security vulnerabilities in public issues or discussions. Use the repository host's private vulnerability reporting feature or contact the repository maintainers through an established private channel. Include affected versions, impact, reproduction steps, and any suggested mitigation. Do not include real user data or secrets in a report.

Repository maintainers should replace this guidance with a monitored private contact channel and publish their response expectations before making the project public.

## Security checklist for new projects

- [ ] Keep secrets server-side; expose only intentionally public values.
- [ ] Validate request bodies, query parameters, route parameters, and environment variables at their boundaries.
- [ ] Add server-side authentication and authorization for every protected operation.
- [ ] Add CSRF/origin protection for cookie-authenticated Route Handler mutations; do not rely on UI visibility.
- [ ] Review CSP sources, proxy trust, security headers, cookies, redirects, and outbound destinations.
- [ ] Add rate limiting and abuse protection at a trusted application or infrastructure boundary.
- [ ] Review dependency audit findings and automated update pull requests.
- [ ] Verify CI permissions and pin third-party workflow actions to full commit SHAs.
- [ ] Test production headers and safe error responses without exposing internal details.
- [ ] Review this checklist whenever the project's data, integrations, or deployment model changes.
