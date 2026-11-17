"use client";

import { useState } from "react";
import { CheckCircle2, Lock, X } from "lucide-react";
import { BRAND_INSTAGRAM_HANDLE, BRAND_INSTAGRAM_URL, HERO_PACK_ITEMS } from "./constants";

const COMING_SOON_COURSES = [
  {
    id: "skin-analysis",
    title: "دوره تخصصی آنالیز پوست",
    description: "تشخیص دقیق تایپ، کاندیشن و لایه‌های پوستی در جلسات مشاوره",
    level: "سطح متوسط",
    headerBg: "bg-brand-iceLight text-brand-navy",
    icon: (
      <svg
        className="w-12 h-12 stroke-current"
        fill="none"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2" />
      </svg>
    ),
  },
  {
    id: "active-ingredients",
    title: "ورکشاپ مواد فعال پوستی",
    description: "ترکیب‌شناسی علمی اسیدها، نیاسینامید، رتینوئیدها و پپتیدها",
    level: "ورکشاپ",
    headerBg: "bg-brand-navy text-white",
    icon: (
      <svg
        className="w-12 h-12 stroke-current"
        fill="none"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M9 3h6m-5 0v5.5L5 18a2 2 0 001.7 3h10.6a2 2 0 001.7-3l-5-9.5V3" />
      </svg>
    ),
  },
] as const;

export function CoursesSection() {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <section id="courses" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-semibold text-brand-muted tracking-wider">
            آکادمی تینا فلاح
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy mt-1">
            دوره‌های آموزشی پوست
          </h2>
        </div>
        <a
          href="#featured-course"
          className="text-sm font-semibold text-brand-navy underline underline-offset-4 hover:text-brand-green transition-colors"
        >
          مشاهده دوره ویژه SKIN CLUB
        </a>
      </div>

      {/* Courses Asymmetric Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Featured Course Card (Right in RTL - 6 cols) */}
        <div
          id="featured-course"
          className="lg:col-span-6 bg-brand-green text-white rounded-3xl p-8 flex flex-col justify-between shadow-sm scroll-mt-24"
        >
          <div>
            <span className="inline-block bg-brand-gold text-brand-green text-xs font-bold px-3.5 py-1 rounded-full">
              دوره ویژه
            </span>
            <h3 className="font-brand-en text-4xl sm:text-5xl text-brand-gold mt-5 tracking-wider">
              SKIN CLUB
            </h3>
            <h4 className="text-xl font-bold text-white mt-3">
              دوره جامع اسکین‌تراپی – از صفر تا پیشرفته
            </h4>
            <p className="text-sm text-gray-200 leading-relaxed mt-3">
              تئوری علمی پوست، آنالیز، مواد فعال و پروتکل‌های حرفه‌ای؛ همراه با
              پک فیزیکی و کتاب چاپی.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-200 mt-6 pt-4 border-t border-white/10">
              <span>آموزش تئوری و عملی گام‌به‌گام</span>
              <span aria-hidden="true">·</span>
              <span>همراه با پک فیزیکی اختصاصی</span>
              <span aria-hidden="true">·</span>
              <span>گواهی پایان دوره</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-4">
            <div className="text-sm sm:text-base font-bold text-brand-gold">
              ثبت‌نام باز · ظرفیت محدود
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsDetailsOpen(true)}
                className="bg-brand-cream hover:bg-white text-brand-green font-bold text-sm px-6 py-3 rounded-full transition-colors cursor-pointer"
              >
                جزئیات و ثبت‌نام
              </button>
              <a
                href={BRAND_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-brand-gold/50 hover:border-brand-gold text-brand-gold text-xs font-semibold px-4 py-3 rounded-full transition-colors"
              >
                ثبت‌نام در دایرکت
              </a>
            </div>
          </div>
        </div>

        {/* Secondary Coming Soon Courses (Cards 2 & 3 - 3 cols each) */}
        {COMING_SOON_COURSES.map((course) => (
          <div
            key={course.id}
            className="lg:col-span-3 relative bg-white rounded-3xl border border-gray-200/80 overflow-hidden flex flex-col justify-between shadow-sm"
          >
            <div className="absolute top-3.5 left-3.5 z-10 inline-flex items-center gap-1 rounded-full bg-brand-navy text-brand-gold px-3 py-1 text-[11px] font-bold shadow-xs">
              <Lock className="h-3 w-3" />
              <span>به زودی</span>
            </div>

            <div>
              <div
                className={`h-44 ${course.headerBg} flex items-center justify-center opacity-80`}
              >
                {course.icon}
              </div>
              <div className="p-6 text-center blur-[1px] opacity-75 select-none">
                <span className="inline-block bg-brand-iceLight text-brand-navy text-xs font-medium px-3 py-1 rounded-full">
                  {course.level}
                </span>
                <h4 className="text-base font-bold text-brand-navy mt-3">
                  {course.title}
                </h4>
                <p className="text-xs text-brand-muted mt-2 leading-relaxed">
                  {course.description}
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-brand-muted">
                انتشار به زودی
              </span>
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="rounded-full bg-brand-iceLight px-3.5 py-1.5 text-xs font-bold text-brand-muted cursor-not-allowed opacity-80"
              >
                به زودی
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Course Details & Registration Modal */}
      {isDetailsOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="skin-club-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/60 backdrop-blur-xs p-4"
          onClick={() => setIsDetailsOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl bg-brand-cream border border-brand-gold/40 p-6 sm:p-8 shadow-2xl text-right space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsDetailsOpen(false)}
              aria-label="بستن پنجره"
              className="absolute top-5 left-5 flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-navy border border-gray-200 hover:bg-brand-iceLight transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div>
              <span className="inline-block bg-brand-green text-brand-gold text-xs font-bold px-3.5 py-1 rounded-full">
                ثبت‌نام دوره ویژه
              </span>
              <h3
                id="skin-club-modal-title"
                className="font-brand-en text-3xl font-bold text-brand-navy mt-3"
              >
                SKIN CLUB
              </h3>
              <p className="text-sm font-bold text-brand-green mt-1">
                دوره جامع آموزش تخصصی پوست – از صفر تا پیشرفته
              </p>
            </div>

            <div className="rounded-2xl bg-white border border-gray-200/80 p-4 space-y-2.5">
              <p className="text-xs font-bold text-brand-navy">
                محتوای پک فیزیکی ارسالی برای هنرجویان:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-brand-muted">
                {HERO_PACK_ITEMS.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-brand-green shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs leading-relaxed text-brand-muted">
              برای دریافت سرفصل کامل، اطلاع از شهریه، شرایط پرداخت اقساطی و
              نهایی‌کردن ثبت‌نام، کلمه{" "}
              <strong className="text-brand-navy">«اسکین کلاب»</strong> را در
              دایرکت اینستاگرام{" "}
              <span className="font-semibold text-brand-navy" dir="ltr">
                {BRAND_INSTAGRAM_HANDLE}
              </span>{" "}
              ارسال کنید.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href={BRAND_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center bg-brand-green hover:bg-brand-greenLight text-brand-gold font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full transition-colors"
              >
                ارسال پیام و ثبت‌نام در اینستاگرام
              </a>
              <button
                type="button"
                onClick={() => setIsDetailsOpen(false)}
                className="border border-brand-navy/25 hover:border-brand-navy text-brand-navy text-xs font-semibold px-5 py-3.5 rounded-full transition-colors cursor-pointer"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
