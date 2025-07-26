import { QueueItem } from "../models/queue.item.model";
import {
  completedQueue,
  failedQueue,
  MAX_RETRIES,
  queue,
} from "../states/queue.state";

export function markAsProcessing(item: QueueItem): void {
  item.status = "processing";
  item.updatedAt = new Date();
}

export function markAsCompleted(item: QueueItem): void {
  item.status = "completed";
  item.updatedAt = new Date();
  completedQueue.push(item);
}

export function markAsFailed(item: QueueItem): void {
  item.status = "failed";
  item.updatedAt = new Date();
  failedQueue.push(item);
}

export function retryCurrentLater(item: QueueItem): void {
  item.retryCount++;
  item.status = "pending";
  item.updatedAt = new Date();
  queue.push(item);
}

export function shouldFail(item: QueueItem): boolean {
  return item.retryCount + 1 >= MAX_RETRIES;
}
