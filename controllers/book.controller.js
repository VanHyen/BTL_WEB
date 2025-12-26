import { bookService } from "../services/book.service.js";
import { CreateBookDTO } from "../dtos/books/create.book.dto.js";
import { UpdateBookDTO } from "../dtos/books/update.book.dto.js";
import { validateCreateBook } from "../validators/books/create.book.validator.js";
import { validateUpdateBook } from "../validators/books/update.book.validator.js";
import { logger } from "../config/logger.js";

export const bookController = {
    // 1. Lấy tất cả sách
    getAll: async (req, res) => {
        try {
            const books = await bookService.getAllBooks();
            res.json(books);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // 2. Chi tiết sách theo ID
    getById: async (req, res) => {
        try {
            const book = await bookService.getBookById(+req.params.id);
            res.json(book);
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    },

    // 3. Tìm kiếm sách theo tên (Đây là hàm gây lỗi nếu thiếu)
    getByTen: async (req, res) => {
        const title = req.query.Ten; // Lấy từ query ?Ten=...
        try {
            const books = await bookService.searchBooksByTitle(title);
            res.json(books);
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    },

    // 4. Lấy sách theo danh mục (ID)
    getByCategoryId: async (req, res) => {
        const catId = +req.params.id;
        try {
            const books = await bookService.getBooksByCategoryId(catId);
            res.json(books);
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    },

    // 5. Thêm mới
    create: async (req, res) => {
        try {
            const validData = validateCreateBook(req.body);
            const dto = new CreateBookDTO(validData);
            const book = await bookService.createBook(dto);
            res.status(201).json(book);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    // 6. Cập nhật
    update: async (req, res) => {
        try {
            const validData = validateUpdateBook(req.body);
            const dto = new UpdateBookDTO(validData);
            const result = await bookService.updateBook(+req.params.id, dto);
            res.json(result);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    // 7. Xóa
    delete: async (req, res) => {
        try {
            const result = await bookService.deleteBook(+req.params.id);
            res.json(result);
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    },
    // 8. Thống kê sách theo danh mục
    getStatsByCategory: async (req, res) => {
        try {
            logger.info("Controller: GET /book/stats");
            // Đảm bảo bạn đã viết hàm này trong bookService
            const stats = await bookService.getBookStatsByCategory();
            res.json(stats);
        } catch (err) {
            logger.error("Controller Error: getStatsByCategory failed", err);
            res.status(500).json({ message: err.message });
        }
    },
};