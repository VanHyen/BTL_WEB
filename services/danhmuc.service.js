import { danhmucRepository } from "../repositories/danhmuc.repository.js";
import { DanhMucDTO } from "../dtos/danhmucs/danhmuc.dto.js";
import { logger } from "../config/logger.js";

export const danhmucService = {
  getAllDanhmuc: async () => {
    logger.info("Service: Getting all danhmucs");
    const danhmucs = await danhmucRepository.getAll();
    return danhmucs.map((u) => new DanhMucDTO(u));
  },
};
