"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLang } from "@/lib/i18n";

export default function ResetPasswordPage() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setState("error");
    else {
      setState("done");
      setTimeout(() => router.push("/dashboard"), 1800);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="bg-white rounded-3xl border border-[#E5E8F0] p-8 flex flex-col gap-5 shadow-sm">
        <h1 className="font-heading text-2xl font-bold text-center">
          {ar ? "كلمة سر جديدة" : "Set a new password"}
        </h1>
        {state === "done" ? (
          <p className="text-sm text-emerald-700 bg-emerald-50 rounded-xl px-4 py-3 text-center">
            {ar ? "تم تغيير كلمة السر! بنحولك لحسابك…" : "Password changed! Redirecting…"}
          </p>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-4">
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={ar ? "كلمة السر الجديدة (٨ حروف على الأقل)" : "New password (min 8 chars)"}
              className="border border-[#D8DDE9] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-za-primary/40"
            />
            {state === "error" && (
              <p className="text-sm text-red-600 text-center">
                {ar ? "حصل خطأ — افتح اللينك من الإيميل تاني." : "Error — reopen the link from your email."}
              </p>
            )}
            <button
              disabled={state === "loading"}
              className="bg-za-primary hover:bg-za-secondary transition text-white rounded-full py-3 text-sm font-bold disabled:opacity-60"
            >
              {state === "loading" ? (ar ? "بنحفظ…" : "Saving…") : ar ? "احفظ كلمة السر" : "Save password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
