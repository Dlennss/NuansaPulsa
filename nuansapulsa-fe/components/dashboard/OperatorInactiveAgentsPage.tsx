"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, CalendarClock, RefreshCcw, Search, Store, Users } from "lucide-react";
import { fmtID } from "@/lib/format";

type InactiveAgent = {
  member_id: number;
  member_name: string;
  member_email: string;
  member_phone: string;
  marketing_name: string;
  marketing_email: string;
  last_transaction_at?: string;
  last_product: string;
  last_status: string;
  last_amount: number;
  inactive_days: number;
};

const periods = [
  { days: 3, label: "3 Hari" },
  { days: 7, label: "1 Minggu" },
  { days: 14, label: "2 Minggu" },
  { days: 21, label: "3 Minggu" },
  { days: 30, label: "1 Bulan" },
];

function dateLabel(value?: string) {
  if (!value) return "Belum pernah transaksi";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Belum pernah transaksi";
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(date);
}

export default function OperatorInactiveAgentsPage() {
  const [days, setDays] = useState(3);
  const [customDays, setCustomDays] = useState(3);
  const [query, setQuery] = useState("");
  const [draftQuery, setDraftQuery] = useState("");
  const [items, setItems] = useState<InactiveAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ days: String(days), limit: "200" });
      if (query) params.set("q", query);
      const token = localStorage.getItem("auth_token") || "";
      const response = await fetch(`/api/admin/agent-credit/inactive-agents?${params}`, {
        cache: "no-store",
        credentials: "same-origin",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) throw new Error(data.error || "Data konter belum dapat dimuat.");
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch (cause) {
      setItems([]);
      setError(cause instanceof Error ? cause.message : "Data konter belum dapat dimuat.");
    } finally {
      setLoading(false);
    }
  }, [days, query]);

  useEffect(() => { void load(); }, [load]);

  const headline = useMemo(() => `Tidak transaksi minimal ${days} hari`, [days]);

  return (
    <main className="min-h-screen bg-[#fff6f4] p-3 text-slate-950 sm:p-5 lg:p-7">
      <div className="mx-auto w-full max-w-7xl space-y-5">
        <header className="overflow-hidden rounded-[30px] border border-amber-200/70 bg-[linear-gradient(135deg,#fff7ed_0%,#fff1f2_58%,#ffffff_118%)] p-5 shadow-[0_18px_40px_rgba(151,14,32,0.08)] sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,#d70717,#ff6a00)] text-white shadow-[0_12px_24px_rgba(215,7,23,0.22)]"><AlertTriangle className="h-7 w-7" /></span>
              <div><p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#d70717]">Daftar Follow-up</p><h1 className="mt-1 text-2xl font-black text-slate-950 sm:text-3xl">Agent Tidak Aktif</h1><p className="mt-1 max-w-2xl text-sm font-semibold text-slate-500">Temukan agent yang perlu dihubungi dan bantu marketing melakukan follow-up.</p></div>
            </div>
            <div className="rounded-2xl border border-red-950/[0.06] bg-white px-4 py-3 text-left shadow-sm sm:text-right">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Filter aktif</p>
              <p className="mt-1 text-lg font-black text-[#d70717]">{days} hari</p>
            </div>
          </div>
        </header>

        <section className="rounded-[28px] border border-red-950/[0.06] bg-white p-4 shadow-[0_12px_30px_rgba(151,14,32,0.07)] sm:p-5">
          <div className="flex flex-wrap gap-2">
            {periods.map((period) => <button key={period.days} type="button" onClick={() => { setDays(period.days); setCustomDays(period.days); }} className={`min-h-11 rounded-2xl border px-4 text-xs font-black transition ${days === period.days ? "border-[#d70717] bg-[#d70717] text-white shadow-md" : "border-slate-200 bg-white text-slate-700 hover:border-red-200 hover:text-[#d70717]"}`}>{period.label}</button>)}
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-[210px_minmax(0,1fr)_auto]">
            <div className="flex overflow-hidden rounded-2xl border border-red-950/[0.06] bg-[#fffafa]"><input type="number" inputMode="numeric" min={1} max={365} step={1} value={customDays} onChange={(event) => { const next = Math.min(365, Math.max(1, Number(event.target.value) || 1)); setCustomDays(next); setDays(next); }} className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm font-bold outline-none" placeholder="Jumlah hari" aria-label="Jumlah hari tidak transaksi" /><button type="button" onClick={() => setDays(customDays)} className="bg-red-50 px-4 text-xs font-black text-[#b20717] hover:bg-red-100">Pilih</button></div>
            <label className="flex min-w-0 items-center gap-2 rounded-2xl border border-red-950/[0.06] bg-[#fffafa] px-4 focus-within:border-red-300"><Search className="h-4 w-4 shrink-0 text-[#d70717]" /><input value={draftQuery} onChange={(event) => setDraftQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") setQuery(draftQuery.trim()); }} placeholder="Cari konter, email, nomor HP, atau marketing" className="min-w-0 flex-1 bg-transparent py-3 text-sm font-semibold outline-none placeholder:text-slate-400" /></label>
            <button type="button" onClick={() => { setQuery(draftQuery.trim()); void load(); }} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#d70717] px-5 text-sm font-black text-white hover:bg-[#b20717]"><Search className="h-4 w-4" /> Cari</button>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#fff7f5] px-4 py-3"><p className="text-sm font-semibold text-slate-600">{headline}</p><button type="button" onClick={() => void load()} disabled={loading} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-red-100 bg-white px-4 text-xs font-black text-[#b20717] hover:bg-red-50"><RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Muat Ulang</button></div>
        </section>

        {error ? <div className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-800">{error}</div> : null}
        <section className="overflow-hidden rounded-3xl border border-red-950/[0.06] bg-white shadow-[0_12px_30px_rgba(151,14,32,0.07)]">
          <div className="flex items-center justify-between border-b border-red-950/[0.06] px-5 py-4"><div><h2 className="text-lg font-black text-red-950">Agent yang perlu dihubungi</h2><p className="mt-1 text-xs font-semibold text-slate-500">{loading ? "Memuat data..." : `${items.length} konter ditemukan`}</p></div><span className="grid h-11 w-11 place-items-center rounded-2xl bg-red-50 text-[#d70717]"><Users className="h-5 w-5" /></span></div>
          <div className="hidden overflow-x-auto lg:block"><table className="min-w-[980px] w-full text-left text-sm"><thead className="bg-red-50 text-[10px] font-black uppercase tracking-[0.08em] text-red-900"><tr><th className="px-5 py-3">Agent / Konter</th><th className="px-4 py-3">Marketing</th><th className="px-4 py-3">Transaksi terakhir</th><th className="px-4 py-3">Tidak transaksi</th><th className="px-5 py-3">Status</th></tr></thead><tbody className="divide-y divide-red-50">{items.map((item) => <tr key={item.member_id} className="hover:bg-red-50/40"><td className="px-5 py-4"><p className="font-black text-slate-950">{item.member_name || "Agent"}</p><p className="mt-1 text-xs font-semibold text-slate-500">{item.member_email || item.member_phone || "-"}</p></td><td className="px-4 py-4"><p className="font-bold text-slate-800">{item.marketing_name || "Belum terhubung"}</p><p className="mt-1 text-xs text-slate-500">{item.marketing_email || "-"}</p></td><td className="px-4 py-4"><p className="font-semibold text-slate-700">{dateLabel(item.last_transaction_at)}</p>{item.last_product ? <p className="mt-1 text-xs text-slate-500">{item.last_product} · {fmtID(item.last_amount)}</p> : null}</td><td className="px-4 py-4 font-black text-amber-700">{item.inactive_days} hari</td><td className="px-5 py-4"><span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-black text-amber-800">Perlu follow-up</span></td></tr>)}</tbody></table></div>
          <div className="divide-y divide-red-50 lg:hidden">{items.map((item) => <article key={item.member_id} className="space-y-3 p-4"><div className="flex items-start justify-between gap-3"><div className="flex min-w-0 gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-red-50 text-[#d70717]"><Store className="h-5 w-5" /></span><div className="min-w-0"><p className="truncate font-black text-slate-950">{item.member_name || "Agent"}</p><p className="truncate text-xs font-semibold text-slate-500">{item.member_email || item.member_phone || "-"}</p></div></div><span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-black text-amber-800">{item.inactive_days} hari</span></div><div className="grid grid-cols-2 gap-2 text-xs"><div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] font-black uppercase text-slate-400">Marketing</p><p className="mt-1 font-bold text-slate-800">{item.marketing_name || "Belum terhubung"}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] font-black uppercase text-slate-400">Transaksi terakhir</p><p className="mt-1 font-semibold text-slate-700">{dateLabel(item.last_transaction_at)}</p></div></div></article>)}</div>
          {!loading && items.length === 0 ? <div className="px-5 py-14 text-center"><CalendarClock className="mx-auto h-10 w-10 text-red-300" /><p className="mt-3 font-black text-slate-800">Tidak ada konter untuk filter ini</p><p className="mt-1 text-sm font-semibold text-slate-500">Agent yang melewati batas tidak transaksi akan muncul di sini.</p></div> : null}
          {loading ? <div className="px-5 py-14 text-center text-sm font-semibold text-slate-500">Memuat daftar konter...</div> : null}
        </section>
      </div>
    </main>
  );
}

