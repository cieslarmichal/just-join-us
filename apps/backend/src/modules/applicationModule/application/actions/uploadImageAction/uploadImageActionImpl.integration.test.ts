import path from 'node:path';
import { expect, describe, it, beforeEach, afterEach } from 'vitest';

import { Generator } from '../../../../../../tests/generator.ts';
import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { type DependencyInjectionContainer } from '../../../../../common/dependencyInjection/dependencyInjectionContainer.ts';
import type { S3TestUtils } from '../../../../../common/s3/tests/s3TestUtils.ts';
import type { UuidService } from '../../../../../common/uuid/uuidService.ts';
import { type Config } from '../../../../../core/config.ts';
import { symbols } from '../../../symbols.ts';

import { type UploadImageAction } from './uploadImageAction.ts';

describe('UploadImageActionImpl', () => {
  let action: UploadImageAction;

  let s3TestUtils: S3TestUtils;

  let container: DependencyInjectionContainer;

  let config: Config;

  const resourcesDirectory = path.resolve(__dirname, '../../../../../../../../resources');

  const sampleFileName = 'sample_image.jpg';

  const bucketName = 'justjoinus-images-dev';

  const filePath = path.join(resourcesDirectory, sampleFileName);

  const imageId = Generator.uuid();

  beforeEach(async () => {
    container = await TestContainer.create();

    await container.overrideBinding<UuidService>(symbols.uuidService, () => ({
      generateUuid: (): string => imageId,
    }));

    action = container.get<UploadImageAction>(symbols.uploadImageAction);

    s3TestUtils = container.get<S3TestUtils>(testSymbols.s3TestUtils);

    config = container.get<Config>(symbols.config);

    await s3TestUtils.createBucket(bucketName);
  });

  afterEach(async () => {
    await s3TestUtils.deleteBucket(bucketName);
  });

  it('uploads an image', async () => {
    const existsBefore = await s3TestUtils.objectExists(bucketName, imageId);

    expect(existsBefore).toBe(false);

    const { imageUrl } = await action.execute({
      filePath,
      contentType: 'image/jpg',
    });

    expect(imageUrl).toEqual(`${config.aws.cloudfrontUrl}/${imageId}`);

    const existsAfter = await s3TestUtils.objectExists(bucketName, imageId);

    expect(existsAfter).toBe(true);
  });
});
