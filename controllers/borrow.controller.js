import { borrowService } from "../services/borrow.service.js";
import { CreateBorrowDTO } from "../dtos/borrows/create.borrow.dto.js";
import { UpdateBorrowDTO } from "../dtos/borrows/update.borrow.dto.js";
import { validateCreateBorrow } from "../validators/borrows/create.borrow.validator.js";
import { validateUpdateBorrow } from "../validators/borrows/update.borrow.validator.js";
import { logger } from "../config/logger.js";

export const borrowController = {
  getAll: async (req, res) => {
    try {
      logger.info("Controller: GET /api/borrows");
      const result = await borrowService.getAllBorrows();
      res.json(result);
    } catch (err) {
      logger.error("Controller Error: getAll loans failed", err);
      res.status(500).json({ message: err.message });
    }
  },

  create: async (req, res) => {
    try {
      logger.info("Controller: POST /api/borrows");
      
      // 1. Validate dữ liệu đầu vào
      const validData = validateCreateBorrow(req.body);
      
      // 2. Chuyển thành DTO
      const dto = new CreateBorrowDTO(validData);
      
      // 3. Gọi service xử lý
      const result = await borrowService.createBorrow(dto);
      res.status(201).json(result);
    } catch (err) {
      logger.error("Controller Error: create loan failed", err);
      res.status(400).json({ message: err.message });
    }
  },

  returnBook: async (req, res) => {
    const id = +req.params.id;
    try {
      const result = await borrowService.returnBooks(id);
      res.json({ message: "Trả sách thành công", data: result });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  getById: async (req, res) => {
    const id = +req.params.id;
    try {
      const result = await borrowService.getBorrowById(id);
      res.json(result);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  },

  update: async (req, res) => {
    const id = +req.params.id;
    try {
      const validData = validateUpdateBorrow(req.body);
      const dto = new UpdateBorrowDTO(validData);
      const result = await borrowService.updateBorrowStatus(id, dto);
      res.json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  returnBook: async (req, res) => {
    const id = +req.params.id;
    try {
      logger.info(`Controller: Processing return for loan ${id}`);
      const result = await borrowService.returnBooks(id);
      res.json({ 
        success: true,
        message: "Trả sách thành công, kho đã được cập nhật.", 
        data: result 
      });
    } catch (err) {
      logger.error(`Controller Error: returnBook failed for ID ${id}`, err);
      res.status(400).json({ message: err.message });
    }
  },

  update: async (req, res) => {
    const id = +req.params.id;
    try {
      const validData = validateUpdateBorrow(req.body);
      const dto = new UpdateBorrowDTO(validData);
      const result = await borrowService.updateBorrowStatus(id, dto);
      res.json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};