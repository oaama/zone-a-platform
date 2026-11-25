"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import Reveal from "@/components/Reveal";

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-za-secondary group-hover:text-white transition-colors duration-300" aria-hidden>
      <path d={d} />
    </svg>
  );
}

const WHATSAPP = "201202412997";

const ICONS = {
  target: "M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25",
  hands: "M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z",
  chat: "M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155",
  users: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z",
  play: "M15 10l4.55-2.28A1 1 0 0121 8.62v6.76a1 1 0 01-1.45.9L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
  quiz: "M9 12l2 2 4-4m5.6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  chart: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  cert: "M9 12l2 2 4-4M7.8 21l-2.3-2.6.6-3.4-3.1-1.5 1.4-3.2-1-3.3 3.4-.8L7 3.5l3 1.8L13.4 4l1.2 3.2 3.4.8-1 3.3 1.4 3.2-3.1 1.5.6 3.4L13.6 21 12 19.6 10.4 21z",
};

export type ReviewItem = { name: string; text: string; role?: string; img?: number; rating?: number };

export default function HomeSections({ dbReviews = [] }: { dbReviews?: ReviewItem[] }) {
  const { t } = useLang();
  const [openFaq, setOpenFaq] = useState<number>(0);
  const waAsk = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("عندي سؤال عن كورسات ZONE A")}`;
  const faqItems = (t.faq as { q: string; a: string }[]) ?? [];
  const reasons = [
    { icon: ICONS.target, title: t.why1, d: t.why1d },
    { icon: ICONS.hands, title: t.why2, d: t.why2d },
    { icon: ICONS.chat, title: t.why3, d: t.why3d },
    { icon: ICONS.users, title: t.why4, d: t.why4d },
  ];
  const features = [
    { icon: ICONS.play, title: t.f1, d: t.f1d },
    { icon: ICONS.quiz, title: t.f2, d: t.f2d },
    { icon: ICONS.chart, title: t.f3, d: t.f3d },
    { icon: ICONS.cert, title: t.f4, d: t.f4d },
  ];
  const steps = [t.step1, t.step2, t.step3, t.step4];
  const reviewItems: ReviewItem[] = dbReviews.length ? dbReviews : (t.testimonials as ReviewItem[]);
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-8 text-center">{t.featuresTitle}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 100}>
              <div className="group h-full bg-white rounded-2xl border border-[#E5E8F0] p-4 sm:p-6 flex flex-col items-center gap-2 sm:gap-3 text-center hover:shadow-[0_16px_44px_rgba(69,51,139,0.14)] hover:-translate-y-1 hover:border-za-primary/25 transition-all duration-300">
                <span className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#EEF1FB] to-[#E2E9FA] flex items-center justify-center group-hover:from-za-primary group-hover:to-za-accent group-hover:scale-105 transition-all duration-300">
                  <Icon d={f.icon} />
                </span>
                <h3 className="font-heading font-bold text-sm sm:text-base">{f.title}</h3>
                <p className="text-xs sm:text-sm text-[#5A6378] leading-relaxed">{f.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative bg-za-navy text-white py-12 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-24 start-[15%] w-96 h-96 rounded-full bg-za-primary/35 blur-[120px] animate-drift" />
          <div className="absolute -bottom-24 end-[10%] w-96 h-96 rounded-full bg-za-accent/30 blur-[120px] animate-drift-slow" />
          <div className="absolute inset-0 hero-grid" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-8 text-center">{t.howTitle}</h2>
          <ol className="relative grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="hidden lg:block absolute top-6 inset-x-16 h-px bg-gradient-to-l from-za-primary/0 via-[#5b8def66] to-za-primary/0" aria-hidden />
            {steps.map((s, i) => (
              <li key={i} className="relative flex flex-col items-center gap-3 text-center animate-fade-up" style={{ animationDelay: `${i * 140}ms`, animationPlayState: "running" }}>
                <span className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-za-primary to-za-accent font-heading font-bold text-base sm:text-lg flex items-center justify-center ring-4 ring-white/10 shadow-[0_6px_20px_rgba(26,91,181,0.45)]">
                  {i + 1}
                </span>
                <p className="text-[#D9E2F7] text-sm leading-relaxed max-w-[220px]">{s}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* stats strip */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <Reveal>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-8 text-center">{t.statsTitle}</h2>
        </Reveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {[
            { n: "120+", l: t.statsStudents },
            { n: "4", l: t.statsCourses },
            { n: "40+", l: t.statsLessons },
            { n: "98%", l: t.statsSatisfaction },
          ].map((st, i) => (
            <Reveal key={st.l} delay={i * 100}>
              <div className="bg-white rounded-2xl border border-[#E5E8F0] p-6 text-center hover:shadow-[0_16px_44px_rgba(69,51,139,0.14)] hover:-translate-y-1 transition-all duration-300">
                <p className="font-heading text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-l from-za-primary to-za-accent">{st.n}</p>
                <p className="text-sm text-[#5A6378] mt-1">{st.l}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* why us */}
      <section className="relative bg-za-navy text-white py-12 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-28 end-[20%] w-[420px] h-[420px] rounded-full bg-za-primary/35 blur-[130px] animate-drift" />
          <div className="absolute -bottom-28 start-[8%] w-96 h-96 rounded-full bg-za-accent/25 blur-[120px] animate-drift-slow" />
          <div className="absolute inset-0 hero-grid" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4">
          <Reveal>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-8 text-center">{t.whyTitle}</h2>
          </Reveal>
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.07] backdrop-blur-md p-6 sm:p-9 mb-5 sm:mb-7 flex flex-col sm:flex-row items-center gap-5 sm:gap-7 text-center sm:text-start">
              <span className="relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-za-primary to-za-accent flex items-center justify-center shadow-[0_10px_30px_rgba(26,91,181,0.5)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white" aria-hidden>
                  <path d={ICONS.chart} />
                </svg>
              </span>
              <div>
                <h3 className="font-heading text-xl sm:text-2xl font-bold">{t.whyLeadTitle}</h3>
                <p className="text-[#D9E2F7] leading-relaxed mt-2 max-w-2xl">{t.whyLeadText}</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-l from-za-primary/10 via-transparent to-transparent pointer-events-none" aria-hidden />
            </div>
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {reasons.map((r, i) => (
              <Reveal key={r.title} delay={i * 100}>
                <div className="group h-full rounded-2xl border border-white/12 bg-white/[0.05] backdrop-blur-sm p-4 sm:p-6 flex flex-col items-center gap-2 sm:gap-3 text-center hover:bg-white/[0.1] hover:-translate-y-1 hover:border-white/25 transition-all duration-300">
                  <span className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-za-primary group-hover:to-za-accent transition-all duration-300">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-[#C7B9FF] group-hover:text-white transition-colors duration-300" aria-hidden>
                      <path d={r.icon} />
                    </svg>
                  </span>
                  <h3 className="font-heading font-bold text-sm sm:text-base">{r.title}</h3>
                  <p className="text-xs sm:text-sm text-[#B9C6E8] leading-relaxed">{r.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* instructor highlight */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-za-primary via-za-secondary to-za-accent p-8 sm:p-12 text-white flex flex-col sm:flex-row items-center gap-8 shadow-[0_24px_60px_rgba(69,51,139,0.35)]">
            <div className="absolute inset-0 hero-grid opacity-40 pointer-events-none" aria-hidden />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/founder.jpg" alt={t.instructorName} className="relative w-32 h-32 sm:w-44 sm:h-44 rounded-full object-cover object-top border-4 border-white/30 shadow-xl shrink-0" loading="lazy" />
            <div className="relative text-center sm:text-start">
              <p className="text-[#C7B9FF] text-sm font-semibold mb-1">{t.instructorTitle}</p>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold">{t.instructorName}</h3>
              <p className="text-[#D9E2F7] text-sm mt-1">{t.instructorRole}</p>
              <p className="text-white/85 leading-relaxed mt-3 max-w-xl">{t.instructorBio}</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* classroom gallery */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-10">
        <Reveal>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-8 text-center">{t.galleryTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/classroom-1.jpg" alt={t.galleryAlt} className="w-full aspect-[4/3] object-cover rounded-3xl shadow-lg" loading="lazy" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/classroom-2.jpg" alt={t.galleryAlt} className="w-full aspect-[4/3] object-cover rounded-3xl shadow-lg" loading="lazy" />
          </div>
        </Reveal>
      </section>

      {/* testimonials */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <Reveal>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-8 text-center">{t.testiTitle}</h2>
        </Reveal>
        <div
          dir="ltr"
          className="overflow-hidden"
          style={{ maskImage: "linear-gradient(to left, transparent, black 8%, black 92%, transparent)", WebkitMaskImage: "linear-gradient(to left, transparent, black 8%, black 92%, transparent)" }}
        >
          <div dir="ltr" className="flex w-max gap-4 sm:gap-6 animate-marquee hover:[animation-play-state:paused] active:[animation-play-state:paused]">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex gap-4 sm:gap-6" aria-hidden={copy === 1}>
                {reviewItems.map((r) => (
                  <figure key={copy + "-" + r.name} dir="rtl" className="w-[280px] sm:w-[320px] shrink-0 bg-white rounded-2xl border border-[#E5E8F0] p-5 sm:p-6 flex flex-col gap-3 shadow-sm">
                    <div className="flex text-sm tracking-widest" aria-hidden>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span key={i} className={i <= (r.rating ?? 5) ? "text-amber-400" : "text-[#D8DDE9]"}>★</span>
                      ))}
                    </div>
                    <blockquote className="text-sm text-[#3B4460] leading-relaxed flex-1">{r.text}</blockquote>
                    <figcaption className="flex items-center gap-3 pt-2 border-t border-[#EEF1FB]">
                      {r.img != null ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={`https://i.pravatar.cc/80?img=${r.img}`} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-za-primary/15" loading="lazy" />
                      ) : (
                        <span className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-za-primary to-za-accent text-white font-heading font-bold flex items-center justify-center ring-2 ring-za-primary/15">
                          {r.name.trim().charAt(0)}
                        </span>
                      )}
                      <div>
                        <p className="font-heading font-bold text-sm">{r.name}</p>
                        {r.role && <p className="text-xs text-[#8A93A8]">{r.role}</p>}
                      </div>
                    </figcaption>
                  </figure>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-10">
        <Reveal>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-3 text-center">{t.faqTitle}</h2>
          <p className="text-sm text-[#5A6378] text-center mb-8 max-w-md mx-auto leading-relaxed">{t.faqSub}</p>
        </Reveal>
        <div className="flex flex-col gap-3">
          {faqItems.map((f, i) => {
            const open = openFaq === i;
            return (
              <Reveal key={f.q} delay={i * 60}>
                <div className={`rounded-2xl border transition-colors duration-300 ${open ? "border-za-primary/30 bg-white shadow-[0_10px_34px_rgba(69,51,139,0.1)]" : "border-[#E5E8F0] bg-white hover:border-za-primary/20"}`}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? -1 : i)}
                    aria-expanded={open}
                    className="w-full flex items-center justify-between gap-3 text-start px-5 py-4"
                  >
                    <span className="font-heading font-bold text-sm sm:text-base">{f.q}</span>
                    <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${open ? "bg-gradient-to-br from-za-primary to-za-accent text-white rotate-45" : "bg-[#EEF1FB] text-za-primary"}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="w-3.5 h-3.5" aria-hidden>
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </button>
                  <div className="grid transition-[grid-template-rows] duration-300" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm text-[#5A6378] leading-relaxed">{f.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
        <Reveal>
          <div className="mt-6 text-center">
            <a
              href={waAsk}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold text-za-primary hover:text-za-secondary transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
                <path d={ICONS.chat} />
              </svg>
              {t.faqAsk}
            </a>
          </div>
        </Reveal>
      </section>

      {/* featured photo banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl min-h-[260px] sm:min-h-[320px] flex items-center shadow-[0_24px_60px_rgba(17,24,39,0.25)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80&auto=format&fit=crop"
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r rtl:bg-gradient-to-l from-za-navy/95 via-za-navy/75 to-za-primary/40" aria-hidden />
            <div className="relative p-8 sm:p-14 text-white max-w-xl flex flex-col items-start gap-4">
              <h2 className="font-heading text-2xl sm:text-4xl font-bold leading-snug">{t.bannerTitle}</h2>
              <p className="text-[#D9E2F7] leading-relaxed">{t.bannerText}</p>
              <Link
                href="/#courses"
                className="bg-white text-za-primary rounded-full px-8 py-3 text-sm font-bold hover:scale-105 hover:shadow-[0_10px_30px_rgba(255,255,255,0.35)] active:scale-100 transition-all duration-300"
              >
                {t.bannerCta}
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
