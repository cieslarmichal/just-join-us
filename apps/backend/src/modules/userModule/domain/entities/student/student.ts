import { User, type UserState, type UserDraft } from '../user/user.ts';

export interface StudentDraft extends UserDraft {
  readonly firstName: string;
  readonly lastName: string;
  readonly birthDate: Date;
  readonly phoneNumber: string;
}

export interface StudentState {
  firstName: string;
  lastName: string;
  birthDate: Date;
  phoneNumber: string;
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

interface SetPhoneNumberPayload {
  readonly phoneNumber: string;
}

export class Student extends User {
  private studentState: StudentState;

  public constructor(draft: StudentDraft) {
    const {
      id,
      email,
      password,
      isEmailVerified,
      isDeleted,
      role,
      createdAt,
      birthDate,
      firstName,
      lastName,
      phoneNumber,
    } = draft;

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
      phoneNumber,
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

  public getPhoneNumber(): string {
    return this.studentState.phoneNumber;
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

  public setPhoneNumber(payload: SetPhoneNumberPayload): void {
    this.studentState.phoneNumber = payload.phoneNumber;
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
