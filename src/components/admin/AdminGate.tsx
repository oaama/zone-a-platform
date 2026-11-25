"use client";

import { useLang } from "@/lib/i18n";
import { ShieldIcon } from "@/components/Icons";
import Link from "next/link";

export default function AdminGate() {
  const { t } = useLang();
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center flex flex-col items-center gap-5">
      <span className="text-za-primary"><ShieldIcon className="w-10 h-10" /></span>
      <h1 className="font-heading text-2xl font-bold">{t.adminOnly}</h1>
      <Link href="/login" className="bg-za-primary text-white rounded-full px-6 py-3 text-sm font-semibold">
        {t.login}
      </Link>
    </div>
  );
}
