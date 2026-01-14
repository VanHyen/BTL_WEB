// controllers/docgia.controller.js
import { docGiaService } from "../services/docgia.service.js";
import { createDocGiaSchema } from "../validators/docgias/create-docgia.validator.js";
import { updateDocGiaSchema } from "../validators/docgias/update-docgia.validator.js";

export const docGiaController = {
  layTatCaDocGia: async (req, res, next) => {
    try {
      res.json(await docGiaService.getAll());
    } catch (err) { next(err); }
  },

  layDocGiaTheoMa: async (req, res, next) => {
    try {
      res.json(await docGiaService.getById(Number(req.params.ma_dg)));
    } catch (err) { next(err); }
  },

  themDocGia: async (req, res, next) => {
    try {
      const payload = createDocGiaSchema.parse(req.body);
      await docGiaService.create(payload);
      res.status(201).json({ message: "Thêm độc giả thành công!" });
    } catch (err) { next(err); }
  },

  suaDocGia: async (req, res, next) => {
    try {
      const ma_dg = Number(req.params.ma_dg);
      const payload = updateDocGiaSchema.parse(req.body);
      await docGiaService.update({ ma_dg, ...payload });
      res.json({ message: "Cập nhật độc giả thành công!" });
    } catch (err) { next(err); }
  },

  xoaDocGia: async (req, res, next) => {
    try {
      await docGiaService.delete(Number(req.params.ma_dg));
      res.json({ message: "Xóa độc giả thành công!" });
    } catch (e) { next(e); }
  },
};