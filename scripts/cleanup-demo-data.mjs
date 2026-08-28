import { neon } from '@neondatabase/serverless';
import { getDbUrl } from './get-db-url.mjs';

const sql = neon(getDbUrl());

// Explicit list of demo/seed profile emails created by the seed script that are not real users:
const SEED_PROFILE_EMAILS = [
  'ahmed.raza@fastengineeringsolutions.com',
  'ali.hassan@fastengineeringsolutions.com',
  'usman.tariq@fastengineeringsolutions.com',
  'hamza.malik@fastengineeringsolutions.com',
  'fara.test@example.com' // test account
];

async function main() {
  const isConfirm = process.argv.includes('--confirm');

  console.log('====================================================');
  console.log(isConfirm ? '🔴 RUNNING DESTRUCTIVE CLEANUP (--confirm passed)' : '🟡 RUNNING IN DRY-RUN MODE (No data will be changed)');
  console.log('====================================================\n');

  // 1. Tasks to delete
  const tasks = await sql`
    SELECT t.id, t.task_code, t.title, t.created_at, p.project_code
    FROM public.tasks t
    LEFT JOIN public.projects p ON t.project_id = p.id
    WHERE p.project_code IN ('PRJ-2026-001', 'PRJ-2026-002', 'PRJ-2026-003', 'PRJ-2026-004')
  `;

  // 2. Project Products to delete
  const projectProducts = await sql`
    SELECT pp.id, pp.project_id, pp.product_id, pp.created_at
    FROM public.project_products pp
  `;

  // 3. Project Assignments to delete
  const projectAssignments = await sql`
    SELECT pa.id, pa.project_id, pa.employee_id, pa.assigned_at
    FROM public.project_assignments pa
  `;

  // 4. Projects to delete
  const projects = await sql`
    SELECT id, project_code, name, created_at
    FROM public.projects
    WHERE project_code IN ('PRJ-2026-001', 'PRJ-2026-002', 'PRJ-2026-003', 'PRJ-2026-004')
  `;

  // 5. Clients to delete
  const clients = await sql`
    SELECT id, client_code, company_name, email, created_at
    FROM public.clients
    WHERE client_code IN ('CLI-2026-001', 'CLI-2026-002', 'CLI-2026-003', 'CLI-2026-004')
  `;

  // 6. Products to delete
  const products = await sql`
    SELECT id, product_code, name, category, created_at
    FROM public.products
    WHERE product_code IN ('PRD-001', 'PRD-002', 'PRD-003', 'PRD-004', 'PRD-005')
  `;

  // 7. Services to delete
  const services = await sql`
    SELECT id, name, slug, category, created_at
    FROM public.services
    WHERE slug IN (
      'industrial-electrical-power-distribution',
      'commercial-hvac-mechanical-systems',
      'cctv-surveillance-security-automation',
      'solar-energy-plant-installation',
      'industrial-plumbing-pipe-network',
      'instrumentation-process-automation'
    )
  `;

  // 8. Seed Employees/Profiles to delete
  const seedProfiles = await sql`
    SELECT id, full_name, email, role, created_at
    FROM public.profiles
    WHERE LOWER(email) = ANY(${SEED_PROFILE_EMAILS})
  `;

  // Real profiles that WILL BE PRESERVED
  const preservedProfiles = await sql`
    SELECT id, full_name, email, role, created_at
    FROM public.profiles
    WHERE NOT (LOWER(email) = ANY(${SEED_PROFILE_EMAILS}))
    ORDER BY created_at ASC
  `;

  console.log('--- A. TASKS TO DELETE (' + tasks.length + ' records) ---');
  tasks.forEach(t => console.log(`  [tasks] ID: ${t.id} | Code: ${t.task_code} | Title: "${t.title}" | Created: ${t.created_at}`));

  console.log('\n--- B. PROJECT PRODUCTS TO DELETE (' + projectProducts.length + ' records) ---');
  projectProducts.forEach(pp => console.log(`  [project_products] ID: ${pp.id} | Project: ${pp.project_id}`));

  console.log('\n--- C. PROJECT ASSIGNMENTS TO DELETE (' + projectAssignments.length + ' records) ---');
  projectAssignments.forEach(pa => console.log(`  [project_assignments] ID: ${pa.id} | Project: ${pa.project_id}`));

  console.log('\n--- D. PROJECTS TO DELETE (' + projects.length + ' records) ---');
  projects.forEach(p => console.log(`  [projects] ID: ${p.id} | Code: ${p.project_code} | Name: "${p.name}" | Created: ${p.created_at}`));

  console.log('\n--- E. CLIENTS TO DELETE (' + clients.length + ' records) ---');
  clients.forEach(c => console.log(`  [clients] ID: ${c.id} | Code: ${c.client_code} | Company: "${c.company_name}" | Created: ${c.created_at}`));

  console.log('\n--- F. PRODUCTS TO DELETE (' + products.length + ' records) ---');
  products.forEach(prd => console.log(`  [products] ID: ${prd.id} | Code: ${prd.product_code} | Name: "${prd.name}" | Created: ${prd.created_at}`));

  console.log('\n--- G. SERVICES TO DELETE (' + services.length + ' records) ---');
  services.forEach(s => console.log(`  [services] ID: ${s.id} | Slug: ${s.slug} | Name: "${s.name}" | Created: ${s.created_at}`));

  console.log('\n--- H. SEEDED PROFILES TO DELETE (' + seedProfiles.length + ' records) ---');
  seedProfiles.forEach(p => console.log(`  [profiles] ID: ${p.id} | Name: "${p.full_name}" | Email: ${p.email} | Role: ${p.role}`));

  console.log('\n====================================================');
  console.log('--- I. REAL / PROTECTED ACCOUNTS THAT WILL BE PRESERVED (' + preservedProfiles.length + ' records) ---');
  preservedProfiles.forEach(p => console.log(`  ✅ PRESERVED [profiles] ID: ${p.id} | Name: "${p.full_name}" | Email: ${p.email} | Role: ${p.role} | Created: ${p.created_at}`));
  console.log('====================================================\n');

  if (!isConfirm) {
    console.log('ℹ️  DRY RUN COMPLETED. Zero records were modified or deleted.');
    console.log('ℹ️  To execute actual deletion, run: node scripts/cleanup-demo-data.mjs --confirm\n');
    return;
  }

  // DESTRUCTIVE EXECUTION IN DEPENDENCY ORDER
  console.log('🚀 Executing deletion in dependency order...');

  // 1. Delete tasks
  if (tasks.length > 0) {
    const taskIds = tasks.map(t => t.id);
    await sql`DELETE FROM public.tasks WHERE id = ANY(${taskIds})`;
    console.log(`✓ Deleted ${tasks.length} tasks`);
  }

  // 2. Delete project_products
  if (projectProducts.length > 0) {
    const ppIds = projectProducts.map(pp => pp.id);
    await sql`DELETE FROM public.project_products WHERE id = ANY(${ppIds})`;
    console.log(`✓ Deleted ${projectProducts.length} project_products`);
  }

  // 3. Delete project_assignments
  if (projectAssignments.length > 0) {
    const paIds = projectAssignments.map(pa => pa.id);
    await sql`DELETE FROM public.project_assignments WHERE id = ANY(${paIds})`;
    console.log(`✓ Deleted ${projectAssignments.length} project_assignments`);
  }

  // 4. Delete projects
  if (projects.length > 0) {
    const projectIds = projects.map(p => p.id);
    await sql`DELETE FROM public.projects WHERE id = ANY(${projectIds})`;
    console.log(`✓ Deleted ${projects.length} projects`);
  }

  // 5. Delete clients
  if (clients.length > 0) {
    const clientIds = clients.map(c => c.id);
    await sql`DELETE FROM public.clients WHERE id = ANY(${clientIds})`;
    console.log(`✓ Deleted ${clients.length} clients`);
  }

  // 6. Delete products
  if (products.length > 0) {
    const productIds = products.map(prd => prd.id);
    await sql`DELETE FROM public.products WHERE id = ANY(${productIds})`;
    console.log(`✓ Deleted ${products.length} products`);
  }

  // 7. Delete services
  if (services.length > 0) {
    const serviceIds = services.map(s => s.id);
    await sql`DELETE FROM public.services WHERE id = ANY(${serviceIds})`;
    console.log(`✓ Deleted ${services.length} services`);
  }

  // 8. Delete seeded employees and profiles
  if (seedProfiles.length > 0) {
    const seedIds = seedProfiles.map(p => p.id);
    await sql`DELETE FROM public.employees WHERE id = ANY(${seedIds})`;
    await sql`DELETE FROM public.profiles WHERE id = ANY(${seedIds})`;
    console.log(`✓ Deleted ${seedProfiles.length} seeded profiles/employees`);
  }

  console.log('\n🎉 ALL DEMO SEEDED DATA SUCCESSFULLY PURGED FROM DATABASE.');
}

main().catch(console.error);
