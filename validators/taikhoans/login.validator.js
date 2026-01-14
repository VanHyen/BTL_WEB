import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email không đúng định dạng!").min(1, "Email không được để trống"),
  mat_khau: z.string().min(1, "Mật khẩu không được để trống")
});