export class BookDTO {
  constructor({ id, title, author, total_copies, available_copies, category_id, TenDanhMuc }) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.totalCopies = total_copies;
    this.availableCopies = available_copies;
    this.categoryId = category_id;
    this.categoryName = TenDanhMuc || null; // Tên danh mục lấy từ phép JOIN bảng danhmucs
  }
}