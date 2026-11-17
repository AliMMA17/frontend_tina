import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "وارد کردن ایمیل الزامی است")
    .email("لطفاً یک ایمیل معتبر وارد کنید"),
  password: z
    .string()
    .min(1, "وارد کردن رمز عبور الزامی است")
    .min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

export type LoginInput = z.infer<typeof loginSchema>;
