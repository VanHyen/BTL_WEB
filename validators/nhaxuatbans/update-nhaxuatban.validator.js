// validators/nhaxuatbans/update-nhaxuatban.validator.js
import { z } from "zod";
export const updateNhaXuatBanSchema = z.object({
  ten_nxb: z.string().min(1).optional(),
  dia_chi: z.string().min(1).optional(),
  dien_thoai: z.string().min(1).optional(),
  email: z.string().email().optional(),
});