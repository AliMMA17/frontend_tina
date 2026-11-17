import { env } from "@/lib/env";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-brand-green via-brand-green to-brand-navy p-4 py-8">
      <div />

      <div className="relative z-10 flex w-full justify-center">{children}</div>

      <footer className="relative z-10 space-y-1 text-center text-xs text-gray-300">
        <p className="font-brand-en text-sm text-brand-gold">Tina Fallah</p>
        <p className="font-mono text-[11px] opacity-80">v{env.appVersion}</p>
      </footer>
    </div>
  );
}
