// repositories/theloai.repository.js
import { pool } from "../config/database.js";
import { logger } from "../config/logger.js";

export const theLoaiRepository = {
  getAll: async () => {
    logger.info("Repository: Lấy tất cả thể loại");
    const con = await pool.getConnection();
    try {
      const [rows] = await con.execute("SELECT * FROM TheLoai;");
      return rows;
    } finally {
      con.release();
    }
  },

  getById: async (maTheLoai) => {
    const con = await pool.getConnection();
    try {
      const [rows] = await con.execute(
        "SELECT * FROM TheLoai WHERE ma_the_loai = ?",
        [maTheLoai]
      );
      return rows[0];
    } finally {
      con.release();
    }
  },

  existsById: async (maTheLoai) => {
    const con = await pool.getConnection();
    try {
      const [rows] = await con.execute(
        "SELECT ma_the_loai FROM TheLoai WHERE ma_the_loai = ?",
        [maTheLoai]
      );
      return rows.length > 0;
    } finally {
      con.release();
    }
  },

  create: async ({ ma_the_loai, ten_the_loai, mo_ta }) => {
    const con = await pool.getConnection();
    try {
      await con.execute(
        "INSERT INTO TheLoai(ma_the_loai, ten_the_loai, mo_ta) VALUES (?,?,?)",
        [ma_the_loai, ten_the_loai, mo_ta]
      );
    } finally {
      con.release();
    }
  },

  update: async ({ ma_the_loai, ten_the_loai, mo_ta }) => {
    const fields = [];
    const values = [];

    if (ten_the_loai !== undefined) {
      fields.push("ten_the_loai = ?");
      values.push(ten_the_loai);
    }

    if (mo_ta !== undefined) {
      fields.push("mo_ta = ?");
      values.push(mo_ta);
    }

    const sql = `UPDATE TheLoai SET ${fields.join(", ")} WHERE ma_the_loai = ?`;
    values.push(ma_the_loai);

    const [result] = await pool.query(sql, values);
    return result.affectedRows;
  },

  existsInSach: async (ma_the_loai) => {
    const con = await pool.getConnection();
    try {
      const [rows] = await con.execute(
        "SELECT 1 FROM Sach WHERE ma_the_loai = ? LIMIT 1",
        [ma_the_loai]
      );
      return rows.length > 0;
    } finally {
      con.release();
    }
  },

  deleteById: async (ma_the_loai) => {
    const con = await pool.getConnection();
    try {
      const [result] = await con.execute(
        "DELETE FROM TheLoai WHERE ma_the_loai = ?",
        [ma_the_loai]
      );
      return result.affectedRows;
    } finally {
      con.release();
    }
  },
};