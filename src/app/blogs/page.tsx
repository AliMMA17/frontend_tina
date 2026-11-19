import type { Metadata } from "next";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { BlogsListView } from "@/features/blogs/components/blogs-list-view";

export const metadata: Metadata = {
  title: "وبلاگ و مقالات علمی پوست",
  description:
    "مقالات علمی و تخصصی پوست، مواد فعال، روتین پوستی و اسکین‌تراپی در آکادمی تینا فلاح.",
};

export default function BlogsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-cream text-brand-navy">
      <Navbar />
      <main className="flex-1">
        <BlogsListView />
      </main>
      <Footer />
    </div>
  );
}
