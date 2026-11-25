"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Review = {
  id: string;
  name: string | null;
  text: string;
  rating: number;
  approved: boolean;
  seed: boolean;
  created_at: string;
};

export default function ReviewsAdmin({ reviews: initial }: { reviews: Review[] }) {
  const [reviews, setReviews] = useState(initial);
  const [busyId, setBusyId] = useState("");

  async function toggle(r: Review) {
    setBusyId(r.id);
    const supabase = createClient();
    const { error } = await supabase.from("reviews").update({ approved: !r.approved }).eq("id", r.id);
    if (!error) setReviews((rs) => rs.map((x) => (x.id === r.id ? { ...x, approved: !x.approved } : x)));
    setBusyId("");
  }

  async function remove(r: Review) {
    if (!window.confirm("متأكد إنك عايز تمسح الرأي ده؟")) return;
    setBusyId(r.id);
    const supabase = createClient();
    const { error } = await supabase.from("reviews").delete().eq("id", r.id);
    if (!error) setReviews((rs) => rs.filter((x) => x.id !== r.id));
    setBusyId("");
  }

  const pending = reviews.filter((r) => !r.approved).length;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-heading text-xl font-bold">آراء الطلبة</h2>
        {pending > 0 && (
          <span className="text-xs font-semibold bg-amber-50 text-amber-700 rounded-full px-3 py-1.5">
            {pending} في انتظار الموافقة
          </span>
        )}
      </div>
      {reviews.length === 0 ? (
        <p className="text-sm text-[#5A6378] bg-white rounded-2xl border border-[#E5E8F0] p-6">مفيش آراء لسه.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-[#E5E8F0] p-4 sm:p-5 flex flex-col gap-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-sm">{r.name || "طالب"}</span>
                  <span className="text-amber-400 text-xs tracking-widest" dir="ltr">
                    {"★".repeat(r.rating)}
                    <span className="text-[#D8DDE9]">{"★".repeat(5 - r.rating)}</span>
                  </span>
                  {r.seed && <span className="text-[10px] bg-[#EEF1FB] text-za-secondary rounded-full px-2 py-0.5">مبدئي</span>}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggle(r)}
                    disabled={busyId === r.id}
                    className={`text-xs font-semibold rounded-full px-4 py-1.5 transition disabled:opacity-60 ${
                      r.approved
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "bg-za-primary text-white hover:bg-za-secondary"
                    }`}
                  >
                    {r.approved ? "منشور — إخفاء" : "نشر"}
                  </button>
                  <button
                    onClick={() => remove(r)}
                    disabled={busyId === r.id}
                    className="text-xs font-semibold rounded-full px-4 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-60"
                  >
                    مسح
                  </button>
                </div>
              </div>
              <p className="text-sm text-[#3B4460] leading-relaxed">{r.text}</p>
              <p className="text-[11px] text-[#8A93A8]">{new Date(r.created_at).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" })}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
