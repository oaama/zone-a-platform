"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";
import QuizEditor, { type AdminQuestion } from "@/components/admin/QuizEditor";

type Lesson = {
  id: string;
  title_ar: string;
  title_en: string;
  description: string;
  content_ar: string;
  content_en: string;
  video_path: string | null;
  material_path: string | null;
  duration_minutes: number | null;
  sort_order: number;
  is_preview: boolean;
};

const emptyForm = {
  title_ar: "",
  title_en: "",
  description: "",
  content_ar: "",
  content_en: "",
  duration_minutes: "",
  sort_order: 0,
  is_preview: false,
};

export default function LessonsAdmin({ courseId, lessons, questions }: { courseId: string; lessons: Lesson[]; questions: AdminQuestion[] }) {
  const { t } = useLang();
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [video, setVideo] = useState<File | null>(null);
  const [material, setMaterial] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [msg, setMsg] = useState("");

  function startEdit(l: Lesson) {
    setEditingId(l.id);
    setShowNew(false);
    setVideo(null);
    setMaterial(null);
    setForm({
      title_ar: l.title_ar,
      title_en: l.title_en,
      description: l.description,
      content_ar: l.content_ar ?? "",
      content_en: l.content_en ?? "",
      duration_minutes: l.duration_minutes?.toString() ?? "",
      sort_order: l.sort_order,
      is_preview: l.is_preview,
    });
  }

  async function uploadVideo(): Promise<string | null | undefined> {
    if (!video) return undefined; // keep existing
    const supabase = createClient();
    const ext = video.name.split(".").pop() ?? "mp4";
    const path = `${courseId}/${crypto.randomUUID()}.${ext}`;
    setProgress(t.uploadVideo + "…");
    const { error } = await supabase.storage.from("course-videos").upload(path, video, {
      cacheControl: "3600",
      contentType: video.type || "video/mp4",
    });
    setProgress("");
    if (error) {
      setMsg(error.message);
      return null;
    }
    return path;
  }

  async function uploadMaterial(): Promise<string | null | undefined> {
    if (!material) return undefined; // keep existing
    const supabase = createClient();
    const ext = material.name.split(".").pop() ?? "pdf";
    const path = `${courseId}/${crypto.randomUUID()}.${ext}`;
    setProgress(t.materialFile + "…");
    const { error } = await supabase.storage.from("course-materials").upload(path, material, {
      cacheControl: "3600",
      contentType: material.type || "application/octet-stream",
    });
    setProgress("");
    if (error) {
      setMsg(error.message);
      return null;
    }
    return path;
  }

  async function save() {
    setBusy(true);
    setMsg("");
    const supabase = createClient();
    const videoPath = await uploadVideo();
    if (videoPath === null) {
      setBusy(false);
      return;
    }
    const materialPath = await uploadMaterial();
    if (materialPath === null) {
      setBusy(false);
      return;
    }
    const payload = {
      title_ar: form.title_ar,
      title_en: form.title_en,
      description: form.description,
      content_ar: form.content_ar,
      content_en: form.content_en,
      duration_minutes: form.duration_minutes ? parseInt(form.duration_minutes, 10) : null,
      sort_order: form.sort_order,
      is_preview: form.is_preview,
      ...(videoPath ? { video_path: videoPath } : {}),
      ...(materialPath ? { material_path: materialPath } : {}),
    };
    let error;
    if (editingId) {
      ({ error } = await supabase.from("lessons").update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("lessons").insert({ ...payload, course_id: courseId }));
    }
    if (error) setMsg(error.message);
    else {
      setMsg(videoPath ? t.uploadedOk : t.savedOk);
      setEditingId(null);
      setShowNew(false);
      setForm({ ...emptyForm });
      setVideo(null);
      setMaterial(null);
      router.refresh();
    }
    setBusy(false);
  }

  async function remove(l: Lesson) {
    if (!confirm(t.confirmDelete)) return;
    const supabase = createClient();
    await supabase.from("lessons").delete().eq("id", l.id);
    if (l.video_path) await supabase.storage.from("course-videos").remove([l.video_path]);
    if (l.material_path) await supabase.storage.from("course-materials").remove([l.material_path]);
    router.refresh();
  }

  const formUi = (
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
        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          {t.lessonDesc}
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="border border-[#D8DDE9] rounded-xl px-4 py-2.5" />
        </label>
        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          {t.contentAr}
          <textarea value={form.content_ar} onChange={(e) => setForm({ ...form, content_ar: e.target.value })} rows={5} className="border border-[#D8DDE9] rounded-xl px-4 py-2.5" />
        </label>
        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          {t.contentEn}
          <textarea value={form.content_en} onChange={(e) => setForm({ ...form, content_en: e.target.value })} rows={4} dir="ltr" className="border border-[#D8DDE9] rounded-xl px-4 py-2.5" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          {t.durationMinutes}
          <input type="number" min={0} value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })} className="border border-[#D8DDE9] rounded-xl px-4 py-2.5" dir="ltr" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          {t.sortOrder}
          <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value || "0", 10) })} className="border border-[#D8DDE9] rounded-xl px-4 py-2.5" dir="ltr" />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_preview} onChange={(e) => setForm({ ...form, is_preview: e.target.checked })} />
          {t.isPreview}
        </label>
        <label className="flex flex-col gap-1 text-sm">
          {t.videoFile}
          <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files?.[0] ?? null)} className="text-sm" />
          <span className="text-[11px] text-[#8A93A8]">{t.videoHint}</span>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          {t.materialFile}
          <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.txt" onChange={(e) => setMaterial(e.target.files?.[0] ?? null)} className="text-sm" />
        </label>
      </div>
      {progress && <p className="text-sm text-za-secondary">{progress}</p>}
      <div className="flex gap-3 items-center">
        <button onClick={save} disabled={busy || !form.title_ar} className="bg-emerald-600 hover:bg-emerald-700 transition text-white rounded-xl px-5 py-2.5 text-sm font-semibold disabled:opacity-60">
          {busy ? t.saving : t.save}
        </button>
        <button onClick={() => { setEditingId(null); setShowNew(false); }} className="text-sm text-[#5A6378]">{t.cancel}</button>
        {msg && <p className="text-sm text-[#5A6378]">{msg}</p>}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold">{t.adminLessons}</h2>
        <button
          onClick={() => { setShowNew(!showNew); setEditingId(null); setForm({ ...emptyForm }); setVideo(null); setMaterial(null); }}
          className="bg-za-primary hover:bg-za-secondary transition text-white rounded-full px-5 py-2.5 text-sm font-semibold"
        >
          + {t.addLesson}
        </button>
      </div>

      {showNew && formUi}

      <div className="flex flex-col gap-3">
        {lessons.map((l, i) => (
          <div key={l.id} className="flex flex-col gap-3">
            <div className="bg-white rounded-2xl border border-[#E5E8F0] p-4 flex items-center gap-3 flex-wrap">
              <span className="w-8 h-8 shrink-0 rounded-full bg-[#EEF1FB] text-za-secondary text-sm font-bold flex items-center justify-center">{i + 1}</span>
              <div className="flex-1 min-w-40">
                <p className="font-semibold text-sm">{l.title_ar}</p>
                <p className="text-xs text-[#8A93A8]">
                  {l.duration_minutes ? `${l.duration_minutes} ${t.minute} • ` : ""}
                  {l.video_path ? "فيديو مرفوع" : "بدون فيديو"}
                  {l.material_path ? " • ملف مرفوع" : ""}
                  {l.content_ar ? " • محتوى نظري" : ""}
                  {l.is_preview ? ` • ${t.previewBadge}` : ""}
                </p>
              </div>
              <button onClick={() => startEdit(l)} className="text-xs text-za-secondary hover:underline font-semibold">{t.edit}</button>
              <button onClick={() => remove(l)} className="text-xs text-red-600 hover:underline">{t.delete}</button>
            </div>
            {editingId === l.id && formUi}
            <QuizEditor lessonId={l.id} questions={questions.filter((q) => q.lesson_id === l.id)} />
          </div>
        ))}
        {lessons.length === 0 && <p className="text-sm text-[#8A93A8]">{t.noLessons}</p>}
      </div>
    </div>
  );
}
