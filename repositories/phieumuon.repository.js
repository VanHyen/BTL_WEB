// repositories/phieumuon.repository.js
import { pool } from "../config/database.js";

export const phieuMuonRepository = {
  getAll: async () => {
    const [rows] = await pool.query(`
      SELECT pm.*, dg.ten_dg
      FROM PhieuMuon pm
      JOIN DocGia dg ON pm.ma_dg = dg.ma_dg
    `);
    return rows;
  },

  getById: async (ma_pm) => {
    const [rows] = await pool.query(
      "SELECT * FROM PhieuMuon WHERE ma_pm = ?",
      [ma_pm]
    );
    return rows[0];
  },

  getByDocGia: async (ma_dg) => {
    const [rows] = await pool.query(
      `SELECT pm.*, dg.ten_dg
       FROM PhieuMuon pm
       JOIN DocGia dg ON pm.ma_dg = dg.ma_dg
       WHERE pm.ma_dg = ?`,
      [ma_dg]
    );
    return rows;
  },

  getByMonthYear: async (thang, nam) => {
    const [rows] = await pool.query(
      `SELECT pm.*, dg.ten_dg
       FROM PhieuMuon pm
       JOIN DocGia dg ON pm.ma_dg = dg.ma_dg
       WHERE MONTH(pm.ngay_muon)=? AND YEAR(pm.ngay_muon)=?
       ORDER BY pm.ngay_muon ASC`,
      [thang, nam]
    );
    return rows;
  },

  existsById: async (ma_pm) => {
    const [rows] = await pool.query(
      "SELECT ma_pm FROM PhieuMuon WHERE ma_pm = ?",
      [ma_pm]
    );
    return rows.length > 0;
  },

  create: async ({ ma_pm, ma_dg, ngay_muon, tong_tien_coc }) => {
    await pool.query(
      `INSERT INTO PhieuMuon(ma_pm, ma_dg, ngay_muon, tong_tien_coc)
       VALUES (?,?,?,?)`,
      [ma_pm, ma_dg, ngay_muon, tong_tien_coc]
    );
  },

  getChiTietByMaPM: async (ma_pm) => {
    const [rows] = await pool.query(
      `SELECT 
        ctpm.ma_ctpm, ctpm.ma_sach, s.ten_sach,
        ctpm.so_luong, ctpm.don_gia_coc,
        (ctpm.so_luong * ctpm.don_gia_coc) AS thanh_tien
       FROM ChiTiet_PhieuMuon ctpm
       JOIN Sach s ON ctpm.ma_sach = s.ma_sach
       WHERE ctpm.ma_pm = ?`,
      [ma_pm]
    );
    return rows;
  },

  getLichSuMuonTheoDG: async (ma_dg) => {
    const [rows] = await pool.query(
      `
      SELECT
        s.ma_sach      AS MaSach,
        s.ten_sach     AS TenSach,
        ctpm.so_luong  AS SoLuong,
        DATE_FORMAT(pm.ngay_muon, '%d/%m/%Y') AS NgayMuon
      FROM PhieuMuon pm
      JOIN ChiTiet_PhieuMuon ctpm ON pm.ma_pm = ctpm.ma_pm
      JOIN Sach s ON ctpm.ma_sach = s.ma_sach
      WHERE pm.ma_dg = ?
      ORDER BY pm.ngay_muon DESC
      `,
      [ma_dg]
    );
    return rows;
  },

  updateTongTienCocByMaPM: async (ma_pm) => {
    const [rows] = await pool.query(
      `SELECT SUM(so_luong * don_gia_coc) AS tong FROM ChiTiet_PhieuMuon WHERE ma_pm = ?`,
      [ma_pm]
    );
    const tongTienCoc = rows[0].tong || 0;
    await pool.query(
      `UPDATE PhieuMuon SET tong_tien_coc = ? WHERE ma_pm = ?`,
      [tongTienCoc, ma_pm]
    );
    return tongTienCoc;
  },

  existsInChiTiet: async (ma_pm) => {
    const [rows] = await pool.execute(
      "SELECT 1 FROM ChiTiet_PhieuMuon WHERE ma_pm = ? LIMIT 1",
      [ma_pm]
    );
    return rows.length > 0;
  },

  deleteById: async (ma_pm) => {
    const [result] = await pool.execute(
      "DELETE FROM PhieuMuon WHERE ma_pm = ?",
      [ma_pm]
    );
    return result.affectedRows;
  }
};