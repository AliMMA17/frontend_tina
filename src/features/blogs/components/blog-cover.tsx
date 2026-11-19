"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import { resolveMediaUrl } from "@/lib/env";
import { cn } from "@/lib/utils";

interface BlogCoverProps {
  src: string | null;
  alt: string;
  className?: string;
}

export function BlogCover({ src, alt, className }: BlogCoverProps) {
  const resolvedSrc = resolveMediaUrl(src);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(resolvedSrc && failedSrc !== resolvedSrc);

  if (showImage && resolvedSrc) {
    return (
      <div className={cn("relative overflow-hidden bg-brand-iceLight", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resolvedSrc}
          alt={alt}
          onError={() => setFailedSrc(resolvedSrc)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-brand-iceBlue via-brand-iceLight to-brand-cream",
        className
      )}
    >
      <div className="h-28 w-28 rounded-full border-[18px] border-white/50" />
      <BookOpen className="absolute h-7 w-7 text-brand-navy/50" />
    </div>
  );
}
