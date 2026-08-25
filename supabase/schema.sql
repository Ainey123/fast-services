-- ==============================================================================
-- FAST SERVICES / FAST ENGINEERING SOLUTIONS
-- COMPLETE ENTERPRISE POSTGRESQL SCHEMA WITH RLS & TRIGGERS
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES & USERS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('ADMIN', 'MANAGER', 'EMPLOYEE', 'CUSTOMER')) DEFAULT 'CUSTOMER',
    status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'INACTIVE')) DEFAULT 'ACTIVE',
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. EMPLOYEES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    employee_code TEXT UNIQUE NOT NULL,
    department TEXT NOT NULL,
    position TEXT NOT NULL,
    joining_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'INACTIVE')) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. CLIENTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_code TEXT UNIQUE NOT NULL,
    company_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    email TEXT,
    address TEXT NOT NULL,
    location_coords JSONB, -- { "lat": 31.5204, "lng": 74.3587 }
    status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'INACTIVE')) DEFAULT 'ACTIVE',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. SERVICES CATALOGUE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT NOT NULL,
    price_starting_at NUMERIC(12, 2),
    image_url TEXT NOT NULL,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. SERVICE REQUESTS & SEQUENCE (FS-YYYY-XXXXXX)
-- ------------------------------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS service_request_seq START WITH 1001;

CREATE TABLE IF NOT EXISTS public.service_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    description TEXT NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time TEXT NOT NULL,
    location_address TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'REVIEWING', 'ACCEPTED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')) DEFAULT 'PENDING',
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-generate Request ID: FS-YYYY-XXXXXX
CREATE OR REPLACE FUNCTION generate_request_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.request_id IS NULL OR NEW.request_id = '' THEN
        NEW.request_id := 'FS-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('service_request_seq')::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_generate_request_id ON public.service_requests;
CREATE TRIGGER trg_generate_request_id
BEFORE INSERT ON public.service_requests
FOR EACH ROW
EXECUTE FUNCTION generate_request_id();

-- ------------------------------------------------------------------------------
-- 6. SERVICE REQUEST IMAGES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.service_request_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES public.service_requests(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    file_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. REQUEST STATUS HISTORY
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.request_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES public.service_requests(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    notes TEXT,
    changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. PROJECTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')) DEFAULT 'MEDIUM',
    status TEXT NOT NULL CHECK (status IN ('PLANNED', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED')) DEFAULT 'PLANNED',
    progress INTEGER NOT NULL CHECK (progress >= 0 AND progress <= 100) DEFAULT 0,
    start_date DATE NOT NULL,
    expected_completion_date DATE NOT NULL,
    actual_completion_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. PROJECT ASSIGNMENTS (Many-to-Many: Employees to Projects)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.project_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    role_in_project TEXT DEFAULT 'Engineer',
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(project_id, employee_id)
);

-- ------------------------------------------------------------------------------
-- 10. TASKS (Work Items assigned to Employees)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_code TEXT UNIQUE NOT NULL,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    assigned_employee_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED')) DEFAULT 'PENDING',
    progress INTEGER NOT NULL CHECK (progress >= 0 AND progress <= 100) DEFAULT 0,
    deadline DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 11. PRODUCTS & INVENTORY
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    unit TEXT NOT NULL DEFAULT 'units',
    price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    stock NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'INACTIVE')) DEFAULT 'ACTIVE',
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 12. PROJECT PRODUCTS (Products Used in Projects)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.project_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    quantity NUMERIC(12, 2) NOT NULL CHECK (quantity > 0),
    unit TEXT NOT NULL,
    unit_cost NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
    added_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 13. AUDIT LOGS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 14. COMPANY SETTINGS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.company_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name TEXT NOT NULL DEFAULT 'FAST ENGINEERING SOLUTIONS',
    app_name TEXT NOT NULL DEFAULT 'FAST SERVICES',
    phone TEXT NOT NULL DEFAULT '+923001234567',
    whatsapp TEXT NOT NULL DEFAULT '+923001234567',
    email TEXT NOT NULL DEFAULT 'info@fastengineeringsolutions.com',
    address TEXT NOT NULL DEFAULT 'Industrial Estate, Phase 2, Lahore, Pakistan',
    latitude DOUBLE PRECISION DEFAULT 31.5204,
    longitude DOUBLE PRECISION DEFAULT 74.3587,
    working_hours TEXT NOT NULL DEFAULT 'Monday - Saturday: 08:00 AM - 07:00 PM',
    social_links JSONB NOT NULL DEFAULT '{"facebook": "#", "linkedin": "#", "twitter": "#"}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 15. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_request_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

-- Helper to check user role
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Services & Company Settings are public read for all
CREATE POLICY "Public services read" ON public.services FOR SELECT USING (true);
CREATE POLICY "Public company settings read" ON public.company_settings FOR SELECT USING (true);

-- Customers can view their own service requests and insert new ones
CREATE POLICY "Customers view own requests" ON public.service_requests FOR SELECT USING (
    auth.uid() = user_id OR public.current_user_role() IN ('ADMIN', 'MANAGER')
);
CREATE POLICY "Anyone or customer insert requests" ON public.service_requests FOR INSERT WITH CHECK (true);

-- Employees view assigned projects and tasks
CREATE POLICY "Employee view assigned projects" ON public.projects FOR SELECT USING (
    public.current_user_role() IN ('ADMIN', 'MANAGER') OR
    EXISTS (SELECT 1 FROM public.project_assignments WHERE project_id = projects.id AND employee_id = auth.uid())
);

CREATE POLICY "Employee view assigned tasks" ON public.tasks FOR SELECT USING (
    public.current_user_role() IN ('ADMIN', 'MANAGER') OR
    assigned_employee_id = auth.uid()
);

CREATE POLICY "Employee update own task progress" ON public.tasks FOR UPDATE USING (
    public.current_user_role() IN ('ADMIN', 'MANAGER') OR
    assigned_employee_id = auth.uid()
);

-- Admin & Manager full access policies
CREATE POLICY "Admin manage all profiles" ON public.profiles FOR ALL USING (public.current_user_role() = 'ADMIN');
CREATE POLICY "Admin manage all employees" ON public.employees FOR ALL USING (public.current_user_role() = 'ADMIN');
CREATE POLICY "Admin manage all clients" ON public.clients FOR ALL USING (public.current_user_role() IN ('ADMIN', 'MANAGER'));
CREATE POLICY "Admin manage all services" ON public.services FOR ALL USING (public.current_user_role() = 'ADMIN');
CREATE POLICY "Admin manage all requests" ON public.service_requests FOR ALL USING (public.current_user_role() IN ('ADMIN', 'MANAGER'));
CREATE POLICY "Admin manage all projects" ON public.projects FOR ALL USING (public.current_user_role() IN ('ADMIN', 'MANAGER'));
CREATE POLICY "Admin manage all assignments" ON public.project_assignments FOR ALL USING (public.current_user_role() IN ('ADMIN', 'MANAGER'));
CREATE POLICY "Admin manage all tasks" ON public.tasks FOR ALL USING (public.current_user_role() IN ('ADMIN', 'MANAGER'));
CREATE POLICY "Admin manage all products" ON public.products FOR ALL USING (public.current_user_role() IN ('ADMIN', 'MANAGER'));
CREATE POLICY "Admin manage all project_products" ON public.project_products FOR ALL USING (public.current_user_role() IN ('ADMIN', 'MANAGER'));
CREATE POLICY "Admin manage all audit_logs" ON public.audit_logs FOR ALL USING (public.current_user_role() = 'ADMIN');
CREATE POLICY "Admin manage company settings" ON public.company_settings FOR ALL USING (public.current_user_role() = 'ADMIN');

-- Insert initial company settings if none exist
INSERT INTO public.company_settings (id, company_name, app_name, phone, whatsapp, email, address, working_hours, social_links)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'FAST ENGINEERING SOLUTIONS',
    'FAST SERVICES',
    '+92 300 4545280',
    '+923004545280',
    'fastsales.services@gmail.com',
    'Al Jannat Main Road, LDA Avenue 1, Raiwind Road, Lahore, Pakistan',
    '24 Hours Service (24/7 Construction & Engineering Support)',
    '{"pinterest": "https://www.pinterest.com/fastsalesservices/", "youtube": "https://www.youtube.com/@fastengineering8299", "tiktok": "https://www.tiktok.com/@fastengineeringsolution"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    company_name = EXCLUDED.company_name,
    app_name = EXCLUDED.app_name,
    phone = EXCLUDED.phone,
    whatsapp = EXCLUDED.whatsapp,
    email = EXCLUDED.email,
    address = EXCLUDED.address,
    working_hours = EXCLUDED.working_hours,
    social_links = EXCLUDED.social_links;
