export class UpdateBookDTO {
  constructor({ title, author, total_copies, category_id }) {
    this.title = title || undefined;
    this.author = author || undefined;
    this.total_copies = total_copies !== undefined ? total_copies : undefined;
    this.category_id = category_id !== undefined ? category_id : undefined;
  }
}