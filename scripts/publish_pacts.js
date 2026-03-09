#!/usr/bin/env node

const path = require('path');
const { spawnSync } = require('child_process');

// Load .env into process.env for this script + its child processes.
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const requiredEnv = ['PACT_BROKER_BASE_URL', 'PACT_BROKER_TOKEN'];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
  console.error(`Missing required environment variables: ${missingEnv.join(', ')}`);
  console.error('Create a .env file at the project root, or export them in your shell.');
  process.exit(1);
}

const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const result = spawnSync(
  npxCmd,
  ['pact-broker', 'publish', '--auto-detect-version-properties', './pacts'],
  {
    stdio: 'inherit',
    env: process.env,
  }
);

process.exit(typeof result.status === 'number' ? result.status : 1);
