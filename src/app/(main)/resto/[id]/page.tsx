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
        <Loader2 className="w-10 h-10 animate-spin text-[#C12116]" />
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
    <div className="flex-grow bg-white pb-32">
      {/* Top Image Gallery */}
      <div className="container mx-auto px-4 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[300px] md:h-[400px]">
          {/* Main big image */}
          <div className="relative w-full h-full rounded-2xl overflow-hidden">
            <Image
              src="/images/BigBurger.png"
              alt="Main Burger"
              fill
              className="object-cover"
              priority
            />
          </div>
          {/* 3 smaller images */}
          <div className="hidden md:flex flex-col gap-4 h-full">
            <div className="relative w-full h-1/2 rounded-2xl overflow-hidden">
              <Image src="/images/BeefBurger.png" alt="Beef Burger" fill className="object-cover" />
            </div>
            <div className="flex gap-4 h-1/2">
              <div className="relative w-1/2 h-full rounded-2xl overflow-hidden">
                <Image src="/images/DoubleBurger.png" alt="Double Burger" fill className="object-cover" />
              </div>
              <div className="relative w-1/2 h-full rounded-2xl overflow-hidden">
                <Image src="/images/BurgerBiasa.png" alt="Burger Biasa" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resto Info */}
      <div className="container mx-auto px-4 mt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
              <Image src="/images/BurgerKing.png" alt="Burger King" fill className="object-cover" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">Burger King</h1>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold text-slate-800">4.9</span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Jakarta Selatan &bull; 2.4 km
              </p>
            </div>
          </div>
          <Button variant="outline" className="rounded-full px-6 flex items-center gap-2 border-slate-200">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
            Share
          </Button>
        </div>
        <Separator className="my-8" />
      </div>

      {/* Menu Section */}
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Menu</h2>
        
        {/* Menu Tabs */}
        <div className="flex gap-3 mb-8">
          <Button variant="outline" className="rounded-full border-[#C12116] text-[#C12116] bg-red-50 px-6">
            All Menu
          </Button>
          <Button variant="outline" className="rounded-full border-slate-200 text-slate-600 px-6">
            Food
          </Button>
          <Button variant="outline" className="rounded-full border-slate-200 text-slate-600 px-6">
            Drink
          </Button>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { id: '1', name: 'Food Name', price: 50000, img: '/images/BigBurger.png' },
            { id: '2', name: 'Food Name', price: 50000, img: '/images/Spaghetti.png' },
            { id: '3', name: 'Food Name', price: 50000, img: '/images/FrenchFries.png' },
            { id: '4', name: 'Food Name', price: 50000, img: '/images/Pizza.png' },
            { id: '5', name: 'Food Name', price: 50000, img: '/images/BeefBurger.png' },
            { id: '6', name: 'Food Name', price: 50000, img: '/images/CocaCola.png' },
            { id: '7', name: 'Food Name', price: 50000, img: '/images/IceCream.png' },
            { id: '8', name: 'Food Name', price: 50000, img: '/images/Hotdog.png' },
          ].map((item) => {
            const qty = quantities[item.id] || 0;
            return (
              <div key={item.id} className="flex flex-col rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm">
                <div className="relative w-full aspect-square bg-slate-900">
                  <Image src={item.img} alt={item.name} fill className="object-cover" />
                </div>
                <div className="p-4 flex flex-col gap-2">
                  <h4 className="font-bold text-sm text-slate-700">{item.name}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-extrabold text-slate-900">{formatPrice(item.price)}</span>
                    {qty > 0 ? (
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleQuantityChange(item.id, -1)} className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center bg-white shadow-xs hover:bg-slate-50">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-bold text-sm w-2 text-center">{qty}</span>
                        <button onClick={() => handleQuantityChange(item.id, 1)} className="w-7 h-7 rounded-full bg-[#C12116] text-white flex items-center justify-center shadow-xs hover:bg-[#C12116]/90">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <Button onClick={() => handleQuantityChange(item.id, 1)} className="bg-[#C12116] hover:bg-[#C12116]/90 text-white rounded-full px-6 h-8 text-xs font-bold">
                        Add
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Show More Menu Button */}
        <div className="flex justify-center mt-8">
          <Button variant="outline" className="rounded-full px-8 border-slate-200 text-slate-700">
            Show More
          </Button>
        </div>
      </div>

      <Separator className="my-12" />

      {/* Review Section */}
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Review</h2>
        <div className="flex items-center gap-2 mb-8">
          <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          <span className="font-bold text-lg text-slate-900">4.9 (24 Ulasan)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: "Michael Brown", date: "25 August 2025, 13:38", text: "What a fantastic place! The food was delicious, and the ambiance was delightful. A must-visit for anyone looking for a great time!" },
            { name: "Sarah Davis", date: "25 August 2025, 13:38", text: "I can't say enough good things! The service was exceptional, and the menu had so many great options. Definitely a five-star experience!" },
            { name: "David Wilson", date: "25 August 2025, 13:38", text: "This place exceeded my expectations! The staff were welcoming, and the vibe was just right. I'll be returning soon!" },
            { name: "Emily Johnson", date: "25 August 2025, 13:38", text: "Absolutely loved my visit! The staff were friendly and attentive, making sure everything was just right. Can't wait to come back!" },
            { name: "Jessica Taylor", date: "25 August 2025, 13:38", text: "A wonderful experience overall! The food was exquisite, and the service was impeccable. Highly recommend for a special night out!" },
            { name: "Alex Smith", date: "25 August 2025, 13:38", text: "I had an amazing experience! The service was top-notch, and the atmosphere was perfect for a relaxing evening. Highly recommend!" },
          ].map((rev, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200">
                  <Image src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80" alt="Avatar" width={48} height={48} className="object-cover" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">{rev.name}</h5>
                  <span className="text-xs text-slate-500">{rev.date}</span>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {rev.text}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Button variant="outline" className="rounded-full px-8 border-slate-200 text-slate-700">
            Show More
          </Button>
        </div>
      </div>

      {/* Sticky Bottom Cart (when items exist) */}
      {Object.values(quantities).reduce((a, b) => a + b, 0) > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 shadow-[0_-10px_30px_rgb(0,0,0,0.05)] z-50 p-4">
          <div className="container mx-auto max-w-5xl flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-slate-600 mb-1">
                <ShoppingBag className="w-4 h-4" />
                <span className="font-bold text-sm">{Object.values(quantities).reduce((a, b) => a + b, 0)} Items</span>
              </div>
              <div className="font-black text-xl text-slate-900">
                {formatPrice(Object.entries(quantities).reduce((total, [id, qty]) => total + (qty * 50000), 0))}
              </div>
            </div>
            <Button onClick={() => router.push('/cart')} className="bg-[#C12116] hover:bg-[#C12116]/90 text-white rounded-full px-12 h-12 font-bold shadow-md">
              Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
