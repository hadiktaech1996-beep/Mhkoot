"use client";
import { useState } from "react";
import { MapPin } from "lucide-react";

/** Click-to-load map: no request is made to OpenStreetMap until the visitor asks for it (privacy + performance). */
export function MapEmbed({ lat, lng, title, loadLabel, privacy }: { lat: number; lng: number; title: string; loadLabel: string; privacy: string }) {
  const [on, setOn] = useState(false);
  const bbox = `${lng - 0.06},${lat - 0.035},${lng + 0.06},${lat + 0.035}`;
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-forest/10 ring-1 ring-forest/10">
      {on ? (
        <iframe title={title} loading="lazy" className="h-full w-full border-0" referrerPolicy="no-referrer"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`} />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_30%_30%,#dfe8cc,#c9d7b0)] p-6 text-center">
          <MapPin size={36} className="text-forest" aria-hidden />
          <button type="button" onClick={() => setOn(true)} className="btn-primary">{loadLabel}</button>
          <p className="max-w-xs text-xs text-forest/70">{privacy}</p>
        </div>
      )}
    </div>
  );
}
