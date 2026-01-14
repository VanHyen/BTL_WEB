import { z } from "zod";
export const createTheLoaiSchema = z.object({
  ma_the_loai: z.number().int().positive(),
  ten_the_loai: z.string().min(1),
  mo_ta: z.string().optional().nullable(),
});