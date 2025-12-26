import { danhmucService } from "../services/danhmuc.service.js";
import { logger } from "../config/logger.js";

export const danhmucController = {
  getAll: async (req, res) => {
    try {
      logger.info("Controller: GET /users");
      const danhmucs = await danhmucService.getAllDanhmuc();
      res.json(danhmucs);
    } catch (err) {
      logger.error("Controller Error: getAll failed", err);
      res.status(500).json({ message: err.message });
    }
  },
};
