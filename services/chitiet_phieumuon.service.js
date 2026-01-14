// services/chitiet_phieumuon.service.js
import httpErrors from "http-errors";
import { chiTietPhieuMuonRepository } from "../repositories/chitiet_phieumuon.repository.js";
import { ChiTietPhieuMuonDTO } from "../dtos/chitiet_phieumuons/chitiet_phieumuon.dto.js";
import { sachRepository } from "../repositories/sach.repository.js";

export const chiTietPhieuMuonService = {
  getAll: async () => {
    const data = await chiTietPhieuMuonRepository.getAll();
    return data.map(ct => new ChiTietPhieuMuonDTO(ct));
  },

  create: async (data) => {
    const { ma_sach, so_luong } = data;

    // 1. Kiểm tra sách tồn tại và lấy thông tin kho
    const sach = await sachRepository.getById(ma_sach);
    if (!sach) throw httpErrors(400, "Sách không tồn tại");

    // 2. Kiểm tra số lượng tồn trong kho
    if (so_luong > sach.so_luong_ton) {
      throw httpErrors(400, `Thư viện không đủ sách, hiện còn: ${sach.so_luong_ton}`);
    }

    // 3. Thêm chi tiết mượn sách
    await chiTietPhieuMuonRepository.create(data);
  },

  update: async (payload) => {
    const { ma_ctpm, ...data } = payload;
    if (!(await chiTietPhieuMuonRepository.getById(ma_ctpm))) {
      throw httpErrors(404, "Chi tiết phiếu mượn không tồn tại!");
    }

    if (data.ma_pm && !(await chiTietPhieuMuonRepository.existsPhieuMuon(data.ma_pm))) {
      throw httpErrors(400, "Phiếu mượn không tồn tại!");
    }

    const affected = await chiTietPhieuMuonRepository.update({ ma_ctpm, ...data });
    if (affected === 0) throw httpErrors(400, "Không có thay đổi nào!");
  },

  delete: async (ma) => {
    const affected = await chiTietPhieuMuonRepository.deleteById(ma);
    if (affected === 0) throw httpErrors(404, "Chi tiết phiếu mượn không tồn tại");
  }
};