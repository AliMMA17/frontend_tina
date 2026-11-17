import { HERO_PACK_ITEMS } from "./constants";

export function HeroSection() {
  return (
    <section className="bg-brand-green text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Right Column: Copy & CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-right">
            <div className="inline-block bg-white/10 text-brand-gold text-xs px-4 py-1.5 rounded-full border border-brand-gold/30">
              دوره جامع آموزش تخصصی پوست – از صفر تا پیشرفته
            </div>

            <h1 className="font-brand-en text-5xl sm:text-6xl lg:text-7xl font-semibold text-brand-gold tracking-widest">
              SKIN CLUB
            </h1>

            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              از علم تئوری تا مهارت پوست
            </h2>

            <p className="text-gray-200 text-sm sm:text-base leading-relaxed max-w-2xl">
              مسیری کامل و علمی برای کسانی که می‌خواهند پوست را عمیق بشناسند،
              درست آنالیز کنند و حرفه‌ای درمان کنند؛ همراه با پک فیزیکی اختصاصی و
              کتاب چاپی اسکین کلاب.
            </p>

            {/* Physical Pack Feature Pills */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              {HERO_PACK_ITEMS.map((item) => (
                <span
                  key={item}
                  className="px-4 py-1.5 rounded-full border border-brand-gold/40 text-xs text-brand-gold bg-white/5"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="#featured-course"
                className="bg-brand-gold hover:bg-brand-goldDark text-brand-green font-bold text-sm px-7 py-3.5 rounded-full inline-flex items-center gap-2 transition-colors shadow-lg"
              >
                <span>مشاهده جزئیات و ثبت‌نام</span>
                <span aria-hidden="true">&#8249;</span>
              </a>
              <a
                href="#consult"
                className="border border-white/40 hover:border-white text-white text-sm font-medium px-6 py-3.5 rounded-full transition-colors"
              >
                مشاوره قبل از ثبت‌نام
              </a>
            </div>

            {/* Tuition / Enrollment Note */}
            <p className="text-xs sm:text-sm text-gray-300 pt-2">
              ظرفیت دوره ویژه{" "}
              <strong className="text-brand-gold">SKIN CLUB</strong> محدود است ·
              امکان پرداخت اقساطی با مشاوره پیش از ثبت‌نام
            </p>
          </div>

          {/* Left Column: Physical Kit Visual Mockup (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
              {/* Decorative Circle */}
              <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-brand-gold/20 flex items-center justify-center relative">
                {/* Left Card (Mini Journal) */}
                <div className="w-28 h-40 sm:w-32 sm:h-44 bg-[#F5F2EB] text-brand-green rounded-lg p-3 shadow-xl transform -rotate-12 -translate-x-12 sm:-translate-x-14 flex flex-col justify-between border border-gray-200">
                  <span className="font-brand-en text-xs font-bold">
                    SKIN CLUB
                  </span>
                  <span className="text-[10px] text-gray-500">
                    mini journal
                  </span>
                </div>

                {/* Right Card (Welcome Card) */}
                <div className="w-28 h-40 sm:w-32 sm:h-44 bg-[#F5F2EB] text-brand-green rounded-lg p-3 shadow-xl transform rotate-12 translate-x-12 sm:translate-x-14 flex flex-col justify-between border border-gray-200">
                  <span className="font-brand-en text-sm italic">Welcome</span>
                  <span className="font-brand-en text-[10px] tracking-widest">
                    SKIN CLUB
                  </span>
                </div>

                {/* Center Book (Hardcover) */}
                <div className="w-36 h-52 sm:w-40 sm:h-56 bg-[#1B422D] border border-brand-gold/50 rounded-lg p-4 shadow-2xl z-10 flex flex-col justify-between text-center">
                  <div className="pt-3">
                    <div className="font-brand-en text-xl text-brand-gold tracking-widest leading-tight">
                      SKIN
                      <br />
                      CLUB
                    </div>
                    <div className="w-8 h-[1px] bg-brand-gold/50 mx-auto my-3" />
                    <p className="text-[10px] text-gray-200 leading-relaxed">
                      از علم تئوری
                      <br />
                      تا مهارت پوست
                    </p>
                  </div>
                  <span className="font-brand-en text-xs text-brand-gold/90 italic">
                    Tina Fallah
                  </span>
                </div>

                {/* Gift Box Base */}
                <div className="absolute bottom-2 w-64 sm:w-72 h-22 sm:h-24 bg-[#122B1D] border border-brand-gold/40 rounded-b-xl shadow-2xl z-20 flex items-center justify-center">
                  {/* Golden Pen Accent */}
                  <div className="w-36 sm:w-40 h-1.5 bg-gradient-to-r from-brand-goldDark via-brand-gold to-brand-goldDark rounded-full absolute -top-1 transform -rotate-3" />
                  <span className="font-brand-en text-lg text-brand-gold tracking-[0.25em]">
                    SKIN CLUB
                  </span>
                </div>
              </div>
            </div>
            <span className="text-[11px] text-gray-300/80 mt-4 text-center">
              پک فیزیکی اختصاصی دوره SKIN CLUB همراه با ارسال پستی
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
