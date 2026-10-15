import { MessageCircle } from "lucide-react";

/** WhatsApp link. If the company has not configured a number yet, it falls back to the contact page. */
export function WaLink({ href, className = "btn-whatsapp", children, label, icon = true, iconSize = 18 }: { href: string; className?: string; children?: React.ReactNode; label?: string; icon?: boolean; iconSize?: number }) {
  const external = href.startsWith("http");
  return (
    <a href={href} className={className} aria-label={label} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {icon && <MessageCircle size={iconSize} aria-hidden />}
      {children}
    </a>
  );
}
