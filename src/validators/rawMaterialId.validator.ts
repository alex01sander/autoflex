import { z } from "zod";

export const rawMaterialIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});
