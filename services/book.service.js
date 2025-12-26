import { bookRepository } from "../repositories/book.repository.js";
import { BookDTO } from "../dtos/books/book.dto.js";
import { logger } from "../config/logger.js";

export const bookService = {
  getAllBooks: async () => {
    const books = await bookRepository.getAll();
    return books.map(b => new BookDTO(b));
  },

  getBookById: async (id) => {
    const book = await bookRepository.getById(id);
    if (!book) throw new Error("Không tìm thấy sách");
    return new BookDTO(book);
  },

  createBook: async (dto) => {
    const created = await bookRepository.create(dto);
    return new BookDTO(created);
  },
  searchBooksByTitle: async (title) => {
        const books = await bookRepository.getByTitle(title);
        return books.map(b => new BookDTO(b));
    },

  getBooksByCategoryId: async (catId) => {
        const books = await bookRepository.getByCategoryId(catId);
        return books.map(b => new BookDTO(b));
    },
  updateBook: async (id, dto) => {
    const existing = await bookRepository.getById(id);
    if (!existing) throw new Error("Không tìm thấy sách để cập nhật");
    const updated = await bookRepository.update(id, dto);
    return new BookDTO(updated);
  },

  deleteBook: async (id) => {
    const existing = await bookRepository.getById(id);
    if (!existing) throw new Error("Không tìm thấy sách để xóa");
    await bookRepository.delete(id);
    return { message: "Xóa sách thành công" };
  }
};