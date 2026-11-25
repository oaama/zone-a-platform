import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ZONE A Academy — منصة زون إيه التعليمية",
    short_name: "ZONE A",
    description: "كورسات برمجة وجرافيكس ولغات بجودة احترافية — اتعلم. ابني. اكبر.",
    lang: "ar",
    dir: "rtl",
    start_url: "/",
    display: "standalone",
    background_color: "#111827",
    theme_color: "#111827",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
