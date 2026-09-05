"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

function navClass(active: boolean) {
  return active
    ? "relative flex min-w-0 flex-col items-center justify-center gap-1 text-[#d70717]! visited:text-[#d70717]!"
    : "relative flex min-w-0 flex-col items-center justify-center gap-1 text-slate-400! transition visited:text-slate-400! hover:text-[#8f1023]!";
}

const iconClass = "relative h-6 w-6";
const textClass = "max-w-full truncate text-[10px] font-black leading-none min-[380px]:text-[11px]";
const activeIndicatorClass = "absolute bottom-0 left-1/2 h-1 w-7 -translate-x-1/2 rounded-full bg-[#d70717]";

function NavIcon({ src }: { src: string }) {
  return (
    <span className={iconClass}>
      <Image src={src} alt="" fill sizes="24px" className="object-contain" />
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
  const menuHref = isLoggedIn ? "/user/kategori" : "/kategori";
  const notificationActive = pathname.startsWith("/user/transaksi") || pathname.startsWith("/transaksi");
  const menuActive = pathname.startsWith("/user/kategori") || pathname.startsWith("/kategori");
  const accountActive = isLoggedIn
    ? pathname.startsWith("/user/account")
    : pathname.startsWith("/login");

  return (
    <section className="fixed inset-x-0 bottom-0 z-[90] mx-auto w-full max-w-md px-2 pb-2 sm:px-4 sm:pb-4 md:w-97.5">
      <div className="grid h-[70px] grid-cols-5 items-stretch rounded-t-[24px] border border-red-950/[0.06] bg-white/96 px-2 pb-[calc(0.45rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-14px_34px_rgba(99,24,34,0.12)] backdrop-blur-xl min-[380px]:h-[76px] min-[380px]:px-3">
        <Link href="/" prefetch={false} className={navClass(homeActive)}>
          <NavIcon src="/nuansapulsa-assets/nav_beranda.png" />
          <span className={textClass}>Beranda</span>
          {homeActive ? <span className={activeIndicatorClass} /> : null}
        </Link>

        <Link href="/transaksi" prefetch={false} className={navClass(historyActive)}>
          <NavIcon src="/nuansapulsa-assets/nav_riwayat.png" />
          <span className={textClass}>Riwayat</span>
          {historyActive ? <span className={activeIndicatorClass} /> : null}
        </Link>

        <Link href={menuHref} prefetch={false} className={navClass(menuActive)}>
          <span className={iconClass}>
            <Image src="/nuansapulsa-assets/layanan_lainnya.png" alt="" fill sizes="24px" className="object-contain" />
          </span>
          <span className={textClass}>Menu</span>
          {menuActive ? <span className={activeIndicatorClass} /> : null}
        </Link>

        <Link href={notificationHref} prefetch={false} className={navClass(notificationActive)}>
          <span className={iconClass}>
            <Image src="/nuansapulsa-assets/nav_notifikasi.png" alt="" fill sizes="24px" className="object-contain" />
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#d70717] ring-1 ring-white" />
          </span>
          <span className={textClass}>Notifikasi</span>
          {notificationActive ? <span className={activeIndicatorClass} /> : null}
        </Link>

        <Link href={accountHref} prefetch={false} className={navClass(accountActive)}>
          <NavIcon src="/nuansapulsa-assets/nav_akun.png" />
          <span className={textClass}>Akun</span>
          {accountActive ? <span className={activeIndicatorClass} /> : null}
        </Link>
      </div>
    </section>
  );
}
