// repositories/docgia.repository.js
import { pool } from "../config/database.js";
import { logger } from "../config/logger.js";

export const docGiaRepository = {
  getAll: async () => {
    logger.info("Repository: Fetching all DocGia");
    const [rows] = await pool.query("SELECT * FROM DocGia");
    return rows;
  },

  getById: async (ma_dg) => {
    const [rows] = await pool.query(
      "SELECT * FROM DocGia WHERE ma_dg = ?",
      [ma_dg]
    );
    return rows[0];
  },

  existsById: async (ma_dg) => {
    const [rows] = await pool.query(
      "SELECT ma_dg FROM DocGia WHERE ma_dg = ?",
      [ma_dg]
    );
    return rows.length > 0;
  },

  create: async ({ ma_dg, ten_dg, dia_chi, dien_thoai }) => {
    await pool.query(
      `INSERT INTO DocGia(ma_dg, ten_dg, dia_chi, dien_thoai)
       VALUES (?,?,?,?)`,
      [ma_dg, ten_dg, dia_chi, dien_thoai]
    );
  },

  update: async ({ ma_dg, ten_dg, dia_chi, dien_thoai }) => {
    const fields = [];
    const values = [];

    if (ten_dg !== undefined) { fields.push("ten_dg = ?"); values.push(ten_dg); }
    if (dia_chi !== undefined) { fields.push("dia_chi = ?"); values.push(dia_chi); }
    if (dien_thoai !== undefined) { fields.push("dien_thoai = ?"); values.push(dien_thoai); }

    if (fields.length === 0) return 0;

    const sql = `UPDATE DocGia SET ${fields.join(", ")} WHERE ma_dg = ?`;
    values.push(ma_dg);

    const [result] = await pool.query(sql, values);
    return result.affectedRows;
  },

  existsInPhieuMuon: async (ma_dg) => {
    const [rows] = await pool.execute(
      "SELECT 1 FROM PhieuMuon WHERE ma_dg = ? LIMIT 1",
      [ma_dg]
    );
    return rows.length > 0;
  },

  deleteById: async (ma_dg) => {
    const [result] = await pool.execute(
      "DELETE FROM DocGia WHERE ma_dg = ?",
      [ma_dg]
    );
    return result.affectedRows;
  },
};