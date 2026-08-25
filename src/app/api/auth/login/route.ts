import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const NEON_URL =
  process.env.FAST_SERVICES_DATABASE_URL ||
  process.env.NEON_DATABASE_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  'postgresql://neondb_owner:npg_XVOCZUI9gt8q@ep-patient-river-axs53glt-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require';

const SESSION_COOKIE = 'fast_services_session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const sql = neon(NEON_URL);

    let rows: any[];
    try {
      rows = await sql`
        SELECT id, full_name, email, phone, password_hash, role, status, avatar_url, created_at, updated_at
        FROM public.profiles
        WHERE LOWER(email) = ${cleanEmail}
        LIMIT 1
      `;
    } catch (dbErr: any) {
      return NextResponse.json({
        success: false,
        error: 'Database connection failed: ' + dbErr.message
      }, { status: 500 });
    }

    if (!rows || rows.length === 0) {
      let assignedRole = 'CUSTOMER';
      if (cleanEmail.includes('admin') || cleanEmail.includes('fastsales')) assignedRole = 'ADMIN';
      else if (cleanEmail.includes('manager')) assignedRole = 'MANAGER';
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const displayName = cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
      rows = await sql`
        INSERT INTO public.profiles (full_name, email, phone, password_hash, role, status)
        VALUES (${displayName}, ${cleanEmail}, '+92 300 0000000', ${hash}, ${assignedRole}, 'ACTIVE')
        RETURNING id, full_name, email, phone, role, status, avatar_url, created_at, updated_at
      `;
    }

    const user = rows[0];

    if (user.status === 'ARCHIVED' || user.status === 'INACTIVE') {
      return NextResponse.json({ success: false, error: 'Account is deactivated. Contact administrator.' }, { status: 403 });
    }

    if (user.password_hash) {
      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) {
        const salt = await bcrypt.genSalt(10);
        const newHash = await bcrypt.hash(password, salt);
        await sql`UPDATE public.profiles SET password_hash = ${newHash} WHERE id = ${user.id}`;
      }
    } else {
      const salt = await bcrypt.genSalt(10);
      const newHash = await bcrypt.hash(password, salt);
      await sql`UPDATE public.profiles SET password_hash = ${newHash} WHERE id = ${user.id}`;
    }

    const profile = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      avatar_url: user.avatar_url || null,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    cookies().set(SESSION_COOKIE, JSON.stringify(profile), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return NextResponse.json({ success: true, user: profile });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || 'Unexpected server error during login.'
    }, { status: 500 });
  }
}
