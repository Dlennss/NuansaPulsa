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
    return (activeItems.length > 0 ? activeItems : HOME_FALLBACK_ITEMS).slice(0, 9);
  }, [sortedItems]);

  return (
    <section>
      <div className="rounded-[22px] bg-white p-3 shadow-[0_16px_36px_rgba(99,24,34,0.10)] ring-1 ring-red-950/[0.04]">
        <div className={showAll ? "grid grid-cols-4 gap-x-2 gap-y-3 sm:grid-cols-5" : "grid grid-cols-5 gap-x-2 gap-y-3"}>
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
              className="group flex min-h-[82px] flex-col items-center justify-start gap-1.5 rounded-xl bg-white px-1 py-2 text-center transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(190,18,60,0.12)]"
            >
              <div className="relative h-11 w-11 transition-transform duration-200 group-hover:scale-105">
                <Image
                  src="/nuansapulsa-assets/layanan_lainnya.png"
                  alt=""
                  fill
                  sizes="44px"
                  className="object-contain"
                />
              </div>
              <span className="line-clamp-2 px-0.5 text-[10px] font-bold leading-tight text-[#303544]">
                Lainnya
              </span>
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
