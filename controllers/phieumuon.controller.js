// controllers/phieumuon.controller.js
import { phieuMuonService } from "../services/phieumuon.service.js";
import { createPhieuMuonSchema } from "../validators/phieumuons/create-phieumuon.validator.js";

export const phieuMuonController = {
  layTatCaPhieuMuon: async (req, res, next) => {
    try { res.json(await phieuMuonService.getAll()); } catch (err) { next(err); }
  },

  layPhieuMuonTheoMa: async (req, res, next) => {
    try { res.json(await phieuMuonService.getById(Number(req.params.ma_pm))); } catch (err) { next(err); }
  },

  themPhieuMuon: async (req, res, next) => {
    try {
      const payload = createPhieuMuonSchema.parse(req.body);
      await phieuMuonService.create(payload);
      res.status(201).json({ message: "Lập phiếu mượn thành công!" });
    } catch (err) { next(err); }
  },

  layChiTietPhieuMuon: async (req, res, next) => {
    try { res.json(await phieuMuonService.getChiTiet(Number(req.params.ma_pm))); } catch (err) { next(err); }
  },

  xoaPhieuMuon: async (req, res, next) => {
    try {
      await phieuMuonService.delete(Number(req.params.ma_pm));
      res.json({ message: "Xóa phiếu mượn thành công!" });
    } catch (err) { next(err); }
  }
};