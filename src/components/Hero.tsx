"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import { SpeakerIcon, MedalIcon } from "@/components/Icons";



export default function Hero() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(true);
  const [soundBlocked, setSoundBlocked] = useState(false);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);

  // try autoplay WITH sound first; if the browser blocks it (mobile
  // Chrome/Safari), fall back to muted autoplay + a big unmute button.
  useEffect(() => {
    const v = previewVideoRef.current;
    if (!v) return;
    const vid: HTMLVideoElement = v;
    let attempted = false;
    async function tryPlay() {
      if (!attempted) {
        attempted = true;
        try {
          vid.muted = false;
          await vid.play();
          setMuted(false);
          setSoundBlocked(false);
          return;
        } catch {
          vid.muted = true;
          setMuted(true);
          setSoundBlocked(true);
        }
      }
      try {
        await vid.play();
      } catch {
        /* stays paused until visible again */
      }
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) void tryPlay();
          else vid.pause();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  // first interaction anywhere on the page tries to turn the sound on
  // (mobile browsers allow unmuting inside a real user gesture)
  useEffect(() => {
    function onGesture() {
      const v = previewVideoRef.current;
      if (!v) return;
      v.muted = false;
      v.play()
        .then(() => {
          setMuted(false);
          setSoundBlocked(false);
          window.removeEventListener("pointerdown", onGesture);
          window.removeEventListener("touchstart", onGesture);
        })
        .catch(() => {
          v.muted = true;
        });
    }
    window.addEventListener("pointerdown", onGesture);
    window.addEventListener("touchstart", onGesture);
    return () => {
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("touchstart", onGesture);
    };
  }, []);

  function unmuteInline(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const v = previewVideoRef.current;
    if (!v) return;
    v.muted = false;
    setMuted(false);
    setSoundBlocked(false);
    v.currentTime = 0;
    v.play().catch(() => {});
  }

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const v = modalVideoRef.current;
      if (v) {
        v.muted = false;
        v.play().catch(() => {});
      }
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <section className="relative bg-za-navy text-white overflow-hidden">
      {/* aurora background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-32 start-[8%] w-[480px] h-[480px] rounded-full bg-za-primary/45 blur-[130px] animate-drift" />
        <div className="absolute top-24 end-[4%] w-[420px] h-[420px] rounded-full bg-za-accent/35 blur-[130px] animate-drift-slow" />
        <div className="absolute -bottom-40 start-[35%] w-[520px] h-[520px] rounded-full bg-za-secondary/30 blur-[150px] animate-drift" />
        <div className="absolute inset-0 hero-grid" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-14 pb-16 sm:pt-16 sm:pb-24 grid grid-cols-1 md:grid-cols-[1.15fr_1fr] gap-8 md:gap-14 items-center">
        {/* text column (right side in RTL) */}
        <div className="text-center md:text-start flex flex-col items-center md:items-start gap-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-wide.png"
            alt="ZONE A Academy"
            className="animate-fade-up h-14 sm:h-16 w-auto drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
          />
          <h1 className="animate-fade-up delay-1 font-heading font-bold leading-[1.2] text-[clamp(1.75rem,2.2rem+2vw,3.4rem)]">
            {t.heroTitle}
          </h1>
          <p className="animate-fade-up delay-2 font-heading text-lg sm:text-2xl font-bold text-[#D9E2F7]">
            {t.heroTypedPrefix}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#8FA8F0] to-[#C7B9FF]">
              {t.heroFields}
            </span>
          </p>
          <p className="animate-fade-up delay-2 text-[#B7C1DA] max-w-xl text-base sm:text-lg leading-relaxed">
            {t.heroSub}
          </p>
          <p className="animate-fade-up delay-2 font-heading text-xl sm:text-2xl font-semibold text-gradient">
            {t.tagline}
          </p>
          <div className="animate-fade-up delay-3 flex flex-wrap justify-center md:justify-start gap-3 mt-1">
            <Link
              href="#courses"
              className="bg-gradient-to-l from-za-primary to-za-accent hover:opacity-90 hover:scale-[1.03] active:scale-100 transition rounded-full px-8 py-3.5 text-sm font-bold shadow-[0_8px_30px_rgba(69,51,139,0.45)]"
            >
              {t.browseCourses}
            </Link>
            <Link
              href="/signup"
              className="border border-white/15 bg-white/5 backdrop-blur hover:bg-white/10 hover:scale-[1.03] active:scale-100 transition rounded-full px-8 py-3.5 text-sm font-bold"
            >
              {t.signup}
            </Link>
          </div>
          <div className="animate-fade-up delay-4 flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 mt-3 text-xs text-[#A9B8E8]">
            <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span>{t.f2}</span>
            <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span>{t.f3}</span>
            <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span>{t.f4}</span>
          </div>
        </div>

        {/* promo video column (opposite the text) */}
        <div className="animate-fade-up delay-2 flex justify-center">
          <div
            role="button"
            tabIndex={0}
            onClick={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setOpen(true);
            }}
            aria-label={t.promoPlay}
            className="group relative block w-full max-w-[260px] sm:max-w-[280px] lg:max-w-[300px] rounded-3xl overflow-hidden ring-1 ring-white/15 shadow-[0_24px_70px_rgba(26,91,181,0.35)] cursor-pointer"
          >
            <video
              ref={previewVideoRef}
              src="/promo.mp4"
              playsInline
              {...{ "webkit-playsinline": "true" }}
              loop
              preload="auto"
              muted={muted}
              className="w-full aspect-[9/16] object-cover pointer-events-none"
            />
            {/* small expand affordance: opens the lightbox on purpose */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
              }}
              aria-label={t.promoPlay}
              className="absolute top-3 end-3 z-10 w-9 h-9 rounded-full bg-za-navy/60 backdrop-blur border border-white/25 text-white flex items-center justify-center hover:bg-za-primary/80 transition"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </button>
            {muted && (
              <button
                type="button"
                onClick={unmuteInline}
                aria-label={t.tapForSound}
                className={`absolute flex items-center justify-center gap-2 text-white font-semibold border transition ${
                  soundBlocked
                    ? "inset-x-4 bottom-4 rounded-full py-3 bg-za-primary/90 backdrop-blur border-white/30 shadow-[0_10px_30px_rgba(26,91,181,0.55)] animate-pulse"
                    : "bottom-3 end-3 w-9 h-9 rounded-full bg-za-navy/60 backdrop-blur border-white/25 hover:bg-za-primary/80"
                }`}
              >
                <SpeakerIcon className={soundBlocked ? "w-5 h-5" : "w-[18px] h-[18px]"} off />
                {soundBlocked && <span className="text-sm">{t.tapForSound}</span>}
              </button>
            )}
            <span className="absolute inset-0 bg-gradient-to-t from-za-navy/70 via-transparent to-transparent pointer-events-none" aria-hidden />

            {/* floating glass chips */}
            <span className="absolute -top-3 -start-3 sm:-start-6 z-10 flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/25 rounded-full px-3 py-1.5 text-[11px] font-semibold text-white shadow-lg animate-float pointer-events-none" aria-hidden>
              <MedalIcon className="w-3.5 h-3.5 text-[#C7B9FF]" /> {t.f4}
            </span>
            <span className="absolute -bottom-3 -end-2 sm:-end-5 z-10 flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/25 rounded-full px-3 py-1.5 text-[11px] font-semibold text-white shadow-lg animate-float-slow pointer-events-none" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-[#8FA8F0]"><path d="M3 17l5-5 4 4 8-8M15 8h6v6" /></svg> {t.f3}
            </span>
          </div>
        </div>
      </div>


      {/* lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-[90] bg-za-navy/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-label={t.promoTitle}
        >
          <video
            ref={modalVideoRef}
            src="/promo.mp4"
            controls
            playsInline
            autoPlay
            className="max-h-[88vh] max-w-full rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute top-4 end-4 w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white text-lg hover:bg-white/20 transition"
          >
            ✕
          </button>
        </div>
      )}
    </section>
  );
}
