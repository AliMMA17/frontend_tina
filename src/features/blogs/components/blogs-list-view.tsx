"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
} from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { formatDate, formatNumber } from "@/lib/utils";
import { stripHtmlToText } from "../utils/rich-content";
import { usePublishedBlogs } from "../hooks/use-blogs";
import { BlogCover } from "./blog-cover";

export function BlogsListView() {
  const {
    items,
    total,
    currentPage,
    totalPages,
    loading,
    error,
    goToPage,
    refetch,
  } = usePublishedBlogs(12);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Editorial Page Header */}
      <div className="mb-10 flex flex-col gap-4 border-b border-gray-200/80 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-iceBlue bg-brand-iceLight px-3.5 py-1 text-[11px] font-bold text-brand-navy">
            <BookOpen className="h-3.5 w-3.5" />
            <span>مجله علمی پوست</span>
          </span>
          <h1 className="mt-3 text-3xl font-extrabold text-brand-navy sm:text-4xl">
            وبلاگ و مقالات تینا فلاح
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-muted">
            مقالات علمی و کاربردی درباره شناخت پوست، مواد فعال، روتین اصولی و
            اسکین‌تراپی به زبان ساده.
          </p>
        </div>

        {!loading && !error && total > 0 && (
          <div className="self-start rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-brand-muted sm:self-auto tabular-nums">
            مجموع مقالات:{" "}
            <strong className="text-brand-navy">
              {formatNumber(total, "fa-IR")}
            </strong>
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="rounded-3xl border border-gray-200/80 bg-white shadow-xs">
          <LoadingState label="در حال بارگذاری مقالات..." />
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
          title="هنوز مقاله‌ای منتشر نشده است"
          description="به‌زودی مقالات علمی و تخصصی پوست در این بخش منتشر خواهند شد."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
            {items.map((blog) => {
              const displayDate = blog.published_at || blog.created_at;
              return (
                <article
                  key={blog.id}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <Link
                    href={`/blogs/${encodeURIComponent(blog.slug)}`}
                    className="block"
                  >
                    <BlogCover
                      src={blog.cover_image_url}
                      alt={blog.title}
                      className="h-52 w-full"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-3 flex flex-wrap items-center gap-3 text-[11px] text-brand-muted">
                      <span className="inline-flex items-center gap-1 tabular-nums">
                        <Calendar className="h-3.5 w-3.5 text-brand-goldDark" />
                        <span>{formatDate(displayDate, "fa-IR")}</span>
                      </span>
                      {blog.author_name && (
                        <span className="inline-flex items-center gap-1">
                          <UserIcon className="h-3.5 w-3.5 text-brand-goldDark" />
                          <span>{blog.author_name}</span>
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/blogs/${encodeURIComponent(blog.slug)}`}
                      className="block"
                    >
                      <h2 className="text-lg font-extrabold leading-snug text-brand-navy transition-colors group-hover:text-brand-green line-clamp-2">
                        {blog.title}
                      </h2>
                    </Link>

                    <p className="mt-2.5 flex-1 text-xs leading-relaxed text-brand-muted line-clamp-3">
                      {blog.summary || stripHtmlToText(blog.content)}
                    </p>

                    <div className="mt-5 border-t border-gray-100 pt-4">
                      <Link
                        href={`/blogs/${encodeURIComponent(blog.slug)}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-green transition-colors hover:text-brand-navy"
                      >
                        <span>مطالعه مقاله</span>
                        <ArrowLeft className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1 || loading}
                className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-brand-navy transition-colors hover:bg-brand-iceLight disabled:cursor-not-allowed disabled:opacity-45 cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
                <span>قبلی</span>
              </button>

              <span className="px-2 text-xs font-semibold text-brand-navy tabular-nums">
                صفحه {formatNumber(currentPage, "fa-IR")} از{" "}
                {formatNumber(totalPages, "fa-IR")}
              </span>

              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages || loading}
                className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-brand-navy transition-colors hover:bg-brand-iceLight disabled:cursor-not-allowed disabled:opacity-45 cursor-pointer"
              >
                <span>بعدی</span>
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
