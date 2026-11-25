"use client";

import Link from "next/link";
import { useLang, catName } from "@/lib/i18n";
import { LockIcon, MedalIcon } from "@/components/Icons";

export type LessonCatalogItem = {
  id: string;
  title_ar: string;
  title_en: string;
  duration_minutes: number | null;
  sort_order: number;
  is_preview: boolean;
};

type Course = {
  slug: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  thumbnail_url: string | null;
  level: string;
  category: string | null;
};

const WHATSAPP = "201202412997";



export function waLink(courseTitle: string, lang: string) {
  const text = encodeURIComponent(
    lang === "ar"
      ? `السلام عليكم، عايز أشترك في كورس: ${courseTitle}`
      : `Hi, I want to enroll in the course: ${courseTitle}`
  );
  return `https://wa.me/${WHATSAPP}?text=${text}`;
}

export default function CourseView({
  course,
  enrolled,
  lessons,
  completedIds,
  loggedIn,
}: {
  course: Course;
  enrolled: boolean;
  lessons: LessonCatalogItem[];
  completedIds: string[];
  loggedIn: boolean;
}) {
  const { lang, t } = useLang();
  const title = lang === "ar" ? course.title_ar : course.title_en || course.title_ar;
  const description = lang === "ar" ? course.description_ar : course.description_en || course.description_ar;
  const totalMin = lessons.reduce((s, l) => s + (l.duration_minutes ?? 0), 0);
  const cat = course.category ? catName(course.category, lang) : null;
  const learnItems = lessons.slice(0, 6);
  const firstOpen = lessons.findIndex((l) => enrolled || l.is_preview);
  const nextLesson = enrolled ? lessons.findIndex((l) => !completedIds.includes(l.id)) : firstOpen;
  const ctaHref = enrolled
    ? nextLesson >= 0
      ? `/courses/${course.slug}/lessons/${nextLesson + 1}`
      : `/courses/${course.slug}/certificate`
    : waLink(course.title_ar, lang);
  const ctaLabel = enrolled ? (nextLesson >= 0 ? t.continueLearning : t.getCertificate) : t.requestAccess;
  const ctaExternal = !enrolled;

  return (
    <div className="pb-24 sm:pb-12">
      {/* hero banner */}
      <div className="relative overflow-hidden bg-za-navy">
        {course.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={course.thumbnail_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-45" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-za-primary to-za-accent" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/60 to-transparent" />
        <div className="relative mx-auto max-w-4xl px-4 pt-14 pb-6 sm:pt-20 sm:pb-8 flex flex-col gap-3 text-white">
          <div className="flex items-center gap-2 flex-wrap">
            {cat && <span className="text-[11px] font-semibold bg-za-accent/90 rounded-full px-3 py-1">{cat}</span>}
            <span className="text-[11px] font-semibold bg-white/15 backdrop-blur rounded-full px-3 py-1">{t.levels[course.level] ?? course.level}</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-4xl font-bold leading-snug">{title}</h1>
          <p className="text-xs sm:text-sm text-[#D9E2F7] flex items-center gap-2 flex-wrap">
            <span>{lessons.length} {t.lessons}</span>
            {totalMin > 0 && <span>• {totalMin} {t.minute}</span>}
            <span className="inline-flex items-center gap-1"><MedalIcon className="w-3.5 h-3.5" /> {t.certificateIncluded}</span>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 flex flex-col gap-8">
        {/* about the course */}
        <div className="bg-white rounded-2xl border border-[#E5E8F0] p-6 sm:p-8 flex flex-col gap-3">
          <h2 className="font-heading text-lg sm:text-xl font-bold">{t.aboutCourse}</h2>
          <p className="text-[#3d4763] leading-relaxed whitespace-pre-line">{description}</p>
        </div>

        {/* what you will learn */}
        {learnItems.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#E5E8F0] p-6 sm:p-8 flex flex-col gap-4">
            <h2 className="font-heading text-lg sm:text-xl font-bold">{t.whatYouLearn}</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {learnItems.map((l) => (
                <li key={l.id} className="flex items-start gap-2.5 text-sm text-[#3d4763]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mt-0.5 shrink-0 text-za-accent" aria-hidden>
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="leading-relaxed">{lang === "ar" ? l.title_ar : l.title_en || l.title_ar}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* instructor */}
        <div className="bg-white rounded-2xl border border-[#E5E8F0] p-6 sm:p-8 flex items-center gap-4 sm:gap-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/founder.jpg" alt={t.instructorName} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover object-top ring-2 ring-za-primary/15 shrink-0" loading="lazy" />
          <div>
            <p className="text-xs text-[#8A93A8] font-semibold">{t.instructorOnCourse}</p>
            <p className="font-heading font-bold text-base sm:text-lg mt-0.5">{t.instructorName}</p>
            <p className="text-xs sm:text-sm text-[#5A6378] mt-0.5">{t.instructorRole}</p>
          </div>
        </div>

        {/* course content */}
        {lessons.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#E5E8F0] p-6 sm:p-8 flex flex-col gap-4">
            <h2 className="font-heading text-lg sm:text-xl font-bold">{t.courseContent}</h2>
            <ol className="flex flex-col divide-y divide-[#EEF1FB]">
              {lessons.map((l, i) => {
                const open = enrolled || l.is_preview;
                const done = completedIds.includes(l.id);
                const ltitle = lang === "ar" ? l.title_ar : l.title_en || l.title_ar;
                const inner = (
                  <div className="flex items-center gap-4 py-3">
                    <span className="w-8 h-8 shrink-0 rounded-full bg-[#EEF1FB] text-za-secondary text-sm font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="flex-1 font-medium text-sm sm:text-base">{ltitle}</span>
                    {l.is_preview && !enrolled && (
                      <span className="text-[11px] font-semibold text-za-accent bg-[#EAF2FD] rounded-full px-2.5 py-1">
                        {t.previewBadge}
                      </span>
                    )}
                    {done && <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-hidden><path d="M20 6 9 17l-5-5" /></svg>{t.completedBadge}</span>}
                    {l.duration_minutes ? (
                      <span className="text-xs text-[#8A93A8]">{l.duration_minutes} {t.minute}</span>
                    ) : null}
                    {!open && <span className="text-[#8A93A8]"><LockIcon className="w-4 h-4" /></span>}
                  </div>
                );
                return (
                  <li key={l.id}>
                    {open ? (
                      <Link href={`/courses/${course.slug}/lessons/${i + 1}`} className="block hover:bg-[#F8F9FD] rounded-lg px-2 -mx-2 transition">
                        {inner}
                      </Link>
                    ) : (
                      <div className="px-2 -mx-2 opacity-75">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        )}

        {enrolled && (
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-sm font-medium text-emerald-700 bg-emerald-50 rounded-xl px-4 py-3">
              {t.enrolledBadge}
            </p>
            {lessons.length > 0 && lessons.every((l) => completedIds.includes(l.id)) && (
              <Link
                href={`/courses/${course.slug}/certificate`}
                className="bg-za-accent hover:bg-za-secondary transition text-white rounded-xl px-4 py-3 text-sm font-semibold inline-flex items-center gap-1.5"
              >
                <MedalIcon className="w-4 h-4" /> {t.getCertificate}
              </Link>
            )}
          </div>
        )}
      </div>

      {/* sticky CTA */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-[#E5E8F0] px-4 py-3 sm:hidden">
        {ctaExternal ? (
          <a href={ctaHref} target="_blank" rel="noopener noreferrer" className="block text-center bg-za-primary hover:bg-za-secondary transition text-white rounded-full px-6 py-3 text-sm font-semibold shadow-lg">
            {ctaLabel}
          </a>
        ) : (
          <Link href={ctaHref} className="block text-center bg-za-primary hover:bg-za-secondary transition text-white rounded-full px-6 py-3 text-sm font-semibold shadow-lg">
            {ctaLabel}
          </Link>
        )}
      </div>

      {/* desktop inline CTA */}
      {!enrolled && (
        <div className="hidden sm:block mx-auto max-w-4xl px-4">
          <a href={ctaHref} target="_blank" rel="noopener noreferrer" className="inline-block bg-za-primary hover:bg-za-secondary transition text-white rounded-full px-8 py-3 text-sm font-semibold">
            {ctaLabel}
          </a>
        </div>
      )}
    </div>
  );
}
