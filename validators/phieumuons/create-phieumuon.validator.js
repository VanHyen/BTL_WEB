import { z } from "zod";
export const createPhieuMuonSchema = z.object({
  ma_pm: z.number().int().positive(),
  ma_dg: z.number().int().positive(),
  ngay_muon: z.string(), // ISO String or YYYY-MM-DD
  tong_tien_coc: z.number().optional(),
});