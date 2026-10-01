import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const app = JSON.parse(readFileSync(resolve(root, 'app.json'), 'utf8')).expo;
const eas = JSON.parse(readFileSync(resolve(root, 'eas.json'), 'utf8'));

const errors = [];
const warnings = [];

if (app.name !== 'BizExpense Mobile') errors.push('app.json expo.name must be BizExpense Mobile.');
if (app.slug !== 'bizexpense-mobile') errors.push('app.json expo.slug must be bizexpense-mobile.');
if (!eas.build?.development?.developmentClient) errors.push('The development EAS profile must enable developmentClient.');
for (const profile of ['development', 'preview', 'production']) {
  if (!eas.build?.[profile]) errors.push(`Missing EAS build profile: ${profile}.`);
}

if (!process.env.EXPO_PUBLIC_API_URL) warnings.push('EXPO_PUBLIC_API_URL is not set. Localhost fallback will be used.');
if (!process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY) warnings.push('iOS RevenueCat public API key is not set.');
if (!process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY) warnings.push('Android RevenueCat public API key is not set.');

for (const warning of warnings) console.warn(`WARNING: ${warning}`);
for (const error of errors) console.error(`ERROR: ${error}`);

if (errors.length) process.exitCode = 1;
else console.log('EAS structure is valid. Missing account-owned values are reported as warnings.');
