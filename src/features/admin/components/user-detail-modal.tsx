"use client";

import {
  Briefcase,
  Calendar,
  Globe,
  MapPin,
  Phone,
  Shield,
  User,
  Wallet,
  X,
} from "lucide-react";
import type { AuthUser } from "@/features/auth/types/auth.types";
import { formatDate } from "@/lib/utils";

interface UserDetailModalProps {
  user: AuthUser | null;
  onClose: () => void;
}

export function UserDetailModal({ user, onClose }: UserDetailModalProps) {
  if (!user) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-detail-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/60 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl border border-brand-gold/30 bg-brand-cream p-6 sm:p-7 shadow-2xl text-right space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="بستن جزئیات کاربر"
          className="absolute top-5 left-5 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-brand-navy hover:bg-brand-iceLight transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 pr-1">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-green text-brand-gold">
            <User className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <h3
              id="user-detail-modal-title"
              className="text-base sm:text-lg font-extrabold text-brand-navy truncate"
            >
              {user.full_name}
            </h3>
            <p className="font-mono text-xs text-brand-muted" dir="ltr">
              @{user.username}
            </p>
          </div>
        </div>

        {/* Status & Role Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
              user.role === "admin"
                ? "bg-brand-green text-brand-gold"
                : "bg-brand-iceLight text-brand-navy"
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            <span>{user.role === "admin" ? "مدیر (admin)" : "مشتری (customer)"}</span>
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              user.is_active
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-rose-50 text-rose-700 border border-rose-200"
            }`}
          >
            {user.is_active ? "حساب فعال" : "حساب غیرفعال"}
          </span>
        </div>

        {/* Details Grid */}
        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 space-y-3 text-xs">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 text-brand-muted">
              <Phone className="h-3.5 w-3.5" />
              شماره تماس
            </span>
            <span className="font-mono font-bold text-brand-navy" dir="ltr">
              {user.phone_number}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 text-brand-muted">
              <Briefcase className="h-3.5 w-3.5" />
              شغل
            </span>
            <span className="font-semibold text-brand-navy">{user.job}</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 text-brand-muted">
              <Globe className="h-3.5 w-3.5" />
              صفحه کاری
            </span>
            <span className="font-mono text-brand-navy truncate max-w-[220px]" dir="ltr">
              {user.work_page || "-"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 text-brand-muted">
              <Wallet className="h-3.5 w-3.5" />
              درآمد
            </span>
            <span className="font-semibold text-brand-navy">
              {user.income || "-"}
            </span>
          </div>

          <div className="pt-2 border-t border-gray-100 space-y-1">
            <span className="inline-flex items-center gap-1.5 text-brand-muted">
              <MapPin className="h-3.5 w-3.5" />
              آدرس کامل
            </span>
            <p className="text-brand-navy leading-relaxed font-medium">
              {user.full_address}
            </p>
          </div>

          <div className="pt-2 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-brand-muted">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span>عضویت: {formatDate(user.created_at, "fa-IR")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span>بروزرسانی: {formatDate(user.updated_at, "fa-IR")}</span>
            </div>
          </div>

          <div className="pt-1 text-[10px] text-brand-muted font-mono truncate" dir="ltr">
            ID: {user.id}
          </div>
        </div>
      </div>
    </div>
  );
}
