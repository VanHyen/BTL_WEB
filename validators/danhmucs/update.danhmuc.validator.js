import { z } from 'zod';

export const updateDanhMucSchema = z.object({
    MaDanhMuc: z.number({ required_error: 'Mã danh mục là bắt buộc' }),
    TenDanhMuc: z.string({ required_error: 'Tên danh mục không được để trống' }).max(255),
});

export function validateUpdateDanhMuc(data) {
    return updateDanhMucSchema.parse(data);
}