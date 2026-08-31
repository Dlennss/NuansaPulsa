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
    <section className="relative isolate h-[300px] overflow-hidden rounded-b-[34px] bg-[#e50917] text-white shadow-[0_18px_42px_rgba(151,14,32,0.28)]">
      <Image
        src="/nuansapulsa-assets/header_hero_lengkap.png"
        alt=""
        fill
        priority
        sizes="(max-width: 480px) 100vw, 390px"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[76%_center]"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-[#ff2515]/95 via-[#e40718]/82 to-[#9f0f25]/88" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-[linear-gradient(166deg,transparent_24%,rgba(255,182,0,0.38)_25%,rgba(229,9,23,0.15)_53%,transparent_70%)]" />

      <Link
        href="/"
        prefetch={false}
        aria-label="NuansaPulsa"
        className="absolute left-5 top-5 h-[50px] w-[clamp(200px,68vw,272px)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
      >
        <Image
          src="/nuansapulsa-assets/logo_full_dengan_tagline.png"
          alt="NuansaPulsa"
          fill
          priority
          sizes="(max-width: 480px) 68vw, 272px"
          className="object-contain object-left"
        />
      </Link>

      <Link
        href={isLoggedIn ? "/user/account/topup" : "/login"}
        prefetch={false}
        aria-label="Top Up"
        className="absolute bottom-10 right-4 flex w-[clamp(208px,60vw,232px)] rounded-[20px] bg-white px-3 py-3 text-slate-700 shadow-[0_18px_40px_rgba(90,6,20,0.22)] ring-1 ring-white/70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
      >
        <span className="relative mr-3 h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#fff1f2]">
          <Image src="/nuansapulsa-assets/icon_saldo_badge.png" alt="" fill sizes="40px" className="object-contain" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-semibold leading-4 text-slate-500">Saldo Anda</span>
          <span className="mt-0.5 block text-xl font-black leading-none text-[#d70717]">Rp 125.000</span>
          <span className="mt-2 inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-full bg-[#d70717] px-3 text-sm font-black text-white">
            <span className="text-base leading-none">+</span>
            Top Up
          </span>
        </span>
      </Link>
    </section>
  );
}

function HomeInfoStrip() {
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
          href="/kategori"
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
    <section className="rounded-[22px] bg-white px-4 py-4 shadow-[0_14px_34px_rgba(99,24,34,0.09)] ring-1 ring-red-950/[0.04]">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
        <h2 className="text-lg font-black tracking-tight text-slate-950">Aktivitas Terakhir</h2>
        <Link href="/transaksi" prefetch={false} className="inline-flex items-center gap-1 text-sm font-bold text-[#d70717]">
          Lihat Semua
          <ChevronRight className="h-5 w-5" strokeWidth={2.6} />
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {items.map((item) => (
          <Link key={item.label} href="/transaksi" prefetch={false} className="flex items-center gap-3 py-3">
            <span className="relative h-11 w-11 shrink-0">
              <Image src={item.icon} alt="" fill sizes="44px" className="object-contain" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-black text-slate-950">{item.label}</span>
              <span className="mt-1 block text-xs font-medium text-slate-500">{item.time}</span>
            </span>
            <span className="shrink-0 text-right">
              <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">Berhasil</span>
              <span className="mt-1 block text-xs font-semibold text-slate-700">{item.amount}</span>
            </span>
            <ChevronRight className="h-5 w-5 shrink-0 text-slate-400" strokeWidth={2.4} />
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
      <div className="mx-auto -mt-8 max-w-md space-y-4 px-4">
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
