import api from "@/lib/api/axios";
import type {
  Restaurant,
  RestaurantDetail,
  RestaurantListParams,
  PaginatedResponse,
} from "@/types/restaurant";

export const getRestaurants = async (
  params?: RestaurantListParams
): Promise<PaginatedResponse<Restaurant>> => {
  const res = await api.get<PaginatedResponse<Restaurant>>("/api/resto", {
    params,
  });
  return res.data;
};

export const getRestaurantById = async (
  id: string,
  params?: { limitMenu?: number; limitReview?: number }
): Promise<RestaurantDetail> => {
  const res = await api.get<{ data: RestaurantDetail }>(`/api/resto/${id}`, {
    params,
  });
  return res.data.data;
};

export const searchRestaurants = async (
  q: string,
  params?: { page?: number; limit?: number }
): Promise<PaginatedResponse<Restaurant>> => {
  const res = await api.get<PaginatedResponse<Restaurant>>(
    "/api/resto/search",
    { params: { q, ...params } }
  );
  return res.data;
};

export const getBestSellers = async (params?: {
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Restaurant>> => {
  const res = await api.get<PaginatedResponse<Restaurant>>(
    "/api/resto/best-seller",
    { params }
  );
  return res.data;
};

export const getRecommended = async (params?: {
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Restaurant>> => {
  const res = await api.get<PaginatedResponse<Restaurant>>(
    "/api/resto/recommended",
    { params }
  );
  return res.data;
};

export const getNearby = async (params?: {
  range?: number;
  limit?: number;
}): Promise<PaginatedResponse<Restaurant>> => {
  const res = await api.get<PaginatedResponse<Restaurant>>(
    "/api/resto/nearby",
    { params }
  );
  return res.data;
};
