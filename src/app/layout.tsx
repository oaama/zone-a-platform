import type { Metadata, Viewport } from "next";
import { Alexandria, Cairo, Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { createClient } from "@/lib/supabase/server";
import Splash from "@/components/Splash";

const alexandria = Alexandria({ subsets: ["arabic", "latin"], variable: "--font-alexandria" });
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const viewport: Viewport = {
  themeColor: "#111827",
};

const SITE_URL = "https://zone-a-platform.onrender.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ZONE A | منصة زون إيه التعليمية — كورسات برمجة وجرافيكس ولغات",
    template: "%s | ZONE A",
  },
  description:
    "أكاديمية زون إيه متخصصة في المجالات الرقمية: كورسات برمجة وجرافيكس ولغات بخطوات عملية تؤهلك لسوق الشغل الرقمي. ZONE A — digital-fields academy: programming, graphics and languages courses.",
  keywords: ["كورسات برمجة", "كورسات جرافيك", "كورسات لغات", "زون إيه", "ZONE A", "تعلم برمجة", "كورسات اونلاين"],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "ZONE A Academy",
    title: "ZONE A | منصة زون إيه التعليمية",
    description: "كورسات برمجة وجرافيكس ولغات بجودة احترافية — تعلم بخطوات عملية وواضحة.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ZONE A Academy" }],
    locale: "ar_EG",
    alternateLocale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZONE A | منصة زون إيه التعليمية",
    description: "كورسات برمجة وجرافيكس ولغات بجودة احترافية.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  let socialLinks: { id: string; platform: string; url: string }[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("social_links").select("id, platform, url").order("sort_order", { ascending: true });
    socialLinks = data ?? [];
  } catch {
    socialLinks = [];
  }
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var l=localStorage.getItem("za-lang");if(l==="en"){var d=document.documentElement;d.lang="en";d.dir="ltr";}}catch(e){}`,
          }}
        />
      </head>
      <body className={`${alexandria.variable} ${cairo.variable} ${inter.variable} font-[family-name:var(--font-body-ar)] antialiased min-h-screen flex flex-col`}>
        <LanguageProvider>
          <Splash />
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter socialLinks={socialLinks} />
        </LanguageProvider>
      </body>
    </html>
  );
}
