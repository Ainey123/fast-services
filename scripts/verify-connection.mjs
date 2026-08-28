import { neon } from '@neondatabase/serverless';
import { getDbUrl } from './get-db-url.mjs';

const connectionString = getDbUrl();


async function verify() {
  const sql = neon(connectionString);
  const services = await sql`SELECT count(*)::int as count FROM public.services`;
  const clients = await sql`SELECT count(*)::int as count FROM public.clients`;
  const products = await sql`SELECT count(*)::int as count FROM public.products`;
  const settings = await sql`SELECT company_name, app_name, email, phone FROM public.company_settings LIMIT 1`;
  
  console.log('==============================================');
  console.log('LIVE NEON POSTGRESQL VERIFICATION SUCCESSFUL');
  console.log('==============================================');
  console.log('Company:', settings[0]?.company_name);
  console.log('Brand:', settings[0]?.app_name);
  console.log('Contact:', settings[0]?.phone, '|', settings[0]?.email);
  console.log('Services Count:', services[0]?.count);
  console.log('Clients Count:', clients[0]?.count);
  console.log('Products Count:', products[0]?.count);
  console.log('==============================================');
}

verify().catch(console.error);
