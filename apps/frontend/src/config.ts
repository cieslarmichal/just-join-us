import { z } from 'zod';
import appConfig from 'config';

const configSchema = z.object({
  backendUrl: z.string().min(1),
});

export type Config = z.infer<typeof configSchema>;

export function createConfig(): Config {
  const parsedConfig = configSchema.safeParse(appConfig);

  if (!parsedConfig.success) {
    console.error(parsedConfig.error);
    throw new Error('Configuration error');
  }

  return parsedConfig.data;
}

export const config = createConfig();
