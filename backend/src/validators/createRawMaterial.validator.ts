import { z } from "zod";

export const createRawMaterialSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  stockQuantity: z.number().int().nonnegative(),
});

export const updateRawMaterialSchema = createRawMaterialSchema;

export type CreateRawMaterialDTO = z.infer<typeof createRawMaterialSchema>;
export type UpdateRawMaterialDTO = z.infer<typeof updateRawMaterialSchema>;
