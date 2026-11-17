const VALUE_PROPS = [
  {
    symbol: "△",
    title: "آموزش علمی و مبتنی بر شواهد",
    description: "نه ترند، نه حدس؛ علم پوست",
  },
  {
    symbol: "□",
    title: "کتاب چاپی اختصاصی",
    description: "همراه همیشگی بعد از دوره",
  },
  {
    symbol: "○",
    title: "مسیر صفر تا پیشرفته",
    description: "قدم به قدم تا مهارت حرفه‌ای",
  },
  {
    symbol: "◎",
    title: "خرید امن و ضمانت اصالت کالا",
    description: "شرایط ارسال و مرجوعی",
  },
] as const;

export function ValueProps() {
  return (
    <section className="border-b border-gray-200/80 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUE_PROPS.map((item) => (
            <div key={item.title} className="flex items-start gap-3.5">
              <div
                aria-hidden="true"
                className="w-10 h-10 rounded-xl bg-brand-iceLight text-brand-navy flex items-center justify-center shrink-0 font-bold"
              >
                {item.symbol}
              </div>
              <div>
                <h3 className="text-sm font-bold text-brand-navy">
                  {item.title}
                </h3>
                <p className="text-xs text-brand-muted mt-1">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
