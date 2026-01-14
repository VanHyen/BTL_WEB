// services/nhaxuatban.service.js
import { nhaXuatBanRepository } from "../repositories/nhaxuatban.repository.js";
import { NhaXuatBanDTO } from "../dtos/nhaxuatbans/nhaxuatban.dto.js";
import httpErrors from "http-errors";

export const nhaXuatBanService = {
  getAll: async () => {
    const data = await nhaXuatBanRepository.getAll();
    return data.map((nxb) => new NhaXuatBanDTO(nxb));
  },

  getById: async (ma_nxb) => {
    const nxb = await nhaXuatBanRepository.getById(ma_nxb);
    if (!nxb) throw httpErrors(404, "Không tìm thấy nhà xuất bản");
    return new NhaXuatBanDTO(nxb);
  },

  create: async (data) => {
    const exists = await nhaXuatBanRepository.existsById(data.ma_nxb);
    if (exists) throw httpErrors(400, "Mã nhà xuất bản đã tồn tại");
    await nhaXuatBanRepository.create(data);
  },

  update: async (payload) => {
    const { ma_nxb, ...data } = payload;
    const exists = await nhaXuatBanRepository.existsById(ma_nxb);
    if (!exists) throw httpErrors(404, "Nhà xuất bản không tồn tại!");

    const affected = await nhaXuatBanRepository.update({ ma_nxb, ...data });
    if (affected === 0) throw httpErrors(400, "Không có dữ liệu nào được cập nhật!");
  },

  delete: async (ma_nxb) => {
    if (!(await nhaXuatBanRepository.existsById(ma_nxb))) 
      throw httpErrors(404, "Nhà xuất bản không tồn tại");

    if (await nhaXuatBanRepository.existsInSach(ma_nxb)) {
      throw httpErrors(409, "Không thể xóa: Nhà xuất bản đang có sách trong kho");
    }

    if (await nhaXuatBanRepository.existsInPhieuNhap(ma_nxb)) {
      throw httpErrors(409, "Không thể xóa: Nhà xuất bản đã có phiếu nhập hàng");
    }

    await nhaXuatBanRepository.deleteById(ma_nxb);
  },
};