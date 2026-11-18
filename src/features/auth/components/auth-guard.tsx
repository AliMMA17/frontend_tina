"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LogOut, ShieldAlert } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import { tokenStorage } from "@/lib/tokens";
import { ensureValidSession } from "../services/auth.service";
import type { JwtClaims, UserRole } from "../types/auth.types";

interface AuthGuardProps {
  children: React.ReactNode;
  /** Optional role required to view the protected content */
  requiredRole?: UserRole;
  /** Route to redirect unauthenticated users to */
  redirectTo?: string;
}

export function AuthGuard({
  children,
  requiredRole,
  redirectTo = "/login",
}: AuthGuardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [claims, setClaims] = useState<JwtClaims | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let active = true;

    async function verifyAccess() {
      try {
        const session = await ensureValidSession();
        if (!active) return;

        if (!session) {
          router.replace(redirectTo);
          return;
        }

        setClaims(session);

        if (requiredRole) {
          setIsAuthorized(session.role === requiredRole);
        } else {
          setIsAuthorized(true);
        }
      } catch {
        tokenStorage.clearTokens();
        if (active) {
          router.replace(redirectTo);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    verifyAccess();

    return () => {
      active = false;
    };
  }, [redirectTo, requiredRole, router]);

  const handleSwitchAccount = () => {
    tokenStorage.clearTokens();
    router.replace(redirectTo);
  };

  if (loading) {
    return <LoadingState fullScreen label="در حال بررسی نشست کاربری..." />;
  }

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-cream p-4">
        <div className="w-full max-w-md space-y-5 rounded-3xl border border-gray-200 bg-white p-7 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-600">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-brand-navy">عدم دسترسی</h2>
            <p className="mt-2 text-xs leading-relaxed text-brand-muted">
              حساب کاربری شما ({claims?.username || "کاربر فعلی"}) دسترسی{" "}
              <code className="rounded bg-brand-iceLight px-1.5 py-0.5 text-rose-600">
                {requiredRole}
              </code>{" "}
              را ندارد.
            </p>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <button
              type="button"
              onClick={handleSwitchAccount}
              className="flex items-center justify-center gap-2 rounded-full bg-brand-green px-4 py-2.5 text-xs font-bold text-brand-gold transition-colors hover:bg-brand-greenLight cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>ورود با حساب دیگر</span>
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex items-center justify-center gap-2 rounded-full bg-brand-iceLight px-4 py-2.5 text-xs font-semibold text-brand-navy transition-colors hover:bg-brand-iceBlue cursor-pointer"
            >
              <ArrowRight className="h-4 w-4" />
              <span>بازگشت به صفحه اصلی</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
