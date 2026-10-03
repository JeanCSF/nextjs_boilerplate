import { z } from 'zod';

export const exampleSchema = z.object({
  value: z.string().trim().min(1).max(120),
});
