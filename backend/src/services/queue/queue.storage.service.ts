import { promises as fs } from 'fs';
import path from 'path';
import { QueueState } from '../../models/queue.state.model';
import { QueueItem } from '../../models/queue.item.model';

const STORAGE_PATH = path.resolve(__dirname, 'queues.json');
const TEMP_PATH = path.resolve(__dirname, 'queues.tmp.json');

export async function saveAllQueues(state: QueueState): Promise<void> {
  const json = JSON.stringify(state, null, 2);
  await fs.writeFile(TEMP_PATH, json, 'utf-8');
  await fs.rename(TEMP_PATH, STORAGE_PATH);
}

export async function loadAllQueues(): Promise<QueueState> {
  try {
    const content = await fs.readFile(STORAGE_PATH, 'utf-8');
    const parsed: QueueState = JSON.parse(content);
    const reviveDates = (items: QueueItem[]) =>
      items.map(item => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }));
    return {
      queue: reviveDates(parsed.queue),
      completedQueue: reviveDates(parsed.completedQueue),
      failedQueue: reviveDates(parsed.failedQueue),
    };
  } catch (err) {
    console.warn('⚠️ Nem sikerült betölteni a queue fájlt, új üres állapot indul.');
    return { queue: [], completedQueue: [], failedQueue: [] };
  }
}