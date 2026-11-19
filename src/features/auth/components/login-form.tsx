"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowRight,
  Loader2,
  Lock,
  LogIn,
  User,
} from "lucide-react";
import { isTokenExpired, tokenStorage } from "@/lib/tokens";
import { toEnglishDigits } from "@/lib/utils";
import { loginSchema, type LoginInput } from "../schemas/auth.schema";
import { login } from "../services/auth.service";
import { handleAuthFormError } from "../utils/form-errors";

const LOGIN_FIELDS: ReadonlyArray<keyof LoginInput> = ["username", "password"];

export function LoginForm() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    const accessToken = tokenStorage.getAccessToken();
    if (accessToken && !isTokenExpired(accessToken)) {
      router.replace("/");
    }
  }, [router]);

  const onSubmit = async (data: LoginInput) => {
    try {
      setApiError(null);
      await login(data);
      router.replace("/");
    } catch (err: unknown) {
      setApiError(
        handleAuthFormError(
          err,
          setError,
          LOGIN_FIELDS,
          "ورود ناموفق بود. لطفاً دوباره تلاش کنید."
        )
      );
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-brand-gold/30 bg-brand-cream p-7 sm:p-8 shadow-2xl">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green text-brand-gold shadow-md">
          <LogIn className="h-6 w-6" />
        </div>
        <span className="font-brand-en text-lg font-bold text-brand-navy">
          Tina Fallah
        </span>
        <h1 className="mt-1 text-xl font-extrabold text-brand-navy">
          ورود به حساب کاربری
        </h1>
        <p className="mt-1 text-xs text-brand-muted">
          دسترسی به دوره‌ها و پنل هنرجویان SKIN CLUB
        </p>
      </div>

      {apiError && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-xs text-rose-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <label
            htmlFor="username"
            className="block text-xs font-semibold text-brand-navy"
          >
            نام کاربری
          </label>
          <div className="flex items-center gap-2.5 rounded-2xl border border-gray-200 bg-white px-3.5 focus-within:border-brand-green transition-colors">
            <User className="h-4 w-4 shrink-0 text-brand-muted" />
            <input
              id="username"
              type="text"
              dir="ltr"
              autoComplete="username"
              disabled={isSubmitting}
              placeholder="username"
              {...register("username", {
                onChange: (e) => {
                  e.target.value = toEnglishDigits(e.target.value).replace(
                    /\s+/g,
                    ""
                  );
                },
              })}
              className="w-full bg-transparent py-2.5 text-sm text-brand-navy placeholder:text-gray-400 outline-none disabled:opacity-50 text-left"
            />
          </div>
          {errors.username && (
            <p className="text-xs font-medium text-rose-600">
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-xs font-semibold text-brand-navy"
          >
            رمز عبور
          </label>
          <div className="flex items-center gap-2.5 rounded-2xl border border-gray-200 bg-white px-3.5 focus-within:border-brand-green transition-colors">
            <Lock className="h-4 w-4 shrink-0 text-brand-muted" />
            <input
              id="password"
              type="password"
              dir="ltr"
              autoComplete="current-password"
              disabled={isSubmitting}
              placeholder="••••••••"
              {...register("password")}
              className="w-full bg-transparent py-2.5 text-sm text-brand-navy placeholder:text-gray-400 outline-none disabled:opacity-50 text-left"
            />
          </div>
          {errors.password && (
            <p className="text-xs font-medium text-rose-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-green text-sm font-bold text-brand-gold shadow-sm transition-colors hover:bg-brand-greenLight disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>در حال ورود...</span>
            </>
          ) : (
            <span>ورود</span>
          )}
        </button>
      </form>

      <div className="mt-5 text-center text-xs text-brand-muted">
        حساب کاربری ندارید؟{" "}
        <Link
          href="/register"
          className="font-bold text-brand-green hover:underline underline-offset-4"
        >
          ثبت‌نام کنید
        </Link>
      </div>

      <div className="mt-5 border-t border-gray-200/80 pt-4 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-muted transition-colors hover:text-brand-navy"
        >
          <ArrowRight className="h-3.5 w-3.5" />
          <span>بازگشت به صفحه اصلی</span>
        </Link>
      </div>
    </div>
  );
}
