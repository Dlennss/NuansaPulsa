import { MasterCreateAgentForm } from "@/components/dashboard/MasterCreateAgentForm";

export default function MarketingAddAgentPage() {
  return (
    <main className="bg-[#fff6f4] px-4 py-4">
      <section className="mx-auto w-full max-w-md space-y-4">
        <header className="rounded-[22px] bg-[linear-gradient(135deg,#b20717,#d70717)] p-5 text-white shadow-[0_16px_36px_rgba(151,14,32,0.18)]">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-200">Menu Marketing</p>
          <h1 className="mt-2 text-2xl font-black">Tambah Agent</h1>
          <p className="mt-1 text-xs font-semibold leading-5 text-red-50/80">Daftarkan agent baru saat kunjungan lapangan.</p>
        </header>
        <MasterCreateAgentForm useRetailEndpoint />
      </section>
    </main>
  );
}
