import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import AdminGate from "@/components/admin/AdminGate";
import CoursesAdmin from "@/components/admin/CoursesAdmin";

export default async function AdminCourses() {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return <AdminGate />;

  const { data: courses } = await supabase
    .from("courses")
    .select("id, slug, title_ar, title_en, level, is_published, thumbnail_url, sort_order")
    .order("sort_order", { ascending: true });

  const { data: counts } = await supabase.from("lessons").select("course_id");
  const countMap: Record<string, number> = {};
  (counts ?? []).forEach((l) => {
    countMap[l.course_id] = (countMap[l.course_id] ?? 0) + 1;
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold">الكورسات</h1>
        <Link href="/admin" className="border border-[#D8DDE9] hover:bg-white transition rounded-full px-5 py-2.5 text-sm font-semibold">لوحة التحكم</Link>
      </div>
      <CoursesAdmin courses={courses ?? []} lessonCounts={countMap} />
    </div>
  );
}
