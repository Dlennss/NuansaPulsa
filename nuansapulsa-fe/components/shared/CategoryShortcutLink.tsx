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
      return { iconSrc: "/nuansapulsa-assets/layanan_pulsa.png" };
    case "e-money":
    case "e-wallet":
      return { iconSrc: "/nuansapulsa-assets/layanan_e_wallet.png" };
    case "paket data":
      return { iconSrc: "/nuansapulsa-assets/layanan_paket_data.png" };
    case "listrik":
    case "pln":
      return { iconSrc: "/nuansapulsa-assets/layanan_listrik_pln.png" };
    case "game":
      return { iconSrc: "/nuansapulsa-assets/layanan_game.png" };
    case "tv":
      return { iconSrc: "/nuansapulsa-assets/layanan_tv_streaming.png" };
    case "pdam":
      return { iconSrc: "/service-icons/pdam.png" };
    case "bpjs":
      return { iconSrc: "/service-icons/bpjs.png" };
    case "internet pascabayar":
      return { iconSrc: "/service-icons/internet-wifi.png" };
    case "hp pascabayar":
      return { iconSrc: "/nuansapulsa-assets/layanan_telepon.png" };
    case "masa aktif":
      return { iconSrc: "/nuansapulsa-assets/layanan_sms.png" };
    case "paket telepon":
      return { iconSrc: "/nuansapulsa-assets/layanan_telepon.png" };
    case "aktivasi perdana":
      return { iconSrc: "/service-icons/esim-roaming.png" };
    case "gas negara":
      return { iconSrc: "/service-icons/gas-pgn.png" };
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
      className="group flex min-h-[82px] flex-col items-center justify-start gap-1.5 rounded-xl bg-white px-1 py-2 text-center transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(190,18,60,0.12)]"
    >
      <div className="relative grid h-11 w-11 place-items-center overflow-hidden transition-transform duration-200 group-hover:scale-105">
        <Image
          src={visual.iconSrc}
          alt=""
          fill
          sizes="48px"
          className="object-contain"
        />
      </div>
      <span className="line-clamp-2 px-0.5 text-[10px] font-bold leading-tight text-[#303544]">
        {label}
      </span>
    </Link>
  );
}
