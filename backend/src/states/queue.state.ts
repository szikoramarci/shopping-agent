import { QueueItem } from "../models/queue.item.model";
import { cleanAllQueues } from "../services/queue/queue.cleanup.service";
import { saveAllQueues } from "../services/queue/queue.storage.service";

export const queue: QueueItem[] = [];
export const failedQueue: QueueItem[] = [];
export const completedQueue: QueueItem[] = [];

export const MAX_RETRIES = 3;

export let isProcessing = false;

export function setProcessing(state: boolean) {
  isProcessing = state;
}

export function getCurrentItem(): QueueItem | undefined {
  return queue.shift();
}

export async function persistAllQueues() {
  cleanAllQueues();
  await saveAllQueues({
    queue,
    completedQueue,
    failedQueue,
  });
}
