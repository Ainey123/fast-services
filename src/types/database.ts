export type UserRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'CUSTOMER';
export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface Profile {
  id: string;
  full_name: string;
  phone?: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  employee_code: string;
  department: string;
  position: string;
  joining_date: string;
  status: UserStatus;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface Client {
  id: string;
  client_code: string;
  company_name: string;
  contact_person: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  address: string;
  location_coords?: { lat: number; lng: number };
  status: UserStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  short_description: string;
  price_starting_at?: number;
  image_url: string;
  features: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type RequestStatus =
  | 'PENDING'
  | 'REVIEWING'
  | 'ACCEPTED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface ServiceRequestImage {
  id: string;
  request_id: string;
  image_url: string;
  file_name?: string;
  created_at: string;
}

export interface RequestStatusHistory {
  id: string;
  request_id: string;
  status: RequestStatus;
  notes?: string;
  changed_by?: string;
  created_at: string;
}

export interface ServiceRequest {
  id: string;
  request_id: string;
  user_id?: string;
  client_id?: string;
  service_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  description: string;
  preferred_date: string;
  preferred_time: string;
  location_address: string;
  latitude?: number;
  longitude?: number;
  status: RequestStatus;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  service?: Service;
  images?: ServiceRequestImage[];
  history?: RequestStatusHistory[];
}

export type ProjectPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type ProjectStatus = 'PLANNED' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';

export interface ProjectAssignment {
  id: string;
  project_id: string;
  employee_id: string;
  role_in_project?: string;
  assigned_at: string;
  employee?: Employee;
}

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';

export interface Task {
  id: string;
  task_code: string;
  project_id: string;
  assigned_employee_id?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  progress: number;
  deadline?: string;
  created_at: string;
  updated_at: string;
  project?: Project;
  assigned_employee?: Employee;
}

export interface Product {
  id: string;
  product_code: string;
  name: string;
  category: string;
  description?: string;
  unit: string;
  price: number;
  stock: number;
  status: UserStatus;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectProduct {
  id: string;
  project_id: string;
  product_id: string;
  quantity: number;
  unit: string;
  unit_cost: number;
  usage_date: string;
  added_by?: string;
  created_at: string;
  product?: Product;
}

export interface Project {
  id: string;
  project_code: string;
  name: string;
  client_id: string;
  service_id?: string;
  description: string;
  priority: ProjectPriority;
  status: ProjectStatus;
  progress: number;
  start_date: string;
  expected_completion_date: string;
  actual_completion_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  client?: Client;
  service?: Service;
  assignments?: ProjectAssignment[];
  tasks?: Task[];
  products_used?: ProjectProduct[];
}

export interface AuditLog {
  id: string;
  actor_id?: string;
  actor_name?: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: Record<string, any>;
  created_at: string;
}

export interface CompanySettings {
  id: string;
  company_name: string;
  app_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  latitude: number;
  longitude: number;
  working_hours: string;
  social_links: {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
  updated_at: string;
}
