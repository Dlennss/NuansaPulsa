import { Suspense } from "react";
import Script from "next/script";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import type { Metadata } from "next";
import { ChevronRight, ClipboardCheck, Grid3X3, ShieldCheck } from "lucide-react";
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
    <section className="relative isolate h-[280px] overflow-hidden rounded-b-[30px] bg-[#e50917] text-white shadow-[0_18px_42px_rgba(151,14,32,0.24)]">
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
        href="/"
        prefetch={false}
        aria-label="NuansaPulsa"
        className="absolute left-5 top-5 h-[46px] w-[clamp(190px,64vw,260px)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
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

      {isLoggedIn ? (
        <Link
          href="/user/saldo"
          prefetch={false}
          aria-label="Lihat saldo"
          className="absolute bottom-9 right-7 flex w-[clamp(184px,54vw,212px)] rounded-[17px] bg-white px-2.5 py-2.5 text-slate-700 shadow-[0_18px_40px_rgba(90,6,20,0.2)] ring-1 ring-white/70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
        >
          <span className="relative mr-2.5 h-8 w-8 shrink-0 overflow-hidden rounded-full bg-[#fff1f2]">
            <Image src="/nuansapulsa-assets/icon_saldo_badge.png" alt="" fill sizes="32px" className="object-contain" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-semibold leading-3 text-slate-500">Saldo Anda</span>
            <span className="mt-1 block text-sm font-black leading-4 text-[#d70717]">Lihat saldo akun</span>
            <span className="mt-2 inline-flex h-7 w-full items-center justify-center rounded-full bg-[#d70717] px-2.5 text-xs font-black text-white">
              Buka Saldo
            </span>
          </span>
        </Link>
      ) : (
        <div className="absolute inset-x-5 bottom-13">
          <div className="max-w-[245px]">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-yellow-200">Satu menu digital</p>
            <h1 className="mt-1 text-[26px] font-black leading-[1.02] tracking-tight text-white drop-shadow-sm">
              Isi Pulsa dan Bayar Tagihan Lebih Mudah
            </h1>
            <p className="mt-2 text-xs font-semibold leading-4 text-white/85">Pulsa, data, PLN, e-wallet, game, dan PPOB siap dipilih.</p>
          </div>
          <Link
            href="/kategori"
            prefetch={false}
            className="mt-4 inline-flex h-10 items-center justify-center gap-1 rounded-full bg-white px-4 text-sm font-black text-[#d70717] shadow-[0_14px_28px_rgba(99,24,34,0.22)] ring-1 ring-white/70"
          >
            Mulai Sekarang
            <ChevronRight className="h-4 w-4" strokeWidth={3} />
          </Link>
        </div>
      )}
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

function HomePopularActions() {
  const items = [
    {
      label: "Pilih Layanan",
      description: "Pulsa, data, e-wallet, PLN, game, dan PPOB.",
      icon: Grid3X3,
    },
    {
      label: "Isi Data",
      description: "Masukkan nomor atau ID pelanggan dengan rapi.",
      icon: ClipboardCheck,
    },
    {
      label: "Bayar Aman",
      description: "Lanjutkan pembayaran dan pantau status transaksi.",
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="overflow-hidden rounded-[24px] bg-white shadow-[0_16px_36px_rgba(99,24,34,0.10)] ring-1 ring-red-950/[0.04]">
      <div className="relative overflow-hidden bg-linear-to-br from-[#e50914] via-[#f42516] to-[#ff7a00] px-4 py-4 text-white">
        <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full border border-white/20" />
        <div className="absolute right-7 top-3 h-12 w-12 rounded-full border border-white/20" />
        <div className="relative flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-black tracking-tight">Mulai Transaksi</h2>
            <p className="mt-1 text-xs font-semibold leading-4 text-white/85">Semua kebutuhan digital dalam satu menu NuansaPulsa.</p>
          </div>
          <Link
            href="/kategori"
            prefetch={false}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-1 rounded-full bg-[#7a0612] px-4 text-xs font-black text-white shadow-[0_12px_24px_rgba(99,24,34,0.22)] ring-1 ring-white/25"
          >
            Buka Menu
            <ChevronRight className="h-4 w-4" strokeWidth={3} />
          </Link>
        </div>
      </div>

      <div className="grid gap-2 p-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center gap-3 rounded-2xl bg-[#fff7f5] px-3 py-3 ring-1 ring-red-100/70">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-[#e50914] shadow-[0_10px_22px_rgba(215,7,23,0.10)]">
                <Icon className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-black leading-4 text-slate-950">{item.label}</span>
                <span className="mt-1 block text-xs font-semibold leading-4 text-slate-500">{item.description}</span>
              </span>
            </div>
          );
        })}
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
        <HomePopularActions />
      </div>

      <GuestBottomNav isLoggedIn={!!session?.backendToken} />
    </main>
  );
}
