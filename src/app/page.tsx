import { createClient } from "@/lib/supabase/server";
import { type Course } from "@/components/CourseCard";
import CoursesExplorer from "@/components/CoursesExplorer";
import CoursesTitle from "@/components/CoursesTitle";
import { Suspense } from "react";
import Hero from "@/components/Hero";
import HomeSections from "@/components/HomeSections";
import Reveal from "@/components/Reveal";

export default async function Home() {
  const supabase = await createClient();
  const { data: courses } = await supabase
    .from("courses")
    .select("id, slug, title_ar, title_en, description_ar, description_en, thumbnail_url, level, category")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });


  const { data: dbReviews } = await supabase
    .from("reviews")
    .select("name, text, rating")
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(20);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "ZONE A Academy",
    alternateName: "منصة زون إيه التعليمية",
    url: "https://zone-a-platform.onrender.com",
    logo: "https://zone-a-platform.onrender.com/logo-icon.png",
    description:
      "أكاديمية متخصصة في المجالات الرقمية: برمجة، جرافيكس، ولغات.",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Courses",
      itemListElement: ((courses as Course[]) ?? []).map((c, i) => ({
        "@type": "Course",
        position: i + 1,
        name: c.title_ar,
        description: c.description_ar,
        provider: { "@type": "Organization", name: "ZONE A Academy" },
      })),
    },
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <section id="courses" className="mx-auto max-w-6xl px-4 py-10 scroll-mt-24">
        <Reveal>
          <CoursesTitle />
        </Reveal>
        {courses && courses.length > 0 ? (
          <Suspense>
            <CoursesExplorer courses={courses as Course[]} />
          </Suspense>
        ) : (
          <p className="text-center text-[#5A6378]">
            الكورسات جاية في الطريق — أول كورس بينزل قريب.
          </p>
        )}
      </section>
      <HomeSections dbReviews={(dbReviews ?? []) as { name: string; text: string; rating: number }[]} />
    </>
  );
}
