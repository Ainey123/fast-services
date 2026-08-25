import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

// Test the EXACT same logic the server action uses
const conn = 'postgresql://neondb_owner:npg_XVOCZUI9gt8q@ep-patient-river-axs53glt-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require';
const sql = neon(conn);

async function simulateLogin(email, password) {
  console.log(`\nTesting: ${email} / ${password}`);
  const cleanEmail = email.toLowerCase().trim();
  
  const rows = await sql`
    SELECT id, full_name, email, phone, password_hash, role, status
    FROM public.profiles
    WHERE LOWER(email) = ${cleanEmail}
    LIMIT 1
  `;
  
  if (!rows || rows.length === 0) {
    console.log('  → FAIL: No row found');
    return;
  }
  
  const row = rows[0];
  console.log(`  → Found: role=${row.role}, status=${row.status}, has_hash=${Boolean(row.password_hash)}`);
  console.log(`  → hash prefix: ${row.password_hash?.substring(0, 15)}...`);
  
  if (!row.password_hash) {
    console.log('  → FAIL: No password_hash stored');
    return;
  }
  
  const valid = await bcrypt.compare(password, row.password_hash);
  console.log(`  → bcrypt result: ${valid ? '✅ VALID' : '❌ INVALID'}`);
}

(async () => {
  await simulateLogin('ahmed.raza@fastengineeringsolutions.com', 'Fast@2026');
  await simulateLogin('fastsales.services@gmail.com', 'Fast@2026');
  await simulateLogin('tariq@apextextiles.com.pk', 'Fast@2026');
})().catch(console.error);
