import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LessonView from "@/components/LessonView";
import LockedView from "@/components/LockedView";
import type { QuizQuestion } from "@/components/Quiz";

export default async function LessonPage({ params }: { params: Promise<{ slug: string; n: string }> }) {
  const { slug, n } = await params;
  const idx = parseInt(n, 10);
  if (!Number.isFinite(idx) || idx < 1) notFound();

  const supabase = await createClient();
  const { data: course } = await supabase
    .from("courses")
    .select("id, slug, title_ar, title_en")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  if (!course) notFound();

  const { data: catalog } = await supabase
    .from("lesson_catalog")
    .select("id, title_ar, title_en, duration_minutes, sort_order, is_preview")
    .eq("course_id", course.id)
    .order("sort_order", { ascending: true });
  const items = catalog ?? [];
  const entry = items[idx - 1];
  if (!entry) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let enrolled = false;
  if (user) {
    const { data: en } = await supabase
      .from("enrollments")
      .select("id")
      .eq("student_id", user.id)
      .eq("course_id", course.id)
      .eq("status", "active")
      .maybeSingle();
    enrolled = !!en;
  }

  const { data: lesson } = await supabase
    .from("lessons")
    .select("id, title_ar, title_en, description, content_ar, content_en, video_path, material_path, duration_minutes, is_preview")
    .eq("id", entry.id)
    .maybeSingle();

  if (!lesson) {
    return <LockedView slug={course.slug} courseTitleAr={course.title_ar} loggedIn={!!user} />;
  }

  let videoUrl: string | null = null;
  if (lesson.video_path) {
    const { data: signed } = await supabase.storage
      .from("course-videos")
      .createSignedUrl(lesson.video_path, 3600);
    videoUrl = signed?.signedUrl ?? null;
  }

  let materialUrl: string | null = null;
  if (lesson.material_path) {
    const { data: signed } = await supabase.storage
      .from("course-materials")
      .createSignedUrl(lesson.material_path, 3600);
    materialUrl = signed?.signedUrl ?? null;
  }

  let completedIds: string[] = [];
  if (user) {
    const { data: prog } = await supabase
      .from("lesson_progress")
      .select("lesson_id")
      .eq("student_id", user.id)
      .in("lesson_id", items.length ? items.map((l) => l.id) : ["00000000-0000-0000-0000-000000000000"]);
    completedIds = (prog ?? []).map((p) => p.lesson_id);
  }

  let questions: QuizQuestion[] = [];
  if (user && (enrolled || lesson.is_preview)) {
    const { data: qs } = await supabase
      .from("quiz_questions")
      .select("id, question, options, correct_index")
      .eq("lesson_id", lesson.id)
      .order("sort_order", { ascending: true });
    questions = (qs ?? []) as QuizQuestion[];
  }

  const sidebar = items.map((l, i) => ({
    n: i + 1,
    title_ar: l.title_ar,
    title_en: l.title_en,
    duration_minutes: l.duration_minutes,
    done: completedIds.includes(l.id),
    locked: !enrolled && !l.is_preview,
  }));

  return (
    <LessonView
      slug={course.slug}
      courseTitleAr={course.title_ar}
      courseTitleEn={course.title_en}
      lesson={{
        id: lesson.id,
        title_ar: lesson.title_ar,
        title_en: lesson.title_en,
        description: lesson.description,
        duration_minutes: lesson.duration_minutes,
      }}
      contentAr={lesson.content_ar ?? ""}
      contentEn={lesson.content_en ?? ""}
      materialUrl={materialUrl}
      videoUrl={videoUrl}
      index={idx}
      total={items.length}
      hasPrev={idx > 1}
      hasNext={idx < items.length}
      completed={completedIds.includes(lesson.id)}
      canComplete={!!user && (enrolled || lesson.is_preview)}
      userId={user?.id ?? ""}
      sidebar={sidebar}
      questions={questions}
      allDone={items.length > 0 && items.every((l) => completedIds.includes(l.id))}
    />
  );
}
