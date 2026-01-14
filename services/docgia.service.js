// services/docgia.service.js
import { docGiaRepository } from "../repositories/docgia.repository.js";
import { DocGiaDTO } from "../dtos/docgias/docgia.dto.js";
import httpErrors from "http-errors";
import { logger } from "../config/logger.js";

export const docGiaService = {
  getAll: async () => {
    logger.info("Service: Get all DocGia");
    const data = await docGiaRepository.getAll();
    return data.map((dg) => new DocGiaDTO(dg));
  },

  getById: async (ma_dg) => {
    const dg = await docGiaRepository.getById(ma_dg);
    if (!dg) throw httpErrors(404, "Không tìm thấy độc giả");
    return new DocGiaDTO(dg);
  },

  create: async (data) => {
    const exists = await docGiaRepository.existsById(data.ma_dg);
    if (exists) throw httpErrors(400, "Mã độc giả đã tồn tại");
    await docGiaRepository.create(data);
  },

  update: async (payload) => {
    const { ma_dg, ...data } = payload;
    const dg = await docGiaRepository.getById(ma_dg);
    if (!dg) throw httpErrors(404, "Độc giả không tồn tại!");

    const affected = await docGiaRepository.update({ ma_dg, ...data });
    if (affected === 0) throw httpErrors(400, "Không có dữ liệu nào được cập nhật!");
  },

  delete: async (ma_dg) => {
    if (!(await docGiaRepository.existsById(ma_dg))) 
      throw httpErrors(404, "Độc giả không tồn tại");

    if (await docGiaRepository.existsInPhieuMuon(ma_dg)) {
      throw httpErrors(409, "Không thể xóa: Độc giả đang có phiếu mượn sách");
    }

    await docGiaRepository.deleteById(ma_dg);
  },
};