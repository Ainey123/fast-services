import fs from 'fs';
import path from 'path';

export function getDbUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL.trim();
  if (process.env.POSTGRES_URL) return process.env.POSTGRES_URL.trim();

  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    for (const line of content.split('\n')) {
      const match = line.match(/^\s*(DATABASE_URL|POSTGRES_URL)\s*=\s*["']?(.*?)["']?\s*$/);
      if (match && match[2]) {
        return match[2].trim();
      }
    }
  }
  throw new Error('DATABASE_URL not found in environment or .env.local');
}
