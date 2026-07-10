"use client";

import Navbar from "@/components/shared/Navbar";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Facebook, Instagram, Linkedin } from "lucide-react";

function AppFooter() {
  return (
    <footer className="bg-[#0A0D12] text-[#FAFAFA] pt-14 pb-8 border-t border-slate-900">
      <div className="container mx-auto px-4 space-y-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {/* Brand Column */}
          <div className="space-y-4 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8">
                <Image src="/icons/Logo-1.png" alt="Foody" fill className="object-contain" />
              </div>
              <span className="font-black text-xl tracking-tight text-white">Foody</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Enjoy homemade flavors &amp; chef&apos;s signature dishes, freshly prepared every day.
              Order online or visit our nearest branch.
            </p>
            {/* Social */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Follow on Social Media
              </span>
              <div className="flex items-center gap-3">
                {[
                  { icon: Facebook, label: "Facebook" },
                  { icon: Instagram, label: "Instagram" },
                  { icon: Linkedin, label: "LinkedIn" },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    aria-label={label}
                    className="w-9 h-9 rounded-full border border-slate-700 hover:border-[#C12116] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
                {/* TikTok */}
                <button
                  aria-label="TikTok"
                  className="w-9 h-9 rounded-full border border-slate-700 hover:border-[#C12116] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.36 6.36 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.24 8.24 0 004.82 1.55V6.86a4.85 4.85 0 01-1.05-.17z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Explore Column */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2.5 text-slate-400 text-sm">
              {["All Food", "Nearby", "Discount", "Best Seller", "Delivery", "Lunch"].map((item) => (
                <li key={item}>
                  <Link href="/" className="hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Column */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">Help</h4>
            <ul className="space-y-2.5 text-slate-400 text-sm">
              {["How to Order", "Payment Methods", "Track My Order", "FAQ", "Contact Us"].map((item) => (
                <li key={item}>
                  <span className="cursor-pointer hover:text-white transition-colors">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="bg-slate-800" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-3">
          <span className="text-center sm:text-left">The ultimate Figma UI kit and design system</span>
          <span className="text-center sm:text-right">
            &copy; {new Date().getFullYear()} Web Programming Hack
          </span>
        </div>
      </div>
    </footer>
  );
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />
      <main className="flex-grow flex flex-col">{children}</main>
      <AppFooter />
    </div>
  );
}
