"use client";

import { useLang } from "@/lib/i18n";

export default function CoursesTitle() {
  const { t, lang } = useLang();
  return (
    <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-10 text-center">
      {lang === "ar" ? (
        <>كورسات <span className="text-za-primary">زون إيه</span></>
      ) : (
        <><span className="text-za-primary">ZONE A</span> courses</>
      )}
    </h2>
  );
}
