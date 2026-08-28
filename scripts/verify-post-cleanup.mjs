import { neon } from '@neondatabase/serverless';
import { getDbUrl } from './get-db-url.mjs';

const sql = neon(getDbUrl());

async function main() {
  console.log('=== VERIFYING LIVE NEON POSTGRESQL POST-CLEANUP ===\n');

  const [
    clientsCount,
    projectsCount,
    tasksCount,
    productsCount,
    servicesCount,
    requestsCount,
    employeesCount,
    profilesCount
  ] = await Promise.all([
    sql`SELECT count(*)::int as cnt FROM public.clients`,
    sql`SELECT count(*)::int as cnt FROM public.projects`,
    sql`SELECT count(*)::int as cnt FROM public.tasks`,
    sql`SELECT count(*)::int as cnt FROM public.products`,
    sql`SELECT count(*)::int as cnt FROM public.services`,
    sql`SELECT count(*)::int as cnt FROM public.service_requests`,
    sql`SELECT count(*)::int as cnt FROM public.employees`,
    sql`SELECT count(*)::int as cnt FROM public.profiles`
  ]);

  console.log('Table Counts:');
  console.log(`- Clients:          ${clientsCount[0].cnt}`);
  console.log(`- Projects:         ${projectsCount[0].cnt}`);
  console.log(`- Tasks:            ${tasksCount[0].cnt}`);
  console.log(`- Products:         ${productsCount[0].cnt}`);
  console.log(`- Services:         ${servicesCount[0].cnt}`);
  console.log(`- Service Requests: ${requestsCount[0].cnt}`);
  console.log(`- Employees:        ${employeesCount[0].cnt}`);
  console.log(`- Profiles:         ${profilesCount[0].cnt}`);

  const activeEmployees = await sql`
    SELECT e.id, e.employee_code, e.department, e.position, p.full_name, p.email, p.role
    FROM public.employees e
    JOIN public.profiles p ON e.id = p.id
  `;
  console.log('\nRemaining Employees:');
  console.log(JSON.stringify(activeEmployees, null, 2));

  const allProfiles = await sql`
    SELECT id, full_name, email, role, created_at
    FROM public.profiles
    ORDER BY created_at ASC
  `;
  console.log('\nRemaining Real Profiles:');
  console.log(JSON.stringify(allProfiles, null, 2));
}

main().catch(console.error);
