"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, RotateCcw } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Unhandled route error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-cream p-4">
      <div className="w-full max-w-md rounded-3xl border border-gray-200/80 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-extrabold text-brand-navy">
          خطایی در بارگذاری صفحه رخ داد
        </h1>
        <p className="mt-2 text-xs leading-relaxed text-brand-muted">
          {error.message || "لطفاً دوباره تلاش کنید یا به صفحه اصلی بازگردید."}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-green px-5 py-2.5 text-xs font-bold text-brand-gold transition-colors hover:bg-brand-greenLight cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>تلاش مجدد</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-brand-navy/25 bg-white px-5 py-2.5 text-xs font-bold text-brand-navy transition-colors hover:bg-brand-iceLight"
          >
            <ArrowRight className="h-4 w-4" />
            <span>صفحه اصلی</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
