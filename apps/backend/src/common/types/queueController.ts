import { type QueueChannel } from './queueChannel.ts';
import { type QueuePath } from './queuePath.ts';

export interface QueueController {
  getQueuePaths(): QueuePath[];
  getChannels(): QueueChannel[];
}
