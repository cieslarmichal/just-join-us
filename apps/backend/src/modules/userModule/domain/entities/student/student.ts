import { User, type UserState, type UserDraft } from '../user/user.ts';

export interface StudentDraft extends UserDraft {
  readonly firstName: string;
  readonly lastName: string;
  readonly birthDate: Date;
  readonly phone: string;
}

export interface StudentState {
  firstName: string;
  lastName: string;
  birthDate: Date;
  phone: string;
}

interface SetFirstNamePayload {
  readonly firstName: string;
}

interface SetLastNamePayload {
  readonly lastName: string;
}

interface SetBirthDatePayload {
  readonly birthDate: Date;
}

interface SetPhonePayload {
  readonly phone: string;
}

export class Student extends User {
  private studentState: StudentState;

  public constructor(draft: StudentDraft) {
    const { id, email, password, isEmailVerified, isDeleted, role, createdAt, birthDate, firstName, lastName, phone } =
      draft;

    super({
      id,
      email,
      password,
      isEmailVerified,
      isDeleted,
      role,
      createdAt,
    });

    this.studentState = {
      birthDate,
      firstName,
      lastName,
      phone,
    };
  }

  public getFirstName(): string {
    return this.studentState.firstName;
  }

  public getLastName(): string {
    return this.studentState.lastName;
  }

  public getBirthDate(): Date {
    return this.studentState.birthDate;
  }

  public getPhone(): string {
    return this.studentState.phone;
  }

  public setFirstName(payload: SetFirstNamePayload): void {
    this.studentState.firstName = payload.firstName;
  }

  public setLastName(payload: SetLastNamePayload): void {
    this.studentState.lastName = payload.lastName;
  }

  public setBirthDate(payload: SetBirthDatePayload): void {
    this.studentState.birthDate = payload.birthDate;
  }

  public setPhone(payload: SetPhonePayload): void {
    this.studentState.phone = payload.phone;
  }

  public getStudentState(): StudentState {
    return this.studentState;
  }

  public getState(): StudentState & UserState {
    return {
      ...this.studentState,
      ...super.getUserState(),
    };
  }
}
