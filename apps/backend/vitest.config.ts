import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'dotenv';
import { defineConfig } from 'vitest/config';

const testEnv = existsSync('.env.test') ? parse(readFileSync('.env.test', 'utf-8')) : {};

export default defineConfig({
  resolve: {
    alias: { '@': resolve(__dirname, './src') },
  },
  test: {
    environment: 'node',
    env: testEnv,
  },
});
