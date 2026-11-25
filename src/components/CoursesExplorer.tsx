"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import CourseCard, { type Course } from "@/components/CourseCard";
import { useLang, catName } from "@/lib/i18n";

export default function CoursesExplorer({ courses }: { courses: Course[] }) {
  const { lang, t } = useLang();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [cat, setCat] = useState<string | null>(params.get("cat"));
  const [lvl, setLvl] = useState<string | null>(null);

  const cats = useMemo(() => [...new Set(courses.map((c) => c.category).filter(Boolean))], [courses]);
  const lvls = useMemo(() => [...new Set(courses.map((c) => c.level).filter(Boolean))], [courses]);

  useEffect(() => {
    setQ(params.get("q") ?? "");
    const c = params.get("cat");
    if (c) setCat(c);
  }, [params]);

  const filtered = courses.filter((c) => {
    const hay = `${c.title_ar} ${c.title_en} ${c.description_ar} ${c.description_en}`;
    if (q.trim() && !hay.includes(q.trim())) return false;
    if (cat && c.category !== cat) return false;
    if (lvl && c.level !== lvl) return false;
    return true;
  });

  const chip = (active: boolean) =>
    `rounded-full px-4 py-1.5 text-sm font-semibold border transition ${
      active
        ? "bg-za-primary text-white border-za-primary shadow-[0_6px_18px_rgba(46,77,160,0.35)]"
        : "bg-white text-[#3B4460] border-[#E5E8F0] hover:border-za-primary/40 hover:text-za-primary"
    }`;

  return (
    <div className="flex flex-col gap-6">
      {/* search + chips (mobile-first; sidebar takes over on desktop) */}
      <div className="relative max-w-xl mx-auto w-full">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full rounded-full border border-[#E5E8F0] bg-white px-5 py-3 ps-12 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-za-primary/40"
        />
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-5 h-5 absolute start-4 top-1/2 -translate-y-1/2 text-[#8A93A8]" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </div>

      <div className="flex flex-wrap justify-center gap-2 lg:hidden">
        {q.trim() && (
          <button onClick={() => setQ("")} className="rounded-full px-4 py-1.5 text-sm font-semibold border transition bg-za-accent text-white border-za-accent inline-flex items-center gap-1.5">
            {q.trim()}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-3.5 h-3.5" aria-hidden><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        )}
        <button onClick={() => setCat(null)} className={chip(cat === null)}>{t.allCategories}</button>
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={chip(cat === c)}>{catName(c, lang)}</button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* filters sidebar (desktop) */}
        <aside className="hidden lg:flex flex-col gap-6 w-56 shrink-0 sticky top-24 bg-white rounded-2xl border border-[#E5E8F0] p-5">
          <div>
            <h3 className="font-heading font-bold text-sm mb-3">{t.categoryLabel}</h3>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm text-[#3B4460] cursor-pointer">
                <input type="radio" name="cat" checked={cat === null} onChange={() => setCat(null)} className="accent-za-primary" />
                {t.allCategories}
              </label>
              {cats.map((c) => (
                <label key={c} className="flex items-center gap-2 text-sm text-[#3B4460] cursor-pointer">
                  <input type="radio" name="cat" checked={cat === c} onChange={() => setCat(c)} className="accent-za-primary" />
                  {catName(c, lang)}
                </label>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm mb-3">{t.levelLabel}</h3>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm text-[#3B4460] cursor-pointer">
                <input type="radio" name="lvl" checked={lvl === null} onChange={() => setLvl(null)} className="accent-za-primary" />
                {t.allLevels}
              </label>
              {lvls.map((l) => (
                <label key={l} className="flex items-center gap-2 text-sm text-[#3B4460] cursor-pointer">
                  <input type="radio" name="lvl" checked={lvl === l} onChange={() => setLvl(l)} className="accent-za-primary" />
                  {t.levels[l] ?? l}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 flex-1 w-full">
            {filtered.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        ) : (
          <p className="flex-1 text-center text-[#5A6378] py-12">{t.noResults}</p>
        )}
      </div>
    </div>
  );
}
