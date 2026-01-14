-- =============================================================
-- DATABASE: BTL_QuanLyThuVien (Bản chuẩn hóa cuối cùng)
-- =============================================================

DROP DATABASE IF EXISTS BTL_QuanLyThuVien;
CREATE DATABASE BTL_QuanLyThuVien;
USE BTL_QuanLyThuVien;

-- 1. THỂ LOẠI
CREATE TABLE theloai (
    ma_the_loai INT AUTO_INCREMENT PRIMARY KEY,
    ten_the_loai VARCHAR(50) NOT NULL,
    mo_ta TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. NHÀ XUẤT BẢN
CREATE TABLE nhaxuatban (
    ma_nxb INT AUTO_INCREMENT PRIMARY KEY,
    ten_nxb VARCHAR(50) NOT NULL,
    dien_thoai VARCHAR(15),
    dia_chi VARCHAR(100),
    email VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. SÁCH
CREATE TABLE sach (
    ma_sach INT AUTO_INCREMENT PRIMARY KEY,
    ten_sach VARCHAR(100) NOT NULL,
    tac_gia VARCHAR(50),
    ma_the_loai INT,
    ma_nxb INT,
    gia_bia DECIMAL(15,2) DEFAULT 0, 
    gia_nhap DECIMAL(15,2) DEFAULT 0,
    so_luong_ton INT DEFAULT 0,
    mo_ta TEXT,
    CONSTRAINT fk_sach_tl FOREIGN KEY (ma_the_loai) REFERENCES theloai(ma_the_loai),
    CONSTRAINT fk_sach_nxb FOREIGN KEY (ma_nxb) REFERENCES nhaxuatban(ma_nxb)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. ĐỘC GIẢ (Bổ sung email để khớp với form)
CREATE TABLE docgia (
    ma_dg INT AUTO_INCREMENT PRIMARY KEY,
    ten_dg VARCHAR(50) NOT NULL,
    dien_thoai VARCHAR(15),
    dia_chi VARCHAR(100),
    email VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. PHIẾU NHẬP (Tên viết thường để sửa lỗi 500)
CREATE TABLE phieunhap (
    ma_pn INT AUTO_INCREMENT PRIMARY KEY,
    ma_nxb INT,
    ma_sach INT,
    ngay_nhap DATE NOT NULL,
    so_luong INT DEFAULT 0,
    don_gia_nhap DECIMAL(15,2) DEFAULT 0,
    CONSTRAINT fk_pn_nxb FOREIGN KEY (ma_nxb) REFERENCES nhaxuatban(ma_nxb),
    CONSTRAINT fk_pn_sach FOREIGN KEY (ma_sach) REFERENCES sach(ma_sach)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. PHIẾU MƯỢN
CREATE TABLE phieumuon (
    ma_pm INT AUTO_INCREMENT PRIMARY KEY,
    ma_dg INT,
    ngay_muon DATE NOT NULL,
    tong_tien_coc DECIMAL(15,2) DEFAULT 0,
    CONSTRAINT fk_pm_dg FOREIGN KEY (ma_dg) REFERENCES docgia(ma_dg)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. CHI TIẾT PHIẾU MƯỢN
CREATE TABLE chitiet_phieumuon (
    ma_ctpm INT AUTO_INCREMENT PRIMARY KEY,
    ma_pm INT,
    ma_sach INT,
    so_luong INT DEFAULT 1,
    don_gia_coc DECIMAL(15,2),
    CONSTRAINT fk_ctpm_pm FOREIGN KEY (ma_pm) REFERENCES phieumuon(ma_pm) ON DELETE CASCADE,
    CONSTRAINT fk_ctpm_sach FOREIGN KEY (ma_sach) REFERENCES sach(ma_sach)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. TÀI KHOẢN HỆ THỐNG
CREATE TABLE taikhoan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(50) UNIQUE NOT NULL,
    mat_khau VARCHAR(50) NOT NULL,
    role INT NOT NULL -- 1: Admin, 2: Thủ thư, 3: Độc giả
);

-- =============================================================
-- TRIGGERS TỰ ĐỘNG HÓA NGHIỆP VỤ
-- =============================================================

DELIMITER //

-- Tự động tăng tồn kho khi Nhập sách
CREATE TRIGGER trg_AfterInsert_PhieuNhap 
AFTER INSERT ON phieunhap FOR EACH ROW
BEGIN
    UPDATE sach SET so_luong_ton = so_luong_ton + NEW.so_luong WHERE ma_sach = NEW.ma_sach;
END //

-- Tự động gán giá bìa sách làm giá cọc khi tạo chi tiết mượn
CREATE TRIGGER trg_BeforeInsert_CTPM 
BEFORE INSERT ON chitiet_phieumuon FOR EACH ROW
BEGIN
    SET NEW.don_gia_coc = (SELECT gia_bia FROM sach WHERE ma_sach = NEW.ma_sach);
END //

-- Tự động tính tổng tiền cọc và Trừ tồn kho khi Mượn sách
CREATE TRIGGER trg_AfterInsert_CTPM 
AFTER INSERT ON chitiet_phieumuon FOR EACH ROW
BEGIN
    -- Cập nhật tổng tiền vào phiếu mượn
    UPDATE phieumuon SET tong_tien_coc = (
        SELECT IFNULL(SUM(so_luong * don_gia_coc), 0) 
        FROM chitiet_phieumuon WHERE ma_pm = NEW.ma_pm
    ) WHERE ma_pm = NEW.ma_pm;
    -- Trừ kho
    UPDATE sach SET so_luong_ton = so_luong_ton - NEW.so_luong WHERE ma_sach = NEW.ma_sach;
END //

-- Hoàn kho khi Xóa chi tiết mượn (Trả sách/Xóa phiếu)
CREATE TRIGGER trg_AfterDelete_CTPM 
AFTER DELETE ON chitiet_phieumuon FOR EACH ROW
BEGIN
    UPDATE sach SET so_luong_ton = so_luong_ton + OLD.so_luong WHERE ma_sach = OLD.ma_sach;
END //

DELIMITER ;

-- =============================================================
-- DỮ LIỆU MẪU (THỨ TỰ CHUẨN RÀNG BUỘC KHÓA NGOẠI)
-- =============================================================

-- Thể loại
INSERT INTO theloai (ten_the_loai, mo_ta) VALUES  
('Văn học', 'Sách văn học trong và ngoài nước'),
('Kinh tế', 'Sách tài chính, khởi nghiệp'),
('Công nghệ', 'Lập trình, AI, Blockchain'),
('Kỹ năng', 'Phát triển bản thân, giao tiếp'),
('Thiếu nhi', 'Truyện tranh, cổ tích');

-- Nhà xuất bản
INSERT INTO nhaxuatban (ten_nxb, dien_thoai, dia_chi, email) VALUES  
('NXB Trẻ', '02839316211', 'Quận 3, HCM', 'contact@nxbtre.com.vn'),
('NXB Giáo Dục', '02438220801', 'Hoàn Kiếm, Hà Nội', 'info@nxbgiaoduc.vn'),
('NXB Kim Đồng', '02439434730', 'Đống Đa, Hà Nội', 'kimdong@nxb.vn'),
('NXB Phụ Nữ', '02438257917', 'Hai Bà Trưng, Hà Nội', 'phunu@nxb.vn');

-- Sách
INSERT INTO sach (ten_sach, tac_gia, ma_the_loai, ma_nxb, gia_bia, gia_nhap, so_luong_ton) VALUES
('Đắc Nhân Tâm', 'Dale Carnegie', 4, 1, 85000, 50000, 50),
('Lập trình Node.js', 'Nguyễn Văn A', 3, 2, 180000, 120000, 25),
('Nhà Giả Kim', 'Paulo Coelho', 1, 1, 120000, 75000, 30),
('Dế Mèn Phiêu Lưu Ký', 'Tô Hoài', 1, 3, 55000, 30000, 100),
('Tôi Thấy Hoa Vàng Trên Cỏ Xanh', 'Nguyễn Nhật Ánh', 1, 1, 95000, 60000, 40);

-- Độc giả
INSERT INTO docgia (ten_dg, dien_thoai, dia_chi, email) VALUES
('Cao Văn Hiến', '0962331641', 'Hưng Yên', 'hien@gmail.com'),
('Trần Thị Bình', '0912345678', 'Hải Phòng', 'binh@gmail.com'),
('Lê Hoàng Nam', '0922334455', 'Đà Nẵng', 'nam@gmail.com'),
('Hoàng Kim Liên', '0355667788', 'Hưng Yên', 'lien@gmail.com');

-- Phiếu Nhập
INSERT INTO phieunhap (ma_nxb, ma_sach, ngay_nhap, so_luong, don_gia_nhap) VALUES
(1, 1, '2026-01-01', 20, 50000),
(2, 2, '2026-01-05', 10, 120000),
(3, 4, '2026-01-10', 50, 30000);

-- Phiếu Mượn & Chi tiết (Trigger sẽ tự tính tiền và trừ kho)
INSERT INTO phieumuon (ma_dg, ngay_muon) VALUES (1, '2025-01-15'), (2, '2025-01-16');
INSERT INTO chitiet_phieumuon (ma_pm, ma_sach, so_luong) VALUES (1, 1, 1), (1, 3, 1), (2, 4, 2);

-- Tài khoản đăng nhập
INSERT INTO taikhoan (email, mat_khau, role) VALUES
('admin@library.com', 'admin123', 1),
('thuthu@library.com', 'staff123', 2),
('hien@gmail.com', 'user123', 3);