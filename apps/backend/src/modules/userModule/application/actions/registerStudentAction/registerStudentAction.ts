import { type Action } from '../../../../../common/types/action.ts';
import { type Student } from '../../../domain/entities/student/student.ts';

export interface RegisterStudentActionPayload {
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly phoneNumber: string;
  readonly birthDate: Date;
}

export interface RegisterStudentActionResult {
  readonly student: Student;
}

export type RegisterStudentAction = Action<RegisterStudentActionPayload, RegisterStudentActionResult>;
