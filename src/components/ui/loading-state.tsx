import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  label?: string;
  fullScreen?: boolean;
  className?: string;
}

export function LoadingState({
  label = "Loading...",
  fullScreen = false,
  className,
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-3 text-slate-500",
        fullScreen ? "min-h-screen w-full" : "py-14 px-4",
        className
      )}
    >
      <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
      {label && <p className="text-sm font-medium">{label}</p>}
    </div>
  );
}
