import { Suspense } from "react";
import Script from "next/script";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import type { Metadata } from "next";
import { Bell, Menu, Plus } from "lucide-react";
import { authOptions } from "@/lib/nextauth";
import { getCategories } from "@/lib/api.products";
import type { UserCategoryItem, UserSession } from "@/components/user/types";
import { UserFavoriteTransactions, UserMonthlyBills, UserRecentActivity } from "@/components/user/UserMainSections";
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
    <section className="relative isolate overflow-hidden rounded-b-[34px] bg-[#c90416] px-4 pb-12 pt-5 text-white shadow-[0_18px_42px_rgba(151,14,32,0.28)]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_18%,rgba(255,214,0,0.34),transparent_18rem),linear-gradient(135deg,#ff1f14_0%,#d70717_42%,#900f23_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-[linear-gradient(168deg,transparent_35%,rgba(255,205,0,0.32)_36%,transparent_58%)]" />
      <div className="mx-auto flex max-w-md items-center justify-between">
        <button
          type="button"
          aria-label="Menu"
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/15"
        >
          <Menu className="h-6 w-6" strokeWidth={2.4} />
        </button>
        <Link
          href={isLoggedIn ? "/user/notifikasi" : "/login"}
          prefetch={false}
          aria-label="Notifikasi"
          className="relative grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/15"
        >
          <Bell className="h-5 w-5" strokeWidth={2.25} />
          <span className="absolute right-1 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-[#ffd200] px-1 text-[10px] font-black leading-none text-[#d70717]">
            3
          </span>
        </Link>
      </div>

      <div className="mx-auto mt-7 max-w-md">
        <div className="relative h-16 w-[min(82vw,360px)]">
          <Image
            src="/nuansapulsa-assets/logo_full_dengan_tagline.png"
            alt="NuansaPulsa"
            fill
            priority
            sizes="360px"
            className="object-contain object-left"
          />
        </div>

        <div className="mt-5 ml-auto w-[min(70vw,286px)] rounded-[20px] bg-white p-4 text-[#303544] shadow-[0_18px_40px_rgba(90,6,20,0.22)] ring-1 ring-white/70">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[#fff1f2]">
              <Image
                src="/nuansapulsa-assets/icon_saldo_badge.png"
                alt=""
                fill
                sizes="48px"
                className="object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-500">Saldo Anda</p>
              <p className="mt-0.5 text-2xl font-black leading-none text-[#d70717]">Rp 125.000</p>
            </div>
          </div>
          <Link
            href={isLoggedIn ? "/user/account/topup" : "/login"}
            prefetch={false}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#d70717] px-4 py-2.5 text-sm font-black text-white shadow-[0_10px_22px_rgba(215,7,23,0.24)]"
          >
            <Plus className="h-4 w-4" strokeWidth={3} />
            Top Up
          </Link>
        </div>
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
    <main className="min-h-screen bg-[#f7f7f7] pb-24">
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
        <GuestCategoryGrid items={categories} />
        <Suspense fallback={<GuestAdsCarouselSkeleton />}>
          <GuestAdsSection />
        </Suspense>
        <UserRecentActivity href="/kategori" />
        <UserFavoriteTransactions href="/kategori" />
        <UserMonthlyBills href="/listrik/tagihan" />
      </div>

      <GuestBottomNav isLoggedIn={!!session?.backendToken} />
    </main>
  );
}
