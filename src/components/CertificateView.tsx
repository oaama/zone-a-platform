"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { MedalIcon } from "@/components/Icons";
import CertificateDesign from "@/components/CertificateDesign";

export default function CertificateView({
  complete,
  slug,
  courseTitleAr,
  courseTitleEn,
  studentName,
  serial,
  date,
}: {
  complete: boolean;
  slug: string;
  courseTitleAr: string;
  courseTitleEn: string;
  studentName: string;
  serial: string;
  date: string;
}) {
  const { t, lang } = useLang();

  if (!complete) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center flex flex-col items-center gap-5">
        <span className="text-za-primary"><MedalIcon className="w-12 h-12" /></span>
        <h1 className="font-heading text-2xl font-bold">{t.certificateTitle}</h1>
        <p className="text-[#5A6378]">
          {lang === "ar" ? "الشهادة بتتاح بعد ما تخلص كل حصص الكورس." : "The certificate unlocks after you finish every lesson."}
        </p>
        <Link href={`/courses/${slug}`} className="bg-za-primary hover:bg-za-secondary transition text-white rounded-full px-6 py-3 text-sm font-semibold">
          {t.backToCourse}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 flex flex-col gap-6">
      <div className="flex justify-between items-center print:hidden">
        <Link href={`/courses/${slug}`} className="text-sm text-[#5A6378] hover:text-za-secondary transition">← {t.backToCourse}</Link>
        <button onClick={() => window.print()} className="bg-gradient-to-l from-za-primary to-za-accent hover:opacity-90 transition text-white rounded-full px-6 py-2.5 text-sm font-bold shadow-[0_8px_24px_rgba(69,51,139,0.35)]">
          {t.printCert}
        </button>
      </div>

      <div className="overflow-x-auto print:overflow-visible pb-2">
        <CertificateDesign
          variant={2}
          studentName={studentName}
          courseTitleAr={courseTitleAr}
          courseTitleEn={courseTitleEn}
          serial={serial}
          date={date}
        />
      </div>
    </div>
  );
}
