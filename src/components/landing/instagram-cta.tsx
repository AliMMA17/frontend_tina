import { BRAND_INSTAGRAM_URL } from "./constants";

export function InstagramCta() {
  return (
    <section
      id="consult"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 scroll-mt-24"
    >
      <div className="bg-brand-iceLight rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-right">
          <h3 className="text-xl sm:text-2xl font-extrabold text-brand-navy">
            نمی‌دانی از کجا شروع کنی؟
          </h3>
          <p className="text-sm text-brand-muted">
            کلمه <strong className="text-brand-navy">«اسکین کلاب»</strong> را در
            دایرکت اینستاگرام بفرست تا برای انتخاب دوره یا مسیر مناسب راهنمایی‌ات
            کنم.
          </p>
        </div>
        <a
          href={BRAND_INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-brand-navy hover:bg-brand-green text-white text-xs sm:text-sm font-bold px-7 py-3.5 rounded-full shrink-0 transition-colors shadow-sm"
        >
          ارسال پیام در دایرکت
        </a>
      </div>
    </section>
  );
}
