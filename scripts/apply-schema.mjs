import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

const connectionString = "postgresql://neondb_owner:npg_XVOCZUI9gt8q@ep-patient-river-axs53glt-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require";

async function main() {
  console.log('Connecting to Neon PostgreSQL...');
  const sql = neon(connectionString);

  const schemaPath = path.join(process.cwd(), 'neon', 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  console.log('Applying schema to Neon...');
  
  // Split into executable commands if needed or run raw multi-statement
  const statements = schemaSql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  for (const statement of statements) {
    try {
      await sql(statement);
    } catch (err) {
      console.warn('Statement notice/warning:', err.message);
    }
  }

  console.log('Verifying tables in database...');
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `;

  console.log('Successfully created tables:');
  tables.forEach(t => console.log(' - ' + t.table_name));

  const settings = await sql`SELECT * FROM public.company_settings LIMIT 1`;
  console.log('Company Settings verification:', settings[0]?.company_name);
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
