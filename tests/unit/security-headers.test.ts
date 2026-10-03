import { describe, expect, it } from 'vitest';
import { getContentSecurityPolicy, getSecurityHeaders } from '../../src/lib/security-headers';

describe('getSecurityHeaders', () => {
  it('returns the production security headers without development relaxations', () => {
    const headers = getSecurityHeaders(true);
    const values = Object.fromEntries(headers.map(({ key, value }) => [key, value]));

    expect(values['X-Content-Type-Options']).toBe('nosniff');
    expect(values['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
    expect(values['Permissions-Policy']).toContain('camera=()');
    expect(values['X-Frame-Options']).toBe('DENY');
    expect(values['Strict-Transport-Security']).toContain('max-age=');
    expect(values['Content-Security-Policy']).toContain("frame-ancestors 'none'");
    expect(values['Content-Security-Policy']).not.toContain('unsafe-inline');
  });

  it('limits development-only CSP relaxations to development', () => {
    const headers = getSecurityHeaders(false);
    const contentSecurityPolicy = headers.find(
      ({ key }) => key === 'Content-Security-Policy',
    )?.value;

    expect(contentSecurityPolicy).toContain('unsafe-eval');
    expect(headers.some(({ key }) => key === 'Strict-Transport-Security')).toBe(false);
  });

  it('allows development inline styles without a style nonce', () => {
    const contentSecurityPolicy = getContentSecurityPolicy(false, 'development-nonce');
    const styleSource = contentSecurityPolicy
      .split('; ')
      .find((directive) => directive.startsWith('style-src '));
    const scriptSource = contentSecurityPolicy
      .split('; ')
      .find((directive) => directive.startsWith('script-src '));

    expect(styleSource).toBe("style-src 'self' 'unsafe-inline'");
    expect(styleSource).not.toContain('nonce-');
    expect(scriptSource).toContain("'nonce-development-nonce'");
  });

  it('keeps production inline styles nonce-bound', () => {
    const contentSecurityPolicy = getContentSecurityPolicy(true, 'production-nonce');
    const styleSource = contentSecurityPolicy
      .split('; ')
      .find((directive) => directive.startsWith('style-src '));

    expect(styleSource).toBe("style-src 'self' 'nonce-production-nonce'");
    expect(styleSource).not.toContain('unsafe-inline');
  });
});
