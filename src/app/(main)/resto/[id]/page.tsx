"use client";

import { useParams, useRouter } from "next/navigation";
import { useRestaurantDetail } from "@/lib/query/resto";
import { useAddToCart } from "@/lib/query/cart";
import { useAuthStore } from "@/store/auth";
import Image from "next/image";
import { Star, MapPin, Tag, Plus, Minus, ShoppingBag, Loader2, ArrowLeft, Heart, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import type { Menu } from "@/types/restaurant";

export default function RestaurantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { token } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // Local state for quantity per menu item id
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: restaurant, isLoading, error } = useRestaurantDetail(id);
  const { mutate: addToCartMutate, isPending: isAddingToCart } = useAddToCart();

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
        <p className="text-slate-500 text-sm">Memuat detail restoran...</p>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-red-500">Restoran tidak ditemukan atau terjadi kesalahan.</p>
        <Button variant="outline" onClick={() => router.push("/")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Home
        </Button>
      </div>
    );
  }

  const handleQuantityChange = (menuId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[menuId] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [menuId]: next };
    });
  };

  const handleAddToCart = (menu: Menu) => {
    if (!token) {
      toast.error("Silakan login terlebih dahulu untuk memesan makanan.");
      router.push("/login");
      return;
    }

    const qty = quantities[menu.id] || 1;
    addToCartMutate({
      restaurantId: id,
      menuId: menu.id,
      quantity: qty,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="flex-grow bg-slate-50/30 pb-16">
      {/* Header Cover Banner */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden bg-slate-200">
        <Image
          src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80"}
          alt={restaurant.name}
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="absolute top-4 left-4 bg-white/20 backdrop-blur-xs text-white hover:bg-white/40 hover:text-white rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Kembali
        </Button>
      </div>

      {/* Info Container */}
      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-white rounded-3xl p-6 shadow-md border border-border/30 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-orange-100 text-orange-700 font-semibold border-none hover:bg-orange-100">
                  {restaurant.category}
                </Badge>
                <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{restaurant.rating.toFixed(1)}</span>
                </div>
              </div>
              <h1 className="text-2xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
                {restaurant.name}
              </h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                <span>{restaurant.address || restaurant.location}</span>
              </p>
            </div>
            <div className="text-left md:text-right bg-slate-50 p-4 rounded-2xl border w-full md:w-auto">
              <span className="text-xs text-muted-foreground block">Estimasi Harga</span>
              <span className="text-lg font-extrabold text-orange-600 block mt-0.5">
                {formatPrice(restaurant.priceMin)} - {formatPrice(restaurant.priceMax)}
              </span>
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="font-bold text-lg text-slate-800 mb-2">Tentang Restoran</h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
              {restaurant.description || "Selamat datang di restoran kami. Kami menyajikan berbagai menu makanan lezat dengan bahan berkualitas terbaik. Silakan pilih menu favorit Anda di bawah."}
            </p>
          </div>
        </div>

        {/* Menus and Reviews Tab Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 items-start">
          {/* Menus List (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-bold text-xl text-slate-800 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-500" />
              <span>Daftar Menu Makanan</span>
            </h2>

            {restaurant.menus && restaurant.menus.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {restaurant.menus.map((menu) => (
                  <Card key={menu.id} className="overflow-hidden border-border/40 bg-white">
                    <div className="flex gap-4 p-4 h-full">
                      {/* Menu Image */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                        <Image
                          src={menu.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop&q=60"}
                          alt={menu.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 80px, 96px"
                        />
                      </div>

                      {/* Menu Info */}
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-sm sm:text-base text-slate-800 line-clamp-1">
                            {menu.name}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                            {menu.description || "Menu lezat dan nikmat siap dinikmati."}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-slate-50">
                          <span className="text-sm font-extrabold text-orange-600">
                            {formatPrice(menu.price)}
                          </span>

                          <div className="flex items-center gap-3">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-border/80 rounded-lg p-0.5 bg-slate-50">
                              <button
                                onClick={() => handleQuantityChange(menu.id, -1)}
                                className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-orange-500 hover:bg-white rounded-md transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-6 text-center text-xs font-bold text-slate-800">
                                {quantities[menu.id] || 1}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(menu.id, 1)}
                                className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-orange-500 hover:bg-white rounded-md transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Add Button */}
                            <Button
                              onClick={() => handleAddToCart(menu)}
                              className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg h-7 px-3 text-xs font-semibold"
                            >
                              Tambah
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">Tidak ada menu yang tersedia.</p>
            )}
          </div>

          {/* Reviews List (1/3 width) */}
          <div className="space-y-6">
            <h2 className="font-bold text-xl text-slate-800 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-orange-500" />
              <span>Ulasan Pembeli</span>
            </h2>

            <Card className="bg-white border-border/40 p-4 space-y-4">
              {restaurant.reviews && restaurant.reviews.length > 0 ? (
                <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                  {restaurant.reviews.map((review) => (
                    <div key={review.id} className="space-y-1.5 p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-700">
                          {review.user?.name || "Pelanggan"}
                        </span>
                        <div className="flex items-center gap-0.5 text-xs text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{review.star}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed italic">
                        &ldquo;{review.comment}&rdquo;
                      </p>
                      <span className="text-[10px] text-muted-foreground block text-right">
                        {new Date(review.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-xs py-6 text-center">Belum ada ulasan untuk restoran ini.</p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
