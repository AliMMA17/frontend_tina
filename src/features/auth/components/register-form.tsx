"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  Globe,
  Loader2,
  Lock,
  MapPin,
  Phone,
  User,
  UserPlus,
  Wallet,
} from "lucide-react";
import { isTokenExpired, tokenStorage } from "@/lib/tokens";
import { registerSchema, type RegisterInput } from "../schemas/auth.schema";
import { registerUser } from "../services/auth.service";
import { handleAuthFormError } from "../utils/form-errors";

const REGISTER_FIELDS: ReadonlyArray<keyof RegisterInput> = [
  "username",
  "password",
  "full_name",
  "phone_number",
  "full_address",
  "job",
  "work_page",
  "income",
];

export function RegisterForm() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    const accessToken = tokenStorage.getAccessToken();
    if (accessToken && !isTokenExpired(accessToken)) {
      router.replace("/");
    }
  }, [router]);

  const onSubmit = async (data: RegisterInput) => {
    try {
      setApiError(null);
      await registerUser({
        username: data.username,
        password: data.password,
        full_name: data.full_name,
        phone_number: data.phone_number,
        full_address: data.full_address,
        job: data.job,
        work_page: data.work_page || null,
        income: data.income || null,
      });
      router.replace("/");
    } catch (err: unknown) {
      setApiError(
        handleAuthFormError(
          err,
          setError,
          REGISTER_FIELDS,
          "ثبت‌نام انجام نشد. لطفاً دوباره تلاش کنید."
        )
      );
    }
  };

  return (
    <div className="w-full max-w-xl rounded-3xl border border-brand-gold/30 bg-brand-cream p-7 sm:p-8 shadow-2xl">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green text-brand-gold shadow-md">
          <UserPlus className="h-6 w-6" />
        </div>
        <span className="font-brand-en text-lg font-bold text-brand-navy">
          Tina Fallah
        </span>
        <h1 className="mt-1 text-xl font-extrabold text-brand-navy">
          ایجاد حساب کاربری
        </h1>
        <p className="mt-1 text-xs text-brand-muted">
          ثبت‌نام در آکادمی و دوره‌های تخصصی SKIN CLUB
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Username */}
          <div className="space-y-1.5">
            <label
              htmlFor="username"
              className="block text-xs font-semibold text-brand-navy"
            >
              نام کاربری <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-2.5 rounded-2xl border border-gray-200 bg-white px-3.5 focus-within:border-brand-green transition-colors">
              <User className="h-4 w-4 shrink-0 text-brand-muted" />
              <input
                id="username"
                type="text"
                dir="ltr"
                autoComplete="username"
                disabled={isSubmitting}
                placeholder="min 3 chars"
                {...register("username")}
                className="w-full bg-transparent py-2.5 text-sm text-brand-navy placeholder:text-gray-400 outline-none disabled:opacity-50 text-left"
              />
            </div>
            {errors.username && (
              <p className="text-xs font-medium text-rose-600">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-brand-navy"
            >
              رمز عبور <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-2.5 rounded-2xl border border-gray-200 bg-white px-3.5 focus-within:border-brand-green transition-colors">
              <Lock className="h-4 w-4 shrink-0 text-brand-muted" />
              <input
                id="password"
                type="password"
                dir="ltr"
                autoComplete="new-password"
                disabled={isSubmitting}
                placeholder="حداقل ۸ کاراکتر"
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

          {/* Full Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="full_name"
              className="block text-xs font-semibold text-brand-navy"
            >
              نام و نام خانوادگی <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-2.5 rounded-2xl border border-gray-200 bg-white px-3.5 focus-within:border-brand-green transition-colors">
              <User className="h-4 w-4 shrink-0 text-brand-muted" />
              <input
                id="full_name"
                type="text"
                autoComplete="name"
                disabled={isSubmitting}
                placeholder="نام کامل"
                {...register("full_name")}
                className="w-full bg-transparent py-2.5 text-sm text-brand-navy placeholder:text-gray-400 outline-none disabled:opacity-50"
              />
            </div>
            {errors.full_name && (
              <p className="text-xs font-medium text-rose-600">
                {errors.full_name.message}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label
              htmlFor="phone_number"
              className="block text-xs font-semibold text-brand-navy"
            >
              شماره تماس <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-2.5 rounded-2xl border border-gray-200 bg-white px-3.5 focus-within:border-brand-green transition-colors">
              <Phone className="h-4 w-4 shrink-0 text-brand-muted" />
              <input
                id="phone_number"
                type="tel"
                dir="ltr"
                autoComplete="tel"
                disabled={isSubmitting}
                placeholder="09123456789"
                {...register("phone_number")}
                className="w-full bg-transparent py-2.5 text-sm text-brand-navy placeholder:text-gray-400 outline-none disabled:opacity-50 text-left font-mono"
              />
            </div>
            {errors.phone_number && (
              <p className="text-xs font-medium text-rose-600">
                {errors.phone_number.message}
              </p>
            )}
          </div>

          {/* Job */}
          <div className="space-y-1.5">
            <label
              htmlFor="job"
              className="block text-xs font-semibold text-brand-navy"
            >
              شغل / تخصص <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-2.5 rounded-2xl border border-gray-200 bg-white px-3.5 focus-within:border-brand-green transition-colors">
              <Briefcase className="h-4 w-4 shrink-0 text-brand-muted" />
              <input
                id="job"
                type="text"
                disabled={isSubmitting}
                placeholder="مثلاً اسکین‌تراپیست / دانشجو"
                {...register("job")}
                className="w-full bg-transparent py-2.5 text-sm text-brand-navy placeholder:text-gray-400 outline-none disabled:opacity-50"
              />
            </div>
            {errors.job && (
              <p className="text-xs font-medium text-rose-600">
                {errors.job.message}
              </p>
            )}
          </div>

          {/* Work Page (Optional) */}
          <div className="space-y-1.5">
            <label
              htmlFor="work_page"
              className="block text-xs font-semibold text-brand-navy"
            >
              صفحه کاری / اینستاگرام{" "}
              <span className="text-[11px] font-normal text-brand-muted">
                (اختیاری)
              </span>
            </label>
            <div className="flex items-center gap-2.5 rounded-2xl border border-gray-200 bg-white px-3.5 focus-within:border-brand-green transition-colors">
              <Globe className="h-4 w-4 shrink-0 text-brand-muted" />
              <input
                id="work_page"
                type="text"
                dir="ltr"
                disabled={isSubmitting}
                placeholder="@your_page یا لینک"
                {...register("work_page")}
                className="w-full bg-transparent py-2.5 text-sm text-brand-navy placeholder:text-gray-400 outline-none disabled:opacity-50 text-left"
              />
            </div>
            {errors.work_page && (
              <p className="text-xs font-medium text-rose-600">
                {errors.work_page.message}
              </p>
            )}
          </div>
        </div>

        {/* Income (Optional) */}
        <div className="space-y-1.5">
          <label
            htmlFor="income"
            className="block text-xs font-semibold text-brand-navy"
          >
            میزان یا بازه درآمد{" "}
            <span className="text-[11px] font-normal text-brand-muted">
              (اختیاری)
            </span>
          </label>
          <div className="flex items-center gap-2.5 rounded-2xl border border-gray-200 bg-white px-3.5 focus-within:border-brand-green transition-colors">
            <Wallet className="h-4 w-4 shrink-0 text-brand-muted" />
            <input
              id="income"
              type="text"
              disabled={isSubmitting}
              placeholder="مثلاً 10-20M"
              {...register("income")}
              className="w-full bg-transparent py-2.5 text-sm text-brand-navy placeholder:text-gray-400 outline-none disabled:opacity-50"
            />
          </div>
          {errors.income && (
            <p className="text-xs font-medium text-rose-600">
              {errors.income.message}
            </p>
          )}
        </div>

        {/* Full Address */}
        <div className="space-y-1.5">
          <label
            htmlFor="full_address"
            className="block text-xs font-semibold text-brand-navy"
          >
            آدرس کامل پستی (جهت ارسال پک فیزیکی){" "}
            <span className="text-rose-500">*</span>
          </label>
          <div className="flex items-start gap-2.5 rounded-2xl border border-gray-200 bg-white px-3.5 py-2.5 focus-within:border-brand-green transition-colors">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-muted" />
            <textarea
              id="full_address"
              rows={2}
              disabled={isSubmitting}
              placeholder="استان، شهر، خیابان، پلاک، واحد"
              {...register("full_address")}
              className="w-full resize-none bg-transparent text-sm text-brand-navy placeholder:text-gray-400 outline-none disabled:opacity-50"
            />
          </div>
          {errors.full_address && (
            <p className="text-xs font-medium text-rose-600">
              {errors.full_address.message}
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
              <span>در حال ثبت‌نام...</span>
            </>
          ) : (
            <span>ثبت‌نام و ایجاد حساب</span>
          )}
        </button>
      </form>

      <div className="mt-5 text-center text-xs text-brand-muted">
        قبلاً ثبت‌نام کرده‌اید؟{" "}
        <Link
          href="/login"
          className="font-bold text-brand-green hover:underline underline-offset-4"
        >
          وارد شوید
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
