import { z } from "zod";
export const createChiTietPhieuMuonSchema = z.object({
  ma_ctpm: z.number().int().positive(),
  ma_pm: z.number().int().positive(),
  ma_sach: z.number().int().positive(),
  so_luong: z.number().int().positive(),
  don_gia_coc: z.number().positive(),
});