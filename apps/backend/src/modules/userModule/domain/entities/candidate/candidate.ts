import { User, type UserState, type UserDraft } from '../user/user.ts';

export interface CandidateDraft extends UserDraft {
  readonly firstName: string;
  readonly lastName: string;
  readonly resumeUrl?: string | undefined;
  readonly linkedinUrl?: string | undefined;
  readonly githubUrl?: string | undefined;
}

export interface CandidateState {
  firstName: string;
  lastName: string;
  resumeUrl?: string | undefined;
  linkedinUrl?: string | undefined;
  githubUrl?: string | undefined;
}

interface SetFirstNamePayload {
  readonly firstName: string;
}

interface SetLastNamePayload {
  readonly lastName: string;
}

interface SetResumeUrlPayload {
  readonly resumeUrl: string;
}

interface SetLinkedinUrlPayload {
  readonly linkedinUrl: string;
}

interface SetGithubUrlPayload {
  readonly githubUrl: string;
}

export class Candidate extends User {
  private candidateState: CandidateState;

  public constructor(draft: CandidateDraft) {
    const {
      id,
      email,
      password,
      isEmailVerified,
      isDeleted,
      role,
      createdAt,
      firstName,
      lastName,
      githubUrl,
      linkedinUrl,
      resumeUrl,
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

    const state: CandidateState = {
      firstName,
      lastName,
    };

    if (githubUrl) {
      state.githubUrl = githubUrl;
    }

    if (linkedinUrl) {
      state.linkedinUrl = linkedinUrl;
    }

    if (resumeUrl) {
      state.resumeUrl = resumeUrl;
    }

    this.candidateState = state;
  }

  public getFirstName(): string {
    return this.candidateState.firstName;
  }

  public getLastName(): string {
    return this.candidateState.lastName;
  }

  public getResumeUrl(): string | undefined {
    return this.candidateState.resumeUrl;
  }

  public getLinkedinUrl(): string | undefined {
    return this.candidateState.linkedinUrl;
  }

  public getGithubUrl(): string | undefined {
    return this.candidateState.githubUrl;
  }

  public setResumeUrl(payload: SetResumeUrlPayload): void {
    this.candidateState.resumeUrl = payload.resumeUrl;
  }

  public setLinkedinUrl(payload: SetLinkedinUrlPayload): void {
    this.candidateState.linkedinUrl = payload.linkedinUrl;
  }

  public setGithubUrl(payload: SetGithubUrlPayload): void {
    this.candidateState.githubUrl = payload.githubUrl;
  }

  public setFirstName(payload: SetFirstNamePayload): void {
    this.candidateState.firstName = payload.firstName;
  }

  public setLastName(payload: SetLastNamePayload): void {
    this.candidateState.lastName = payload.lastName;
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
