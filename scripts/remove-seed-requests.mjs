import { neon } from '@neondatabase/serverless';
import { getDbUrl } from './get-db-url.mjs';

const sql = neon(getDbUrl());

async function main() {
  // Confirm the records exist and came from seed
  console.log('\n=== Inspecting FS-2026-000101 and FS-2026-000102 ===');
  const records = await sql`
    SELECT request_id, id, user_id, customer_name, customer_email, created_at
    FROM public.service_requests
    WHERE request_id IN ('FS-2026-000101', 'FS-2026-000102')
  `;
  console.log('Records found:', JSON.stringify(records, null, 2));

  if (records.length === 0) {
    console.log('Records already deleted or do not exist.');
    return;
  }

  // Verify they have user_id = null (seeded, not created by real user)
  const seedRecords = records.filter(r => r.user_id === null);
  console.log(`\nRecords with user_id = null (seed data): ${seedRecords.length}`);

  if (seedRecords.length > 0) {
    console.log('\nDeleting seed service requests (user_id = null, from seed script)...');
    
    // Delete related images first
    for (const r of seedRecords) {
      await sql`DELETE FROM public.service_request_images WHERE request_id = ${r.id}`;
      await sql`DELETE FROM public.request_status_history WHERE request_id = ${r.id}`;
    }

    // Delete the seed records themselves
    const deleted = await sql`
      DELETE FROM public.service_requests
      WHERE request_id IN ('FS-2026-000101', 'FS-2026-000102')
        AND user_id IS NULL
      RETURNING request_id
    `;
    console.log('Deleted records:', deleted.map(d => d.request_id));
  }

  // Show remaining service requests
  console.log('\n=== REMAINING SERVICE REQUESTS ===');
  const remaining = await sql`
    SELECT request_id, user_id, customer_name, customer_email, status, created_at
    FROM public.service_requests
    ORDER BY created_at DESC
  `;
  console.log(JSON.stringify(remaining, null, 2));
  console.log(`Total remaining: ${remaining.length}`);
}

main().catch(console.error);
