// controllers/dangnhap.controller.js
import { taikhoanService } from "../services/taikhoan.service.js";
import { loginSchema } from "../validators/taikhoans/login.validator.js";

export const dangnhapController = {
  dangNhap: async (req, res, next) => {
    try {
      // 1. Validate dữ liệu đầu vào (email có đúng định dạng không, có trống không)
      const payload = loginSchema.parse(req.body);

      // 2. Gọi service xử lý
      const userData = await taikhoanService.login(payload.email, payload.mat_khau);

      // 3. Trả về kết quả thành công
      res.json({
        success: true,
        message: "Đăng nhập thành công!",
        data: userData
      });
    } catch (error) {
      // Nếu là lỗi validation từ Zod, trả về 400
      if (error.errors) {
        return res.status(400).json({ success: false, message: error.errors[0].message });
      }
      next(error);
    }
  }
};