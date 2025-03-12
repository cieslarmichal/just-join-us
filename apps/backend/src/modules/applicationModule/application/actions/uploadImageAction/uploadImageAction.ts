import type { Action } from '../../../../../common/types/action.ts';

export interface UploadImageActionPayload {
  readonly filePath: string;
  readonly contentType: string;
  readonly userId: string;
}

export interface UploadImageActionResult {
  readonly imageUrl: string;
}

export type UploadImageAction = Action<UploadImageActionPayload, UploadImageActionResult>;
