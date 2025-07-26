import { QueueItem } from "../../models/queue.item.model";
import { completedQueue, failedQueue } from "../../states/queue.state";

const MS_IN_DAY = 1000 * 60 * 60 * 24;
const CLEANUP_THRESHOLD_DAYS = 30;

export function cleanOldItemsInPlace(queue: QueueItem[]): number {
  const now = Date.now();
  const isTooOld = (item: QueueItem) =>
    now - item.updatedAt.getTime() > CLEANUP_THRESHOLD_DAYS * MS_IN_DAY;

  const originalLength = queue.length;
  const filtered = queue.filter(item => !isTooOld(item));

  queue.length = 0;
  queue.push(...filtered);

  return originalLength - queue.length;
}

export function cleanAllQueues(): void {
  const removedCompleted = cleanOldItemsInPlace(completedQueue);
  const removedFailed = cleanOldItemsInPlace(failedQueue);

  if (removedCompleted || removedFailed) {
    console.log(`🧹 Cleanup: ${removedCompleted} completed és ${removedFailed} failed elem törölve.`);
  }
}