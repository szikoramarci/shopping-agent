import { Product } from "./product.model";
import { Recommendation } from "./recommendation.model";
import { Requirement } from "./requirement.model";

export type QueueItem = {
  id: string;
  requirement: Requirement;
  product?: Product;
  recommendation?: Recommendation;
  status: "pending" | "processing" | "completed" | "failed";
  retryCount: number;
  createdAt: Date;
  updatedAt: Date;
};
