import { Requirement } from "./requirement.model";

export type QueueItem = {
  id: string;
  requirement: Requirement;
  status: "pending" | "processing" | "completed" | "failed";
  retryCount: number;
  createdAt: Date;
  updatedAt: Date;
};
