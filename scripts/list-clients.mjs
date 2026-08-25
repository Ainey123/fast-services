import { neon } from '@neondatabase/serverless';

const connectionString = "postgresql://neondb_owner:npg_XVOCZUI9gt8q@ep-patient-river-axs53glt-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require";

async function testQuery() {
  const sql = neon(connectionString);
  const clients = await sql`SELECT client_code, company_name, contact_person, phone FROM public.clients`;
  console.log('CLIENTS IN NEON TABLE RIGHT NOW:');
  console.table(clients);
}

testQuery().catch(console.error);
