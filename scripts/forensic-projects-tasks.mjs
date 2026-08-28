import { neon } from '@neondatabase/serverless';
import { getDbUrl } from './get-db-url.mjs';

const sql = neon(getDbUrl());

async function main() {
  const cols = await sql`
    SELECT table_name, column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name IN ('projects', 'tasks')
    ORDER BY table_name, ordinal_position
  `;
  console.log(JSON.stringify(cols, null, 2));

  console.log('\n--- ALL PROJECTS (SELECT *) ---');
  const projects = await sql`SELECT * FROM public.projects ORDER BY created_at ASC`;
  console.log(JSON.stringify(projects, null, 2));

  console.log('\n--- ALL TASKS (SELECT *) ---');
  const tasks = await sql`SELECT * FROM public.tasks ORDER BY created_at ASC`;
  console.log(JSON.stringify(tasks, null, 2));
}

main().catch(console.error);
