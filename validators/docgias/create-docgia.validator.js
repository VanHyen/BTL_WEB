import { z } from "zod";
export const createDocGiaSchema = z.object({
  ma_dg: z.number().int().positive(),
  ten_dg: z.string().min(1).max(255),
  dia_chi: z.string().optional(),
  dien_thoai: z.string().optional(),
});