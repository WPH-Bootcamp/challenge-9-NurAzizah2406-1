"use client";

import AuthGuard from "@/components/shared/AuthGuard";
import ProfileSidebar from "@/components/shared/ProfileSidebar";
import { useMyOrders } from "@/lib/query/order";
import { useCreateReview } from "@/lib/query/review";
import { Loader2, Star, Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";

const STATUS_TABS = [
  { label: "Status", value: "" },
  { label: "Preparing", value: "confirmed" },
  { label: "On the Way", value: "on_the_way" },
  { label: "Delivered", value: "delivered" },
  { label: "Done", value: "done" },
  { label: "Canceled", value: "cancelled" },
];

export default function OrdersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const statusParam = searchParams.get("status") || "";

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStatusFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("status", value);
    } else {
      params.delete("status");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const { data: orderResponse, isLoading } = useMyOrders({
    status: statusParam || undefined,
    page: 1,
    limit: 20,
  });

  // Review modal state
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>("");
  const [starRating, setStarRating] = useState<number>(4);
  const [reviewComment, setReviewComment] = useState<string>("");

  const { mutate: submitReview, isPending: isSubmittingReview } = useCreateReview();

  const handleOpenReview = (order: any) => {
    setSelectedOrder(order);
    if (order.restaurants && order.restaurants.length > 0) {
      setSelectedRestaurantId(order.restaurants[0].restaurantId);
    }
    setStarRating(4);
    setReviewComment("");
    setIsReviewOpen(true);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !selectedRestaurantId) return;
    submitReview(
      {
        transactionId: selectedOrder.id,
        restaurantId: selectedRestaurantId,
        star: starRating,
        comment: reviewComment,
      },
      { onSuccess: () => setIsReviewOpen(false) }
    );
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);

  const orders = orderResponse?.data || [];
  const filtered = orders.filter((o: any) =>
    o.restaurants?.some((r: any) =>
      r.restaurantName.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <AuthGuard>
      <div className="flex-grow bg-slate-50/30 pb-20">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Sidebar */}
            <ProfileSidebar />

            {/* Main Content */}
            <div className="flex-grow w-full space-y-6">
              <h1 className="text-2xl font-black text-slate-900">My Orders</h1>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-11 pr-10 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#C12116]/20 focus:border-[#C12116]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Status Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-wrap">
                {STATUS_TABS.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => handleStatusFilter(tab.value)}
                    className={`px-4 py-1.5 rounded-full border text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      statusParam === tab.value
                        ? "border-[#C12116] bg-white text-[#C12116]"
                        : "border-slate-200 bg-white text-slate-500 hover:border-[#C12116] hover:text-[#C12116]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Orders List */}
              {isLoading ? (
                <div className="flex h-60 items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-[#C12116]" />
                </div>
              ) : filtered.length > 0 ? (
                <div className="space-y-4">
                  {filtered.map((order: any) => (
                    <div
                      key={order.id}
                      className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4"
                    >
                      {order.restaurants?.map((rest: any, rIdx: number) => (
                        <div key={rest.restaurantId}>
                          {/* Restaurant Header */}
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 relative shrink-0">
                              <Image
                                src="/images/BurgerKing.png"
                                alt={rest.restaurantName}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <span className="font-bold text-sm text-slate-800">
                              {rest.restaurantName}
                            </span>
                          </div>

                          {/* Items */}
                          {rest.items?.map((item: any, iIdx: number) => (
                            <div key={iIdx} className="flex items-center gap-3 mb-2">
                              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                                <Image
                                  src="/images/DoubleBurger.png"
                                  alt={item.name}
                                  width={64}
                                  height={64}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-slate-700">
                                  {item.name || "Food Name"}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {item.quantity} x {formatPrice(item.price)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}

                      {/* Total & Action */}
                      <div className="border-t border-slate-100 pt-4 flex items-end justify-between">
                        <div>
                          <p className="text-xs text-slate-400 font-medium">Total</p>
                          <p className="text-base font-black text-slate-900">
                            {formatPrice(order.totalPrice)}
                          </p>
                        </div>
                        {(order.status === "delivered" || order.status === "done") && (
                          <Button
                            onClick={() => handleOpenReview(order)}
                            className="bg-[#C12116] hover:bg-[#C12116]/90 text-white font-bold text-sm rounded-full px-6 h-10"
                          >
                            Give Review
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white border border-dashed rounded-2xl">
                  <p className="text-slate-500 text-sm">Belum ada pesanan.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Give Review Modal */}
      {mounted && selectedOrder && (
        <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
          <DialogContent className="max-w-sm bg-white rounded-2xl p-6 shadow-xl border-0">
            <div className="flex items-center justify-between mb-1">
              <DialogTitle className="text-lg font-black text-slate-900">
                Give Review
              </DialogTitle>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-5 mt-3">
              {/* Star Rating */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-700 text-center">
                  Give Rating
                </p>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setStarRating(star)}
                      className="focus:outline-none transition-transform active:scale-90"
                    >
                      <Star
                        className={`w-9 h-9 transition-colors ${
                          star <= starRating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300 fill-slate-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <Textarea
                placeholder="Please share your thoughts about our service!"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="min-h-[130px] text-sm rounded-xl border-slate-200 resize-none focus-visible:ring-[#C12116]"
                required
              />

              {/* Send Button */}
              <Button
                type="submit"
                disabled={isSubmittingReview}
                className="w-full bg-[#C12116] hover:bg-[#C12116]/90 text-white font-bold h-12 rounded-full"
              >
                {isSubmittingReview ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Send"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </AuthGuard>
  );
}
