// controllers/nhaxuatban.controller.js
import { nhaXuatBanService } from "../services/nhaxuatban.service.js";
import { createNhaXuatBanSchema } from "../validators/nhaxuatbans/create-nhaxuatban.validator.js";
import { updateNhaXuatBanSchema } from "../validators/nhaxuatbans/update-nhaxuatban.validator.js";

export const nhaXuatBanController = {
  layTatCaNhaXuatBan: async (req, res, next) => {
    try {
      res.json(await nhaXuatBanService.getAll());
    } catch (err) { next(err); }
  },

  layNXBTheoMa: async (req, res, next) => {
    try {
      res.json(await nhaXuatBanService.getById(Number(req.params.ma_nxb)));
    } catch (err) { next(err); }
  },

  themNhaXuatBan: async (req, res, next) => {
    try {
      const payload = createNhaXuatBanSchema.parse(req.body);
      await nhaXuatBanService.create(payload);
      res.status(201).json({ message: "Thêm nhà xuất bản thành công!" });
    } catch (err) { next(err); }
  },

  suaNhaXuatBan: async (req, res, next) => {
    try {
      const ma_nxb = Number(req.params.ma_nxb);
      const payload = updateNhaXuatBanSchema.parse(req.body);
      await nhaXuatBanService.update({ ma_nxb, ...payload });
      res.json({ message: "Cập nhật nhà xuất bản thành công!" });
    } catch (err) { next(err); }
  },

  xoaNhaXuatBan: async (req, res, next) => {
    try {
      await nhaXuatBanService.delete(Number(req.params.ma_nxb));
      res.json({ message: "Xóa nhà xuất bản thành công!" });
    } catch (e) { next(e); }
  },
};