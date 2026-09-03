"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

type AppTopHeaderProps = {
  isLoggedIn?: boolean;
  userName?: string | null;
  saldo?: number | null;
  role?: string | null;
};

export function AppTopHeader({ isLoggedIn = false, userName, saldo, role }: AppTopHeaderProps) {
  const pathname = usePathname() || "";
  const normalizedRole = String(role || "").trim().toLowerCase();
  const isRetailLoggedIn = isLoggedIn && (normalizedRole === "user" || normalizedRole === "agent" || normalizedRole === "master");
  const homeHref = isRetailLoggedIn ? "/user" : "/";
  void userName;
  void saldo;

  if (pathname === "/") return null;

  return (
    <header className="sticky top-0 z-30 overflow-hidden bg-[#e50917] px-3 pb-3 pt-2 text-white shadow-[0_16px_34px_rgba(151,14,32,0.22)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,#ff2115_0%,#e50917_52%,#a20d22_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-amber-300/80 to-transparent" />

      <div className="relative flex h-14 items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center">
          <Link
            href={homeHref}
            prefetch={false}
            className="flex min-w-0 items-center gap-2.5"
            aria-label="NuansaPulsa"
          >
            <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-[15px] bg-white shadow-[0_10px_22px_rgba(255,255,255,0.14)] ring-1 ring-white/70">
              <Image
                src="/nuansapulsa-assets/logo_mark_lingkaran.png"
                alt=""
                fill
                sizes="44px"
                className="object-contain p-1.5"
              />
            </span>
            <span className="min-w-0">
              <span className="relative block h-6 w-[140px]">
                <Image
                  src="/nuansapulsa-assets/logo_wordmark_nuansapulsa.png"
                  alt="NuansaPulsa"
                  fill
                  priority
                  sizes="140px"
                  className="object-contain object-left"
                />
              </span>
            </span>
          </Link>
        </div>

        <div className="h-10 w-10 shrink-0" aria-hidden="true" />
      </div>
    </header>
  );
}
