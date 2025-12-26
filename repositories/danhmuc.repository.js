import { pool } from "../config/database.js";
import { logger } from "../config/logger.js";

export const danhmucRepository = {
  getAll: async () => {
    logger.info("Repository: Fetching all danh muc");
    try {
      const db = await pool;
      const [rows] = await db.query(`SELECT * FROM DanhMuc`);
      return rows;
    } catch (err) {
      logger.error("Repository Error: getAll failed", err);
      throw err;
    }
  },
};