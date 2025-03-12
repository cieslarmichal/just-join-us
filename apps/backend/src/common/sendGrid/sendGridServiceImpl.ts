import { httpHeaders } from '../http/httpHeader.ts';
import { httpMediaTypes } from '../http/httpMediaType.ts';
import { httpMethodNames } from '../http/httpMethodName.ts';
import { type HttpService } from '../httpService/httpService.ts';

import { type SendEmailPayload, type SendGridService } from './sendGridService.ts';

export interface SendGridConfig {
  readonly apiKey: string;
  readonly senderEmail: string;
}

export class SendGridServiceImpl implements SendGridService {
  private readonly httpService: HttpService;
  private readonly config: SendGridConfig;

  public constructor(httpService: HttpService, config: SendGridConfig) {
    this.httpService = httpService;
    this.config = config;
  }

  public async sendEmail(payload: SendEmailPayload): Promise<void> {
    const { toEmail, subject, body } = payload;

    const { apiKey, senderEmail } = this.config;

    const url = 'https://api.sendgrid.com/v3/mail/send';

    const requestBody = {
      personalizations: [
        {
          to: [
            {
              email: toEmail,
            },
          ],
        },
      ],
      from: {
        email: senderEmail,
      },
      subject,
      content: [
        {
          type: httpMediaTypes.textHtml,
          value: body,
        },
      ],
    };

    const requestHeaders = {
      [httpHeaders.authorization]: `Bearer ${apiKey}`,
      [httpHeaders.contentType]: httpMediaTypes.applicationJson,
    };

    await this.httpService.sendRequest({
      method: httpMethodNames.post,
      url,
      body: requestBody,
      headers: requestHeaders,
    });
  }
}
