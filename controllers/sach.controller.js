// controllers/sach.controller.js
import { sachService } from "../services/sach.service.js";
import { createSachSchema } from "../validators/sachs/create-sach.validator.js";
import { updateSachSchema } from "../validators/sachs/update-sach.validator.js";

export const sachController = {
  layTatCaSach: async (req, res, next) => {
    try { res.json(await sachService.getAll()); } catch (e) { next(e); }
  },

  laySachTheoMa: async (req, res, next) => {
    try { res.json(await sachService.getById(Number(req.params.ma_sach))); } catch (e) { next(e); }
  },

  themSach: async (req, res, next) => {
    try {
      const payload = createSachSchema.parse(req.body);
      await sachService.create(payload);
      res.status(201).json({ message: "Thêm sách thành công!" });
    } catch (e) { next(e); }
  },

  suaSach: async (req, res, next) => {
    try {
      const ma_sach = Number(req.params.ma_sach);
      const parsed = updateSachSchema.parse(req.body);
      await sachService.update({ ma_sach, ...parsed });
      res.json({ message: "Cập nhật thành công!" });
    } catch (e) { next(e); }
  },

  xoaSach: async (req, res, next) => {
    try {
      await sachService.delete(Number(req.params.ma_sach));
      res.json({ message: "Xóa sách thành công!" });
    } catch (e) { next(e); }
  },
  laySachTheoTheLoai: async (req, res, next) => {
    try {
      const ma_tl = Number(req.params.ma_the_loai);
      res.json(await sachService.getByTheLoai(ma_tl));
    } catch (e) { next(e); }
  },
};