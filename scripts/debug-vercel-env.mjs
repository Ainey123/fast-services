import fs from 'fs';

const vercelContent = fs.existsSync('.env.vercel.prod.tmp') ? fs.readFileSync('.env.vercel.prod.tmp', 'utf8') : '';

console.log('Line prefixes in .env.vercel.prod.tmp:');
vercelContent.split('\n').forEach(l => {
  const eqIdx = l.indexOf('=');
  if (eqIdx !== -1) {
    const key = l.substring(0, eqIdx);
    const valLength = l.substring(eqIdx + 1).length;
    console.log(`- ${key}: value length = ${valLength}`);
  }
});

if (fs.existsSync('.env.vercel.prod.tmp')) {
  fs.unlinkSync('.env.vercel.prod.tmp');
}
