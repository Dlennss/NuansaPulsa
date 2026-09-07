type BrandLogoProps = {
  variant?: "light" | "dark";
};

export function BrandLogo({ variant = "light" }: BrandLogoProps) {
  const isDark = variant === "dark";
  return (
    <div
      className={`inline-flex items-center justify-center gap-2 rounded-2xl ${
        isDark
          ? "bg-white px-3.5 py-2.5 shadow-[0_14px_30px_rgba(0,0,0,0.20)] ring-1 ring-white/70"
          : "px-1 py-1"
      }`}
      aria-label="NuansaPulsa"
    >
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#ff1f18_0%,#e50917_55%,#a90418_100%)] text-sm font-black italic text-white shadow-[0_8px_18px_rgba(229,9,23,0.25)]">
        N
      </span>
      <span className="min-w-0 whitespace-nowrap text-[22px] font-black italic leading-none tracking-normal">
        <span className="text-[#e50917]">Nuansa</span>
        <span className="text-[#ffc400]">Pulsa</span>
      </span>
    </div>
  );
}

