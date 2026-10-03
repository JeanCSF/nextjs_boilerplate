import { describe, expect, it } from 'vitest';
import { getSecurityHeaders } from '../../src/lib/security-headers';

describe('production security configuration', () => {
  it('includes the required baseline headers and disables framework identification', () => {
    const headers = Object.fromEntries(
      getSecurityHeaders(true).map(({ key, value }) => [key.toLowerCase(), value]),
    );

    expect(headers['content-security-policy']).toContain("default-src 'self'");
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(headers['permissions-policy']).toContain('camera=()');
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['strict-transport-security']).toContain('max-age=');
  });
});
