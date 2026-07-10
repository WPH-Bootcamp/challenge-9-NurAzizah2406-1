"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function PaymentSuccessPage() {
  const date = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div className="flex-grow flex flex-col items-center justify-center bg-slate-50/30 py-16 px-4">
      {/* Brand */}
      <div className="flex items-center gap-2 mb-8">
        <div className="relative w-8 h-8">
          <Image src="/icons/Logo-1.png" alt="Foody" fill className="object-contain" />
        </div>
        <span className="font-black text-2xl text-slate-900 tracking-tight">Foody</span>
      </div>

      {/* Card */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm w-full max-w-sm p-6 space-y-5">
        {/* Success Icon & Title */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-lg font-black text-slate-900">Payment Success</h1>
          <p className="text-sm text-slate-500">
            Your payment has been successfully processed.
          </p>
        </div>

        <Separator className="bg-slate-100" />

        {/* Payment Details */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Date</span>
            <span className="font-bold text-slate-800 text-right">{date}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Payment Method</span>
            <span className="font-bold text-slate-800">Bank Rakyat Indonesia</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Price (2 items)</span>
            <span className="font-bold text-slate-800">{formatPrice(100000)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Delivery Fee</span>
            <span className="font-bold text-slate-800">{formatPrice(10000)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Service Fee</span>
            <span className="font-bold text-slate-800">{formatPrice(1000)}</span>
          </div>

          <Separator className="bg-slate-100" />

          <div className="flex justify-between text-sm">
            <span className="font-bold text-slate-800">Total</span>
            <span className="font-black text-slate-800">{formatPrice(1000)}</span>
          </div>
        </div>

        {/* CTA Button */}
        <Link href="/orders">
          <Button className="w-full bg-[#C12116] hover:bg-[#C12116]/90 text-white font-bold h-12 rounded-full mt-2">
            See My Orders
          </Button>
        </Link>
      </div>
    </div>
  );
}
