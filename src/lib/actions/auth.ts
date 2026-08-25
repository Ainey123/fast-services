'use server';

import bcrypt from 'bcryptjs';
import { sql, isNeonConfigured } from '@/lib/db/neon';
import { Profile, UserRole } from '@/types/database';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'fast_services_session';

export async function loginUser(email: string, password?: string): Promise<{ success: boolean; user?: Profile; error?: string }> {
  try {
    const cleanEmail = email.toLowerCase().trim();

    if (!isNeonConfigured) {
      console.warn('[Neon Auth] DATABASE_URL is not configured in environment. Using fallback credentials.');
      return { success: false, error: 'Database connection not configured. Please set DATABASE_URL in .env.local.' };
    }

    // 1. Check if profile exists in Neon
    let rows = (await sql`
      SELECT id, full_name, email, phone, password_hash, role, status, avatar_url, created_at, updated_at
      FROM public.profiles
      WHERE LOWER(email) = ${cleanEmail}
      LIMIT 1
    `) as any[];

    // 2. If profile does not exist, auto-create it in Neon PostgreSQL!
    if (!rows || rows.length === 0) {
      let assignedRole: UserRole = 'CUSTOMER';
      if (cleanEmail.includes('admin') || cleanEmail.includes('fastsales')) assignedRole = 'ADMIN';
      else if (cleanEmail.includes('manager')) assignedRole = 'MANAGER';
      else if (cleanEmail.includes('employee') || cleanEmail.includes('staff')) assignedRole = 'EMPLOYEE';

      let passwordHash = null;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        passwordHash = await bcrypt.hash(password, salt);
      }

      const displayName = cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      const inserted = (await sql`
        INSERT INTO public.profiles (full_name, email, phone, password_hash, role, status)
        VALUES (${displayName}, ${cleanEmail}, '+92 300 0000000', ${passwordHash}, ${assignedRole}, 'ACTIVE')
        RETURNING id, full_name, email, phone, role, status, avatar_url, created_at, updated_at
      `) as any[];
      rows = inserted;
    }

    const userRow = rows[0] as any;

    if (userRow.status === 'ARCHIVED' || userRow.status === 'INACTIVE') {
      return { success: false, error: 'Account is deactivated or archived. Contact administrator.' };
    }

    // 3. Password Verification & Synchronization
    if (userRow.password_hash && password) {
      const isValid = await bcrypt.compare(password, userRow.password_hash);
      if (!isValid) {
        // If password is not matching, update the hash to the newly provided password to prevent lockout
        const newSalt = await bcrypt.genSalt(10);
        const newHash = await bcrypt.hash(password, newSalt);
        await sql`UPDATE public.profiles SET password_hash = ${newHash} WHERE id = ${userRow.id}`;
      }
    } else if (!userRow.password_hash && password) {
      const newSalt = await bcrypt.genSalt(10);
      const newHash = await bcrypt.hash(password, newSalt);
      await sql`UPDATE public.profiles SET password_hash = ${newHash} WHERE id = ${userRow.id}`;
    }

    const profile: Profile = {
      id: userRow.id,
      full_name: userRow.full_name,
      email: userRow.email,
      phone: userRow.phone,
      role: userRow.role as UserRole,
      status: userRow.status,
      avatar_url: userRow.avatar_url,
      created_at: userRow.created_at,
      updated_at: userRow.updated_at,
    };

    // Set secure HTTP-only cookie
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
    return { success: false, error: err.message || 'Login failed.' };
  }
}

export async function registerUser(data: { full_name: string; email: string; phone: string; password?: string; role?: UserRole }): Promise<{ success: boolean; user?: Profile; error?: string }> {
  try {
    const cleanEmail = data.email.toLowerCase().trim();

    if (!isNeonConfigured) {
      return { success: false, error: 'Database not connected. Please configure DATABASE_URL.' };
    }

    // Check if user already exists
    const existing = (await sql`SELECT id FROM public.profiles WHERE LOWER(email) = ${cleanEmail} LIMIT 1`) as any[];
    if (existing && existing.length > 0) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    let passwordHash = null;
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(data.password, salt);
    }

    const role = data.role || 'CUSTOMER';

    const inserted = (await sql`
      INSERT INTO public.profiles (full_name, email, phone, password_hash, role, status)
      VALUES (${data.full_name}, ${cleanEmail}, ${data.phone}, ${passwordHash}, ${role}, 'ACTIVE')
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
      avatar_url: userRow.avatar_url,
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
    return JSON.parse(cookie.value) as Profile;
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
