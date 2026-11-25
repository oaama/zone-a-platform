import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import AdminGate from "@/components/admin/AdminGate";

type EnrollmentRow = {
  student_id: string;
  status: string;
  course: { id: string; title_ar: string } | null;
};

export default async function AdminStudents() {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return <AdminGate />;

  const { data: students } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, created_at")
    .order("created_at", { ascending: false });

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("student_id, status, course:courses(id, title_ar)");

  const { data: lessons } = await supabase.from("lessons").select("id, course_id");
  const { data: progress } = await supabase.from("lesson_progress").select("student_id, lesson_id");

  const lessonsByCourse: Record<string, string[]> = {};
  (lessons ?? []).forEach((l) => {
    (lessonsByCourse[l.course_id] ??= []).push(l.id);
  });

  const progressByStudent: Record<string, Set<string>> = {};
  (progress ?? []).forEach((p) => {
    (progressByStudent[p.student_id] ??= new Set()).add(p.lesson_id);
  });

  const enrollmentsByStudent: Record<string, EnrollmentRow[]> = {};
  ((enrollments ?? []) as unknown as EnrollmentRow[]).forEach((e) => {
    (enrollmentsByStudent[e.student_id] ??= []).push(e);
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold">الطلاب</h1>
        <Link href="/admin" className="border border-[#D8DDE9] hover:bg-white transition rounded-full px-5 py-2.5 text-sm font-semibold">لوحة التحكم</Link>
      </div>

      <div className="flex flex-col gap-4">
        {(students ?? []).map((s) => {
          const ens = enrollmentsByStudent[s.id] ?? [];
          const done = progressByStudent[s.id] ?? new Set<string>();
          return (
            <div key={s.id} className="bg-white rounded-2xl border border-[#E5E8F0] p-5 flex flex-col gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-za-primary to-za-accent text-white font-bold flex items-center justify-center">
                  {(s.full_name || s.email || "?").charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-40">
                  <p className="font-semibold text-sm">{s.full_name || "—"}{s.role === "admin" ? " (أدمن)" : ""}</p>
                  <p className="text-xs text-[#8A93A8]" dir="ltr">{s.email}</p>
                </div>
              </div>
              {ens.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {ens.map((e) => {
                    if (!e.course) return null;
                    const total = (lessonsByCourse[e.course.id] ?? []).length;
                    const courseLessonIds = new Set(lessonsByCourse[e.course.id] ?? []);
                    const doneCount = [...done].filter((id) => courseLessonIds.has(id)).length;
                    const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;
                    return (
                      <div key={e.course.id} className="flex items-center gap-3 flex-wrap">
                        <p className="text-sm flex-1 min-w-32">{e.course.title_ar}</p>
                        <span className={`text-xs font-semibold rounded-full px-2.5 py-1 ${e.status === "active" ? "text-emerald-700 bg-emerald-50" : "text-red-700 bg-red-50"}`}>
                          {e.status === "active" ? "نشط" : "موقوف"}
                        </span>
                        <div className="flex items-center gap-2 min-w-40">
                          <div className="flex-1 h-2 bg-[#EEF1FB] rounded-full overflow-hidden">
                            <div className="h-full bg-za-accent rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-[#5A6378]">{doneCount}/{total}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-[#8A93A8]">مفيش اشتراكات.</p>
              )}
            </div>
          );
        })}
        {(students ?? []).length === 0 && <p className="text-sm text-[#8A93A8]">مفيش طلاب لسه.</p>}
      </div>
    </div>
  );
}
