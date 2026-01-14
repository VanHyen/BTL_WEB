// services/tonkho.service.js
import tonKhoRepository from "../repositories/tonkho.repository.js";

const tonKhoService = {
  getAll: async () => {
    return await tonKhoRepository.getAll();
  }
};

export default tonKhoService;