"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";

export type SocialLink = { id: string; platform: string; url: string; sort_order: number };

export const PLATFORMS = ["instagram", "tiktok", "facebook", "youtube", "x", "linkedin", "whatsapp", "telegram", "website"] as const;

export default function SocialLinksAdmin({ links }: { links: SocialLink[] }) {
  const { t } = useLang();
  const router = useRouter();
  const [platform, setPlatform] = useState<string>("instagram");
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function add() {
    if (!url.trim()) return;
    setBusy(true);
    setMsg("");
    const supabase = createClient();
    const { error } = await supabase.from("social_links").insert({
      platform,
      url: url.trim(),
      sort_order: links.length,
    });
    if (error) setMsg(error.message);
    else {
      setUrl("");
      setMsg(t.savedOk);
      router.refresh();
    }
    setBusy(false);
  }

  async function remove(id: string) {
    if (!confirm(t.confirmDelete)) return;
    const supabase = createClient();
    await supabase.from("social_links").delete().eq("id", id);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-heading text-lg font-bold">{t.socialTitle}</h2>
      <div className="bg-white rounded-2xl border border-[#E5E8F0] p-5 flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-sm">
            {t.socialPlatform}
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="border border-[#D8DDE9] rounded-xl px-4 py-2.5 bg-white capitalize"
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p} className="capitalize">{p}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm flex-1 min-w-52">
            {t.socialUrl}
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              dir="ltr"
              className="border border-[#D8DDE9] rounded-xl px-4 py-2.5"
            />
          </label>
          <button
            onClick={add}
            disabled={busy || !url.trim()}
            className="bg-za-primary hover:bg-za-secondary transition text-white rounded-xl px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
          >
            {busy ? t.saving : `+ ${t.addLink}`}
          </button>
          {msg && <p className="text-sm text-[#5A6378]">{msg}</p>}
        </div>

        <div className="flex flex-col gap-2">
          {links.map((l) => (
            <div key={l.id} className="flex items-center gap-3 border border-[#ECEFF6] rounded-xl px-4 py-2.5">
              <span className="text-xs font-bold text-za-secondary bg-[#EEF1FB] rounded-full px-3 py-1 capitalize">{l.platform}</span>
              <span className="flex-1 text-sm text-[#5A6378] truncate" dir="ltr">{l.url}</span>
              <button onClick={() => remove(l.id)} className="text-xs text-red-600 hover:underline">{t.delete}</button>
            </div>
          ))}
          {links.length === 0 && <p className="text-sm text-[#8A93A8]">{t.noSocialLinks}</p>}
        </div>
      </div>
    </div>
  );
}
