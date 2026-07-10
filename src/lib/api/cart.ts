import api from "@/lib/api/axios";
import type { Cart, AddToCartPayload, UpdateCartPayload } from "@/types/cart";

export const getCart = async (): Promise<Cart[]> => {
  const res = await api.get<{ data: Cart[] }>("/api/cart");
  return res.data.data;
};

export const addToCart = async (payload: AddToCartPayload): Promise<void> => {
  await api.post("/api/cart", payload);
};

export const updateCartItem = async (
  id: string,
  payload: UpdateCartPayload
): Promise<void> => {
  await api.put(`/api/cart/${id}`, payload);
};

export const deleteCartItem = async (id: string): Promise<void> => {
  await api.delete(`/api/cart/${id}`);
};

export const clearCart = async (): Promise<void> => {
  await api.delete("/api/cart");
};
