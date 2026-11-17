import type { Metadata } from "next";
import { Cormorant_Garamond, Vazirmatn } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-vazirmatn",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: {
    default: "Tina Fallah | SKIN CLUB - آموزش علمی پوست و اسکین‌تراپی",
    template: "%s | Tina Fallah",
  },
  description:
    "آموزش علمی پوست، دوره جامع اسکین‌تراپی SKIN CLUB همراه با پک فیزیکی اختصاصی و کتاب چاپی.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} ${cormorant.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-brand-cream text-brand-navy antialiased selection:bg-brand-gold selection:text-brand-green">
        {children}
      </body>
    </html>
  );
}
