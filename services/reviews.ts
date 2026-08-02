import { apiRequest, unwrapApiEnvelope, type ApiEnvelope } from "@/lib/api";
import type { Review } from "@/types";

export type ReviewPayload = {
  gearId: string;
  rating: number;
  comment?: string;
};

export async function getGearReviews(gearId: string) {
  const response = await apiRequest<ApiEnvelope<Review[]> | Review[]>(`/api/reviews/${gearId}`, { method: "GET" });
  return unwrapApiEnvelope(response);
}

export async function createReview(payload: ReviewPayload) {
  const response = await apiRequest<ApiEnvelope<Review> | Review>("/api/reviews", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return unwrapApiEnvelope(response);
}
