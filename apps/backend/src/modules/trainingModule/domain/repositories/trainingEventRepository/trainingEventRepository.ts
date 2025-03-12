import { type TrainingEvent, type TrainingEventDraft } from '../../entities/trainingEvent/trainingEvent.ts';

export interface CreateTrainingEventPayload {
  readonly data: Omit<TrainingEventDraft, 'id' | 'createdAt'>;
}

export interface UpdateTrainingEventPayload {
  readonly trainingEvent: TrainingEvent;
}

export interface FindTrainingEventPayload {
  readonly id: string;
}

export interface FindTrainingEventsPayload {
  readonly trainingName?: string | undefined;
  readonly categoryId?: string | undefined;
  readonly companyId?: string | undefined;
  readonly latitude?: number | undefined;
  readonly longitude?: number | undefined;
  readonly radius?: number | undefined;
  readonly page: number;
  readonly pageSize: number;
}

export interface CountTrainingEventsPayload {
  readonly trainingName?: string | undefined;
  readonly categoryId?: string | undefined;
  readonly companyId?: string | undefined;
  readonly latitude?: number | undefined;
  readonly longitude?: number | undefined;
  readonly radius?: number | undefined;
}

export interface TrainingEventRepository {
  createTrainingEvent(payload: CreateTrainingEventPayload): Promise<TrainingEvent>;
  updateTrainingEvent(payload: UpdateTrainingEventPayload): Promise<TrainingEvent>;
  findTrainingEvent(payload: FindTrainingEventPayload): Promise<TrainingEvent | null>;
  findTrainingEvents(payload: FindTrainingEventsPayload): Promise<TrainingEvent[]>;
  countTrainingEvents(payload: CountTrainingEventsPayload): Promise<number>;
}
