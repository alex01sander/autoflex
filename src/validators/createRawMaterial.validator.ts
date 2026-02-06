import { z } from "zod";

export const createRawMaterialSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  stockQuantity: z.number().int().nonnegative(),
});

export type CreateRawMaterialDTO = z.infer<typeof createRawMaterialSchema>;
