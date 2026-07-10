import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
} from "@/lib/api/cart";
import { useAuthStore } from "@/store/auth";
import type { AddToCartPayload, UpdateCartPayload } from "@/types/cart";

export const cartKeys = {
  all: ["cart"] as const,
};

export function useCart() {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: cartKeys.all,
    queryFn: getCart,
    enabled: !!token, // Only fetch when authenticated
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddToCartPayload) => addToCart(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      toast.success("Menu ditambahkan ke keranjang!");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message =
        error.response?.data?.message ?? "Gagal menambahkan ke keranjang";
      toast.error(message);
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCartPayload }) =>
      updateCartItem(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message =
        error.response?.data?.message ?? "Gagal mengubah kuantitas";
      toast.error(message);
    },
  });
}

export function useDeleteCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCartItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      toast.success("Item berhasil dihapus dari keranjang!");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message =
        error.response?.data?.message ?? "Gagal menghapus item";
      toast.error(message);
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      toast.success("Keranjang dikosongkan!");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message =
        error.response?.data?.message ?? "Gagal mengosongkan keranjang";
      toast.error(message);
    },
  });
}
