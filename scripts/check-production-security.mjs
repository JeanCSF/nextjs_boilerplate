import assert from 'node:assert/strict';
import { withProductionServer } from './production-server.mjs';

await withProductionServer(async (baseUrl) => {
  const pageResponse = await fetch(baseUrl);
  const html = await pageResponse.text();
  const contentSecurityPolicy = pageResponse.headers.get('content-security-policy') ?? '';
  const nonce = contentSecurityPolicy.match(/'nonce-([^']+)'/)?.[1];

  assert.equal(pageResponse.status, 200);
  assert.ok(nonce, 'The HTML response must use a per-request CSP nonce.');
  assert.ok(html.includes(`nonce="${nonce}"`), 'Inline theme code must use the CSP nonce.');
  assert.ok(!contentSecurityPolicy.includes("'unsafe-inline'"));
  assert.equal(pageResponse.headers.get('x-powered-by'), null);
  assert.equal(pageResponse.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(pageResponse.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
  assert.equal(pageResponse.headers.get('x-frame-options'), 'DENY');
  assert.ok(pageResponse.headers.get('strict-transport-security')?.includes('max-age='));

  const secondResponse = await fetch(baseUrl);
  const secondPolicy = secondResponse.headers.get('content-security-policy') ?? '';
  const secondNonce = secondPolicy.match(/'nonce-([^']+)'/)?.[1];
  assert.ok(secondNonce);
  assert.notEqual(secondNonce, nonce, 'CSP nonces must change for each page response.');

  const invalidResponse = await fetch(`${baseUrl}/api/example`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{',
  });
  const invalidBody = await invalidResponse.text();

  assert.equal(invalidResponse.status, 400);
  assert.equal(invalidBody, '{"error":"Invalid request."}');
  assert.equal(invalidResponse.headers.get('x-content-type-options'), 'nosniff');
  assert.ok(!invalidBody.includes('node_modules'));
});

console.info('Production security smoke checks passed.');
