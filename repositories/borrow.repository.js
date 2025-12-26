import { pool } from "../config/database.js";
import { logger } from "../config/logger.js";

export const borrowRepository = {
  // Lấy tất cả phiếu mượn kèm thông tin người dùng
  getAll: async () => {
    logger.info("Repository: Fetching all loans");
    const db = await pool;
    const query = `
      SELECT l.*, u.full_name 
      FROM loans l 
      JOIN users u ON l.user_id = u.id 
      ORDER BY l.loan_date DESC`;
    const [rows] = await db.query(query);
    return rows;
  },

  // Tạo phiếu mượn (Transaction)
  create: async (dto) => {
    logger.info(`Repository: Creating loan for user ${dto.userId}`);
    const db = await pool;
    const connection = await db.getConnection(); // Dùng connection để chạy transaction
    
    try {
      await connection.beginTransaction();

      // 1. Insert vào bảng loans
      const [loanResult] = await connection.query(
        "INSERT INTO loans (user_id, loan_date, due_date, status) VALUES (?, ?, ?, 'BORROWED')",
        [dto.userId, dto.loanDate, dto.dueDate]
      );
      const loanId = loanResult.insertId;

      // 2. Insert vào loan_items và Cập nhật số lượng sách
      for (const item of dto.items) {
        // Kiểm tra và trừ số lượng sách khả dụng
        const [book] = await connection.query("SELECT available_copies FROM books WHERE id = ?", [item.book_id]);
        if (!book[0] || book[0].available_copies < item.qty) {
          throw new Error(`Sách ID ${item.book_id} không đủ số lượng để mượn`);
        }

        await connection.query(
          "INSERT INTO loan_items (loan_id, book_id, qty) VALUES (?, ?, ?)",
          [loanId, item.book_id, item.qty]
        );

        await connection.query(
          "UPDATE books SET available_copies = available_copies - ? WHERE id = ?",
          [item.qty, item.book_id]
        );
      }

      await connection.commit();
      return { id: loanId, ...dto };
    } catch (err) {
      await connection.rollback();
      logger.error("Repository Error: create loan failed", err);
      throw err;
    } finally {
      connection.release();
    }
  },

  // Cập nhật trạng thái trả sách
  updateStatus: async (id, status) => {
    const db = await pool;
    await db.query("UPDATE loans SET status = ? WHERE id = ?", [status, id]);
    return { id, status };
  },
  getById: async (id) => {
    logger.info(`Repository: Fetching loan detail for ID ${id}`);
    const db = await pool;
    
    // Lấy thông tin phiếu mượn và thông tin người mượn
    const [loan] = await db.query(`
      SELECT l.*, u.full_name, u.email 
      FROM loans l 
      JOIN users u ON l.user_id = u.id 
      WHERE l.id = ?`, [id]);

    if (loan.length === 0) return null;

    // Lấy danh sách các sách trong phiếu mượn đó (JOIN với bảng books)
    const [items] = await db.query(`
      SELECT li.book_id, b.title, li.qty 
      FROM loan_items li
      JOIN books b ON li.book_id = b.id
      WHERE li.loan_id = ?`, [id]);

    return { ...loan[0], items };
  },

  getByUserId: async (userId) => {
    logger.info(`Repository: Fetching loans for user ${userId}`);
    const db = await pool;
    const [rows] = await db.query("SELECT * FROM loans WHERE user_id = ?", [userId]);
    return rows;
  },
  returnLoanWithTransaction: async (id) => {
    logger.info(`Repository: Processing return for loan ID ${id}`);
    const db = await pool;
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // 1. Kiểm tra phiếu mượn có tồn tại và chưa trả hay không
      const [loan] = await connection.query(
        "SELECT status FROM loans WHERE id = ? FOR UPDATE", [id]
      );

      if (!loan[0]) throw new Error("Không tìm thấy phiếu mượn.");
      if (loan[0].status === 'RETURNED') throw new Error("Phiếu mượn này đã được trả trước đó.");

      // 2. Lấy danh sách sách và số lượng từ loan_items để cộng lại kho
      const [items] = await connection.query(
        "SELECT book_id, qty FROM loan_items WHERE loan_id = ?", [id]
      );

      for (const item of items) {
        await connection.query(
          "UPDATE books SET available_copies = available_copies + ? WHERE id = ?",
          [item.qty, item.book_id]
        );
      }

      // 3. Cập nhật trạng thái phiếu mượn
      await connection.query(
        "UPDATE loans SET status = 'RETURNED' WHERE id = ?", [id]
      );

      await connection.commit();
      return { id, status: 'RETURNED' };
    } catch (err) {
      await connection.rollback();
      logger.error("Repository Error: returnLoanWithTransaction failed", err);
      throw err;
    } finally {
      connection.release();
    }
  },

  // Cập nhật trạng thái chung (cho Admin sửa thủ công)
  updateStatus: async (id, status) => {
    const db = await pool;
    await db.query("UPDATE loans SET status = ? WHERE id = ?", [status, id]);
    return { id, status };
  }
};