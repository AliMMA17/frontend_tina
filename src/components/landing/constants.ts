export const BRAND_INSTAGRAM_HANDLE = "@tinafallah_skin";
export const BRAND_INSTAGRAM_URL = "https://instagram.com/tinafallah_skin";

export interface NavLinkItem {
  href: string;
  label: string;
  isActive?: boolean;
  comingSoon?: boolean;
}

export const NAV_LINKS: NavLinkItem[] = [
  { href: "#top", label: "خانه", isActive: true },
  { href: "#courses", label: "دوره‌های آموزشی" },
  { href: "#magazine", label: "مجله پوست", comingSoon: true },
  { href: "#shop", label: "فروشگاه", comingSoon: true },
  { href: "#about", label: "درباره من" },
  { href: "#footer", label: "تماس" },
];

export const HERO_PACK_ITEMS = [
  "کتاب چاپی SKIN CLUB",
  "مینی ژورنال",
  "کارت خوشامد و گواهی",
  "خودکار طلایی",
  "باکس هدیه",
] as const;
