import api from "@/lib/api/axios";
import type { Review } from "@/types/restaurant";

export interface CreateReviewPayload {
  transactionId: string;
  restaurantId: string;
  star: number;
  comment: string;
  menuIds?: string[];
}

export const createReview = async (payload: CreateReviewPayload): Promise<Review> => {
  const res = await api.post<{ data: Review }>("/api/review", payload);
  return res.data.data;
};

export const getMyReviews = async (): Promise<Review[]> => {
  const res = await api.get<{ data: Review[] }>("/api/review/my-reviews");
  return res.data.data;
};

export const deleteReview = async (id: string): Promise<void> => {
  await api.delete(`/api/review/${id}`);
};
