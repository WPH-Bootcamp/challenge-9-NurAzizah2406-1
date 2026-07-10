"use client";

import AuthGuard from "@/components/shared/AuthGuard";
import { useCart, useUpdateCartItem, useDeleteCartItem, useClearCart } from "@/lib/query/cart";
import { Loader2, Trash2, ShoppingBag, Plus, Minus, ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CartPage() {
  const { data: cartGroups, isLoading, error } = useCart();
  const { mutate: updateQty } = useUpdateCartItem();
  const { mutate: deleteItem } = useDeleteCartItem();
  const { mutate: clearAllCart, isPending: isClearing } = useClearCart();

  const handleQtyChange = (itemId: string, currentQty: number, delta: number) => {
    const nextQty = currentQty + delta;
    if (nextQty <= 0) {
      deleteItem(itemId);
    } else {
      updateQty({ id: itemId, payload: { quantity: nextQty } });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Calculate grand total price
  const grandTotal = cartGroups
    ? cartGroups.reduce((total, group) => {
        const groupTotal = group.items.reduce((gTotal, item) => gTotal + (item.menu?.price || 0) * item.quantity, 0);
        return total + groupTotal;
      }, 0)
    : 0;

  return (
    <AuthGuard>
      <div className="flex-grow bg-slate-50/30 pb-16">
        <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold text-slate-900">My Cart</h1>
              <p className="text-xs text-muted-foreground">Kelola menu pesanan yang telah Anda pilih</p>
            </div>
            {cartGroups && cartGroups.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearAllCart()}
                disabled={isClearing}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Kosongkan</span>
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="flex min-h-[40vh] items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-[#C12116]" />
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed text-red-500">
              Gagal memuat isi keranjang belanja.
            </div>
          ) : cartGroups && cartGroups.length > 0 ? (
            <div className="max-w-3xl mx-auto space-y-6">
              {cartGroups.map((group) => {
                const groupSubtotal = group.items.reduce((total, item) => total + (item.menu?.price || 0) * item.quantity, 0);
                return (
                  <div key={group.restaurantId} className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden">
                    {/* Resto Header */}
                    <div className="p-4 sm:p-6 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center shrink-0">
                          <Image
                            src="/images/BurgerKing.png"
                            alt="Burger King"
                            width={32}
                            height={32}
                            className="object-cover"
                          />
                        </div>
                        <Link href={`/resto/${group.restaurantId}`} className="font-bold text-sm text-slate-900 hover:text-[#C12116] flex items-center gap-1">
                          {group.restaurantName}
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                        </Link>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="p-4 sm:p-6 space-y-6">
                      {group.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-900">
                              <Image
                                src={item.menu?.image || "/images/BigBurger.png"}
                                alt={item.menu?.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{item.menu?.name}</h4>
                              <span className="font-extrabold text-slate-900 block mt-1">{formatPrice(item.menu?.price || 0)}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleQtyChange(item.id, item.quantity, -1)}
                              className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors bg-white shadow-sm"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-4 text-center text-sm font-bold text-slate-800">{item.quantity}</span>
                            <button
                              onClick={() => handleQtyChange(item.id, item.quantity, 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#C12116] text-white shadow-sm hover:bg-[#C12116]/90 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="px-4 sm:px-6 pb-6 pt-2">
                      <div className="border-t border-dashed border-slate-200 mb-4"></div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <span className="text-xs text-slate-500 font-medium">Total</span>
                          <div className="font-black text-lg text-slate-900">{formatPrice(groupSubtotal)}</div>
                        </div>
                        <Button className="w-full sm:w-auto bg-[#C12116] hover:bg-[#C12116]/90 text-white rounded-full px-8 h-10 font-bold">
                          Checkout
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-dashed rounded-3xl space-y-4">
              <div className="w-16 h-16 bg-red-50 text-[#C12116] rounded-2xl flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-slate-800">Keranjang Belanja Kosong</h3>
                <p className="text-sm text-slate-500 max-w-xs mx-auto">Anda belum menambahkan menu makanan ke keranjang belanja.</p>
              </div>
              <Link href="/" className="inline-block pt-2">
                <Button className="bg-[#C12116] hover:bg-[#C12116]/90 text-white font-semibold">
                  Mulai Jelajahi Restoran
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
