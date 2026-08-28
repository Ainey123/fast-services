import { neon } from '@neondatabase/serverless';
import { getDbUrl } from './get-db-url.mjs';

const sql = neon(getDbUrl());

async function main() {
  console.log('--- ALL PROFILES IN DATABASE ---');
  const profiles = await sql`
    SELECT id, full_name, email, role, status, created_at
    FROM public.profiles
    ORDER BY created_at ASC
  `;
  console.log(JSON.stringify(profiles, null, 2));

  console.log('\n--- ALL EMPLOYEES IN DATABASE ---');
  const employees = await sql`
    SELECT e.id, e.employee_code, e.department, e.position, e.status, e.created_at,
           p.full_name, p.email, p.role
    FROM public.employees e
    JOIN public.profiles p ON e.id = p.id
    ORDER BY e.created_at ASC
  `;
  console.log(JSON.stringify(employees, null, 2));
}

main().catch(console.error);
