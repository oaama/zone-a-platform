"use client";

import Link from "next/link";
import { useLang, catName } from "@/lib/i18n";

export type Course = {
  id: string;
  slug: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  thumbnail_url: string | null;
  level: string;
  category: string;
};

export default function CourseCard({ course }: { course: Course }) {
  const { lang, t } = useLang();
  const title = lang === "ar" ? course.title_ar : course.title_en || course.title_ar;
  const description = lang === "ar" ? course.description_ar : course.description_en || course.description_ar;
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group bg-white rounded-2xl border border-[#E5E8F0] overflow-hidden hover:shadow-[0_16px_40px_rgba(69,51,139,0.15)] hover:-translate-y-1 hover:border-za-primary/30 transition-all duration-300 flex flex-col"
    >
      <div className="relative h-24 sm:h-36 bg-gradient-to-br from-za-primary via-za-secondary to-za-accent flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-60" aria-hidden />
        {course.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.thumbnail_url}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/logo-wide.png" alt="ZONE A Academy" className="absolute inset-0 w-full h-full object-contain p-5 group-hover:scale-105 transition-transform duration-500 drop-shadow-[0_8px_24px_rgba(17,24,39,0.3)]" />
        )}
        <span className="absolute top-1.5 start-1.5 sm:top-2.5 sm:start-2.5 text-[10px] sm:text-[11px] font-bold text-white bg-white/20 backdrop-blur rounded-full px-2 py-0.5 sm:px-3 sm:py-1">
          {t.levels[course.level] ?? course.level}
        </span>
        <span className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-za-navy/70 to-transparent pointer-events-none" aria-hidden />
        <span className="absolute bottom-1.5 start-1.5 sm:bottom-2.5 sm:start-2.5 text-[10px] sm:text-[11px] font-bold text-white bg-za-primary/80 backdrop-blur rounded-full px-2 py-0.5 sm:px-3 sm:py-1">
          {catName(course.category, lang)}
        </span>
      </div>
      <div className="p-2.5 sm:p-4 flex flex-col gap-1 sm:gap-1.5 flex-1">
        <h3 className="font-heading font-bold text-[13px] sm:text-base leading-snug group-hover:text-za-primary transition-colors">{title}</h3>
        <p className="text-[11px] sm:text-sm text-[#5A6378] line-clamp-1 sm:line-clamp-2 flex-1 leading-relaxed">{description}</p>
        <span className="flex items-center justify-between mt-0.5">
          <span className="text-[11px] sm:text-sm font-semibold text-za-accent">
            {lang === "ar" ? "شوف الكورس" : "View course"}
          </span>
          <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-za-primary to-za-accent text-white flex items-center justify-center transition-transform duration-300 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1 group-hover:scale-110">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 rtl:rotate-0 ltr:rotate-180" aria-hidden><path d="M19 12H5m7-7-7 7 7 7" /></svg>
          </span>
        </span>
      </div>
    </Link>
  );
}
