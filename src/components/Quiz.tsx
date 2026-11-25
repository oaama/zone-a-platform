"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { QuizIcon } from "@/components/Icons";
import { createClient } from "@/lib/supabase/client";

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
};

export default function Quiz({
  lessonId,
  userId,
  questions,
  canAttempt,
}: {
  lessonId: string;
  userId: string;
  questions: QuizQuestion[];
  canAttempt: boolean;
}) {
  const { t } = useLang();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);
  const [busy, setBusy] = useState(false);

  if (questions.length === 0) return null;

  async function submit() {
    if (Object.keys(answers).length < questions.length) {
      alert(t.quizEmpty);
      return;
    }
    setBusy(true);
    const score = questions.reduce((s, q) => s + (answers[q.id] === q.correct_index ? 1 : 0), 0);
    setResult({ score, total: questions.length });
    if (canAttempt) {
      const supabase = createClient();
      await supabase.from("quiz_attempts").insert({
        student_id: userId,
        lesson_id: lessonId,
        score,
        total: questions.length,
      });
    }
    setBusy(false);
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E5E8F0] p-6 flex flex-col gap-5">
      <h2 className="font-heading text-lg font-bold flex items-center gap-2"><QuizIcon className="w-5 h-5 text-za-secondary" /> {t.quiz}</h2>
      {questions.map((q, qi) => (
        <div key={q.id} className="flex flex-col gap-2">
          <p className="font-medium text-sm">
            {qi + 1}. {q.question}
          </p>
          <div className="flex flex-col gap-1.5">
            {q.options.map((opt, oi) => {
              const selected = answers[q.id] === oi;
              const showCorrect = result && oi === q.correct_index;
              const showWrong = result && selected && oi !== q.correct_index;
              return (
                <button
                  key={oi}
                  disabled={!!result}
                  onClick={() => setAnswers({ ...answers, [q.id]: oi })}
                  className={`text-start text-sm rounded-xl border px-4 py-2.5 transition ${
                    showCorrect
                      ? "border-emerald-500 bg-emerald-50"
                      : showWrong
                        ? "border-red-400 bg-red-50"
                        : selected
                          ? "border-za-primary bg-[#EEF1FB]"
                          : "border-[#D8DDE9] hover:bg-[#F8F9FD]"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {result ? (
        <div className="flex items-center gap-3 flex-wrap">
          <p className="font-heading font-bold">
            {t.quizScore}: {result.score}/{result.total}
          </p>
          {result.score === result.total && (
            <span className="text-sm font-semibold text-emerald-700">{t.quizPassed}</span>
          )}
          <button
            onClick={() => {
              setResult(null);
              setAnswers({});
            }}
            className="text-sm text-za-secondary hover:underline font-semibold"
          >
            {t.quizRetry}
          </button>
        </div>
      ) : (
        <button
          onClick={submit}
          disabled={busy}
          className="self-start bg-za-primary hover:bg-za-secondary transition text-white rounded-full px-6 py-2.5 text-sm font-semibold disabled:opacity-60"
        >
          {t.submitQuiz}
        </button>
      )}
    </div>
  );
}
