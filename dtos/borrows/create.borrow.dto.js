export class CreateBorrowDTO {
  constructor({ user_id, loan_date, due_date, items }) {
    this.userId = user_id;
    this.loanDate = loan_date || new Date().toISOString().split('T')[0];
    this.dueDate = due_date;
    this.items = items; 
  }
}