export class ChiTietPhieuMuonDTO {
  constructor({ ma_ctpm, ma_pm, ma_sach, ten_sach, so_luong, don_gia_coc }) {
    this.MaCTPM = ma_ctpm;
    this.MaPhieuMuon = ma_pm;
    this.MaSach = ma_sach;
    this.TenSach = ten_sach;
    this.SoLuong = so_luong;
    this.DonGiaCoc = don_gia_coc;
    this.ThanhTienCoc = so_luong * don_gia_coc;
  }
}