"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { ChatIcon } from "@/components/Icons";

const WHATSAPP = "201202412997";

export default function ContactView() {
  const { lang, t } = useLang();
  const waGeneral = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    lang === "ar" ? "السلام عليكم، عايز أستسفر عن كورسات زون إيه" : "Hi, I have a question about ZONE A courses"
  )}`;
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 flex flex-col gap-8">
      <div className="text-center flex flex-col gap-3">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold">{t.contactTitle}</h1>
        <p className="text-[#3d4763] max-w-xl mx-auto leading-relaxed">{t.contactText}</p>
      </div>

      <a
        href={waGeneral}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative overflow-hidden bg-gradient-to-br from-[#45338B] via-[#2E4DA0] to-[#1A5BB5] text-white rounded-3xl p-8 flex items-center gap-5 shadow-lg shadow-[#45338B]/25 transition hover:-translate-y-0.5 hover:shadow-xl"
      >
        <span className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_80%_20%,white,transparent_55%)]" />
        <span className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-[#25D366] text-white shadow-lg shadow-black/20 shrink-0 transition group-hover:scale-105"><ChatIcon className="w-7 h-7" /></span>
        <span className="relative flex flex-col gap-1">
          <span className="font-heading font-bold text-xl">{t.whatsappUs}</span>
          <span className="text-sm text-white/85" dir="ltr">+20 120 241 2997</span>
          <span className="text-sm text-white/85">{t.whatsappNote}</span>
        </span>
      </a>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-[#E5E8F0] p-6 flex flex-col gap-3">
          <h2 className="font-heading font-bold">{t.contactEnrollTitle}</h2>
          <p className="text-sm text-[#5A6378] leading-relaxed flex-1">{t.contactEnrollText}</p>
          <Link href="/#courses" className="self-start bg-za-primary hover:bg-za-secondary transition text-white rounded-full px-5 py-2.5 text-sm font-semibold">
            {t.browseCourses}
          </Link>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E8F0] p-6 flex flex-col gap-3">
          <h2 className="font-heading font-bold">{t.contactAccountTitle}</h2>
          <p className="text-sm text-[#5A6378] leading-relaxed">{t.contactAccountText}</p>
        </div>
      </div>
    </div>
  );
}
