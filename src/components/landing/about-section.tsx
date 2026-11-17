import { BRAND_INSTAGRAM_HANDLE, BRAND_INSTAGRAM_URL } from "./constants";

export function AboutSection() {
  return (
    <section
      id="about"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-24"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Editorial Portrait Frame (5 cols) */}
        <div className="md:col-span-5">
          <div className="aspect-[4/3] bg-brand-iceLight rounded-3xl flex flex-col items-center justify-center text-center p-6 border border-brand-iceBlue relative overflow-hidden">
            <div className="w-24 h-24 rounded-full bg-brand-green text-brand-gold flex items-center justify-center font-brand-en text-3xl font-bold shadow-md border border-brand-gold/40">
              TF
            </div>
            <span className="font-brand-en text-xl font-bold text-brand-navy mt-4">
              Tina Fallah
            </span>
            <span className="text-xs text-brand-muted mt-1">
              Skin Therapist &amp; Educator
            </span>
          </div>
        </div>

        {/* Bio Copy (7 cols) */}
        <div className="md:col-span-7 space-y-4 text-right">
          <span className="text-xs font-semibold text-brand-muted tracking-wider">
            Skin Therapist &amp; Educator
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
            تینا فلاح هستم
          </h2>
          <p className="text-sm text-brand-muted leading-relaxed max-w-xl">
            مدرس تخصصی اسکین‌تراپی و آموزش علمی پوست؛ با تمرکز بر یادگیری
            مبتنی بر شواهد، شناخت دقیق ساختار پوست و تحلیل علمی مواد فعال به
            جای پیروی از ترندهای موقت. هدف من در{" "}
            <span className="font-brand-en font-semibold text-brand-navy">
              SKIN CLUB
            </span>{" "}
            این است که مسیر تبدیل‌شدن از دانش تئوری به مهارت حرفه‌ای را شفاف و
            کاربردی بسازم.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#featured-course"
              className="border border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white text-xs font-bold px-5 py-2.5 rounded-full transition-colors"
            >
              داستان SKIN CLUB
            </a>
            <a
              href={BRAND_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-brand-navy hover:text-brand-green transition-colors"
              dir="ltr"
            >
              {BRAND_INSTAGRAM_HANDLE}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
