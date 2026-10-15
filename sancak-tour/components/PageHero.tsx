import type { SceneKind } from "@/lib/types";
import { Media } from "./Scene";

export function PageHero({ eyebrow, title, subtitle, scene = "sarajevo", image, children }: { eyebrow?: string; title: string; subtitle?: string; scene?: SceneKind; image?: string; children?: React.ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden bg-forest-900 pb-14 pt-[calc(var(--header-h)+56px)] text-ivory sm:pb-20 sm:pt-[calc(var(--header-h)+80px)]">
      <div className="absolute inset-0 -z-10 opacity-60"><Media kind={scene} src={image} alt="" className="h-full w-full" eager /></div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-forest-900/60 via-forest-900/55 to-forest-900/95" />
      <div className="container-x">
        {eyebrow && <p className="eyebrow !text-gold">{eyebrow}</p>}
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">{title}</h1>
        {subtitle && <p className="mt-5 max-w-2xl text-lg text-ivory/80">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}
