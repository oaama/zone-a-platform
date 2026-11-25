"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/i18n";
import { LockIcon, MedalIcon } from "@/components/Icons";
import { createClient } from "@/lib/supabase/client";
import Quiz, { type QuizQuestion } from "@/components/Quiz";

type Lesson = {
  id: string;
  title_ar: string;
  title_en: string;
  description: string;
  duration_minutes: number | null;
};

type SidebarItem = {
  n: number;
  title_ar: string;
  title_en: string;
  duration_minutes: number | null;
  done: boolean;
  locked: boolean;
};

export default function LessonView({
  slug,
  courseTitleAr,
  courseTitleEn,
  lesson,
  contentAr,
  contentEn,
  materialUrl,
  videoUrl,
  index,
  total,
  hasPrev,
  hasNext,
  completed,
  canComplete,
  userId,
  sidebar,
  questions,
  allDone,
}: {
  slug: string;
  courseTitleAr: string;
  courseTitleEn: string;
  lesson: Lesson;
  contentAr: string;
  contentEn: string;
  materialUrl: string | null;
  videoUrl: string | null;
  index: number;
  total: number;
  hasPrev: boolean;
  hasNext: boolean;
  completed: boolean;
  canComplete: boolean;
  userId: string;
  sidebar: SidebarItem[];
  questions: QuizQuestion[];
  allDone: boolean;
}) {
  const { lang, t } = useLang();
  const router = useRouter();
  const [done, setDone] = useState(completed);
  const [busy, setBusy] = useState(false);
  const title = lang === "ar" ? lesson.title_ar : lesson.title_en || lesson.title_ar;
  const theory = (lang === "ar" ? contentAr : contentEn || contentAr).trim();
  const courseTitle = lang === "ar" ? courseTitleAr : courseTitleEn || courseTitleAr;

  async function markDone() {
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("lesson_progress")
      .upsert({ student_id: userId, lesson_id: lesson.id }, { onConflict: "student_id,lesson_id" });
    if (!error) {
      setDone(true);
      router.refresh();
    }
    setBusy(false);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col gap-6">
      <div className="flex items-center gap-3 text-sm text-[#5A6378] flex-wrap">
        <Link href={`/courses/${slug}`} className="hover:text-za-secondary transition">← {courseTitle}</Link>
        <span>•</span>
        <span>{index} / {total}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 flex flex-col gap-6 order-1">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold">{title}</h1>

          <div className="bg-za-navy rounded-2xl overflow-hidden aspect-video flex items-center justify-center ring-1 ring-[#232c4d] shadow-[0_16px_48px_rgba(17,24,39,0.28)]">
            {videoUrl ? (
              <video
                src={videoUrl}
                controls
                controlsList="nodownload"
                className="w-full h-full"
                poster="/logo-wide.png"
              />
            ) : (
              <p className="text-[#A9B8E8] text-sm px-6 text-center">
                {lang === "ar" ? "الفيديو بيترفع حالياً — جرب تاني بعد شوية." : "The video is being uploaded — check back soon."}
              </p>
            )}
          </div>

          {theory && (
            <div className="bg-white rounded-2xl border border-[#E5E8F0] p-6 sm:p-8 flex flex-col gap-3">
              <h2 className="font-heading text-lg font-bold text-za-primary">{t.theoryNotes}</h2>
              <div className="text-[#3d4763] leading-loose text-[15px] whitespace-pre-wrap">{theory}</div>
            </div>
          )}

          {materialUrl && (
            <a
              href={materialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit bg-[#EEF1FB] hover:bg-[#E2E9FA] transition text-za-primary rounded-full px-5 py-2.5 text-sm font-semibold flex items-center gap-2"
            >
              {t.downloadMaterial}
            </a>
          )}

          <div className="flex items-center justify-between flex-wrap gap-3">
            {canComplete && !done ? (
              <button
                onClick={markDone}
                disabled={busy}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 transition text-white rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-60"
              >
                {busy ? "…" : (<><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden><path d="M20 6 9 17l-5-5" /></svg>{t.completeLesson}</>)}
              </button>
            ) : done ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 bg-emerald-50 rounded-full px-5 py-2.5"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden><path d="M20 6 9 17l-5-5" /></svg>{t.completedBadge}</span>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              {hasPrev && (
                <Link href={`/courses/${slug}/lessons/${index - 1}`} className="border border-[#D8DDE9] hover:bg-white transition rounded-full px-5 py-2.5 text-sm font-semibold">
                  {t.prevLesson}
                </Link>
              )}
              {hasNext ? (
                <Link href={`/courses/${slug}/lessons/${index + 1}`} className="bg-za-primary hover:bg-za-secondary transition text-white rounded-full px-5 py-2.5 text-sm font-semibold">
                  {t.nextLesson}
                </Link>
              ) : done && allDone ? (
                <Link href={`/courses/${slug}/certificate`} className="bg-za-accent hover:bg-za-secondary transition text-white rounded-full px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-1.5">
                  <MedalIcon className="w-4 h-4" /> {t.getCertificate}
                </Link>
              ) : null}
            </div>
          </div>

          {lesson.description && (
            <div className="bg-white rounded-2xl border border-[#E5E8F0] p-6">
              <p className="text-[#3d4763] leading-relaxed whitespace-pre-line">{lesson.description}</p>
            </div>
          )}

          <Quiz lessonId={lesson.id} userId={userId} questions={questions} canAttempt={canComplete} />
        </div>

        <aside className="lg:col-span-1 order-2 bg-white rounded-2xl border border-[#E5E8F0] p-4 lg:sticky lg:top-6">
          <h2 className="font-heading font-bold text-sm text-[#5A6378] mb-3">{t.courseContent}</h2>
          <ol className="flex flex-col">
            {sidebar.map((s) => {
              const stitle = lang === "ar" ? s.title_ar : s.title_en || s.title_ar;
              const current = s.n === index;
              const inner = (
                <div className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${current ? "bg-[#EEF1FB]" : ""}`}>
                  <span
                    className={`w-6 h-6 shrink-0 rounded-full text-xs font-bold flex items-center justify-center ${
                      s.done ? "bg-emerald-100 text-emerald-700" : "bg-[#EEF1FB] text-za-secondary"
                    }`}
                  >
                    {s.done ? "✓" : s.n}
                  </span>
                  <span className={`flex-1 text-sm ${current ? "font-bold" : "font-medium"}`}>{stitle}</span>
                  {s.locked ? (
                    <span className="text-[#8A93A8]"><LockIcon className="w-3.5 h-3.5" /></span>
                  ) : s.duration_minutes ? (
                    <span className="text-[11px] text-[#8A93A8]">{s.duration_minutes}{lang === "ar" ? "د" : "m"}</span>
                  ) : null}
                </div>
              );
              return (
                <li key={s.n}>
                  {s.locked ? (
                    <div className="opacity-60">{inner}</div>
                  ) : (
                    <Link href={`/courses/${slug}/lessons/${s.n}`} className="block hover:bg-[#F8F9FD] rounded-xl transition">
                      {inner}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </aside>
      </div>
    </div>
  );
}
