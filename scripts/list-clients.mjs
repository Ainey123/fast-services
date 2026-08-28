import { neon } from '@neondatabase/serverless';
import { getDbUrl } from './get-db-url.mjs';

const connectionString = getDbUrl();


async function testQuery() {
  const sql = neon(connectionString);
  const clients = await sql`SELECT client_code, company_name, contact_person, phone FROM public.clients`;
  console.log('CLIENTS IN NEON TABLE RIGHT NOW:');
  console.table(clients);
}

testQuery().catch(console.error);
