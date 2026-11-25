"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";

type Course = {
  id: string;
  slug: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  level: string;
  is_published: boolean;
  thumbnail_url: string | null;
  sort_order: number;
};

export default function CourseEditor({ course }: { course: Course }) {
  const { t } = useLang();
  const router = useRouter();
  const [form, setForm] = useState({ ...course });
  const [thumb, setThumb] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function save() {
    setBusy(true);
    setMsg("");
    const supabase = createClient();
    let thumbnail_url = form.thumbnail_url;
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
    const { id: _id, ...rest } = form;
    void _id;
    const { error } = await supabase.from("courses").update({ ...rest, thumbnail_url }).eq("id", course.id);
    setMsg(error ? error.message : t.savedOk);
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E5E8F0] p-6 flex flex-col gap-4">
      <h2 className="font-heading text-lg font-bold">{t.edit}</h2>
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
          <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="border border-[#D8DDE9] rounded-xl px-4 py-2.5" dir="ltr" />
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
        <label className="flex items-center gap-2 text-sm self-end pb-2">
          <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
          {t.published}
        </label>
      </div>
      <div className="flex gap-3 items-center">
        <button onClick={save} disabled={busy} className="bg-emerald-600 hover:bg-emerald-700 transition text-white rounded-xl px-5 py-2.5 text-sm font-semibold disabled:opacity-60">
          {busy ? t.saving : t.save}
        </button>
        {msg && <p className="text-sm text-[#5A6378]">{msg}</p>}
      </div>
    </div>
  );
}
