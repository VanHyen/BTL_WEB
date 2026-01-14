import { z } from "zod";

export const updatePhieuNhapSchema = z.object({
  ma_nxb: z.number().int().positive().optional(),
  ma_sach: z.number().int().positive().optional(),
  ngay_nhap: z.string().optional(),
  so_luong: z.number().int().positive().optional(),
  don_gia_nhap: z.number().positive().optional()
});