import fs from 'fs';

const localUrl = fs.readFileSync('.env.local', 'utf8').match(/DATABASE_URL=["']?([^"'\r\n]+)/)?.[1];
const vercelContent = fs.existsSync('.env.vercel.prod.tmp') ? fs.readFileSync('.env.vercel.prod.tmp', 'utf8') : '';

let vercelDbUrl = '';
let vercelPostgresUrl = '';

for (const line of vercelContent.split('\n')) {
  if (line.startsWith('DATABASE_URL=')) {
    vercelDbUrl = line.replace('DATABASE_URL=', '').replace(/^["']|["']$/g, '').trim();
  }
  if (line.startsWith('POSTGRES_URL=')) {
    vercelPostgresUrl = line.replace('POSTGRES_URL=', '').replace(/^["']|["']$/g, '').trim();
  }
}

console.log('Local DATABASE_URL Host:    ', localUrl ? new URL(localUrl).hostname : 'none');
console.log('Vercel DATABASE_URL Host:   ', vercelDbUrl ? new URL(vercelDbUrl).hostname : 'none');
console.log('Vercel POSTGRES_URL Host:   ', vercelPostgresUrl ? new URL(vercelPostgresUrl).hostname : 'none');
console.log('Local === Vercel DATABASE_URL:', localUrl === vercelDbUrl);
console.log('Local === Vercel POSTGRES_URL:', localUrl === vercelPostgresUrl);

if (fs.existsSync('.env.vercel.prod.tmp')) {
  fs.unlinkSync('.env.vercel.prod.tmp');
}
