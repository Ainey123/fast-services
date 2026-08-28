import { neon } from '@neondatabase/serverless';
import { getDbUrl } from './get-db-url.mjs';

const sql = neon(getDbUrl());

async function main() {
  const cols = await sql`
    SELECT table_name, column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name IN ('project_assignments', 'project_products')
    ORDER BY table_name, ordinal_position
  `;
  console.log(JSON.stringify(cols, null, 2));
}

main().catch(console.error);
