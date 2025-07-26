import { v4 as uuidv4 } from 'uuid';
import { QueueItem } from "../models/queue.item.model";
import { Requirement } from "../models/requirement.model";

export function mapRequirementToQueueItem(requirement: Requirement): QueueItem {
  const now = new Date();
  return {
    id: uuidv4(),
    requirement,
    status: "pending",
    retryCount: 0,
    createdAt: now,
    updatedAt: now,
  };
}