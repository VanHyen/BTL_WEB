// dtos/nhaxuatbans/nhaxuatban.dto.js
export class NhaXuatBanDTO {
  constructor({ ma_nxb, ten_nxb, dien_thoai, dia_chi, email }) {
    this.MaNXB = ma_nxb;
    this.TenNXB = ten_nxb;
    this.DienThoai = dien_thoai;
    this.DiaChi = dia_chi;
    this.Email = email;
  }
}