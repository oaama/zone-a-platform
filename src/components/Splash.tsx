"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";

export default function Splash() {
  const { lang } = useLang();
  const [show, setShow] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("za-splash")) {
      setShow(false);
      return;
    }
    sessionStorage.setItem("za-splash", "1");
  }, []);

  function close() {
    setLeaving(true);
    setTimeout(() => setShow(false), 450);
  }

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(close, 8000);
    return () => clearTimeout(timer);
  }, [show]);

  if (!show) return null;
  return (
    <div
      className={`fixed inset-0 z-[100] bg-za-navy flex items-center justify-center cursor-pointer transition-opacity duration-500 ${leaving ? "opacity-0" : "opacity-100"}`}
      onClick={close}
      role="button"
      aria-label={lang === "ar" ? "تخطي المقدمة" : "Skip intro"}
    >
      <video
        src="/intro.mp4"
        autoPlay
        muted
        playsInline
        onEnded={close}
        className="max-w-full max-h-full mix-blend-lighten"
      />
      <span className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs sm:text-sm font-medium text-white/85 bg-white/10 border border-white/25 rounded-full px-5 py-2 backdrop-blur-sm pointer-events-none select-none">
        {lang === "ar" ? "تخطي المقدمة" : "Skip intro"}
      </span>
    </div>
  );
}
