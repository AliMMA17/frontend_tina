import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "ورود به حساب کاربری",
};

export default function LoginPage() {
  return <LoginForm />;
}
