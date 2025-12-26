import { z } from 'zod';

export const createBorrowSchema = z.object({
  user_id: z.number({ required_error: 'User ID is required' }),
  due_date: z.string({ required_error: 'Due date is required' }),
  items: z.array(z.object({
    book_id: z.number(),
    qty: z.number().min(1).default(1)
  })).min(1, "Phải mượn ít nhất 1 cuốn sách")
});

export function validateCreateBorrow(data) {
  return createBorrowSchema.parse(data);
}