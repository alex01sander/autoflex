import { z } from "zod";

export const createProductMaterialSchema = z.object({
  productId: z.number().int().positive(),
  rawMaterialId: z.number().int().positive(),
  requiredQuantity: z.number().int().positive(), // CORRIGIDO
});

export type CreateProductMaterialDTO = z.infer<
  typeof createProductMaterialSchema
>;
