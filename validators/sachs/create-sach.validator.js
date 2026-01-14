import { z } from "zod";
export const createSachSchema = z.object({
  ma_sach: z.number().int().positive(),
  ten_sach: z.string().min(1),
  tac_gia: z.string().min(1),
  ma_the_loai: z.number().int().positive(),
  ma_nxb: z.number().int().positive(),
  gia_bia: z.number().nonnegative(),
  gia_nhap: z.number().nonnegative(),
  so_luong_ton: z.number().int().nonnegative(),
  mo_ta: z.string().optional().nullable(),
});