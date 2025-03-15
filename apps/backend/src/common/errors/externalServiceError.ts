import { BaseError, type BaseErrorContext } from './baseError.ts';

interface Context extends BaseErrorContext {
  readonly service: string;
}

export class ExternalServiceError extends BaseError<Context> {
  public constructor(context: Context) {
    super('ExternalServiceError', 'External service error.', context);
  }
}
