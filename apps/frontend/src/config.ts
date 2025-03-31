import { z } from 'zod';

const appConfig = {
  backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
  mapTiler: {
    apiKey: import.meta.env.VITE_MAPTILER_API_KEY,
  },
};

const configSchema = z.object({
  backendUrl: z.string().min(1),
  mapTiler: z.object({
    apiKey: z.string().min(1),
  }),
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
