"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import {
  type BlogPublishFilter,
  useAdminBlogs,
} from "@/features/blogs/hooks/use-blogs";
import {
  deleteAdminBlog,
  updateAdminBlog,
} from "@/features/blogs/services/blogs.service";
import type { BlogPost } from "@/features/blogs/types/blog.types";
import { formatDate, formatNumber } from "@/lib/utils";
import { BlogEditorModal } from "./blog-editor-modal";

const FILTER_OPTIONS: ReadonlyArray<{
  value: BlogPublishFilter;
  label: string;
}> = [
  { value: "all", label: "همه" },
  { value: "published", label: "منتشرشده" },
  { value: "draft", label: "پیش‌نویس" },
];

export function AdminBlogsSection() {
  const {
    items,
    total,
    offset,
    filter,
    currentPage,
    totalPages,
    loading,
    error,
    setFilter,
    goToPage,
    refetch,
  } = useAdminBlogs(20);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const rangeStart = total === 0 ? 0 : offset + 1;
  const rangeEnd = Math.min(offset + items.length, total);

  const openCreateModal = () => {
    setEditingBlog(null);
    setEditorOpen(true);
  };

  const openEditModal = (blog: BlogPost) => {
    setEditingBlog(blog);
    setEditorOpen(true);
  };

  const handleTogglePublish = async (blog: BlogPost) => {
    try {
      setActionError(null);
      setBusyId(blog.id);
      await updateAdminBlog(blog.id, { is_published: !blog.is_published });
      refetch();
    } catch (err: unknown) {
      setActionError(
        err instanceof Error ? err.message : "خطا در تغییر وضعیت انتشار مقاله."
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (blogId: string) => {
    try {
      setActionError(null);
      setBusyId(blogId);
      await deleteAdminBlog(blogId);
      setConfirmDeleteId(null);
      refetch();
    } catch (err: unknown) {
      setActionError(
        err instanceof Error ? err.message : "خطا در حذف مقاله."
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Banner & Controls */}
      <section className="flex flex-col gap-4 rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-iceLight text-brand-navy">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-brand-navy">
              مدیریت مقالات وبلاگ
            </h1>
            <p className="mt-0.5 text-xs text-brand-muted">
              مقالات منتشرشده در آدرس{" "}
              <Link
                href="/blogs"
                target="_blank"
                className="font-mono font-bold text-brand-green hover:underline"
                dir="ltr"
              >
                /blogs
              </Link>{" "}
              نمایش داده می‌شوند · مجموع:{" "}
              <strong className="font-mono text-brand-navy tabular-nums">
                {formatNumber(total, "fa-IR")}
              </strong>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center rounded-full border border-gray-200 bg-brand-cream p-1">
            {FILTER_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFilter(option.value)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  filter === option.value
                    ? "bg-brand-navy text-white"
                    : "text-brand-muted hover:text-brand-navy"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={refetch}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-brand-navy transition-colors hover:bg-brand-iceLight disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            />
            <span>بروزرسانی</span>
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-green px-5 py-2 text-xs font-bold text-brand-gold shadow-xs transition-colors hover:bg-brand-greenLight cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>نوشتن مقاله جدید</span>
          </button>
        </div>
      </section>

      {actionError && (
        <div
          role="alert"
          className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700"
        >
          {actionError}
        </div>
      )}

      {/* Main Content */}
      {loading ? (
        <div className="rounded-3xl border border-gray-200/80 bg-white shadow-xs">
          <LoadingState label="در حال دریافت مقالات..." />
        </div>
      ) : error ? (
        <ErrorState
          title="خطا در دریافت مقالات"
          message={error}
          onRetry={refetch}
        />
      ) : items.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="مقاله‌ای یافت نشد"
          description="هنوز مقاله‌ای در این بخش ثبت نشده است. روی دکمه «نوشتن مقاله جدید» کلیک کنید."
        />
      ) : (
        <section className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-right text-xs">
              <thead>
                <tr className="border-b border-gray-200/80 bg-brand-iceLight/60 text-[11px] font-bold text-brand-navy">
                  <th className="px-4 py-3.5">عنوان مقاله</th>
                  <th className="px-4 py-3.5">نامک (Slug)</th>
                  <th className="px-4 py-3.5">وضعیت</th>
                  <th className="px-4 py-3.5">نویسنده</th>
                  <th className="px-4 py-3.5">تاریخ</th>
                  <th className="px-4 py-3.5 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((blog) => {
                  const isBusy = busyId === blog.id;
                  const isConfirmingDelete = confirmDeleteId === blog.id;
                  return (
                    <tr
                      key={blog.id}
                      className="transition-colors hover:bg-brand-cream/70"
                    >
                      <td className="px-4 py-3.5 max-w-[260px]">
                        <div className="font-bold text-brand-navy truncate">
                          {blog.title}
                        </div>
                        {blog.summary && (
                          <div className="mt-0.5 text-[11px] text-brand-muted truncate">
                            {blog.summary}
                          </div>
                        )}
                      </td>

                      <td
                        className="px-4 py-3.5 font-mono text-[11px] text-brand-muted max-w-[180px] truncate"
                        dir="ltr"
                      >
                        {blog.slug}
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            blog.is_published
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {blog.is_published ? "منتشرشده" : "پیش‌نویس"}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-brand-navy font-medium">
                        {blog.author_name || "-"}
                      </td>

                      <td className="px-4 py-3.5 text-brand-muted tabular-nums">
                        {formatDate(
                          blog.published_at || blog.created_at,
                          "fa-IR"
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-center gap-1.5">
                          {blog.is_published && (
                            <Link
                              href={`/blogs/${encodeURIComponent(blog.slug)}`}
                              target="_blank"
                              title="مشاهده در سایت"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-brand-navy transition-colors hover:bg-brand-iceLight"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                          )}

                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleTogglePublish(blog)}
                            title={
                              blog.is_published
                                ? "تبدیل به پیش‌نویس"
                                : "انتشار مقاله"
                            }
                            className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-brand-navy transition-colors hover:bg-brand-iceLight disabled:opacity-50 cursor-pointer"
                          >
                            {blog.is_published ? (
                              <>
                                <EyeOff className="h-3.5 w-3.5" />
                                <span>پیش‌نویس</span>
                              </>
                            ) : (
                              <>
                                <Eye className="h-3.5 w-3.5" />
                                <span>انتشار</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => openEditModal(blog)}
                            className="inline-flex items-center gap-1 rounded-full border border-brand-navy/20 bg-white px-2.5 py-1 text-[11px] font-bold text-brand-navy transition-colors hover:bg-brand-navy hover:text-white disabled:opacity-50 cursor-pointer"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            <span>ویرایش</span>
                          </button>

                          {isConfirmingDelete ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => handleDelete(blog.id)}
                                className="rounded-full bg-rose-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
                              >
                                تایید حذف
                              </button>
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => setConfirmDeleteId(null)}
                                className="rounded-full border border-gray-200 bg-white px-2 py-1 text-[11px] font-semibold text-brand-muted hover:text-brand-navy cursor-pointer"
                              >
                                لغو
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => setConfirmDeleteId(blog.id)}
                              title="حذف مقاله"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-rose-200 bg-white text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-50 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100 bg-brand-cream/40 px-4 py-3.5 text-xs text-brand-muted">
            <div className="tabular-nums">
              نمایش{" "}
              <strong className="text-brand-navy">
                {formatNumber(rangeStart, "fa-IR")}
              </strong>{" "}
              تا{" "}
              <strong className="text-brand-navy">
                {formatNumber(rangeEnd, "fa-IR")}
              </strong>{" "}
              از{" "}
              <strong className="text-brand-navy">
                {formatNumber(total, "fa-IR")}
              </strong>{" "}
              مقاله
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1 || loading}
                className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-brand-navy transition-colors hover:bg-brand-iceLight disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
                <span>قبلی</span>
              </button>

              <span className="px-2 font-semibold text-brand-navy tabular-nums">
                صفحه {formatNumber(currentPage, "fa-IR")} از{" "}
                {formatNumber(totalPages, "fa-IR")}
              </span>

              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages || loading}
                className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-brand-navy transition-colors hover:bg-brand-iceLight disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>بعدی</span>
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      <BlogEditorModal
        open={editorOpen}
        blog={editingBlog}
        onClose={() => setEditorOpen(false)}
        onSaved={refetch}
      />
    </div>
  );
}
