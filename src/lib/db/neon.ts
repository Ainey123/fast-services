import { neon, neonConfig, Pool } from '@neondatabase/serverless';

// Configure WebSocket connection caching for Serverless environments
neonConfig.fetchConnectionCache = true;

export function getConnectionString(): string {
  const url =
    process.env.FAST_SERVICES_DATABASE_URL ||
    process.env.NEON_DATABASE_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    '';
  return url.trim();
}

export function isDatabaseConfigured(): boolean {
  const conn = getConnectionString();
  return Boolean(
    conn &&
    !conn.includes('placeholder') &&
    !conn.includes('your-database') &&
    (conn.startsWith('postgres://') || conn.startsWith('postgresql://'))
  );
}

export const isNeonConfigured = true;

export type NeonQueryFunction = (
  strings: TemplateStringsArray,
  ...values: any[]
) => Promise<any[]>;

// Dynamic tagged template function that always resolves active connection string at runtime
export const sql: NeonQueryFunction = ((strings: TemplateStringsArray, ...values: any[]) => {
  const conn = getConnectionString();
  if (!conn || conn.includes('placeholder')) {
    console.warn('[Neon DB] No active database connection string found in environment variables.');
    throw new Error('Database connection not configured. Please set DATABASE_URL or FAST_SERVICES_DATABASE_URL.');
  }
  const client = neon(conn);
  return client(strings, ...values);
}) as unknown as NeonQueryFunction;

// Connection pool for multi-statement transactions
let poolInstance: Pool | null = null;
export function getNeonPool(): Pool {
  const conn = getConnectionString();
  if (!poolInstance && conn) {
    poolInstance = new Pool({ connectionString: conn });
  }
  return poolInstance || new Pool({ connectionString: 'postgres://placeholder@placeholder.com/db' });
}
