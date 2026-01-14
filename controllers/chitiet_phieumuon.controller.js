// controllers/chitiet_phieumuon.controller.js
import { chiTietPhieuMuonService } from "../services/chitiet_phieumuon.service.js";
import { createChiTietPhieuMuonSchema } from "../validators/chitiet_phieumuons/create-chitiet_phieumuon.validator.js";
import { updateCTPhieuMuonSchema } from "../validators/chitiet_phieumuons/update-chitiet_phieumuon.validator.js";

export const chiTietPhieuMuonController = {
  layTatCaCTPhieuMuon: async (req, res, next) => {
    try { res.json(await chiTietPhieuMuonService.getAll()); } catch (err) { next(err); }
  },

  // Đã bổ sung validation .parse() ở đây
  themChiTietPhieuMuon: async (req, res, next) => {
    try {
      const payload = createChiTietPhieuMuonSchema.parse(req.body); 
      await chiTietPhieuMuonService.create(payload);
      res.status(201).json({ message: "Thêm sách vào phiếu mượn thành công" });
    } catch (err) { next(err); }
  },

  suaChiTietPhieuMuon: async (req, res, next) => {
    try {
      const ma_ctpm = Number(req.params.ma_ctpm);
      const payload = updateCTPhieuMuonSchema.parse(req.body);
      await chiTietPhieuMuonService.update({ ma_ctpm, ...payload });
      res.json({ message: "Cập nhật chi tiết phiếu mượn thành công!" });
    } catch (err) { next(err); }
  },

  xoaChiTietPhieuMuon: async (req, res, next) => {
    try {
      await chiTietPhieuMuonService.delete(Number(req.params.ma_ctpm));
      res.json({ message: "Xóa chi tiết phiếu mượn thành công!" });
    } catch (err) { next(err); }
  }
};