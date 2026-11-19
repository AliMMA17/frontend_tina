import { z } from "zod";

const NO_WHITESPACE_RE = /^\S+$/;
const ENGLISH_PHONE_RE = /^\+?[0-9]{5,20}$/;

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "وارد کردن نام کاربری الزامی است")
    .max(150, "نام کاربری نباید بیشتر از ۱۵۰ کاراکتر باشد")
    .regex(NO_WHITESPACE_RE, "نام کاربری نباید شامل فاصله (Space) باشد"),
  password: z
    .string()
    .min(1, "وارد کردن رمز عبور الزامی است")
    .max(128, "رمز عبور نباید بیشتر از ۱۲۸ کاراکتر باشد"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "نام کاربری باید حداقل ۳ کاراکتر باشد")
    .max(150, "نام کاربری نباید بیشتر از ۱۵۰ کاراکتر باشد")
    .regex(NO_WHITESPACE_RE, "نام کاربری نباید شامل فاصله (Space) باشد"),
  password: z
    .string()
    .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
    .max(128, "رمز عبور نباید بیشتر از ۱۲۸ کاراکتر باشد"),
  full_name: z
    .string()
    .trim()
    .min(1, "وارد کردن نام و نام خانوادگی الزامی است")
    .max(255, "نام و نام خانوادگی نباید بیشتر از ۲۵۵ کاراکتر باشد"),
  phone_number: z
    .string()
    .trim()
    .min(5, "شماره تماس باید حداقل ۵ رقم باشد")
    .max(20, "شماره تماس نباید بیشتر از ۲۰ رقم باشد")
    .regex(
      ENGLISH_PHONE_RE,
      "شماره تماس باید فقط با اعداد انگلیسی (0-9) وارد شود"
    ),
  full_address: z
    .string()
    .trim()
    .min(1, "وارد کردن آدرس کامل الزامی است")
    .max(1000, "آدرس نباید بیشتر از ۱۰۰۰ کاراکتر باشد"),
  job: z
    .string()
    .trim()
    .min(1, "وارد کردن شغل یا تخصص الزامی است")
    .max(255, "شغل نباید بیشتر از ۲۵۵ کاراکتر باشد"),
  work_page: z
    .string()
    .trim()
    .max(500, "آدرس صفحه کاری نباید بیشتر از ۵۰۰ کاراکتر باشد")
    .optional()
    .or(z.literal("")),
  income: z
    .string()
    .trim()
    .max(255, "مقدار درآمد نباید بیشتر از ۲۵۵ کاراکتر باشد")
    .optional()
    .or(z.literal("")),
});

export type RegisterInput = z.infer<typeof registerSchema>;
