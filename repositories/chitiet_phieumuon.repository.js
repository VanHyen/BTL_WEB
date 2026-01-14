// repositories/chitiet_phieumuon.repository.js
import { pool } from "../config/database.js";

export const chiTietPhieuMuonRepository = {
  getAll: async () => {
    const [rows] = await pool.query(`
      SELECT
        ctpm.ma_ctpm, ctpm.ma_pm, ctpm.ma_sach,
        s.ten_sach, ctpm.so_luong, ctpm.don_gia_coc,
        (ctpm.so_luong * ctpm.don_gia_coc) AS thanh_tien_coc
      FROM ChiTiet_PhieuMuon ctpm
      JOIN Sach s ON ctpm.ma_sach = s.ma_sach
    `);
    return rows;
  },

  getById: async (ma_ctpm) => {
    const [rows] = await pool.query(
      "SELECT * FROM ChiTiet_PhieuMuon WHERE ma_ctpm = ?",
      [ma_ctpm]
    );
    return rows[0];
  },

  existsPhieuMuon: async (ma_pm) => {
    const [rows] = await pool.query(
      "SELECT ma_pm FROM PhieuMuon WHERE ma_pm = ?",
      [ma_pm]
    );
    return rows.length > 0;
  },

  existsSach: async (ma_sach) => {
    const [rows] = await pool.query(
      "SELECT ma_sach FROM Sach WHERE ma_sach = ?",
      [ma_sach]
    );
    return rows.length > 0;
  },

  create: async ({ ma_ctpm, ma_pm, ma_sach, so_luong, don_gia_coc }) => {
    await pool.query(
      `INSERT INTO ChiTiet_PhieuMuon
       (ma_ctpm, ma_pm, ma_sach, so_luong, don_gia_coc)
       VALUES (?,?,?,?,?)`,
      [ma_ctpm, ma_pm, ma_sach, so_luong, don_gia_coc]
    );
  },

  update: async (payload) => {
    const { ma_ctpm, ...fields } = payload;
    const keys = Object.keys(fields);
    if (keys.length === 0) return 0;

    const setClause = keys.map(k => `${k} = ?`).join(", ");
    const values = keys.map(k => fields[k]);

    const [result] = await pool.execute(
      `UPDATE ChiTiet_PhieuMuon SET ${setClause} WHERE ma_ctpm = ?`,
      [...values, ma_ctpm]
    );
    return result.affectedRows;
  },

  deleteById: async (ma_ctpm) => {
    const [result] = await pool.execute(
      "DELETE FROM ChiTiet_PhieuMuon WHERE ma_ctpm = ?",
      [ma_ctpm]
    );
    return result.affectedRows;
  }
};