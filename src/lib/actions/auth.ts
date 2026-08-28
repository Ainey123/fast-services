'use server';

import bcrypt from 'bcryptjs';
import { sql } from '@/lib/db/neon';
import { Profile, UserRole } from '@/types/database';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'fast_services_session';

export async function loginUser(
  email: string,
  password?: string
): Promise<{ success: boolean; user?: Profile; error?: string }> {
  try {
    if (!email || !password) {
      return { success: false, error: 'Email and password are required.' };
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Look up profile in Neon PostgreSQL
    const rows = (await sql`
      SELECT id, full_name, email, phone, password_hash, role, status, avatar_url, created_at, updated_at
      FROM public.profiles
      WHERE LOWER(email) = ${cleanEmail}
      LIMIT 1
    `) as any[];

    if (!rows || rows.length === 0) {
      return {
        success: false,
        error: 'No account found with this email address. Please check your credentials or register.',
      };
    }

    const userRow = rows[0] as any;

    if (userRow.status === 'ARCHIVED' || userRow.status === 'INACTIVE') {
      return {
        success: false,
        error: 'Your account is inactive or archived. Please contact an administrator.',
      };
    }

    // 2. Strict Password Verification using bcrypt
    if (!userRow.password_hash) {
      return {
        success: false,
        error: 'No password set for this account. Please contact an administrator for password reset.',
      };
    }

    const isValid = await bcrypt.compare(password, userRow.password_hash);
    if (!isValid) {
      return {
        success: false,
        error: 'Invalid password. Please try again.',
      };
    }

    const profile: Profile = {
      id: userRow.id,
      full_name: userRow.full_name,
      email: userRow.email,
      phone: userRow.phone,
      role: userRow.role as UserRole,
      status: userRow.status,
      avatar_url: userRow.avatar_url || undefined,
      created_at: userRow.created_at,
      updated_at: userRow.updated_at,
    };

    // 3. Set secure HTTP-only cookie
    cookies().set(SESSION_COOKIE_NAME, JSON.stringify(profile), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return { success: true, user: profile };
  } catch (err: any) {
    console.error('[Neon Auth Login Error]', err);
    return { success: false, error: 'Database authentication error: ' + (err.message || 'Unknown error') };
  }
}

export async function registerUser(data: {
  full_name: string;
  email: string;
  phone: string;
  password?: string;
  role?: UserRole;
}): Promise<{ success: boolean; user?: Profile; error?: string }> {
  try {
    const cleanEmail = data.email.toLowerCase().trim();

    if (!cleanEmail || !data.full_name) {
      return { success: false, error: 'Name and email are required.' };
    }

    // Check if user already exists
    const existing = (await sql`
      SELECT id FROM public.profiles WHERE LOWER(email) = ${cleanEmail} LIMIT 1
    `) as any[];

    if (existing && existing.length > 0) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    let passwordHash: string | null = null;
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(data.password, salt);
    } else {
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash('Fast@2026', salt);
    }

    const role: UserRole = data.role || 'CUSTOMER';

    const inserted = (await sql`
      INSERT INTO public.profiles (full_name, email, phone, password_hash, role, status)
      VALUES (${data.full_name}, ${cleanEmail}, ${data.phone || null}, ${passwordHash}, ${role}, 'ACTIVE')
      RETURNING id, full_name, email, phone, role, status, avatar_url, created_at, updated_at
    `) as any[];

    const userRow = inserted[0] as any;
    const profile: Profile = {
      id: userRow.id,
      full_name: userRow.full_name,
      email: userRow.email,
      phone: userRow.phone,
      role: userRow.role as UserRole,
      status: userRow.status,
      avatar_url: userRow.avatar_url || undefined,
      created_at: userRow.created_at,
      updated_at: userRow.updated_at,
    };

    cookies().set(SESSION_COOKIE_NAME, JSON.stringify(profile), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return { success: true, user: profile };
  } catch (err: any) {
    console.error('[Neon Auth Register Error]', err);
    return { success: false, error: err.message || 'Registration failed.' };
  }
}

export async function getCurrentSession(): Promise<Profile | null> {
  try {
    const cookie = cookies().get(SESSION_COOKIE_NAME);
    if (!cookie?.value) return null;
    const session = JSON.parse(cookie.value) as Profile;

    // Verify session user still exists in database and is active
    const rows = await sql`
      SELECT id, full_name, email, phone, role, status, avatar_url, created_at, updated_at
      FROM public.profiles
      WHERE id = ${session.id} AND status = 'ACTIVE'
      LIMIT 1
    `;
    if (rows.length === 0) return null;
    return rows[0] as Profile;
  } catch {
    return null;
  }
}

export async function logoutUser(): Promise<{ success: boolean }> {
  try {
    cookies().delete(SESSION_COOKIE_NAME);
    return { success: true };
  } catch {
    return { success: true };
  }
}

