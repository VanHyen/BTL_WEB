// repositories/nhaxuatban.repository.js
import { pool } from "../config/database.js";
import { logger } from "../config/logger.js";

export const nhaXuatBanRepository = {
  getAll: async () => {
    logger.info("Repository: Fetch all NhaXuatBan");
    const [rows] = await pool.query("SELECT * FROM NhaXuatBan");
    return rows;
  },

  getById: async (ma_nxb) => {
    const [rows] = await pool.query(
      "SELECT * FROM NhaXuatBan WHERE ma_nxb = ?",
      [ma_nxb]
    );
    return rows[0];
  },

  existsById: async (ma_nxb) => {
    const [rows] = await pool.query(
      "SELECT ma_nxb FROM NhaXuatBan WHERE ma_nxb = ?",
      [ma_nxb]
    );
    return rows.length > 0;
  },

  create: async ({ ma_nxb, ten_nxb, dien_thoai, dia_chi, email }) => {
    await pool.query(
      `INSERT INTO NhaXuatBan(ma_nxb, ten_nxb, dien_thoai, dia_chi, email)
       VALUES (?,?,?,?,?)`,
      [ma_nxb, ten_nxb, dien_thoai, dia_chi, email]
    );
  },

  update: async ({ ma_nxb, ten_nxb, dia_chi, dien_thoai, email }) => {
    const fields = [];
    const values = [];

    if (ten_nxb !== undefined) { fields.push("ten_nxb = ?"); values.push(ten_nxb); }
    if (dia_chi !== undefined) { fields.push("dia_chi = ?"); values.push(dia_chi); }
    if (dien_thoai !== undefined) { fields.push("dien_thoai = ?"); values.push(dien_thoai); }
    if (email !== undefined) { fields.push("email = ?"); values.push(email); }

    if (fields.length === 0) return 0;

    const sql = `UPDATE NhaXuatBan SET ${fields.join(", ")} WHERE ma_nxb = ?`;
    values.push(ma_nxb);

    const [result] = await pool.query(sql, values);
    return result.affectedRows;
  },

  existsInSach: async (ma_nxb) => {
    const [rows] = await pool.execute(
      "SELECT 1 FROM Sach WHERE ma_nxb = ? LIMIT 1",
      [ma_nxb]
    );
    return rows.length > 0;
  },

  existsInPhieuNhap: async (ma_nxb) => {
    const [rows] = await pool.execute(
      "SELECT 1 FROM PhieuNhap WHERE ma_nxb = ? LIMIT 1",
      [ma_nxb]
    );
    return rows.length > 0;
  },

  deleteById: async (ma_nxb) => {
    const [result] = await pool.execute(
      "DELETE FROM NhaXuatBan WHERE ma_nxb = ?",
      [ma_nxb]
    );
    return result.affectedRows;
  },
};