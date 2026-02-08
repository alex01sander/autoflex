import { z } from "zod";

export const createProductSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  price: z.number().positive(),
});

export const updateProductSchema = createProductSchema;

export type CreateProductDTO = z.infer<typeof createProductSchema>;
export type UpdateProductDTO = z.infer<typeof updateProductSchema>;
