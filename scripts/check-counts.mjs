import { neon } from '@neondatabase/serverless';
import { getDbUrl } from './get-db-url.mjs';

const connectionString = getDbUrl();


async function check() {
  const sql = neon(connectionString);
  const profiles = await sql`SELECT count(*)::int as count FROM public.profiles`;
  const employees = await sql`SELECT count(*)::int as count FROM public.employees`;
  const projects = await sql`SELECT count(*)::int as count FROM public.projects`;
  const tasks = await sql`SELECT count(*)::int as count FROM public.tasks`;
  const requests = await sql`SELECT count(*)::int as count FROM public.service_requests`;
  const services = await sql`SELECT count(*)::int as count FROM public.services`;
  const clients = await sql`SELECT count(*)::int as count FROM public.clients`;
  const products = await sql`SELECT count(*)::int as count FROM public.products`;

  console.log('CURRENT ROW COUNTS IN NEON:');
  console.log(' - profiles:', profiles[0]?.count);
  console.log(' - employees:', employees[0]?.count);
  console.log(' - projects:', projects[0]?.count);
  console.log(' - tasks:', tasks[0]?.count);
  console.log(' - requests:', requests[0]?.count);
  console.log(' - services:', services[0]?.count);
  console.log(' - clients:', clients[0]?.count);
  console.log(' - products:', products[0]?.count);
}

check().catch(console.error);
