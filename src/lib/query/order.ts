import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { checkout, getMyOrders } from "@/lib/api/order";
import { cartKeys } from "./cart";
import type { CheckoutPayload } from "@/types/order";

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (params?: { status?: string; page?: number; limit?: number }) =>
    [...orderKeys.lists(), params] as const,
};

export function useCheckout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CheckoutPayload) => checkout(payload),
    onSuccess: () => {
      // Invalidate cart since it gets cleared or updated on successful checkout
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      toast.success("Pesanan berhasil dibuat! Driver segera memproses makananmu 🛵");
      router.push("/orders");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message =
        error.response?.data?.message ?? "Gagal menyelesaikan pemesanan";
      toast.error(message);
    },
  });
}

export function useMyOrders(params?: { status?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => getMyOrders(params),
  });
}
