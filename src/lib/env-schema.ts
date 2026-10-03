import { z } from 'zod';

const environmentSchema = z.object({
  APP_URL: z
    .string()
    .url()
    .refine((value) => ['http:', 'https:'].includes(new URL(value).protocol)),
});

export function parseEnvironment(source: Record<string, string | undefined>) {
  return environmentSchema.parse({ APP_URL: source['APP_URL'] });
}
