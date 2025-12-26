import { z } from 'zod';

export const updateBookSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  author: z.string().min(1).max(150).optional(),
  total_copies: z.coerce.number().min(0).optional(),
  category_id: z.number().optional().nullable(),
});

export function validateUpdateBook(data) {
  return updateBookSchema.parse(data);
}