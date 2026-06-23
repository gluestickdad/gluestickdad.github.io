import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-60 dark:opacity-50" />
        <div className="absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 rounded-full bg-[#5865F2]/10 blur-[160px] dark:bg-[#5865F2]/20" />
        <div className="absolute top-[40%] right-[-10%] h-[500px] w-[600px] rounded-full bg-[#66C2FF]/10 blur-[140px] dark:bg-[#66C2FF]/15" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background to-transparent" />
      </div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
