import { z } from "zod";
export const updateTheLoaiSchema = z.object({
  ma_the_loai: z.number().int().positive(),
  ten_the_loai: z.string().min(1).optional(),
  mo_ta: z.string().optional(),
});