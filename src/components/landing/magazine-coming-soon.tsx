"use client";

import { useState } from "react";
import { BookOpen, Lock } from "lucide-react";
import { BRAND_INSTAGRAM_HANDLE, BRAND_INSTAGRAM_URL } from "./constants";

const MAGAZINE_TOPICS = [
  "پوست چرب",
  "پوست خشک",
  "آکنه و جوش",
  "مواد فعال (نیاسینامید، رتینول...)",
  "روتین پوستی",
  "آموزش اسکین‌تراپی",
] as const;

const SIDE_ARTICLES_PREVIEW = [
  {
    code: "B3",
    badgeBg: "bg-brand-navy text-white",
    category: "مواد فعال",
    title: "نیاسینامید ۵٪ یا ۱۰٪؟ کدام واقعاً مؤثرتر است",
  },
  {
    code: "A",
    badgeBg: "bg-brand-iceLight text-brand-navy",
    category: "مواد فعال",
    title: "رتینول برای مبتدی‌ها: از کجا شروع کنیم؟",
  },
  {
    code: "03",
    badgeBg: "bg-brand-iceBlue text-brand-navy",
    category: "آموزش پوست",
    title: "تایپ پوست با کاندیشن پوست چه فرقی دارد؟",
  },
  {
    code: "04",
    badgeBg: "bg-brand-green text-white",
    category: "روتین پوستی",
    title: "ترتیب درست استفاده از محصولات پوستی",
  },
] as const;

export function MagazineComingSoon() {
  const [selectedTopic, setSelectedTopic] = useState<string>(MAGAZINE_TOPICS[0]);

  return (
    <section
      id="magazine"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-brand-muted">
              علم پوست به زبان ساده
            </span>
            <span className="rounded-full bg-brand-iceLight border border-brand-iceBlue px-2.5 py-0.5 text-[10px] font-bold text-brand-navy">
              به زودی
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy mt-1">
            مجله پوست تینا فلاح
          </h2>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-muted bg-brand-iceLight px-4 py-2 rounded-full self-start sm:self-auto">
          <Lock className="h-3.5 w-3.5" />
          <span>انتشار مقالات به زودی</span>
        </span>
      </div>

      {/* Topic Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {MAGAZINE_TOPICS.map((topic) => {
          const isSelected = selectedTopic === topic;
          return (
            <button
              key={topic}
              type="button"
              onClick={() => setSelectedTopic(topic)}
              className={`text-xs font-medium px-4 py-2 rounded-full transition-colors cursor-pointer ${
                isSelected
                  ? "bg-brand-navy text-white"
                  : "bg-brand-iceLight hover:bg-brand-iceBlue text-brand-navy"
              }`}
            >
              {topic}
            </button>
          );
        })}
      </div>

      {/* Coming Soon Editorial Preview */}
      <div className="relative rounded-3xl border border-gray-200/80 bg-white/70 p-6 sm:p-8 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start opacity-60 blur-[1.5px] select-none pointer-events-none">
          {/* Featured Main Article Preview (7 cols) */}
          <article className="lg:col-span-7 space-y-4">
            <div className="h-64 sm:h-72 bg-brand-iceBlue rounded-3xl relative flex items-center justify-center overflow-hidden">
              <div className="w-36 h-36 rounded-full border-[22px] border-white/40" />
              <span className="absolute bottom-4 left-4 bg-white/90 text-brand-navy text-xs font-semibold px-3 py-1 rounded-full">
                به زودی
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-brand-muted pt-1">
              <span className="font-semibold text-brand-navy">پوست چرب</span>
              <span aria-hidden="true">·</span>
              <span>مطالعه علمی</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-brand-navy">
              پوست چرب: علت‌ها، روتین درست و اشتباهات رایج
            </h3>
            <p className="text-sm text-brand-muted leading-relaxed">
              چرا پوست با وجود شستشوی مداوم باز هم چرب می‌شود؟ راهنمای کنترل چربی
              بدون آسیب به سد پوستی.
            </p>
          </article>

          {/* Side Stacked Articles Preview (5 cols) */}
          <div className="lg:col-span-5 divide-y divide-gray-200/80">
            {SIDE_ARTICLES_PREVIEW.map((article, idx) => (
              <article
                key={article.title}
                className={`flex items-center gap-4 ${
                  idx === 0
                    ? "pb-5"
                    : idx === SIDE_ARTICLES_PREVIEW.length - 1
                    ? "pt-5"
                    : "py-5"
                }`}
              >
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${article.badgeBg} font-bold text-lg flex items-center justify-center shrink-0`}
                >
                  {article.code}
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-brand-muted">
                    {article.category}
                  </span>
                  <h4 className="text-sm font-bold text-brand-navy mt-1">
                    {article.title}
                  </h4>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Coming Soon Overlay */}
        <div className="mt-6 lg:mt-0 lg:absolute lg:inset-0 flex items-center justify-center lg:bg-brand-cream/50 lg:backdrop-blur-[2px] lg:p-6">
          <div className="w-full max-w-lg rounded-3xl bg-white/95 border border-brand-iceBlue p-6 sm:p-8 text-center shadow-lg space-y-3.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-iceLight text-brand-navy border border-brand-iceBlue px-4 py-1 text-xs font-bold">
              <BookOpen className="h-3.5 w-3.5" />
              <span>مجله پوست · به زودی</span>
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-brand-navy">
              مقالات علمی مجله پوست به‌زودی منتشر می‌شوند
            </h3>
            <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
              در حال تدوین مقالات تخصصی درباره مواد فعال، آنالیز پوست و روتین
              اصولی هستیم. نکات روزانه علمی را می‌توانید در{" "}
              <span className="font-semibold text-brand-navy" dir="ltr">
                {BRAND_INSTAGRAM_HANDLE}
              </span>{" "}
              بخوانید.
            </p>
            <div className="pt-1">
              <a
                href={BRAND_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center border border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-full transition-colors"
              >
                مطالب آموزشی در اینستاگرام
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
