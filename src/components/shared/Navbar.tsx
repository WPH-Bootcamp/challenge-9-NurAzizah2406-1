"use client";

import Link from "next/link";
import Image from "next/image";
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
  MapPin,
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
    <header className="sticky top-0 w-full border-b border-slate-100 bg-white text-slate-800 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image src="/icons/Logo-1.png" alt="Foody Logo" width={32} height={32} className="object-contain" />
          <span className="font-black text-xl tracking-tight text-slate-900">
            Foody
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className={`text-sm font-semibold transition-all hover:opacity-100 flex items-center gap-1.5 ${
              pathname === "/"
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
                pathname.startsWith("/orders")
                  ? "text-[#C12116]"
                  : "text-slate-600 opacity-80"
              }`}
            >
              <History className="w-4 h-4" />
              My Orders
            </Link>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {mounted ? (
            token ? (
              <>
              {/* Cart Button */}
              <Link href="/cart" className="relative group">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full transition-colors text-slate-700 hover:bg-[#C12116]/5 hover:text-[#C12116]"
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
                      <span className="text-sm font-bold hidden sm:inline-block text-slate-700">
                        {user.name}
                      </span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white border border-border p-1" align="end" forceMount>
                  <DropdownMenuLabel className="font-bold flex items-center gap-2.5 py-2.5 px-3">
                    <Avatar className="h-7 w-7 border border-border">
                      <AvatarFallback className="bg-[#C12116]/10 text-[#C12116] font-bold text-[10px]">
                        {user ? getInitials(user.name) : <User className="h-3.5 w-3.5" />}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-bold text-slate-800">{user?.name}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/checkout" className="cursor-pointer flex items-center gap-2.5 py-2 px-3 hover:bg-slate-50">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      <span className="text-xs font-semibold text-slate-700">Delivery Address</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="cursor-pointer flex items-center gap-2.5 py-2 px-3 hover:bg-slate-50">
                      <History className="h-4 w-4 text-slate-500" />
                      <span className="text-xs font-semibold text-slate-700">My Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-[#C12116] cursor-pointer focus:bg-[#C12116]/5 focus:text-[#C12116] flex items-center gap-2.5 py-2 px-3"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-xs font-bold">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-bold text-sm rounded-full px-5 h-9 border border-slate-300 hover:bg-slate-50 text-slate-700 transition-all"
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
          ) : null}
        </div>
      </div>
    </header>
  );
}
