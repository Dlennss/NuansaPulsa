import Link from "next/link";
import { ArrowUpRight, Bell, BookOpen, Clock3, Code2, Heart, PlugZap, ReceiptText, Smartphone, WalletCards } from "lucide-react";
import type { AgentCreditApplication } from "@/lib/api.auth";

export function UserPulsaDataShortcut() {
  return (
    <section>
      <Link
        href="/user/pulsa-data"
        prefetch={false}
        className="group block overflow-hidden rounded-lg border border-red-950/10 bg-[linear-gradient(135deg,#fff7f5_0%,#ffffff_55%,#fff7df_100%)] p-5 shadow-[0_10px_24px_rgba(151,14,32,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(151,14,32,0.12)]"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d70717]">Shortcut Cepat</p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">Pulsa & Data by Nomor</h2>
            <p className="mt-2 text-sm text-slate-600">Masukkan nomor HP, deteksi operator otomatis, lalu pilih tab pulsa atau data tanpa cari brand manual.</p>
          </div>
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-red-50 text-[#d70717] transition group-hover:scale-105">
            <Code2 className="h-5 w-5" />
          </div>
        </div>
      </Link>
    </section>
  );
}

export function UserApiCTA() {
  return (
    <section>
      <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#b20717_0%,#d70717_58%,#ff6a00_130%)] p-4 text-white shadow-[0_20px_44px_rgba(151,14,32,0.24)] ring-1 ring-red-200/20">
        <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-amber-300/25 blur-3xl" />
        <div className="absolute -bottom-20 left-8 h-40 w-40 rounded-full bg-red-400/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(255,255,255,0.18),transparent_30%),linear-gradient(135deg,rgba(255,106,0,0.18),rgba(255,196,0,0.08))]" />
        <div className="absolute inset-0 opacity-[0.12] bg-[repeating-radial-gradient(circle_at_0_100%,rgba(255,255,255,0.8)_0,rgba(255,255,255,0.8)_1px,transparent_1px,transparent_12px)] bg-size-[160%_130%]" />

        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-amber-100 ring-1 ring-white/15">
                <PlugZap className="h-3.5 w-3.5" />
                Kemitraan
              </div>
              <h2 className="mt-3 text-2xl leading-none font-black tracking-tight">API Reseller</h2>
              <p className="mt-2 max-w-[270px] text-sm leading-6 font-semibold text-white/78">
                Integrasi H2H untuk reseller, agen, dan website yang ingin transaksi otomatis.
              </p>
            </div>
            <div className="grid h-13 w-13 shrink-0 place-items-center rounded-[20px] bg-white/12 text-amber-100 shadow-[0_12px_24px_rgba(0,0,0,0.16)] ring-1 ring-white/20">
              <Code2 className="h-6 w-6" strokeWidth={2.4} />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-white/10 px-3 py-2 ring-1 ring-white/12">
              <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/52">Mode</p>
              <p className="mt-0.5 text-xs font-black text-white">H2H API</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-3 py-2 ring-1 ring-white/12">
              <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/52">Cocok</p>
              <p className="mt-0.5 text-xs font-black text-white">Agen & Web</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Link
              href="/docs"
              prefetch={false}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-amber-300 px-3 text-sm font-black text-[#b20717] shadow-[0_12px_24px_rgba(255,196,0,0.24)] transition hover:bg-amber-200"
            >
              <BookOpen className="h-4 w-4" strokeWidth={2.5} />
              Dokumentasi
            </Link>
            <Link
              href="/artikel/cara-menjadi-member-h2h-nuansapulsa"
              prefetch={false}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/28 bg-white/10 px-3 text-sm font-black text-white! shadow-[0_12px_24px_rgba(0,0,0,0.12)] transition hover:bg-white/15 visited:text-white! hover:text-white!"
            >
              Pelajari H2H
              <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function UserWeeklyPromo() {
  return (
    <section>
      <div className="h-44 rounded-lg bg-[linear-gradient(135deg,#d70717_0%,#ef1717_58%,#ff6a00_125%)] p-5 text-white shadow-sm">
        <p className="text-sm font-semibold text-white/90">Promo Mingguan</p>
        <h2 className="mt-2 max-w-70 text-2xl leading-tight font-bold">Yuk, isi kebutuhan digital lebih hemat!</h2>
      </div>
    </section>
  );
}

type UserHomeSummaryProps = {
  href?: string;
  billsHref?: string;
  variant?: "user" | "agent";
  agentBills?: AgentCreditApplication[];
};

function formatIDR(value: number) {
  return `Rp ${new Intl.NumberFormat("id-ID").format(Number(value || 0))}`;
}

export function UserHomeSummary({ href = "/kategori", billsHref = "/listrik/tagihan", variant = "user" }: UserHomeSummaryProps) {
  const outstanding = 0;
  const summaryItems = [
    {
      label: "Aktivitas",
      value: "0",
      note: "Hari ini",
      icon: Clock3,
      className: "bg-red-50 text-[#d70717] ring-red-100",
    },
    {
      label: "Favorit",
      value: "0",
      note: "Otomatis",
      icon: Heart,
      className: "bg-amber-50 text-[#f97316] ring-amber-100",
    },
    {
      label: variant === "agent" ? "Kredit" : "Tagihan",
      value: variant === "agent" ? formatIDR(outstanding) : "0",
      note: variant === "agent" ? "Limit aktif" : "Tersimpan",
      icon: variant === "agent" ? WalletCards : ReceiptText,
      className: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    },
  ];

  return (
    <section className="overflow-hidden rounded-[24px] border border-red-950/10 bg-white shadow-[0_14px_34px_rgba(151,14,32,0.08)]">
      <div className="relative overflow-hidden bg-[linear-gradient(135deg,#fff7f6_0%,#ffffff_58%,#fff4de_100%)] px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#d70717]">Ringkasan Hari Ini</p>
            <h2 className="mt-1 text-xl leading-6 font-black tracking-tight text-slate-950">Pantau akun tanpa ribet</h2>
            <p className="mt-1.5 max-w-[260px] text-xs leading-5 font-semibold text-slate-500">
              Aktivitas, favorit, dan tagihan akan terisi otomatis setelah kamu mulai transaksi.
            </p>
          </div>
          <Link
            href={href}
            prefetch={false}
            className="hidden h-11 shrink-0 items-center justify-center gap-1.5 rounded-[16px] bg-[linear-gradient(135deg,#d70717,#ff6a00)] px-4 text-xs font-black text-white! shadow-[0_12px_24px_rgba(215,7,23,0.18)] transition visited:text-white! hover:-translate-y-0.5 hover:brightness-105 hover:text-white! sm:inline-flex"
          >
            Mulai Transaksi
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.7} />
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {summaryItems.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.label} className="min-w-0 rounded-[18px] border border-slate-200/80 bg-white px-2.5 py-3 shadow-[0_10px_22px_rgba(15,23,42,0.04)]">
                <span className={`grid h-9 w-9 place-items-center rounded-[14px] ring-1 ${item.className}`}>
                  <Icon className="h-4.5 w-4.5" strokeWidth={2.4} />
                </span>
                <p className="mt-2 truncate text-lg font-black leading-5 text-slate-950">{item.value}</p>
                <p className="mt-0.5 truncate text-[10px] font-black text-slate-700">{item.label}</p>
                <p className="mt-0.5 truncate text-[10px] font-semibold text-slate-400">{item.note}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-3">
        <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-[16px] bg-[#fff1f2] text-[#d70717] ring-1 ring-red-100">
          <Bell className="h-5 w-5" strokeWidth={2.4} />
          <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full bg-amber-300 ring-2 ring-white" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-black leading-4 text-slate-950">Belum ada riwayat baru</span>
          <span className="mt-1 block text-[11px] font-semibold leading-4 text-slate-500">
            Transaksi dan update akun nanti masuk ke aktivitas serta notifikasi.
          </span>
        </span>
        <Link
          href={variant === "agent" ? href : billsHref}
          prefetch={false}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-[15px] bg-[linear-gradient(135deg,#ffb000,#ff6a00)] text-white shadow-[0_12px_24px_rgba(255,106,0,0.20)] transition hover:-translate-y-0.5 hover:brightness-105"
          aria-label={variant === "agent" ? "Mulai transaksi" : "Cek tagihan"}
        >
          <ArrowUpRight className="h-5 w-5" strokeWidth={2.6} />
        </Link>
      </div>
    </section>
  );
}

export function UserAboutSection() {
  return (
    <section>
      <div className="rounded-lg border border-red-950/10 bg-white px-4 py-6 shadow-[0_10px_24px_rgba(151,14,32,0.08)]">
        <h3 className="text-lg leading-tight font-bold text-slate-900">NuansaPulsa - Solusi Digital untuk Kebutuhan Sehari-hari</h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 text-justify">
          NuansaPulsa hadir sebagai platform digital untuk memenuhi kebutuhan transaksi online Anda. Tersedia pembayaran praktis dan harga kompetitif. 
          <span><Link href="/tentang" prefetch={false} className="text-[#d70717]! hover:underline!">
            Selengkapnya
          </Link></span>
        </p>
      </div>
    </section>
  );
}
