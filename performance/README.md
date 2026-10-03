# Performance measurements

`budgets.json` contains a measured first-load JavaScript baseline and guardrail for each starter route. The checker reads each initial HTML response, fetches its same-origin JavaScript assets from `next start` with identity encoding, and sums their uncompressed response bytes. This is a conservative payload-size budget rather than an estimate of compressed network transfer.

## Captured baseline

Measured on 2026-10-03 against the local production build using Node.js 24.21.0, Next.js 16.3.8, Lighthouse 13.5.0, Chrome 154.0.8037.95, and Lighthouse's default mobile emulation.

| Route        | Performance score |      LCP | INP                       |    CLS | Total blocking time |
| ------------ | ----------------: | -------: | ------------------------- | -----: | ------------------: |
| `/`          |              0.98 | 2,167 ms | Not available in lab data | 0.0000 |               71 ms |
| `/streaming` |              0.98 | 2,262 ms | Not available in lab data | 0.0083 |               73 ms |

Both measured routes met the LCP ≤ 2.5 s and CLS ≤ 0.1 targets in this lab run. A separate Lighthouse Accessibility run scored 1.00 on `/` and reported no color-contrast failures for the theme-aware primary action under the browser's default color-scheme preference. Lighthouse does not provide a field INP value; total blocking time is reported only as a lab responsiveness indicator and is not a replacement for INP. Collect real-user data after deployment to verify INP.

Both `/` and `/streaming` loaded 589,841 uncompressed JavaScript bytes across nine same-origin script assets. Each route has a 650,000-byte budget, providing approximately 10% growth headroom. These are local lab snapshots, not guarantees for other hardware, browsers, networks, or hosting environments.

To report the current measurement without enforcing a threshold, run `npm run performance:budget -- --report` after a production build. Update the route budget only after reviewing a new production measurement.
