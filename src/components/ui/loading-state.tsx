import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  label?: string;
  fullScreen?: boolean;
  className?: string;
}

export function LoadingState({
  label = "در حال بارگذاری...",
  fullScreen = false,
  className,
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-3 text-brand-muted",
        fullScreen ? "min-h-screen w-full bg-brand-cream" : "py-14 px-4",
        className
      )}
    >
      <Loader2 className="h-7 w-7 animate-spin text-brand-green" />
      {label && <p className="text-sm font-medium">{label}</p>}
    </div>
  );
}
