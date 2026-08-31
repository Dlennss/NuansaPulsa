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
  description?: string;
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
    case "telepon":
      return { iconSrc: "/nuansapulsa-assets/layanan_telepon.png" };
    case "sms":
      return { iconSrc: "/nuansapulsa-assets/layanan_sms.png" };
    case "voucher":
      return { iconSrc: "/nuansapulsa-assets/layanan_voucher.png" };
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

export function CategoryShortcutLink({ href, label, visualName, description }: CategoryShortcutLinkProps) {
  const visual = getCategoryVisual(visualName);

  return (
    <Link
      href={href}
      prefetch={false}
      aria-label={label}
      className="group flex min-h-[88px] flex-col items-center justify-start gap-2 rounded-xl px-0.5 py-1 text-center transition duration-200 hover:-translate-y-0.5 md:min-h-[162px]"
    >
      <div className="relative grid h-13 w-13 place-items-center overflow-hidden rounded-2xl bg-white p-2 shadow-[0_10px_24px_rgba(15,23,42,0.10)] ring-1 ring-slate-950/[0.04] transition-transform duration-200 group-hover:scale-105 md:h-25 md:w-25 md:rounded-[22px]">
        <Image
          src={visual.iconSrc}
          alt=""
          fill
          sizes="(max-width: 768px) 52px, 100px"
          className="object-contain p-2 md:p-6"
        />
      </div>
      <span className="block px-0.5">
        <span className="line-clamp-2 text-[10px] font-black leading-tight text-slate-950 md:text-xl md:leading-6">
          {label}
        </span>
        {description ? (
          <span className="mt-1 hidden text-lg font-medium leading-5 text-slate-500 md:block">
            {description}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
