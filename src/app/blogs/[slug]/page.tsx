"use client";

import { useParams } from "next/navigation";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { BlogDetailView } from "@/features/blogs/components/blog-detail-view";

export default function BlogDetailPage() {
  const params = useParams<{ slug: string }>();
  const rawSlug = typeof params?.slug === "string" ? params.slug : "";
  const decodedSlug = (() => {
    try {
      return decodeURIComponent(rawSlug);
    } catch {
      return rawSlug;
    }
  })();

  return (
    <div className="flex min-h-screen flex-col bg-brand-cream text-brand-navy">
      <Navbar />
      <main className="flex-1">
        <BlogDetailView slug={decodedSlug} />
      </main>
      <Footer />
    </div>
  );
}
