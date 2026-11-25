import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import AdminGate from "@/components/admin/AdminGate";
import CourseEditor from "@/components/admin/CourseEditor";
import LessonsAdmin from "@/components/admin/LessonsAdmin";

export default async function AdminCourseDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return <AdminGate />;

  const { data: course } = await supabase
    .from("courses")
    .select("id, slug, title_ar, title_en, description_ar, description_en, level, is_published, thumbnail_url, sort_order")
    .eq("id", id)
    .single();
  if (!course) notFound();

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, title_ar, title_en, description, content_ar, content_en, video_path, material_path, duration_minutes, sort_order, is_preview")
    .eq("course_id", id)
    .order("sort_order", { ascending: true });

  const lessonIds = (lessons ?? []).map((l) => l.id);
  const { data: questions } = lessonIds.length
    ? await supabase
        .from("quiz_questions")
        .select("id, lesson_id, question, options, correct_index, sort_order")
        .in("lesson_id", lessonIds)
        .order("sort_order", { ascending: true })
    : { data: [] };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-heading text-2xl font-bold">{course.title_ar}</h1>
        <Link href="/admin/courses" className="border border-[#D8DDE9] hover:bg-white transition rounded-full px-5 py-2.5 text-sm font-semibold">الكورسات</Link>
      </div>
      <CourseEditor course={course} />
      <LessonsAdmin courseId={course.id} lessons={lessons ?? []} questions={questions ?? []} />
    </div>
  );
}
