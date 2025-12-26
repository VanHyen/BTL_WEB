import { pool } from "../config/database.js";
import { logger } from "../config/logger.js";

export const bookRepository = {
  getAll: async () => {
    logger.info("Repository: Fetching all books");
    const db = await pool;
    const [rows] = await db.query(`
      SELECT b.*, d.TenDanhMuc 
      FROM books b 
      LEFT JOIN danhmucs d ON b.category_id = d.id`);
    return rows;
  },

  getById: async (id) => {
    const db = await pool;
    const [rows] = await db.query("SELECT * FROM books WHERE id = ?", [id]);
    return rows[0];
  },

  create: async (data) => {
    const db = await pool;
    const [result] = await db.query(
      "INSERT INTO books (title, author, total_copies, available_copies, category_id) VALUES (?, ?, ?, ?, ?)",
      [data.title, data.author, data.total_copies, data.total_copies, data.category_id]
    );
    return { id: result.insertId, ...data };
  },

  update: async (id, data) => {
    const db = await pool;
    await db.query(
      "UPDATE books SET title = ?, author = ?, total_copies = ?, category_id = ? WHERE id = ?",
      [data.title, data.author, data.total_copies, data.category_id, id]
    );
    return { id, ...data };
  },

  delete: async (id) => {
    const db = await pool;
    await db.query("DELETE FROM books WHERE id = ?", [id]);
    return true;
  },
  getByTitle: async (title) => {
        const db = await pool;
        const [rows] = await db.query(
            "SELECT * FROM books WHERE title LIKE ?", 
            [`%${title}%`]
        );
        return rows;
    },

    getByCategoryId: async (catId) => {
        const db = await pool;
        const [rows] = await db.query(
            "SELECT * FROM books WHERE category_id = ?", 
            [catId]
        );
        return rows;
    }
};