"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";

export default function ProfileView({
  name,
  email,
  role,
  createdAt,
  avatarUrl,
}: {
  name: string;
  email: string;
  role: string;
  createdAt: string;
  avatarUrl: string;
}) {
  const { lang, t } = useLang();
  const [fullName, setFullName] = useState(name);
  const [avatar, setAvatar] = useState(avatarUrl);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function saveName() {
    setBusy(true);
    setMsg("");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.from("profiles").update({ full_name: fullName }).eq("id", user.id);
      setMsg(error ? error.message : t.nameSaved);
    }
    setBusy(false);
  }

  async function uploadAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setMsg(t.uploadingPhoto);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const path = `${user.id}/avatar`;
      const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) {
        setMsg(upErr.message);
      } else {
        const { data } = supabase.storage.from("avatars").getPublicUrl(path);
        const url = `${data.publicUrl}?v=${Date.now()}`;
        await supabase.from("profiles").update({ avatar_url: url }).eq("id", user.id);
        setAvatar(url);
        setMsg(t.photoSaved);
      }
    }
    setBusy(false);
  }

  async function changePassword() {
    setBusy(true);
    setMsg("");
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/confirm?next=/profile`,
    });
    setMsg(error ? error.message : t.resetSent);
    setBusy(false);
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12 flex flex-col gap-6">
      <h1 className="font-heading text-2xl sm:text-3xl font-bold">{t.profileTitle}</h1>
      <div className="bg-white rounded-2xl border border-[#E5E8F0] p-6 flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <label className="relative cursor-pointer group shrink-0" title={t.changePhoto}>
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="" className="w-14 h-14 rounded-full object-cover ring-2 ring-za-primary/20" />
            ) : (
              <span className="w-14 h-14 rounded-full bg-gradient-to-br from-za-primary to-za-accent text-white font-heading font-bold text-xl flex items-center justify-center">
                {(name || email || "?").charAt(0).toUpperCase()}
              </span>
            )}
            <span className="absolute inset-0 rounded-full bg-black/45 text-white text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-center leading-tight px-1">
              {t.changePhoto}
            </span>
            <input type="file" accept="image/*" className="hidden" onChange={uploadAvatar} disabled={busy} />
          </label>
          <div>
            <p className="font-semibold">{name || email}</p>
            <p className="text-xs text-[#8A93A8]" dir="ltr">{email}</p>
            <p className="text-xs text-[#8A93A8]">
              {role === "admin" ? t.admin : ""} {createdAt ? `• ${t.memberSince} ${new Date(createdAt).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-GB", { year: "numeric", month: "long" })}` : ""}
            </p>
          </div>
        </div>
        <label className="flex flex-col gap-1 text-sm">
          {t.fullName}
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="border border-[#D8DDE9] rounded-xl px-4 py-2.5" />
        </label>
        <div className="flex gap-3 flex-wrap">
          <button onClick={saveName} disabled={busy || !fullName} className="bg-za-primary hover:bg-za-secondary transition text-white rounded-full px-5 py-2.5 text-sm font-semibold disabled:opacity-60">
            {t.save}
          </button>
          <button onClick={changePassword} disabled={busy} className="border border-[#D8DDE9] hover:bg-[#F8F9FD] transition rounded-full px-5 py-2.5 text-sm font-semibold disabled:opacity-60">
            {t.changePassword}
          </button>
        </div>
        {msg && <p className="text-sm text-[#5A6378]">{msg}</p>}
      </div>
    </div>
  );
}
