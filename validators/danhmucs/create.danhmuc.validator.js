import { z } from 'zod';

export const createDanhMucSchema = z.object({
    MaDanhMuc: z.number({ required_error: 'Mã danh mục là bắt buộc' }),
    TenDanhMuc: z.string({ required_error: 'Tên danh mục không được để trống' }).max(255),
});

export function validateCreateDanhMuc(data) {
    return createDanhMucSchema.parse(data);
}