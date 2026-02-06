import { z } from "zod";

export const createProductSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  price: z.number().positive(),
});

export type CreateProductDTO = z.infer<typeof createProductSchema>;
