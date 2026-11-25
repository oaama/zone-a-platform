"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";

export default function SiteHeader() {
  const { lang, t, toggle } = useLang();
  const [q, setQ] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user;
      setLoggedIn(!!u);
      if (u) {
        supabase
          .from("profiles")
          .select("role")
          .eq("id", u.id)
          .single()
          .then(({ data: p }) => setIsAdmin(p?.role === "admin"));
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setLoggedIn(!!session?.user));
    return () => {
      sub.subscription.unsubscribe();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const headerCls = scrolled
    ? "sticky top-0 z-50 text-white transition-all duration-300 bg-za-navy/95 backdrop-blur-md shadow-[0_4px_24px_rgba(17,24,39,0.35)] border-b border-za-accent/25"
    : "sticky top-0 z-50 text-white transition-all duration-300 bg-za-navy border-b border-za-accent/15";

  const links = [
    { href: "/", label: t.home },
    { href: "/#courses", label: t.browseCourses },
    { href: "/about", label: t.about },
    { href: "/contact", label: t.contact },
  ];

  const close = () => setMenuOpen(false);

  return (
    <header className={headerCls}>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-l from-za-secondary/45 via-za-primary/15 to-transparent" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center shrink-0">
          <Image src="/logo-wide.png" alt="ZONE A Academy" width={484} height={168} className="h-9 w-auto" priority />
        </Link>

        {/* desktop nav strip */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold" aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="relative py-1 hover:text-white text-[#C9D4F0] transition after:absolute after:bottom-0 after:start-0 after:h-0.5 after:w-0 after:rounded-full after:bg-gradient-to-l after:from-za-primary after:to-za-accent hover:after:w-full after:transition-all after:duration-300"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <form
          className="hidden lg:flex flex-1 max-w-xs relative"
          onSubmit={(e) => {
            e.preventDefault();
            const query = q.trim();
            location.href = query ? `/?q=${encodeURIComponent(query)}#courses` : "/#courses";
          }}
          role="search"
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full rounded-full bg-white/10 border border-white/15 px-4 py-2 ps-10 text-sm placeholder:text-[#8FA0C8] focus:outline-none focus:ring-2 focus:ring-za-accent/50 focus:bg-white/15 transition"
          />
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-[#8FA0C8]" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </form>

        <nav className="flex items-center gap-2 sm:gap-3 text-sm">
          {loggedIn && isAdmin && (
            <Link href="/admin" className="hover:text-[#A9B8E8] transition hidden sm:inline">{t.admin}</Link>
          )}
          {loggedIn && !isAdmin && (
            <Link href="/dashboard" className="hover:text-[#A9B8E8] transition hidden sm:inline">{t.dashboard}</Link>
          )}
          {loggedIn ? (
            <button
              onClick={async () => { await createClient().auth.signOut(); location.href = "/"; }}
              className="border border-[#343D5B] rounded-full px-3 py-1 text-xs hover:bg-[#1b2340] transition hidden sm:inline"
            >
              {t.logout}
            </button>
          ) : (
            <Link href="/login" className="hover:text-[#A9B8E8] transition hidden sm:inline">{t.login}</Link>
          )}
          <button
            onClick={toggle}
            className="border border-[#343D5B] rounded-full px-3 py-1 text-xs hover:bg-[#1b2340] transition"
            aria-label="Toggle language"
          >
            {lang === "ar" ? "EN" : "عربي"}
          </button>
          {/* hamburger (mobile) */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden w-9 h-9 rounded-full border border-[#343D5B] flex items-center justify-center hover:bg-[#1b2340] transition"
            aria-label={t.menu}
            aria-expanded={menuOpen}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4.5 h-4.5" aria-hidden>
              <path d="M4 7h16M4 12h16M4 17h10" />
            </svg>
          </button>
        </nav>
      </div>

      {/* mobile drawer */}
      <div
        className={`fixed inset-0 z-[60] md:hidden transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        role="dialog"
        aria-modal="true"
        aria-label={t.menu}
      >
        <div className="absolute inset-0 bg-za-navy/70 backdrop-blur-sm" onClick={close} aria-hidden />
        <div
          className={`absolute top-0 bottom-0 end-0 w-72 max-w-[85vw] bg-za-navy border-s border-za-accent/20 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${menuOpen ? "translate-x-0" : "rtl:translate-x-full ltr:-translate-x-full"}`}
        >
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute -top-16 -start-16 w-56 h-56 rounded-full bg-za-primary/30 blur-[90px]" />
            <div className="absolute inset-0 hero-grid opacity-50" />
          </div>
          <div className="relative flex items-center justify-between px-5 h-16 border-b border-white/10">
            <Image src="/logo-wide.png" alt="ZONE A Academy" width={484} height={168} className="h-8 w-auto" />
            <button
              onClick={close}
              className="w-9 h-9 rounded-full border border-[#343D5B] flex items-center justify-center hover:bg-[#1b2340] transition"
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <nav className="relative flex flex-col px-3 py-4 gap-1 text-[15px] font-semibold" aria-label="Main mobile">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={close}
                className="flex items-center justify-between rounded-xl px-4 py-3 hover:bg-white/10 transition"
              >
                {l.label}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#8FA0C8] rtl:rotate-0 ltr:rotate-180" aria-hidden>
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </Link>
            ))}
            {loggedIn && (
              <Link
                href={isAdmin ? "/admin" : "/dashboard"}
                onClick={close}
                className="flex items-center justify-between rounded-xl px-4 py-3 hover:bg-white/10 transition"
              >
                {isAdmin ? t.admin : t.dashboard}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#8FA0C8] rtl:rotate-0 ltr:rotate-180" aria-hidden>
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </Link>
            )}
          </nav>
          <div className="relative mt-auto px-5 pb-8 flex flex-col gap-3">
            {loggedIn ? (
              <button
                onClick={async () => { await createClient().auth.signOut(); location.href = "/"; }}
                className="w-full border border-[#343D5B] rounded-full px-4 py-2.5 text-sm font-bold hover:bg-[#1b2340] transition"
              >
                {t.logout}
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={close}
                  className="w-full text-center border border-[#343D5B] rounded-full px-4 py-2.5 text-sm font-bold hover:bg-[#1b2340] transition"
                >
                  {t.login}
                </Link>
                <Link
                  href="/signup"
                  onClick={close}
                  className="w-full text-center bg-gradient-to-l from-za-primary to-za-accent rounded-full px-4 py-2.5 text-sm font-bold hover:opacity-90 transition"
                >
                  {t.signup}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
