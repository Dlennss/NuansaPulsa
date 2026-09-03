"use client";

import Image from "next/image";
import Link from "next/link";

type CategoryVisual = {
  iconSrc: string;
};

type CategoryShortcutLinkProps = {
  href: string;
  label: string;
  visualName: string;
};

function normalizeName(name: string) {
  return name.trim().toLowerCase();
}

function getCategoryVisual(name: string): CategoryVisual {
  const value = normalizeName(name);

  switch (value) {
    case "pulsa":
    case "pulsa data":
    case "pulsa & data":
      return { iconSrc: "/service-icons-exact/pulsa.png" };
    case "e-money":
    case "e-wallet":
      return { iconSrc: "/service-icons-exact/ewallet.png" };
    case "paket data":
      return { iconSrc: "/service-icons-exact/paket-data.png" };
    case "listrik":
    case "pln":
      return { iconSrc: "/service-icons-exact/token-pln.png" };
    case "game":
      return { iconSrc: "/service-icons-exact/voucher-game.png" };
    case "tv":
      return { iconSrc: "/service-icons-exact/tv-kabel.png" };
    case "pdam":
      return { iconSrc: "/service-icons-exact/pdam.png" };
    case "bpjs":
      return { iconSrc: "/service-icons-exact/bpjs.png" };
    case "internet pascabayar":
      return { iconSrc: "/service-icons-exact/internet-wifi.png" };
    case "hp pascabayar":
      return { iconSrc: "/service-icons-exact/hp-pascabayar.png" };
    case "masa aktif":
      return { iconSrc: "/service-icons-exact/hp-pascabayar.png" };
    case "paket telepon":
    case "telepon":
      return { iconSrc: "/service-icons-exact/hp-pascabayar.png" };
    case "sms":
      return { iconSrc: "/service-icons-exact/hp-pascabayar.png" };
    case "voucher":
      return { iconSrc: "/service-icons-exact/voucher-digital.png" };
    case "aktivasi perdana":
      return { iconSrc: "/service-icons-exact/esim-roaming.png" };
    case "gas negara":
      return { iconSrc: "/service-icons-exact/gas-pgn.png" };
    case "lainnya":
      return { iconSrc: "/nuansapulsa-assets/layanan_lainnya.png" };
    default:
      return { iconSrc: "/nuansapulsa-assets/layanan_lainnya.png" };
  }
}

export function CategoryShortcutLink({ href, label, visualName }: CategoryShortcutLinkProps) {
  const visual = getCategoryVisual(visualName);

  return (
    <Link
      href={href}
      prefetch={false}
      aria-label={label}
      className="group flex min-h-[76px] flex-col items-center justify-start gap-1.5 rounded-xl px-0.5 py-1 text-center transition duration-200 hover:-translate-y-0.5"
    >
      <div className="relative grid h-13 w-13 place-items-center transition-transform duration-200 group-hover:scale-105">
        <Image
          src={visual.iconSrc}
          alt=""
          fill
          sizes="52px"
          className="object-contain drop-shadow-[0_8px_10px_rgba(151,14,32,0.10)]"
        />
      </div>
      <span className="block px-0.5">
        <span className="line-clamp-2 text-[10px] font-black leading-tight text-slate-950">
          {label}
        </span>
      </span>
    </Link>
  );
}
