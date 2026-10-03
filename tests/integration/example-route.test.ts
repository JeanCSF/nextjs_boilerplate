import { describe, expect, it } from 'vitest';
import { POST } from '../../app/api/example/route';

describe('POST /api/example', () => {
  it('returns a generic client error for malformed JSON', async () => {
    const response = await POST(
      new Request('http://localhost/api/example', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '{',
      }),
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Invalid request.' });
  });

  it('rejects oversized request bodies before parsing JSON', async () => {
    const response = await POST(
      new Request('http://localhost/api/example', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ value: 'sample', extra: 'x'.repeat(8192) }),
      }),
    );

    expect(response.status).toBe(413);
    expect(await response.json()).toEqual({ error: 'Request body too large.' });
  });

  it('rejects declared request sizes over the limit', async () => {
    const response = await POST(
      new Request('http://localhost/api/example', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'content-length': '9000',
        },
        body: JSON.stringify({ value: 'sample' }),
      }),
    );

    expect(response.status).toBe(413);
    expect(await response.json()).toEqual({ error: 'Request body too large.' });
  });

  it('rejects invalid input and fails closed when authorization is not configured', async () => {
    const invalidResponse = await POST(
      new Request('http://localhost/api/example', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ value: '' }),
      }),
    );
    const validResponse = await POST(
      new Request('http://localhost/api/example', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ value: 'sample' }),
      }),
    );

    expect(invalidResponse.status).toBe(400);
    expect(await invalidResponse.json()).toEqual({ error: 'Invalid request.' });
    expect(validResponse.status).toBe(403);
    expect(await validResponse.json()).toEqual({ error: 'Forbidden.' });
  });
});
