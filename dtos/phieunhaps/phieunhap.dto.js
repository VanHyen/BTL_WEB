export class PhieuNhapDTO {
  constructor(data) {
    this.MaPN = data.ma_pn;
    this.TenNXB = data.ten_nxb;
    this.TenSach = data.ten_sach;
    this.NgayNhap = new Date(data.ngay_nhap).toLocaleDateString("vi-VN");
    this.SoLuong = data.so_luong;
    this.GiaNhap = data.don_gia_nhap;
    this.ThanhTien = data.so_luong * data.don_gia_nhap;
  }
}