import { z } from "zod";

export const productIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type ProductIdParams = z.infer<typeof productIdSchema>;
