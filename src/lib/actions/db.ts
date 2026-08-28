'use server';

import { sql } from '@/lib/db/neon';
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

// ==============================================================================
// 1. AUDIT LOGS
// ==============================================================================
export async function getAuditLogs(): Promise<AuditLog[]> {
  try {
    const rows = await sql`
      SELECT id, actor_id, actor_name, action, entity_type, entity_id, details, created_at
      FROM public.audit_logs
      ORDER BY created_at DESC
      LIMIT 200
    `;
    return rows.map((r: any) => ({
      id: r.id,
      actor_id: r.actor_id || undefined,
      actor_name: r.actor_name || undefined,
      action: r.action,
      entity_type: r.entity_type,
      entity_id: r.entity_id,
      details: typeof r.details === 'string' ? JSON.parse(r.details) : r.details || {},
      created_at: r.created_at,
    }));
  } catch (e) {
    console.error('[Neon getAuditLogs Error]', e);
    throw new Error('Unable to load audit logs from database.');
  }
}

export async function addAuditLog(
  action: string,
  entityType: string,
  entityId: string,
  details: Record<string, any> = {},
  actorName = 'System / Admin',
  actorId?: string
): Promise<void> {
  try {
    await sql`
      INSERT INTO public.audit_logs (actor_id, actor_name, action, entity_type, entity_id, details)
      VALUES (
        ${actorId || null},
        ${actorName},
        ${action},
        ${entityType},
        ${entityId},
        ${JSON.stringify(details)}::jsonb
      )
    `;
  } catch (e) {
    console.error('[Neon addAuditLog Error]', e);
  }
}

// ==============================================================================
// 2. COMPANY SETTINGS
// ==============================================================================
export async function getCompanySettings(): Promise<CompanySettings> {
  try {
    const rows = await sql`
      SELECT id, company_name, app_name, description, founded_year, business_type,
             phone, whatsapp, email, website, address, city, province, country,
             latitude, longitude, working_hours, social_links, logo_url, updated_at
      FROM public.company_settings
      LIMIT 1
    `;
    if (rows.length === 0) {
      throw new Error('Company settings not found in database.');
    }
    const r = rows[0] as any;
    return {
      ...r,
      social_links: typeof r.social_links === 'string' ? JSON.parse(r.social_links) : r.social_links || {},
    } as CompanySettings;
  } catch (e) {
    console.error('[Neon getCompanySettings Error]', e);
    throw new Error('Unable to load company settings from database.');
  }
}

// Backward compatibility alias
export const getCompanySettingsFromNeon = getCompanySettings;

export async function updateCompanySettings(
  data: Partial<CompanySettings>,
  actorName = 'Admin'
): Promise<CompanySettings> {
  try {
    const socialLinksJson = data.social_links ? JSON.stringify(data.social_links) : null;
    const rows = await sql`
      UPDATE public.company_settings
      SET company_name = COALESCE(${data.company_name ?? null}, company_name),
          app_name = COALESCE(${data.app_name ?? null}, app_name),
          description = COALESCE(${data.description ?? null}, description),
          phone = COALESCE(${data.phone ?? null}, phone),
          whatsapp = COALESCE(${data.whatsapp ?? null}, whatsapp),
          email = COALESCE(${data.email ?? null}, email),
          website = COALESCE(${data.website ?? null}, website),
          address = COALESCE(${data.address ?? null}, address),
          city = COALESCE(${data.city ?? null}, city),
          province = COALESCE(${data.province ?? null}, province),
          country = COALESCE(${data.country ?? null}, country),
          working_hours = COALESCE(${data.working_hours ?? null}, working_hours),
          social_links = COALESCE(${socialLinksJson}::jsonb, social_links),
          updated_at = NOW()
      RETURNING *
    `;
    if (rows.length === 0) {
      throw new Error('Failed to update company settings.');
    }
    const updated = rows[0] as any;
    await addAuditLog('UPDATE_COMPANY_SETTINGS', 'COMPANY_SETTINGS', updated.id, data, actorName);
    return {
      ...updated,
      social_links: typeof updated.social_links === 'string' ? JSON.parse(updated.social_links) : updated.social_links || {},
    } as CompanySettings;
  } catch (e) {
    console.error('[Neon updateCompanySettings Error]', e);
    throw new Error('Unable to update company settings in database.');
  }
}

export const updateCompanySettingsInNeon = updateCompanySettings;

// ==============================================================================
// 3. SERVICES CATALOGUE
// ==============================================================================
export async function getServices(activeOnly = false): Promise<Service[]> {
  try {
    const rows = activeOnly
      ? await sql`SELECT * FROM public.services WHERE is_active = true ORDER BY created_at ASC`
      : await sql`SELECT * FROM public.services ORDER BY created_at ASC`;

    return rows.map((r: any) => ({
      ...r,
      price_starting_at: r.price_starting_at ? Number(r.price_starting_at) : undefined,
      features: typeof r.features === 'string' ? JSON.parse(r.features) : r.features || [],
    })) as Service[];
  } catch (e) {
    console.error('[Neon getServices Error]', e);
    throw new Error('Unable to load services from database.');
  }
}

export const getServicesFromNeon = getServices;

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  try {
    const rows = await sql`
      SELECT * FROM public.services WHERE slug = ${slug} LIMIT 1
    `;
    if (rows.length === 0) return null;
    const r = rows[0] as any;
    return {
      ...r,
      price_starting_at: r.price_starting_at ? Number(r.price_starting_at) : undefined,
      features: typeof r.features === 'string' ? JSON.parse(r.features) : r.features || [],
    } as Service;
  } catch (e) {
    console.error('[Neon getServiceBySlug Error]', e);
    throw new Error('Unable to load service details from database.');
  }
}

export async function createService(
  data: Omit<Service, 'id' | 'created_at' | 'updated_at'>,
  actorName = 'Admin'
): Promise<Service> {
  try {
    const rows = await sql`
      INSERT INTO public.services (name, slug, category, description, short_description, price_starting_at, image_url, features, is_active)
      VALUES (
        ${data.name},
        ${data.slug},
        ${data.category},
        ${data.description},
        ${data.short_description},
        ${data.price_starting_at || null},
        ${data.image_url},
        ${JSON.stringify(data.features || [])}::jsonb,
        ${data.is_active}
      )
      RETURNING *
    `;
    const created = rows[0] as any;
    await addAuditLog('CREATE_SERVICE', 'SERVICE', created.id, { name: created.name }, actorName);
    return {
      ...created,
      price_starting_at: created.price_starting_at ? Number(created.price_starting_at) : undefined,
      features: typeof created.features === 'string' ? JSON.parse(created.features) : created.features || [],
    } as Service;
  } catch (e) {
    console.error('[Neon createService Error]', e);
    throw new Error('Unable to create service in database.');
  }
}

export const createServiceInNeon = createService;

export async function updateService(
  id: string,
  updates: Partial<Service>,
  actorName = 'Admin'
): Promise<Service> {
  try {
    const featuresJson = updates.features ? JSON.stringify(updates.features) : null;
    const rows = await sql`
      UPDATE public.services
      SET name = COALESCE(${updates.name ?? null}, name),
          slug = COALESCE(${updates.slug ?? null}, slug),
          category = COALESCE(${updates.category ?? null}, category),
          description = COALESCE(${updates.description ?? null}, description),
          short_description = COALESCE(${updates.short_description ?? null}, short_description),
          price_starting_at = COALESCE(${updates.price_starting_at ?? null}, price_starting_at),
          image_url = COALESCE(${updates.image_url ?? null}, image_url),
          features = COALESCE(${featuresJson}::jsonb, features),
          is_active = COALESCE(${updates.is_active ?? null}, is_active),
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    if (rows.length === 0) throw new Error('Service not found.');
    const updated = rows[0] as any;
    await addAuditLog('UPDATE_SERVICE', 'SERVICE', updated.id, updates, actorName);
    return {
      ...updated,
      price_starting_at: updated.price_starting_at ? Number(updated.price_starting_at) : undefined,
      features: typeof updated.features === 'string' ? JSON.parse(updated.features) : updated.features || [],
    } as Service;
  } catch (e) {
    console.error('[Neon updateService Error]', e);
    throw new Error('Unable to update service in database.');
  }
}

export const updateServiceInNeon = updateService;

export async function deleteService(id: string, actorName = 'Admin'): Promise<boolean> {
  try {
    await sql`DELETE FROM public.services WHERE id = ${id}`;
    await addAuditLog('DELETE_SERVICE', 'SERVICE', id, {}, actorName);
    return true;
  } catch (e) {
    console.error('[Neon deleteService Error]', e);
    throw new Error('Unable to delete service from database.');
  }
}

export const deleteServiceInNeon = deleteService;

// ==============================================================================
// 4. CLIENTS
// ==============================================================================
export async function getClients(): Promise<Client[]> {
  try {
    const rows = await sql`SELECT * FROM public.clients ORDER BY created_at DESC`;
    return rows.map((r: any) => ({
      ...r,
      location_coords: typeof r.location_coords === 'string' ? JSON.parse(r.location_coords) : r.location_coords || undefined,
    })) as Client[];
  } catch (e) {
    console.error('[Neon getClients Error]', e);
    throw new Error('Unable to load clients from database.');
  }
}

export const getClientsFromNeon = getClients;

export async function getClientById(id: string): Promise<Client | null> {
  try {
    const rows = await sql`SELECT * FROM public.clients WHERE id = ${id} LIMIT 1`;
    if (rows.length === 0) return null;
    const r = rows[0] as any;
    return {
      ...r,
      location_coords: typeof r.location_coords === 'string' ? JSON.parse(r.location_coords) : r.location_coords || undefined,
    } as Client;
  } catch (e) {
    console.error('[Neon getClientById Error]', e);
    throw new Error('Unable to load client from database.');
  }
}

export async function createClient(
  data: Omit<Client, 'id' | 'client_code' | 'created_at' | 'updated_at'>,
  actorName = 'Admin'
): Promise<Client> {
  try {
    const countRes = await sql`SELECT count(*)::int as cnt FROM public.clients`;
    const count = (countRes[0]?.cnt || 0) + 1;
    const year = new Date().getFullYear();
    const clientCode = `CLI-${year}-${count.toString().padStart(3, '0')}`;

    const locationCoordsJson = data.location_coords ? JSON.stringify(data.location_coords) : null;

    const rows = await sql`
      INSERT INTO public.clients (client_code, company_name, contact_person, phone, whatsapp, email, address, location_coords, status, notes)
      VALUES (
        ${clientCode},
        ${data.company_name},
        ${data.contact_person},
        ${data.phone},
        ${data.whatsapp || null},
        ${data.email || null},
        ${data.address},
        ${locationCoordsJson}::jsonb,
        ${data.status || 'ACTIVE'},
        ${data.notes || null}
      )
      RETURNING *
    `;
    const created = rows[0] as any;
    await addAuditLog('CREATE_CLIENT', 'CLIENT', created.id, { company_name: created.company_name }, actorName);
    return {
      ...created,
      location_coords: typeof created.location_coords === 'string' ? JSON.parse(created.location_coords) : created.location_coords || undefined,
    } as Client;
  } catch (e) {
    console.error('[Neon createClient Error]', e);
    throw new Error('Unable to create client in database.');
  }
}

export const createClientInNeon = createClient;

export async function updateClient(
  id: string,
  updates: Partial<Client>,
  actorName = 'Admin'
): Promise<Client> {
  try {
    const locationCoordsJson = updates.location_coords ? JSON.stringify(updates.location_coords) : null;
    const rows = await sql`
      UPDATE public.clients
      SET company_name = COALESCE(${updates.company_name ?? null}, company_name),
          contact_person = COALESCE(${updates.contact_person ?? null}, contact_person),
          phone = COALESCE(${updates.phone ?? null}, phone),
          whatsapp = COALESCE(${updates.whatsapp ?? null}, whatsapp),
          email = COALESCE(${updates.email ?? null}, email),
          address = COALESCE(${updates.address ?? null}, address),
          location_coords = COALESCE(${locationCoordsJson}::jsonb, location_coords),
          status = COALESCE(${updates.status ?? null}, status),
          notes = COALESCE(${updates.notes ?? null}, notes),
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    if (rows.length === 0) throw new Error('Client not found.');
    const updated = rows[0] as any;
    await addAuditLog('UPDATE_CLIENT', 'CLIENT', updated.id, updates, actorName);
    return {
      ...updated,
      location_coords: typeof updated.location_coords === 'string' ? JSON.parse(updated.location_coords) : updated.location_coords || undefined,
    } as Client;
  } catch (e) {
    console.error('[Neon updateClient Error]', e);
    throw new Error('Unable to update client in database.');
  }
}

export async function setClientStatus(
  id: string,
  status: UserStatus,
  actorName = 'Admin'
): Promise<boolean> {
  try {
    await sql`UPDATE public.clients SET status = ${status}, updated_at = NOW() WHERE id = ${id}`;
    await addAuditLog('UPDATE_CLIENT_STATUS', 'CLIENT', id, { status }, actorName);
    return true;
  } catch (e) {
    console.error('[Neon setClientStatus Error]', e);
    throw new Error('Unable to update client status in database.');
  }
}

export const setClientStatusInNeon = setClientStatus;

export async function deleteClient(id: string, actorName = 'Admin'): Promise<boolean> {
  try {
    await sql`DELETE FROM public.clients WHERE id = ${id}`;
    await addAuditLog('DELETE_CLIENT', 'CLIENT', id, {}, actorName);
    return true;
  } catch (e) {
    console.error('[Neon deleteClient Error]', e);
    throw new Error('Unable to delete client from database.');
  }
}

export const deleteClientInNeon = deleteClient;

// ==============================================================================
// 5. EMPLOYEES & PROFILES
// ==============================================================================
export async function getEmployees(): Promise<Employee[]> {
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
    throw new Error('Unable to load employees from database.');
  }
}

export const getEmployeesFromNeon = getEmployees;

export async function createEmployee(
  data: {
    full_name: string;
    email: string;
    phone: string;
    department: string;
    position: string;
    role: UserRole;
    password?: string;
  },
  actorName = 'Admin'
): Promise<Employee> {
  try {
    let passwordHash = null;
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(data.password, salt);
    } else {
      // Set secure default password if not provided
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash('Fast@2026', salt);
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

    await addAuditLog('CREATE_EMPLOYEE', 'EMPLOYEE', profile.id, { full_name: data.full_name, role: data.role }, actorName);

    return {
      ...empRows[0],
      profile,
    } as Employee;
  } catch (e) {
    console.error('[Neon createEmployee Error]', e);
    throw new Error('Unable to create employee in database: ' + (e as Error).message);
  }
}

export const createEmployeeInNeon = createEmployee;

export async function updateEmployee(
  id: string,
  data: {
    full_name?: string;
    email?: string;
    phone?: string;
    department?: string;
    position?: string;
    role?: UserRole;
    status?: UserStatus;
  },
  actorName = 'Admin'
): Promise<Employee> {
  try {
    // 1. Update profile
    const profileRows = await sql`
      UPDATE public.profiles
      SET full_name = COALESCE(${data.full_name ?? null}, full_name),
          email = COALESCE(${data.email ? data.email.toLowerCase().trim() : null}, email),
          phone = COALESCE(${data.phone ?? null}, phone),
          role = COALESCE(${data.role ?? null}, role),
          status = COALESCE(${data.status ?? null}, status),
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    if (profileRows.length === 0) throw new Error('Employee profile not found.');

    // 2. Update employee
    const empRows = await sql`
      UPDATE public.employees
      SET department = COALESCE(${data.department ?? null}, department),
          position = COALESCE(${data.position ?? null}, position),
          status = COALESCE(${data.status ?? null}, status),
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    await addAuditLog('UPDATE_EMPLOYEE', 'EMPLOYEE', id, data, actorName);

    return {
      ...empRows[0],
      profile: profileRows[0],
    } as Employee;
  } catch (e) {
    console.error('[Neon updateEmployee Error]', e);
    throw new Error('Unable to update employee in database.');
  }
}

export async function setEmployeeStatus(
  id: string,
  status: UserStatus,
  actorName = 'Admin'
): Promise<boolean> {
  try {
    await sql`UPDATE public.employees SET status = ${status}, updated_at = NOW() WHERE id = ${id}`;
    await sql`UPDATE public.profiles SET status = ${status}, updated_at = NOW() WHERE id = ${id}`;
    await addAuditLog('SET_EMPLOYEE_STATUS', 'EMPLOYEE', id, { status }, actorName);
    return true;
  } catch (e) {
    console.error('[Neon setEmployeeStatus Error]', e);
    throw new Error('Unable to update employee status in database.');
  }
}

export const setEmployeeStatusInNeon = setEmployeeStatus;

export async function resetEmployeePassword(
  id: string,
  newPassword?: string,
  actorName = 'Admin'
): Promise<{ success: boolean; message: string }> {
  try {
    const passwordToSet = newPassword || 'Fast@2026';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(passwordToSet, salt);
    await sql`UPDATE public.profiles SET password_hash = ${hash}, updated_at = NOW() WHERE id = ${id}`;
    await addAuditLog('RESET_PASSWORD', 'EMPLOYEE', id, {}, actorName);
    return { success: true, message: `Password reset successfully to ${passwordToSet}` };
  } catch (e) {
    console.error('[Neon resetEmployeePassword Error]', e);
    throw new Error('Unable to reset password in database.');
  }
}

export async function deleteEmployee(id: string, actorName = 'Admin'): Promise<boolean> {
  try {
    await sql`DELETE FROM public.employees WHERE id = ${id}`;
    await sql`DELETE FROM public.profiles WHERE id = ${id}`;
    await addAuditLog('DELETE_EMPLOYEE', 'EMPLOYEE', id, {}, actorName);
    return true;
  } catch (e) {
    console.error('[Neon deleteEmployee Error]', e);
    throw new Error('Unable to delete employee from database.');
  }
}

export const deleteEmployeeInNeon = deleteEmployee;

// ==============================================================================
// 6. PROJECTS & TASKS
// ==============================================================================
export async function getProjects(): Promise<Project[]> {
  try {
    const rows = await sql`
      SELECT p.*,
             row_to_json(c.*) as client,
             row_to_json(s.*) as service,
             COALESCE((
               SELECT json_agg(
                 json_build_object(
                   'id', t.id,
                   'task_code', t.task_code,
                   'project_id', t.project_id,
                   'assigned_employee_id', t.assigned_employee_id,
                   'title', t.title,
                   'description', t.description,
                   'status', t.status,
                   'progress', t.progress,
                   'deadline', t.deadline,
                   'created_at', t.created_at,
                   'updated_at', t.updated_at,
                   'assigned_employee', (
                     SELECT json_build_object(
                       'id', emp.id,
                       'employee_code', emp.employee_code,
                       'department', emp.department,
                       'position', emp.position,
                       'profile', json_build_object('full_name', prf.full_name, 'email', prf.email)
                     )
                     FROM public.employees emp
                     JOIN public.profiles prf ON emp.id = prf.id
                     WHERE emp.id = t.assigned_employee_id
                   )
                 )
               )
               FROM public.tasks t
               WHERE t.project_id = p.id
             ), '[]'::json) as tasks,
             COALESCE((
               SELECT json_agg(
                 json_build_object(
                   'id', pp.id,
                   'project_id', pp.project_id,
                   'product_id', pp.product_id,
                   'quantity', pp.quantity,
                   'unit', pp.unit,
                   'unit_cost', pp.unit_cost,
                   'usage_date', pp.usage_date,
                   'product', json_build_object('id', prd.id, 'name', prd.name, 'product_code', prd.product_code)
                 )
               )
               FROM public.project_products pp
               JOIN public.products prd ON pp.product_id = prd.id
               WHERE pp.project_id = p.id
             ), '[]'::json) as products_used
      FROM public.projects p
      LEFT JOIN public.clients c ON p.client_id = c.id
      LEFT JOIN public.services s ON p.service_id = s.id
      ORDER BY p.created_at DESC
    `;
    return rows as Project[];
  } catch (e) {
    console.error('[Neon getProjects Error]', e);
    throw new Error('Unable to load projects from database.');
  }
}

export const getProjectsFromNeon = getProjects;

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const rows = await sql`
      SELECT p.*,
             row_to_json(c.*) as client,
             row_to_json(s.*) as service
      FROM public.projects p
      LEFT JOIN public.clients c ON p.client_id = c.id
      LEFT JOIN public.services s ON p.service_id = s.id
      WHERE p.id = ${id}
      LIMIT 1
    `;
    if (rows.length === 0) return null;
    return rows[0] as Project;
  } catch (e) {
    console.error('[Neon getProjectById Error]', e);
    throw new Error('Unable to load project from database.');
  }
}

export async function createProject(
  data: Omit<Project, 'id' | 'project_code' | 'created_at' | 'updated_at'>,
  actorName = 'Admin'
): Promise<Project> {
  try {
    const countRes = await sql`SELECT count(*)::int as cnt FROM public.projects`;
    const count = (countRes[0]?.cnt || 0) + 1;
    const year = new Date().getFullYear();
    const projectCode = `PRJ-${year}-${count.toString().padStart(3, '0')}`;

    const rows = await sql`
      INSERT INTO public.projects (
        project_code, name, client_id, service_id, description, priority, status, progress, start_date, expected_completion_date, actual_completion_date, notes
      ) VALUES (
        ${projectCode},
        ${data.name},
        ${data.client_id},
        ${data.service_id || null},
        ${data.description},
        ${data.priority},
        ${data.status || 'PLANNED'},
        ${data.progress || 0},
        ${data.start_date},
        ${data.expected_completion_date},
        ${data.actual_completion_date || null},
        ${data.notes || null}
      )
      RETURNING *
    `;
    const created = rows[0] as any;
    await addAuditLog('CREATE_PROJECT', 'PROJECT', created.id, { name: created.name }, actorName);
    return created as Project;
  } catch (e) {
    console.error('[Neon createProject Error]', e);
    throw new Error('Unable to create project in database: ' + (e as Error).message);
  }
}

export const createProjectInNeon = createProject;

export async function updateProject(
  id: string,
  updates: Partial<Project>,
  actorName = 'Admin'
): Promise<Project> {
  try {
    const rows = await sql`
      UPDATE public.projects
      SET name = COALESCE(${updates.name ?? null}, name),
          description = COALESCE(${updates.description ?? null}, description),
          client_id = COALESCE(${updates.client_id ?? null}, client_id),
          service_id = COALESCE(${updates.service_id ?? null}, service_id),
          priority = COALESCE(${updates.priority ?? null}, priority),
          status = COALESCE(${updates.status ?? null}, status),
          progress = COALESCE(${updates.progress ?? null}, progress),
          start_date = COALESCE(${updates.start_date ?? null}, start_date),
          expected_completion_date = COALESCE(${updates.expected_completion_date ?? null}, expected_completion_date),
          actual_completion_date = COALESCE(${updates.actual_completion_date ?? null}, actual_completion_date),
          notes = COALESCE(${updates.notes ?? null}, notes),
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    if (rows.length === 0) throw new Error('Project not found.');
    const updated = rows[0] as any;
    await addAuditLog('UPDATE_PROJECT', 'PROJECT', updated.id, updates, actorName);
    return updated as Project;
  } catch (e) {
    console.error('[Neon updateProject Error]', e);
    throw new Error('Unable to update project in database.');
  }
}

export const updateProjectInNeon = updateProject;

export async function deleteProject(id: string, actorName = 'Admin'): Promise<boolean> {
  try {
    await sql`DELETE FROM public.projects WHERE id = ${id}`;
    await addAuditLog('DELETE_PROJECT', 'PROJECT', id, {}, actorName);
    return true;
  } catch (e) {
    console.error('[Neon deleteProject Error]', e);
    throw new Error('Unable to delete project from database.');
  }
}

export const deleteProjectInNeon = deleteProject;

// --- Tasks ---
export async function getTasks(projectId?: string, employeeId?: string): Promise<Task[]> {
  try {
    let rows: any[];
    if (projectId) {
      rows = await sql`
        SELECT t.*,
               row_to_json(p.*) as project,
               (
                 SELECT json_build_object(
                   'id', emp.id,
                   'employee_code', emp.employee_code,
                   'department', emp.department,
                   'position', emp.position,
                   'profile', json_build_object('full_name', prf.full_name, 'email', prf.email, 'phone', prf.phone)
                 )
                 FROM public.employees emp
                 JOIN public.profiles prf ON emp.id = prf.id
                 WHERE emp.id = t.assigned_employee_id
               ) as assigned_employee
        FROM public.tasks t
        LEFT JOIN public.projects p ON t.project_id = p.id
        WHERE t.project_id = ${projectId}
        ORDER BY t.created_at DESC
      `;
    } else if (employeeId) {
      rows = await sql`
        SELECT t.*,
               row_to_json(p.*) as project,
               (
                 SELECT json_build_object(
                   'id', emp.id,
                   'employee_code', emp.employee_code,
                   'department', emp.department,
                   'position', emp.position,
                   'profile', json_build_object('full_name', prf.full_name, 'email', prf.email, 'phone', prf.phone)
                 )
                 FROM public.employees emp
                 JOIN public.profiles prf ON emp.id = prf.id
                 WHERE emp.id = t.assigned_employee_id
               ) as assigned_employee
        FROM public.tasks t
        LEFT JOIN public.projects p ON t.project_id = p.id
        WHERE t.assigned_employee_id = ${employeeId}
        ORDER BY t.created_at DESC
      `;
    } else {
      rows = await sql`
        SELECT t.*,
               row_to_json(p.*) as project,
               (
                 SELECT json_build_object(
                   'id', emp.id,
                   'employee_code', emp.employee_code,
                   'department', emp.department,
                   'position', emp.position,
                   'profile', json_build_object('full_name', prf.full_name, 'email', prf.email, 'phone', prf.phone)
                 )
                 FROM public.employees emp
                 JOIN public.profiles prf ON emp.id = prf.id
                 WHERE emp.id = t.assigned_employee_id
               ) as assigned_employee
        FROM public.tasks t
        LEFT JOIN public.projects p ON t.project_id = p.id
        ORDER BY t.created_at DESC
      `;
    }
    return rows as Task[];
  } catch (e) {
    console.error('[Neon getTasks Error]', e);
    throw new Error('Unable to load tasks from database.');
  }
}

export const getTasksFromNeon = getTasks;

export async function createTask(
  data: Omit<Task, 'id' | 'task_code' | 'created_at' | 'updated_at'>,
  actorName = 'Admin'
): Promise<Task> {
  try {
    const countRes = await sql`SELECT count(*)::int as cnt FROM public.tasks`;
    const count = (countRes[0]?.cnt || 0) + 1;
    const taskCode = `TSK-${count.toString().padStart(3, '0')}`;

    const rows = await sql`
      INSERT INTO public.tasks (
        task_code, project_id, assigned_employee_id, title, description, status, progress, deadline
      ) VALUES (
        ${taskCode},
        ${data.project_id},
        ${data.assigned_employee_id || null},
        ${data.title},
        ${data.description || null},
        ${data.status || 'PENDING'},
        ${data.progress || 0},
        ${data.deadline || null}
      )
      RETURNING *
    `;
    const created = rows[0] as any;
    await addAuditLog('CREATE_TASK', 'TASK', created.id, { title: created.title }, actorName);
    return created as Task;
  } catch (e) {
    console.error('[Neon createTask Error]', e);
    throw new Error('Unable to create task in database: ' + (e as Error).message);
  }
}

export const createTaskInNeon = createTask;

export async function updateTask(
  id: string,
  updates: Partial<Task>,
  actorName = 'Admin'
): Promise<Task> {
  try {
    const rows = await sql`
      UPDATE public.tasks
      SET title = COALESCE(${updates.title ?? null}, title),
          description = COALESCE(${updates.description ?? null}, description),
          assigned_employee_id = COALESCE(${updates.assigned_employee_id ?? null}, assigned_employee_id),
          status = COALESCE(${updates.status ?? null}, status),
          progress = COALESCE(${updates.progress ?? null}, progress),
          deadline = COALESCE(${updates.deadline ?? null}, deadline),
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    if (rows.length === 0) throw new Error('Task not found.');
    const updated = rows[0] as any;
    await addAuditLog('UPDATE_TASK', 'TASK', updated.id, updates, actorName);
    return updated as Task;
  } catch (e) {
    console.error('[Neon updateTask Error]', e);
    throw new Error('Unable to update task in database.');
  }
}

export async function updateTaskProgress(
  id: string,
  progress: number,
  status: TaskStatus,
  actorName = 'Employee / Admin'
): Promise<Task> {
  try {
    const rows = await sql`
      UPDATE public.tasks
      SET progress = ${progress}, status = ${status}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    if (rows.length === 0) throw new Error('Task not found.');
    const task = rows[0] as Task;

    // Automatically recalculate project progress from average of all tasks in this project
    if (task.project_id) {
      const avgRes = await sql`
        SELECT COALESCE(AVG(progress)::int, 0) as avg_prog
        FROM public.tasks
        WHERE project_id = ${task.project_id}
      `;
      const avgProgress = avgRes[0]?.avg_prog || 0;
      let projectStatus: ProjectStatus = 'IN_PROGRESS';
      if (avgProgress === 100) projectStatus = 'COMPLETED';

      await sql`
        UPDATE public.projects
        SET progress = ${avgProgress},
            status = CASE WHEN ${avgProgress} = 100 THEN 'COMPLETED' ELSE status END,
            updated_at = NOW()
        WHERE id = ${task.project_id}
      `;
    }

    await addAuditLog('UPDATE_TASK_PROGRESS', 'TASK', task.id, { progress, status }, actorName);
    return task;
  } catch (e) {
    console.error('[Neon updateTaskProgress Error]', e);
    throw new Error('Unable to update task progress in database.');
  }
}

export const updateTaskProgressInNeon = updateTaskProgress;

export async function deleteTask(id: string, actorName = 'Admin'): Promise<boolean> {
  try {
    await sql`DELETE FROM public.tasks WHERE id = ${id}`;
    await addAuditLog('DELETE_TASK', 'TASK', id, {}, actorName);
    return true;
  } catch (e) {
    console.error('[Neon deleteTask Error]', e);
    throw new Error('Unable to delete task from database.');
  }
}

export const deleteTaskInNeon = deleteTask;

// ==============================================================================
// 7. PRODUCTS & INVENTORY
// ==============================================================================
export async function getProducts(): Promise<Product[]> {
  try {
    const rows = await sql`SELECT * FROM public.products ORDER BY name ASC`;
    return rows.map((r: any) => ({
      ...r,
      price: Number(r.price),
      stock: Number(r.stock),
    })) as Product[];
  } catch (e) {
    console.error('[Neon getProducts Error]', e);
    throw new Error('Unable to load products from database.');
  }
}

export const getProductsFromNeon = getProducts;

export async function createProduct(
  data: Omit<Product, 'id' | 'product_code' | 'created_at' | 'updated_at'>,
  actorName = 'Admin'
): Promise<Product> {
  try {
    const countRes = await sql`SELECT count(*)::int as cnt FROM public.products`;
    const count = (countRes[0]?.cnt || 0) + 1;
    const prodCode = `PRD-${count.toString().padStart(3, '0')}`;

    const rows = await sql`
      INSERT INTO public.products (
        product_code, name, category, description, unit, price, stock, status, image_url
      ) VALUES (
        ${prodCode},
        ${data.name},
        ${data.category},
        ${data.description || null},
        ${data.unit},
        ${data.price},
        ${data.stock},
        'ACTIVE',
        ${data.image_url || null}
      )
      RETURNING *
    `;
    const created = rows[0] as any;
    await addAuditLog('CREATE_PRODUCT', 'PRODUCT', created.id, { name: created.name }, actorName);
    return {
      ...created,
      price: Number(created.price),
      stock: Number(created.stock),
    } as Product;
  } catch (e) {
    console.error('[Neon createProduct Error]', e);
    throw new Error('Unable to create product in database.');
  }
}

export const createProductInNeon = createProduct;

export async function updateProduct(
  id: string,
  updates: Partial<Product>,
  actorName = 'Admin'
): Promise<Product> {
  try {
    const rows = await sql`
      UPDATE public.products
      SET name = COALESCE(${updates.name ?? null}, name),
          category = COALESCE(${updates.category ?? null}, category),
          description = COALESCE(${updates.description ?? null}, description),
          unit = COALESCE(${updates.unit ?? null}, unit),
          price = COALESCE(${updates.price ?? null}, price),
          stock = COALESCE(${updates.stock ?? null}, stock),
          status = COALESCE(${updates.status ?? null}, status),
          image_url = COALESCE(${updates.image_url ?? null}, image_url),
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    if (rows.length === 0) throw new Error('Product not found.');
    const updated = rows[0] as any;
    await addAuditLog('UPDATE_PRODUCT', 'PRODUCT', updated.id, updates, actorName);
    return {
      ...updated,
      price: Number(updated.price),
      stock: Number(updated.stock),
    } as Product;
  } catch (e) {
    console.error('[Neon updateProduct Error]', e);
    throw new Error('Unable to update product in database.');
  }
}

export async function addProductUsage(
  data: {
    project_id: string;
    product_id: string;
    quantity: number;
    unit_cost?: number;
    added_by?: string;
  },
  actorName = 'Admin'
): Promise<ProjectProduct> {
  try {
    // 1. Fetch product for unit and default price
    const prodRows = await sql`SELECT * FROM public.products WHERE id = ${data.product_id} LIMIT 1`;
    if (prodRows.length === 0) throw new Error('Product not found.');
    const product = prodRows[0] as any;

    const unitCost = data.unit_cost ?? Number(product.price);
    const unit = product.unit || 'units';

    // 2. Insert into project_products
    const ppRows = await sql`
      INSERT INTO public.project_products (project_id, product_id, quantity, unit, unit_cost, added_by)
      VALUES (${data.project_id}, ${data.product_id}, ${data.quantity}, ${unit}, ${unitCost}, ${data.added_by || null})
      RETURNING *
    `;

    // 3. Deduct stock from products table
    await sql`
      UPDATE public.products
      SET stock = GREATEST(0, stock - ${data.quantity}), updated_at = NOW()
      WHERE id = ${data.product_id}
    `;

    await addAuditLog('ADD_PRODUCT_USAGE', 'PROJECT_PRODUCT', ppRows[0].id, data, actorName);

    return {
      ...ppRows[0],
      quantity: Number(ppRows[0].quantity),
      unit_cost: Number(ppRows[0].unit_cost),
      product,
    } as ProjectProduct;
  } catch (e) {
    console.error('[Neon addProductUsage Error]', e);
    throw new Error('Unable to record product usage in database.');
  }
}

export async function deleteProduct(id: string, actorName = 'Admin'): Promise<boolean> {
  try {
    await sql`DELETE FROM public.products WHERE id = ${id}`;
    await addAuditLog('DELETE_PRODUCT', 'PRODUCT', id, {}, actorName);
    return true;
  } catch (e) {
    console.error('[Neon deleteProduct Error]', e);
    throw new Error('Unable to delete product from database.');
  }
}

export const deleteProductInNeon = deleteProduct;

// ==============================================================================
// 8. SERVICE REQUESTS
// ==============================================================================
export async function getServiceRequests(filter?: {
  status?: RequestStatus;
  userId?: string;
  clientId?: string;
}): Promise<ServiceRequest[]> {
  try {
    let rows: any[];
    if (filter?.userId) {
      rows = await sql`
        SELECT r.*,
               row_to_json(s.*) as service,
               COALESCE((
                 SELECT json_agg(h.* ORDER BY h.created_at ASC)
                 FROM public.request_status_history h
                 WHERE h.request_id = r.id
               ), '[]'::json) as history,
               COALESCE((
                 SELECT json_agg(img.*)
                 FROM public.service_request_images img
                 WHERE img.request_id = r.id
               ), '[]'::json) as images
        FROM public.service_requests r
        LEFT JOIN public.services s ON r.service_id = s.id
        WHERE r.user_id = ${filter.userId}
        ORDER BY r.created_at DESC
      `;
    } else if (filter?.clientId) {
      rows = await sql`
        SELECT r.*,
               row_to_json(s.*) as service,
               COALESCE((
                 SELECT json_agg(h.* ORDER BY h.created_at ASC)
                 FROM public.request_status_history h
                 WHERE h.request_id = r.id
               ), '[]'::json) as history,
               COALESCE((
                 SELECT json_agg(img.*)
                 FROM public.service_request_images img
                 WHERE img.request_id = r.id
               ), '[]'::json) as images
        FROM public.service_requests r
        LEFT JOIN public.services s ON r.service_id = s.id
        WHERE r.client_id = ${filter.clientId}
        ORDER BY r.created_at DESC
      `;
    } else {
      rows = await sql`
        SELECT r.*,
               row_to_json(s.*) as service,
               COALESCE((
                 SELECT json_agg(h.* ORDER BY h.created_at ASC)
                 FROM public.request_status_history h
                 WHERE h.request_id = r.id
               ), '[]'::json) as history,
               COALESCE((
                 SELECT json_agg(img.*)
                 FROM public.service_request_images img
                 WHERE img.request_id = r.id
               ), '[]'::json) as images
        FROM public.service_requests r
        LEFT JOIN public.services s ON r.service_id = s.id
        ORDER BY r.created_at DESC
      `;
    }
    return rows as ServiceRequest[];
  } catch (e) {
    console.error('[Neon getServiceRequests Error]', e);
    throw new Error('Unable to load service requests from database.');
  }
}

export const getServiceRequestsFromNeon = getServiceRequests;

export async function getServiceRequestById(id: string): Promise<ServiceRequest | null> {
  try {
    const rows = await sql`
      SELECT r.*,
             row_to_json(s.*) as service,
             COALESCE((
               SELECT json_agg(h.* ORDER BY h.created_at ASC)
               FROM public.request_status_history h
               WHERE h.request_id = r.id
             ), '[]'::json) as history,
             COALESCE((
               SELECT json_agg(img.*)
               FROM public.service_request_images img
               WHERE img.request_id = r.id
             ), '[]'::json) as images
      FROM public.service_requests r
      LEFT JOIN public.services s ON r.service_id = s.id
      WHERE r.id = ${id} OR r.request_id = ${id}
      LIMIT 1
    `;
    if (rows.length === 0) return null;
    return rows[0] as ServiceRequest;
  } catch (e) {
    console.error('[Neon getServiceRequestById Error]', e);
    throw new Error('Unable to load service request from database.');
  }
}

export async function createServiceRequest(
  data: Omit<ServiceRequest, 'id' | 'request_id' | 'status' | 'created_at' | 'updated_at' | 'images' | 'history'> & {
    images?: { image_url: string; file_name?: string }[];
  }
): Promise<ServiceRequest> {
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
        ${requestId},
        ${data.service_id},
        ${data.user_id || null},
        ${data.client_id || null},
        ${data.customer_name},
        ${data.customer_phone},
        ${data.customer_email},
        ${data.description},
        ${data.preferred_date},
        ${data.preferred_time},
        ${data.location_address},
        ${data.latitude || null},
        ${data.longitude || null},
        'PENDING'
      )
      RETURNING *
    `;

    const request = rows[0] as ServiceRequest;

    // Insert history item
    await sql`
      INSERT INTO public.request_status_history (request_id, status, notes)
      VALUES (${request.id}, 'PENDING', 'Request created by customer')
    `;

    // Insert images if provided
    if (data.images && data.images.length > 0) {
      for (const img of data.images) {
        await sql`
          INSERT INTO public.service_request_images (request_id, image_url, file_name)
          VALUES (${request.id}, ${img.image_url}, ${img.file_name || null})
        `;
      }
    }

    await addAuditLog('CREATE_SERVICE_REQUEST', 'SERVICE_REQUEST', request.id, {
      customer_name: data.customer_name,
      request_id: requestId,
    });

    return request;
  } catch (e) {
    console.error('[Neon createServiceRequest Error]', e);
    throw new Error('Unable to create service request in database: ' + (e as Error).message);
  }
}

export const createServiceRequestInNeon = createServiceRequest;

export async function updateServiceRequestStatus(
  id: string,
  status: RequestStatus,
  notes?: string,
  changedBy?: string,
  actorName = 'Admin'
): Promise<ServiceRequest> {
  try {
    const rows = await sql`
      UPDATE public.service_requests
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${id} OR request_id = ${id}
      RETURNING *
    `;
    if (rows.length === 0) throw new Error('Service request not found.');
    const req = rows[0] as any;

    // Record in history
    await sql`
      INSERT INTO public.request_status_history (request_id, status, notes, changed_by)
      VALUES (${req.id}, ${status}, ${notes || null}, ${changedBy || null})
    `;

    await addAuditLog('UPDATE_SERVICE_REQUEST_STATUS', 'SERVICE_REQUEST', req.id, { status, notes }, actorName);

    return req as ServiceRequest;
  } catch (e) {
    console.error('[Neon updateServiceRequestStatus Error]', e);
    throw new Error('Unable to update service request status in database.');
  }
}

export async function deleteServiceRequest(id: string, actorName = 'Admin'): Promise<boolean> {
  try {
    await sql`DELETE FROM public.service_requests WHERE id = ${id} OR request_id = ${id}`;
    await addAuditLog('DELETE_SERVICE_REQUEST', 'SERVICE_REQUEST', id, {}, actorName);
    return true;
  } catch (e) {
    console.error('[Neon deleteServiceRequest Error]', e);
    throw new Error('Unable to delete service request from database.');
  }
}

export const deleteServiceRequestInNeon = deleteServiceRequest;

// ==============================================================================
// 9. DASHBOARD STATS & METRICS (REAL DATABASE QUERIES)
// ==============================================================================
export async function getDashboardStats() {
  try {
    const [clientsRes, empsRes, projectsRes, tasksRes, requestsRes, servicesRes, productsRes, productCostRes] = await Promise.all([
      sql`SELECT count(*)::int as total FROM public.clients WHERE status = 'ACTIVE'`,
      sql`SELECT count(*)::int as total FROM public.employees WHERE status = 'ACTIVE'`,
      sql`
        SELECT
          count(*)::int as total,
          count(CASE WHEN status = 'IN_PROGRESS' THEN 1 END)::int as active,
          count(CASE WHEN status = 'COMPLETED' THEN 1 END)::int as completed,
          COALESCE(AVG(progress)::int, 0) as avg_progress
        FROM public.projects
      `,
      sql`
        SELECT
          count(*)::int as total,
          count(CASE WHEN status = 'COMPLETED' THEN 1 END)::int as completed,
          count(CASE WHEN status = 'IN_PROGRESS' THEN 1 END)::int as in_progress
        FROM public.tasks
      `,
      sql`
        SELECT
          count(*)::int as total,
          count(CASE WHEN status = 'PENDING' THEN 1 END)::int as pending,
          count(CASE WHEN status = 'IN_PROGRESS' THEN 1 END)::int as in_progress
        FROM public.service_requests
      `,
      sql`SELECT count(*)::int as total FROM public.services WHERE is_active = true`,
      sql`SELECT count(*)::int as total, COALESCE(SUM(stock), 0)::numeric as total_stock FROM public.products WHERE status = 'ACTIVE'`,
      sql`SELECT COALESCE(SUM(quantity * unit_cost), 0)::numeric as total_materials_cost FROM public.project_products`,
    ]);

    return {
      totalClients: clientsRes[0]?.total || 0,
      totalEmployees: empsRes[0]?.total || 0,
      totalProjects: projectsRes[0]?.total || 0,
      activeProjects: projectsRes[0]?.active || 0,
      completedProjects: projectsRes[0]?.completed || 0,
      avgProjectProgress: projectsRes[0]?.avg_progress || 0,
      totalTasks: tasksRes[0]?.total || 0,
      completedTasks: tasksRes[0]?.completed || 0,
      pendingRequests: requestsRes[0]?.pending || 0,
      totalRequests: requestsRes[0]?.total || 0,
      totalServices: servicesRes[0]?.total || 0,
      totalProducts: productsRes[0]?.total || 0,
      totalMaterialsCost: Number(productCostRes[0]?.total_materials_cost || 0),
    };
  } catch (e) {
    console.error('[Neon getDashboardStats Error]', e);
    throw new Error('Unable to calculate dashboard statistics from database.');
  }
}

// ==============================================================================
// 10. MONTHLY REPORTS & OVERVIEW (REAL DATABASE QUERIES)
// ==============================================================================
export async function getMonthlyOverview(month?: number, year?: number) {
  try {
    const now = new Date();
    // Support both 0-indexed and 1-indexed month inputs
    let targetMonth = month !== undefined ? (month <= 11 ? month + 1 : month) : (now.getMonth() + 1);
    let targetYear = year ?? now.getFullYear();

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthName = monthNames[targetMonth - 1] || 'Current Month';

    // Parallel execution of real PostgreSQL queries
    const [
      clientsRes,
      employeesRes,
      projectsRes,
      tasksRes,
      requestsRes,
      productUsagesRes,
    ] = await Promise.all([
      sql`
        SELECT id, client_code, company_name, contact_person, phone, email, address, status, created_at
        FROM public.clients
        ORDER BY created_at DESC
      `,
      sql`
        SELECT e.id, e.employee_code, e.department, e.position, e.status,
               p.full_name, p.email, p.phone, p.role
        FROM public.employees e
        JOIN public.profiles p ON e.id = p.id
        WHERE e.status = 'ACTIVE'
        ORDER BY e.created_at ASC
      `,
      sql`
        SELECT p.*,
               row_to_json(c.*) as client,
               row_to_json(s.*) as service
        FROM public.projects p
        LEFT JOIN public.clients c ON p.client_id = c.id
        LEFT JOIN public.services s ON p.service_id = s.id
        ORDER BY p.created_at DESC
      `,
      sql`
        SELECT t.*,
               row_to_json(p.*) as project,
               (
                 SELECT json_build_object(
                   'id', emp.id,
                   'employee_code', emp.employee_code,
                   'department', emp.department,
                   'position', emp.position,
                   'profile', json_build_object('full_name', prf.full_name, 'email', prf.email)
                 )
                 FROM public.employees emp
                 JOIN public.profiles prf ON emp.id = prf.id
                 WHERE emp.id = t.assigned_employee_id
               ) as assigned_employee
        FROM public.tasks t
        LEFT JOIN public.projects p ON t.project_id = p.id
        ORDER BY t.created_at DESC
      `,
      sql`
        SELECT r.*,
               row_to_json(s.*) as service
        FROM public.service_requests r
        LEFT JOIN public.services s ON r.service_id = s.id
        ORDER BY r.created_at DESC
      `,
      sql`
        SELECT pp.*,
               row_to_json(prd.*) as product,
               row_to_json(p.*) as project
        FROM public.project_products pp
        LEFT JOIN public.products prd ON pp.product_id = prd.id
        LEFT JOIN public.projects p ON pp.project_id = p.id
        ORDER BY pp.created_at DESC
      `,
    ]);

    const allClients = clientsRes as any[];
    const allEmployees = employeesRes as any[];
    const allProjects = projectsRes as any[];
    const allTasks = tasksRes as any[];
    const allRequests = requestsRes as any[];
    const allProductUsages = productUsagesRes as any[];

    // Calculate metrics
    const activeClients = allClients.filter((c) => c.status === 'ACTIVE').length;
    const inProgressProjects = allProjects.filter((p) => p.status === 'IN_PROGRESS').length;
    const completedProjects = allProjects.filter((p) => p.status === 'COMPLETED').length;

    const avgProgress =
      allProjects.length > 0
        ? Math.round(
            allProjects.reduce((acc, curr) => acc + (Number(curr.progress) || 0), 0) /
              allProjects.length
          )
        : 0;

    // Distinct employees assigned to active tasks
    const activeEmployeeIds = new Set(
      allTasks
        .filter((t) => t.status === 'IN_PROGRESS' || t.status === 'PENDING')
        .map((t) => t.assigned_employee_id)
        .filter(Boolean)
    );

    const monthProductCost = allProductUsages.reduce(
      (acc, u) => acc + Number(u.quantity || 0) * Number(u.unit_cost || 0),
      0
    );

    return {
      month: monthName,
      monthName,
      monthNumber: targetMonth,
      year: targetYear,
      kpis: {
        totalClients: allClients.length,
        activeClients,
        totalEmployees: allEmployees.length,
        employeesWorking: activeEmployeeIds.size,
        monthProjectsCount: allProjects.length,
        inProgressProjects,
        completedProjects,
        overallProgress: avgProgress,
        monthRequestsCount: allRequests.length,
        monthProductCost,
      },
      projects: allProjects,
      tasks: allTasks,
      clients: allClients,
      employees: allEmployees,
      serviceRequests: allRequests,
      productUsages: allProductUsages,
    };
  } catch (e) {
    console.error('[Neon getMonthlyOverview Error]', e);
    throw new Error('Unable to calculate monthly overview from database.');
  }
}



