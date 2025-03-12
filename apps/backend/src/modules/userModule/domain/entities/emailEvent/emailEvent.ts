import { type BaseEmailPayload } from './types/baseEmailPayload.ts';
import { type EmailEventStatus } from './types/emailEventStatus.ts';
import { type EmailEventType } from './types/emailEventType.ts';

export interface EmailEventDraftState {
  readonly payload: BaseEmailPayload;
  readonly eventName: EmailEventType;
}

export class EmailEventDraft {
  private payload: BaseEmailPayload;

  private eventName: EmailEventType;

  public constructor(draft: EmailEventDraftState) {
    const { payload, eventName } = draft;

    this.payload = payload;

    this.eventName = eventName;
  }

  public getPayload(): BaseEmailPayload {
    return this.payload;
  }

  public getEmailEventName(): EmailEventType {
    return this.eventName;
  }
}

export interface EmailEventState {
  readonly id: string;
  readonly status: EmailEventStatus;
  readonly eventName: EmailEventType;
  readonly payload: BaseEmailPayload;
  readonly createdAt: Date;
}

export class EmailEvent {
  private id: string;

  private status: EmailEventStatus;

  private payload: BaseEmailPayload;

  private createdAt: Date;

  private eventName: EmailEventType;

  public constructor(draft: EmailEventState) {
    const { id, status, payload, createdAt, eventName } = draft;

    this.id = id;

    this.status = status;

    this.payload = payload;

    this.createdAt = createdAt;

    this.eventName = eventName;
  }

  public getId(): string {
    return this.id;
  }

  public getStatus(): EmailEventStatus {
    return this.status;
  }

  public getPayload(): BaseEmailPayload {
    return this.payload;
  }

  public getEmailEventName(): EmailEventType {
    return this.eventName;
  }

  public getRecipientEmail(): string {
    return this.payload.recipientEmail;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }
}
