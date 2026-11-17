export function AnnouncementBar() {
  return (
    <div
      id="top"
      className="bg-brand-navy text-white text-xs sm:text-sm py-2.5 px-4 text-center"
    >
      <span>
        ثبت‌نام دوره{" "}
        <strong className="font-brand-en text-brand-gold tracking-wider">
          SKIN CLUB
        </strong>{" "}
        آغاز شد.
      </span>
      <a
        href="#featured-course"
        className="underline decoration-brand-gold/70 hover:text-brand-gold ms-2 font-medium transition-colors"
      >
        مشاهده جزئیات و ثبت‌نام
      </a>
    </div>
  );
}
