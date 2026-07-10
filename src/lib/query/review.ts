import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createReview, getMyReviews, deleteReview } from "@/lib/api/review";
import { restoKeys } from "./resto";
import type { CreateReviewPayload } from "@/lib/api/review";

export const reviewKeys = {
  all: ["reviews"] as const,
  myReviews: () => [...reviewKeys.all, "my-reviews"] as const,
};

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => createReview(payload),
    onSuccess: () => {
      // Invalidate restaurant queries so ratings and reviews are updated
      queryClient.invalidateQueries({ queryKey: restoKeys.all });
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      toast.success("Ulasan berhasil dikirim! Terima kasih atas feedback-mu ⭐");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message =
        error.response?.data?.message ?? "Gagal mengirim ulasan";
      toast.error(message);
    },
  });
}

export function useMyReviews() {
  return useQuery({
    queryKey: reviewKeys.myReviews(),
    queryFn: getMyReviews,
  });
}
