"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
  ShieldAlert,
  Users,
} from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import type { AuthUser } from "@/features/auth/types/auth.types";
import { formatDate, formatNumber } from "@/lib/utils";
import { PAGE_SIZE_OPTIONS, useAdminUsers } from "../hooks/use-admin-users";
import { UserDetailModal } from "./user-detail-modal";

export function AdminUsersSection() {
  const [selectedUser, setSelectedUser] = useState<AuthUser | null>(null);

  const {
    items,
    total,
    offset,
    limit,
    currentPage,
    totalPages,
    loading,
    error,
    errorStatus,
    goToPage,
    setLimit,
    refetch,
  } = useAdminUsers(50);

  const rangeStart = total === 0 ? 0 : offset + 1;
  const rangeEnd = Math.min(offset + items.length, total);

  return (
    <div className="space-y-6">
      {/* Page Banner & Controls */}
      <section className="flex flex-col gap-4 rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-iceLight text-brand-navy">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-brand-navy">
                فهرست کاربران سامانه
              </h1>
              <p className="mt-0.5 text-xs text-brand-muted">
                مرتب‌سازی بر اساس جدیدترین عضویت · مجموع کاربران:{" "}
                <strong className="font-mono text-brand-navy tabular-nums">
                  {formatNumber(total, "fa-IR")}
                </strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-semibold text-brand-muted">
              <span>تعداد در صفحه:</span>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                disabled={loading}
                className="rounded-xl border border-gray-200 bg-brand-cream px-3 py-2 text-xs font-bold text-brand-navy outline-none focus:border-brand-green cursor-pointer disabled:opacity-50"
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {formatNumber(size, "fa-IR")}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={refetch}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-green px-4 py-2 text-xs font-bold text-brand-gold transition-colors hover:bg-brand-greenLight disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
              />
              <span>بروزرسانی</span>
            </button>
          </div>
        </section>

        {/* Main Content Area */}
        {loading ? (
          <div className="rounded-3xl border border-gray-200/80 bg-white shadow-xs">
            <LoadingState label="در حال دریافت لیست کاربران..." />
          </div>
        ) : errorStatus === 403 ? (
          <div className="rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-xs space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-brand-navy">
                دسترسی غیرمجاز (۴۰۳)
              </h2>
              <p className="mt-1 text-xs text-brand-muted">
                {error || "شما مجوز دسترسی به فهرست کاربران را ندارید."}
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-navy px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-brand-green"
            >
              <ArrowRight className="h-4 w-4" />
              <span>بازگشت به صفحه اصلی</span>
            </Link>
          </div>
        ) : error ? (
          <ErrorState
            title="خطا در دریافت لیست کاربران"
            message={error}
            onRetry={refetch}
          />
        ) : items.length === 0 ? (
          <EmptyState
            icon={Users}
            title="کاربری یافت نشد"
            description="هنوز کاربری در سامانه ثبت‌نام نکرده است."
          />
        ) : (
          <section className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px] border-collapse text-right text-xs">
                <thead>
                  <tr className="border-b border-gray-200/80 bg-brand-iceLight/60 text-[11px] font-bold text-brand-navy">
                    <th className="px-4 py-3.5">کاربر</th>
                    <th className="px-4 py-3.5">شماره تماس</th>
                    <th className="px-4 py-3.5">نقش</th>
                    <th className="px-4 py-3.5">وضعیت</th>
                    <th className="px-4 py-3.5">شغل</th>
                    <th className="px-4 py-3.5">صفحه کاری</th>
                    <th className="px-4 py-3.5">درآمد</th>
                    <th className="px-4 py-3.5">تاریخ عضویت</th>
                    <th className="px-4 py-3.5 text-center">جزئیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((user) => (
                    <tr
                      key={user.id}
                      className="transition-colors hover:bg-brand-cream/70"
                    >
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-brand-navy">
                          {user.full_name}
                        </div>
                        <div
                          className="font-mono text-[11px] text-brand-muted"
                          dir="ltr"
                        >
                          @{user.username}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 font-mono text-brand-navy" dir="ltr">
                        {user.phone_number}
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            user.role === "admin"
                              ? "bg-brand-green text-brand-gold"
                              : "bg-brand-iceLight text-brand-navy"
                          }`}
                        >
                          {user.role === "admin" ? "مدیر" : "مشتری"}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            user.is_active
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {user.is_active ? "فعال" : "غیرفعال"}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-brand-navy font-medium max-w-[160px] truncate">
                        {user.job}
                      </td>

                      <td
                        className="px-4 py-3.5 font-mono text-brand-muted max-w-[160px] truncate"
                        dir="ltr"
                      >
                        {user.work_page || "-"}
                      </td>

                      <td className="px-4 py-3.5 text-brand-muted">
                        {user.income || "-"}
                      </td>

                      <td className="px-4 py-3.5 text-brand-muted tabular-nums">
                        {formatDate(user.created_at, "fa-IR")}
                      </td>

                      <td className="px-4 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedUser(user)}
                          className="inline-flex items-center gap-1 rounded-full border border-brand-navy/20 px-3 py-1 text-[11px] font-bold text-brand-navy transition-colors hover:bg-brand-navy hover:text-white cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>مشاهده</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
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
                کاربر
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

      <UserDetailModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
}
