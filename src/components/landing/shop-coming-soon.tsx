"use client";

import { useState } from "react";
import { Lock, Sparkles } from "lucide-react";
import { BRAND_INSTAGRAM_HANDLE, BRAND_INSTAGRAM_URL } from "./constants";

const SHOP_CATEGORIES = [
  "همه",
  "مراقبت پوست",
  "دستگاه‌های هوم‌کر",
  "دستگاه‌های کابین",
] as const;

const PREVIEW_PRODUCTS = [
  {
    id: "serum",
    category: "مراقبت پوست",
    title: "سرم‌های تخصصی کنترل چربی و آبرسان",
    subtitle: "انتخاب‌شده برای روتین پوست چرب و مختلط",
    thumbBg: "bg-brand-iceLight",
  },
  {
    id: "barrier-cream",
    category: "مراقبت پوست",
    title: "کرم‌های ترمیم‌کننده سد پوستی",
    subtitle: "فرمولاسیون علمی و ملایم روزانه",
    thumbBg: "bg-brand-iceLight",
  },
  {
    id: "home-care-device",
    category: "دستگاه‌های هوم‌کر",
    title: "دستگاه‌های مراقبت خانگی هوم‌کر",
    subtitle: "همراه راهنمای تخصصی استفاده در منزل",
    thumbBg: "bg-brand-iceLight",
  },
  {
    id: "cabin-device",
    category: "دستگاه‌های کابین",
    title: "تجهیزات تخصصی کابین و کلینیک",
    subtitle: "ویژه اسکین‌تراپیست‌ها و سالن‌ها",
    thumbBg: "bg-brand-navy/10",
  },
] as const;

export function ShopComingSoon() {
  const [selectedCategory, setSelectedCategory] = useState<string>("همه");

  return (
    <section id="shop" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-24">
      {/* Shop Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-brand-muted">
              انتخاب شده با نگاه تخصصی
            </span>
            <span className="rounded-full bg-brand-iceLight border border-brand-iceBlue px-2.5 py-0.5 text-[10px] font-bold text-brand-navy">
              به زودی
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy mt-1">
            فروشگاه تخصصی پوست
          </h2>
          <p className="text-sm text-brand-muted mt-1">
            محصولات مراقبت پوست، دستگاه‌های هوم‌کر برای خانه و دستگاه‌های کابین
            برای کلینیک و سالن
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-muted bg-brand-iceLight px-4 py-2 rounded-full shrink-0 self-start md:self-auto">
          <Lock className="h-3.5 w-3.5" />
          <span>راه‌اندازی فروشگاه به زودی</span>
        </span>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {SHOP_CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`text-xs font-medium px-4 py-2 rounded-full transition-colors cursor-pointer ${
                isSelected
                  ? "bg-brand-navy text-white"
                  : "bg-brand-iceLight hover:bg-brand-iceBlue text-brand-navy"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Dual Promo Banners (Home Care vs Professional Cabin) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Home Care Banner */}
        <div className="bg-brand-iceBlue rounded-3xl p-6 sm:p-8 flex items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="font-brand-en text-xs font-bold tracking-widest text-brand-navy/70 uppercase">
              HOME CARE
            </span>
            <h3 className="text-xl font-extrabold text-brand-navy">
              دستگاه‌های هوم‌کر؛ مراقبت حرفه‌ای در خانه
            </h3>
            <p className="text-xs text-brand-navy/80 leading-relaxed">
              با راهنمای استفاده و مشاوره انتخاب، متناسب با نوع و کاندیشن پوست
              شما
            </p>
            <div className="pt-2">
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="inline-flex items-center gap-1.5 bg-brand-navy/80 text-white text-xs font-bold px-5 py-2.5 rounded-full cursor-not-allowed opacity-85"
              >
                <span>عرضه به زودی</span>
              </button>
            </div>
          </div>
          <div className="w-24 sm:w-28 h-32 sm:h-36 bg-brand-cream rounded-t-full shrink-0 flex items-center justify-center text-brand-navy shadow-inner">
            <svg
              className="w-8 h-8 stroke-current"
              fill="none"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <rect x="9" y="3" width="6" height="18" rx="3" />
              <circle cx="12" cy="7" r="1.5" />
            </svg>
          </div>
        </div>

        {/* Professional Cabin Banner */}
        <div className="bg-brand-navy text-white rounded-3xl p-6 sm:p-8 flex items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="font-brand-en text-xs font-bold tracking-widest text-brand-gold uppercase">
              PROFESSIONAL
            </span>
            <h3 className="text-xl font-extrabold text-white">
              دستگاه‌های کابین؛ برای کلینیک و سالن
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              مشاوره خرید تخصصی و آموزش کار با دستگاه برای اسکین‌تراپیست‌ها
            </p>
            <div className="pt-2">
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="inline-flex items-center gap-1.5 bg-brand-cream/85 text-brand-navy text-xs font-bold px-5 py-2.5 rounded-full cursor-not-allowed opacity-85"
              >
                <span>عرضه به زودی</span>
              </button>
            </div>
          </div>
          <div className="w-24 sm:w-28 h-32 sm:h-36 bg-white/10 rounded-t-full shrink-0 flex items-center justify-center text-brand-gold">
            <svg
              className="w-8 h-8 stroke-current"
              fill="none"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <rect x="6" y="4" width="12" height="16" rx="2" />
              <path d="M9 9h6M9 13h6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Unified Coming Soon Showcase over Locked Preview Cards */}
      <div className="relative rounded-3xl border border-gray-200/80 bg-white/60 p-4 sm:p-6 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 select-none">
          {PREVIEW_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-gray-200/80 p-4 flex flex-col justify-between opacity-65 blur-[1.5px]"
            >
              <div>
                <div
                  className={`h-40 ${product.thumbBg} rounded-xl flex items-center justify-center text-brand-navy/50 text-xs font-medium`}
                >
                  به زودی
                </div>
                <span className="inline-block text-[11px] text-brand-muted mt-3">
                  {product.category}
                </span>
                <h4 className="text-sm font-bold text-brand-navy mt-1">
                  {product.title}
                </h4>
                <p className="text-xs text-brand-muted mt-1">
                  {product.subtitle}
                </p>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <span className="text-xs font-bold text-brand-muted">
                  به زودی
                </span>
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  aria-label="به زودی"
                  className="w-7 h-7 rounded-full bg-brand-navy/40 text-white flex items-center justify-center text-sm cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Frosted Coming Soon Overlay Card */}
        <div className="mt-6 lg:mt-0 lg:absolute lg:inset-0 flex items-center justify-center lg:bg-brand-cream/55 lg:backdrop-blur-[2px] lg:p-6">
          <div className="w-full max-w-lg rounded-3xl bg-white/95 border border-brand-iceBlue p-6 sm:p-8 text-center shadow-lg space-y-3.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-navy text-brand-gold px-4 py-1 text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>فروشگاه تخصصی · به زودی</span>
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-brand-navy">
              محصولات و دستگاه‌های منتخب در حال آماده‌سازی هستند
            </h3>
            <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
              برای اطلاع از زمان بازگشایی فروشگاه و معرفی محصولات تاییدشده، صفحه
              اینستاگرام{" "}
              <span className="font-semibold text-brand-navy" dir="ltr">
                {BRAND_INSTAGRAM_HANDLE}
              </span>{" "}
              را دنبال کنید.
            </p>
            <div className="pt-1">
              <a
                href={BRAND_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-brand-navy hover:bg-brand-green text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-full transition-colors shadow-sm"
              >
                اطلاع از زمان افتتاح در اینستاگرام
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
