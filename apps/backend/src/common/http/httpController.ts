import { type HttpRoute } from './httpRoute.ts';

export abstract class HttpController {
  public abstract readonly tags: string[];

  public abstract getHttpRoutes(): HttpRoute[];
}
