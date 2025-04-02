import { User, type UserState, type UserDraft } from '../user/user.ts';

export interface CandidateDraft extends UserDraft {
  readonly firstName: string;
  readonly lastName: string;
  readonly birthDate: Date;
  readonly phone: string;
}

export interface CandidateState {
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

export class Candidate extends User {
  private candidateState: CandidateState;

  public constructor(draft: CandidateDraft) {
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

    this.candidateState = {
      birthDate,
      firstName,
      lastName,
      phone,
    };
  }

  public getFirstName(): string {
    return this.candidateState.firstName;
  }

  public getLastName(): string {
    return this.candidateState.lastName;
  }

  public getBirthDate(): Date {
    return this.candidateState.birthDate;
  }

  public getPhone(): string {
    return this.candidateState.phone;
  }

  public setFirstName(payload: SetFirstNamePayload): void {
    this.candidateState.firstName = payload.firstName;
  }

  public setLastName(payload: SetLastNamePayload): void {
    this.candidateState.lastName = payload.lastName;
  }

  public setBirthDate(payload: SetBirthDatePayload): void {
    this.candidateState.birthDate = payload.birthDate;
  }

  public setPhone(payload: SetPhonePayload): void {
    this.candidateState.phone = payload.phone;
  }

  public getCandidateState(): CandidateState {
    return this.candidateState;
  }

  public getState(): CandidateState & UserState {
    return {
      ...this.candidateState,
      ...super.getUserState(),
    };
  }
}
