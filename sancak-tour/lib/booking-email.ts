import "server-only";
import { getDict } from "./dict";
import { esc } from "./mail";
import { isLang, type Lang, LANG_META } from "./i18n/config";
import { fmtEUR } from "./pricing";
import type { Booking } from "./types";

export function bookingEmail(b: Booking, bankDetails: string) {
  const lang: Lang = isLang(b.lang) ? b.lang : "en";
  const d = getDict(lang);
  const dir = LANG_META[lang].dir;
  const pay = b.paymentMethod === "bank" ? `${d.email.bankNote}${bankDetails ? `\n${bankDetails}` : ""}` : b.paymentMethod === "arrival" ? d.email.arrivalNote : "";
  const rows: [string, string][] = [
    [d.common.ref, b.ref], [d.booking.tour, b.tourTitle], [d.booking.date, b.date],
    [d.common.adults, String(b.adults)], [d.common.children, String(b.children)],
    [d.booking.mode, b.mode === "private" ? d.booking.private : d.booking.group],
    ...b.extras.map((e) => [e.label, fmtEUR(e.total, lang)] as [string, string]),
    ...(b.discount ? [[d.booking.discount, `− ${fmtEUR(b.discount, lang)}`] as [string, string]] : []),
    [d.common.total, fmtEUR(b.total, lang)], [d.booking.status, d.status[b.status]],
  ];
  const html = `<div dir="${dir}" lang="${lang}" style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#17212B">
<h2 style="color:#213D32">${esc(d.email.subject)}</h2>
<p>${esc(d.email.hello)} ${esc(b.customer.name)},</p><p>${esc(d.email.intro)}</p>
<table style="width:100%;border-collapse:collapse">${rows.map(([k, v]) => `<tr><td style="padding:6px 0;color:#66727E">${esc(k)}</td><td style="padding:6px 0;font-weight:600">${esc(v)}</td></tr>`).join("")}</table>
<p>${esc(d.email.pending)}</p>${pay ? `<p style="white-space:pre-line">${esc(pay)}</p>` : ""}
<p style="color:#9C7F3E;font-size:13px">${esc(d.email.demoNote)}</p>
<p>${esc(d.email.regards)},<br>${esc(d.email.team)}</p></div>`;
  const text = [`${d.email.hello} ${b.customer.name},`, d.email.intro, ...rows.map(([k, v]) => `${k}: ${v}`), d.email.pending, pay, d.email.demoNote, d.email.regards, d.email.team].filter(Boolean).join("\n");
  return { subject: `${d.email.subject} · ${b.ref}`, html, text };
}
