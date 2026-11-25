"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";

type Existing = { id: string; rating: number; text: string; approved: boolean };

export default function ReviewForm({ name }: { name: string }) {
  const { t } = useLang();
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [existing, setExisting] = useState<Existing | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("reviews")
          .select("id, rating, text, approved")
          .eq("user_id", user.id)
          .maybeSingle();
        if (data) {
          setExisting(data as Existing);
          setRating(data.rating);
          setText(data.text);
        }
      }
      setLoaded(true);
    })();
  }, []);

  async function submit() {
    if (!rating || !text.trim()) return;
    setBusy(true);
    setMsg("");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      if (existing) {
        const { error } = await supabase
          .from("reviews")
          .update({ rating, text: text.trim() })
          .eq("id", existing.id);
        if (!error) setExisting({ ...existing, rating, text: text.trim(), approved: false });
        setMsg(error ? error.message : t.reviewThanks);
      } else {
        const { data, error } = await supabase
          .from("reviews")
          .insert({ user_id: user.id, name: name || user.email, rating, text: text.trim() })
          .select("id, rating, text, approved")
          .single();
        if (!error && data) setExisting(data as Existing);
        setMsg(error ? error.message : t.reviewThanks);
      }
    }
    setBusy(false);
  }

  if (!loaded) return null;

  return (
    <div className="bg-white rounded-3xl border border-[#E5E8F0] p-6 sm:p-8 flex flex-col gap-5">
      <h2 className="font-heading text-xl font-bold">{t.myReview}</h2>
      {existing && (
        <p className={`text-xs font-semibold rounded-full px-3 py-1.5 self-start ${existing.approved ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
          {existing.approved ? t.reviewApprovedNote : t.reviewPendingNote}
        </p>
      )}
      <div className="flex flex-col gap-2">
        <span className="text-sm text-[#5A6378]">{t.yourRating}</span>
        <div className="flex gap-1" dir="ltr">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i)}
              aria-label={`${i}/5`}
              className={`text-2xl transition ${i <= rating ? "text-amber-400" : "text-[#D8DDE9] hover:text-amber-300"}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t.reviewPlaceholder}
        rows={3}
        maxLength={500}
        className="border border-[#D8DDE9] rounded-xl px-4 py-3 text-sm leading-relaxed resize-y"
      />
      <div className="flex items-center gap-4 flex-wrap">
        <button
          onClick={submit}
          disabled={busy || !rating || !text.trim()}
          className="bg-za-primary hover:bg-za-secondary transition text-white rounded-full px-6 py-2.5 text-sm font-semibold disabled:opacity-60"
        >
          {t.submitReview}
        </button>
        {msg && <p className="text-sm text-[#5A6378]">{msg}</p>}
      </div>
    </div>
  );
}
