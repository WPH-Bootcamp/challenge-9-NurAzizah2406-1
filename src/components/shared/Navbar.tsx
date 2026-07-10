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
  Menu as MenuIcon,
  UtensilsCrossed,
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

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth, token } = useAuthStore();
  const { data: cartData } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hitung total item unik di keranjang
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
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white shadow-md transition-all group-hover:scale-105">
            <UtensilsCrossed className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg tracking-tight hidden sm:inline-block">
            Restaurant<span className="text-orange-500">App</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-orange-500 flex items-center gap-1.5 ${
              pathname === "/" ? "text-orange-500" : "text-muted-foreground"
            }`}
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
          {mounted && token && (
            <Link
              href="/orders"
              className={`text-sm font-medium transition-colors hover:text-orange-500 flex items-center gap-1.5 ${
                pathname.startsWith("/orders")
                  ? "text-orange-500"
                  : "text-muted-foreground"
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
                <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-orange-50 hover:text-orange-500">
                  <ShoppingBag className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white ring-2 ring-background animate-in zoom-in duration-300">
                      {cartItemCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full select-none outline-none">
                    <Avatar className="h-9 w-9 border border-border/80">
                      <AvatarFallback className="bg-orange-50 text-orange-600 font-semibold text-xs">
                        {user ? getInitials(user.name) : <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
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
                    className="text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-700 flex items-center gap-2"
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
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="font-semibold text-sm hover:text-orange-500">
                    Masuk
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm">
                    Daftar
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
