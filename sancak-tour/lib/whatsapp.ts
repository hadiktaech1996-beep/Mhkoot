export function waLink(number: string, text: string): string {
  const digits = (number || "").replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}` : "";
}

/** WhatsApp URL, or the localized contact page when no number is configured yet. */
export function waHref(number: string, text: string, lang: string): string {
  return waLink(number, text) || `/${lang}/contact`;
}
