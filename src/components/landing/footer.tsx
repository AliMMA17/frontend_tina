import { BRAND_INSTAGRAM_HANDLE, BRAND_INSTAGRAM_URL } from "./constants";

export function Footer() {
  return (
    <footer id="footer" className="bg-brand-navy text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-white/10">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-3">
            <div className="font-brand-en text-2xl font-bold text-white">
              Tina Fallah
            </div>
            <p className="text-xs text-gray-300 leading-relaxed max-w-sm">
              آموزش علمی پوست، دوره‌های اسکین‌تراپی و فروشگاه تخصصی محصولات و
              دستگاه‌های پوستی
            </p>
            <div className="pt-1">
              <a
                href={BRAND_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs font-semibold text-brand-gold hover:underline"
                dir="ltr"
              >
                {BRAND_INSTAGRAM_HANDLE}
              </a>
            </div>
          </div>

          {/* Education Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider">
              آموزش
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <a
                  href="#featured-course"
                  className="hover:text-white transition-colors"
                >
                  دوره SKIN CLUB
                </a>
              </li>
              <li>
                <a
                  href="#courses"
                  className="hover:text-white transition-colors"
                >
                  همه دوره‌ها
                </a>
              </li>
              <li>
                <a
                  href="#magazine"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <span>مجله پوست</span>
                  <span className="text-[10px] text-brand-gold/80">
                    (به زودی)
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Shop Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider">
              فروشگاه (به زودی)
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <a href="#shop" className="hover:text-white transition-colors">
                  محصولات پوستی
                </a>
              </li>
              <li>
                <a href="#shop" className="hover:text-white transition-colors">
                  دستگاه‌های هوم‌کر
                </a>
              </li>
              <li>
                <a href="#shop" className="hover:text-white transition-colors">
                  دستگاه‌های کابین
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-4">
          <p>© تمام حقوق برای تینا فلاح محفوظ است.</p>
          <div className="flex items-center gap-6">
            <a
              href={BRAND_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              تماس در اینستاگرام
            </a>
            <span dir="ltr">tinafallah.ir</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
