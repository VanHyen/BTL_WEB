export class UpdateBorrowDTO {
  constructor({ status, due_date }) {
    this.status = status; // 'BORROWED', 'RETURNED', 'OVERDUE'
    this.dueDate = due_date; // Cho phép gia hạn ngày trả nếu cần
  }
}