import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { withProductionServer } from './production-server.mjs';

const reportOnly = process.argv.includes('--report');
const budgets = reportOnly
  ? undefined
  : JSON.parse(await readFile(new URL('../performance/budgets.json', import.meta.url), 'utf8'));

async function measureRoute(baseUrl, route) {
  const response = await fetch(new URL(route, baseUrl));
  assert.equal(response.status, 200, `Route ${route} did not return a successful response.`);

  const html = await response.text();
  const origin = new URL(baseUrl).origin;
  const scriptUrls = new Set(
    [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)]
      .map(([, source]) => new URL(source.replaceAll('&amp;', '&'), baseUrl))
      .filter((url) => url.origin === origin),
  );

  let initialJsBytes = 0;
  const assets = [];

  for (const scriptUrl of scriptUrls) {
    const scriptResponse = await fetch(scriptUrl, { headers: { 'accept-encoding': 'identity' } });
    assert.equal(scriptResponse.status, 200, `Could not load ${scriptUrl.pathname}.`);

    const contentEncoding = scriptResponse.headers.get('content-encoding') ?? 'identity';
    assert.equal(
      contentEncoding,
      'identity',
      'The server must honor identity encoding for measurement.',
    );
    const assetBytes = (await scriptResponse.arrayBuffer()).byteLength;
    initialJsBytes += assetBytes;
    assets.push({ path: scriptUrl.pathname, bytes: assetBytes });
  }

  assert.ok(scriptUrls.size > 0, `No initial JavaScript assets were found for ${route}.`);
  return { route, initialJsBytes, scriptCount: scriptUrls.size, assets };
}

await withProductionServer(async (baseUrl) => {
  const measurements = [];

  for (const route of ['/', '/streaming']) {
    const measurement = await measureRoute(baseUrl, route);
    measurements.push(measurement);

    if (!reportOnly) {
      const budget = budgets.routes[route];
      assert.ok(budget, `A first-load JavaScript budget must be configured for ${route}.`);
      assert.ok(
        measurement.initialJsBytes <= budget.maxInitialJsBytes,
        `Route ${route} loaded ${measurement.initialJsBytes} uncompressed JavaScript bytes; budget is ${budget.maxInitialJsBytes} bytes.`,
      );
    }
  }

  if (reportOnly) {
    console.info(JSON.stringify({ routes: measurements }));
    return;
  }

  console.info(
    measurements
      .map(({ route, initialJsBytes }) => {
        const budget = budgets.routes[route];
        return `Route ${route} loaded ${initialJsBytes} uncompressed JavaScript bytes (budget: ${budget.maxInitialJsBytes} bytes).`;
      })
      .join('\n'),
  );
});
