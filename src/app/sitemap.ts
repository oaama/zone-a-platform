import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const SITE = "https://zone-a-platform.onrender.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = ["", "/courses", "/about", "/contact", "/login", "/signup"].map((p) => ({
    url: `${SITE}${p}`,
    lastModified: new Date(),
  }));
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("courses").select("slug").eq("is_published", true);
    const coursePages = (data ?? []).map((c) => ({
      url: `${SITE}/courses/${c.slug}`,
      lastModified: new Date(),
    }));
    return [...staticPages, ...coursePages];
  } catch {
    return staticPages;
  }
}
