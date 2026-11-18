"use client";

import { AlertCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorState({
  title = "خطایی رخ داد",
  message = "در دریافت اطلاعات مشکلی پیش آمد. لطفاً دوباره تلاش کنید.",
  onRetry,
  retryLabel = "تلاش مجدد",
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border border-rose-200 bg-rose-50/70 px-6 py-10 text-center",
        className
      )}
    >
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
        <AlertCircle className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-bold text-brand-navy">{title}</h3>
      <p className="mt-1 max-w-md text-xs leading-relaxed text-brand-muted">
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-rose-700 cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>{retryLabel}</span>
        </button>
      )}
    </div>
  );
}
