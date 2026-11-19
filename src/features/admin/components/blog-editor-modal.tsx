"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  FileText,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import {
  blogFormSchema,
  type BlogFormInput,
} from "@/features/blogs/schemas/blog.schema";
import {
  createAdminBlog,
  updateAdminBlog,
  uploadBlogImage,
} from "@/features/blogs/services/blogs.service";
import type { BlogPost } from "@/features/blogs/types/blog.types";
import { sanitizeBlogHtml } from "@/features/blogs/utils/rich-content";
import { ApiError } from "@/lib/api-client";
import { resolveMediaUrl } from "@/lib/env";
import { RichTextEditor } from "./rich-text-editor";

interface BlogEditorModalProps {
  open: boolean;
  blog: BlogPost | null;
  onClose: () => void;
  onSaved: () => void;
}

export function BlogEditorModal({
  open,
  blog,
  onClose,
  onSaved,
}: BlogEditorModalProps) {
  const [apiError, setApiError] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [editorSessionKey, setEditorSessionKey] = useState("new");

  const coverFileInputRef = useRef<HTMLInputElement | null>(null);
  const isEditing = blog !== null;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<BlogFormInput>({
    resolver: zodResolver(blogFormSchema),
    mode: "onTouched",
    defaultValues: {
      title: "",
      slug: "",
      summary: "",
      cover_image_url: "",
      content: "",
      is_published: true,
    },
  });

  const coverPreviewUrl = resolveMediaUrl(watch("cover_image_url"));

  useEffect(() => {
    if (!open) return;
    setApiError(null);
    setEditorSessionKey(`${blog?.id ?? "new"}-${Date.now()}`);
    reset({
      title: blog?.title ?? "",
      slug: blog?.slug ?? "",
      summary: blog?.summary ?? "",
      cover_image_url: blog?.cover_image_url ?? "",
      content: blog?.content ?? "",
      is_published: blog?.is_published ?? true,
    });
  }, [open, blog, reset]);

  if (!open) return null;

  const isBusy = isSubmitting || uploadingCover;

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    try {
      setApiError(null);
      setUploadingCover(true);
      const uploaded = await uploadBlogImage(file);
      setValue("cover_image_url", uploaded.url, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } catch (err: unknown) {
      setApiError(
        err instanceof Error ? err.message : "آپلود تصویر کاور ناموفق بود."
      );
    } finally {
      setUploadingCover(false);
    }
  };

  const onSubmit = async (values: BlogFormInput) => {
    const sanitizedContent = sanitizeBlogHtml(values.content, {
      resolveImages: false,
    }).trim();

    try {
      setApiError(null);
      if (isEditing && blog) {
        await updateAdminBlog(blog.id, {
          title: values.title.trim(),
          slug: values.slug.trim() || undefined,
          summary: values.summary.trim() || null,
          cover_image_url: values.cover_image_url.trim() || null,
          content: sanitizedContent,
          is_published: values.is_published,
        });
      } else {
        await createAdminBlog({
          title: values.title.trim(),
          slug: values.slug.trim() || null,
          summary: values.summary.trim() || null,
          cover_image_url: values.cover_image_url.trim() || null,
          content: sanitizedContent,
          is_published: values.is_published,
        });
      }
      onSaved();
      onClose();
    } catch (err: unknown) {
      if (err instanceof ApiError && err.fieldErrors) {
        for (const [field, msg] of Object.entries(err.fieldErrors)) {
          if (field in values) {
            setError(field as keyof BlogFormInput, { message: msg });
          }
        }
      }
      setApiError(
        err instanceof Error ? err.message : "ذخیره مقاله با خطا مواجه شد."
      );
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="blog-editor-modal-title"
      className="fixed inset-0 z-50 flex items-start justify-center bg-brand-navy/60 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative my-6 w-full max-w-4xl rounded-3xl border border-brand-gold/30 bg-brand-cream p-6 sm:p-8 shadow-2xl text-right"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          disabled={isBusy}
          aria-label="بستن فرم مقاله"
          className="absolute top-5 left-5 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-brand-navy hover:bg-brand-iceLight transition-colors cursor-pointer disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-6 flex items-center gap-3 pr-1">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-green text-brand-gold">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h2
              id="blog-editor-modal-title"
              className="text-lg font-extrabold text-brand-navy"
            >
              {isEditing ? "ویرایش مقاله" : "نوشتن مقاله جدید"}
            </h2>
            <p className="text-xs text-brand-muted">
              {isEditing
                ? "متن، قالب‌بندی و تصاویر مقاله را ویرایش و ذخیره کنید."
                : "مقاله جدید را با ویرایشگر تعاملی بنویسید و منتشر کنید."}
            </p>
          </div>
        </div>

        {apiError && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-xs text-rose-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <label
              htmlFor="blog-title"
              className="block text-xs font-semibold text-brand-navy"
            >
              عنوان مقاله *
            </label>
            <input
              id="blog-title"
              type="text"
              disabled={isBusy}
              placeholder="مثال: راهنمای کامل استفاده از نیاسینامید"
              {...register("title")}
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-brand-navy outline-none focus:border-brand-green disabled:opacity-50"
            />
            {errors.title && (
              <p className="text-xs font-medium text-rose-600">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="blog-slug"
                className="block text-xs font-semibold text-brand-navy"
              >
                نامک آدرس (Slug - اختیاری)
              </label>
              <input
                id="blog-slug"
                type="text"
                dir="ltr"
                disabled={isBusy}
                placeholder="niacinamide-guide"
                {...register("slug")}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-left font-mono text-xs text-brand-navy outline-none focus:border-brand-green disabled:opacity-50"
              />
              {errors.slug ? (
                <p className="text-xs font-medium text-rose-600">
                  {errors.slug.message}
                </p>
              ) : (
                <p className="text-[11px] text-brand-muted">
                  در صورت خالی بودن، خودکار از عنوان ساخته می‌شود.
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="blog-cover"
                  className="block text-xs font-semibold text-brand-navy"
                >
                  تصویر کاور (آپلود یا لینک)
                </label>
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => coverFileInputRef.current?.click()}
                  className="inline-flex items-center gap-1 rounded-full bg-brand-iceLight px-2.5 py-1 text-[11px] font-bold text-brand-navy transition-colors hover:bg-brand-iceBlue disabled:opacity-50 cursor-pointer"
                >
                  {uploadingCover ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Upload className="h-3 w-3" />
                  )}
                  <span>{uploadingCover ? "در حال آپلود..." : "آپلود عکس"}</span>
                </button>
                <input
                  ref={coverFileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleCoverUpload}
                />
              </div>
              <input
                id="blog-cover"
                type="text"
                dir="ltr"
                disabled={isBusy}
                placeholder="/uploads/... یا https://..."
                {...register("cover_image_url")}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-left font-mono text-xs text-brand-navy outline-none focus:border-brand-green disabled:opacity-50"
              />
              {errors.cover_image_url && (
                <p className="text-xs font-medium text-rose-600">
                  {errors.cover_image_url.message}
                </p>
              )}
            </div>
          </div>

          {coverPreviewUrl && (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverPreviewUrl}
                alt="پیش‌نمایش کاور"
                className="h-40 w-full rounded-xl object-cover"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label
              htmlFor="blog-summary"
              className="block text-xs font-semibold text-brand-navy"
            >
              خلاصه مقاله (اختیاری)
            </label>
            <textarea
              id="blog-summary"
              rows={2}
              disabled={isBusy}
              placeholder="توضیح کوتاه برای نمایش در کارت‌های صفحه وبلاگ..."
              {...register("summary")}
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-brand-navy outline-none focus:border-brand-green disabled:opacity-50"
            />
            {errors.summary && (
              <p className="text-xs font-medium text-rose-600">
                {errors.summary.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <span className="block text-xs font-semibold text-brand-navy">
              متن کامل مقاله *
            </span>
            <RichTextEditor
              editorKey={editorSessionKey}
              initialValue={blog?.content ?? ""}
              disabled={isBusy}
              onChange={(html) =>
                setValue("content", html, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              onError={(msg) => setApiError(msg)}
            />
            {errors.content && (
              <p className="text-xs font-medium text-rose-600">
                {errors.content.message}
              </p>
            )}
          </div>

          <label className="flex items-center gap-2.5 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-xs font-semibold text-brand-navy cursor-pointer">
            <input
              type="checkbox"
              disabled={isBusy}
              {...register("is_published")}
              className="h-4 w-4 accent-brand-green cursor-pointer"
            />
            <span>
              انتشار عمومی مقاله (برای تمام بازدیدکنندگان در /blogs قابل مشاهده باشد)
            </span>
          </label>

          <div className="flex flex-col-reverse gap-2.5 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isBusy}
              className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-brand-navy transition-colors hover:bg-brand-iceLight disabled:opacity-50 cursor-pointer"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isBusy}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-green px-6 py-2.5 text-xs font-bold text-brand-gold shadow-sm transition-colors hover:bg-brand-greenLight disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>
                {isSubmitting
                  ? "در حال ذخیره..."
                  : isEditing
                  ? "ذخیره تغییرات"
                  : "ثبت مقاله"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
