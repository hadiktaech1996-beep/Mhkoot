import { useId } from "react";
import type { SceneKind } from "@/lib/types";

/**
 * Original illustrated landscapes used as stand-ins until licensed photography is uploaded
 * (admin → set an image URL on any tour, stay, article or the hero). No third-party imagery is used.
 */

const rnd = (seed: number) => {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
};

function ridge(seed: number, y: number, amp: number, freq = 180, bottom = 720) {
  const r = rnd(seed);
  const ph = [r() * 6, r() * 6, r() * 6];
  const pts: [number, number][] = [];
  for (let x = -40; x <= 1240; x += 40) {
    const v = Math.sin(x / freq + ph[0]) * 0.55 + Math.sin(x / (freq * 0.43) + ph[1]) * 0.3 + Math.sin(x / (freq * 0.19) + ph[2]) * 0.15;
    pts.push([x, y - v * amp]);
  }
  let d = `M${pts[0][0]},${bottom} L${pts[0][0]},${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1];
    const [x, yy] = pts[i];
    d += ` Q${px},${py.toFixed(1)} ${((px + x) / 2).toFixed(1)},${((py + yy) / 2).toFixed(1)}`;
  }
  d += ` L1240,${bottom} Z`;
  return d;
}

interface Pal { sky: [string, string]; sun?: string; far: string; mid: string; near: string; ground: string; accent: string }
const PAL: Record<SceneKind, Pal> = {
  sarajevo: { sky: ["#f2c98b", "#fbeed4"], sun: "#fff3d6", far: "#9fb3b0", mid: "#6f8d7d", near: "#3d6354", ground: "#213d32", accent: "#b5523b" },
  mostar: { sky: ["#8dc3dc", "#f6ecd2"], sun: "#fff7dc", far: "#a7b9a8", mid: "#7b987f", near: "#4c7a62", ground: "#213d32", accent: "#d6b977" },
  kravice: { sky: ["#b6e0cf", "#eef7e4"], sun: "#ffffff", far: "#7fae8d", mid: "#4f8a68", near: "#2f6a4d", ground: "#1d4a37", accent: "#e9f6f3" },
  blagaj: { sky: ["#f6c9a0", "#fdf0da"], sun: "#fff1cf", far: "#b8a48b", mid: "#8a7761", near: "#5d6a4c", ground: "#2d4a3a", accent: "#c8553d" },
  travnik: { sky: ["#bcd7e6", "#f4f1e3"], sun: "#ffffff", far: "#9db3b4", mid: "#74937c", near: "#4a7358", ground: "#27473a", accent: "#d9d2bd" },
  jajce: { sky: ["#c9dfe6", "#f5f0df"], sun: "#ffffff", far: "#a0b6b3", mid: "#7a9a82", near: "#4e7a5e", ground: "#244235", accent: "#ffffff" },
  una: { sky: ["#a9dccb", "#e9f6e2"], sun: "#ffffff", far: "#6fa88a", mid: "#3f8466", near: "#256148", ground: "#16402f", accent: "#7fd0c1" },
  mountain: { sky: ["#9cc2dc", "#eaf2f1"], sun: "#ffffff", far: "#a9bccb", mid: "#7e98a3", near: "#476b5b", ground: "#213d32", accent: "#ffffff" },
  coast: { sky: ["#f6b48c", "#fde9c8"], sun: "#fff4d1", far: "#a8c3d3", mid: "#5a9db8", near: "#2f7b9a", ground: "#215f7c", accent: "#e1c9a0" },
  night: { sky: ["#0c1914", "#2a4a3f"], sun: "#f4e3b2", far: "#1d3a2f", mid: "#17302a", near: "#10241f", ground: "#0a1814", accent: "#d6b977" },
  road: { sky: ["#f0c08a", "#fbeed6"], sun: "#fff3d6", far: "#a7b69a", mid: "#7c9a74", near: "#4b7656", ground: "#2a4d3c", accent: "#d6b977" },
};

function Trees({ seed, y, n, c, size = 1 }: { seed: number; y: number; n: number; c: string; size?: number }) {
  const r = rnd(seed);
  return (
    <g fill={c}>
      {Array.from({ length: n }).map((_, i) => {
        const x = r() * 1200;
        const h = (28 + r() * 30) * size;
        const w = h * 0.45;
        return <path key={i} d={`M${x},${y} l${-w},0 l${w * 0.35},${-h * 0.45} l${-w * 0.3},0 l${w * 0.95},${-h * 0.75} l${w * 0.95},${h * 0.75} l${-w * 0.3},0 l${w * 0.35},${h * 0.45} z`} />;
      })}
    </g>
  );
}

function Minaret({ x, y, h, c }: { x: number; y: number; h: number; c: string }) {
  return (
    <g fill={c}>
      <rect x={x - 5} y={y - h} width="10" height={h} />
      <rect x={x - 8} y={y - h * 0.62} width="16" height="5" />
      <path d={`M${x - 6},${y - h} L${x},${y - h - 34} L${x + 6},${y - h} Z`} />
    </g>
  );
}

function Houses({ seed, y, x0, x1, c, roof }: { seed: number; y: number; x0: number; x1: number; c: string; roof: string }) {
  const r = rnd(seed);
  const items: React.ReactNode[] = [];
  for (let x = x0, i = 0; x < x1; x += 14 + r() * 18, i++) {
    const w = 18 + r() * 22, h = 14 + r() * 20, yy = y - r() * 36;
    items.push(<g key={i}><rect x={x} y={yy - h} width={w} height={h} fill={c} /><path d={`M${x - 2},${yy - h} L${x + w / 2},${yy - h - 11} L${x + w + 2},${yy - h} Z`} fill={roof} /></g>);
  }
  return <g>{items}</g>;
}

function Motif({ kind, p }: { kind: SceneKind; p: Pal }) {
  switch (kind) {
    case "sarajevo":
      return (
        <g>
          <path d={ridge(11, 470, 40, 160)} fill={p.mid} />
          <Houses seed={4} y={560} x0={60} x1={1160} c="#efe3cf" roof={p.accent} />
          <Minaret x={430} y={500} h={120} c="#f4ead8" />
          <Minaret x={800} y={520} h={100} c="#f4ead8" />
          <path d={ridge(21, 640, 30, 220)} fill={p.near} />
          <Trees seed={5} y={700} n={22} c={p.ground} />
        </g>
      );
    case "mostar":
      return (
        <g>
          <path d={ridge(7, 470, 55, 200)} fill={p.mid} />
          <rect x="0" y="560" width="1200" height="160" fill="#3d8f9b" />
          <g stroke="#ffffff" strokeOpacity=".25" strokeWidth="2">{[590, 610, 635, 660, 685].map((y) => <line key={y} x1="120" x2="1080" y1={y} y2={y} strokeDasharray="30 40" />)}</g>
          <path d="M270,590 L270,520 L330,520 L330,500 L860,500 L860,520 L930,520 L930,590 Z" fill="#cdbf9f" />
          <path d="M330,520 Q600,360 860,520 L860,545 Q600,395 330,545 Z" fill="#e6dcc0" />
          <path d="M330,545 Q600,395 860,545 L860,590 L330,590 Z" fill="#d8caa8" />
          <path d="M360,590 Q600,420 830,590" fill="#3d8f9b" />
          <rect x="250" y="440" width="70" height="150" fill="#d2c5a6" /><path d="M244,440 L285,395 L326,440Z" fill="#8f7b5c" />
          <rect x="880" y="450" width="60" height="140" fill="#d2c5a6" /><path d="M874,450 L910,410 L946,450Z" fill="#8f7b5c" />
          <Trees seed={9} y={720} n={18} c={p.ground} size={1.4} />
        </g>
      );
    case "kravice":
      return (
        <g>
          <path d={ridge(3, 430, 40, 200)} fill={p.mid} />
          <Trees seed={2} y={470} n={40} c={p.near} />
          <g>
            {Array.from({ length: 26 }).map((_, i) => {
              const t = i / 25;
              const x = 250 + t * 700;
              const top = 400 + Math.sin(t * Math.PI) * -30 + (i % 3) * 6;
              return <rect key={i} x={x} y={top} width={15 + (i % 4) * 2} height={190 - (i % 5) * 8} rx="7" fill="#ffffff" opacity={0.78 + (i % 3) * 0.07} />;
            })}
          </g>
          <ellipse cx="600" cy="620" rx="470" ry="70" fill="#6fcab9" />
          <ellipse cx="600" cy="610" rx="400" ry="46" fill="#9fe3d3" opacity=".7" />
          <Trees seed={8} y={720} n={20} c={p.ground} size={1.5} />
        </g>
      );
    case "blagaj":
      return (
        <g>
          <path d="M0,720 L0,90 L180,120 L330,70 L520,150 L610,420 L560,720 Z" fill="#a8927a" />
          <path d="M330,70 L520,150 L610,420 L560,720 L470,720 L440,300 Z" fill="#8b775f" />
          <path d={ridge(6, 560, 28, 240)} fill={p.near} />
          <rect x="640" y="560" width="520" height="160" fill="#4ea7a3" />
          <g><rect x="700" y="470" width="150" height="90" fill="#efe4ce" /><path d="M690,470 L775,425 L860,470 Z" fill={p.accent} /><rect x="740" y="505" width="26" height="55" fill="#6b5a45" /><rect x="800" y="500" width="22" height="22" fill="#6b5a45" /></g>
          <Trees seed={12} y={620} n={16} c={p.ground} size={1.3} />
        </g>
      );
    case "travnik":
      return (
        <g>
          <path d={ridge(14, 520, 70, 260)} fill={p.mid} />
          <g fill="#e1d9c4">
            <rect x="420" y="300" width="360" height="110" /><rect x="400" y="260" width="60" height="150" /><rect x="740" y="260" width="60" height="150" /><rect x="560" y="240" width="80" height="170" />
          </g>
          <g fill="#8e7f64"><path d="M392,260 L430,205 L468,260Z" /><path d="M732,260 L770,205 L808,260Z" /><path d="M552,240 L600,175 L648,240Z" /></g>
          <g fill="#6b5e48">{[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <rect key={i} x={430 + i * 42} y="296" width="18" height="14" />)}</g>
          <path d="M300,420 Q600,360 900,420 L1000,720 L200,720 Z" fill={p.near} />
          <Houses seed={22} y={640} x0={170} x1={1030} c="#f1e8d4" roof={p.accent === "#d9d2bd" ? "#b5523b" : p.accent} />
          <Trees seed={3} y={720} n={22} c={p.ground} />
        </g>
      );
    case "jajce":
      return (
        <g>
          <path d={ridge(17, 440, 50, 210)} fill={p.mid} />
          <path d="M120,720 L200,330 Q400,250 600,300 Q820,250 1000,340 L1100,720 Z" fill="#8c9b84" />
          <Houses seed={31} y={470} x0={190} x1={1000} c="#efe5d0" roof="#b5523b" />
          <rect x="560" y="380" width="64" height="230" rx="10" fill="#ffffff" opacity=".92" />
          <rect x="548" y="600" width="88" height="40" rx="20" fill="#ffffff" opacity=".7" />
          <rect x="0" y="620" width="1200" height="100" fill="#59b3b0" />
          <Trees seed={19} y={650} n={26} c={p.near} size={1.3} />
        </g>
      );
    case "una":
      return (
        <g>
          <path d={ridge(5, 430, 45, 190)} fill={p.mid} />
          <Trees seed={7} y={500} n={34} c={p.near} size={1.4} />
          <path d="M0,560 Q300,520 600,560 T1200,540 L1200,720 L0,720 Z" fill="#5cc4b4" />
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}><rect x={110 + i * 220} y={575 + (i % 2) * 20} width={150} height={9} rx="4" fill="#ffffff" opacity=".85" /><rect x={130 + i * 220} y={600 + (i % 2) * 14} width={110} height={7} rx="3" fill="#ffffff" opacity=".6" /></g>
          ))}
          <Trees seed={13} y={720} n={20} c={p.ground} size={1.6} />
        </g>
      );
    case "mountain":
      return (
        <g>
          <path d="M-20,500 L220,210 L330,320 L470,140 L650,380 L790,240 L1000,420 L1220,260 L1220,720 L-20,720 Z" fill={p.far} />
          <path d="M470,140 L430,215 L470,200 L510,235 L560,215 Z M220,210 L185,260 L225,248 L260,272 Z M790,240 L755,290 L795,278 L830,300 Z" fill="#ffffff" />
          <path d={ridge(9, 560, 45, 230)} fill={p.mid} />
          <Trees seed={2} y={640} n={44} c={p.near} size={1.2} />
          <path d={ridge(33, 690, 20, 300)} fill={p.ground} />
        </g>
      );
    case "coast":
      return (
        <g>
          <path d={ridge(15, 470, 50, 220)} fill="#8aa89f" />
          <rect x="0" y="470" width="1200" height="250" fill={p.mid} />
          <g stroke="#ffffff" strokeOpacity=".4" strokeWidth="2">{[520, 560, 600, 650].map((y) => <line key={y} x1="60" x2="1140" y1={y} y2={y} strokeDasharray="60 60" />)}</g>
          <g fill="#e8d6b2">
            <rect x="620" y="360" width="400" height="115" /><rect x="600" y="320" width="50" height="155" /><rect x="990" y="330" width="50" height="145" /><rect x="780" y="300" width="70" height="175" />
          </g>
          <g fill="#c77a52"><path d="M590,320 L625,280 L660,320Z" /><path d="M980,330 L1015,292 L1050,330Z" /><path d="M770,300 L815,245 L860,300Z" /></g>
          <g fill="#d3bd93">{Array.from({ length: 12 }).map((_, i) => <rect key={i} x={625 + i * 33} y="354" width="16" height="12" />)}</g>
          <g><path d="M220,600 L330,600 L310,625 L240,625Z" fill="#f6f1e3" /><path d="M275,520 L275,598 L325,598Z" fill="#ffffff" /></g>
        </g>
      );
    case "night":
      return (
        <g>
          {Array.from({ length: 60 }).map((_, i) => { const r = rnd(i + 3); return <circle key={i} cx={r() * 1200} cy={r() * 360} r={r() * 1.6 + 0.4} fill="#fff" opacity={0.35 + r() * 0.5} />; })}
          <path d={ridge(4, 520, 60, 220)} fill={p.mid} />
          <g>{Array.from({ length: 70 }).map((_, i) => { const r = rnd(i + 90); return <rect key={i} x={40 + r() * 1100} y={520 + r() * 110} width="5" height="5" fill={p.accent} opacity={0.5 + r() * 0.5} />; })}</g>
          <path d="M0,640 L1200,640 L1200,720 L0,720Z" fill="#050d0a" />
          <g fill="#0e211b" stroke={p.accent} strokeOpacity=".55" strokeWidth="1.5"><path d="M330,640 L360,602 Q420,586 520,586 Q620,586 680,602 L720,614 L760,626 L760,642 L330,642Z" /><circle cx="420" cy="646" r="22" /><circle cx="670" cy="646" r="22" /></g>
          <g fill={p.accent}><circle cx="420" cy="646" r="9" /><circle cx="670" cy="646" r="9" /><rect x="748" y="618" width="14" height="8" opacity=".9" /></g>
        </g>
      );
    case "road":
      return (
        <g>
          <path d={ridge(8, 470, 60, 250)} fill={p.mid} />
          <path d={ridge(18, 560, 40, 200)} fill={p.near} />
          <path d="M520,720 Q700,640 640,590 Q580,545 650,500 Q690,470 660,450 L672,450 Q706,474 668,506 Q604,552 660,590 Q740,646 700,720 Z" fill="#41505a" />
          <path d="M600,720 Q660,650 625,595 Q590,548 655,500" fill="none" stroke={p.accent} strokeWidth="3" strokeDasharray="14 14" />
          <Trees seed={6} y={720} n={26} c={p.ground} size={1.5} />
        </g>
      );
  }
}

export function Scene({ kind, className = "", animate = false, label }: { kind: SceneKind; className?: string; animate?: boolean; label?: string }) {
  const id = useId().replace(/:/g, "");
  const p = PAL[kind] || PAL.sarajevo;
  const sunX = kind === "night" ? 920 : 250 + ((kind.length * 97) % 700);
  return (
    <svg viewBox="0 0 1200 720" preserveAspectRatio="xMidYMid slice" className={`${className} ${animate ? "animate-drift" : ""}`} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} focusable="false">
      <defs>
        <linearGradient id={`s${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={p.sky[0]} /><stop offset="1" stopColor={p.sky[1]} /></linearGradient>
        <radialGradient id={`g${id}`}><stop offset="0" stopColor={p.sun} stopOpacity=".95" /><stop offset="1" stopColor={p.sun} stopOpacity="0" /></radialGradient>
        <linearGradient id={`v${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset=".6" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".28" /></linearGradient>
      </defs>
      <rect width="1200" height="720" fill={`url(#s${id})`} />
      <circle cx={sunX} cy={kind === "night" ? 150 : 190} r="190" fill={`url(#g${id})`} />
      <circle cx={sunX} cy={kind === "night" ? 150 : 190} r={kind === "night" ? 38 : 46} fill={p.sun} opacity={kind === "night" ? 0.95 : 0.9} />
      <path d={ridge(40 + kind.length, 400, 70, 260)} fill={p.far} opacity=".75" />
      <Motif kind={kind} p={p} />
      <rect width="1200" height="720" fill={`url(#v${id})`} />
    </svg>
  );
}

/** Photo if an image URL has been uploaded in the admin, otherwise the illustrated scene. */
export function Media({ kind, src, alt, className = "", animate, eager }: { kind: SceneKind; src?: string; alt: string; className?: string; animate?: boolean; eager?: boolean }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={`${className} object-cover`} loading={eager ? "eager" : "lazy"} decoding="async" />;
  }
  return <Scene kind={kind} className={className} animate={animate} label={alt} />;
}
