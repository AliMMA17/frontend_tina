"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "./constants";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-brand-cream/95 backdrop-blur-md border-b border-gray-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo (Right in RTL) */}
        <Link href="/" className="flex flex-col text-right shrink-0">
          <span className="font-brand-en text-2xl font-bold text-brand-navy leading-none">
            Tina Fallah
          </span>
          <span className="text-[11px] text-brand-muted tracking-wider mt-1">
            Skin Therapist &amp; Educator
          </span>
        </Link>

        {/* Main Nav Links */}
        <nav
          aria-label="منوی اصلی"
          className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-brand-navy"
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`inline-flex items-center gap-1.5 transition-colors ${
                item.isActive
                  ? "text-brand-green font-bold"
                  : "hover:text-brand-green"
              }`}
            >
              <span>{item.label}</span>
              {item.comingSoon && (
                <span className="rounded-full bg-brand-iceLight px-2 py-0.5 text-[10px] font-semibold text-brand-muted border border-brand-iceBlue">
                  به زودی
                </span>
              )}
            </a>
          ))}
        </nav>

        {/* Auth Button & Mobile Toggle (Left in RTL) */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/login"
            className="border border-brand-navy/30 hover:border-brand-navy text-brand-navy text-xs sm:text-sm font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-colors whitespace-nowrap"
          >
            ورود / ثبت‌نام
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "بستن منو" : "باز کردن منو"}
            aria-expanded={mobileMenuOpen}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-full border border-brand-navy/20 text-brand-navy hover:bg-brand-iceLight transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200/70 bg-brand-cream px-4 py-4">
          <nav aria-label="منوی موبایل" className="flex flex-col gap-1.5">
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  item.isActive
                    ? "bg-brand-green/10 text-brand-green font-bold"
                    : "text-brand-navy hover:bg-brand-iceLight"
                }`}
              >
                <span>{item.label}</span>
                {item.comingSoon && (
                  <span className="rounded-full bg-brand-iceLight px-2.5 py-0.5 text-[10px] font-semibold text-brand-muted border border-brand-iceBlue">
                    به زودی
                  </span>
                )}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
