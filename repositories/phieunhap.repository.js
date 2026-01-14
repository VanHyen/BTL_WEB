// repositories/phieunhap.repository.js
import { pool } from "../config/database.js";

export const phieuNhapRepository = {
  getAll: async () => {
    const [rows] = await pool.query(`
      SELECT pn.*, nxb.ten_nxb, s.ten_sach
      FROM PhieuNhap pn
      JOIN NhaXuatBan nxb ON pn.ma_nxb = nxb.ma_nxb
      JOIN Sach s ON pn.ma_sach = s.ma_sach
      ORDER BY pn.ngay_nhap DESC
    `);
    return rows;
  },

  existsById: async (ma_pn) => {
    const [rows] = await pool.query("SELECT ma_pn FROM PhieuNhap WHERE ma_pn = ?", [ma_pn]);
    return rows.length > 0;
  },

  // Tạo phiếu nhập và đồng thời cập nhật kho
  create: async (data) => {
    const con = await pool.getConnection();
    try {
      await con.beginTransaction(); // Dùng transaction để đảm bảo an toàn dữ liệu

      // 1. Thêm bản ghi vào PhieuNhap
      await con.execute(
        `INSERT INTO PhieuNhap (ma_pn, ma_nxb, ma_sach, ngay_nhap, so_luong, don_gia_nhap) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [data.ma_pn, data.ma_nxb, data.ma_sach, data.ngay_nhap, data.so_luong, data.don_gia_nhap]
      );

      // 2. Cập nhật cộng thêm số lượng tồn vào bảng Sach
      await con.execute(
        "UPDATE Sach SET so_luong_ton = so_luong_ton + ? WHERE ma_sach = ?",
        [data.so_luong, data.ma_sach]
      );

      await con.commit();
    } catch (error) {
      await con.rollback();
      throw error;
    } finally {
      con.release();
    }
  },

  deleteById: async (ma_pn) => {
    const [result] = await pool.execute("DELETE FROM PhieuNhap WHERE ma_pn = ?", [ma_pn]);
    return result.affectedRows;
  },
  getById: async (ma_pn) => {
    const [rows] = await pool.query("SELECT * FROM PhieuNhap WHERE ma_pn = ?", [ma_pn]);
    return rows[0];
  },

  update: async (ma_pn, oldData, newData) => {
    const con = await pool.getConnection();
    try {
      await con.beginTransaction();

      // 1. Hoàn tác số lượng cũ trong kho của sách cũ
      await con.execute(
        "UPDATE Sach SET so_luong_ton = so_luong_ton - ? WHERE ma_sach = ?",
        [oldData.so_luong, oldData.ma_sach]
      );

      // 2. Cập nhật thông tin phiếu nhập mới
      const fields = [];
      const values = [];
      Object.keys(newData).forEach(key => {
        fields.push(`${key} = ?`);
        values.push(newData[key]);
      });
      
      await con.execute(
        `UPDATE PhieuNhap SET ${fields.join(", ")} WHERE ma_pn = ?`,
        [...values, ma_pn]
      );

      // 3. Lấy thông tin mới nhất (sau khi gộp newData vào oldData) để cập nhật kho mới
      const updatedMaSach = newData.ma_sach || oldData.ma_sach;
      const updatedSoLuong = newData.so_luong !== undefined ? newData.so_luong : oldData.so_luong;

      await con.execute(
        "UPDATE Sach SET so_luong_ton = so_luong_ton + ? WHERE ma_sach = ?",
        [updatedSoLuong, updatedMaSach]
      );

      await con.commit();
      return true;
    } catch (error) {
      await con.rollback();
      throw error;
    } finally {
      con.release();
    }
  },
};