export class PhieuMuonDTO {
  constructor({ ma_pm, ma_dg, ngay_muon, tong_tien_coc, ten_dg }) {
    this.MaPM = ma_pm;
    this.MaDG = ma_dg;
    this.TenDG = ten_dg;
    this.NgayMuon = new Date(ngay_muon).toLocaleDateString("vi-VN");
    this.TongTienCoc = tong_tien_coc;
  }
}