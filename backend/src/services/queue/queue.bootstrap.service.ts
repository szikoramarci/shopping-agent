import { completedQueue, failedQueue, queue } from "../../states/queue.state";
import { loadAllQueues } from "./queue.storage.service";
import { processNext } from './queue.service';

export async function bootstrapQueue() {
  const state = await loadAllQueues();
  queue.push(...state.queue);
  completedQueue.push(...state.completedQueue);
  failedQueue.push(...state.failedQueue);

  if (queue.length > 0) {
    console.log(`🔄 ${queue.length} elem betöltve, feldolgozás indul.`);
    processNext();
  } else {
    console.log('✅ Üres queue-val indulunk.');
  }
}