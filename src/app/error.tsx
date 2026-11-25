"use client";

import { WarnIcon } from "@/components/Icons";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center flex flex-col items-center gap-5">
      <span className="text-za-primary"><WarnIcon className="w-12 h-12" /></span>
      <h1 className="font-heading text-2xl font-bold">حصل خطأ</h1>
      <p className="text-[#5A6378]">حاجة مش مظبوطة حصلت. جرب تاني.</p>
      <button onClick={reset} className="bg-za-primary hover:bg-za-secondary transition text-white rounded-full px-6 py-3 text-sm font-semibold">
        حاول تاني
      </button>
    </div>
  );
}
