import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardView, { type EnrollmentRow } from "@/components/DashboardView";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, avatar_url")
    .eq("id", user.id)
    .single();

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("course_id, status, courses(id, slug, title_ar, title_en, thumbnail_url, level)")
    .eq("student_id", user.id)
    .eq("status", "active");

  const { data: attempts } = await supabase
    .from("quiz_attempts")
    .select("lesson_id, score, total")
    .eq("student_id", user.id);

  const rows: EnrollmentRow[] = [];
  for (const e of enrollments ?? []) {
    const course = Array.isArray(e.courses) ? e.courses[0] : e.courses;
    if (!course) continue;

    const { data: lessons } = await supabase
      .from("lesson_catalog")
      .select("id, title_ar, title_en, sort_order")
      .eq("course_id", course.id)
      .order("sort_order", { ascending: true });
    const lessonIds = (lessons ?? []).map((l) => l.id);

    const { data: prog } = lessonIds.length
      ? await supabase
          .from("lesson_progress")
          .select("lesson_id")
          .eq("student_id", user.id)
          .in("lesson_id", lessonIds)
      : { data: [] };
    const doneSet = new Set((prog ?? []).map((p) => p.lesson_id));

    let nextN: number | null = null;
    for (let i = 0; i < (lessons ?? []).length; i++) {
      if (!doneSet.has(lessons![i].id)) {
        nextN = i + 1;
        break;
      }
    }

    let best: number | null = null;
    for (const a of attempts ?? []) {
      if (lessonIds.includes(a.lesson_id) && a.total > 0) {
        const pct = Math.round((a.score / a.total) * 100);
        if (best === null || pct > best) best = pct;
      }
    }

    rows.push({
      slug: course.slug,
      title_ar: course.title_ar,
      title_en: course.title_en,
      thumbnail_url: course.thumbnail_url,
      level: course.level,
      total: lessonIds.length,
      done: doneSet.size,
      nextN,
      best,
    });
  }

  const totalDone = rows.reduce((s, r) => s + r.done, 0);

  return (
    <DashboardView
      name={profile?.full_name || ""}
      email={user.email || ""}
      avatarUrl={profile?.avatar_url || ""}
      rows={rows}
      totalDone={totalDone}
    />
  );
}
