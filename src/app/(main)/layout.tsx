"use client";

import Navbar from "@/components/shared/Navbar";
import { UtensilsCrossed } from "lucide-react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />
      <main className="flex-grow flex flex-col">{children}</main>
      <footer className="border-t border-border bg-white py-8 mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500 text-white shadow-sm">
              <UtensilsCrossed className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm tracking-tight">
              Restaurant<span className="text-orange-500">App</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Restaurant App. Seluruh hak cipta dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
}
