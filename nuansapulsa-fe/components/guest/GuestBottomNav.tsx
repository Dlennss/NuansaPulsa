"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

function navClass(active: boolean) {
  return active
    ? "flex min-w-0 flex-col items-center gap-1.5 py-1 text-[#d70717]! visited:text-[#d70717]!"
    : "flex min-w-0 flex-col items-center gap-1.5 py-1 text-slate-400! transition visited:text-slate-400! hover:text-[#8f1023]!";
}

const iconClass = "relative h-5 w-5";
const textClass = "text-[11px] font-bold leading-none";
const activeIndicatorClass = "absolute -bottom-2.5 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-[#d70717]";

function NavIcon({ src }: { src: string }) {
  return (
    <span className={iconClass}>
      <Image src={src} alt="" fill sizes="20px" className="object-contain" />
    </span>
  );
}

type GuestBottomNavProps = {
  isLoggedIn?: boolean;
};

export function GuestBottomNav({ isLoggedIn = false }: GuestBottomNavProps) {
  const pathname = usePathname() || "";
  const homeActive = pathname === "/";
  const historyActive = pathname.startsWith("/transaksi");
  const accountHref = isLoggedIn ? "/user/account" : "/login";
  const saldoHref = isLoggedIn ? "/user/saldo" : "/login";
  const saldoActive = isLoggedIn ? pathname.startsWith("/user/saldo") || pathname.startsWith("/user/account/topup") || pathname.startsWith("/user/account/mutasi") : false;
  const accountActive = isLoggedIn
    ? pathname.startsWith("/user/account") && !saldoActive
    : pathname.startsWith("/login");

  return (
    <section className="fixed bottom-0 left-1/2 z-[90] w-full max-w-md -translate-x-1/2 overflow-hidden rounded-t-[26px] border-t border-red-950/5 bg-white/96 shadow-[0_-16px_36px_rgba(99,24,34,0.13)] backdrop-blur-xl md:bottom-0 md:w-97.5 md:max-w-none">
      <div className="grid grid-cols-4 px-4 pb-[calc(0.55rem+env(safe-area-inset-bottom))] pt-2.5">
        <Link href="/" prefetch={false} className={`${navClass(homeActive)} relative`}>
          <NavIcon src="/nuansapulsa-assets/nav_beranda.png" />
          <span className={textClass}>Beranda</span>
          {homeActive ? <span className={activeIndicatorClass} /> : null}
        </Link>

        <Link href="/transaksi" prefetch={false} className={`${navClass(historyActive)} relative`}>
          <NavIcon src="/nuansapulsa-assets/nav_riwayat.png" />
          <span className={textClass}>Riwayat</span>
          {historyActive ? <span className={activeIndicatorClass} /> : null}
        </Link>

        <Link href={saldoHref} prefetch={false} className={`${navClass(saldoActive)} relative`}>
          <NavIcon src="/nuansapulsa-assets/icon_saldo_simbol.png" />
          <span className={textClass}>Saldo</span>
          {saldoActive ? <span className={activeIndicatorClass} /> : null}
        </Link>

        <Link href={accountHref} prefetch={false} className={`${navClass(accountActive)} relative`}>
          <NavIcon src="/nuansapulsa-assets/nav_akun.png" />
          <span className={textClass}>Akun</span>
          {accountActive ? <span className={activeIndicatorClass} /> : null}
        </Link>
      </div>
    </section>
  );
}
