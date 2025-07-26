import {
  markAsCompleted,
  markAsFailed,
  markAsProcessing,
  retryCurrentLater,
  shouldFail,
} from "../../helpers/queue.helper";
import { mapRequirementToQueueItem } from "../../mapper/mapRequirementToQueueItem";
import { Requirement } from "../../models/requirement.model";
import {
  getCurrentItem,
  isProcessing,
  persistAllQueues,
  queue,
  setProcessing,
} from "../../states/queue.state";
import { sleep } from "../../utils/sleep.util";
import { addToCart } from "../browser/cart.service";

export const PROCESSING_DELAY_MS = 1000 * 3;

export function addToQueue(requirements: Requirement[]) {
  const items = requirements.map(mapRequirementToQueueItem);
  queue.push(...items);
  if (!isProcessing) {
    processNext();
  }
}

export async function processNext() {
  if (queue.length === 0) {
    setProcessing(false);
    return;
  }

  setProcessing(true);
  const item = getCurrentItem();
  if (!item) return;

  markAsProcessing(item);

  try {
    console.log("📦 Feldolgozás megkezdve:", item.requirement);
    await addToCart(item.requirement);
    console.log("✅ Kész:", item.requirement);
    markAsCompleted(item);
  } catch (error: any) {
    console.error("❌ Hiba:", error);

    if (shouldFail(item)) {
      markAsFailed(item);
    } else {
      retryCurrentLater(item);
    }
  } finally {
    await persistAllQueues();
    await sleep(PROCESSING_DELAY_MS);
    processNext();
  }
}
