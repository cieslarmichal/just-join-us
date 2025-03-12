import { serializeError } from './common/errors/serializeError.ts';
import { Application } from './core/application.ts';

export const finalErrorHandler = async (error: unknown): Promise<void> => {
  const serializedError = serializeError(error);

  console.error({
    message: 'Application error.',
    context: JSON.stringify(serializedError),
  });

  await Application.stop();

  process.exit(1);
};

process.on('unhandledRejection', finalErrorHandler);

process.on('uncaughtException', finalErrorHandler);

process.on('SIGINT', finalErrorHandler);

process.on('SIGTERM', finalErrorHandler);

try {
  await Application.start();
} catch (error) {
  await finalErrorHandler(error);
}
