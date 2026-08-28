import fs from 'fs';

const localUrl = fs.readFileSync('.env.local', 'utf8').match(/DATABASE_URL=["']?([^"'\r\n]+)/)?.[1];
const vercelContent = fs.existsSync('.env.vercel.prod.tmp') ? fs.readFileSync('.env.vercel.prod.tmp', 'utf8') : '';
const vercelUrl = vercelContent.match(/DATABASE_URL=["']?([^"'\r\n]+)/)?.[1] || vercelContent.match(/POSTGRES_URL=["']?([^"'\r\n]+)/)?.[1];

console.log('Local DB Host: ', localUrl ? new URL(localUrl).hostname : 'none');
console.log('Vercel DB Host:', vercelUrl ? new URL(vercelUrl).hostname : 'none');
console.log('Match exact DB URL:', localUrl === vercelUrl);

if (fs.existsSync('.env.vercel.prod.tmp')) {
  fs.unlinkSync('.env.vercel.prod.tmp');
}
