// services/sach.service.js
import httpErrors from "http-errors";
import { sachRepository } from "../repositories/sach.repository.js";
import { SachDTO } from "../dtos/sachs/sach.dto.js";

export const sachService = {
  getAll: async () => (await sachRepository.getAll()).map(s => new SachDTO(s)),

  getById: async (ma) => {
    const s = await sachRepository.getById(ma);
    if (!s) throw httpErrors(404, "Không tìm thấy sách!");
    return new SachDTO(s);
  },

  create: async (payload) => {
    payload.so_luong_ton = 0; // Luôn bắt đầu bằng 0, tăng qua phiếu nhập
    if (await sachRepository.existsById(payload.ma_sach)) throw httpErrors(400, "Mã sách đã tồn tại!");
    if (!(await sachRepository.checkTheLoai(payload.ma_the_loai))) throw httpErrors(400, "Thể loại không tồn tại!");
    if (!(await sachRepository.checkNXB(payload.ma_nxb))) throw httpErrors(400, "Nhà xuất bản không tồn tại!");
    
    await sachRepository.create(payload);
  },

  update: async (payload) => {
    const { ma_sach, ...data } = payload;
    const s = await sachRepository.getById(ma_sach);
    if (!s) throw httpErrors(404, "Sách không tồn tại!");

    // Kiểm tra giá bìa vs giá nhập
    const giaNhapMoi = data.gia_nhap ?? s.gia_nhap;
    const giaBiaMoi = data.gia_bia ?? s.gia_bia;
    if (giaBiaMoi <= giaNhapMoi) throw httpErrors(400, "Giá bìa phải lớn hơn giá nhập!");

    const affected = await sachRepository.update({ ma_sach, ...data });
    if (affected === 0) throw httpErrors(400, "Cập nhật thất bại!");
  },

  delete: async (ma) => {
    if (!(await sachRepository.existsById(ma))) throw httpErrors(404, "Sách không tồn tại!");
    if (await sachRepository.existsInPhieuMuon(ma)) throw httpErrors(409, "Không thể xóa sách đang có trong phiếu mượn!");
    await sachRepository.deleteById(ma);
  },
  getByTheLoai: async (ma) => {
    const rows = await sachRepository.getByTheLoai(ma);
    if (!rows.length) throw httpErrors(404, "Không có sách thuộc thể loại này!");
    return rows;
  },
};