import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { SiteShell } from "@/components/site/SiteShell";
import { authOptions } from "@/lib/nextauth";
import type { UserSession } from "@/components/user/types";
import { AppTopHeader } from "@/components/shared/AppTopHeader";

export const metadata: Metadata = {
  title: "NuansaPulsa",
  description: "Topup & PPOB cepat",
};

type SessionShape = {
  user?: UserSession;
  backendToken?: string;
};

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const session = (await getServerSession(authOptions)) as SessionShape | null;

  return (
    <div className="min-h-dvh bg-[#f7f7f7] text-neutral-900 md:grid md:place-items-start">
      <div className="relative mx-auto w-full max-w-[1024px] md:bg-[#f7f7f7]">
        <AppTopHeader isLoggedIn={Boolean(session?.backendToken)} />
        <SiteShell>{children}</SiteShell>
      </div>
    </div>
  );
}
