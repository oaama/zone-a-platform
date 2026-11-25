import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CourseView, { type LessonCatalogItem } from "@/components/CourseView";

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: course } = await supabase
    .from("courses")
    .select("id, slug, title_ar, title_en, description_ar, description_en, thumbnail_url, level, category")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  if (!course) notFound();

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

  const { data: catalog } = await supabase
    .from("lesson_catalog")
    .select("id, title_ar, title_en, duration_minutes, sort_order, is_preview")
    .eq("course_id", course.id)
    .order("sort_order", { ascending: true });

  let completedIds: string[] = [];
  if (user && enrolled) {
    const { data: prog } = await supabase
      .from("lesson_progress")
      .select("lesson_id")
      .eq("student_id", user.id)
      .in("lesson_id", (catalog ?? []).map((l) => l.id).length ? (catalog ?? []).map((l) => l.id) : ["00000000-0000-0000-0000-000000000000"]);
    completedIds = (prog ?? []).map((p) => p.lesson_id);
  }

  return (
    <CourseView
      course={course}
      enrolled={enrolled}
      lessons={(catalog ?? []) as LessonCatalogItem[]}
      completedIds={completedIds}
      loggedIn={!!user}
    />
  );
}
