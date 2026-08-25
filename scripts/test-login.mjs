import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const connectionString = "postgresql://neondb_owner:npg_XVOCZUI9gt8q@ep-patient-river-axs53glt-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require";

async function testLogin(email, password) {
  const sql = neon(connectionString);
  const cleanEmail = email.toLowerCase().trim();
  
  const rows = await sql`
    SELECT id, email, role, status, password_hash
    FROM public.profiles
    WHERE LOWER(email) = ${cleanEmail}
    LIMIT 1
  `;
  
  if (!rows || rows.length === 0) {
    console.log(`❌ RESULT: No profile found for email: ${email}`);
    return;
  }
  
  const row = rows[0];
  console.log(`✓ Found profile: ${row.email} | Role: ${row.role} | Status: ${row.status} | Has hash: ${Boolean(row.password_hash)}`);
  
  if (!row.password_hash) {
    console.log(`❌ RESULT: password_hash is NULL — no password set`);
    return;
  }
  
  const isValid = await bcrypt.compare(password, row.password_hash);
  console.log(`${isValid ? '✅' : '❌'} RESULT: bcrypt.compare("${password}", hash) = ${isValid}`);
}

(async () => {
  console.log('\n=== Testing Login Credentials ===\n');
  await testLogin('ahmed.raza@fastengineeringsolutions.com', 'Fast@2026');
  await testLogin('fastsales.services@gmail.com', 'Fast@2026');
  await testLogin('admin@fastservices.com', 'Fast@2026');
})().catch(console.error);
