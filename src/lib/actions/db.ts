'use server';

import { sql, isNeonConfigured } from '@/lib/db/neon';
import {
  CompanySettings,
  Service,
  Client,
  Employee,
  Project,
  Task,
  Product,
  ProjectProduct,
  ServiceRequest,
  ServiceRequestImage,
  RequestStatusHistory,
  AuditLog,
  RequestStatus,
  ProjectStatus,
  TaskStatus,
  UserStatus,
  UserRole,
} from '@/types/database';
import bcrypt from 'bcryptjs';

// --- Company Settings ---
export async function getCompanySettingsFromNeon(): Promise<CompanySettings | null> {
  if (!isNeonConfigured) return null;
  try {
    const rows = await sql`
      SELECT id, company_name, app_name, description, founded_year, business_type,
             phone, whatsapp, email, website, address, city, province, country,
             latitude, longitude, working_hours, social_links, logo_url, updated_at
      FROM public.company_settings
      LIMIT 1
    `;
    if (rows.length === 0) return null;
    return rows[0] as CompanySettings;
  } catch (e) {
    console.error('[Neon getCompanySettings Error]', e);
    return null;
  }
}

export async function updateCompanySettingsInNeon(data: Partial<CompanySettings>, actorName = 'Admin'): Promise<CompanySettings | null> {
  if (!isNeonConfigured) return null;
  try {
    const rows = await sql`
      UPDATE public.company_settings
      SET company_name = COALESCE(${data.company_name}, company_name),
          app_name = COALESCE(${data.app_name}, app_name),
          description = COALESCE(${data.description}, description),
          phone = COALESCE(${data.phone}, phone),
          whatsapp = COALESCE(${data.whatsapp}, whatsapp),
          email = COALESCE(${data.email}, email),
          website = COALESCE(${data.website}, website),
          address = COALESCE(${data.address}, address),
          city = COALESCE(${data.city}, city),
          province = COALESCE(${data.province}, province),
          country = COALESCE(${data.country}, country),
          working_hours = COALESCE(${data.working_hours}, working_hours),
          social_links = COALESCE(${data.social_links ? JSON.stringify(data.social_links) : null}::jsonb, social_links),
          updated_at = NOW()
      RETURNING *
    `;
    return rows[0] as CompanySettings;
  } catch (e) {
    console.error('[Neon updateCompanySettings Error]', e);
    return null;
  }
}

// --- Services ---
export async function getServicesFromNeon(activeOnly = false): Promise<Service[] | null> {
  if (!isNeonConfigured) return null;
  try {
    const rows = activeOnly
      ? await sql`SELECT * FROM public.services WHERE is_active = true ORDER BY created_at ASC`
      : await sql`SELECT * FROM public.services ORDER BY created_at ASC`;
    return rows as Service[];
  } catch (e) {
    console.error('[Neon getServices Error]', e);
    return null;
  }
}

export async function createServiceInNeon(data: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<Service | null> {
  if (!isNeonConfigured) return null;
  try {
    const rows = await sql`
      INSERT INTO public.services (name, slug, category, description, short_description, price_starting_at, image_url, features, is_active)
      VALUES (${data.name}, ${data.slug}, ${data.category}, ${data.description}, ${data.short_description}, ${data.price_starting_at || null}, ${data.image_url}, ${JSON.stringify(data.features || [])}::jsonb, ${data.is_active})
      RETURNING *
    `;
    return rows[0] as Service;
  } catch (e) {
    console.error('[Neon createService Error]', e);
    return null;
  }
}

export async function updateServiceInNeon(id: string, updates: Partial<Service>): Promise<Service | null> {
  if (!isNeonConfigured) return null;
  try {
    const rows = await sql`
      UPDATE public.services
      SET name = COALESCE(${updates.name}, name),
          category = COALESCE(${updates.category}, category),
          description = COALESCE(${updates.description}, description),
          short_description = COALESCE(${updates.short_description}, short_description),
          price_starting_at = COALESCE(${updates.price_starting_at}, price_starting_at),
          image_url = COALESCE(${updates.image_url}, image_url),
          is_active = COALESCE(${updates.is_active}, is_active),
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return rows[0] as Service;
  } catch (e) {
    console.error('[Neon updateService Error]', e);
    return null;
  }
}

export async function deleteServiceInNeon(id: string): Promise<boolean> {
  if (!isNeonConfigured) return false;
  try {
    await sql`DELETE FROM public.services WHERE id = ${id}`;
    return true;
  } catch (e) {
    console.error('[Neon deleteService Error]', e);
    return false;
  }
}

// --- Clients ---
export async function getClientsFromNeon(): Promise<Client[] | null> {
  if (!isNeonConfigured) return null;
  try {
    const rows = await sql`SELECT * FROM public.clients ORDER BY created_at DESC`;
    return rows as Client[];
  } catch (e) {
    console.error('[Neon getClients Error]', e);
    return null;
  }
}

export async function createClientInNeon(data: Omit<Client, 'id' | 'client_code' | 'created_at' | 'updated_at'>): Promise<Client | null> {
  if (!isNeonConfigured) return null;
  try {
    const countRes = await sql`SELECT count(*)::int as cnt FROM public.clients`;
    const count = (countRes[0]?.cnt || 0) + 1;
    const year = new Date().getFullYear();
    const clientCode = `CLI-${year}-${count.toString().padStart(3, '0')}`;

    const rows = await sql`
      INSERT INTO public.clients (client_code, company_name, contact_person, phone, whatsapp, email, address, status, notes)
      VALUES (${clientCode}, ${data.company_name}, ${data.contact_person}, ${data.phone}, ${data.whatsapp || null}, ${data.email || null}, ${data.address}, ${data.status || 'ACTIVE'}, ${data.notes || null})
      RETURNING *
    `;
    return rows[0] as Client;
  } catch (e) {
    console.error('[Neon createClient Error]', e);
    return null;
  }
}

export async function setClientStatusInNeon(id: string, status: UserStatus): Promise<boolean> {
  if (!isNeonConfigured) return false;
  try {
    await sql`UPDATE public.clients SET status = ${status}, updated_at = NOW() WHERE id = ${id}`;
    return true;
  } catch (e) {
    console.error('[Neon setClientStatus Error]', e);
    return false;
  }
}

export async function deleteClientInNeon(id: string): Promise<boolean> {
  if (!isNeonConfigured) return false;
  try {
    await sql`DELETE FROM public.clients WHERE id = ${id}`;
    return true;
  } catch (e) {
    console.error('[Neon deleteClient Error]', e);
    return false;
  }
}

// --- Employees ---
export async function getEmployeesFromNeon(): Promise<Employee[] | null> {
  if (!isNeonConfigured) return null;
  try {
    const rows = await sql`
      SELECT e.id, e.employee_code, e.department, e.position, e.joining_date, e.status, e.created_at, e.updated_at,
             json_build_object(
               'id', p.id,
               'full_name', p.full_name,
               'email', p.email,
               'phone', p.phone,
               'role', p.role,
               'status', p.status,
               'avatar_url', p.avatar_url,
               'created_at', p.created_at,
               'updated_at', p.updated_at
             ) as profile
      FROM public.employees e
      JOIN public.profiles p ON e.id = p.id
      ORDER BY e.created_at ASC
    `;
    return rows as Employee[];
  } catch (e) {
    console.error('[Neon getEmployees Error]', e);
    return null;
  }
}

export async function createEmployeeInNeon(data: {
  full_name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  role: UserRole;
  password?: string;
}): Promise<Employee | null> {
  if (!isNeonConfigured) return null;
  try {
    let passwordHash = null;
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(data.password, salt);
    }

    const countRes = await sql`SELECT count(*)::int as cnt FROM public.employees`;
    const count = (countRes[0]?.cnt || 0) + 1;
    const empCode = `EMP-${count.toString().padStart(3, '0')}`;

    // 1. Create Profile
    const profileRows = await sql`
      INSERT INTO public.profiles (full_name, email, phone, password_hash, role, status)
      VALUES (${data.full_name}, ${data.email.toLowerCase().trim()}, ${data.phone}, ${passwordHash}, ${data.role}, 'ACTIVE')
      RETURNING *
    `;
    const profile = profileRows[0] as any;

    // 2. Create Employee row
    const empRows = await sql`
      INSERT INTO public.employees (id, employee_code, department, position, status)
      VALUES (${profile.id}, ${empCode}, ${data.department}, ${data.position}, 'ACTIVE')
      RETURNING *
    `;

    return {
      ...empRows[0],
      profile,
    } as Employee;
  } catch (e) {
    console.error('[Neon createEmployee Error]', e);
    return null;
  }
}

export async function setEmployeeStatusInNeon(id: string, status: UserStatus): Promise<boolean> {
  if (!isNeonConfigured) return false;
  try {
    await sql`UPDATE public.employees SET status = ${status}, updated_at = NOW() WHERE id = ${id}`;
    await sql`UPDATE public.profiles SET status = ${status}, updated_at = NOW() WHERE id = ${id}`;
    return true;
  } catch (e) {
    console.error('[Neon setEmployeeStatus Error]', e);
    return false;
  }
}

// --- Projects & Tasks ---
export async function getProjectsFromNeon(): Promise<Project[] | null> {
  if (!isNeonConfigured) return null;
  try {
    const rows = await sql`
      SELECT p.*,
             row_to_json(c.*) as client,
             row_to_json(s.*) as service
      FROM public.projects p
      LEFT JOIN public.clients c ON p.client_id = c.id
      LEFT JOIN public.services s ON p.service_id = s.id
      ORDER BY p.created_at DESC
    `;
    return rows as Project[];
  } catch (e) {
    console.error('[Neon getProjects Error]', e);
    return null;
  }
}

export async function getTasksFromNeon(): Promise<Task[] | null> {
  if (!isNeonConfigured) return null;
  try {
    const rows = await sql`
      SELECT t.*,
             row_to_json(p.*) as project
      FROM public.tasks t
      LEFT JOIN public.projects p ON t.project_id = p.id
      ORDER BY t.created_at DESC
    `;
    return rows as Task[];
  } catch (e) {
    console.error('[Neon getTasks Error]', e);
    return null;
  }
}

export async function updateTaskProgressInNeon(id: string, progress: number, status: TaskStatus): Promise<Task | null> {
  if (!isNeonConfigured) return null;
  try {
    const rows = await sql`
      UPDATE public.tasks
      SET progress = ${progress}, status = ${status}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return rows[0] as Task;
  } catch (e) {
    console.error('[Neon updateTaskProgress Error]', e);
    return null;
  }
}

// --- Products ---
export async function getProductsFromNeon(): Promise<Product[] | null> {
  if (!isNeonConfigured) return null;
  try {
    const rows = await sql`SELECT * FROM public.products ORDER BY name ASC`;
    return rows as Product[];
  } catch (e) {
    console.error('[Neon getProducts Error]', e);
    return null;
  }
}

// --- Service Requests ---
export async function getServiceRequestsFromNeon(): Promise<ServiceRequest[] | null> {
  if (!isNeonConfigured) return null;
  try {
    const rows = await sql`
      SELECT r.*,
             row_to_json(s.*) as service
      FROM public.service_requests r
      LEFT JOIN public.services s ON r.service_id = s.id
      ORDER BY r.created_at DESC
    `;
    return rows as ServiceRequest[];
  } catch (e) {
    console.error('[Neon getServiceRequests Error]', e);
    return null;
  }
}

export async function createServiceRequestInNeon(data: Omit<ServiceRequest, 'id' | 'request_id' | 'status' | 'created_at' | 'updated_at' | 'images' | 'history'> & {
  images?: { image_url: string; file_name?: string }[];
}): Promise<ServiceRequest | null> {
  if (!isNeonConfigured) return null;
  try {
    const countRes = await sql`SELECT count(*)::int as cnt FROM public.service_requests`;
    const count = (countRes[0]?.cnt || 0) + 101;
    const year = new Date().getFullYear();
    const requestId = `FS-${year}-${count.toString().padStart(6, '0')}`;

    const rows = await sql`
      INSERT INTO public.service_requests (
        request_id, service_id, user_id, client_id, customer_name, customer_phone, customer_email,
        description, preferred_date, preferred_time, location_address, latitude, longitude, status
      ) VALUES (
        ${requestId}, ${data.service_id}, ${data.user_id || null}, ${data.client_id || null}, ${data.customer_name}, ${data.customer_phone}, ${data.customer_email},
        ${data.description}, ${data.preferred_date}, ${data.preferred_time}, ${data.location_address}, ${data.latitude || null}, ${data.longitude || null}, 'PENDING'
      )
      RETURNING *
    `;

    return rows[0] as ServiceRequest;
  } catch (e) {
    console.error('[Neon createServiceRequest Error]', e);
    return null;
  }
}
