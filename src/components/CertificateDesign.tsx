"use client";

import Image from "next/image";
import { useLang } from "@/lib/i18n";

export type CertVariant = 1 | 2 | 3;

export default function CertificateDesign({
  variant,
  studentName,
  courseTitleAr,
  courseTitleEn,
  serial,
  date,
}: {
  variant: CertVariant;
  studentName: string;
  courseTitleAr: string;
  courseTitleEn: string;
  serial: string;
  date: string;
}) {
  const { lang, t } = useLang();
  const courseTitle = lang === "ar" ? courseTitleAr : courseTitleEn || courseTitleAr;
  const dateStr = new Date(date).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const dir = lang === "ar" ? "rtl" : "ltr";
  const certLabel = lang === "ar" ? "شهادة إتمام" : "CERTIFICATE OF COMPLETION";
  const management = lang === "ar" ? "إدارة زون إيه" : "ZONE A Management";
  const signatureLabel = lang === "ar" ? "التوقيع" : "Signature";
  const issuedBy = lang === "ar" ? "شهادة صادرة من منصة زون إيه التعليمية" : "Issued by ZONE A Learning Platform";

  if (variant === 2) {
    /* Classic framed certificate with seal */
    return (
      <div
        dir={dir}
        className="relative mx-auto min-w-[680px] max-w-[940px] aspect-[1.414/1] bg-white shadow-[0_30px_80px_rgba(17,24,39,0.18)] print:shadow-none p-3"
      >
        <div className="relative h-full w-full border-2 border-za-primary/70 p-1.5">
          <div className="relative h-full w-full border border-za-accent/40 px-12 sm:px-16 py-9 flex flex-col items-center text-center">
            {/* corner accents */}
            <span className="absolute top-0 start-0 w-10 h-10 border-t-4 border-s-4 border-za-primary" aria-hidden />
            <span className="absolute top-0 end-0 w-10 h-10 border-t-4 border-e-4 border-za-primary" aria-hidden />
            <span className="absolute bottom-0 start-0 w-10 h-10 border-b-4 border-s-4 border-za-primary" aria-hidden />
            <span className="absolute bottom-0 end-0 w-10 h-10 border-b-4 border-e-4 border-za-primary" aria-hidden />

            <span className="bg-white rounded-xl p-1.5 border border-[#ECEFF6]">
              <Image src="/logo.jpg" alt="ZONE A" width={44} height={44} className="rounded-lg" />
            </span>
            <span className="mt-2 font-heading font-bold text-za-navy tracking-wide">ZONE A ACADEMY</span>

            <p className="mt-5 text-xs tracking-[0.4em] text-za-accent font-bold">{certLabel}</p>

            <div className="mt-3 flex items-center gap-3 w-56" aria-hidden>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-za-primary/60" />
              <span className="w-2 h-2 rotate-45 bg-za-primary" />
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-za-primary/60" />
            </div>

            <h1 className="mt-4 font-heading text-4xl sm:text-5xl font-bold text-za-navy leading-tight">{studentName}</h1>
            <p className="mt-3 text-sm text-[#5A6378]">{t.certCompleted}</p>
            <p className="mt-1 font-heading text-2xl font-bold text-za-primary">{courseTitle}</p>

            <div className="mt-auto w-full flex items-end justify-between gap-8 pt-6">
              <div className="flex flex-col items-center gap-1 min-w-[130px]">
                <span className="font-heading font-bold text-za-navy text-sm">{management}</span>
                <span className="w-full border-t border-[#C9CFDE] pt-1 text-[11px] text-[#8A93A8]">{signatureLabel}</span>
              </div>
              {/* seal */}
              <span className="relative -mb-2 w-20 h-20 rounded-full bg-gradient-to-br from-za-primary via-za-secondary to-za-accent p-1 shadow-[0_10px_25px_rgba(69,51,139,0.35)]" aria-hidden>
                <span className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <Image src="/logo.jpg" alt="" width={40} height={40} className="rounded-full" />
                </span>
              </span>
              <div className="flex flex-col items-center gap-1 min-w-[130px]">
                <span className="font-semibold text-za-navy text-sm">{dateStr}</span>
                <span className="w-full border-t border-[#C9CFDE] pt-1 text-[11px] text-[#8A93A8]">{t.certAwarded}</span>
              </div>
            </div>

            <div className="mt-4 w-full flex items-center justify-between text-[10px] text-[#9aa1b5]">
              <span>{issuedBy}</span>
              <span dir="ltr" className="font-mono">{serial}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 3) {
    /* Modern split-panel certificate */
    return (
      <div
        dir={dir}
        className="relative mx-auto min-w-[680px] max-w-[940px] aspect-[1.414/1] bg-white shadow-[0_30px_80px_rgba(17,24,39,0.18)] print:shadow-none flex overflow-hidden"
      >
        {/* side panel */}
        <div className="relative w-[30%] bg-gradient-to-b from-za-primary via-za-secondary to-za-navy flex flex-col items-center justify-between py-10 px-6 text-white">
          <div className="absolute inset-0 hero-grid opacity-20" aria-hidden />
          <Image src="/logo-icon.png" alt="ZONE A" width={56} height={56} className="relative w-14 h-14" />
          <span className="relative font-heading font-bold text-lg tracking-wide [writing-mode:vertical-rl] rotate-180">
            ZONE A ACADEMY
          </span>
          <span dir="ltr" className="relative text-[10px] font-mono text-white/70">{serial}</span>
        </div>

        {/* content */}
        <div className="flex-1 flex flex-col px-12 py-10">
          <p className="text-xs tracking-[0.4em] text-za-accent font-bold">{certLabel}</p>
          <div className="flex-1 flex flex-col justify-center gap-4">
            <h1 className="font-heading text-4xl sm:text-[3.4rem] font-bold text-za-navy leading-tight">{studentName}</h1>
            <p className="text-sm text-[#5A6378]">{t.certCompleted}</p>
            <p className="font-heading text-2xl font-bold text-za-primary">{courseTitle}</p>
            <div className="w-28 h-1 rounded-full bg-gradient-to-l from-za-primary to-za-accent" aria-hidden />
          </div>
          <div className="flex items-end justify-between gap-8">
            <div className="flex flex-col gap-0.5">
              <span className="font-heading font-bold text-za-navy text-sm">{management}</span>
              <span className="text-[11px] text-[#8A93A8]">{signatureLabel}</span>
            </div>
            <div className="flex flex-col gap-0.5 text-end">
              <span className="font-semibold text-za-navy text-sm">{dateStr}</span>
              <span className="text-[11px] text-[#8A93A8]">{t.certAwarded}</span>
            </div>
          </div>
          <div className="mt-5 border-t border-[#ECEFF6] pt-2.5 flex items-center justify-between text-[10px] text-[#9aa1b5]">
            <span>{issuedBy}</span>
            <span dir="ltr">zone-a-platform.onrender.com</span>
          </div>
        </div>
      </div>
    );
  }

  /* Variant 1 - minimal corporate */
  return (
    <div
      dir={dir}
      className="relative mx-auto min-w-[680px] max-w-[940px] aspect-[1.414/1] bg-white shadow-[0_30px_80px_rgba(17,24,39,0.18)] print:shadow-none flex flex-col"
    >
      <div className="h-2.5 w-full bg-gradient-to-l from-za-primary via-za-secondary to-za-accent" aria-hidden />

      <div className="flex-1 flex flex-col px-12 sm:px-16 py-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-white rounded-lg p-1 border border-[#ECEFF6]">
              <Image src="/logo.jpg" alt="ZONE A" width={38} height={38} className="rounded-md" />
            </span>
            <span className="leading-tight">
              <span className="block font-heading font-bold text-za-navy">ZONE A</span>
              <span className="block text-[10px] tracking-[0.3em] text-[#8A93A8]">ACADEMY</span>
            </span>
          </div>
          <span dir="ltr" className="text-[11px] font-mono text-[#9aa1b5]">{serial}</span>
        </div>

        <div className="flex-1 flex flex-col justify-center gap-4 py-6">
          <p className="text-xs tracking-[0.35em] text-za-accent font-bold">{certLabel}</p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-za-navy leading-tight">{studentName}</h1>
          <div className="w-24 h-0.5 bg-gradient-to-l from-za-primary to-za-accent" aria-hidden />
          <p className="text-sm text-[#5A6378]">{t.certCompleted}</p>
          <p className="font-heading text-2xl font-bold text-za-primary">{courseTitle}</p>
        </div>

        <div className="flex items-end justify-between gap-8 border-t border-[#ECEFF6] pt-5">
          <div className="flex flex-col gap-0.5">
            <span className="font-heading font-bold text-za-navy text-sm">{management}</span>
            <span className="text-[11px] text-[#8A93A8]">{signatureLabel}</span>
          </div>
          <div className="flex flex-col gap-0.5 text-end">
            <span className="font-semibold text-za-navy text-sm">{dateStr}</span>
            <span className="text-[11px] text-[#8A93A8]">{t.certAwarded}</span>
          </div>
        </div>
      </div>

      <div className="bg-[#F8F9FD] px-12 sm:px-16 py-2.5 text-[10px] text-[#9aa1b5] flex items-center justify-between">
        <span>{issuedBy}</span>
        <span dir="ltr">zone-a-platform.onrender.com</span>
      </div>
    </div>
  );
}
