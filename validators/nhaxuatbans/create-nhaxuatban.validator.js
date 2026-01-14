// validators/nhaxuatbans/create-nhaxuatban.validator.js
import { z } from "zod";
export const createNhaXuatBanSchema = z.object({
  ma_nxb: z.number().int().positive(),
  ten_nxb: z.string().min(1),
  dien_thoai: z.string().min(5),
  dia_chi: z.string().min(1),
  email: z.string().email(),
});