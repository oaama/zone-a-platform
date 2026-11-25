"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const { t } = useLang();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    setLoading(false);
    if (error) {
      const m = error.message.toLowerCase();
      if (m.includes("rate limit")) setError(t.signupErrRateLimit);
      else if (m.includes("already") && m.includes("register")) setError(t.signupErrExists);
      else setError(error.message);
      return;
    }
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      setError(t.signupErrExists);
      return;
    }
    if (data.session) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setDone(true);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="bg-white rounded-2xl border border-[#E5E8F0] p-8 shadow-[0_20px_60px_rgba(69,51,139,0.12)] flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3">
          <Image src="/logo-icon-color.png" alt="ZONE A" width={56} height={56} className="w-14 h-14 drop-shadow-[0_6px_16px_rgba(69,51,139,0.22)]" priority />
          <h1 className="font-heading text-2xl font-bold">{t.signupTitle}</h1>
        </div>
        {done ? (
          <p className="text-sm text-center text-[#3d4763]">{t.checkEmail}</p>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">{t.fullName}</span>
              <input
                type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)}
                className="rounded-xl border border-[#D8DDE9] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-za-accent/40"
              />
            </label>
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
                type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border border-[#D8DDE9] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-za-accent/40"
              />
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit" disabled={loading}
              className="bg-gradient-to-l from-za-primary to-za-accent hover:opacity-90 transition text-white rounded-full py-3 text-sm font-bold shadow-[0_8px_24px_rgba(69,51,139,0.35)] disabled:opacity-60"
            >
              {loading ? "…" : t.signupBtn}
            </button>
          </form>
        )}
        <Link href="/login" className="text-sm text-za-secondary text-center hover:underline">
          {t.haveAccount}
        </Link>
      </div>
    </div>
  );
}
