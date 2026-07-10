"use client";

import Navbar from "@/components/shared/Navbar";
import { usePathname } from "next/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />
      <main className="flex-grow flex flex-col">{children}</main>
      
      {/* Centered design system footer for non-home pages */}
      {!isHome && (
        <footer className="border-t border-slate-100 bg-[#FAFAFA] py-10">
          <div className="container mx-auto px-4 text-center space-y-2 text-xs text-slate-400">
            <p className="font-semibold text-slate-500">The ultimate Figma UI kit and design system</p>
            <p>&copy; {new Date().getFullYear()} Web Programming Hack</p>
          </div>
        </footer>
      )}
    </div>
  );
}
