"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

function navClass(active: boolean) {
  return active
    ? "flex min-w-0 flex-col items-center gap-1.5 py-1 text-[#d70717]! visited:text-[#d70717]!"
    : "flex min-w-0 flex-col items-center gap-1.5 py-1 text-slate-400! transition visited:text-slate-400! hover:text-[#8f1023]!";
}

const iconClass = "relative h-6 w-6 md:h-10 md:w-10";
const textClass = "text-[11px] font-bold leading-none md:text-lg";
const activeIndicatorClass = "absolute -bottom-2.5 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-[#d70717] md:h-1.5 md:w-16";

function NavIcon({ src }: { src: string }) {
  return (
    <span className={iconClass}>
      <Image src={src} alt="" fill sizes="(max-width: 768px) 24px, 40px" className="object-contain" />
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
  const notificationHref = isLoggedIn ? "/user/transaksi" : "/transaksi";
  const scanHref = isLoggedIn ? "/user/kategori" : "/kategori";
  const notificationActive = pathname.startsWith("/user/transaksi") || pathname.startsWith("/transaksi");
  const scanActive = pathname.startsWith("/user/kategori") || pathname.startsWith("/kategori");
  const accountActive = isLoggedIn
    ? pathname.startsWith("/user/account")
    : pathname.startsWith("/login");

  return (
    <section className="fixed bottom-0 left-1/2 z-[90] w-full max-w-[954px] -translate-x-1/2 overflow-visible px-4 pb-4 md:px-0">
      <div className="grid grid-cols-5 items-end rounded-t-[26px] bg-white/96 px-4 pb-[calc(0.55rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-16px_36px_rgba(99,24,34,0.13)] ring-1 ring-red-950/5 backdrop-blur-xl md:rounded-[28px] md:px-10 md:pb-5 md:pt-4">
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

        <Link href={scanHref} prefetch={false} className="relative flex min-w-0 flex-col items-center gap-1.5 py-1 text-slate-950! visited:text-slate-950!">
          <span className="relative -mt-8 grid h-16 w-16 place-items-center rounded-full bg-[#d70717] shadow-[0_12px_30px_rgba(215,7,23,0.28)] ring-6 ring-white md:-mt-12 md:h-24 md:w-24">
            <span className="relative h-8 w-8 md:h-12 md:w-12">
              <Image src="/nuansapulsa-assets/nav_scan_qr_putih.png" alt="" fill sizes="(max-width: 768px) 32px, 48px" className="object-contain" />
            </span>
          </span>
          <span className={textClass}>Scan</span>
          {scanActive ? <span className={activeIndicatorClass} /> : null}
        </Link>

        <Link href={notificationHref} prefetch={false} className={`${navClass(notificationActive)} relative`}>
          <span className={iconClass}>
            <Image src="/nuansapulsa-assets/nav_notifikasi.png" alt="" fill sizes="(max-width: 768px) 24px, 40px" className="object-contain" />
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#d70717] ring-1 ring-white md:h-4 md:w-4" />
          </span>
          <span className={textClass}>Notifikasi</span>
          {notificationActive ? <span className={activeIndicatorClass} /> : null}
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
