import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import { getDbUrl } from './get-db-url.mjs';

const dbUrl = getDbUrl();
const sql = neon(dbUrl);

async function main() {
  // 1. All service requests
  console.log('\n=== ALL SERVICE REQUESTS (newest first) ===');
  const requests = await sql`
    SELECT request_id, id, user_id, customer_name, customer_email, status, created_at
    FROM public.service_requests
    ORDER BY created_at DESC
  `;
  console.log(JSON.stringify(requests, null, 2));

  // 2. Specifically look for FS-2026-000101 and FS-2026-000102
  console.log('\n=== SPECIFIC RECORDS FS-2026-000101 / FS-2026-000102 ===');
  const specific = await sql`
    SELECT sr.request_id, sr.id, sr.user_id, sr.customer_name, sr.customer_email,
           sr.status, sr.created_at,
           s.name AS service_name,
           p.email AS user_email, p.role AS user_role
    FROM public.service_requests sr
    LEFT JOIN public.services s ON sr.service_id = s.id
    LEFT JOIN public.profiles p ON sr.user_id = p.id
    WHERE sr.request_id IN ('FS-2026-000101', 'FS-2026-000102')
  `;
  console.log(JSON.stringify(specific, null, 2));

  // 3. Count per user_id
  console.log('\n=== REQUEST COUNTS PER USER ===');
  const counts = await sql`
    SELECT user_id, customer_email, count(*)::int as total
    FROM public.service_requests
    GROUP BY user_id, customer_email
    ORDER BY total DESC
  `;
  console.log(JSON.stringify(counts, null, 2));
}

main().catch(console.error);
