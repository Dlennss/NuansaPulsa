type Props = {
  children: React.ReactNode;
};

export function BackgroundAuth({ children }: Props) {
  return (
    <main className="relative flex min-h-svh justify-center overflow-x-hidden overflow-y-auto bg-[#fff6f4] auth-shell">
      <div className="relative z-10 w-full max-w-[430px] bg-[#fff6f4] shadow-[0_0_60px_rgba(151,14,32,0.12)] sm:my-5 sm:min-h-[820px] sm:overflow-hidden sm:rounded-[32px]">
        {children}
      </div>
    </main>
  );
}
