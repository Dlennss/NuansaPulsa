import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getAppServerSession } from "@/lib/server-auth";
import { getUserProfile } from "@/lib/api.auth";
import { getCategories } from "@/lib/api.products";
import type { UserCategoryItem, UserSession } from "@/components/user/types";
import { UserCategoryGrid } from "@/components/user/UserCategoryGrid";
import { UserFavoriteTransactions, UserMonthlyBills, UserRecentActivity } from "@/components/user/UserMainSections";
import { UserBottomNav } from "@/components/user/UserBottomNav";
import { UserAuthClientSync } from "@/components/user/UserAuthClientSync";
import { GuestAdsSection } from "@/components/guest/GuestAdsSection";
import { GuestAdsCarouselSkeleton } from "@/components/guest/GuestAdsCarouselSkeleton";

type SessionShape = {
  user?: UserSession;
  backendToken?: string;
};

function formatIDR(value: number) {
  return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
}

function UserHomeHero({ saldo }: { saldo: number }) {
  return (
    <section className="relative isolate h-[300px] overflow-hidden rounded-b-[30px] bg-[#e50917] text-white shadow-[0_18px_42px_rgba(151,14,32,0.24)]">
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(140deg,#ff2115_0%,#ed0b18_48%,#aa0d23_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-[linear-gradient(165deg,transparent_18%,rgba(255,166,0,0.54)_19%,rgba(255,111,0,0.32)_40%,rgba(179,10,28,0.12)_62%,transparent_76%)]" />
      <div className="absolute right-2 top-2 -z-10 h-56 w-44 opacity-22">
        <span className="absolute left-1/2 top-7 h-40 w-1 -translate-x-1/2 bg-white/45" />
        <span className="absolute left-[calc(50%-22px)] top-18 h-34 w-1 -rotate-12 bg-white/30" />
        <span className="absolute left-[calc(50%+20px)] top-18 h-34 w-1 rotate-12 bg-white/30" />
        <span className="absolute left-[calc(50%-34px)] top-26 h-1 w-17 bg-white/28" />
        <span className="absolute left-[calc(50%-24px)] top-38 h-1 w-12 bg-white/24" />
        <span className="absolute left-1/2 top-3 h-14 w-14 -translate-x-1/2 rounded-full border-2 border-white/30" />
        <span className="absolute left-1/2 top-7 h-6 w-6 -translate-x-1/2 rounded-full border border-white/30" />
      </div>

      <Link
        href="/user"
        prefetch={false}
        aria-label="NuansaPulsa"
        className="absolute left-5 top-5 h-[42px] w-[clamp(176px,56vw,238px)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
      >
        <Image
          src="/nuansapulsa-assets/logo_full_dengan_tagline.png"
          alt="NuansaPulsa"
          fill
          priority
          sizes="(max-width: 480px) 64vw, 260px"
          className="object-contain object-left"
        />
      </Link>

      <div className="absolute inset-x-5 top-[96px]">
        <div className="max-w-[190px]">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-yellow-200">Satu menu digital</p>
          <h1 className="mt-1 text-[22px] font-black leading-[1.08] tracking-tight text-white drop-shadow-sm">
            Isi Pulsa, Data & Tagihan
          </h1>
          <p className="mt-2 max-w-[170px] text-[12px] font-semibold leading-4 text-white/88">
            Semua kebutuhan digital siap dibayar dari NuansaPulsa.
          </p>
        </div>

        <Link
          href="/user/saldo"
          prefetch={false}
          aria-label="Lihat saldo akun"
          className="absolute right-0 top-[74px] z-20 w-[clamp(178px,51vw,208px)] rounded-[18px] bg-white px-3 py-2.5 text-left text-slate-700 shadow-[0_18px_40px_rgba(90,6,20,0.22)] ring-1 ring-white/80"
        >
          <span className="flex items-start gap-2.5">
            <span className="relative mt-0.5 h-8 w-8 shrink-0 overflow-hidden rounded-full bg-[#fff1f2]">
              <Image src="/nuansapulsa-assets/icon_saldo_badge.png" alt="" fill sizes="32px" className="object-contain" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-semibold leading-3 text-slate-500">Saldo Anda</span>
              <span className="mt-1 block truncate text-base font-black leading-5 text-[#d70717]">{formatIDR(saldo)}</span>
              <span className="mt-2 inline-flex h-7 w-full items-center justify-center rounded-full bg-[#d70717] px-2.5 text-xs font-black text-white">
                + Top Up
              </span>
            </span>
          </span>
        </Link>
      </div>
    </section>
  );
}

function UserHomeInfoStrip() {
  return (
    <section className="relative z-10 overflow-hidden rounded-[18px] bg-white px-3.5 py-3 shadow-[0_16px_34px_rgba(99,24,34,0.11)] ring-1 ring-red-950/[0.04]">
      <div className="flex items-center gap-2.5">
        <span className="relative h-10 w-10 shrink-0">
          <Image src="/nuansapulsa-assets/icon_flash_info.png" alt="" fill sizes="40px" className="object-contain" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-medium leading-4 text-slate-600">Transaksi Cepat, Harga Bersahabat</span>
          <span className="mt-0.5 block text-sm font-black leading-4 text-slate-950">Koneksi Lancar, Hidup Makin Mudah!</span>
        </span>
        <Link
          href="/user/kategori"
          prefetch={false}
          aria-label="Lihat layanan"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] bg-linear-to-br from-[#ffb000] to-[#ff6a00] text-white shadow-[0_16px_34px_rgba(255,106,0,0.24)]"
        >
          <ChevronRight className="h-6 w-6" strokeWidth={3} />
        </Link>
      </div>
    </section>
  );
}

export default async function UserAppHomePage() {
  const session = (await getAppServerSession()) as SessionShape | null;
  const [categories, profile] = await Promise.all([
    getCategories() as Promise<UserCategoryItem[]>,
    session?.backendToken ? getUserProfile(session.backendToken) : Promise.resolve(null),
  ]);
  const role = String(profile?.role || session?.user?.role || "").trim().toLowerCase();
  const isAgent = role === "agent";
  const saldo = Number(profile?.saldo || 0);

  return (
    <main className="bg-[#fff6f4]">
      {session?.backendToken ? <UserAuthClientSync backendToken={session.backendToken} /> : null}
      <UserHomeHero saldo={saldo} />
      <div className="-mt-6 space-y-4 px-4">
        <UserHomeInfoStrip />
        <UserCategoryGrid items={categories} />
        <Suspense fallback={<GuestAdsCarouselSkeleton />}>
          <GuestAdsSection />
        </Suspense>
        <UserRecentActivity href="/user/kategori" />
        <UserFavoriteTransactions href="/user/kategori" />
        <UserMonthlyBills
          href="/user/listrik/tagihan"
          variant={isAgent ? "agent" : "user"}
          agentBills={[]}
        />
      </div>

      <UserBottomNav />
    </main>
  );
}
