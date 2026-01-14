// services/theloai.service.js
import httpErrors from "http-errors";
import { theLoaiRepository } from "../repositories/theloai.repository.js";
import { TheLoaiDTO } from "../dtos/theloais/theloai.dto.js";
import { logger } from "../config/logger.js";

export const theLoaiService = {
  getAll: async () => {
    logger.info("Service: Lấy tất cả thể loại");
    const data = await theLoaiRepository.getAll();
    return data.map(tl => new TheLoaiDTO(tl));
  },

  getById: async (maTheLoai) => {
    const tl = await theLoaiRepository.getById(maTheLoai);
    if (!tl) throw httpErrors(404, "Không tìm thấy thể loại!");
    return new TheLoaiDTO(tl);
  },

  create: async (payload) => {
    const exists = await theLoaiRepository.existsById(payload.ma_the_loai);
    if (exists) throw httpErrors(400, "Mã thể loại đã tồn tại!");
    await theLoaiRepository.create(payload);
  },

  update: async (payload) => {
    const { ma_the_loai, ten_the_loai, mo_ta } = payload;

    if (!ma_the_loai || isNaN(ma_the_loai))
      throw httpErrors(400, "Mã thể loại không hợp lệ!");

    const affected = await theLoaiRepository.update({
      ma_the_loai,
      ten_the_loai,
      mo_ta,
    });

    if (affected === 0) throw httpErrors(404, "Thể loại không tồn tại!");
  },

  delete: async (ma_the_loai) => {
    const exists = await theLoaiRepository.existsById(ma_the_loai);
    if (!exists) throw httpErrors(404, "Thể loại không tồn tại");

    if (await theLoaiRepository.existsInSach(ma_the_loai)) {
      throw httpErrors(409, "Không thể xóa: Thể loại đang chứa sách");
    }

    await theLoaiRepository.deleteById(ma_the_loai);
  },
};