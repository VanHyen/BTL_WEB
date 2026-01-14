// services/phieumuon.service.js
import { phieuMuonRepository } from "../repositories/phieumuon.repository.js";
import { PhieuMuonDTO } from "../dtos/phieumuons/phieumuon.dto.js";
import httpErrors from "http-errors";

export const phieuMuonService = {
  getAll: async () => {
    const data = await phieuMuonRepository.getAll();
    return data.map((pm) => new PhieuMuonDTO(pm));
  },

  getById: async (ma_pm) => {
    const pm = await phieuMuonRepository.getById(ma_pm);
    if (!pm) throw httpErrors(404, "Không tìm thấy phiếu mượn");
    return new PhieuMuonDTO(pm);
  },

  getByDocGia: async (ma_dg) => {
    const rows = await phieuMuonRepository.getByDocGia(ma_dg);
    if (!rows.length) throw httpErrors(404, "Độc giả này chưa có phiếu mượn nào");
    return rows.map((pm) => new PhieuMuonDTO(pm));
  },

  create: async (data) => {
    const exists = await phieuMuonRepository.existsById(data.ma_pm);
    if (exists) throw httpErrors(400, "Mã phiếu mượn đã tồn tại");
    await phieuMuonRepository.create({
      ...data,
      tong_tien_coc: data.tong_tien_coc || 0,
    });
  },

  getChiTiet: async (ma_pm) => {
    const rows = await phieuMuonRepository.getChiTietByMaPM(ma_pm);
    if (!rows.length) throw httpErrors(404, "Phiếu mượn chưa có chi tiết sách mượn");
    const tongTienCoc = await phieuMuonRepository.updateTongTienCocByMaPM(ma_pm);
    return {
      ma_phieu_muon: ma_pm,
      tong_tien_coc: tongTienCoc,
      so_luong_sach: rows.length,
      danh_sach_muon: rows,
    };
  },

  delete: async (ma_pm) => {
    if (!(await phieuMuonRepository.existsById(ma_pm))) throw httpErrors(404, "Phiếu mượn không tồn tại");
    if (await phieuMuonRepository.existsInChiTiet(ma_pm)) {
      throw httpErrors(409, "Không thể xóa: Phiếu mượn đang chứa danh sách sách chi tiết");
    }
    await phieuMuonRepository.deleteById(ma_pm);
  }
};