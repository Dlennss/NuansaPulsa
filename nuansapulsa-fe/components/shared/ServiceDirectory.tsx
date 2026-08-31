"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowUpDown,
  BookOpen,
  Building2,
  CarFront,
  ChevronRight,
  CircleParking,
  CreditCard,
  Droplets,
  Flame,
  Gamepad2,
  GraduationCap,
  HandHeart,
  Headphones,
  Home,
  Landmark,
  PhoneCall,
  Plane,
  QrCode,
  RefreshCw,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Stethoscope,
  TicketPercent,
  Truck,
  Tv,
  UsersRound,
  WalletCards,
  Wifi,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type DirectoryMode = "guest" | "user";

type ServiceItem = {
  label: string;
  href: string;
  iconKey: string;
};

type ServiceGroup = {
  id: string;
  title: string;
  eyebrow: string;
  items: ServiceItem[];
};

type ServiceDirectoryProps = {
  mode?: DirectoryMode;
  role?: string | null;
};

const guestPath = {
  pulsaData: "/pulsa-data",
  pulsa: "/pulsa",
  paketData: "/paket-data",
  ewallet: "/ewallet",
  transferBank: "/kategori?layanan=transfer-bank",
  game: "/game",
  pln: "/listrik",
  tokenPln: "/listrik/token",
  pdam: "/pdam",
  pgn: "/pgn",
  bpjs: "/bpjs",
  tv: "/tv",
  internet: "/internet-pascabayar",
  hpPascabayar: "/hp-pascabayar",
};

const userPath = {
  pulsaData: "/user/pulsa-data",
  pulsa: "/user/pulsa",
  paketData: "/user/paket-data",
  ewallet: "/user/ewallet",
  transferBank: "/user/transfer-bank",
  game: "/user/kategori?layanan=voucher-game",
  pln: "/user/listrik",
  tokenPln: "/user/listrik/token",
  pdam: "/user/kategori?layanan=pdam",
  pgn: "/user/kategori?layanan=gas-pgn",
  bpjs: "/user/kategori?layanan=bpjs",
  tv: "/user/kategori?layanan=tv-kabel",
  internet: "/user/kategori?layanan=internet-wifi",
  hpPascabayar: "/user/kategori/hp-pascabayar",
  esimRoaming: "/user/kategori/esim-roaming",
};

function fallbackPath(mode: DirectoryMode, slug: string) {
  return mode === "user" ? `/user/kategori?layanan=${slug}` : `/kategori?layanan=${slug}`;
}

function isAgentRole(role?: string | null) {
  const normalized = String(role || "").trim().toLowerCase();
  return normalized === "agent" || normalized === "retail_agent" || normalized === "agent_retail";
}

const iconPath = {
  pulsa: "pulsa",
  paketData: "paketData",
  hpPascabayar: "hpPascabayar",
  esimRoaming: "esimRoaming",
  ewallet: "ewallet",
  transferBank: "transferBank",
  qris: "qris",
  uangElektronik: "uangElektronik",
  kartuKredit: "kartuKredit",
  asuransi: "asuransi",
  bpjs: "bpjs",
  tokenPln: "tokenPln",
  pdam: "pdam",
  gasPgn: "gasPgn",
  internetWifi: "internetWifi",
  tvKabel: "tvKabel",
  voucherGame: "voucherGame",
  voucherDigital: "voucherDigital",
  streamingMusik: "streamingMusik",
  klinikKesehatan: "klinikKesehatan",
  uangSekolah: "uangSekolah",
  cicilanKendaraan: "cicilanKendaraan",
  cicilanMultifinance: "cicilanMultifinance",
  pbb: "pbb",
  pajakNegara: "pajakNegara",
  tiketPerjalanan: "tiketPerjalanan",
  saldoKartuTol: "saldoKartuTol",
  parkirDigital: "parkirDigital",
  kurirPengiriman: "kurirPengiriman",
  zakatDonasi: "zakatDonasi",
};

const directoryIcons: Record<string, LucideIcon> = {
  pulsa: Smartphone,
  paketData: ArrowUpDown,
  hpPascabayar: PhoneCall,
  esimRoaming: Smartphone,
  ewallet: WalletCards,
  transferBank: Landmark,
  qris: QrCode,
  uangElektronik: CreditCard,
  kartuKredit: CreditCard,
  asuransi: ShieldCheck,
  bpjs: UsersRound,
  tokenPln: Zap,
  pdam: Droplets,
  gasPgn: Flame,
  internetWifi: Wifi,
  tvKabel: Tv,
  voucherGame: Gamepad2,
  voucherDigital: TicketPercent,
  streamingMusik: Headphones,
  klinikKesehatan: Stethoscope,
  uangSekolah: GraduationCap,
  cicilanKendaraan: CarFront,
  cicilanMultifinance: RefreshCw,
  pbb: Home,
  pajakNegara: Building2,
  tiketPerjalanan: Plane,
  saldoKartuTol: CreditCard,
  parkirDigital: CircleParking,
  kurirPengiriman: Truck,
  zakatDonasi: HandHeart,
};

const blueIconKeys = new Set(["pdam", "internetWifi", "parkirDigital"]);

function DirectoryServiceIcon({ iconKey }: { iconKey: string }) {
  const Icon = directoryIcons[iconKey] || Sparkles;
  const isBlue = blueIconKeys.has(iconKey);

  return (
    <span className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-[16px] bg-white shadow-[0_10px_20px_rgba(151,14,32,0.09)] ring-1 ring-slate-200/80 transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_14px_26px_rgba(151,14,32,0.14)]">
      <span
        className={cn(
          "grid h-8 w-8 place-items-center rounded-[12px] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.38),0_8px_16px_rgba(215,7,23,0.20)]",
          isBlue
            ? "bg-[linear-gradient(135deg,#38bdf8_0%,#0ea5e9_52%,#2563eb_100%)]"
            : "bg-[linear-gradient(135deg,#ffb000_0%,#ff4d00_42%,#e50917_100%)]"
        )}
      >
        <Icon className="h-5 w-5" strokeWidth={2.8} />
      </span>
    </span>
  );
}

function getGroups(mode: DirectoryMode, role?: string | null): ServiceGroup[] {
  const path = mode === "user" ? userPath : guestPath;
  const normalizedRole = String(role || "").trim().toLowerCase();
  const canUseAgentCredit = mode === "user" && isAgentRole(normalizedRole);

  return [
    {
      id: "komunikasi",
      title: "Komunikasi",
      eyebrow: "Kebutuhan nomor",
      items: [
        { label: "Pulsa", href: path.pulsaData, iconKey: iconPath.pulsa },
        { label: "Paket Data", href: path.pulsaData, iconKey: iconPath.paketData },
        { label: "HP Pascabayar", href: path.hpPascabayar, iconKey: iconPath.hpPascabayar },
        { label: "eSIM & Roaming", href: mode === "user" ? userPath.esimRoaming : fallbackPath(mode, "esim-roaming"), iconKey: iconPath.esimRoaming },
      ],
    },
    {
      id: "keuangan",
      title: "Keuangan",
      eyebrow: "Saldo & pembayaran",
      items: [
        { label: "E-Wallet", href: path.ewallet, iconKey: iconPath.ewallet },
        { label: "Transfer Bank", href: path.transferBank, iconKey: iconPath.transferBank },
        { label: "Pembayaran QRIS", href: fallbackPath(mode, "qris"), iconKey: iconPath.qris },
        { label: "Uang Elektronik", href: fallbackPath(mode, "uang-elektronik"), iconKey: iconPath.uangElektronik },
        ...(canUseAgentCredit ? [{ label: "Kredit Saldo Agent", href: "/user/saldo/kredit-agent", iconKey: iconPath.cicilanMultifinance }] : []),
        { label: "Kartu Kredit", href: fallbackPath(mode, "kartu-kredit"), iconKey: iconPath.kartuKredit },
        { label: "Asuransi", href: fallbackPath(mode, "asuransi"), iconKey: iconPath.asuransi },
      ],
    },
    {
      id: "tagihan",
      title: "Tagihan",
      eyebrow: "Bayar rutin",
      items: [
        { label: "BPJS", href: path.bpjs, iconKey: iconPath.bpjs },
      ],
    },
    {
      id: "rumah",
      title: "Rumah Tangga",
      eyebrow: "Kebutuhan rumah",
      items: [
        { label: "Token PLN", href: path.tokenPln, iconKey: iconPath.tokenPln },
        { label: "PDAM", href: path.pdam, iconKey: iconPath.pdam },
        { label: "Gas PGN", href: path.pgn, iconKey: iconPath.gasPgn },
        { label: "Internet & WiFi", href: path.internet, iconKey: iconPath.internetWifi },
      ],
    },
    {
      id: "hiburan",
      title: "Hiburan",
      eyebrow: "Digital fun",
      items: [
        { label: "TV Kabel", href: path.tv, iconKey: iconPath.tvKabel },
        { label: "Voucher Game", href: path.game, iconKey: iconPath.voucherGame },
        { label: "Voucher Digital", href: fallbackPath(mode, "voucher-digital"), iconKey: iconPath.voucherDigital },
        { label: "Streaming & Musik", href: fallbackPath(mode, "streaming-musik"), iconKey: iconPath.streamingMusik },
      ],
    },
    {
      id: "kesehatan",
      title: "Kesehatan",
      eyebrow: "Layanan sehat",
      items: [
        { label: "Klinik & Kesehatan", href: fallbackPath(mode, "klinik-kesehatan"), iconKey: iconPath.klinikKesehatan },
      ],
    },
    {
      id: "pendidikan",
      title: "Pendidikan",
      eyebrow: "Biaya sekolah",
      items: [
        { label: "Uang Sekolah", href: fallbackPath(mode, "uang-sekolah"), iconKey: iconPath.uangSekolah },
      ],
    },
    {
      id: "cicilan",
      title: "Cicilan",
      eyebrow: "Bayar angsuran",
      items: [
        { label: "Cicilan Kendaraan", href: fallbackPath(mode, "cicilan-kendaraan"), iconKey: iconPath.cicilanKendaraan },
        { label: "Cicilan Multifinance", href: fallbackPath(mode, "cicilan-multifinance"), iconKey: iconPath.cicilanMultifinance },
      ],
    },
    {
      id: "pajak",
      title: "Pajak",
      eyebrow: "Kewajiban resmi",
      items: [
        { label: "PBB", href: fallbackPath(mode, "pbb"), iconKey: iconPath.pbb },
        { label: "Pajak & Negara", href: fallbackPath(mode, "pajak-negara"), iconKey: iconPath.pajakNegara },
      ],
    },
    {
      id: "perjalanan",
      title: "Perjalanan",
      eyebrow: "Mobilitas",
      items: [
        { label: "Tiket Perjalanan", href: fallbackPath(mode, "tiket-perjalanan"), iconKey: iconPath.tiketPerjalanan },
        { label: "Saldo Kartu Tol", href: fallbackPath(mode, "saldo-kartu-tol"), iconKey: iconPath.saldoKartuTol },
        { label: "Parkir Digital", href: fallbackPath(mode, "parkir-digital"), iconKey: iconPath.parkirDigital },
        { label: "Kurir & Pengiriman", href: fallbackPath(mode, "kurir-pengiriman"), iconKey: iconPath.kurirPengiriman },
      ],
    },
    {
      id: "sosial",
      title: "Sosial",
      eyebrow: "Berbagi",
      items: [
        { label: "Zakat & Donasi", href: fallbackPath(mode, "zakat-donasi"), iconKey: iconPath.zakatDonasi },
      ],
    },
  ];
}

export function ServiceDirectory({ mode = "guest", role }: ServiceDirectoryProps) {
  const groups = useMemo(() => getGroups(mode, role), [mode, role]);
  const [activeGroup, setActiveGroup] = useState("semua");
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();
  const filteredGroups = groups
    .filter((group) => activeGroup === "semua" || group.id === activeGroup)
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.label.toLowerCase().includes(normalizedQuery)),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <section className="space-y-3 pb-24">
      <div className="sticky top-0 z-20 -mx-4 bg-[#fff6f4]/92 px-4 pb-3 pt-3 backdrop-blur-xl">
        <label className="flex h-13 items-center gap-3 rounded-[22px] border border-red-950/10 bg-white px-4 shadow-[0_12px_30px_rgba(151,14,32,0.08)]">
          <Search className="h-5 w-5 shrink-0 text-[#d70717]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari pulsa, tagihan, voucher..."
            className="h-full min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
          />
        </label>

        <div className="-mx-4 mt-3 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-2">
            <button
              type="button"
              onClick={() => setActiveGroup("semua")}
              className={cn(
                "h-9 rounded-full px-4 text-xs font-black transition",
                activeGroup === "semua"
                  ? "bg-[#d70717] text-white shadow-[0_10px_20px_rgba(215,7,23,0.22)]"
                  : "border border-red-950/10 bg-white text-slate-600"
              )}
            >
              Semua
            </button>
            {groups.map((group) => (
              <button
                key={group.id}
                type="button"
                onClick={() => setActiveGroup(group.id)}
                className={cn(
                  "h-9 rounded-full px-4 text-xs font-black transition",
                  activeGroup === group.id
                    ? "bg-[#d70717] text-white shadow-[0_10px_20px_rgba(215,7,23,0.22)]"
                    : "border border-red-950/10 bg-white text-slate-600"
                )}
              >
                {group.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-amber-200/70 bg-linear-to-r from-[#fff4e7] via-white to-[#fff1f2] px-4 py-3 shadow-[0_12px_28px_rgba(151,14,32,0.08)]">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-orange-100 text-orange-500">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-black text-[#d70717]">Transaksi makin praktis</p>
            <p className="mt-0.5 text-[11px] font-semibold text-slate-500">Pilih layanan, isi data, lalu selesaikan pembayaran.</p>
          </div>
        </div>
      </div>

      {filteredGroups.length > 0 ? (
        filteredGroups.map((group) => (
          <div
            key={group.id}
            className="overflow-hidden rounded-[26px] border border-red-950/[0.08] bg-white p-4 shadow-[0_14px_34px_rgba(151,14,32,0.08)]"
          >
            <div className="mb-4 flex items-center gap-2">
              <h2 className="text-[17px] font-black tracking-tight text-slate-950">{group.title}</h2>
              <span className="rounded-full bg-rose-50 px-2 py-1 text-[10px] font-black text-[#d70717]">
                {group.items.length} layanan
              </span>
            </div>

            <div className="grid grid-cols-4 gap-x-2 gap-y-4">
              {group.items.map((item) => {
                return (
                  <Link
                    key={`${group.id}-${item.label}`}
                    href={item.href}
                    prefetch={false}
                    className="group flex min-h-[74px] flex-col items-center justify-start gap-1.5 text-center"
                  >
                    <DirectoryServiceIcon iconKey={item.iconKey} />
                    <span className="line-clamp-2 max-w-[76px] text-[10px] font-black leading-tight text-slate-950">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))
      ) : (
        <div className="rounded-[26px] border border-dashed border-red-200 bg-white p-8 text-center shadow-[0_14px_34px_rgba(151,14,32,0.08)]">
          <BookOpen className="mx-auto h-8 w-8 text-[#d70717]" />
          <p className="mt-3 text-sm font-black text-slate-900">Layanan tidak ditemukan</p>
          <p className="mt-1 text-xs font-semibold text-slate-500">Coba kata kunci yang lebih singkat.</p>
        </div>
      )}

      <Link
        href={mode === "user" ? "/user" : "/"}
        prefetch={false}
        className="group flex items-center justify-between rounded-[24px] border border-red-300/30 bg-[#d70717] px-4 py-4 text-white shadow-[0_16px_34px_rgba(151,14,32,0.22)]"
      >
        <span>
          <span className="block text-sm font-black !text-white">Kembali ke beranda</span>
          <span className="mt-0.5 block text-xs font-semibold !text-rose-50">Lihat promo dan produk utama.</span>
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-2xl border border-white/70 bg-amber-300 text-[#d70717] shadow-[0_8px_18px_rgba(245,158,11,0.28)] transition group-hover:translate-x-0.5">
          <ChevronRight className="h-5 w-5" strokeWidth={2.6} />
        </span>
      </Link>
    </section>
  );
}
