"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useLang } from "@/lib/i18n";

export default function ForgotPasswordPage() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "sent" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${location.origin}/reset-password`,
    });
    setState(error ? "error" : "sent");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="bg-white rounded-3xl border border-[#E5E8F0] p-8 flex flex-col gap-5 shadow-sm">
        <h1 className="font-heading text-2xl font-bold text-center">
          {ar ? "نسيت كلمة السر؟" : "Forgot your password?"}
        </h1>
        <p className="text-sm text-[#5A6378] text-center leading-relaxed">
          {ar
            ? "اكتب بريدك الإلكتروني وهنبعتلك لينك تعيد بيه ضبط كلمة السر."
            : "Enter your email and we will send you a reset link."}
        </p>
        {state === "sent" ? (
          <p className="text-sm text-emerald-700 bg-emerald-50 rounded-xl px-4 py-3 text-center">
            {ar ? "تم الإرسال! افتح بريدك واضغط على اللينك." : "Sent! Check your inbox for the reset link."}
          </p>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={ar ? "البريد الإلكتروني" : "Email address"}
              className="border border-[#D8DDE9] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-za-primary/40"
            />
            {state === "error" && (
              <p className="text-sm text-red-600 text-center">{ar ? "حصل خطأ — جرّب تاني." : "Something went wrong — try again."}</p>
            )}
            <button
              disabled={state === "loading"}
              className="bg-za-primary hover:bg-za-secondary transition text-white rounded-full py-3 text-sm font-bold disabled:opacity-60"
            >
              {state === "loading" ? (ar ? "بنبعت…" : "Sending…") : ar ? "ابعت لينك الاستعادة" : "Send reset link"}
            </button>
          </form>
        )}
        <Link href="/login" className="text-sm text-za-primary text-center hover:underline">
          {ar ? "رجوع لتسجيل الدخول" : "Back to sign in"}
        </Link>
      </div>
    </div>
  );
}
