export class CreateBookDTO {
  constructor({ title, author, total_copies, category_id }) {
    this.title = title;
    this.author = author;
    this.total_copies = total_copies || 1;
    this.available_copies = total_copies || 1; 
    this.category_id = category_id || null;
  }
}