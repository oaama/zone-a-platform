"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/i18n";

export default function AboutView() {
  const { lang, t } = useLang();
  const tracks = [
    { ar: "البرمجة", en: "Programming", d_ar: "من الأساسيات لحد بناء تطبيقات كاملة بمشاريع حقيقية.", d_en: "From the basics to building full applications through real projects.", icon: "M8 9l-4 3 4 3m8-6l4 3-4 3M13 5l-2 14" },
    { ar: "الجرافيكس", en: "Graphics", d_ar: "تصميم جرافيك وهوية بصرية بمعايير احترافية.", d_en: "Graphic design and visual identity at a professional standard.", icon: "M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 7.7l5.4-.8L12 2z" },
    { ar: "اللغات", en: "Languages", d_ar: "تعلم لغات جديدة بأسلوب عملي وتطبيق يومي.", d_en: "Learn new languages the practical way, with daily application.", icon: "M4 5h9M8.5 3v2c0 3.5-2.5 6.7-5.5 8m2-5.5c1.2 2.2 3.4 4 6 4.7m5-7.2l-4.5 12m0 0l-1.8-4m1.8 4l1.8-4" },
  ];
  const values = [
    { title: t.value1, d: t.value1d },
    { title: t.value2, d: t.value2d },
    { title: t.value3, d: t.value3d },
  ];
  const team = [
    { role: t.roleFounder, d: t.roleFounderD, initial: "A" },
    { role: t.roleProg, d: t.roleProgD, initial: "P" },
    { role: t.roleGfx, d: t.roleGfxD, initial: "G" },
    { role: t.roleLang, d: t.roleLangD, initial: "L" },
  ];
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 flex flex-col gap-14">
      <div className="flex flex-col items-center gap-5 text-center">
        <Image src="/logo-icon-color.png" alt="ZONE A" width={88} height={88} className="w-22 h-22 drop-shadow-[0_10px_24px_rgba(69,51,139,0.25)]" priority />
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold">{t.about}</h1>
          <p className="text-za-secondary font-heading font-semibold mt-2 tracking-wide">{t.tagline}</p>
        </div>
        <p className="text-[#3d4763] max-w-2xl leading-relaxed">{t.aboutText}</p>
      </div>

      <div className="relative overflow-hidden rounded-3xl shadow-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/cover.jpg" alt={t.coverAlt} className="w-full aspect-[4/3] sm:aspect-[16/9] object-cover" loading="lazy" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-5 sm:px-7 py-4">
          <p className="text-white font-heading font-bold text-sm sm:text-lg drop-shadow">{t.coverCaption}</p>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-center">{t.galleryTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/classroom-1.jpg" alt={t.galleryAlt} className="w-full aspect-[4/3] object-cover rounded-3xl shadow-lg" loading="lazy" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/classroom-2.jpg" alt={t.galleryAlt} className="w-full aspect-[4/3] object-cover rounded-3xl shadow-lg" loading="lazy" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:gap-5">
        {tracks.map((tr) => (
          <div key={tr.en} className="bg-white rounded-2xl border border-[#E5E8F0] p-3 sm:p-6 flex flex-col items-center gap-2 sm:gap-3 text-center hover:shadow-md transition">
            <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#EEF1FB] to-[#E2E9FA] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:w-6 sm:h-6 text-za-secondary" aria-hidden>
                <path d={tr.icon} />
              </svg>
            </span>
            <h3 className="font-heading font-bold text-xs sm:text-lg text-za-primary">{lang === "ar" ? tr.ar : tr.en}</h3>
            <p className="text-[10px] sm:text-sm text-[#5A6378] leading-relaxed">{lang === "ar" ? tr.d_ar : tr.d_en}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-za-primary to-za-accent rounded-3xl p-8 sm:p-10 text-white">
        <h2 className="font-heading text-2xl font-bold mb-6 text-center">{t.valuesTitle}</h2>
        <div className="grid grid-cols-3 gap-3 sm:gap-6">
          {values.map((v) => (
            <div key={v.title} className="flex flex-col gap-1.5 sm:gap-2 text-center">
              <h3 className="font-heading font-bold text-xs sm:text-base">{v.title}</h3>
              <p className="text-[10px] sm:text-sm text-[#D9E2F7] leading-relaxed">{v.d}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-za-primary via-za-secondary to-za-accent p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center gap-7 shadow-[0_24px_60px_rgba(69,51,139,0.35)]">
        <div className="absolute inset-0 hero-grid opacity-40 pointer-events-none" aria-hidden />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/founder.jpg" alt={t.instructorName} className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover object-top border-4 border-white/30 shadow-xl shrink-0" loading="lazy" />
        <div className="relative text-center sm:text-start">
          <p className="text-[#C7B9FF] text-sm font-semibold mb-1">{t.instructorTitle}</p>
          <h3 className="font-heading text-2xl sm:text-3xl font-bold">{t.instructorName}</h3>
          <p className="text-[#D9E2F7] text-sm mt-1">{t.instructorRole}</p>
          <p className="text-white/85 leading-relaxed mt-3 max-w-xl">{t.instructorBio}</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="text-center flex flex-col gap-2">
          <h2 className="font-heading text-2xl font-bold">{t.team}</h2>
          <p className="text-[#5A6378] max-w-xl mx-auto">{t.teamText}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {team.map((m) => (
            <div key={m.role} className="bg-white rounded-2xl border border-[#E5E8F0] p-5 flex flex-col items-center gap-3 text-center">
              {m.initial === "A" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src="/founder.jpg" alt={t.instructorName} className="w-16 h-16 rounded-full object-cover object-top ring-2 ring-za-primary/15" loading="lazy" />
              ) : (
                <span className="w-16 h-16 rounded-full bg-gradient-to-br from-za-primary to-za-accent text-white font-heading font-bold text-2xl flex items-center justify-center">
                  {m.initial}
                </span>
              )}
              <h3 className="font-heading font-bold text-sm">{m.role}</h3>
              <p className="text-xs text-[#5A6378] leading-relaxed">{m.d}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-[#8A93A8]">{t.teamSoon}</p>
      </div>

      <div className="text-center flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/#courses" className="inline-block bg-za-primary hover:bg-za-secondary transition text-white rounded-full px-6 py-3 text-sm font-semibold">
          {t.browseCourses}
        </Link>
        <Link href="/contact" className="inline-block border border-[#D8DDE9] hover:bg-white transition rounded-full px-6 py-3 text-sm font-semibold">
          {t.contact}
        </Link>
      </div>
    </div>
  );
}
