"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Calendar, User as UserIcon } from "lucide-react";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { formatDate } from "@/lib/utils";
import { usePublishedBlog } from "../hooks/use-blogs";
import { BlogCover } from "./blog-cover";

interface BlogDetailViewProps {
  slug: string;
}

export function BlogDetailView({ slug }: BlogDetailViewProps) {
  const { blog, loading, error, errorStatus, refetch } = usePublishedBlog(slug);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-gray-200/80 bg-white shadow-xs">
          <LoadingState label="در حال بارگذاری مقاله..." />
        </div>
      </div>
    );
  }

  if (errorStatus === 404 || (!loading && !error && !blog)) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-4 rounded-3xl border border-gray-200/80 bg-white p-8 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-iceLight text-brand-navy">
            <BookOpen className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-extrabold text-brand-navy">
            مقاله مورد نظر یافت نشد
          </h1>
          <p className="text-xs leading-relaxed text-brand-muted">
            ممکن است این مقاله حذف شده یا هنوز منتشر نشده باشد.
          </p>
          <div className="pt-2">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-green px-5 py-2.5 text-xs font-bold text-brand-gold transition-colors hover:bg-brand-greenLight"
            >
              <ArrowRight className="h-4 w-4" />
              <span>بازگشت به فهرست مقالات</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <ErrorState
          title="خطا در دریافت مقاله"
          message={error || "امکان بارگذاری مقاله وجود ندارد."}
          onRetry={refetch}
        />
      </div>
    );
  }

  const displayDate = blog.published_at || blog.created_at;

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-muted transition-colors hover:text-brand-navy"
        >
          <ArrowRight className="h-4 w-4" />
          <span>بازگشت به وبلاگ</span>
        </Link>
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-xs">
        {blog.cover_image_url && (
          <BlogCover
            src={blog.cover_image_url}
            alt={blog.title}
            className="h-64 w-full sm:h-96"
          />
        )}

        <div className="p-6 sm:p-10">
          <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-brand-muted">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-iceLight px-3 py-1 font-semibold text-brand-navy tabular-nums">
              <Calendar className="h-3.5 w-3.5 text-brand-green" />
              <span>{formatDate(displayDate, "fa-IR")}</span>
            </span>
            {blog.author_name && (
              <span className="inline-flex items-center gap-1.5 font-medium text-brand-navy">
                <UserIcon className="h-3.5 w-3.5 text-brand-goldDark" />
                <span>نویسنده: {blog.author_name}</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl font-extrabold leading-tight text-brand-navy sm:text-3xl">
            {blog.title}
          </h1>

          {blog.summary && (
            <p className="mt-4 rounded-2xl border border-brand-iceBlue/70 bg-brand-iceLight/50 p-4 text-sm font-medium leading-relaxed text-brand-navy/90">
              {blog.summary}
            </p>
          )}

          <div className="mt-8 border-t border-gray-100 pt-8 text-sm leading-8 text-brand-navy/90 whitespace-pre-line sm:text-[15px]">
            {blog.content}
          </div>
        </div>
      </div>
    </article>
  );
}
