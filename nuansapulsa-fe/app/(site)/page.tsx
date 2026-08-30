import { Suspense } from "react";
import Script from "next/script";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import type { Metadata } from "next";
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
    <section className="relative isolate h-[352px] overflow-hidden rounded-b-[34px] bg-[#e50917] text-white shadow-[0_18px_42px_rgba(151,14,32,0.28)]">
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

      <div className="mx-auto flex max-w-md items-start justify-between px-5 pt-5">
        <button
          type="button"
          aria-label="Menu"
          className="relative h-12 w-12 overflow-hidden rounded-full bg-white/12 shadow-[0_10px_24px_rgba(99,15,28,0.18)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
        >
          <Image src="/nuansapulsa-assets/icon_menu_hamburger.png" alt="" fill sizes="48px" className="object-contain p-3.5" />
        </button>
        <Link
          href={isLoggedIn ? "/user/notifikasi" : "/login"}
          prefetch={false}
          aria-label="Notifikasi"
          className="relative h-12 w-12 overflow-hidden rounded-full bg-white/12 shadow-[0_10px_24px_rgba(99,15,28,0.18)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
        >
          <Image src="/nuansapulsa-assets/icon_notifikasi_badge_3.png" alt="" fill sizes="48px" className="object-contain p-2.5" />
        </Link>
      </div>

      <Link
        href={isLoggedIn ? "/user/account/topup" : "/login"}
        prefetch={false}
        aria-label="Top Up"
        className="absolute left-1/2 top-[92px] flex w-[min(86vw,340px)] -translate-x-1/2 flex-col items-center focus-visible:outline-none"
      >
        <span className="relative mb-3 block h-[76px] w-full">
          <Image src="/nuansapulsa-assets/logo_full_dengan_tagline.png" alt="NuansaPulsa" fill priority sizes="340px" className="object-contain object-left" />
        </span>
        <span className="relative block h-[132px] w-[min(78vw,288px)] self-end rounded-[22px] focus-visible:ring-4 focus-visible:ring-white/70">
          <Image src="/nuansapulsa-assets/kartu_saldo.png" alt="Saldo Anda Rp 125.000, Top Up" fill sizes="288px" className="object-contain drop-shadow-[0_18px_40px_rgba(90,6,20,0.22)]" />
        </span>
      </Link>
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
      <div className="mx-auto -mt-[58px] max-w-md space-y-4 px-4">
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
