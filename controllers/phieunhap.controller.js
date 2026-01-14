// controllers/phieunhap.controller.js
import { phieuNhapService } from "../services/phieunhap.service.js";
import { createPhieuNhapSchema } from "../validators/phieunhaps/create-phieunhap.validator.js";
import { updatePhieuNhapSchema } from "../validators/phieunhaps/update-phieunhap.validator.js";

export const phieuNhapController = {
  layTatCaPhieuNhap: async (req, res, next) => {
    try { res.json(await phieuNhapService.getAll()); } catch (e) { next(e); }
  },

  themPhieuNhap: async (req, res, next) => {
    try {
      const payload = createPhieuNhapSchema.parse(req.body);
      await phieuNhapService.create(payload);
      res.status(201).json({ message: "Nhập sách thành công!" });
    } catch (e) { next(e); }
  },

  // Bổ sung hàm sửa
  suaPhieuNhap: async (req, res, next) => {
    try {
      const ma_pn = Number(req.params.ma_pn);
      const payload = updatePhieuNhapSchema.parse(req.body);
      await phieuNhapService.update({ ma_pn, ...payload });
      res.json({ message: "Cập nhật phiếu nhập và kho thành công!" });
    } catch (e) { next(e); }
  }
};