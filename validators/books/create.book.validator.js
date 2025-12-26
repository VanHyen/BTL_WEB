import { z } from 'zod';

export const createBookSchema = z.object({
  title: z.string().min(1, "Tên sách không được để trống").max(200),
  author: z.string().min(1, "Tác giả không được để trống").max(150),
  total_copies: z.coerce.number().min(1, "Số lượng phải ít nhất là 1"),
  category_id: z.number().optional()
});

export function validateCreateBook(data) {
  return createBookSchema.parse(data);
}