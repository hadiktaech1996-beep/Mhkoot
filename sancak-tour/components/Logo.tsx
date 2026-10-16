export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <rect x="9" y="5" width="2.6" height="38" rx="1.3" fill="#D6B977" />
      <path d="M12 7 H40 L33 15.5 L40 24 H12 Z" fill="#A8B75A" />
      <path d="M16 21 Q26 8 36 21" stroke="#213D32" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <circle cx="26" cy="11.5" r="1.6" fill="#F8F6EF" />
      <path d="M4 43 H44" stroke="#D6B977" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean; name?: string }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark className="h-10 w-10 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[1.45rem] font-bold uppercase tracking-[0.12em] ${light ? "text-white" : "text-forest"}`} dir="ltr">
          SANCAK
        </span>
        <span className={`mt-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.5em] ${light ? "text-gold" : "text-olive-700"}`} dir="ltr">
          TOURS
        </span>
      </span>
    </span>
  );
}
