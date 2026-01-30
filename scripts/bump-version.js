#!/usr/bin/env node

/**
 * Script to bump build version and add timestamp
 * Runs before Next.js build to set NEXT_PUBLIC_* env vars
 */

const fs = require('fs');
const path = require('path');

// Read package.json to get current version
const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Parse version (e.g., "1.0.0" -> [1, 0, 0])
const versionParts = packageJson.version.split('.');
const patchVersion = parseInt(versionParts[2] || 0) + 1;
const newVersion = `${versionParts[0]}.${versionParts[1]}.${patchVersion}`;

// Get current timestamp
const now = new Date();
const timestamp = now.toISOString();

// Create .env.build file with NEXT_PUBLIC_* vars
// These will be picked up by Next.js build process
const envBuildContent = `NEXT_PUBLIC_BUILD_VERSION=${newVersion}
NEXT_PUBLIC_BUILD_TIMESTAMP=${timestamp}
`;

const envBuildPath = path.join(__dirname, '../.env.build');
fs.writeFileSync(envBuildPath, envBuildContent, 'utf8');

// Also set for current process (in case needed)
process.env.NEXT_PUBLIC_BUILD_VERSION = newVersion;
process.env.NEXT_PUBLIC_BUILD_TIMESTAMP = timestamp;

console.log(`✓ Build version bumped to: ${newVersion}`);
console.log(`✓ Build timestamp: ${timestamp}`);
console.log(`✓ Created .env.build with environment variables`);
