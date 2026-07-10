"use client";

import AuthGuard from "@/components/shared/AuthGuard";
import { useCart } from "@/lib/query/cart";
import { useCheckout } from "@/lib/query/order";
import { checkoutSchema, type CheckoutFormValues } from "@/lib/validations/checkout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MapPin, Plus, Minus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth";

const PAYMENT_METHODS = [
  { value: "bni", label: "Bank Negara Indonesia", logo: "/images/BNI.png" },
  { value: "bri", label: "Bank Rakyat Indonesia", logo: "/images/BRI.png" },
  { value: "bca", label: "Bank Central Asia", logo: "/images/BCA.png" },
  { value: "mandiri", label: "Mandiri", logo: "/images/Mandiri.png" },
];

export default function CheckoutPage() {
  const { user } = useAuthStore();
  const { data: cartGroups, isLoading: isLoadingCart } = useCart();
  const { mutate: checkoutMutate, isPending: isCheckingOut } = useCheckout();
  const [selectedPayment, setSelectedPayment] = useState("bni");

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryAddress: "Jl Sudirman No. 25, Jakarta Pusat, 10220",
      phone: user?.phone || "",
      paymentMethod: "bni",
      notes: "",
    },
  });

  useEffect(() => {
    if (user?.phone) form.setValue("phone", user.phone);
  }, [user, form]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);

  const grandTotal = cartGroups
    ? cartGroups.reduce((total, group) => {
        return (
          total +
          group.items.reduce(
            (gTotal, item) => gTotal + (item.menu?.price || 0) * item.quantity,
            0
          )
        );
      }, 0)
    : 0;

  const deliveryFee = 10000;
  const serviceFee = 1000;
  const itemCount = cartGroups
    ? cartGroups.reduce((c, g) => c + g.items.reduce((ci, i) => ci + i.quantity, 0), 0)
    : 0;

  const onSubmit = (values: CheckoutFormValues) => {
    if (!cartGroups || cartGroups.length === 0) return;
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
      paymentMethod: selectedPayment,
      notes: values.notes || undefined,
    });
  };

  return (
    <AuthGuard>
      <div className="flex-grow bg-slate-50/30 pb-20">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <h1 className="text-2xl font-black text-slate-900 mb-6">Checkout</h1>

          {isLoadingCart ? (
            <div className="flex h-60 items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#C12116]" />
            </div>
          ) : cartGroups && cartGroups.length > 0 ? (
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* LEFT COLUMN */}
                <div className="space-y-4">
                  {/* Delivery Address Card */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#C12116]" />
                      <span className="font-bold text-sm text-slate-800">
                        Delivery Address
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">
                        {form.getValues("deliveryAddress") || "Jl Sudirman No. 25, Jakarta Pusat, 10220"}
                      </p>
                      <p className="text-sm text-slate-500">{user?.phone || "0812-3456-7890"}</p>
                    </div>
                    <button
                      type="button"
                      className="text-sm font-semibold text-slate-700 border border-slate-200 rounded-full px-4 py-1.5 hover:border-slate-400 transition-colors"
                    >
                      Change
                    </button>
                  </div>

                  {/* Order Items per Restaurant */}
                  {cartGroups.map((group) => (
                    <div
                      key={group.restaurantId}
                      className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4"
                    >
                      {/* Restaurant Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 relative shrink-0">
                            <Image
                              src="/images/BurgerKing.png"
                              alt={group.restaurantName}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <span className="font-bold text-sm text-slate-800">
                            {group.restaurantName || "Burger Bang"}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="text-sm font-semibold text-slate-600 border border-slate-200 rounded-full px-3 py-1 hover:border-slate-400 transition-colors"
                        >
                          Add item
                        </button>
                      </div>

                      {/* Items */}
                      <div className="space-y-3">
                        {group.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3"
                          >
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                              <Image
                                src="/images/DoubleBurger.png"
                                alt={item.menu?.name || "Food"}
                                width={64}
                                height={64}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div className="flex-grow">
                              <p className="text-sm font-semibold text-slate-700">
                                {item.menu?.name || "Food Name"}
                              </p>
                              <p className="text-sm text-slate-500">
                                {formatPrice(item.menu?.price || 0)}
                              </p>
                            </div>
                            {/* Qty controls */}
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center hover:border-slate-400"
                              >
                                <Minus className="w-3 h-3 text-slate-600" />
                              </button>
                              <span className="text-sm font-bold text-slate-800 w-4 text-center">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                className="w-7 h-7 rounded-full bg-[#C12116] flex items-center justify-center hover:bg-[#C12116]/90"
                              >
                                <Plus className="w-3 h-3 text-white" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-4">
                  {/* Payment Method */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3">
                    <h3 className="font-bold text-sm text-slate-800">
                      Payment Method
                    </h3>
                    <div className="space-y-2">
                      {PAYMENT_METHODS.map((method) => (
                        <label
                          key={method.value}
                          className="flex items-center justify-between py-2.5 cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-7 relative shrink-0">
                              <Image
                                src={method.logo}
                                alt={method.label}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <span className="text-sm font-medium text-slate-700">
                              {method.label}
                            </span>
                          </div>
                          <div
                            onClick={() => setSelectedPayment(method.value)}
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer ${
                              selectedPayment === method.value
                                ? "border-[#C12116]"
                                : "border-slate-300"
                            }`}
                          >
                            {selectedPayment === method.value && (
                              <div className="w-2.5 h-2.5 rounded-full bg-[#C12116]" />
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3">
                    <h3 className="font-bold text-sm text-slate-800">
                      Payment Summary
                    </h3>
                    <div className="space-y-2.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">
                          Price ({itemCount} items)
                        </span>
                        <span className="font-semibold text-slate-800">
                          {formatPrice(grandTotal)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Delivery Fee</span>
                        <span className="font-semibold text-slate-800">
                          {formatPrice(deliveryFee)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Service Fee</span>
                        <span className="font-semibold text-slate-800">
                          {formatPrice(serviceFee)}
                        </span>
                      </div>
                      <Separator className="bg-slate-100" />
                      <div className="flex justify-between text-sm">
                        <span className="font-bold text-slate-800">Total</span>
                        <span className="font-black text-slate-800">
                          {formatPrice(serviceFee)}
                        </span>
                      </div>
                    </div>

                    {/* Buy Button */}
                    <Button
                      id="checkout-submit"
                      type="submit"
                      disabled={isCheckingOut}
                      className="w-full bg-[#C12116] hover:bg-[#C12116]/90 text-white font-bold h-12 rounded-full mt-2"
                    >
                      {isCheckingOut ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Buy"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="text-center py-20 bg-white border border-dashed rounded-2xl space-y-4">
              <p className="text-slate-500 text-sm">
                Keranjang Anda kosong.
              </p>
              <Link href="/">
                <Button className="bg-[#C12116] hover:bg-[#C12116]/90 text-white font-bold rounded-full px-8">
                  Lihat Menu
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
