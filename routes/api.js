// routes/api.js
import { Router } from "express";

import { dangnhapController } from "../controllers/dangnhap.controller.js";
import { theLoaiController } from "../controllers/theloai.controller.js";
import { nhaXuatBanController } from "../controllers/nhaxuatban.controller.js";
import { sachController } from "../controllers/sach.controller.js";
import { phieuNhapController } from "../controllers/phieunhap.controller.js"; // Sửa lại tên file
import { docGiaController } from "../controllers/docgia.controller.js";
import { phieuMuonController } from "../controllers/phieumuon.controller.js";
import { chiTietPhieuMuonController } from "../controllers/chitiet_phieumuon.controller.js";
import { layTonKho } from "../controllers/tonkho.controller.js";

const router = Router();

// --- ĐĂNG NHẬP ---
router.post("/dangnhap", dangnhapController.dangNhap);

// --- THỂ LOẠI ---
router.get("/theloai", theLoaiController.layTatCaTheLoai);
router.get("/theloai/:ma_the_loai", theLoaiController.layTheLoaiTheoMa);
router.post("/theloai", theLoaiController.themTheLoai);
router.put("/theloai/:ma_the_loai", theLoaiController.suaTheLoai);
router.delete("/theloai/:ma_the_loai", theLoaiController.xoaTheLoai);

// --- NHÀ XUẤT BẢN ---
router.get("/nhaxuatban", nhaXuatBanController.layTatCaNhaXuatBan);
router.get("/nhaxuatban/:ma_nxb", nhaXuatBanController.layNXBTheoMa);
router.post("/nhaxuatban", nhaXuatBanController.themNhaXuatBan);
router.put("/nhaxuatban/:ma_nxb", nhaXuatBanController.suaNhaXuatBan);
router.delete("/nhaxuatban/:ma_nxb", nhaXuatBanController.xoaNhaXuatBan);

// --- SÁCH ---
router.get("/sach", sachController.layTatCaSach);
router.get("/sach/:ma_sach", sachController.laySachTheoMa);
router.get("/sach/theloai/:ma_the_loai", sachController.laySachTheoTheLoai); // Dòng 38 gây lỗi đã được fix
router.post("/sach", sachController.themSach);
router.put("/sach/:ma_sach", sachController.suaSach);
router.delete("/sach/:ma_sach", sachController.xoaSach);

// --- PHIẾU NHẬP ---
router.get("/phieunhap", phieuNhapController.layTatCaPhieuNhap);
router.post("/phieunhap", phieuNhapController.themPhieuNhap);
router.put("/phieunhap/:ma_pn", phieuNhapController.suaPhieuNhap);

// --- ĐỘC GIẢ ---
router.get("/docgia", docGiaController.layTatCaDocGia);
router.get("/docgia/:ma_dg", docGiaController.layDocGiaTheoMa);
router.post("/docgia", docGiaController.themDocGia);
router.put("/docgia/:ma_dg", docGiaController.suaDocGia);
router.delete("/docgia/:ma_dg", docGiaController.xoaDocGia);

// --- PHIẾU MƯỢN ---
router.get("/phieumuon", phieuMuonController.layTatCaPhieuMuon);
router.get("/phieumuon/:ma_pm", phieuMuonController.layPhieuMuonTheoMa);
router.get("/phieumuon/:ma_pm/chitiet", phieuMuonController.layChiTietPhieuMuon);
router.post("/phieumuon", phieuMuonController.themPhieuMuon);
router.delete("/phieumuon/:ma_pm", phieuMuonController.xoaPhieuMuon);

// --- CHI TIẾT PHIẾU MƯỢN ---
router.get("/ctpm", chiTietPhieuMuonController.layTatCaCTPhieuMuon);
router.post("/ctpm", chiTietPhieuMuonController.themChiTietPhieuMuon);
router.put("/ctpm/:ma_ctpm", chiTietPhieuMuonController.suaChiTietPhieuMuon);
router.delete("/ctpm/:ma_ctpm", chiTietPhieuMuonController.xoaChiTietPhieuMuon);

// --- TỒN KHO ---
router.get("/tonkho", layTonKho);

export default router;