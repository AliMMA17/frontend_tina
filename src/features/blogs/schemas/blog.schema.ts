import { z } from "zod";
import { hasMeaningfulHtmlContent } from "../utils/rich-content";

export const blogFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "عنوان مقاله الزامی است.")
    .max(255, "عنوان نباید بیشتر از ۲۵۵ کاراکتر باشد."),
  slug: z
    .string()
    .trim()
    .max(280, "نامک نباید بیشتر از ۲۸۰ کاراکتر باشد.")
    .refine((val) => val.toLowerCase() !== "admin", {
      message: "نامک «admin» رزرو شده است.",
    }),
  summary: z
    .string()
    .trim()
    .max(500, "خلاصه نباید بیشتر از ۵۰۰ کاراکتر باشد."),
  cover_image_url: z
    .string()
    .trim()
    .max(1000, "آدرس تصویر نباید بیشتر از ۱۰۰۰ کاراکتر باشد.")
    .refine(
      (val) =>
        val === "" ||
        val.startsWith("http://") ||
        val.startsWith("https://") ||
        val.startsWith("/"),
      {
        message: "آدرس تصویر باید با http://، https:// یا / شروع شود.",
      }
    ),
  content: z
    .string()
    .refine((val) => hasMeaningfulHtmlContent(val), {
      message: "متن مقاله الزامی است.",
    }),
  is_published: z.boolean(),
});

export type BlogFormInput = z.infer<typeof blogFormSchema>;
