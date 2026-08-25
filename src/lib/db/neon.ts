import { neon, neonConfig, Pool } from '@neondatabase/serverless';

// Configure WebSocket connection caching for Serverless environments if needed
neonConfig.fetchConnectionCache = true;

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.NEON_DATABASE_URL ||
  '';

export const isNeonConfigured = Boolean(
  connectionString &&
  !connectionString.includes('placeholder') &&
  !connectionString.includes('your-database')
);

// High-performance SQL query function for serverless Next.js
export const sql = isNeonConfigured
  ? neon(connectionString)
  : neon('postgres://placeholder:placeholder@ep-placeholder.us-east-2.aws.neon.tech/neondb');

// Connection pool for multi-statement transactions
let poolInstance: Pool | null = null;
export function getNeonPool(): Pool {
  if (!poolInstance) {
    poolInstance = new Pool({ connectionString: connectionString || 'postgres://placeholder:placeholder@ep-placeholder.us-east-2.aws.neon.tech/neondb' });
  }
  return poolInstance;
}
