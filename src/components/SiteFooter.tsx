"use client";

import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/lib/i18n";

const WHATSAPP = "201202412997";

const SOCIAL_ICONS: Record<string, string> = {
  instagram: "M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zm5 6.2A2.8 2.8 0 1012 14.8 2.8 2.8 0 0012 9.2zM17 6.5v.1",
  tiktok: "M10 4v11.3a3.2 3.2 0 11-3.1-3.2M10 4c.5 3.6 2.7 6 6.4 6.3",
  facebook: "M14.5 8.5H17V5h-2.5A3.5 3.5 0 0011 8.5V11H8.5v3H11v7h3v-7h2.6l.9-3H14V9a.5.5 0 01.5-.5z",
  youtube: "M4.5 7h15A2.5 2.5 0 0122 9.5v5a2.5 2.5 0 01-2.5 2.5h-15A2.5 2.5 0 012 14.5v-5A2.5 2.5 0 014.5 7zm6 2.7v4.6l4.5-2.3z",
  x: "M5 4l14 16M19 4L5 20",
  linkedin: "M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1zm3 6.5V17M8 7.3v.1m4 9.7v-3.6a1.9 1.9 0 013.8 0V17",
  whatsapp: "M12 3.5a8.5 8.5 0 00-7.3 12.8L3.5 20.5l4.3-1.1A8.5 8.5 0 1012 3.5zm-2.7 5.2c.5 0 1.2 2 1.3 2.3.1.3-.4.7-.6 1-.2.4.5 1.4 1.3 2 .8.7 1.8 1.2 2.2 1 .4-.2.8-.9 1.1-.8.3 0 2.1 1 2.3 1.2.2.3-.4 1.7-1.6 1.8-1.6.2-4.3-1.2-5.6-3.3-1-1.6-1.4-3-.8-4 .3-.4 1-.2 1.4-.2z",
  telegram: "M20.5 4.5L3.8 11.2l4.6 1.7 1.8 5.6 2.8-3.9 4.6 3.4z",
  website: "M12 3a9 9 0 100 18 9 9 0 000-18zm-9 9h18M12 3c2.5 2.6 3.9 5.6 3.9 9s-1.4 6.4-3.9 9c-2.5-2.6-3.9-5.6-3.9-9S9.5 5.6 12 3z",
};

export default function SiteFooter({ socialLinks = [] }: { socialLinks?: { id: string; platform: string; url: string }[] }) {
  const { t, lang } = useLang();
  const year = new Date().getFullYear();
  return (
    <footer className="bg-za-navy text-[#A9B8E8] text-sm border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 py-12 grid grid-cols-2 gap-8 sm:gap-10 sm:grid-cols-3">
        <div className="flex flex-col gap-3 col-span-2 sm:col-span-1">
          <Image src="/logo-wide.png" alt="ZONE A Academy" width={484} height={168} className="h-11 w-auto self-start" style={{ width: "auto", height: "2.75rem" }} />
          <p className="leading-relaxed">{t.footer}</p>
          {socialLinks.length > 0 && (
            <div className="flex flex-col gap-2 mt-1">
              <span className="font-heading font-bold text-white text-xs">{t.followUs}</span>
              <div className="flex items-center gap-2 flex-wrap">
                {socialLinks.map((l) => (
                  <a
                    key={l.id}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={l.platform}
                    title={l.platform}
                    className="w-9 h-9 rounded-full bg-white/8 border border-white/12 hover:bg-za-primary hover:border-za-primary hover:scale-110 flex items-center justify-center transition-all duration-300"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5 text-white w-[18px] h-[18px]" aria-hidden>
                      <path d={SOCIAL_ICONS[l.platform] ?? SOCIAL_ICONS.website} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <span className="font-heading font-bold text-white">{lang === "ar" ? "لينكات سريعة" : "Quick links"}</span>
          <nav className="flex flex-col gap-2">
            <Link href="/#courses" className="hover:text-white transition w-fit">{t.browseCourses}</Link>
            <Link href="/about" className="hover:text-white transition w-fit">{t.about}</Link>
            <Link href="/contact" className="hover:text-white transition w-fit">{t.contact}</Link>
            <Link href="/dashboard" className="hover:text-white transition w-fit">{t.dashboard}</Link>
          </nav>
        </div>
        <div className="flex flex-col gap-3">
          <span className="font-heading font-bold text-white">{t.contact}</span>
          <p className="leading-relaxed">{t.whatsappNote}</p>
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit bg-[#25D366] hover:bg-[#1eb856] hover:scale-[1.03] active:scale-100 transition text-white rounded-full px-5 py-2.5 text-sm font-bold flex items-center gap-2"
          >
            {t.whatsappUs}
          </a>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 text-center text-xs text-[#7C89B0]">
          © {year} ZONE A ACADEMY
        </div>
      </div>
    </footer>
  );
}
