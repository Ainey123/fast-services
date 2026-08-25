import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const connectionString = "postgresql://neondb_owner:npg_XVOCZUI9gt8q@ep-patient-river-axs53glt-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require";

async function updatePasswords() {
  const sql = neon(connectionString);
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash('Fast@2026', salt);

  console.log('Updating standard accounts in Neon...');
  await sql`
    UPDATE public.profiles
    SET password_hash = ${hash}
    WHERE email IN (
      'ahmed.raza@fastengineeringsolutions.com',
      'ali.hassan@fastengineeringsolutions.com',
      'usman.tariq@fastengineeringsolutions.com',
      'hamza.malik@fastengineeringsolutions.com',
      'tariq@apextextiles.com.pk'
    );
  `;

  console.log('✓ Standard account passwords set to Fast@2026');
}

updatePasswords().catch(console.error);
