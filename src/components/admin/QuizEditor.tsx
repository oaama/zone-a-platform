"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";

export type AdminQuestion = {
  id: string;
  lesson_id: string;
  question: string;
  options: string[];
  correct_index: number;
  sort_order: number;
};

export default function QuizEditor({
  lessonId,
  questions,
}: {
  lessonId: string;
  questions: AdminQuestion[];
}) {
  const { t } = useLang();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [opts, setOpts] = useState(["", "", "", ""]);
  const [correct, setCorrect] = useState(0);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function add() {
    setBusy(true);
    setMsg("");
    const supabase = createClient();
    const { error } = await supabase.from("quiz_questions").insert({
      lesson_id: lessonId,
      question: q,
      options: opts.filter((o) => o.trim()),
      correct_index: correct,
      sort_order: questions.length + 1,
    });
    if (error) setMsg(error.message);
    else {
      setQ("");
      setOpts(["", "", "", ""]);
      setCorrect(0);
      router.refresh();
    }
    setBusy(false);
  }

  async function remove(id: string) {
    const supabase = createClient();
    await supabase.from("quiz_questions").delete().eq("id", id);
    router.refresh();
  }

  return (
    <div className="bg-[#F8F9FD] rounded-xl border border-[#E5E8F0] p-4 flex flex-col gap-3">
      <button onClick={() => setOpen(!open)} className="self-start text-sm font-semibold text-za-secondary">
        {t.quizQuestions} ({questions.length}) {open ? "▲" : "▼"}
      </button>
      {open && (
        <>
          {questions.length === 0 ? (
            <p className="text-xs text-[#8A93A8]">{t.noQuestions}</p>
          ) : (
            <ol className="flex flex-col gap-2">
              {questions.map((qq, i) => (
                <li key={qq.id} className="bg-white rounded-lg border border-[#E5E8F0] px-3 py-2 flex items-start gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{i + 1}. {qq.question}</p>
                    <p className="text-xs text-[#8A93A8]">
                      {qq.options.map((o, oi) => `${oi === qq.correct_index ? "✓" : "•"} ${o}`).join("  •  ")}
                    </p>
                  </div>
                  <button onClick={() => remove(qq.id)} className="text-xs text-red-600 hover:underline">{t.delete}</button>
                </li>
              ))}
            </ol>
          )}
          <div className="bg-white rounded-lg border border-[#E5E8F0] p-4 flex flex-col gap-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t.question}
              className="border border-[#D8DDE9] rounded-xl px-4 py-2.5 text-sm"
            />
            {opts.map((o, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`correct-${lessonId}`}
                  checked={correct === i}
                  onChange={() => setCorrect(i)}
                  title={t.correctAnswer}
                />
                <input
                  value={o}
                  onChange={(e) => setOpts(opts.map((x, xi) => (xi === i ? e.target.value : x)))}
                  placeholder={`${t.option} ${i + 1}`}
                  className="flex-1 border border-[#D8DDE9] rounded-xl px-4 py-2 text-sm"
                />
              </div>
            ))}
            <p className="text-[11px] text-[#8A93A8]">{t.correctAnswer} = ◉</p>
            <div className="flex gap-3 items-center">
              <button
                onClick={add}
                disabled={busy || !q.trim() || opts.filter((o) => o.trim()).length < 2}
                className="bg-za-primary hover:bg-za-secondary transition text-white rounded-xl px-4 py-2 text-sm font-semibold disabled:opacity-60"
              >
                {busy ? t.saving : t.addQuestion}
              </button>
              {msg && <p className="text-xs text-red-600">{msg}</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
