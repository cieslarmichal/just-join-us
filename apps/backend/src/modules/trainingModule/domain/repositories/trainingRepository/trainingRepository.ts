import { type TrainingState, type Training } from '../../entities/training/training.ts';

export interface CreateTrainingPayload {
  readonly data: Omit<TrainingState, 'id' | 'createdAt'>;
}

export interface UpdateTrainingPayload {
  readonly training: Training;
}

export interface FindTrainingPayload {
  readonly id?: string;
  readonly companyId?: string;
  readonly name?: string;
}

export interface FindTrainingsPayload {
  readonly name?: string | undefined;
  readonly companyId: string;
  readonly page: number;
  readonly pageSize: number;
}

export interface CountTrainingsPayload {
  readonly name?: string | undefined;
  readonly companyId: string;
}

export interface TrainingRepository {
  createTraining(payload: CreateTrainingPayload): Promise<Training>;
  updateTraining(payload: UpdateTrainingPayload): Promise<Training>;
  findTraining(payload: FindTrainingPayload): Promise<Training | null>;
  findTrainings(payload: FindTrainingsPayload): Promise<Training[]>;
  countTrainings(payload: CountTrainingsPayload): Promise<number>;
}
