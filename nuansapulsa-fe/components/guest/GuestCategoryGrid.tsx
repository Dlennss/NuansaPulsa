"use client";

import Link from "next/link";
import { useMemo } from "react";
import Image from "next/image";
import type { UserCategoryItem } from "@/components/user/types";
import { getGuestCategoryPath } from "@/lib/category-routes";
import { CategoryShortcutLink } from "@/components/shared/CategoryShortcutLink";

type GuestCategoryGridProps = {
  items: UserCategoryItem[];
  showAll?: boolean;
};

type CategoryCardProps = {
  item: UserCategoryItem;
};

const PRIORITY: Record<string, number> = {
  pulsa: 1,
  "paket data": 1,
  game: 2,
  "e-money": 3,
  "e-wallet": 3,
  listrik: 4,
  pln: 4,
  tv: 6,
  pdam: 7,
  bpjs: 8,
  "internet pascabayar": 9,
  "hp pascabayar": 10,
  "masa aktif": 11,
  "paket telepon": 12,
  "aktivasi perdana": 13,
  "gas negara": 14,
  lainnya: 15,
};

const HOME_FALLBACK_ITEMS: UserCategoryItem[] = [
  { id: 1, nama: "Pulsa", aktif: true },
  { id: 5, nama: "Game", aktif: true },
  { id: 3, nama: "E-Wallet", aktif: true },
  { id: 11, nama: "Listrik", aktif: true },
  { id: 4, nama: "PLN", aktif: true },
  { id: 7, nama: "TV", aktif: true },
  { id: 17, nama: "PDAM", aktif: true },
  { id: 19, nama: "BPJS", aktif: true },
];

function normalizeName(name: string) {
  return name.trim().toLowerCase();
}

function getCategoryHref(item: UserCategoryItem) {
  const name = normalizeName(item.nama);
  if (name === "pulsa" || name === "paket data") return "/pulsa-data";
  return getGuestCategoryPath(item);
}

function sortCategories(items: UserCategoryItem[]) {
  return items
  .filter((item) => normalizeName(item.nama) !== "paket data")
  .sort((a, b) => {
    const aKey = normalizeName(a.nama);
    const bKey = normalizeName(b.nama);
    const pa = PRIORITY[aKey] ?? 999;
    const pb = PRIORITY[bKey] ?? 999;
    if (pa !== pb) return pa - pb;
    return a.nama.localeCompare(b.nama, "id-ID");
  });
}

function getCategoryLabel(item: UserCategoryItem) {
  const name = normalizeName(item.nama);
  if (name === "pulsa") {
    return "Pulsa & Data";
  }
  if (name === "e-money" || name === "e-wallet") {
    return "E-Wallet";
  }
  return item.nama;
}

function getCategoryVisualName(item: UserCategoryItem) {
  return normalizeName(item.nama) === "pulsa" ? "pulsa data" : item.nama;
}

function CategoryCard({ item }: CategoryCardProps) {
  const label = getCategoryLabel(item);

  return (
    <CategoryShortcutLink href={getCategoryHref(item)} label={label} visualName={getCategoryVisualName(item)} />
  );
}

export function GuestCategoryGrid({ items, showAll = false }: GuestCategoryGridProps) {
  const sortedItems = useMemo(() => sortCategories(items), [items]);
  const homeItems = useMemo(() => {
    const activeItems = sortedItems.filter((item) => item.aktif);
    const activeKeys = new Set(activeItems.map((item) => normalizeName(item.nama)));
    const fallbackItems = HOME_FALLBACK_ITEMS.filter((item) => !activeKeys.has(normalizeName(item.nama)));
    return [...activeItems, ...fallbackItems].slice(0, 9);
  }, [sortedItems]);

  return (
    <section>
      <div className="rounded-[24px] bg-white px-3 pb-3 pt-4 shadow-[0_16px_36px_rgba(99,24,34,0.10)] ring-1 ring-red-950/[0.04]">
        <div className={showAll ? "grid grid-cols-4 gap-x-3 gap-y-4 sm:grid-cols-5" : "grid grid-cols-5 gap-x-2 gap-y-3"}>
          {!showAll ? homeItems.map((item) => (
            <CategoryCard key={item.id} item={item} />
          )) : null}
          {showAll ? sortedItems.map((item) => (
            <CategoryCard key={item.id} item={item} />
          )) : null}
          {!showAll ? (
            <Link
              href="/kategori"
              prefetch={false}
              aria-label="Lainnya"
              className="group flex min-h-[88px] flex-col items-center justify-start gap-1.5 rounded-xl px-0.5 py-1 text-center transition duration-200 hover:-translate-y-0.5"
            >
              <div className="relative h-13 w-13 overflow-hidden rounded-2xl bg-white p-2 shadow-[0_10px_24px_rgba(15,23,42,0.10)] ring-1 ring-slate-950/[0.04] transition-transform duration-200 group-hover:scale-105">
                <Image
                  src="/nuansapulsa-assets/layanan_lainnya.png"
                  alt=""
                  fill
                  sizes="52px"
                  className="object-contain p-2"
                />
              </div>
              <span className="line-clamp-2 px-0.5 text-[10px] font-black leading-tight text-slate-950">
                Lainnya
              </span>
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
