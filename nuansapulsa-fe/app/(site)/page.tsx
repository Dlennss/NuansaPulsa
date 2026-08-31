import { Suspense } from "react";
import Script from "next/script";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { authOptions } from "@/lib/nextauth";
import { getCategories } from "@/lib/api.products";
import type { UserCategoryItem, UserSession } from "@/components/user/types";
import { GuestBottomNav } from "@/components/guest/GuestBottomNav";
import { GuestCategoryGrid } from "@/components/guest/GuestCategoryGrid";
import { GuestAdsSection } from "@/components/guest/GuestAdsSection";
import { GuestAdsCarouselSkeleton } from "@/components/guest/GuestAdsCarouselSkeleton";
import { CANONICAL_SITE_URL } from "@/lib/seo-articles";

type SessionShape = {
  user?: UserSession;
  backendToken?: string;
};

const homeTitle = "NuansaPulsa | Pulsa, Paket Data, E-Wallet, Token Listrik, Game & PPOB";
const homeDescription =
  "NuansaPulsa melayani isi pulsa, paket data, top up e-wallet, token listrik, top up game, dan pembayaran PPOB dengan alur cepat untuk pelanggan, member, dan agen.";

export const metadata: Metadata = {
  title: homeTitle,
  description: homeDescription,
  keywords: [
    "NuansaPulsa",
    "isi pulsa online",
    "paket data murah",
    "top up e-wallet",
    "token listrik online",
    "top up game",
    "PPOB online",
  ],
  alternates: {
    canonical: CANONICAL_SITE_URL,
  },
  openGraph: {
    title: homeTitle,
    description: homeDescription,
    url: CANONICAL_SITE_URL,
    siteName: "NuansaPulsa",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "NuansaPulsa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: homeDescription,
    images: ["/twitter-image"],
  },
};

function HomeHero({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section className="relative isolate aspect-[1024/306] min-h-[260px] overflow-hidden rounded-b-[34px] bg-[#e50917] text-white shadow-[0_18px_42px_rgba(151,14,32,0.28)] md:min-h-0">
      <Image
        src="/nuansapulsa-assets/header_hero_lengkap.png"
        alt=""
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 1024px"
        className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-x-0 top-0 flex items-start justify-between px-[3.4%] pt-[3.6%]">
        <button
          type="button"
          aria-label="Menu"
          className="h-12 w-12 rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70 md:h-14 md:w-14"
        />
        <Link
          href={isLoggedIn ? "/user/notifikasi" : "/login"}
          prefetch={false}
          aria-label="Notifikasi"
          className="h-12 w-12 rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70 md:h-14 md:w-14"
        />
      </div>

      <Link
        href={isLoggedIn ? "/user/account/topup" : "/login"}
        prefetch={false}
        aria-label="Top Up"
        className="absolute right-[3.4%] top-[36%] h-[42%] w-[28%] rounded-[22px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
      />
    </section>
  );
}

function HomeInfoStrip() {
  return (
    <section className="relative z-10 overflow-hidden rounded-[20px] bg-white px-8 py-6 shadow-[0_16px_34px_rgba(99,24,34,0.11)] ring-1 ring-red-950/[0.04]">
      <div className="flex items-center gap-5">
        <span className="relative h-16 w-16 shrink-0">
          <Image src="/nuansapulsa-assets/icon_flash_info.png" alt="" fill sizes="64px" className="object-contain" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xl font-medium leading-6 text-slate-600 md:text-2xl">Transaksi Cepat, Harga Bersahabat</span>
          <span className="mt-1 block text-2xl font-black leading-8 text-slate-950 md:text-3xl">Koneksi Lancar, Hidup Makin Mudah!</span>
        </span>
        <Link
          href="/kategori"
          prefetch={false}
          aria-label="Lihat layanan"
          className="grid h-20 w-20 shrink-0 place-items-center rounded-[16px] bg-linear-to-br from-[#ffb000] to-[#ff6a00] text-white shadow-[0_16px_34px_rgba(255,106,0,0.24)]"
        >
          <ChevronRight className="h-10 w-10" strokeWidth={3} />
        </Link>
      </div>
    </section>
  );
}

function HomeRecentActivity() {
  const items = [
    {
      label: "Pulsa Telkomsel 25.000",
      time: "20 Mei 2025  •  10:21",
      amount: "Rp 25.000",
      icon: "/nuansapulsa-assets/aktivitas_pulsa.png",
    },
    {
      label: "Token Listrik 20.000",
      time: "20 Mei 2025  •  09:15",
      amount: "Rp 20.000",
      icon: "/nuansapulsa-assets/aktivitas_listrik.png",
    },
  ];

  return (
    <section className="rounded-[22px] bg-white px-8 py-5 shadow-[0_14px_34px_rgba(99,24,34,0.09)] ring-1 ring-red-950/[0.04]">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
        <h2 className="text-2xl font-black tracking-tight text-slate-950 md:text-3xl">Aktivitas Terakhir</h2>
        <Link href="/transaksi" prefetch={false} className="inline-flex items-center gap-2 text-base font-bold text-[#d70717] md:text-xl">
          Lihat Semua
          <ChevronRight className="h-6 w-6" strokeWidth={2.6} />
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {items.map((item) => (
          <Link key={item.label} href="/transaksi" prefetch={false} className="flex items-center gap-5 py-4">
            <span className="relative h-14 w-14 shrink-0">
              <Image src={item.icon} alt="" fill sizes="56px" className="object-contain" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-lg font-black text-slate-950 md:text-2xl">{item.label}</span>
              <span className="mt-1 block text-base font-medium text-slate-500 md:text-xl">{item.time}</span>
            </span>
            <span className="shrink-0 text-right">
              <span className="inline-flex rounded-full bg-emerald-100 px-4 py-1 text-sm font-black text-emerald-700 md:text-lg">Berhasil</span>
              <span className="mt-1 block text-base font-semibold text-slate-700 md:text-xl">{item.amount}</span>
            </span>
            <ChevronRight className="h-8 w-8 shrink-0 text-slate-400" strokeWidth={2.4} />
          </Link>
        ))}
      </div>
    </section>
  );
}

export default async function GuestHomePage() {
  const session = (await getServerSession(authOptions)) as SessionShape | null;
  const categories = (await getCategories()) as UserCategoryItem[];
  const activeCategories = categories.filter((item) => item.aktif);

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NuansaPulsa",
    url: CANONICAL_SITE_URL,
    description: homeDescription,
    inLanguage: "id-ID",
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NuansaPulsa",
    url: CANONICAL_SITE_URL,
    logo: `${CANONICAL_SITE_URL}/images/logo-nuansapulsa.svg`,
    image: `${CANONICAL_SITE_URL}/opengraph-image`,
    description: homeDescription,
  };

  const catalogJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "NuansaPulsa",
    url: CANONICAL_SITE_URL,
    description: homeDescription,
    about: activeCategories.map((item) => item.nama),
    mainEntity: {
      "@type": "OfferCatalog",
      name: "Kategori Produk NuansaPulsa",
      itemListElement: activeCategories.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Thing",
          name: item.nama,
        },
      })),
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Produk apa saja yang tersedia di NuansaPulsa?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "NuansaPulsa menyediakan isi pulsa, paket data, top up e-wallet, token listrik, top up game, BPJS, PDAM, internet pascabayar, TV, dan layanan PPOB lain untuk pelanggan, member, dan agen.",
        },
      },
      {
        "@type": "Question",
        name: "Apakah NuansaPulsa cocok untuk calon member dan agen?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ya. NuansaPulsa bisa dipakai untuk kebutuhan transaksi harian sekaligus untuk member, agen, reseller, dan kebutuhan H2H dengan katalog produk digital yang lengkap.",
        },
      },
      {
        "@type": "Question",
        name: "Apa keunggulan NuansaPulsa untuk transaksi produk digital?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "NuansaPulsa menata kategori produk secara jelas, menyediakan banyak layanan dalam satu tempat, dan memudahkan pembeli maupun penjual untuk melayani kebutuhan digital harian dengan lebih cepat.",
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#f7f7f7] pb-28">
      <Script id="homepage-website-jsonld" type="application/ld+json">
        {JSON.stringify(websiteJsonLd)}
      </Script>
      <Script id="homepage-organization-jsonld" type="application/ld+json">
        {JSON.stringify(organizationJsonLd)}
      </Script>
      <Script id="homepage-catalog-jsonld" type="application/ld+json">
        {JSON.stringify(catalogJsonLd)}
      </Script>
      <Script id="homepage-faq-jsonld" type="application/ld+json">
        {JSON.stringify(faqJsonLd)}
      </Script>
      <HomeHero isLoggedIn={!!session?.backendToken} />
      <div className="mx-auto -mt-7 max-w-[954px] space-y-5 px-4 md:px-0">
        <HomeInfoStrip />
        <GuestCategoryGrid items={categories} />
        <Suspense fallback={<GuestAdsCarouselSkeleton />}>
          <GuestAdsSection />
        </Suspense>
        <HomeRecentActivity />
      </div>

      <GuestBottomNav isLoggedIn={!!session?.backendToken} />
    </main>
  );
}
