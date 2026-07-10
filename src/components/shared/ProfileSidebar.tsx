"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { MapPin, ShoppingBag, LogOut, User } from "lucide-react";
import Image from "next/image";

export default function ProfileSidebar() {
  const { user, clearAuth } = useAuthStore();
  const pathname = usePathname();

  const navItems = [
    { label: "Delivery Address", href: "/profile", icon: MapPin },
    { label: "My Orders", href: "/orders", icon: ShoppingBag },
  ];

  return (
    <aside className="w-full md:w-56 shrink-0">
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-5">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0">
            <Image
              src="/images/Ellipse.png"
              alt={user?.name || "User"}
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          </div>
          <span className="font-bold text-sm text-slate-800 truncate">
            {user?.name || "User"}
          </span>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                pathname === href
                  ? "text-[#C12116]"
                  : "text-slate-600 hover:text-[#C12116]"
              }`}
            >
              <Icon className={`w-4 h-4 ${pathname === href ? "text-[#C12116]" : "text-slate-400"}`} />
              {label}
            </Link>
          ))}

          {/* Logout */}
          <button
            onClick={clearAuth}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-[#C12116] transition-colors"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            Logout
          </button>
        </nav>
      </div>
    </aside>
  );
}
