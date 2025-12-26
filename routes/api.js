import { Router } from "express";
import { bookController } from "../controllers/book.controller.js";
import { danhmucController } from "../controllers/danhmuc.controller.js";
import { borrowController } from "../controllers/borrow.controller.js";
import { userController } from "../controllers/user.controller.js";

const router = Router();

// --- QUẢN LÝ SÁCH ---
// Thêm tìm kiếm & thống kê (giống phần sanpham cũ)
router.get("/book/search", bookController.getByTen); // Nên đặt trên route /book/:id
router.get("/book/stats", bookController.getStatsByCategory); 

router.route("/book")
    .get(bookController.getAll)
    .post(bookController.create);

router.route("/book/:id")
    .get(bookController.getById)
    .put(bookController.update)
    .delete(bookController.delete);

// --- QUẢN LÝ DANH MỤC ---
router.get("/danhmuc", danhmucController.getAll);
// Thêm route lấy sách theo danh mục (rất quan trọng cho thư viện)
router.get("/danhmuc/:id/books", bookController.getByCategoryId); 

// --- QUẢN LÝ NGƯỜI DÙNG ---
router.route("/user")
    .get(userController.getAll)
    .post(userController.create);

router.route("/user/:id")
    .get(userController.getById)
    .put(userController.update)
    .delete(userController.delete);

// --- QUẢN LÝ MƯỢN TRẢ ---
router.route("/borrow")
    .get(borrowController.getAll)
    .post(borrowController.create);

router.route("/borrow/:id")
    .get(borrowController.getById)
    .put(borrowController.update); // Dùng để gia hạn hoặc đổi trạng thái thủ công

router.post("/borrow/:id/return", borrowController.returnBook);

export default router;