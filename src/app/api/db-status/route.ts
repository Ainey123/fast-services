import { NextResponse } from 'next/server';
import { sql, getConnectionString } from '@/lib/db/neon';

export const dynamic = 'force-dynamic';

export async function GET() {
  const rawConn = getConnectionString();
  
  let sourceVar = 'HARDCODED_FALLBACK';
  if (process.env.FAST_SERVICES_DATABASE_URL) sourceVar = 'FAST_SERVICES_DATABASE_URL';
  else if (process.env.NEON_DATABASE_URL) sourceVar = 'NEON_DATABASE_URL';
  else if (process.env.DATABASE_URL) sourceVar = 'DATABASE_URL';
  else if (process.env.POSTGRES_URL) sourceVar = 'POSTGRES_URL';

  let sanitizedHost = 'Not Configured';
  try {
    if (rawConn) {
      const url = new URL(rawConn.replace('postgresql://', 'http://').replace('postgres://', 'http://'));
      sanitizedHost = url.hostname;
    }
  } catch (e) {
    sanitizedHost = 'Invalid URL format';
  }

  if (!rawConn) {
    return NextResponse.json({
      status: 'DISCONNECTED',
      message: 'No Neon connection string found in environment variables.',
      active_variable_source: sourceVar,
      checked_variables: ['FAST_SERVICES_DATABASE_URL', 'NEON_DATABASE_URL', 'DATABASE_URL', 'POSTGRES_URL'],
      instruction: 'Add FAST_SERVICES_DATABASE_URL into your Vercel Project Settings > Environment Variables, then redeploy.'
    }, { status: 500 });
  }

  try {
    const employees = (await sql`
      SELECT e.id, e.employee_code, e.department, e.position, e.status, p.full_name, p.email, p.phone, p.role
      FROM public.employees e
      JOIN public.profiles p ON e.id = p.id
      ORDER BY e.created_at DESC;
    `) as any[];

    const clients = (await sql`SELECT id, client_code, company_name, phone FROM public.clients ORDER BY created_at DESC;`) as any[];
    const projects = (await sql`SELECT id, project_code, name, status, progress FROM public.projects ORDER BY created_at DESC;`) as any[];
    const services = (await sql`SELECT count(*)::int as cnt FROM public.services;`) as any[];
    const products = (await sql`SELECT count(*)::int as cnt FROM public.products;`) as any[];
    const settings = (await sql`SELECT company_name, app_name, phone, email FROM public.company_settings LIMIT 1;`) as any[];

    return NextResponse.json({
      status: 'CONNECTED',
      database_provider: 'Neon Serverless PostgreSQL',
      active_variable_source: sourceVar,
      connected_host: sanitizedHost,
      company: settings[0]?.company_name || 'FAST ENGINEERING SOLUTIONS',
      summary: {
        total_employees: employees.length,
        total_clients: clients.length,
        total_projects: projects.length,
        total_services: services[0]?.cnt || 0,
        total_products: products[0]?.cnt || 0,
      },
      live_employees_in_neon: employees,
      live_clients_in_neon: clients,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return NextResponse.json({
      status: 'CONNECTION_ERROR',
      error_message: err.message,
      active_variable_source: sourceVar,
      connected_host: sanitizedHost,
      instruction: 'Please check your Neon password or connection parameters in Vercel Environment Variables.'
    }, { status: 500 });
  }
}
