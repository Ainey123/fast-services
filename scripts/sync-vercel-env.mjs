import { execSync } from 'child_process';
import fs from 'fs';

const envLocal = fs.readFileSync('.env.local', 'utf8');
const dbUrl = envLocal.match(/DATABASE_URL=["']?([^"'\r\n]+)/)?.[1]?.trim();

if (!dbUrl) {
  throw new Error('DATABASE_URL not found in .env.local');
}

console.log('Synchronizing DATABASE_URL and POSTGRES_URL with Vercel Production...');

try {
  // Remove existing if any
  try {
    execSync('npx vercel env rm DATABASE_URL production --yes --scope ainey123s-projects', { stdio: 'inherit' });
  } catch (e) {
    // ignore
  }

  try {
    execSync('npx vercel env rm POSTGRES_URL production --yes --scope ainey123s-projects', { stdio: 'inherit' });
  } catch (e) {
    // ignore
  }

  // Add DATABASE_URL to production
  execSync(`npx vercel env add DATABASE_URL production --scope ainey123s-projects`, {
    input: dbUrl,
    stdio: ['pipe', 'inherit', 'inherit']
  });

  // Add POSTGRES_URL to production
  execSync(`npx vercel env add POSTGRES_URL production --scope ainey123s-projects`, {
    input: dbUrl,
    stdio: ['pipe', 'inherit', 'inherit']
  });

  console.log('✓ Successfully synchronized Neon PostgreSQL DATABASE_URL to Vercel production environment.');
} catch (err) {
  console.error('Error syncing env to Vercel:', err);
}
