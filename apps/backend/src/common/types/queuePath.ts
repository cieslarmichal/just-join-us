import { type QueueHandler } from './queueHandler.ts';

export interface QueuePathDraft {
  readonly queuePath: string;
  readonly handler: QueueHandler;
}

export class QueuePath {
  private readonly path: string;

  private readonly handler: QueueHandler;

  private constructor(draft: QueuePathDraft) {
    const { queuePath, handler } = draft;

    this.path = queuePath;

    this.handler = handler;
  }

  public static create(draft: QueuePathDraft): QueuePath {
    return new QueuePath(draft);
  }

  public getPath(): string {
    return this.path;
  }

  public getHandler(): QueueHandler {
    return this.handler;
  }
}
