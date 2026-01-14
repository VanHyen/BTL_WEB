import { z } from "zod";

export const createPhieuNhapSchema = z.object({
  ma_pn: z.number().int().positive(),
  ma_nxb: z.number().int().positive(),
  ma_sach: z.number().int().positive(),
  ngay_nhap: z.string(),
  so_luong: z.number().int().positive("Số lượng nhập phải > 0"),
  don_gia_nhap: z.number().positive("Giá nhập phải > 0")
});