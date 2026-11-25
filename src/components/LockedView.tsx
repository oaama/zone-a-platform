"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { LockIcon } from "@/components/Icons";
import { waLink } from "@/components/CourseView";

export default function LockedView({ slug, courseTitleAr }: { slug: string; courseTitleAr: string; loggedIn: boolean }) {
  const { lang, t } = useLang();
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center flex flex-col items-center gap-5">
      <span className="text-za-primary"><LockIcon className="w-10 h-10" /></span>
      <h1 className="font-heading text-2xl font-bold">{t.lockedTitle}</h1>
      <p className="text-[#5A6378]">{t.lockedText}</p>
      <div className="flex gap-3">
        <a
          href={waLink(courseTitleAr, lang)}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-za-primary hover:bg-za-secondary transition text-white rounded-full px-6 py-3 text-sm font-semibold"
        >
          {t.requestAccess}
        </a>
        <Link
          href={`/courses/${slug}`}
          className="border border-[#D8DDE9] hover:bg-white transition rounded-full px-6 py-3 text-sm font-semibold"
        >
          {t.backToCourse}
        </Link>
      </div>
    </div>
  );
}
