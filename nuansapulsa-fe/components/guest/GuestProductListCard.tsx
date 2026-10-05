"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import type { GuestProductCardCommonProps } from "@/components/guest/product-card-shared";
import { formatRupiah, getDisplayProductName, getProductPricing } from "@/components/guest/product-card-shared";
import { getBrandLogo } from "@/lib/brand-logos";

export function GuestProductListCard({
  item,
  isLoggedIn,
  onBuy,
  canBuy,
  buyBlockedLabel,
  hidePrice,
}: GuestProductCardCommonProps) {
  const { isFixed, feeActive, fixedPrice, openAmountPrice } = getProductPricing(item, isLoggedIn);
  const displayName = getDisplayProductName(item);
  const brandLogo = getBrandLogo(item.brand_nama || item.nama);

  return (
    <button
      type="button"
      onClick={() => {
        if (!canBuy) return;
        onBuy(item);
      }}
      disabled={!canBuy}
      className="group flex w-full items-center gap-3 rounded-[20px] border border-red-950/10 bg-white px-4 py-3 text-left shadow-[0_8px_22px_rgba(151,14,32,0.08)] transition-all duration-300 hover:border-red-200 hover:shadow-[0_12px_28px_rgba(151,14,32,0.14)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-2xl bg-rose-50 text-[#d70717] ring-1 ring-red-100">
        {brandLogo ? (
          <Image src={brandLogo.src} alt={brandLogo.alt} width={34} height={34} className="h-8 w-8 object-contain" />
        ) : (
          <span className="text-[10px] font-black uppercase">{String(item.brand_nama || item.nama || "NP").slice(0, 2)}</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="line-clamp-2 text-sm font-bold text-slate-900">{displayName}</h2>
        {hidePrice ? (
          <p className="mt-1 text-[11px] text-slate-500">Biaya admin ditambahkan setelah hasil cek tagihan diterima.</p>
        ) : (
          <p className="mt-1 text-sm font-semibold text-slate-700">
            {isFixed && fixedPrice !== null ? formatRupiah(fixedPrice) : `+ ${formatRupiah(openAmountPrice ?? feeActive)}`}
          </p>
        )}
      </div>
      {canBuy ? (
        <ChevronRight className="h-5 w-5 shrink-0 text-[#d70717]" />
      ) : (
        <span className="text-xs font-semibold text-slate-400">{buyBlockedLabel || "Lengkapi dulu"}</span>
      )}
    </button>
  );
}
