"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NotificationSourceItem = {
  id?: number | string;
  invoice_id?: string;
  dibuat_pada?: string | null;
  diubah_pada?: string | null;
};

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

function getNotificationStorageKey(token: string) {
  return `nuansapulsa:last_notification_seen:${token.slice(-16)}`;
}

function getItemTime(item: NotificationSourceItem) {
  const value = item.diubah_pada || item.dibuat_pada || "";
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getLatestTime(items: NotificationSourceItem[]) {
  return items.reduce((latest, item) => Math.max(latest, getItemTime(item)), 0);
}

function UserNotificationBadge({ active }: { active: boolean }) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function syncUnread() {
      const token = String(localStorage.getItem("auth_token") || "").trim();
      if (!token) {
        setUnreadCount(0);
        return;
      }

      const storageKey = getNotificationStorageKey(token);

      if (active) {
        setUnreadCount(0);
      }

      try {
        const response = await fetch("/api/app/me/orders?limit=20&offset=0", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        const payload = await response.json().catch(() => []);
        const items = (Array.isArray(payload) ? payload : []) as NotificationSourceItem[];
        const latestTime = getLatestTime(items);
        const storedSeen = Number(localStorage.getItem(storageKey) || "0");

        if (active) {
          if (latestTime > 0) localStorage.setItem(storageKey, String(latestTime));
          if (!cancelled) setUnreadCount(0);
          return;
        }

        if (!storedSeen) {
          if (latestTime > 0) localStorage.setItem(storageKey, String(latestTime));
          if (!cancelled) setUnreadCount(0);
          return;
        }

        const nextUnread = items.filter((item) => getItemTime(item) > storedSeen).length;
        if (!cancelled) setUnreadCount(Math.min(nextUnread, 99));
      } catch {
        if (!cancelled) setUnreadCount(0);
      }
    }

    syncUnread();
    const interval = window.setInterval(syncUnread, 60000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [active]);

  if (unreadCount <= 0) return null;

  return (
    <span className="absolute -right-1.5 -top-1.5 grid min-h-4 min-w-4 place-items-center rounded-full bg-[#d70717] px-1 text-[9px] font-black leading-none text-white ring-1 ring-white">
      {unreadCount > 9 ? "9+" : unreadCount}
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

          <Link href="/user/notifikasi" prefetch={false} className={navClass(notificationActive)}>
            <span className={iconClass}>
              <Image src="/nuansapulsa-assets/nav_notifikasi.png" alt="" fill sizes="24px" className="object-contain" />
              <UserNotificationBadge active={notificationActive} />
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
