📚 API DOCUMENTATION - HỆ THỐNG QUẢN LÝ THƯ VIỆN
1. THÔNG TIN CHUNG
Base URL: http://localhost:3000/api

Format: JSON

Database: BTL_QuanLyThuVien

2. DANH SÁCH ENDPOINTS
🟢 GET (Lấy dữ liệu)
Thể loại & Nhà xuất bản:

Lấy tất cả thể loại: GET /theloai

Lấy thể loại theo mã: GET /theloai/:ma_the_loai

Lấy tất cả nhà xuất bản: GET /nhaxuatban

Lấy nhà xuất bản theo mã: GET /nhaxuatban/:ma_nxb

Sách:

Lấy tất cả sách: GET /sach

Lấy chi tiết một cuốn sách: GET /sach/:ma_sach

Lấy sách theo mã thể loại: GET /sach/theloai/:ma_the_loai

Lấy sách theo nhà xuất bản: GET /sach/nhaxuatban/:ma_nxb

Độc giả:

Lấy tất cả độc giả: GET /docgia

Lấy thông tin một độc giả: GET /docgia/:ma_dg

Phiếu nhập (Sách về kho):

Lấy tất cả phiếu nhập: GET /phieunhap

Lấy phiếu nhập theo mã: GET /phieunhap/:ma_pn

Phiếu mượn & Chi tiết (Nghiệp vụ mượn trả):

Lấy tất cả phiếu mượn: GET /phieumuon

Lấy phiếu mượn theo mã: GET /phieumuon/:ma_pm

Lấy lịch sử mượn sách của 1 độc giả: GET /phieumuon?ma_dg=:ma_dg

Lấy chi tiết sách mượn của 1 phiếu: GET /ctpm?ma_pm=:ma_pm

Thống kê:

Xem tồn kho thực tế: GET /tonkho

Xem thống kê lượt mượn theo tháng: GET /thongke/muon?thang=01&nam=2026

🔵 POST (Thêm mới)
Thể loại: POST /theloai

JSON

{ "ten_the_loai": "Văn học", "mo_ta": "Sách văn học" }
Nhà xuất bản: POST /nhaxuatban

JSON

{ "ten_nxb": "NXB Trẻ", "dien_thoai": "0912345678", "dia_chi": "Hà Nội", "email": "nxb@gmail.com" }
Sách: POST /sach

JSON

{
  "ten_sach": "Đắc Nhân Tâm",
  "tac_gia": "Dale Carnegie",
  "ma_the_loai": 1,
  "ma_nxb": 1,
  "gia_bia": 80000,
  "gia_nhap": 50000,
  "so_luong_ton": 50,
  "mo_ta": "Sách kỹ năng sống"
}
Phiếu nhập: POST /phieunhap

JSON

{ "ma_nxb": 1, "ma_sach": 101, "ngay_nhap": "2026-01-15", "so_luong": 20, "don_gia_nhap": 50000 }
Phiếu mượn: POST /phieumuon

JSON

{ "ma_dg": 1, "ngay_muon": "2026-01-15" }
🟡 PUT (Cập nhật)
Sửa thông tin sách: PUT /sach/:ma_sach

Sửa thông tin độc giả: PUT /docgia/:ma_dg

Sửa thông tin NXB: PUT /nhaxuatban/:ma_nxb

Sửa thông tin thể loại: PUT /theloai/:ma_the_loai

Sửa phiếu mượn: PUT /phieumuon/:ma_pm

🔴 DELETE (Xóa)
Xóa sách: DELETE /sach/:ma_sach

Xóa độc giả: DELETE /docgia/:ma_dg

Xóa phiếu mượn: DELETE /phieumuon/:ma_pm

Xóa nhà xuất bản: DELETE /nhaxuatban/:ma_nxb

Xóa thể loại: DELETE /theloai/:ma_the_loai

3. LƯU Ý NGHIỆP VỤ
Tự động hóa: Mã số (ID) của tất cả các bảng đều được thiết lập AUTO_INCREMENT, không cần gửi lên trong Body khi POST.

Trigger tồn kho: Khi POST một phiếu nhập, số lượng tồn kho của sách sẽ tự động tăng. Khi POST một chi tiết phiếu mượn, số lượng tồn sẽ tự động giảm.

Tiền cọc: Tổng tiền cọc trong phiếu mượn được hệ thống tự động tính dựa trên giá bìa của các cuốn sách được chọn.