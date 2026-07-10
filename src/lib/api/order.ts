import api from "@/lib/api/axios";
import type {
  CheckoutPayload,
  Order,
  PaginatedOrderResponse,
} from "@/types/order";

export const checkout = async (payload: CheckoutPayload): Promise<Order> => {
  const res = await api.post<{ data: Order }>("/api/order/checkout", payload);
  return res.data.data;
};

export const getMyOrders = async (params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedOrderResponse> => {
  const res = await api.get<PaginatedOrderResponse>("/api/order/my-order", {
    params,
  });
  return res.data;
};
