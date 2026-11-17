import { AboutSection } from "@/components/landing/about-section";
import { AnnouncementBar } from "@/components/landing/announcement-bar";
import { CoursesSection } from "@/components/landing/courses-section";
import { Footer } from "@/components/landing/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { InstagramCta } from "@/components/landing/instagram-cta";
import { MagazineComingSoon } from "@/components/landing/magazine-coming-soon";
import { Navbar } from "@/components/landing/navbar";
import { ShopComingSoon } from "@/components/landing/shop-coming-soon";
import { ValueProps } from "@/components/landing/value-props";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-cream text-brand-navy">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ValueProps />
        <CoursesSection />
        <ShopComingSoon />
        <MagazineComingSoon />
        <AboutSection />
        <InstagramCta />
      </main>
      <Footer />
    </div>
  );
}
