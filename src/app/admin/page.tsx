import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import AdminGate from "@/components/admin/AdminGate";
import EnrollmentsAdmin from "@/components/admin/EnrollmentsAdmin";
import SocialLinksAdmin from "@/components/admin/SocialLinksAdmin";
import ReviewsAdmin from "@/components/admin/ReviewsAdmin";

export default async function AdminHome() {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return <AdminGate />;

  const [{ count: students }, { count: courses }, { count: activeEnr }, { count: doneLessons }, { count: pendingReviews }, { count: quizTries }] =
    await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("courses").select("id", { count: "exact", head: true }),
      supabase.from("enrollments").select("id", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("lesson_progress").select("lesson_id", { count: "exact", head: true }),
      supabase.from("reviews").select("id", { count: "exact", head: true }).eq("approved", false),
      supabase.from("quiz_attempts").select("id", { count: "exact", head: true }),
    ]);

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("id, status, created_at, student:profiles!enrollments_student_id_fkey(full_name,email), course:courses(title_ar,title_en)")
    .order("created_at", { ascending: false });

  const { data: courseList } = await supabase
    .from("courses")
    .select("id, title_ar")
    .order("sort_order", { ascending: true });

  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, name, text, rating, approved, seed, created_at")
    .order("created_at", { ascending: false });

  const { data: socialLinks } = await supabase
    .from("social_links")
    .select("id, platform, url, sort_order")
    .order("sort_order", { ascending: true });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 flex flex-col gap-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold">لوحة تحكم الأدمن</h1>
        <div className="flex gap-2 flex-wrap">
          <Link href="/admin/courses" className="bg-gradient-to-l from-za-primary to-za-accent hover:opacity-90 transition text-white rounded-full px-5 py-2.5 text-sm font-bold">+ كورس جديد</Link>
          <Link href="/admin/students" className="border border-[#D8DDE9] hover:bg-white transition rounded-full px-5 py-2.5 text-sm font-semibold">الطلاب</Link>
          <Link href="/" className="border border-[#D8DDE9] hover:bg-white transition rounded-full px-5 py-2.5 text-sm font-semibold">معاينة الموقع</Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { href: "/admin/courses", title: "الكورسات والمحتوى", desc: "إضافة وتعديل وحذف الكورسات والحصص والفيديوهات والملفات والاختبارات", cta: "إدارة المحتوى" },
          { href: "/admin/students", title: "متابعة الطلبة", desc: "تقدم كل طالب في كل كورس ونسب الإتمام", cta: "عرض الطلبة" },
          { href: "#enrollments", title: "الاشتراكات", desc: "تفعيل وإيقاف اشتراكات الطلبة في الكورسات", cta: "إدارة الاشتراكات" },
          { href: "#social", title: "لينكات السوشيال", desc: "لينكات المنصات اللي بتظهر في الفوتر", cta: "إدارة اللينكات" },
          { href: "#reviews", title: "آراء الطلبة", desc: "مراجعة ونشر تقييمات الطلبة اللي بتظهر في الصفحة الرئيسية", cta: "إدارة الآراء" },
        ].map((c) => (
          <Link key={c.href} href={c.href} className="group bg-white rounded-2xl border border-[#E5E8F0] p-5 hover:border-za-primary hover:shadow-lg transition flex flex-col gap-1.5">
            <p className="font-heading font-bold text-za-navy">{c.title}</p>
            <p className="text-xs text-[#5A6378] leading-relaxed flex-1">{c.desc}</p>
            <span className="text-xs font-semibold text-za-primary group-hover:underline">{c.cta} ←</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "إجمالي الطلاب", n: students ?? 0, href: "/admin/students", hot: false },
          { label: "إجمالي الكورسات", n: courses ?? 0, href: "/admin/courses", hot: false },
          { label: "اشتراكات نشطة", n: activeEnr ?? 0, href: "#enrollments", hot: false },
          { label: "حصص مكتملة", n: doneLessons ?? 0, href: "/admin/students", hot: false },
          { label: "آراء مستنية مراجعة", n: pendingReviews ?? 0, href: "#reviews", hot: (pendingReviews ?? 0) > 0 },
          { label: "محاولات الاختبارات", n: quizTries ?? 0, href: "/admin/students", hot: false },
        ].map((st) => (
          <Link
            key={st.label}
            href={st.href}
            className={`rounded-2xl border p-4 text-center transition hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(69,51,139,0.14)] ${st.hot ? "bg-amber-50 border-amber-300" : "bg-white border-[#E5E8F0]"}`}
          >
            <p className={`font-heading text-2xl sm:text-3xl font-bold ${st.hot ? "text-amber-600" : "text-za-primary"}`}>{st.n}</p>
            <p className="text-xs text-[#5A6378] mt-1">{st.label}</p>
          </Link>
        ))}
      </div>

      <div id="enrollments" className="scroll-mt-24"><EnrollmentsAdmin
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        enrollments={(enrollments ?? []) as any[]}
        courses={(courseList ?? []) as { id: string; title_ar: string }[]}
      /></div>

      <div id="social" className="scroll-mt-24"><SocialLinksAdmin links={socialLinks ?? []} /></div>

      <div id="reviews" className="scroll-mt-24"><ReviewsAdmin reviews={reviews ?? []} /></div>
    </div>
  );
}
