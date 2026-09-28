"use client";

import * as React from "react";

type QuickProductOptionItem = {
  id: number;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
};

type QuickProductOptionGridProps = {
  items: QuickProductOptionItem[];
  selectedId?: number | null;
  onSelect: (id: number) => void;
  columns?: 1 | 2;
  variant?: "default" | "pulsa";
  brandName?: string;
};

type ProductCardTheme = {
  idle: string;
  selected: string;
  shadow: string;
  selectedShadow: string;
  accent: string;
};

const DEFAULT_THEME: ProductCardTheme = {
  idle: "from-[#ef1b18] via-[#f54816] to-[#ff8a00]",
  selected: "from-[#d70717] via-[#ef1b18] to-[#ff6a00]",
  shadow: "shadow-[0_14px_30px_rgba(215,7,23,0.18)]",
  selectedShadow: "shadow-[0_18px_36px_rgba(215,7,23,0.26)]",
  accent: "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.24),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.13),rgba(255,255,255,0.03))]",
};

function productCardTheme(brandName?: string): ProductCardTheme {
  const brand = String(brandName || "").trim().toLowerCase();
  if (brand.includes("indosat") || brand.includes("im3") || brand.includes("mentari")) {
    return {
      idle: "from-[#f6c400] via-[#ff8a00] to-[#ec5a00]",
      selected: "from-[#f5b700] via-[#ff7a00] to-[#d84315]",
      shadow: "shadow-[0_14px_30px_rgba(255,138,0,0.20)]",
      selectedShadow: "shadow-[0_18px_36px_rgba(255,122,0,0.28)]",
      accent: "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.28),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.16),rgba(255,255,255,0.03))]",
    };
  }
  if (brand.includes("telkomsel") || brand.includes("simpati") || brand.includes("halo")) {
    return {
      idle: "from-[#e50914] via-[#f42516] to-[#ff6a00]",
      selected: "from-[#b20717] via-[#e50914] to-[#ff4d00]",
      shadow: "shadow-[0_14px_30px_rgba(229,9,20,0.18)]",
      selectedShadow: "shadow-[0_18px_36px_rgba(229,9,20,0.27)]",
      accent: DEFAULT_THEME.accent,
    };
  }
  if (brand.includes("axis")) {
    return {
      idle: "from-[#6f1ab6] via-[#8a2be2] to-[#ff2f92]",
      selected: "from-[#4b148c] via-[#7b1fd1] to-[#e71d73]",
      shadow: "shadow-[0_14px_30px_rgba(111,26,182,0.20)]",
      selectedShadow: "shadow-[0_18px_36px_rgba(111,26,182,0.30)]",
      accent: "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.25),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02))]",
    };
  }
  if (brand === "xl" || brand.includes("xl axiata")) {
    return {
      idle: "from-[#0057b8] via-[#0b75d1] to-[#00a6d6]",
      selected: "from-[#00459a] via-[#006ed0] to-[#009dc5]",
      shadow: "shadow-[0_14px_30px_rgba(0,87,184,0.19)]",
      selectedShadow: "shadow-[0_18px_36px_rgba(0,87,184,0.29)]",
      accent: "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.24),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.03))]",
    };
  }
  if (brand.includes("tri") || brand === "3") {
    return {
      idle: "from-[#21145f] via-[#5c2d91] to-[#ec008c]",
      selected: "from-[#160b45] via-[#472083] to-[#d1007f]",
      shadow: "shadow-[0_14px_30px_rgba(92,45,145,0.20)]",
      selectedShadow: "shadow-[0_18px_36px_rgba(92,45,145,0.30)]",
      accent: "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.25),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.03))]",
    };
  }
  if (brand.includes("smartfren") || brand.includes("smart")) {
    return {
      idle: "from-[#db001b] via-[#ed1c24] to-[#ff8a00]",
      selected: "from-[#b50018] via-[#d9161f] to-[#ff6a00]",
      shadow: "shadow-[0_14px_30px_rgba(219,0,27,0.19)]",
      selectedShadow: "shadow-[0_18px_36px_rgba(219,0,27,0.29)]",
      accent: DEFAULT_THEME.accent,
    };
  }
  if (brand.includes("by.u") || brand.includes("byu")) {
    return {
      idle: "from-[#00a3ff] via-[#5f5bff] to-[#7b2cff]",
      selected: "from-[#008ee0] via-[#514de8] to-[#6822d4]",
      shadow: "shadow-[0_14px_30px_rgba(95,91,255,0.20)]",
      selectedShadow: "shadow-[0_18px_36px_rgba(95,91,255,0.30)]",
      accent: "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.26),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.13),rgba(255,255,255,0.03))]",
    };
  }
  return DEFAULT_THEME;
}

export function QuickProductOptionGrid({
  items,
  selectedId,
  onSelect,
  columns = 2,
  variant = "default",
  brandName,
}: QuickProductOptionGridProps) {
  const theme = productCardTheme(brandName);
  if (columns === 1) {
    return (
      <div className="space-y-2">
        {items.map((item) => {
          const selected = selectedId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`relative w-full overflow-hidden rounded-2xl bg-linear-to-br px-5 py-3 text-left ${
                selected ? `${theme.selected} ${theme.selectedShadow}` : `${theme.idle} ${theme.shadow}`
              }`}
            >
              <div className={`absolute inset-0 ${theme.accent}`} />
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full border border-white/20" />

              <div className="relative flex min-h-18 flex-col justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-white **:text-inherit text-lg font-semibold">{item.title}</div>
                </div>
                <div className="min-w-0">
                  {item.subtitle ? <div className="text-sm font-semibold leading-none tracking-tight text-white/72">{item.subtitle}</div> : null}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((item) => {
        const selected = selectedId === item.id;
        const isPulsaCard = variant === "pulsa";
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={`relative overflow-hidden rounded-2xl bg-linear-to-br px-4 py-4 ${
              selected ? `${theme.selected} ${theme.selectedShadow}` : `${theme.idle} ${theme.shadow}`
            }`}
          >
            <div className={`absolute inset-0 ${theme.accent}`} />
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full border border-white/20" />

            <div
              className={`relative ${
                isPulsaCard
                  ? "flex min-h-18 flex-col justify-between"
                  : "flex min-h-20 flex-col justify-between gap-4"
              }`}
            >
              <div
                className={`min-w-0 text-white **:text-inherit ${
                  isPulsaCard ? "flex flex-1 items-center justify-center text-center text-sm font-semibold" : "text-sm font-semibold"
                }`}
              >
                {item.title}
              </div>
              {item.subtitle ? (
                <div
                  className={`font-bold leading-none tracking-tight text-white ${
                    isPulsaCard ? "text-right text-[11px] opacity-65" : "text-sm opacity-80"
                  }`}
                >
                  {item.subtitle}
                </div>
              ) : null}
            </div>
          </button>
        );
      })}
    </div>
  );
}
