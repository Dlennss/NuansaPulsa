import Image from "next/image";
import { getYuscomFamilyVisual } from "@/lib/yuscom-family-visuals";

const badgeToneClass: Record<string, string> = {
  sky: "border-red-100 bg-[#fff6f4] text-[#d70717]",
  emerald: "border-red-100 bg-red-50 text-red-700",
  violet: "border-violet-100 bg-violet-50 text-violet-700",
  rose: "border-rose-100 bg-rose-50 text-rose-700",
  amber: "border-amber-100 bg-amber-50 text-amber-700",
  slate: "border-slate-200 bg-slate-50 text-slate-700",
};

type Props = {
  family: string;
  size?: number;
};

export function YuscomFamilyMark({ family, size = 56 }: Props) {
  const visual = getYuscomFamilyVisual(family);
  const normalizedFamily = family.trim().toUpperCase();
  const isSmartfren = normalizedFamily === "SMARTFREN";

  if (visual.kind === "image") {
    return (
      <div
        className={`grid shrink-0 place-items-center overflow-hidden rounded-2xl border border-red-100 bg-white shadow-sm ${
          isSmartfren ? "p-1.5" : "p-2"
        }`}
        style={{ width: size, height: size }}
        title={visual.alt}
      >
        <Image
          src={visual.src}
          alt={visual.alt}
          width={size - 12}
          height={size - 12}
          className={`h-full w-full object-contain ${isSmartfren ? "scale-110" : ""}`}
        />
      </div>
    );
  }

  return (
    <div
      className={`grid shrink-0 place-items-center overflow-hidden rounded-2xl border p-2 shadow-sm ${badgeToneClass[visual.tone]}`}
      style={{ width: size, height: size }}
      title={family}
    >
      <span className="text-center text-[11px] font-black uppercase leading-tight tracking-tight">
        {visual.label}
      </span>
    </div>
  );
}
