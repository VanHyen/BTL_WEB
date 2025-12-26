import { z } from 'zod';

export const updateBorrowSchema = z.object({
  status: z.enum(['BORROWED', 'RETURNED', 'OVERDUE']).optional(),
  due_date: z.string().datetime().optional(),
});

export function validateUpdateBorrow(data) {
  return updateBorrowSchema.parse(data);
}