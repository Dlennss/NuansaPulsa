"use client";

import Image from "next/image";
import type { GuestProductCardCommonProps } from "@/components/guest/product-card-shared";
import {
  extractLargeNominalLabel,
  formatRupiah,
  getDisplayProductName,
  getProductPricing,
  isEMoneyFixedItem,
  isPackageStyleItem,
} from "@/components/guest/product-card-shared";
import { getBrandLogo } from "@/lib/brand-logos";

export function GuestProductDefaultCard({
  item,
  isLoggedIn,
  onBuy,
  canBuy,
  buyBlockedLabel,
  hidePrice,
}: GuestProductCardCommonProps) {
  const { fixedPrice, openAmountPrice, feeActive, isFixed } = getProductPricing(item, isLoggedIn);
  const packageStyle = isPackageStyleItem(item);
  const emoneyStyle = isEMoneyFixedItem(item);
  const plnStyle = String(item.kategori_nama || "").toUpperCase().includes("PLN")
    || String(item.brand_nama || "").toUpperCase() === "PLN"
    || String(item.sku || "").toUpperCase().includes("PLN");
  const displayName = getDisplayProductName(item);
  const brandLogo = getBrandLogo(item.brand_nama || item.nama);
  const priceLabel = isFixed && fixedPrice !== null
    ? formatRupiah(fixedPrice).replace("Rp ", "Rp")
    : `+${formatRupiah((openAmountPrice ?? feeActive)).replace("Rp ", "Rp")}`;

  if (plnStyle) {
    return (
      <button
        type="button"
        onClick={() => {
          if (!canBuy) return;
          onBuy(item);
        }}
        disabled={!canBuy}
        className="group relative w-full overflow-hidden rounded-[24px] bg-[#d70717] px-4 py-4 text-left text-white shadow-[0_16px_32px_rgba(151,14,32,0.22)] ring-1 ring-amber-200/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(151,14,32,0.28)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <div className="absolute -right-8 -top-10 h-26 w-26 rounded-full bg-amber-300/35 blur-2xl transition group-hover:bg-amber-200/45" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(255,255,255,0.16),transparent_28%),linear-gradient(135deg,rgba(16,185,129,0.22),rgba(163,230,53,0.06))]" />
        <div className="absolute inset-0 opacity-[0.16] bg-[repeating-radial-gradient(circle_at_0_100%,rgba(255,255,255,0.75)_0,rgba(255,255,255,0.75)_1px,transparent_1px,transparent_11px)] bg-size-[150%_120%]" />

        <div className="relative flex min-h-20 flex-col justify-between gap-4">
          <div className="min-w-0">
            <p className="text-2xl font-black leading-none tracking-tight text-amber-200">
              {extractLargeNominalLabel(item)}
            </p>
            <p className="mt-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/55">Token PLN</p>
          </div>

          {hidePrice ? (
            <p className="text-right text-[10px] font-medium text-white/75">Biaya admin ditambahkan setelah hasil cek tagihan diterima.</p>
          ) : (
            <div className="text-right text-[12px] font-black leading-none tracking-tight text-white">
              {canBuy ? priceLabel : (buyBlockedLabel || "Lengkapi dulu")}
            </div>
          )}
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        if (!canBuy) return;
        onBuy(item);
      }}
      disabled={!canBuy}
      className="group relative w-full overflow-hidden rounded-[22px] bg-[linear-gradient(135deg,#b20717_0%,#d70717_58%,#ff6a00_130%)] px-4 py-4 text-left text-white shadow-[0_14px_30px_rgba(151,14,32,0.18)] ring-1 ring-white/20 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(151,14,32,0.25)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.24),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.02))]" />
      <div className="absolute -right-8 -top-8 h-22 w-22 rounded-full bg-amber-300/28 blur-xl" />
      <div className="absolute inset-x-0 top-0 h-1 bg-amber-300/80" />

      <div
        className={`relative flex ${
          emoneyStyle ? "min-h-18 flex-col justify-between" : "min-h-18 flex-col justify-between gap-4"
        }`}
      >
        <div className={`min-w-0 text-white ${emoneyStyle ? "flex flex-1 items-center justify-center text-center" : ""}`}>
          {brandLogo ? (
            <span className="absolute right-0 top-0 grid h-9 w-9 place-items-center rounded-2xl bg-white/92 p-1.5 shadow-[0_8px_18px_rgba(88,10,18,0.16)]">
              <Image src={brandLogo.src} alt={brandLogo.alt} width={28} height={28} className="h-full w-full object-contain" />
            </span>
          ) : null}
          {emoneyStyle ? (
            <p className="text-xl font-bold tracking-tight text-white">{extractLargeNominalLabel(item)}</p>
          ) : (
            <h2 className={packageStyle ? "line-clamp-2 pr-10 text-[13px] font-bold leading-tight text-white" : "line-clamp-3 pr-10 text-[13px] font-bold leading-tight text-white"}>
              {displayName}
            </h2>
          )}
        </div>

        {hidePrice ? (
          <p className="text-right text-[10px] font-medium text-white/75">Biaya admin ditambahkan setelah hasil cek tagihan diterima.</p>
        ) : (
          <div className="text-right text-[11px] font-semibold leading-none tracking-tight text-white/65">
            {canBuy ? priceLabel : (buyBlockedLabel || "Lengkapi dulu")}
          </div>
        )}
      </div>
    </button>
  );
}
