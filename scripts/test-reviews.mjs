import { neon } from '@neondatabase/serverless';
import { getDbUrl } from './get-db-url.mjs';

const sql = neon(getDbUrl());

async function run() {
  const countRes = await sql`SELECT count(*)::int as count FROM public.customer_reviews`;
  const reviews = await sql`SELECT customer_name, rating, review_title, service_name, location FROM public.customer_reviews LIMIT 3`;
  console.log('Total customer reviews in DB:', countRes[0].count);
  console.log('Sample reviews:', JSON.stringify(reviews, null, 2));
}

run().catch(console.error);
