"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, LogOut, ShieldAlert } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import { tokenStorage } from "@/lib/tokens";
import { getCurrentUser } from "../services/auth.service";
import type { AuthUser } from "../types/auth.types";

interface AuthGuardProps {
  children: React.ReactNode;
  /** Optional role required to view the protected content */
  requiredRole?: string;
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let active = true;

    async function verifyAccess() {
      const token = tokenStorage.getAccessToken();
      if (!token) {
        router.replace(redirectTo);
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        if (!active) return;

        setUser(currentUser);

        if (requiredRole) {
          const hasRole = currentUser.roles?.includes(requiredRole) ?? false;
          setIsAuthorized(hasRole);
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
    return <LoadingState fullScreen label="Verifying session..." />;
  }

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md space-y-5 rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-600">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Access Restricted</h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Your account ({user?.email || "current user"}) does not have the required{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-rose-600">
                {requiredRole}
              </code>{" "}
              permission.
            </p>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <button
              type="button"
              onClick={handleSwitchAccount}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign in with another account</span>
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to home</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
