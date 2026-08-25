import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const connectionString = "postgresql://neondb_owner:npg_XVOCZUI9gt8q@ep-patient-river-axs53glt-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require";

async function inspectProfiles() {
  const sql = neon(connectionString);
  const profiles = await sql`
    SELECT id, email, full_name, role, status, password_hash 
    FROM public.profiles
    ORDER BY created_at DESC;
  `;

  console.log('--- ALL PROFILES IN NEON ---');
  for (const p of profiles) {
    const testFast = p.password_hash ? await bcrypt.compare('Fast@2026', p.password_hash) : false;
    const testPass = p.password_hash ? await bcrypt.compare('password123', p.password_hash) : false;
    const testAdmin = p.password_hash ? await bcrypt.compare('admin123', p.password_hash) : false;
    const testSecure = p.password_hash ? await bcrypt.compare('SecurePassword123!', p.password_hash) : false;
    
    console.log({
      email: p.email,
      role: p.role,
      status: p.status,
      has_hash: Boolean(p.password_hash),
      valid_for_Fast2026: testFast,
      valid_for_password123: testPass,
      valid_for_admin123: testAdmin,
      valid_for_SecurePassword123: testSecure,
    });
  }
}

inspectProfiles().catch(console.error);
