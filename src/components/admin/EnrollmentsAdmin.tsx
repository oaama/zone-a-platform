"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";

type Enrollment = {
  id: string;
  status: string;
  created_at: string;
  student: { full_name: string; email: string } | null;
  course: { title_ar: string; title_en: string } | null;
};

export default function EnrollmentsAdmin({
  enrollments,
  courses,
}: {
  enrollments: Enrollment[];
  courses: { id: string; title_ar: string }[];
}) {
  const { t } = useLang();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [courseId, setCourseId] = useState(courses[0]?.id ?? "");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function grant() {
    setBusy(true);
    setMsg("");
    const supabase = createClient();
    const { data: student } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();
    if (!student) {
      setMsg("مفيش طالب بالإيميل ده — لازم يعمل حساب الأول.");
      setBusy(false);
      return;
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase.from("enrollments").upsert(
      { student_id: student.id, course_id: courseId, status: "active", granted_by: user?.id },
      { onConflict: "student_id,course_id" }
    );
    setMsg(error ? error.message : t.savedOk);
    setEmail("");
    setBusy(false);
    router.refresh();
  }

  async function setStatus(id: string, status: "active" | "revoked") {
    const supabase = createClient();
    await supabase.from("enrollments").update({ status }).eq("id", id);
    router.refresh();
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E5E8F0] p-6 flex flex-col gap-5">
      <h2 className="font-heading text-xl font-bold">{t.adminEnrollments}</h2>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.studentEmail}
          className="flex-1 border border-[#D8DDE9] rounded-xl px-4 py-2.5 text-sm"
          dir="ltr"
        />
        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="border border-[#D8DDE9] rounded-xl px-4 py-2.5 text-sm"
        >
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title_ar}</option>
          ))}
        </select>
        <button
          onClick={grant}
          disabled={busy || !email || !courseId}
          className="bg-emerald-600 hover:bg-emerald-700 transition text-white rounded-xl px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
        >
          {t.grantAccess}
        </button>
      </div>
      {msg && <p className="text-sm text-[#5A6378]">{msg}</p>}

      {enrollments.length === 0 ? (
        <p className="text-sm text-[#8A93A8]">{t.noEnrollments}</p>
      ) : (
        <div className="flex flex-col divide-y divide-[#EEF1FB]">
          {enrollments.map((e) => (
            <div key={e.id} className="flex items-center gap-3 py-3 flex-wrap">
              <div className="flex-1 min-w-40">
                <p className="font-medium text-sm">{e.student?.full_name || e.student?.email}</p>
                <p className="text-xs text-[#8A93A8]" dir="ltr">{e.student?.email}</p>
              </div>
              <p className="text-sm text-[#5A6378] flex-1 min-w-32">{e.course?.title_ar}</p>
              <span
                className={`text-xs font-semibold rounded-full px-3 py-1 ${
                  e.status === "active" ? "text-emerald-700 bg-emerald-50" : "text-red-700 bg-red-50"
                }`}
              >
                {e.status === "active" ? "نشط" : "موقوف"}
              </span>
              {e.status === "active" ? (
                <button
                  onClick={() => setStatus(e.id, "revoked")}
                  className="text-xs text-red-600 hover:underline"
                >
                  {t.revokeAccess}
                </button>
              ) : (
                <button
                  onClick={() => setStatus(e.id, "active")}
                  className="text-xs text-emerald-600 hover:underline"
                >
                  {t.grantAccess}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
