import type { Metadata } from "next";
import { AuthGuard } from "@/features/auth/components/auth-guard";

export const metadata: Metadata = {
  title: "پنل مدیریت کاربران",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard requiredRole="admin">{children}</AuthGuard>;
}
