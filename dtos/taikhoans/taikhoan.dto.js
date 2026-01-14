export class TaiKhoanDTO {
  constructor({ id, email, role }) {
    this.id = id;
    this.email = email;
    this.role = role; // 1: Admin, 2: Thủ thư, 3: Độc giả
  }
}