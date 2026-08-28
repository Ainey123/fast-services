import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { getDbUrl } from './get-db-url.mjs';

const connectionString = getDbUrl();


async function addMasterAccounts() {
  const sql = neon(connectionString);
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash('Fast@2026', salt);

  const accounts = [
    { email: 'fastsales.services@gmail.com', name: 'FAST Engineering Admin', role: 'ADMIN', phone: '+92 300 4545280' },
    { email: 'admin@fastservices.com', name: 'Admin', role: 'ADMIN', phone: '+92 300 4545280' },
    { email: 'ahmed.raza@fastengineeringsolutions.com', name: 'Engr. Ahmed Raza', role: 'ADMIN', phone: '+92 300 5551122' },
    { email: 'ali.hassan@fastengineeringsolutions.com', name: 'Engr. Ali Hassan', role: 'MANAGER', phone: '+92 301 6662233' },
    { email: 'usman.tariq@fastengineeringsolutions.com', name: 'Usman Tariq', role: 'EMPLOYEE', phone: '+92 302 7773344' },
    { email: 'hamza.malik@fastengineeringsolutions.com', name: 'Hamza Malik', role: 'EMPLOYEE', phone: '+92 303 8884455' },
    { email: 'fara.test@example.com', name: 'Fara', role: 'EMPLOYEE', phone: '+92 300 1234567' },
    { email: 'tariq@apextextiles.com.pk', name: 'Tariq Mehmood', role: 'CUSTOMER', phone: '+92 300 8472910' }
  ];

  console.log('Seeding / updating all master accounts in Neon...');
  for (const acc of accounts) {
    await sql`
      INSERT INTO public.profiles (full_name, email, phone, password_hash, role, status)
      VALUES (${acc.name}, ${acc.email.toLowerCase().trim()}, ${acc.phone}, ${hash}, ${acc.role}, 'ACTIVE')
      ON CONFLICT (email) DO UPDATE SET
        password_hash = ${hash},
        role = ${acc.role},
        status = 'ACTIVE';
    `;
  }

  console.log('✓ All master accounts synced in Neon PostgreSQL.');
}

addMasterAccounts().catch(console.error);
