export type SecurityHeader = {
  key: string;
  value: string;
};

export function getContentSecurityPolicy(isProduction: boolean, nonce?: string): string {
  const scriptSources = [
    "'self'",
    ...(nonce ? [`'nonce-${nonce}'`, "'strict-dynamic'"] : []),
    ...(!isProduction ? ["'unsafe-eval'", ...(!nonce ? ["'unsafe-inline'"] : [])] : []),
  ].join(' ');
  const styleSources = [
    "'self'",
    ...(isProduction && nonce ? [`'nonce-${nonce}'`] : []),
    ...(!isProduction ? ["'unsafe-inline'"] : []),
  ].join(' ');

  return [
    "default-src 'self'",
    `script-src ${scriptSources}`,
    `style-src ${styleSources}`,
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src 'self'${isProduction ? '' : ' ws: wss:'}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isProduction ? ['upgrade-insecure-requests'] : []),
  ].join('; ');
}

export function getSecurityHeaders(isProduction: boolean): SecurityHeader[] {
  const contentSecurityPolicy = getContentSecurityPolicy(isProduction);

  return [
    { key: 'Content-Security-Policy', value: contentSecurityPolicy },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    {
      key: 'Permissions-Policy',
      value: 'camera=(), geolocation=(), microphone=(), payment=(), usb=()',
    },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
    { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
    ...(isProduction
      ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' }]
      : []),
  ];
}
