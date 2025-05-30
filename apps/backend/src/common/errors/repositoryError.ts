import { BaseError, type BaseErrorContext } from './baseError.ts';

interface Context extends BaseErrorContext {
  readonly entity: string;
  readonly operation: string;
}

export class RepositoryError extends BaseError<Context> {
  public constructor(context: Context) {
    super('RepositoryError', 'Repository error.', context);
  }
}
