import type { HttpMethodName } from '../http/httpMethodName.ts';
import type { HttpStatusCode } from '../http/httpStatusCode.ts';

export interface SendRequestPayload {
  readonly body?: unknown;
  readonly headers: Record<string, string>;
  readonly method: HttpMethodName;
  readonly queryParams?: Record<string, string>;
  readonly url: string;
}

export interface HttpResponse<ReponseBody = unknown> {
  readonly body: ReponseBody;
  readonly statusCode: HttpStatusCode;
}

export interface HttpService {
  sendRequest<ResponseBody>(options: SendRequestPayload): Promise<HttpResponse<ResponseBody>>;
}
