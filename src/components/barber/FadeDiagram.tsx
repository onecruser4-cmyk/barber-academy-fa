"use client";

import { FadeType } from "@/data/types";

/**
 * Stylized side-profile diagram showing where each fade starts.
 * RTL-aware: face points left, back of head on the right.
 */

const fadeLabels: Record<FadeType, { title: string; start: number; band: number; note: string }> = {
  low:   { title: "لو فید",    start: 0.62, band: 0.16, note: "شروع: یک انگشت بالای گوش" },
  mid:   { title: "مید فید",   start: 0.48, band: 0.2,  note: "شروع: وسط گوش (موازی با حالت لب)" },
  high:  { title: "های فید",   start: 0.30, band: 0.24, note: "شروع: برجستگی پس‌سر / بالای گوش" },
  skin:  { title: "اسکین فید", start: 0.42, band: 0.2,  note: "پایین‌ترین نقطه: پوست واقعی" },
  taper: { title: "تیپر فید",  start: 0.72, band: 0.12, note: "فقط پشت گوش و خط گردن" },
  burst: { title: "برست فید",  start: 0.55, band: 0.22, note: "قوس هلالی دور گوش" },
  drop:  { title: "دراپ فید",  start: 0.5,  band: 0.22, note: "پشت سر افتاده به پایین" },
};

export default function FadeDiagram({ type }: { type: FadeType }) {
  const info = fadeLabels[type];

  // head occupies x: 30..170, y: 20..180
  // fade zone drawn from bottom (y=180) up to start height
  const topY = 180 - info.start * 155;
  const bandTopY = topY + info.band * 155;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-5 rounded-xl border border-gold-500/25 bg-gradient-to-b from-panel to-[#100d0b] p-5">
      <svg viewBox="0 0 200 200" className="w-40 h-40 shrink-0" role="img" aria-label={`نمودار ${info.title}`}>
        <defs>
          <linearGradient id="fadeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4a24e" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#d4a24e" stopOpacity="0.55" />
          </linearGradient>
          <clipPath id="headClip">
            <path d="M100 18 C 145 18 172 48 172 92 C 172 118 165 132 158 144 L 158 162 L 100 162 Z" />
          </clipPath>
        </defs>

        {/* skull base shape */}
        <path
          d="M100 18 C 145 18 172 48 172 92 C 172 118 165 132 158 144 L 158 162 L 100 162 Z"
          fill="#1d1712"
          stroke="#d4a24e"
          strokeWidth="2.5"
        />
        {/* ear */}
        <ellipse cx="118" cy="95" rx="9" ry="14" fill="#0c0a09" stroke="#d4a24e" strokeWidth="1.8" />
        {/* neck */}
        <path d="M132 158 L 132 185 L 178 185 L 178 150" fill="none" stroke="#d4a24e" strokeWidth="1.5" strokeDasharray="3 3" />

        {/* fade gradient zone (clipped to head) */}
        <g clipPath="url(#headClip)">
          <rect x="30" y={topY} width="160" height={185 - topY} fill="url(#fadeGrad)" />
          <rect x="30" y={topY} width="160" height="2.5" fill="#d4a24e" />
          <rect x="30" y={bandTopY} width="160" height="1.5" fill="#d4a24e" strokeDasharray="4 4" opacity="0.5" />
        </g>

        {/* labels */}
        <text x="98" y={topY - 8} fontSize="11" fill="#e3c27a" textAnchor="middle" fontFamily="inherit">
          شروع فید
        </text>
      </svg>

      <div className="text-center sm:text-right">
        <div className="text-lg font-bold text-gold-400 mb-1">{info.title}</div>
        <div className="text-sm text-foreground/80 leading-relaxed">{info.note}</div>
        <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300">
            ناحیه پررنگ = محدوده فید
          </span>
        </div>
      </div>
    </div>
  );
}
