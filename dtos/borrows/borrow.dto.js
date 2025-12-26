export class BorrowDTO {
  constructor({ id, user_id, full_name, loan_date, due_date, status, items = [] }) {
    this.id = id;
    this.userId = user_id;
    this.userName = full_name; 
    this.loanDate = loan_date;
    this.dueDate = due_date;
    this.status = status;
    this.items = items; 
  }
}