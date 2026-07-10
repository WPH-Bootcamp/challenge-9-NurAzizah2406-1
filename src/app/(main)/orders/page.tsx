"use client";

import AuthGuard from "@/components/shared/AuthGuard";
import { useMyOrders } from "@/lib/query/order";
import { useCreateReview } from "@/lib/query/review";
import { Loader2, Calendar, ShoppingBag, MessageSquare, Star, SlidersHorizontal, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const STATUS_FILTERS = [
  { name: "Semua", value: "" },
  { name: "Menunggu", value: "pending" },
  { name: "Diproses", value: "confirmed" },
  { name: "Selesai", value: "delivered" },
  { name: "Dibatalkan", value: "cancelled" },
];

export default function OrdersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  // Sync state with URL search params
  const statusParam = searchParams.get("status") || "";
  const pageParam = searchParams.get("page") || "1";

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStatusFilter = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status) {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const { data: orderResponse, isLoading, error } = useMyOrders({
    status: statusParam || undefined,
    page: parseInt(pageParam),
    limit: 10,
  });

  // Modal review state
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>("");
  const [starRating, setStarRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>("");

  const { mutate: submitReview, isPending: isSubmittingReview } = useCreateReview();

  const handleOpenReviewModal = (order: any) => {
    setSelectedOrder(order);
    // Default to the first restaurant in the order list
    if (order.restaurants && order.restaurants.length > 0) {
      setSelectedRestaurantId(order.restaurants[0].restaurantId);
    }
    setStarRating(5);
    setReviewComment("");
    setIsReviewOpen(true);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !selectedRestaurantId) return;

    submitReview({
      transactionId: selectedOrder.id,
      restaurantId: selectedRestaurantId,
      star: starRating,
      comment: reviewComment,
    }, {
      onSuccess: () => {
        setIsReviewOpen(false);
      }
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 gap-1"><Clock className="w-3 h-3" /> Menunggu</Badge>;
      case "confirmed":
      case "preparing":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1"><Clock className="w-3 h-3" /> Diproses</Badge>;
      case "delivered":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1"><CheckCircle2 className="w-3 h-3" /> Selesai</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1"><AlertTriangle className="w-3 h-3" /> Dibatalkan</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AuthGuard>
      <div className="flex-grow bg-slate-50/30 pb-16">
        <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-800">Riwayat Pesanan</h1>
            <p className="text-xs text-muted-foreground">Lihat status dan detail pesanan makanan Anda</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-100">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.value}
                onClick={() => handleStatusFilter(filter.value)}
                className={`px-4 py-2 border-b-2 font-semibold text-sm transition-all cursor-pointer ${
                  statusParam === filter.value
                    ? "border-[#C12116] text-[#C12116]"
                    : "border-transparent text-slate-500 hover:text-[#C12116]"
                }`}
              >
                {filter.name}
              </button>
            ))}
          </div>

          {/* Main List */}
          {isLoading ? (
            <div className="flex min-h-[40vh] items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-[#C12116]" />
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed text-red-500">
              Gagal memuat riwayat pesanan.
            </div>
          ) : orderResponse?.data && orderResponse.data.length > 0 ? (
            <div className="space-y-6">
              {orderResponse.data.map((order) => (
                <Card key={order.id} className="border-border/45 bg-white overflow-hidden shadow-sm">
                  {/* Order Card Header */}
                  <div className="bg-slate-50/50 p-4 border-b flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-50 text-[#C12116] flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold block">ORDER ID</span>
                        <span className="text-xs font-mono font-semibold text-slate-800 block truncate max-w-[150px] sm:max-w-none">
                          {order.id}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[10px] text-muted-foreground block">Tanggal Transaksi</span>
                        <span className="text-xs text-slate-700 font-semibold flex items-center gap-1 mt-0.5 justify-end">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(order.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  {/* Order Card Body */}
                  <CardContent className="p-5 space-y-4">
                    {order.restaurants.map((rest, rIdx) => (
                      <div key={rest.restaurantId} className="space-y-2">
                        {rIdx > 0 && <Separator className="my-3" />}
                        <h4 className="font-bold text-sm text-slate-800">
                          {rest.restaurantName}
                        </h4>
                        <div className="space-y-2 pl-2">
                          {rest.items.map((item, iIdx) => (
                            <div key={iIdx} className="flex justify-between items-start gap-4 text-xs">
                              <span className="text-slate-600">
                                {item.name} <span className="text-[#C12116] font-bold">x{item.quantity}</span>
                              </span>
                              <span className="font-semibold text-slate-700">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    <Separator className="mt-4" />

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-1">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-muted-foreground block">Alamat Pengiriman</span>
                        <p className="text-xs text-slate-600 line-clamp-1">{order.deliveryAddress}</p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] text-muted-foreground block">Total Transaksi</span>
                           <span className="text-sm font-extrabold text-[#C12116]">{formatPrice(order.totalPrice)}</span>
                        </div>

                        {order.status === "delivered" && (
                           <Button
                            size="sm"
                            onClick={() => handleOpenReviewModal(order)}
                            className="bg-[#C12116] hover:bg-[#C12116]/90 text-white font-semibold text-xs flex items-center gap-1.5 rounded-lg"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Beri Ulasan</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-dashed rounded-3xl space-y-4">
              <p className="text-sm text-slate-500">Anda belum memiliki pesanan.</p>
            </div>
          )}
        </div>
      </div>

      {/* Review Dialog Modal */}
      {mounted && selectedOrder && (
        <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
          <DialogContent className="max-w-md bg-white border">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-800">Beri Ulasan Restoran</DialogTitle>
              <DialogDescription className="text-xs">
                Bagikan pengalaman bersantap Anda dengan yang lain
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmitReview} className="space-y-5">
              {/* Select Restaurant */}
              {selectedOrder.restaurants && selectedOrder.restaurants.length > 1 && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">Pilih Restoran</label>
                  <select
                    value={selectedRestaurantId}
                    onChange={(e) => setSelectedRestaurantId(e.target.value)}
                    className="w-full border rounded-lg p-2 text-sm"
                    required
                  >
                    {selectedOrder.restaurants.map((rest: any) => (
                      <option key={rest.restaurantId} value={rest.restaurantId}>
                        {rest.restaurantName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Star Rating Selection */}
              <div className="space-y-2 flex flex-col items-center justify-center py-2 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-600">Beri Bintang</span>
                <div className="flex gap-1.5 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setStarRating(star)}
                      className="focus:outline-none transition-transform active:scale-95"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= starRating ? "fill-amber-400 text-amber-400" : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Comment */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Tulis Ulasan Anda</label>
                <Textarea
                  placeholder="Tulis ulasan Anda di sini..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="min-h-[100px] text-sm"
                  required
                />
              </div>

              <DialogFooter className="flex justify-end gap-2 pt-2 border-t">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsReviewOpen(false)}
                  disabled={isSubmittingReview}
                  className="text-xs"
                >
                  Batal
                </Button>
                 <Button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="bg-[#C12116] hover:bg-[#C12116]/90 text-white font-semibold text-xs"
                >
                  {isSubmittingReview ? "Mengirim..." : "Kirim Ulasan"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </AuthGuard>
  );
}
