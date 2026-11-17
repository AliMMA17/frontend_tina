import Link from "next/link";
import { ArrowRight, FileQuestion } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-cream p-4">
      <div className="w-full max-w-md rounded-3xl border border-gray-200/80 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-iceLight text-brand-navy">
          <FileQuestion className="h-7 w-7" />
        </div>
        <p className="font-mono text-xs font-bold tracking-wider text-brand-green">
          404
        </p>
        <h1 className="mt-1 text-xl font-extrabold text-brand-navy">
          صفحه مورد نظر یافت نشد
        </h1>
        <p className="mt-2 text-xs leading-relaxed text-brand-muted">
          نشانی وارد شده وجود ندارد یا ممکن است به بخش دیگری منتقل شده باشد.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-navy px-6 py-2.5 text-xs font-bold text-white transition-colors hover:bg-brand-green"
        >
          <ArrowRight className="h-4 w-4" />
          <span>بازگشت به صفحه اصلی</span>
        </Link>
      </div>
    </div>
  );
}
