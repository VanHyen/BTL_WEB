import { z } from "zod";

export const updateCTPhieuMuonSchema = z.object({
  ma_pm: z.number().int().positive("Mã phiếu mượn không hợp lệ").optional(),
  ma_sach: z.number().int().positive("Mã sách không hợp lệ").optional(),
  so_luong: z.number().int().positive("Số lượng phải lớn hơn 0").optional(),
  don_gia_coc: z.number().positive("Đơn giá cọc phải lớn hơn 0").optional(),
});