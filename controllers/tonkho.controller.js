// controllers/tonkho.controller.js
import tonKhoService from "../services/tonkho.service.js";

export const layTonKho = async (req, res) => {
  try {
    const data = await tonKhoService.getAll();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi lấy tồn kho sách trong thư viện" });
  }
};