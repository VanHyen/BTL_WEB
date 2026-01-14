import { z } from "zod";
export const updatePhieuMuonSchema = z.object({
  ma_dg: z.number().int().positive().optional(),
  ngay_muon: z.string().optional(),
  tong_tien_coc: z.number().nonnegative().optional(),
});