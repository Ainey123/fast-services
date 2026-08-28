import { neon } from '@neondatabase/serverless';
import { getDbUrl } from './get-db-url.mjs';

const sql = neon(getDbUrl());

async function main() {
  console.log('=== FORENSIC DATABASE INSPECTION ===\n');

  // 1. Check Clients table
  console.log('--- 1. CLIENTS TABLE ---');
  const clients = await sql`SELECT * FROM public.clients ORDER BY created_at ASC`;
  console.log(JSON.stringify(clients, null, 2));

  // 2. Check Projects table
  console.log('\n--- 2. PROJECTS TABLE ---');
  const projects = await sql`
    SELECT p.*, c.company_name as client_name, s.name as service_name
    FROM public.projects p
    LEFT JOIN public.clients c ON p.client_id = c.id
    LEFT JOIN public.services s ON p.service_id = s.id
    ORDER BY p.created_at ASC
  `;
  console.log(JSON.stringify(projects, null, 2));

  // 3. Check Tasks table
  console.log('\n--- 3. TASKS TABLE ---');
  const tasks = await sql`
    SELECT t.*, p.project_code, p.name as project_name,
           e.employee_code, pr.full_name as employee_name
    FROM public.tasks t
    LEFT JOIN public.projects p ON t.project_id = p.id
    LEFT JOIN public.employees e ON t.assigned_employee_id = e.id
    LEFT JOIN public.profiles pr ON e.id = pr.id
    ORDER BY t.created_at ASC
  `;
  console.log(JSON.stringify(tasks, null, 2));

  // 4. Check Employees and Profiles
  console.log('\n--- 4. EMPLOYEES & PROFILES TABLE ---');
  const employees = await sql`
    SELECT e.*, p.full_name, p.email, p.role
    FROM public.employees e
    JOIN public.profiles p ON e.id = p.id
    ORDER BY e.created_at ASC
  `;
  console.log(JSON.stringify(employees, null, 2));

  // 5. Check All Profiles (including admin/customer)
  console.log('\n--- 5. ALL PROFILES IN DATABASE ---');
  const profiles = await sql`
    SELECT id, full_name, email, role, status, created_at
    FROM public.profiles
    ORDER BY created_at ASC
  `;
  console.log(JSON.stringify(profiles, null, 2));

  // 6. Check Products table
  console.log('\n--- 6. PRODUCTS TABLE ---');
  const products = await sql`SELECT * FROM public.products ORDER BY created_at ASC`;
  console.log(JSON.stringify(products, null, 2));

  // 7. Check Services table
  console.log('\n--- 7. SERVICES TABLE ---');
  const services = await sql`SELECT * FROM public.services ORDER BY created_at ASC`;
  console.log(JSON.stringify(services, null, 2));

  // 8. Check Service Requests table
  console.log('\n--- 8. SERVICE REQUESTS TABLE ---');
  const requests = await sql`SELECT * FROM public.service_requests ORDER BY created_at ASC`;
  console.log(JSON.stringify(requests, null, 2));
}

main().catch(console.error);
