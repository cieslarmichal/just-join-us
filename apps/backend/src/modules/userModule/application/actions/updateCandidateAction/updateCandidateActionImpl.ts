import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
import { type LoggerService } from '../../../../../common/logger/loggerService.ts';
import { type CandidateRepository } from '../../../domain/repositories/candidateRepository/candidateRepository.ts';

import {
  type UpdateCandidateActionResult,
  type UpdateCandidateAction,
  type UpdateCandidateActionPayload,
} from './updateCandidateAction.ts';

export class UpdateCandidateActionImpl implements UpdateCandidateAction {
  private readonly candidateRepository: CandidateRepository;
  private readonly loggerService: LoggerService;

  public constructor(candidateRepository: CandidateRepository, loggerService: LoggerService) {
    this.candidateRepository = candidateRepository;
    this.loggerService = loggerService;
  }

  public async execute(payload: UpdateCandidateActionPayload): Promise<UpdateCandidateActionResult> {
    const { id, firstName, lastName, githubUrl, linkedinUrl, resumeUrl, isDeleted } = payload;

    this.loggerService.debug({
      message: 'Updating candidate...',
      id,
      firstName,
      lastName,
      githubUrl,
      linkedinUrl,
      resumeUrl,
      isDeleted,
    });

    const candidate = await this.candidateRepository.findCandidate({ id });

    if (!candidate) {
      throw new OperationNotValidError({
        reason: 'Candidate not found.',
        id,
      });
    }

    if (firstName !== undefined) {
      candidate.setFirstName({ firstName });
    }

    if (lastName !== undefined) {
      candidate.setLastName({ lastName });
    }

    if (githubUrl !== undefined) {
      candidate.setGithubUrl({ githubUrl });
    }

    if (linkedinUrl !== undefined) {
      candidate.setLinkedinUrl({ linkedinUrl });
    }

    if (resumeUrl !== undefined) {
      candidate.setResumeUrl({ resumeUrl });
    }

    if (isDeleted !== undefined) {
      candidate.setIsDeleted({ isDeleted });
    }

    await this.candidateRepository.updateCandidate({ candidate });

    return { candidate };
  }
}
