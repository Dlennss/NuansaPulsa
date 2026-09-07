"use client";

import type { ReactNode } from "react";

type OverviewStatCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
  tone?: "sky" | "red" | "amber" | "violet";
};

function toneClass(tone: OverviewStatCardProps["tone"]): string {
  if (tone === "red") {
    return "border-red-200 border-l-[#d70717] bg-[linear-gradient(135deg,#ffffff_0%,#fff1ee_100%)]";
  }
  if (tone === "amber") {
    return "border-amber-200 border-l-[#65a30d] bg-[linear-gradient(135deg,#ffffff_0%,#f5ffe7_100%)]";
  }
  if (tone === "violet") {
    return "border-orange-200 border-l-[#0f766e] bg-[linear-gradient(135deg,#ffffff_0%,#ecfffb_100%)]";
  }
  return "border-cyan-200 border-l-[#0891b2] bg-[linear-gradient(135deg,#ffffff_0%,#effcff_100%)]";
}

function iconClass(tone: OverviewStatCardProps["tone"]): string {
  if (tone === "red") return "bg-[#fff1ee] text-[#b20717] ring-red-300";
  if (tone === "amber") return "bg-[#f5ffe7] text-[#3f6212] ring-amber-300";
  if (tone === "violet") return "bg-[#ecfffb] text-[#115e59] ring-orange-300";
  return "bg-[#effcff] text-[#155e75] ring-cyan-300";
}

export default function OverviewStatCard(props: OverviewStatCardProps) {
  const { title, value, subtitle, icon, tone = "sky" } = props;

  return (
    <div
      className={`rounded-[22px] border border-l-4 p-4 shadow-[0_14px_30px_rgba(151,14,32,0.08)] ${toneClass(tone)}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-black uppercase tracking-[0.12em] text-[#b20717]">{title}</div>
        {icon ? <div className={`grid h-10 w-10 place-items-center rounded-2xl ring-2 ${iconClass(tone)}`}>{icon}</div> : null}
      </div>
      <div className="mt-2 text-2xl font-black tracking-tight text-[#0f172a]">{value}</div>
      {subtitle ? <div className="mt-1 text-xs font-semibold text-[#475569]">{subtitle}</div> : null}
    </div>
  );
}
