import { describe, expect, it } from 'vitest';
import { exampleSchema } from '../../src/lib/example-schema';

describe('exampleSchema', () => {
  it('accepts a bounded, non-empty value', () => {
    expect(exampleSchema.parse({ value: '  sample  ' })).toEqual({ value: 'sample' });
  });

  it('rejects blank values and values over the input limit', () => {
    expect(exampleSchema.safeParse({ value: '   ' }).success).toBe(false);
    expect(exampleSchema.safeParse({ value: 'x'.repeat(121) }).success).toBe(false);
  });
});
