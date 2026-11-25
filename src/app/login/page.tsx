"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const { lang, t } = useLang();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="bg-white rounded-2xl border border-[#E5E8F0] p-8 shadow-[0_20px_60px_rgba(69,51,139,0.12)] flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3">
          <Image src="/logo-icon-color.png" alt="ZONE A" width={56} height={56} className="w-14 h-14 drop-shadow-[0_6px_16px_rgba(69,51,139,0.22)]" priority />
          <h1 className="font-heading text-2xl font-bold">{t.loginTitle}</h1>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">{t.email}</span>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-[#D8DDE9] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-za-accent/40"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">{t.password}</span>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-[#D8DDE9] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-za-accent/40"
            />
          </label>
          <Link href="/forgot-password" className="text-xs text-za-primary hover:underline text-end -mt-1">
            {lang === "ar" ? "نسيت كلمة السر؟" : "Forgot password?"}
          </Link>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="bg-gradient-to-l from-za-primary to-za-accent hover:opacity-90 transition text-white rounded-full py-3 text-sm font-bold shadow-[0_8px_24px_rgba(69,51,139,0.35)] disabled:opacity-60"
          >
            {loading ? "…" : t.loginBtn}
          </button>
        </form>
        <Link href="/signup" className="text-sm text-za-secondary text-center hover:underline">
          {t.noAccount}
        </Link>
      </div>
    </div>
  );
}
