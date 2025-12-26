-- 1. Tạo cơ sở dữ liệu (Nếu chưa có)
CREATE DATABASE IF NOT EXISTS quan_ly_ban_hang CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE quan_ly_ban_hang;

-- 2. Tạo bảng Danh Mục
CREATE TABLE IF NOT EXISTS DanhMuc (
    MaDanhMuc INT AUTO_INCREMENT PRIMARY KEY,
    TenDanhMuc VARCHAR(255) NOT NULL
);

-- 3. Tạo bảng Sản Phẩm
CREATE TABLE IF NOT EXISTS SanPham (
    Ma INT AUTO_INCREMENT PRIMARY KEY,
    Ten VARCHAR(255) NOT NULL,
    DonGia DECIMAL(15, 0) DEFAULT 0,
    MaDanhMuc INT,
    
    -- Tạo khóa ngoại liên kết với bảng DanhMuc
    CONSTRAINT fk_sanpham_danhmuc
    FOREIGN KEY (MaDanhMuc) REFERENCES DanhMuc(MaDanhMuc) ON DELETE SET NULL
);

-- 4. Thêm dữ liệu mẫu cho Danh Mục
INSERT INTO DanhMuc (TenDanhMuc) VALUES 
('Sách Văn Học Trong Nước'),
('Sách Văn Học Nước Ngoài'),
('Sách Kinh Tế - Quản Trị'),
('Sách Thiếu Nhi'),
('Sách Tâm Lý - Kỹ Năng');

-- 5. Thêm dữ liệu mẫu cho Sản Phẩm (Đã bỏ chữ N phía trước vì đã set utf8mb4 ở trên, nhưng giữ lại cũng không sao)
INSERT INTO SanPham (Ten, DonGia, MaDanhMuc) VALUES 
('Dế Mèn Phiêu Lưu Ký', 50000, 1),
('Đất Rừng Phương Nam', 85000, 1),
('Số Đỏ', 60000, 1),
('Mắt Biếc', 110000, 1),
('Cánh Đồng Bất Tận', 75000, 1);

INSERT INTO SanPham (Ten, DonGia, MaDanhMuc) VALUES 
('Nhà Giả Kim', 79000, 2),
('Ông Già Và Biển Cả', 45000, 2),
('Rừng Na Uy', 120000, 2),
('Hai Số Phận', 135000, 2),
('Không Gia Đình', 98000, 2);

INSERT INTO SanPham (Ten, DonGia, MaDanhMuc) VALUES 
('Cha Giàu Cha Nghèo', 115000, 3),
('Đắc Nhân Tâm', 86000, 3),
('Nhà Đầu Tư Thông Minh', 180000, 3),
('Chiến Tranh Tiền Tệ', 145000, 3),
('Khởi Nghiệp Tinh Gọn', 110000, 3);

INSERT INTO SanPham (Ten, DonGia, MaDanhMuc) VALUES 
('Kính Vạn Hoa - Tập 1', 90000, 4),
('Harry Potter và Hòn Đá Phù Thủy', 150000, 4),
('Doraemon - Truyện Ngắn Tập 1', 25000, 4),
('Thần Đồng Đất Việt - Tập 1', 30000, 4),
('Pippi Tất Dài', 65000, 4);

INSERT INTO SanPham (Ten, DonGia, MaDanhMuc) VALUES 
('Quẳng Gánh Lo Đi Và Vui Sống', 95000, 5),
('Tuổi Trẻ Đáng Giá Bao Nhiêu', 80000, 5),
('Đời Thay Đổi Khi Chúng Ta Thay Đổi', 55000, 5),
('Hạt Giống Tâm Hồn', 45000, 5),
('Tư Duy Phản Biện', 88000, 5);