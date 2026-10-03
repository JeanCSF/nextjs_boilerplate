import { describe, expect, it } from 'vitest';
import { parseEnvironment } from '../../src/lib/env-schema';

describe('parseEnvironment', () => {
  it('accepts an HTTP or HTTPS application origin', () => {
    expect(parseEnvironment({ APP_URL: 'https://example.test' })).toEqual({
      APP_URL: 'https://example.test',
    });
  });

  it('rejects missing and malformed required values', () => {
    expect(() => parseEnvironment({})).toThrow();
    expect(() => parseEnvironment({ APP_URL: 'not a URL' })).toThrow();
    expect(() => parseEnvironment({ APP_URL: 'ftp://example.test' })).toThrow();
  });
});
