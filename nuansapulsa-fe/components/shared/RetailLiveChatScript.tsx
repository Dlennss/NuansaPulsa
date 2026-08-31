"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { Headset, MessageCircle, Minus, Send } from "lucide-react";

const WHATSAPP_NUMBER = "6282219107558";

export function RetailLiveChatScript() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [problem, setProblem] = useState("");

  if (process.env.NEXT_PUBLIC_DISABLE_RETAIL_LIVE_CHAT === "1") {
    return null;
  }

  function submitChat(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = [
      "Halo NuansaPulsa, saya butuh bantuan.",
      name.trim() ? `Nama: ${name.trim()}` : "",
      contact.trim() ? `Kontak: ${contact.trim()}` : "",
      problem.trim() ? `Masalah: ${problem.trim()}` : "",
    ].filter(Boolean).join("\n");

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="fixed bottom-[72px] right-3 z-[80] w-[calc(100vw-24px)] max-w-[320px] sm:bottom-20 sm:right-5">
      {open ? (
        <section className="mb-2 overflow-hidden rounded-[18px] border border-amber-200/70 bg-white shadow-[0_22px_54px_rgba(151,14,32,0.20)]">
          <div className="relative overflow-hidden bg-[#d70717] px-3.5 py-3 text-white">
            <div className="relative flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="relative h-9 w-9 overflow-hidden rounded-xl bg-white">
                  <Image src="/nuansapulsa-assets/logo_mark_lingkaran.png" alt="" fill sizes="36px" className="object-contain p-1" />
                </span>
                <div className="min-w-0">
                  <span className="relative block h-6 w-32">
                    <Image src="/nuansapulsa-assets/logo_wordmark_nuansapulsa.png" alt="NuansaPulsa" fill sizes="128px" className="object-contain object-left" />
                  </span>
                  <p className="text-[11px] font-semibold text-amber-100/80">Bantuan cepat</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-xl bg-white/10 text-amber-100 transition hover:bg-white/15"
                aria-label="Tutup chat"
              >
                <Minus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <form onSubmit={submitChat} className="space-y-2.5 px-3.5 py-3.5 text-slate-900">
            <p className="text-xs font-semibold leading-5 text-slate-600">
              Isi data singkat, lalu lanjut ke WhatsApp.
            </p>

            <label className="block">
              <span className="mb-1 block text-xs font-black">Nama</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium outline-none transition placeholder:text-slate-400 focus:border-[#ff6a00] focus:ring-4 focus:ring-rose-100"
                placeholder="Nama Anda"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-black">Kontak</span>
              <input
                value={contact}
                onChange={(event) => setContact(event.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium outline-none transition placeholder:text-slate-400 focus:border-[#ff6a00] focus:ring-4 focus:ring-rose-100"
                placeholder="WhatsApp / email"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-black">Masalah</span>
              <textarea
                value={problem}
                onChange={(event) => setProblem(event.target.value)}
                className="min-h-16 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium outline-none transition placeholder:text-slate-400 focus:border-[#ff6a00] focus:ring-4 focus:ring-rose-100"
                placeholder="Tulis kendala Anda"
              />
            </label>

            <button
              type="submit"
              className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#ffb000] to-[#ffb000] text-xs font-black text-[#d70717] shadow-[0_12px_22px_rgba(255,106,0,0.20)] transition hover:brightness-105 active:scale-[0.98]"
            >
              <Send className="h-4 w-4" />
              Lanjut ke chat
            </button>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="ml-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d70717] text-left text-white shadow-[0_12px_26px_rgba(151,14,32,0.22)] ring-1 ring-amber-300/25 transition hover:translate-y-[-1px] sm:h-12 sm:w-auto sm:justify-start sm:gap-2.5 sm:px-3.5"
        aria-expanded={open}
        aria-label="Chat NuansaPulsa"
      >
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-linear-to-br from-[#ffb000] to-[#ffb000] text-[#d70717]">
          {open ? <Headset className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
        </span>
        <span className="hidden sm:block">
          <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-amber-100/80">Bantuan</span>
          <span className="block text-sm font-black">Chat NuansaPulsa</span>
        </span>
      </button>
    </div>
  );
}
