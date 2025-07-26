import { QueueItem } from "./queue.item.model";

export type QueueState = {
  queue: QueueItem[];
  completedQueue: QueueItem[];
  failedQueue: QueueItem[];
};
