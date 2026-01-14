import { z } from "zod";
export const updateSachSchema = z.object({
  ten_sach: z.string().min(1).optional(),
  tac_gia: z.string().min(1).optional(),
  ma_the_loai: z.number().int().positive().optional(),
  ma_nxb: z.number().int().positive().optional(),
  gia_bia: z.number().positive().optional(),
  gia_nhap: z.number().positive().optional(),
  mo_ta: z.string().optional(),
});