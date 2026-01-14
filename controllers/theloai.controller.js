// controllers/theloai.controller.js
import { theLoaiService } from "../services/theloai.service.js";
import { createTheLoaiSchema } from "../validators/theloais/create-theloai.validator.js";

export const theLoaiController = {
  layTatCaTheLoai: async (req, res, next) => {
    try {
      res.json(await theLoaiService.getAll());
    } catch (err) { next(err); }
  },

  layTheLoaiTheoMa: async (req, res, next) => {
    try {
      const ma = Number(req.params.ma_the_loai);
      res.json(await theLoaiService.getById(ma));
    } catch (err) { next(err); }
  },

  themTheLoai: async (req, res, next) => {
    try {
      const payload = createTheLoaiSchema.parse(req.body);
      await theLoaiService.create(payload);
      res.status(201).json({ message: "Thêm thể loại thành công!" });
    } catch (err) { next(err); }
  },

  suaTheLoai: async (req, res, next) => {
    try {
      const ma = Number(req.params.ma_the_loai);
      await theLoaiService.update({ ...req.body, ma_the_loai: ma });
      res.json({ message: "Cập nhật thể loại thành công!" });
    } catch (err) { next(err); }
  },

  xoaTheLoai: async (req, res, next) => {
    try {
      const ma = Number(req.params.ma_the_loai);
      await theLoaiService.delete(ma);
      res.json({ message: "Xóa thể loại thành công!" });
    } catch (e) { next(e); }
  },
};