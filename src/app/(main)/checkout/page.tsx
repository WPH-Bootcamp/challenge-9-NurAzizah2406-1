"use client";

import AuthGuard from "@/components/shared/AuthGuard";
import { useCart } from "@/lib/query/cart";
import { useCheckout } from "@/lib/query/order";
import { checkoutSchema, type CheckoutFormValues } from "@/lib/validations/checkout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft, CreditCard, ShoppingBag, MapPin, Phone, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/store/auth";
import { useEffect } from "react";

export default function CheckoutPage() {
  const { user } = useAuthStore();
  const { data: cartGroups, isLoading: isLoadingCart } = useCart();
  const { mutate: checkoutMutate, isPending: isCheckingOut } = useCheckout();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryAddress: "",
      phone: user?.phone || "",
      paymentMethod: "cash",
      notes: "",
    },
  });

  // Pre-fill phone if user data loads later
  useEffect(() => {
    if (user?.phone) {
      form.setValue("phone", user.phone);
    }
  }, [user, form]);

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

  const onSubmit = (values: CheckoutFormValues) => {
    if (!cartGroups || cartGroups.length === 0) return;

    // Map checkout restaurant payload
    const formattedRestaurants = cartGroups.map((group) => ({
      restaurantId: group.restaurantId,
      items: group.items.map((item) => ({
        menuId: item.menuId,
        quantity: item.quantity,
      })),
    }));

    checkoutMutate({
      restaurants: formattedRestaurants,
      deliveryAddress: values.deliveryAddress,
      phone: values.phone || undefined,
      paymentMethod: values.paymentMethod,
      notes: values.notes || undefined,
    });
  };

  return (
    <AuthGuard>
      <div className="flex-grow bg-slate-50/30 pb-16">
        <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
          {/* Back button & Header */}
          <div className="flex items-center gap-3">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="space-y-0.5">
              <h1 className="text-2xl font-bold text-slate-800">Checkout Pesanan</h1>
              <p className="text-xs text-muted-foreground">Konfirmasi alamat dan detail pembayaran pesanan Anda</p>
            </div>
          </div>

          {isLoadingCart ? (
            <div className="flex min-h-[40vh] items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-[#C12116]" />
            </div>
          ) : cartGroups && cartGroups.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Form Section */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-border/45 bg-white p-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-[#C12116]" />
                          <span>Informasi Pengiriman</span>
                        </h3>

                        {/* Delivery Address */}
                        <FormField
                          control={form.control}
                          name="deliveryAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Alamat Lengkap</FormLabel>
                              <FormControl>
                                <Textarea
                                  id="checkout-deliveryAddress"
                                  placeholder="Masukkan alamat pengiriman secara detail (jalan, nomor rumah, RT/RW, gedung/blok)"
                                  className="min-h-[100px]"
                                  disabled={isCheckingOut}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Phone Number */}
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nomor HP Penerima (Opsional)</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                  <Input
                                    id="checkout-phone"
                                    type="text"
                                    placeholder="Contoh: 081234567890"
                                    className="pl-10"
                                    disabled={isCheckingOut}
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-[#C12116]" />
                          <span>Metode Pembayaran</span>
                        </h3>

                        {/* Payment Method */}
                        <FormField
                          control={form.control}
                          name="paymentMethod"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pilih Metode Pembayaran</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                disabled={isCheckingOut}
                              >
                                <FormControl>
                                  <SelectTrigger id="checkout-paymentMethod">
                                    <SelectValue placeholder="Pilih Metode Pembayaran" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="cash">💵 Tunai (COD)</SelectItem>
                                  <SelectItem value="transfer">🏦 Transfer Bank</SelectItem>
                                  <SelectItem value="e-wallet">📱 E-Wallet (OVO / GoPay)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-[#C12116]" />
                          <span>Catatan Tambahan (Opsional)</span>
                        </h3>

                        {/* Notes */}
                        <FormField
                          control={form.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Catatan untuk Driver / Restoran</FormLabel>
                              <FormControl>
                                <Textarea
                                  id="checkout-notes"
                                  placeholder="Contoh: Jangan pakai sambal, atau ketuk pintu saja"
                                  className="min-h-[80px]"
                                  disabled={isCheckingOut}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button
                        id="checkout-submit"
                        type="submit"
                        className="w-full bg-[#C12116] hover:bg-[#C12116]/90 text-white font-semibold h-11 text-base rounded-xl"
                        disabled={isCheckingOut}
                      >
                        {isCheckingOut ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            Sedang memproses...
                          </>
                        ) : (
                          `Pesan Sekarang (${formatPrice(grandTotal)})`
                        )}
                      </Button>
                    </form>
                  </Form>
                </Card>
              </div>

              {/* Order Summary Sidebar */}
              <div className="space-y-4">
                <Card className="border-border/45 bg-white p-5 space-y-4">
                  <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#C12116]" />
                    <span>Daftar Pesanan</span>
                  </h3>

                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                    {cartGroups.map((group) => (
                      <div key={group.restaurantId} className="space-y-2">
                        <div className="text-xs font-bold text-slate-800 bg-slate-50 p-2 rounded-lg truncate">
                          {group.restaurantName}
                        </div>
                        <div className="space-y-2 pl-2">
                          {group.items.map((item) => (
                            <div key={item.id} className="flex justify-between items-start gap-4 text-xs">
                              <span className="text-slate-600 line-clamp-2">
                                {item.menu?.name} <span className="text-[#C12116] font-semibold">x{item.quantity}</span>
                              </span>
                              <span className="font-semibold text-slate-700 shrink-0">
                                {formatPrice((item.menu?.price || 0) * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center text-slate-800 pt-1">
                    <span className="text-xs text-muted-foreground">Subtotal Belanja</span>
                    <span className="text-sm font-semibold">{formatPrice(grandTotal)}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-800">
                    <span className="text-xs text-muted-foreground">Biaya Pengiriman</span>
                    <span className="text-sm font-semibold text-green-600">GRATIS</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center text-slate-800">
                    <span className="text-sm font-bold">Total Pembayaran</span>
                    <span className="text-base font-extrabold text-[#C12116]">{formatPrice(grandTotal)}</span>
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-dashed rounded-3xl space-y-4">
              <p className="text-sm text-slate-500">Keranjang Anda kosong. Tambahkan makanan terlebih dahulu.</p>
              <Link href="/">
                <Button className="bg-[#C12116] hover:bg-[#C12116]/90 text-white font-semibold">
                  Lihat Menu Restoran
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
