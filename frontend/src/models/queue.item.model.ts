import { QueueStatus } from '../types/queue.status.type';
import { Product } from './product.model';
import { Recommendation } from './recommendation';
import { Requirement } from './requirement.model';

export interface QueueItem {
  id: string;
  requirement: Requirement;
  product: Product;
  recommendation?: Recommendation;
  status: QueueStatus;
  updatedAt: Date;
}
