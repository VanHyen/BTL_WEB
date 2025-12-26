export class ThongKeSanPhamDanhMucDTO {
  constructor(data) {
    this.maDanhMuc = data.MaDanhMuc;
    this.tenDanhMuc = data.TenDanhMuc;
    this.soLuongSanPham = parseInt(data.SoLuongSanPham) || 0;
  }
}