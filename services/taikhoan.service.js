// services/taikhoan.service.js
import httpErrors from "http-errors";
import { taikhoanRepository } from "../repositories/taikhoan.repository.js";
import { TaiKhoanDTO } from "../dtos/taikhoans/taikhoan.dto.js";

export const taikhoanService = {
  login: async (email, mat_khau) => {
    const user = await taikhoanRepository.findByCredentials(email, mat_khau);
    
    if (!user) {
      throw httpErrors(401, "Email hoặc mật khẩu không chính xác!");
    }

    return new TaiKhoanDTO(user);
  }
};