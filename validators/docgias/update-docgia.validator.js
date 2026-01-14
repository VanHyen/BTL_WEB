import { z } from "zod";
export const updateDocGiaSchema = z.object({
  ten_dg: z.string().min(1, "Tên độc giả không được rỗng").optional(),
  dia_chi: z.string().min(1, "Địa chỉ không được rỗng").optional(),
  dien_thoai: z.string().min(1, "Điện thoại không được rỗng").optional(),
});