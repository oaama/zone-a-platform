"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { BookOpenIcon, MedalIcon, QuizIcon } from "@/components/Icons";
import { createClient } from "@/lib/supabase/client";
import ReviewForm from "@/components/ReviewForm";
import { useRouter } from "next/navigation";

export type EnrollmentRow = {
  slug: string;
  title_ar: string;
  title_en: string;
  thumbnail_url: string | null;
  level: string;
  total: number;
  done: number;
  nextN: number | null;
  best: number | null;
};

export default function DashboardView({
  name,
  email,
  avatarUrl,
  rows,
  totalDone,
}: {
  name: string;
  email: string;
  avatarUrl: string;
  rows: EnrollmentRow[];
  totalDone: number;
}) {
  const { lang, t } = useLang();
  const router = useRouter();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const steps = [t.step1, t.step2, t.step3, t.step4];

  const hour = new Date().getHours();
  const greet = hour >= 5 && hour < 12 ? t.welcomeMorning : hour >= 17 || hour < 5 ? t.welcomeEvening : t.welcomeBack;
  const allDone = rows.length > 0 && rows.every((r) => r.total > 0 && r.done >= r.total);
  const subline = rows.length === 0 ? t.dashSubZero : allDone ? t.dashSubDone : t.dashSubActive;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 flex flex-col gap-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-za-navy via-za-primary to-za-secondary text-white p-6 sm:p-8 shadow-[0_20px_50px_rgba(69,51,139,0.3)]">
        <div className="absolute inset-0 hero-grid opacity-40 pointer-events-none" aria-hidden />
        <div className="relative flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="" className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover ring-2 ring-white/40 shadow-lg animate-fade-up" />
            ) : (
              <span className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/15 backdrop-blur border border-white/30 text-white font-heading font-bold text-xl flex items-center justify-center shadow-lg animate-fade-up">
                {(name || email || "?").charAt(0).toUpperCase()}
              </span>
            )}
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold animate-fade-up delay-1">
                {greet}{name ? (lang === "ar" ? `، ${name}` : `, ${name}`) : ""}
              </h1>
              <p className="text-sm text-[#C9D4F5] mt-1.5 animate-fade-up delay-2">{subline}</p>
              <p className="text-xs text-white/50 mt-1 animate-fade-up delay-2" dir="ltr">{email}</p>
            </div>
          </div>
          <div className="flex gap-2 animate-fade-up delay-3">
            <Link href="/profile" className="border border-white/25 bg-white/10 backdrop-blur hover:bg-white/20 transition rounded-full px-5 py-2.5 text-sm font-semibold">
              {t.profile}
            </Link>
            <button onClick={logout} className="border border-white/25 bg-white/10 backdrop-blur hover:bg-white/20 transition rounded-full px-5 py-2.5 text-sm font-semibold">
              {t.logout}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-[#E5E8F0] p-5 flex items-center gap-4 hover:shadow-[0_12px_30px_rgba(69,51,139,0.12)] hover:-translate-y-0.5 transition animate-fade-up delay-2">
          <span className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-za-primary to-za-accent text-white flex items-center justify-center shadow-[0_8px_20px_rgba(69,51,139,0.3)]">
            <BookOpenIcon className="w-6 h-6" />
          </span>
          <div>
            <p className="font-heading text-3xl font-bold text-za-primary leading-none"><CountUp value={rows.length} /></p>
            <p className="text-sm text-[#5A6378] mt-1.5">{t.coursesEnrolled}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E8F0] p-5 flex items-center gap-4 hover:shadow-[0_12px_30px_rgba(69,51,139,0.12)] hover:-translate-y-0.5 transition animate-fade-up delay-3">
          <span className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-za-secondary to-za-accent text-white flex items-center justify-center shadow-[0_8px_20px_rgba(26,91,181,0.3)]">
            <QuizIcon className="w-6 h-6" />
          </span>
          <div>
            <p className="font-heading text-3xl font-bold text-za-accent leading-none"><CountUp value={totalDone} /></p>
            <p className="text-sm text-[#5A6378] mt-1.5">{t.lessonsDone}</p>
          </div>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E5E8F0] p-8 sm:p-10 flex flex-col items-center gap-6 text-center">
          <span className="text-za-primary"><BookOpenIcon className="w-14 h-14" /></span>
          <div>
            <h2 className="font-heading text-2xl font-bold">{t.emptyDashTitle}</h2>
            <p className="text-[#5A6378] mt-2 max-w-md mx-auto leading-relaxed">{t.emptyDashText}</p>
          </div>
          <div className="w-full max-w-lg">
            <h3 className="font-heading font-bold text-sm text-[#5A6378] mb-3">{t.howItWorks}</h3>
            <ol className="flex flex-col gap-2 text-start">
              {steps.map((s, i) => (
                <li key={i} className="flex items-center gap-3 bg-[#F8F9FD] rounded-xl px-4 py-3">
                  <span className="w-7 h-7 shrink-0 rounded-full bg-za-primary text-white text-sm font-bold flex items-center justify-center">{i + 1}</span>
                  <span className="text-sm font-medium">{s}</span>
                </li>
              ))}
            </ol>
          </div>
          <Link href="/#courses" className="bg-za-primary hover:bg-za-secondary transition text-white rounded-full px-8 py-3 text-sm font-semibold">
            {t.browseCourses}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <h2 className="font-heading text-xl font-bold">{t.myCourses}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {rows.map((r, idx) => {
              const pct = r.total > 0 ? Math.round((r.done / r.total) * 100) : 0;
              const finished = r.total > 0 && r.done >= r.total;
              return (
                <div key={r.slug} className="bg-white rounded-2xl border border-[#E5E8F0] overflow-hidden flex flex-col hover:shadow-md transition animate-fade-up" style={{ animationDelay: `${0.15 + idx * 0.08}s` }}>
                  <div className="relative h-32 sm:h-32 bg-gradient-to-br from-za-primary to-za-accent flex items-center justify-center overflow-hidden">
                    {r.thumbnail_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.thumbnail_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src="/logo-wide.png" alt="ZONE A Academy" className="absolute inset-0 w-full h-full object-contain p-4" />
                    )}
                  </div>
                  <div className="p-3 sm:p-5 flex flex-col gap-2 sm:gap-3 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-bold text-sm sm:text-base flex-1">{lang === "ar" ? r.title_ar : r.title_en || r.title_ar}</h3>
                      <span className="text-[11px] font-medium text-za-secondary bg-[#EEF1FB] rounded-full px-2.5 py-1">
                        {t.levels[r.level] ?? r.level}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2.5 bg-[#EEF1FB] rounded-full overflow-hidden">
                        <div className="h-full progress-gradient rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-[#5A6378] whitespace-nowrap">{r.done}/{r.total} • {pct}%</span>
                    </div>
                    <p className={`text-xs font-semibold flex items-center gap-1.5 ${finished ? "text-emerald-600" : "text-za-accent"}`}>
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden><path d="M12 2l1.8 5.6L19 9.2l-5.2 1.6L12 16.4l-1.8-5.6L5 9.2l5.2-1.6L12 2z" /></svg>
                      {finished ? t.progDone : pct >= 50 ? t.progHalf : pct > 0 ? t.progSome : t.progZero}
                    </p>
                    {r.best !== null && (
                      <p className="text-xs text-[#5A6378] flex items-center gap-1.5">
                        <span className="text-amber-400">★</span>
                        {t.bestScore}: <span className="font-bold text-za-navy">{r.best}%</span>
                      </p>
                    )}
                    <div className="mt-auto pt-1">
                      {finished ? (
                        <div className="flex gap-2">
                          <Link href={`/courses/${r.slug}`} className="flex-1 text-center bg-emerald-50 text-emerald-700 rounded-full px-4 py-2.5 text-sm font-semibold hover:bg-emerald-100 transition">
                            {t.courseCompleted}
                          </Link>
                          <Link href={`/courses/${r.slug}/certificate`} className="flex-1 text-center bg-za-accent hover:bg-za-secondary transition text-white rounded-full px-4 py-2.5 text-sm font-semibold flex items-center justify-center gap-1.5">
                            <MedalIcon className="w-4 h-4 inline-block -mt-0.5" /> {t.certificate}
                          </Link>
                        </div>
                      ) : r.nextN ? (
                        <Link href={`/courses/${r.slug}/lessons/${r.nextN}`} className="block text-center bg-za-primary hover:bg-za-secondary transition text-white rounded-full px-5 py-2.5 text-sm font-semibold">
                          {r.done === 0 ? t.startCourse : `${t.continueLearning} ← ${t.lessons} ${r.nextN}`}
                        </Link>
                      ) : (
                        <Link href={`/courses/${r.slug}`} className="block text-center border border-[#D8DDE9] rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-[#F8F9FD] transition">
                          {t.watchNow}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <ReviewForm name={name} />
    </div>
  );
}

function CountUp({ value }: { value: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (value <= 0) { setN(0); return; }
    const start = performance.now();
    const dur = 850;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{n}</>;
}
