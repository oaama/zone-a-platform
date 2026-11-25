// ZONE A transactional email edge function.
// Provider seam: EMAIL_PROVIDER=brevo (default, free tier, no domain needed)
// or resend (once a custom domain exists). Swap by changing the secret.
//
// Expected POST body (from DB webhooks):
//   { "type": "enrollment_active" | "quiz_result" | "certificate_issued",
//     "to": "student@email", "name": "Student Name",
//     "course": "Course title", "score": 85, "certificate_url": "https://..." }

const PROVIDER = Deno.env.get("EMAIL_PROVIDER") ?? "brevo";
const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY") ?? "";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") ?? "q90xs1@mail.instinct.com";
const FROM_NAME = "ZONE A Academy";
const REPLY_TO = Deno.env.get("REPLY_TO") ?? "angluosr@gmail.com";
const SITE = Deno.env.get("SITE_URL") ?? "https://zone-a-platform.onrender.com";

function render(type: string, d: Record<string, unknown>) {
  const name = String(d.name ?? "يا بطل");
  const course = String(d.course ?? "");
  if (type === "enrollment_active")
    return {
      subject: `تم تفعيل اشتراكك في ${course} 🎓`.replace(" 🎓", ""),
      html: `<div dir="rtl" style="font-family:sans-serif"><h2>مبروك يا ${name}!</h2><p>اشتراكك في كورس <b>${course}</b> اتفعل. تقدر تبدأ دلوقتي:</p><p><a href="${SITE}/dashboard" style="background:#45338B;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">افتح لوحة التحكم</a></p></div>`,
    };
  if (type === "quiz_result")
    return {
      subject: `نتيجة الاختبار في ${course}`,
      html: `<div dir="rtl" style="font-family:sans-serif"><h2>يا ${name}</h2><p>نتيجتك في اختبار <b>${course}</b>: <b>${d.score}%</b></p></div>`,
    };
  return {
    subject: `شهادتك من ZONE A جاهزة!`,
    html: `<div dir="rtl" style="font-family:sans-serif"><h2>مبروك يا ${name}! 🎉</h2><p>خلصت كورس <b>${course}</b> وشهادتك جاهزة:</p><p><a href="${d.certificate_url ?? SITE + "/dashboard"}">حمّل الشهادة</a></p></div>`,
  };
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("method", { status: 405 });
  const body = await req.json();
  const msg = render(body.type, body);
  const payload = {
    sender: { email: FROM_EMAIL, name: FROM_NAME },
    to: [{ email: body.to, name: body.name }],
    replyTo: { email: REPLY_TO },
    subject: msg.subject,
    htmlContent: msg.html,
  };
  let res: Response;
  if (PROVIDER === "resend") {
    res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: `${FROM_NAME} <${FROM_EMAIL}>`, to: [body.to], reply_to: REPLY_TO, subject: msg.subject, html: msg.html }),
    });
  } else {
    res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }
  const text = await res.text();
  return new Response(JSON.stringify({ ok: res.ok, status: res.status, provider: PROVIDER, detail: text }), {
    status: res.ok ? 200 : 502,
    headers: { "Content-Type": "application/json" },
  });
});
