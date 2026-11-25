import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CertificateView from "@/components/CertificateView";

export default async function CertificatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: course } = await supabase
    .from("courses")
    .select("id, slug, title_ar, title_en")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  if (!course) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .single();

  const { data: catalog } = await supabase
    .from("lesson_catalog")
    .select("id")
    .eq("course_id", course.id);
  const ids = (catalog ?? []).map((l) => l.id);

  let done = 0;
  if (ids.length) {
    const { data: prog } = await supabase
      .from("lesson_progress")
      .select("lesson_id")
      .eq("student_id", user.id)
      .in("lesson_id", ids);
    done = (prog ?? []).length;
  }

  const complete = ids.length > 0 && done >= ids.length;
  const serial = `ZA-${course.slug.slice(0, 4).toUpperCase()}-${user.id.slice(0, 6).toUpperCase()}`;

  return (
    <CertificateView
      complete={complete}
      slug={course.slug}
      courseTitleAr={course.title_ar}
      courseTitleEn={course.title_en}
      studentName={profile?.full_name || profile?.email || ""}
      serial={serial}
      date={new Date().toISOString()}
    />
  );
}
