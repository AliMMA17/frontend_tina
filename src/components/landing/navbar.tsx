"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogOut, Menu, ShieldCheck, User, X } from "lucide-react";
import {
  ensureValidSession,
  getSessionClaims,
  logout,
} from "@/features/auth/services/auth.service";
import type { JwtClaims } from "@/features/auth/types/auth.types";
import { NAV_LINKS } from "./constants";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<JwtClaims | null>(null);
  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      const localClaims = getSessionClaims();
      if (localClaims && active) {
        setSession(localClaims);
      }

      try {
        const validClaims = await ensureValidSession();
        if (active) {
          setSession(validClaims);
        }
      } catch {
        if (active) {
          setSession(null);
        }
      } finally {
        if (active) {
          setCheckedAuth(true);
        }
      }
    }

    loadSession();

    return () => {
      active = false;
    };
  }, []);

  const handleLogout = () => {
    logout();
    setSession(null);
  };

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

        {/* Auth Button / Active Session & Mobile Toggle (Left in RTL) */}
        <div className="flex items-center gap-2.5">
          {checkedAuth && session ? (
            <div className="flex items-center gap-2">
              {session.role === "admin" && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-green px-3.5 py-2 text-xs font-bold text-brand-gold shadow-xs transition-colors hover:bg-brand-greenLight"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">پنل مدیریت</span>
                </Link>
              )}
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-green/20 bg-brand-green/5 px-3.5 py-1.5 text-xs font-semibold text-brand-navy">
                <User className="h-3.5 w-3.5 text-brand-green shrink-0" />
                <span className="max-w-[110px] truncate" dir="ltr">
                  {session.username}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                title="خروج از حساب"
                className="inline-flex items-center gap-1 rounded-full border border-brand-navy/25 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 text-brand-navy text-xs font-medium px-3.5 py-2 transition-colors cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">خروج</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="border border-brand-navy/30 hover:border-brand-navy text-brand-navy text-xs sm:text-sm font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-colors whitespace-nowrap"
            >
              ورود / ثبت‌نام
            </Link>
          )}

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
            {checkedAuth && session?.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-2xl bg-brand-green px-4 py-2.5 text-sm font-bold text-brand-gold"
              >
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span>پنل مدیریت کاربران</span>
                </span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
