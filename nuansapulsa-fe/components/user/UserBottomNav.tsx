"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Grid2X2, History, House, UserRound, WalletCards } from "lucide-react";

function navClass(active: boolean) {
  return active
    ? "flex min-w-0 flex-col items-center gap-1.5 py-1 text-[#d70717]! visited:text-[#d70717]!"
    : "flex min-w-0 flex-col items-center gap-1.5 py-1 text-slate-400! transition visited:text-slate-400! hover:text-[#b20717]!";
}

function isActivePath(pathname: string, basePath: string) {
  return pathname === basePath || pathname.startsWith(`${basePath}/`);
}

const iconClass = "h-5 w-5";
const textClass = "text-[11px] font-bold leading-none";

export function UserBottomNav() {
  const pathname = usePathname() || "";
  const trxActive = isActivePath(pathname, "/user/transaksi");
  const menuActive =
    isActivePath(pathname, "/user/kategori") ||
    isActivePath(pathname, "/user/pulsa-data") ||
    isActivePath(pathname, "/user/listrik") ||
    isActivePath(pathname, "/user/ewallet") ||
    isActivePath(pathname, "/game");
  const saldoActive = isActivePath(pathname, "/user/saldo") || isActivePath(pathname, "/user/account/topup") || isActivePath(pathname, "/user/account/mutasi");
  const accountActive = isActivePath(pathname, "/user/account") && !saldoActive;
  const homeActive = isActivePath(pathname, "/user") && !trxActive && !menuActive && !accountActive && !saldoActive;

  return (
    <section className="fixed bottom-0 left-1/2 z-[90] w-full max-w-md -translate-x-1/2 overflow-hidden rounded-t-[24px] border-t border-red-950/[0.06] bg-white/96 shadow-[0_-14px_34px_rgba(151,14,32,0.10)] backdrop-blur-xl md:bottom-0 md:w-97.5 md:max-w-none">
      <div className="grid grid-cols-5 px-4 pb-[calc(0.55rem+env(safe-area-inset-bottom))] pt-2.5">
        <Link href="/user" className={navClass(homeActive)}>
          <House className={iconClass} strokeWidth={1.65} />
          <span className={textClass}>Beranda</span>
        </Link>

        <Link href="/user/transaksi" className={navClass(trxActive)}>
          <History className={iconClass} strokeWidth={1.65} />
          <span className={textClass}>Riwayat</span>
        </Link>

        <Link href="/user/kategori" className={navClass(menuActive)}>
          <Grid2X2 className={iconClass} strokeWidth={1.65} />
          <span className={textClass}>Menu</span>
        </Link>

        <Link href="/user/saldo" className={navClass(saldoActive)}>
          <WalletCards className={iconClass} strokeWidth={1.65} />
          <span className={textClass}>Saldo</span>
        </Link>

        <Link href="/user/account" className={navClass(accountActive)}>
          <UserRound className={iconClass} strokeWidth={1.65} />
          <span className={textClass}>Akun</span>
        </Link>
      </div>
    </section>
  );
}
