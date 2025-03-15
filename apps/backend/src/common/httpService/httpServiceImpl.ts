import { stringify } from 'querystring';

import { ExternalServiceError } from '../errors/externalServiceError.ts';
import type { HttpStatusCode } from '../http/httpStatusCode.ts';

import { type SendRequestPayload, type HttpResponse, type HttpService } from './httpService.ts';

export class HttpServiceImpl implements HttpService {
  public async sendRequest<ResponseBody>(payload: SendRequestPayload): Promise<HttpResponse<ResponseBody>> {
    const { body, headers, method, queryParams, url } = payload;

    let requestUrl = url;

    if (queryParams && Object.keys(queryParams).length) {
      requestUrl += `?${stringify(queryParams)}`;
    }

    try {
      const response = await fetch(requestUrl, {
        body: body ? JSON.stringify(body) : null,
        headers,
        method,
      });

      if (!response.ok) {
        throw new ExternalServiceError({
          method,
          service: 'HttpService',
          statusCode: response.status,
          url,
        });
      }

      const responseBody = await response.text();

      if (!responseBody.length) {
        return {
          body: {} as ResponseBody,
          statusCode: response.status as HttpStatusCode,
        };
      }

      return {
        body: JSON.parse(responseBody) as ResponseBody,
        statusCode: response.status as HttpStatusCode,
      };
    } catch (error) {
      throw new ExternalServiceError({
        method,
        originalError: error,
        service: 'HttpService',
        url,
      });
    }
  }
}
