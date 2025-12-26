import { borrowRepository } from "../repositories/borrow.repository.js";
import { BorrowDTO } from "../dtos/borrows/borrow.dto.js";
import { logger } from "../config/logger.js";

export const borrowService = {
  getAllBorrows: async () => {
    logger.info("Service: Getting all loans");
    const loans = await borrowRepository.getAll();
    return loans.map(l => new BorrowDTO(l));
  },

  createBorrow: async (dto) => {
    logger.info(`Service: Processing borrow request for user ${dto.userId}`);
    const created = await borrowRepository.create(dto);
    return new BorrowDTO(created);
  },

  returnBooks: async (id) => {
    logger.info(`Service: Returning books for loan ${id}`);
    // Logic: Cập nhật status thành 'RETURNED'
    // Lưu ý: Ở bản đầy đủ, bạn cần cộng lại available_copies trong repository
    const updated = await borrowRepository.updateStatus(id, 'RETURNED');
    return updated;
  },
  getBorrowById: async (id) => {
    logger.info(`Service: Getting loan detail by ID ${id}`);
    const loanDetail = await borrowRepository.getById(id);
    if (!loanDetail) throw new Error("Loan record not found");
    
    return new BorrowDTO(loanDetail);
  },

  updateBorrowStatus: async (id, dto) => {
    logger.info(`Service: Updating status for loan ${id} to ${dto.status}`);
    const existing = await borrowRepository.getById(id);
    if (!existing) throw new Error("Loan record not found");

    const updated = await borrowRepository.updateStatus(id, dto.status);
    return updated;
  },
  returnBooks: async (id) => {
    logger.info(`Service: Returning books for loan ${id}`);
    // Gọi hàm có Transaction để đảm bảo sách được cộng lại vào kho
    const result = await borrowRepository.returnLoanWithTransaction(id);
    return result;
  },

  updateBorrowStatus: async (id, dto) => {
    logger.info(`Service: Updating status for loan ${id} to ${dto.status}`);
    const existing = await borrowRepository.getById(id);
    if (!existing) throw new Error("Loan record not found");

    const updated = await borrowRepository.updateStatus(id, dto.status);
    return updated;
  }
};