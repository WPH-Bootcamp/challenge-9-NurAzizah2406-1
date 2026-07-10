import { useQuery } from "@tanstack/react-query";
import {
  getRestaurants,
  getRestaurantById,
  searchRestaurants,
  getBestSellers,
  getRecommended,
  getNearby,
} from "@/lib/api/resto";
import type { RestaurantListParams } from "@/types/restaurant";
import { useAuthStore } from "@/store/auth";

export const restoKeys = {
  all: ["restaurants"] as const,
  lists: () => [...restoKeys.all, "list"] as const,
  list: (params?: RestaurantListParams) => [...restoKeys.lists(), params] as const,
  detail: (id: string) => [...restoKeys.all, "detail", id] as const,
  bestSeller: () => [...restoKeys.all, "best-seller"] as const,
  recommended: () => [...restoKeys.all, "recommended"] as const,
  nearby: () => [...restoKeys.all, "nearby"] as const,
};

export function useRestaurants(params?: RestaurantListParams) {
  return useQuery({
    queryKey: restoKeys.list(params),
    queryFn: () => getRestaurants(params),
  });
}

export function useRestaurantDetail(id: string, params?: { limitMenu?: number; limitReview?: number }) {
  return useQuery({
    queryKey: restoKeys.detail(id),
    queryFn: () => getRestaurantById(id, params),
    enabled: !!id,
  });
}

export function useBestSellers(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: restoKeys.bestSeller(),
    queryFn: () => getBestSellers(params),
  });
}

export function useRecommended(params?: { page?: number; limit?: number }) {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: restoKeys.recommended(),
    queryFn: () => getRecommended(params),
    enabled: !!token, // Only call if authenticated
  });
}

export function useNearby(params?: { range?: number; limit?: number }) {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: restoKeys.nearby(),
    queryFn: () => getNearby(params),
    enabled: !!token, // Only call if authenticated
  });
}

export function useSearchRestaurants(q: string, params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: [...restoKeys.all, "search", q, params],
    queryFn: () => searchRestaurants(q, params),
    enabled: q.trim().length > 0,
  });
}
