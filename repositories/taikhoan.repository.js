// repositories/taikhoan.repository.js
import { pool } from "../config/database.js";

export const taikhoanRepository = {
  // Tìm kiếm tài khoản khớp email và mật khẩu
  findByCredentials: async (email, mat_khau) => {
    const [rows] = await pool.query(
      "SELECT id, email, role FROM TaiKhoan WHERE email = ? AND mat_khau = ?",
      [email, mat_khau]
    );
    return rows[0];
  }
};