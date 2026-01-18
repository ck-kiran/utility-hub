import { z } from 'zod';
import Constants from 'expo-constants';

const envSchema = z.object({
  API_URL: z.string().url().optional(),
  APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
});

const expoConfig = Constants.expoConfig?.extra ?? {};

const parsed = envSchema.safeParse({
  API_URL: expoConfig.apiUrl ?? process.env.EXPO_PUBLIC_API_URL,
  APP_ENV: expoConfig.appEnv ?? process.env.EXPO_PUBLIC_APP_ENV ?? 'development',
});

if (!parsed.success) {
  throw new Error('Invalid environment variables');
}

export const env = parsed.data;
