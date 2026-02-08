import { z } from "zod";

export const createProductMaterialSchema = z.object({
  productId: z.number().int().positive(),
  rawMaterialId: z.number().int().positive(),
  requiredQuantity: z.number().int().positive(), // CORRIGIDO
});

export const updateProductMaterialSchema = createProductMaterialSchema;

export type CreateProductMaterialDTO = z.infer<
  typeof createProductMaterialSchema
>;
export type UpdateProductMaterialDTO = z.infer<
  typeof updateProductMaterialSchema
>;
