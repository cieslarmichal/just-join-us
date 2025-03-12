export const httpHeaders = {
  authorization: 'Authorization',
  contentType: 'Content-Type',
  accept: 'Accept',
} as const;

export type HttpHeader = (typeof httpHeaders)[keyof typeof httpHeaders];
