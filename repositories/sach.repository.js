// repositories/sach.repository.js
import { pool } from "../config/database.js";

export const sachRepository = {
  getAll: async () => {
    const con = await pool.getConnection();
    try {
      const [rows] = await con.execute("SELECT * FROM Sach;");
      return rows;
    } finally {
      con.release();
    }
  },

  getById: async (ma_sach) => {
    const con = await pool.getConnection();
    try {
      const [rows] = await con.execute("SELECT * FROM Sach WHERE ma_sach = ?", [ma_sach]);
      return rows[0];
    } finally {
      con.release();
    }
  },

  getByTheLoai: async (ma_the_loai) => {
    const con = await pool.getConnection();
    try {
      const [rows] = await con.execute(`
        SELECT s.*, tl.ten_the_loai, nxb.ten_nxb
        FROM Sach s
        JOIN TheLoai tl ON s.ma_the_loai = tl.ma_the_loai
        JOIN NhaXuatBan nxb ON s.ma_nxb = nxb.ma_nxb
        WHERE s.ma_the_loai = ?
      `, [ma_the_loai]);
      return rows;
    } finally {
      con.release();
    }
  },

  getDaMuonTheoDocGia: async (ma_dg) => {
    const con = await pool.getConnection();
    try {
      const [rows] = await con.execute(`
        SELECT 
          s.ma_sach, s.ten_sach, s.gia_bia, s.tac_gia,
          tl.ten_the_loai,
          pm.ma_pm, pm.ngay_muon, pm.tong_tien_coc,
          dg.ten_dg,
          ctpm.so_luong, ctpm.don_gia_coc
        FROM ChiTiet_PhieuMuon ctpm
        JOIN PhieuMuon pm ON ctpm.ma_pm = pm.ma_pm
        JOIN Sach s ON ctpm.ma_sach = s.ma_sach
        JOIN DocGia dg ON pm.ma_dg = dg.ma_dg
        JOIN TheLoai tl ON s.ma_the_loai = tl.ma_the_loai
        WHERE dg.ma_dg = ?
        ORDER BY pm.ngay_muon DESC
      `, [ma_dg]);
      return rows;
    } finally {
      con.release();
    }
  },

  existsById: async (ma_sach) => {
    const con = await pool.getConnection();
    try {
      const [rows] = await con.execute("SELECT ma_sach FROM Sach WHERE ma_sach=?", [ma_sach]);
      return rows.length > 0;
    } finally {
      con.release();
    }
  },

  checkTheLoai: async (ma_tl) => {
    const con = await pool.getConnection();
    try {
      const [rows] = await con.execute("SELECT ma_the_loai FROM TheLoai WHERE ma_the_loai=?", [ma_tl]);
      return rows.length > 0;
    } finally {
      con.release();
    }
  },

  checkNXB: async (ma_nxb) => {
    const con = await pool.getConnection();
    try {
      const [rows] = await con.execute("SELECT ma_nxb FROM NhaXuatBan WHERE ma_nxb=?", [ma_nxb]);
      return rows.length > 0;
    } finally {
      con.release();
    }
  },

  create: async (payload) => {
    const con = await pool.getConnection();
    try {
      await con.execute(`
        INSERT INTO Sach
        (ma_sach, ten_sach, tac_gia, ma_the_loai, ma_nxb, gia_bia, gia_nhap, so_luong_ton, mo_ta)
        VALUES (?,?,?,?,?,?,?,?,?)
      `, [
        payload.ma_sach, payload.ten_sach, payload.tac_gia,
        payload.ma_the_loai, payload.ma_nxb, payload.gia_bia,
        payload.gia_nhap, payload.so_luong_ton, payload.mo_ta
      ]);
    } finally {
      con.release();
    }
  },

  update: async (payload) => {
    const { ma_sach, ...fields } = payload;
    const keys = Object.keys(fields);
    if (keys.length === 0) return 0;
    const setClause = keys.map(k => `${k} = ?`).join(", ");
    const values = keys.map(k => fields[k]);

    const con = await pool.getConnection();
    try {
      const [result] = await con.execute(
        `UPDATE Sach SET ${setClause} WHERE ma_sach = ?`,
        [...values, ma_sach]
      );
      return result.affectedRows;
    } finally {
      con.release();
    }
  },

  existsInPhieuMuon: async (ma_sach) => {
    const con = await pool.getConnection();
    try {
      const [rows] = await con.execute("SELECT 1 FROM ChiTiet_PhieuMuon WHERE ma_sach = ? LIMIT 1", [ma_sach]);
      return rows.length > 0;
    } finally {
      con.release();
    }
  },

  deleteById: async (ma_sach) => {
    const con = await pool.getConnection();
    try {
      const [result] = await con.execute("DELETE FROM Sach WHERE ma_sach = ?", [ma_sach]);
      return result.affectedRows;
    } finally {
      con.release();
    }
  }
};