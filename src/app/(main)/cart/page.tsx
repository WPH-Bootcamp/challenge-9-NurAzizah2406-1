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
              <h1 className="text-2xl font-bold text-slate-800">Keranjang Belanja</h1>
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
              <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed text-red-500">
              Gagal memuat isi keranjang belanja.
            </div>
          ) : cartGroups && cartGroups.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Cart Items List */}
              <div className="lg:col-span-2 space-y-6">
                {cartGroups.map((group) => (
                  <Card key={group.restaurantId} className="border-border/45 bg-white overflow-hidden">
                    <div className="bg-slate-50/50 p-4 border-b flex items-center gap-3">
                      <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={group.restaurantImage || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=50&auto=format&fit=crop&q=60"}
                          alt={group.restaurantName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Link href={`/resto/${group.restaurantId}`} className="font-bold text-sm text-slate-800 hover:text-orange-500 transition-colors">
                        {group.restaurantName}
                      </Link>
                    </div>

                    <CardContent className="p-0 divide-y divide-slate-100">
                      {group.items.map((item) => (
                        <div key={item.id} className="flex gap-4 p-4 items-center">
                          {/* Item Image */}
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                            <Image
                              src={item.menu?.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&auto=format&fit=crop&q=60"}
                              alt={item.menu?.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          {/* Item Info */}
                          <div className="flex-grow min-w-0">
                            <h4 className="font-bold text-sm text-slate-800 line-clamp-1">
                              {item.menu?.name}
                            </h4>
                            <span className="text-xs font-semibold text-orange-600 block mt-0.5">
                              {formatPrice(item.menu?.price || 0)}
                            </span>
                          </div>

                          {/* Controls & Delete */}
                          <div className="flex items-center gap-4 shrink-0">
                            {/* Quantity Selector */}
                            <div className="flex items-center border border-border/80 rounded-lg p-0.5 bg-slate-50">
                              <button
                                onClick={() => handleQtyChange(item.id, item.quantity, -1)}
                                className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-orange-500 hover:bg-white rounded-md transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-6 text-center text-xs font-bold text-slate-800">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQtyChange(item.id, item.quantity, 1)}
                                className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-orange-500 hover:bg-white rounded-md transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Delete button */}
                            <button
                              onClick={() => deleteItem(item.id)}
                              className="text-slate-400 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary Card */}
              <div className="space-y-4">
                <Card className="border-border/45 bg-white p-5 space-y-4">
                  <h3 className="font-bold text-base text-slate-800">Ringkasan Pembayaran</h3>

                  <div className="space-y-2">
                    {cartGroups.map((group) => {
                      const groupSubtotal = group.items.reduce((total, item) => total + (item.menu?.price || 0) * item.quantity, 0);
                      return (
                        <div key={group.restaurantId} className="flex justify-between text-xs text-slate-600 gap-2">
                          <span className="truncate max-w-[150px]">{group.restaurantName}</span>
                          <span className="font-semibold">{formatPrice(groupSubtotal)}</span>
                        </div>
                      );
                    })}
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center text-slate-800">
                    <span className="text-sm font-semibold">Total Pembayaran</span>
                    <span className="text-base font-extrabold text-orange-600">{formatPrice(grandTotal)}</span>
                  </div>

                  <Link href="/checkout" className="block w-full">
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold flex items-center justify-center gap-1.5 h-10">
                      <span>Lanjut ke Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </Card>

                <Link href="/" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-orange-500 transition-colors justify-center">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Tambah Pesanan Lainnya</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-dashed rounded-3xl space-y-4">
              <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-slate-800">Keranjang Belanja Kosong</h3>
                <p className="text-sm text-slate-500 max-w-xs mx-auto">Anda belum menambahkan menu makanan ke keranjang belanja.</p>
              </div>
              <Link href="/" className="inline-block pt-2">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold">
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
