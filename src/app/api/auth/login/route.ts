import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db/neon';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { UserRole } from '@/types/database';

export const dynamic = 'force-dynamic';

const SESSION_COOKIE = 'fast_services_session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    let rows: any[];
    try {
      rows = await sql`
        SELECT id, full_name, email, phone, password_hash, role, status, avatar_url, created_at, updated_at
        FROM public.profiles
        WHERE LOWER(email) = ${cleanEmail}
        LIMIT 1
      `;
    } catch (dbErr: any) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database connection failed: ' + (dbErr.message || 'Unable to connect to Neon PostgreSQL.'),
        },
        { status: 500 }
      );
    }

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No account found with this email address. Please check your credentials.' },
        { status: 401 }
      );
    }

    const user = rows[0];

    if (user.status === 'ARCHIVED' || user.status === 'INACTIVE') {
      return NextResponse.json(
        { success: false, error: 'Account is deactivated. Contact administrator.' },
        { status: 403 }
      );
    }

    if (!user.password_hash) {
      return NextResponse.json(
        { success: false, error: 'No password set for this account. Contact administrator.' },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid password. Please try again.' },
        { status: 401 }
      );
    }

    const profile = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role as UserRole,
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
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Unexpected server error during login.',
      },
      { status: 500 }
    );
  }
}

