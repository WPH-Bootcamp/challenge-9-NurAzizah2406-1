"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useCart } from "@/lib/query/cart";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  History,
  LogOut,
  User,
  Home,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect } from "react";

// Spoke logo matching Figma exactly (Red badge with white spoke wheel lines)
const SpokeLogo = ({ isHome }: { isHome: boolean }) => (
  <svg
    width="34"
    height="34"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="transition-transform duration-500 group-hover:rotate-45 shrink-0"
  >
    <circle cx="18" cy="18" r="18" fill="#C12116" />
    <circle cx="18" cy="18" r="5" fill="none" stroke="white" strokeWidth="2.5" />
    <path
      d="M18 2V8M18 28V34M2 18H8M28 18H34M6.7 6.7L11 11M25 25L29.3 29.3M29.3 6.7L25 11M11 25L6.7 29.3"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth, token } = useAuthStore();
  const { data: cartData } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isHome = pathname === "/";

  // Count unique items in cart
  const cartItemCount = cartData
    ? cartData.reduce((total, cartGroup) => total + cartGroup.items.length, 0)
    : 0;

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <header
      className={`z-50 transition-all duration-300 ${
        isHome
          ? "absolute top-0 left-0 right-0 border-b border-white/10 bg-transparent text-white py-2"
          : "sticky top-0 w-full border-b border-border bg-white text-slate-800"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <SpokeLogo isHome={isHome} />
          <span
            className={`font-black text-xl tracking-tight transition-colors duration-300 ${
              isHome ? "text-white" : "text-slate-900"
            }`}
          >
            Foody
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className={`text-sm font-semibold transition-all hover:opacity-100 flex items-center gap-1.5 ${
              isHome
                ? "text-white opacity-90"
                : pathname === "/"
                ? "text-[#C12116]"
                : "text-slate-600 opacity-80"
            }`}
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
          {mounted && token && (
            <Link
              href="/orders"
              className={`text-sm font-semibold transition-all hover:opacity-100 flex items-center gap-1.5 ${
                isHome
                  ? "text-white opacity-80"
                  : pathname.startsWith("/orders")
                  ? "text-[#C12116]"
                  : "text-slate-600 opacity-80"
              }`}
            >
              <History className="w-4 h-4" />
              Riwayat Pesanan
            </Link>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {mounted && token ? (
            <>
              {/* Cart Button */}
              <Link href="/cart" className="relative group">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`relative rounded-full transition-colors ${
                    isHome
                      ? "text-white hover:bg-white/10 hover:text-white"
                      : "text-slate-700 hover:bg-[#C12116]/5 hover:text-[#C12116]"
                  }`}
                >
                  <ShoppingBag className="h-5.5 w-5.5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#C12116] text-[10px] font-bold text-white ring-2 ring-background animate-in zoom-in duration-300">
                      {cartItemCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:opacity-85 transition-opacity cursor-pointer select-none outline-none">
                    <Avatar className="h-9 w-9 border border-white/20 shadow-sm">
                      <AvatarFallback className="bg-[#C12116]/10 text-[#C12116] font-bold text-xs">
                        {user ? getInitials(user.name) : <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    {user && (
                      <span
                        className={`text-sm font-bold hidden sm:inline-block transition-colors ${
                          isHome ? "text-white" : "text-slate-700"
                        }`}
                      >
                        {user.name}
                      </span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white border border-border" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="cursor-pointer flex items-center gap-2">
                      <History className="h-4 w-4" />
                      <span>Riwayat Pesanan</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-[#C12116] cursor-pointer focus:bg-[#C12116]/5 focus:text-[#C12116] flex items-center gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            mounted && (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`font-bold text-sm rounded-full px-5 h-9 border transition-all ${
                      isHome
                        ? "text-white border-white hover:bg-white hover:text-slate-900"
                        : "text-slate-700 border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm rounded-full px-5 h-9 shadow-xs"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </header>
  );
}
