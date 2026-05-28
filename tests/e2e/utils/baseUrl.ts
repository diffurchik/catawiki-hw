import { config as loadEnv } from 'dotenv';
import { resolve } from 'node:path';

loadEnv({ path: resolve(__dirname, '../../../.env') });

const DEFAULT_BASE_URL = 'https://www.catawiki.com';

export function getBaseUrl(): string {
  const value = process.env.BASE_URL?.trim();
  return value || DEFAULT_BASE_URL;
}
