import { type Action } from '../../../../../common/types/action.ts';
import { type Student } from '../../../domain/entities/student/student.ts';

export interface UpdateStudentActionPayload {
  readonly id: string;
  readonly firstName?: string | undefined;
  readonly lastName?: string | undefined;
  readonly birthDate?: Date | undefined;
  readonly phoneNumber?: string | undefined;
  readonly isDeleted?: boolean | undefined;
}

export interface UpdateStudentActionResult {
  readonly student: Student;
}

export type UpdateStudentAction = Action<UpdateStudentActionPayload, UpdateStudentActionResult>;
