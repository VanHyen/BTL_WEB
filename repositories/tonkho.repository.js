// repositories/tonkho.repository.js
import { pool } from "../config/database.js";

const tonKhoRepository = {
  getAll: async () => {
    const [rows] = await pool.query(`
      SELECT
        s.ma_sach,
        s.ten_sach,
        s.gia_nhap,
        s.gia_bia,
        COALESCE(nhap.sl_nhap, 0) - COALESCE(muon.sl_muon, 0) AS ton_kho
      FROM Sach s
      LEFT JOIN (
        SELECT ma_sach, SUM(so_luong) AS sl_nhap
        FROM PhieuNhap
        GROUP BY ma_sach
      ) nhap ON s.ma_sach = nhap.ma_sach
      LEFT JOIN (
        SELECT ma_sach, SUM(so_luong) AS sl_muon
        FROM ChiTiet_PhieuMuon
        GROUP BY ma_sach
      ) muon ON s.ma_sach = muon.ma_sach
    `);
    return rows;
  },

  getTonKhoBySach: async (ma_sach) => {
    const [rows] = await pool.query(
      `
      SELECT
        COALESCE(nhap.sl_nhap, 0) - COALESCE(muon.sl_muon, 0) AS ton_kho
      FROM Sach s
      LEFT JOIN (
        SELECT ma_sach, SUM(so_luong) AS sl_nhap
        FROM PhieuNhap
        GROUP BY ma_sach
      ) nhap ON s.ma_sach = nhap.ma_sach
      LEFT JOIN (
        SELECT ma_sach, SUM(so_luong) AS sl_muon
        FROM ChiTiet_PhieuMuon
        GROUP BY ma_sach
      ) muon ON s.ma_sach = muon.ma_sach
      WHERE s.ma_sach = ?
      `,
      [ma_sach]
    );

    return Number(rows[0]?.ton_kho ?? 0);
  }
};

export default tonKhoRepository;