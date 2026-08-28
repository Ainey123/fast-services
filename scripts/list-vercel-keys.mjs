import fs from 'fs';

const vercelContent = fs.existsSync('.env.vercel.prod.tmp') ? fs.readFileSync('.env.vercel.prod.tmp', 'utf8') : '';
const keys = vercelContent.split('\n').map(l => l.split('=')[0].trim()).filter(Boolean);
console.log('Keys in Vercel Production Environment:');
console.log(keys);

if (fs.existsSync('.env.vercel.prod.tmp')) {
  fs.unlinkSync('.env.vercel.prod.tmp');
}
