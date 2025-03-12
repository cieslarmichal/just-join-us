import { type Student, type StudentDraft } from '../../entities/student/student.ts';

export interface CreateStudentPayload {
  readonly data: Omit<StudentDraft, 'id' | 'createdAt'>;
}

export interface UpdateStudentPayload {
  readonly student: Student;
}

export interface FindStudentPayload {
  readonly id?: string;
  readonly email?: string;
}

export interface FindStudentsPayload {
  readonly page: number;
  readonly pageSize: number;
}

export interface StudentRepository {
  createStudent(payload: CreateStudentPayload): Promise<Student>;
  updateStudent(payload: UpdateStudentPayload): Promise<Student>;
  findStudent(payload: FindStudentPayload): Promise<Student | null>;
  findStudents(payload: FindStudentsPayload): Promise<Student[]>;
  countStudents(): Promise<number>;
}
