import { type HttpRequest } from './httpRequest.ts';
import { type HttpResponse } from './httpResponse.ts';

export type HttpRouteHandler = (request: HttpRequest) => Promise<HttpResponse>;
