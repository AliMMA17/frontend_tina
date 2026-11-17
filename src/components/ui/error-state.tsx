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
  title = "Something went wrong",
  message = "An unexpected error occurred while loading this content.",
  onRetry,
  retryLabel = "Try again",
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/60 px-6 py-10 text-center",
        className
      )}
    >
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
        <AlertCircle className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-md text-xs leading-relaxed text-slate-600">
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-rose-700 cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>{retryLabel}</span>
        </button>
      )}
    </div>
  );
}
