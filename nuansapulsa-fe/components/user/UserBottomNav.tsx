"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

function navClass(active: boolean) {
  return active
    ? "relative flex min-w-0 flex-col items-center justify-center gap-1 text-[#d70717]! visited:text-[#d70717]!"
    : "relative flex min-w-0 flex-col items-center justify-center gap-1 text-slate-400! transition visited:text-slate-400! hover:text-[#8f1023]!";
}

function isActivePath(pathname: string, basePath: string) {
  return pathname === basePath || pathname.startsWith(`${basePath}/`);
}

const iconClass = "relative h-6 w-6";
const textClass = "max-w-full truncate text-[10px] font-black leading-none min-[380px]:text-[11px]";
const activeIndicatorClass = "absolute bottom-1 left-1/2 h-1 w-7 -translate-x-1/2 rounded-full bg-[#d70717]";
const navShellClass = "h-[72px] pb-2 min-[380px]:h-[78px]";
const navSafeSpaceClass = "pointer-events-none h-[calc(112px+env(safe-area-inset-bottom))]";

function NavIcon({ src }: { src: string }) {
  return (
    <span className={iconClass}>
      <Image src={src} alt="" fill sizes="24px" className="object-contain" />
    </span>
  );
}

export function UserBottomNav() {
  const pathname = usePathname() || "";
  const trxActive = isActivePath(pathname, "/user/transaksi");
  const menuActive =
    isActivePath(pathname, "/user/kategori") ||
    isActivePath(pathname, "/user/pulsa-data") ||
    isActivePath(pathname, "/user/listrik") ||
    isActivePath(pathname, "/user/ewallet") ||
    isActivePath(pathname, "/game");
  const notificationActive = isActivePath(pathname, "/user/notifikasi");
  const accountActive = isActivePath(pathname, "/user/account");
  const homeActive = pathname === "/user";

  return (
    <>
      <div aria-hidden="true" className={navSafeSpaceClass} />
      <section className="fixed inset-x-0 bottom-0 z-[90] mx-auto w-full max-w-md bg-linear-to-t from-[#f7f7f7] via-[#f7f7f7] to-transparent px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-4 sm:px-4 md:w-97.5">
        <div className={`grid grid-cols-5 items-stretch overflow-hidden rounded-[24px] border border-red-950/[0.06] bg-white px-2 pt-2 shadow-[0_-10px_28px_rgba(99,24,34,0.14)] ring-1 ring-white min-[380px]:px-3 ${navShellClass}`}>
          <Link href="/user" prefetch={false} className={navClass(homeActive)}>
            <NavIcon src="/nuansapulsa-assets/nav_beranda.png" />
            <span className={textClass}>Beranda</span>
            {homeActive ? <span className={activeIndicatorClass} /> : null}
          </Link>

          <Link href="/user/transaksi" prefetch={false} className={navClass(trxActive)}>
            <NavIcon src="/nuansapulsa-assets/nav_riwayat.png" />
            <span className={textClass}>Riwayat</span>
            {trxActive ? <span className={activeIndicatorClass} /> : null}
          </Link>

          <Link href="/user/kategori" prefetch={false} className={navClass(menuActive)}>
            <NavIcon src="/nuansapulsa-assets/layanan_lainnya.png" />
            <span className={textClass}>Menu</span>
            {menuActive ? <span className={activeIndicatorClass} /> : null}
          </Link>

          <Link href="/user/transaksi" prefetch={false} className={navClass(notificationActive)}>
            <span className={iconClass}>
              <Image src="/nuansapulsa-assets/nav_notifikasi.png" alt="" fill sizes="24px" className="object-contain" />
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#d70717] ring-1 ring-white" />
            </span>
            <span className={textClass}>Notifikasi</span>
            {notificationActive ? <span className={activeIndicatorClass} /> : null}
          </Link>

          <Link href="/user/account" prefetch={false} className={navClass(accountActive)}>
            <NavIcon src="/nuansapulsa-assets/nav_akun.png" />
            <span className={textClass}>Akun</span>
            {accountActive ? <span className={activeIndicatorClass} /> : null}
          </Link>
        </div>
      </section>
    </>
  );
}
