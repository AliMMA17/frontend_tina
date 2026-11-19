"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  LogOut,
  ShieldCheck,
  Users,
} from "lucide-react";
import { getSessionClaims, logout } from "@/features/auth/services/auth.service";
import { AdminBlogsSection } from "./admin-blogs-section";
import { AdminUsersSection } from "./admin-users-view";

type AdminTab = "users" | "blogs";

export function AdminDashboardView() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("users");
  const claims = getSessionClaims();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-brand-cream text-brand-navy">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-brand-navy text-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-green text-brand-gold border border-brand-gold/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-brand-en text-lg font-bold text-brand-gold">
                  Tina Fallah
                </span>
                <span className="text-xs text-gray-300">| پنل مدیریت</span>
              </div>
              <p className="text-[11px] text-gray-300">
                {activeTab === "users"
                  ? "مدیریت کاربران ثبت‌نام‌شده"
                  : "مدیریت و انتشار مقالات وبلاگ"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {claims?.username && (
              <span
                className="hidden sm:inline-flex items-center rounded-full bg-white/10 px-3 py-1.5 font-mono text-xs text-brand-gold"
                dir="ltr"
              >
                @{claims.username}
              </span>
            )}

            <Link
              href="/blogs"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/25 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/10"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">مشاهده وبلاگ</span>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/25 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/10"
            >
              <ArrowRight className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">مشاهده سایت</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-rose-500/20 hover:text-rose-200 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        {/* Section Tabs */}
        <nav
          aria-label="بخش‌های پنل مدیریت"
          className="inline-flex items-center gap-1.5 rounded-full border border-gray-200/80 bg-white p-1.5 shadow-xs"
        >
          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-colors cursor-pointer ${
              activeTab === "users"
                ? "bg-brand-green text-brand-gold"
                : "text-brand-muted hover:text-brand-navy"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>کاربران</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("blogs")}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-colors cursor-pointer ${
              activeTab === "blogs"
                ? "bg-brand-green text-brand-gold"
                : "text-brand-muted hover:text-brand-navy"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>وبلاگ و مقالات</span>
          </button>
        </nav>

        {activeTab === "users" ? <AdminUsersSection /> : <AdminBlogsSection />}
      </main>
    </div>
  );
}
