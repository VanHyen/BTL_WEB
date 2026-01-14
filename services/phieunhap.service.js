// services/phieunhap.service.js
import { phieuNhapRepository } from "../repositories/phieunhap.repository.js";
import { nhaXuatBanRepository } from "../repositories/nhaxuatban.repository.js";
import { sachRepository } from "../repositories/sach.repository.js";
import { PhieuNhapDTO } from "../dtos/phieunhaps/phieunhap.dto.js";
import httpErrors from "http-errors";

export const phieuNhapService = {
  getAll: async () => {
    const data = await phieuNhapRepository.getAll();
    return data.map(item => new PhieuNhapDTO(item));
  },

  create: async (payload) => {
    // 1. Kiểm tra mã phiếu trùng
    if (await phieuNhapRepository.existsById(payload.ma_pn)) 
      throw httpErrors(400, "Mã phiếu nhập đã tồn tại!");

    // 2. Kiểm tra NXB tồn tại
    if (!(await nhaXuatBanRepository.existsById(payload.ma_nxb)))
      throw httpErrors(400, "Nhà xuất bản không tồn tại!");

    // 3. Kiểm tra Sách tồn tại
    if (!(await sachRepository.existsById(payload.ma_sach)))
      throw httpErrors(400, "Sách không tồn tại trong hệ thống!");

    await phieuNhapRepository.create(payload);
  },
  update: async (payload) => {
    const { ma_pn, ...newData } = payload;

    // 1. Kiểm tra phiếu nhập tồn tại
    const oldData = await phieuNhapRepository.getById(ma_pn);
    if (!oldData) throw httpErrors(404, "Phiếu nhập không tồn tại!");

    // 2. Nếu đổi NXB, kiểm tra NXB mới
    if (newData.ma_nxb && !(await nhaXuatBanRepository.existsById(newData.ma_nxb)))
      throw httpErrors(400, "Nhà xuất bản mới không tồn tại!");

    // 3. Nếu đổi Sách, kiểm tra Sách mới
    if (newData.ma_sach && !(await sachRepository.existsById(newData.ma_sach)))
      throw httpErrors(400, "Sách mới không tồn tại!");

    await phieuNhapRepository.update(ma_pn, oldData, newData);
  },
};