"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";

type Course = {
  id: string;
  slug: string;
  title_ar: string;
  title_en: string;
  level: string;
  is_published: boolean;
  thumbnail_url: string | null;
  sort_order: number;
};

export default function CoursesAdmin({
  courses,
  lessonCounts,
}: {
  courses: Course[];
  lessonCounts: Record<string, number>;
}) {
  const { t } = useLang();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    slug: "",
    title_ar: "",
    title_en: "",
    description_ar: "",
    description_en: "",
    level: "beginner",
  });
  const [thumb, setThumb] = useState<File | null>(null);

  async function togglePublish(c: Course) {
    const supabase = createClient();
    await supabase.from("courses").update({ is_published: !c.is_published }).eq("id", c.id);
    router.refresh();
  }

  async function remove(c: Course) {
    if (!confirm(t.confirmDelete)) return;
    const supabase = createClient();
    await supabase.from("courses").delete().eq("id", c.id);
    router.refresh();
  }

  async function create() {
    setBusy(true);
    setMsg("");
    const supabase = createClient();
    let thumbnail_url: string | null = null;
    if (thumb) {
      const ext = thumb.name.split(".").pop() ?? "jpg";
      const path = `thumbs/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("course-thumbnails").upload(path, thumb);
      if (upErr) {
        setMsg(upErr.message);
        setBusy(false);
        return;
      }
      const { data: pub } = supabase.storage.from("course-thumbnails").getPublicUrl(path);
      thumbnail_url = pub.publicUrl;
    }
    const { error } = await supabase.from("courses").insert({ ...form, thumbnail_url, is_published: false });
    if (error) setMsg(error.message);
    else {
      setMsg(t.savedOk);
      setShowForm(false);
      setForm({ slug: "", title_ar: "", title_en: "", description_ar: "", description_en: "", level: "beginner" });
      setThumb(null);
      router.refresh();
    }
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-5">
      <button
        onClick={() => setShowForm(!showForm)}
        className="self-start bg-za-primary hover:bg-za-secondary transition text-white rounded-full px-5 py-2.5 text-sm font-semibold"
      >
        + {t.newCourse}
      </button>

      {showForm && (
        <div className="bg-white rounded-2xl border border-[#E5E8F0] p-6 flex flex-col gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm">
              {t.titleAr}
              <input value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} className="border border-[#D8DDE9] rounded-xl px-4 py-2.5" />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              {t.titleEn}
              <input value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} className="border border-[#D8DDE9] rounded-xl px-4 py-2.5" dir="ltr" />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              {t.courseSlug}
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} className="border border-[#D8DDE9] rounded-xl px-4 py-2.5" dir="ltr" placeholder="python-basics" />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              {t.courseLevel}
              <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="border border-[#D8DDE9] rounded-xl px-4 py-2.5">
                <option value="beginner">{t.levels.beginner}</option>
                <option value="intermediate">{t.levels.intermediate}</option>
                <option value="advanced">{t.levels.advanced}</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              {t.descriptionAr}
              <textarea value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} rows={3} className="border border-[#D8DDE9] rounded-xl px-4 py-2.5" />
            </label>
            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              {t.descriptionEn}
              <textarea value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} rows={2} className="border border-[#D8DDE9] rounded-xl px-4 py-2.5" dir="ltr" />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              {t.thumbnail}
              <input type="file" accept="image/*" onChange={(e) => setThumb(e.target.files?.[0] ?? null)} className="text-sm" />
            </label>
          </div>
          <div className="flex gap-3 items-center">
            <button onClick={create} disabled={busy || !form.title_ar || !form.slug} className="bg-emerald-600 hover:bg-emerald-700 transition text-white rounded-xl px-5 py-2.5 text-sm font-semibold disabled:opacity-60">
              {busy ? t.saving : t.save}
            </button>
            <button onClick={() => setShowForm(false)} className="text-sm text-[#5A6378]">{t.cancel}</button>
            {msg && <p className="text-sm text-[#5A6378]">{msg}</p>}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#E5E8F0] divide-y divide-[#EEF1FB]">
        {courses.map((c) => (
          <div key={c.id} className="flex items-center gap-3 p-4 flex-wrap">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-za-primary to-za-accent overflow-hidden shrink-0 flex items-center justify-center text-white font-bold">
              {c.thumbnail_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.thumbnail_url} alt="" className="w-full h-full object-cover" />
              ) : (
                "ZA"
              )}
            </div>
            <div className="flex-1 min-w-40">
              <p className="font-semibold">{c.title_ar}</p>
              <p className="text-xs text-[#8A93A8]" dir="ltr">/courses/{c.slug} • {lessonCounts[c.id] ?? 0} {t.lessons}</p>
            </div>
            <button
              onClick={() => togglePublish(c)}
              className={`text-xs font-semibold rounded-full px-3 py-1.5 ${
                c.is_published ? "text-emerald-700 bg-emerald-50" : "text-[#8A93A8] bg-[#F1F3F9]"
              }`}
            >
              {c.is_published ? t.published : t.draft}
            </button>
            <Link href={`/admin/courses/${c.id}`} className="text-xs text-za-secondary hover:underline font-semibold">
              {t.edit} + {t.adminLessons}
            </Link>
            <button onClick={() => remove(c)} className="text-xs text-red-600 hover:underline">{t.delete}</button>
          </div>
        ))}
        {courses.length === 0 && <p className="p-6 text-sm text-[#8A93A8]">مفيش كورسات لسه.</p>}
      </div>
    </div>
  );
}
