import {
  Profile,
  Employee,
  Client,
  Service,
  ServiceRequest,
  ServiceRequestImage,
  RequestStatusHistory,
  Project,
  Task,
  Product,
  ProjectProduct,
  AuditLog,
  CompanySettings,
  RequestStatus,
  ProjectStatus,
  TaskStatus,
  UserStatus,
  UserRole,
} from '@/types/database';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { generateId } from '@/lib/utils';

// ============================================================================
// INITIAL FAST ENGINEERING SOLUTIONS ENTERPRISE DATASET
// ============================================================================

export const INITIAL_COMPANY_SETTINGS: CompanySettings = {
  id: '00000000-0000-0000-0000-000000000001',
  company_name: 'FAST ENGINEERING SOLUTIONS',
  app_name: 'FAST SERVICES',
  description: 'Fast Engineering Solutions is a versatile general contractor founded in 2012, delivering end-to-end construction solutions throughout Pakistan.',
  founded_year: 2012,
  business_type: 'General Contractor / Construction & Engineering Services',
  phone: '+92 300 4545280',
  whatsapp: '+923004545280',
  email: 'fastsales.services@gmail.com',
  website: 'fastengineeringsolutions.com',
  address: 'Al Jannat Main Road, LDA Avenue 1, Raiwind Road, Lahore, Pakistan',
  city: 'Lahore',
  province: 'Punjab',
  country: 'Pakistan',
  working_hours: '24 Hours Service (24/7 Construction & Engineering Support)',
  social_links: {
    pinterest: 'https://www.pinterest.com/fastsalesservices/',
    youtube: 'https://www.youtube.com/@fastengineering8299',
    tiktok: 'https://www.tiktok.com/@fastengineeringsolution',
  },
  updated_at: new Date().toISOString(),
};

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-001',
    name: 'Industrial Electrical & Power Distribution',
    slug: 'industrial-electrical-power-distribution',
    category: 'Electrical Engineering',
    short_description: 'High-voltage wiring, transformer installation, 3-phase switchgear and industrial automation.',
    description: 'Comprehensive industrial and commercial electrical solutions engineered to international standards. From power distribution panels to high-capacity generator synchronization and preventive power audits.',
    price_starting_at: 25000,
    image_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
    features: [
      '3-Phase Substation & Switchgear Installation',
      'Industrial HT/LT Panel Design & Commissioning',
      'Power Factor Correction & Harmonic Analysis',
      'Emergency Backup & Generator Synchronization',
      'Factory Lighting & Cable Tray Traying',
      'Thermal Imaging & Preventative Audits',
    ],
    is_active: true,
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 'srv-002',
    name: 'Commercial HVAC & Mechanical Systems',
    slug: 'commercial-hvac-mechanical-systems',
    category: 'Mechanical Engineering',
    short_description: 'Chiller plants, VRF systems, industrial ventilation, ducting, and cleanroom air systems.',
    description: 'Turnkey HVAC and climate control engineering for corporate towers, manufacturing plants, and hospitals. Energy-efficient cooling, duct fabrication, ventilation systems, and predictive maintenance.',
    price_starting_at: 40000,
    image_url: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Central Chilled Water & VRF Air Conditioning',
      'Industrial Exhaust & Cleanroom Air Filtration',
      'GI / Spiral Duct Fabrication & Insulation',
      'BMS (Building Management System) Integration',
      'Compressor Overhauling & Refrigerant Balancing',
      'Routine Seasonal Maintenance Contracts (SLA)',
    ],
    is_active: true,
    created_at: '2026-01-12T10:00:00Z',
    updated_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 'srv-003',
    name: 'CCTV Surveillance & Security Automation',
    slug: 'cctv-surveillance-security-automation',
    category: 'Security & Automation',
    short_description: 'Enterprise IP cameras, optical fiber backbones, biometric access control, and fire alarms.',
    description: 'State-of-the-art surveillance and physical security systems. High-definition IP monitoring with remote cloud NVRs, perimeter infrared beams, automated barrier gates, and integrated fire suppression.',
    price_starting_at: 18000,
    image_url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80',
    features: [
      'High-Definition IP & PTZ Camera Deployment',
      'Optical Fiber Cable Splicing & Backbone Setup',
      'Biometric Time-Attendance & Turnstiles',
      'Addressable Fire Alarm & Smoke Detection',
      'Central Control Room Video Wall Integration',
      'Mobile Phone App Live Streaming & Alerting',
    ],
    is_active: true,
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 'srv-004',
    name: 'Solar Energy & Solar Plant Installation',
    slug: 'solar-energy-plant-installation',
    category: 'Renewable Energy',
    short_description: 'On-grid, off-grid and hybrid industrial solar plants with net-metering and tier-1 panels.',
    description: 'Turnkey solar EPC (Engineering, Procurement, Construction) solutions. Reduce operational utility costs with high-efficiency tier-1 mono PERC/TopCon modules, European on-grid inverters, and official net metering support.',
    price_starting_at: 150000,
    image_url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Industrial Rooftop & Ground-Mounted Plants (10kW to 1MW)',
      'Tier-1 Certified Monocrystalline Solar Panels',
      '3-Phase On-Grid Inverters with Remote Telemetry',
      'Official DISCO Net-Metering Approval & Licensing',
      'Custom Hot-Dip Galvanized Mounting Structures',
      'Lithium Iron Phosphate (LiFePO4) Battery Storage',
    ],
    is_active: true,
    created_at: '2026-02-01T10:00:00Z',
    updated_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 'srv-005',
    name: 'Industrial Plumbing & Pipe Network Works',
    slug: 'industrial-plumbing-pipe-network',
    category: 'Civil & Mechanical',
    short_description: 'High-pressure hydraulic lines, RO water treatment, fire hydrant systems, and drainage.',
    description: 'Heavy-duty fluid flow and plumbing engineering. PPRC, UPVC, and seamless stainless steel piping for manufacturing industries, commercial plazas, boiler feeds, and dedicated fire sprinkler loops.',
    price_starting_at: 20000,
    image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Fire Hydrant & Automatic Sprinkler Pipe Routing',
      'Industrial RO & Water Demineralization Plants',
      'PPRC / Seamless Steel Pipe TIG Welding',
      'Hydrostatic Pressure Testing & Leak Detection',
      'Heavy Duty Booster Pumps & Variable Frequency Drives',
      'Commercial Drainage & Waste Line Traps',
    ],
    is_active: true,
    created_at: '2026-02-10T10:00:00Z',
    updated_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 'srv-006',
    name: 'Instrumentation & Process Automation',
    slug: 'instrumentation-process-automation',
    category: 'Automation & Control',
    short_description: 'PLC programming, SCADA development, sensors, pneumatic actuators, and calibration.',
    description: 'Precision industrial automation and control. Custom Siemens/Delta PLC panels, HMI touch interfaces, SCADA monitoring networks, RTD temperature sensors, and pneumatic control valves.',
    price_starting_at: 35000,
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Siemens / Delta PLC Architecture & Logic Coding',
      'SCADA / HMI Graphical Interface Design',
      'Pressure, Flow & Temperature Sensor Calibration',
      'Pneumatic & Hydraulic Actuator Maintenance',
      'VFD (Variable Frequency Drive) Parameter Tuning',
      'Emergency Shutdown (ESD) Safety Loops',
    ],
    is_active: true,
    created_at: '2026-02-20T10:00:00Z',
    updated_at: '2026-08-01T10:00:00Z',
  }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-001',
    client_code: 'CLI-2026-001',
    company_name: 'Apex Textile Mills Ltd',
    contact_person: 'Tariq Mehmood',
    phone: '+92 300 8472910',
    whatsapp: '+923008472910',
    email: 'tariq@apextextiles.com.pk',
    address: 'Plot 45, Manga Mandi Industrial Estate, Lahore',
    status: 'ACTIVE',
    notes: 'Key industrial client with annual HVAC and electrical substation maintenance contracts.',
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-08-10T08:00:00Z',
  },
  {
    id: 'cli-002',
    client_code: 'CLI-2026-002',
    company_name: 'National Logistics & Warehousing',
    contact_person: 'Bilal Farooq',
    phone: '+92 321 9548231',
    whatsapp: '+923219548231',
    email: 'operations@nlwlogistics.com',
    address: 'Warehouse Hub 3, M-2 Motorway Interchange, Rawalpindi',
    status: 'ACTIVE',
    notes: 'High priority solar plant installation and multi-camera optical surveillance contract.',
    created_at: '2026-02-01T09:30:00Z',
    updated_at: '2026-08-12T09:30:00Z',
  },
  {
    id: 'cli-003',
    client_code: 'CLI-2026-003',
    company_name: 'Grand Horizon Medical Complex',
    contact_person: 'Dr. Shahzad Akbar',
    phone: '+92 333 4128905',
    whatsapp: '+923334128905',
    email: 'facility@grandhorizonhealth.com',
    address: 'Main Boulevard, Gulberg III, Lahore',
    status: 'ACTIVE',
    notes: 'Cleanroom ventilation, emergency backup synchronization, and medical gas pipeline monitoring.',
    created_at: '2026-03-10T11:00:00Z',
    updated_at: '2026-08-14T11:00:00Z',
  },
  {
    id: 'cli-004',
    client_code: 'CLI-2026-004',
    company_name: 'Crown Packaging Industries',
    contact_person: 'Kamran Siddiqui',
    phone: '+92 301 5689423',
    whatsapp: '+923015689423',
    email: 'admin@crownpackaging.pk',
    address: 'Sector I-9/2, Industrial Area, Islamabad',
    status: 'ACTIVE',
    notes: 'PLC machinery automation and power factor correction project.',
    created_at: '2026-04-05T14:20:00Z',
    updated_at: '2026-08-15T14:20:00Z',
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-001',
    employee_code: 'EMP-001',
    department: 'Electrical Engineering',
    position: 'Lead Electrical Engineer',
    joining_date: '2025-06-01',
    status: 'ACTIVE',
    created_at: '2025-06-01T08:00:00Z',
    updated_at: '2026-08-01T08:00:00Z',
    profile: {
      id: 'emp-001',
      full_name: 'Engr. Ahmed Raza',
      phone: '+92 300 5551122',
      email: 'ahmed.raza@fastengineeringsolutions.com',
      role: 'ADMIN',
      status: 'ACTIVE',
      created_at: '2025-06-01T08:00:00Z',
      updated_at: '2026-08-01T08:00:00Z',
    }
  },
  {
    id: 'emp-002',
    employee_code: 'EMP-002',
    department: 'Mechanical & HVAC',
    position: 'Senior HVAC Systems Engineer',
    joining_date: '2025-08-15',
    status: 'ACTIVE',
    created_at: '2025-08-15T08:00:00Z',
    updated_at: '2026-08-01T08:00:00Z',
    profile: {
      id: 'emp-002',
      full_name: 'Engr. Ali Hassan',
      phone: '+92 301 6662233',
      email: 'ali.hassan@fastengineeringsolutions.com',
      role: 'MANAGER',
      status: 'ACTIVE',
      created_at: '2025-08-15T08:00:00Z',
      updated_at: '2026-08-01T08:00:00Z',
    }
  },
  {
    id: 'emp-003',
    employee_code: 'EMP-003',
    department: 'Solar & Renewable',
    position: 'Solar PV Site Specialist',
    joining_date: '2026-01-10',
    status: 'ACTIVE',
    created_at: '2026-01-10T08:00:00Z',
    updated_at: '2026-08-01T08:00:00Z',
    profile: {
      id: 'emp-003',
      full_name: 'Usman Tariq',
      phone: '+92 302 7773344',
      email: 'usman.tariq@fastengineeringsolutions.com',
      role: 'EMPLOYEE',
      status: 'ACTIVE',
      created_at: '2026-01-10T08:00:00Z',
      updated_at: '2026-08-01T08:00:00Z',
    }
  },
  {
    id: 'emp-004',
    employee_code: 'EMP-004',
    department: 'Automation & Security',
    position: 'Automation & Network Specialist',
    joining_date: '2026-03-01',
    status: 'ACTIVE',
    created_at: '2026-03-01T08:00:00Z',
    updated_at: '2026-08-01T08:00:00Z',
    profile: {
      id: 'emp-004',
      full_name: 'Hamza Malik',
      phone: '+92 303 8884455',
      email: 'hamza.malik@fastengineeringsolutions.com',
      role: 'EMPLOYEE',
      status: 'ACTIVE',
      created_at: '2026-03-01T08:00:00Z',
      updated_at: '2026-08-01T08:00:00Z',
    }
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prd-001',
    product_code: 'PRD-CBL-01',
    name: '4-Core 16mm² XLPE Copper Armoured Cable',
    category: 'Electrical Wiring',
    description: 'Heavy duty Pakistan Cables grade underground power distribution cable.',
    unit: 'meters',
    price: 1850,
    stock: 2400,
    status: 'ACTIVE',
    created_at: '2026-01-10T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
  },
  {
    id: 'prd-002',
    product_code: 'PRD-SW-02',
    name: 'Schneider 3-Phase 100A MCCB Circuit Breaker',
    category: 'Switchgear',
    description: 'High breaking capacity industrial molded case circuit breaker.',
    unit: 'pieces',
    price: 24500,
    stock: 35,
    status: 'ACTIVE',
    created_at: '2026-01-15T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
  },
  {
    id: 'prd-003',
    product_code: 'PRD-SLR-03',
    name: 'Longi 585W Mono PERC Tier-1 Solar Module',
    category: 'Solar Hardware',
    description: 'High efficiency bifacial photovoltaic solar module with 25-year linear warranty.',
    unit: 'panels',
    price: 22000,
    stock: 320,
    status: 'ACTIVE',
    created_at: '2026-02-01T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
  },
  {
    id: 'prd-004',
    product_code: 'PRD-CAM-04',
    name: 'Hikvision 4MP DarkFighter IP Dome Camera',
    category: 'Surveillance & CCTV',
    description: 'PoE optical zoom outdoor weather-proof camera with smart human detection.',
    unit: 'pieces',
    price: 14200,
    stock: 90,
    status: 'ACTIVE',
    created_at: '2026-02-15T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
  },
  {
    id: 'prd-005',
    product_code: 'PRD-PIP-05',
    name: 'PPRC PN-20 Heavy Duty 50mm Industrial Pipe',
    category: 'Plumbing & Piping',
    description: 'Thermal resistant high pressure PPRC hot/cold fluid distribution pipes.',
    unit: 'lengths (4m)',
    price: 3600,
    stock: 450,
    status: 'ACTIVE',
    created_at: '2026-03-01T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'prj-001',
    project_code: 'PRJ-2026-001',
    name: 'Apex Mills 100kW Rooftop Solar & Power Synchronization',
    client_id: 'cli-001',
    service_id: 'srv-004',
    description: 'Complete turnkey 100kW on-grid solar plant installation, net-metering synchronization with 11kV substation.',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    progress: 75,
    start_date: '2026-07-01',
    expected_completion_date: '2026-08-30',
    notes: 'Structure mounting and string inverter cabling complete. Final net-metering inspection scheduled.',
    created_at: '2026-07-01T08:00:00Z',
    updated_at: '2026-08-18T10:00:00Z',
  },
  {
    id: 'prj-002',
    project_code: 'PRJ-2026-002',
    name: 'National Logistics CCTV & Biometric Turnstile Security',
    client_id: 'cli-002',
    service_id: 'srv-003',
    description: 'Deployment of 64 IP cameras across 3 warehouses, optical fiber trunking, and RFID automatic entry turnstiles.',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    progress: 90,
    start_date: '2026-07-15',
    expected_completion_date: '2026-08-25',
    notes: 'All cameras installed and streaming to central NVR. Turnstile gate testing in progress.',
    created_at: '2026-07-15T09:00:00Z',
    updated_at: '2026-08-20T12:00:00Z',
  },
  {
    id: 'prj-003',
    project_code: 'PRJ-2026-003',
    name: 'Grand Horizon Hospital HVAC Cleanroom Chiller Overhaul',
    client_id: 'cli-003',
    service_id: 'srv-002',
    description: 'Comprehensive maintenance, compressor descaling, HEPA filter replacements, and chilled water balancing.',
    priority: 'URGENT',
    status: 'COMPLETED',
    progress: 100,
    start_date: '2026-08-01',
    expected_completion_date: '2026-08-18',
    actual_completion_date: '2026-08-17',
    notes: 'Commissioning successful. Signed off by Hospital Facility Director.',
    created_at: '2026-08-01T10:00:00Z',
    updated_at: '2026-08-17T16:00:00Z',
  },
  {
    id: 'prj-004',
    project_code: 'PRJ-2026-004',
    name: 'Crown Packaging PLC Automated Conveyor Control Panel',
    client_id: 'cli-004',
    service_id: 'srv-006',
    description: 'Siemens S7-1200 PLC panel fabrication, VFD synchronizing for high speed packaging lines, and HMI programming.',
    priority: 'HIGH',
    status: 'PLANNED',
    progress: 20,
    start_date: '2026-08-10',
    expected_completion_date: '2026-09-15',
    notes: 'Schematic drawings approved. Component assembly starting in workshop.',
    created_at: '2026-08-10T11:00:00Z',
    updated_at: '2026-08-19T09:00:00Z',
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'tsk-001',
    task_code: 'TSK-101',
    project_id: 'prj-001',
    assigned_employee_id: 'emp-003',
    title: 'DC Cable Stringing & Combiner Box Terminations',
    description: 'Route solar DC cables into IP67 combiner boxes and test open-circuit Voc voltage.',
    status: 'IN_PROGRESS',
    progress: 75,
    deadline: '2026-08-24',
    created_at: '2026-08-01T08:00:00Z',
    updated_at: '2026-08-20T10:00:00Z',
  },
  {
    id: 'tsk-002',
    task_code: 'TSK-102',
    project_id: 'prj-001',
    assigned_employee_id: 'emp-001',
    title: 'Main Inverter AC Grid Interconnection & Breaker Setup',
    description: 'Connect 100kW Sungrow Inverter to LT main panel with 100A MCCB and surge protection.',
    status: 'IN_PROGRESS',
    progress: 70,
    deadline: '2026-08-26',
    created_at: '2026-08-05T09:00:00Z',
    updated_at: '2026-08-21T11:00:00Z',
  },
  {
    id: 'tsk-003',
    task_code: 'TSK-103',
    project_id: 'prj-002',
    assigned_employee_id: 'emp-004',
    title: 'Warehouse Optical Fiber Splicing & Patch Panel Labelling',
    description: 'Splice 12-core single-mode fiber connecting Hub 1, 2, and 3 server racks.',
    status: 'COMPLETED',
    progress: 100,
    deadline: '2026-08-18',
    created_at: '2026-08-02T08:00:00Z',
    updated_at: '2026-08-18T15:00:00Z',
  },
  {
    id: 'tsk-004',
    task_code: 'TSK-104',
    project_id: 'prj-003',
    assigned_employee_id: 'emp-002',
    title: 'Chiller Compressor Oil Replacement & Pressure Balancing',
    description: 'Drain refrigeration oil, replace suction filters, and balance R134a operating head pressure.',
    status: 'COMPLETED',
    progress: 100,
    deadline: '2026-08-16',
    created_at: '2026-08-03T10:00:00Z',
    updated_at: '2026-08-16T17:00:00Z',
  },
  {
    id: 'tsk-005',
    task_code: 'TSK-105',
    project_id: 'prj-004',
    assigned_employee_id: 'emp-004',
    title: 'Siemens PLC Ladder Logic Programming & Interlock Coding',
    description: 'Write packaging conveyor sequence code with emergency stop safety routines.',
    status: 'IN_PROGRESS',
    progress: 25,
    deadline: '2026-08-30',
    created_at: '2026-08-12T08:00:00Z',
    updated_at: '2026-08-20T14:00:00Z',
  }
];

export const INITIAL_PROJECT_PRODUCTS: ProjectProduct[] = [
  {
    id: 'pp-001',
    project_id: 'prj-001',
    product_id: 'prd-003',
    quantity: 172,
    unit: 'panels',
    unit_cost: 22000,
    usage_date: '2026-08-05',
    added_by: 'emp-001',
    created_at: '2026-08-05T09:00:00Z',
  },
  {
    id: 'pp-002',
    project_id: 'prj-001',
    product_id: 'prd-001',
    quantity: 650,
    unit: 'meters',
    unit_cost: 1850,
    usage_date: '2026-08-10',
    added_by: 'emp-003',
    created_at: '2026-08-10T11:00:00Z',
  },
  {
    id: 'pp-003',
    project_id: 'prj-002',
    product_id: 'prd-004',
    quantity: 64,
    unit: 'pieces',
    unit_cost: 14200,
    usage_date: '2026-08-08',
    added_by: 'emp-004',
    created_at: '2026-08-08T14:00:00Z',
  },
  {
    id: 'pp-004',
    project_id: 'prj-003',
    product_id: 'prd-005',
    quantity: 20,
    unit: 'lengths (4m)',
    unit_cost: 3600,
    usage_date: '2026-08-12',
    added_by: 'emp-002',
    created_at: '2026-08-12T16:00:00Z',
  }
];

export const INITIAL_SERVICE_REQUESTS: ServiceRequest[] = [
  {
    id: 'req-001',
    request_id: 'FS-2026-000101',
    service_id: 'srv-001',
    client_id: 'cli-001',
    customer_name: 'Tariq Mehmood (Apex Textiles)',
    customer_phone: '+92 300 8472910',
    customer_email: 'tariq@apextextiles.com.pk',
    description: 'Phase 2 weaving hall main distribution board experiencing occasional tripping under 400A peak load. Need thermal scan and load balancing.',
    preferred_date: '2026-08-25',
    preferred_time: '10:00 AM',
    location_address: 'Plot 45, Manga Mandi Industrial Estate, Lahore',
    latitude: 31.3125,
    longitude: 74.1568,
    status: 'IN_PROGRESS',
    admin_notes: 'Assigned to Engr. Ahmed Raza. Thermal camera kit prepared.',
    created_at: '2026-08-15T09:30:00Z',
    updated_at: '2026-08-19T10:00:00Z',
    images: [
      {
        id: 'img-101',
        request_id: 'req-001',
        image_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
        file_name: 'distribution-breaker-panel.jpg',
        created_at: '2026-08-15T09:32:00Z',
      }
    ],
    history: [
      {
        id: 'hist-101',
        request_id: 'req-001',
        status: 'PENDING',
        notes: 'Request submitted online via portal.',
        created_at: '2026-08-15T09:30:00Z',
      },
      {
        id: 'hist-102',
        request_id: 'req-001',
        status: 'ACCEPTED',
        notes: 'Technical team reviewed requirements and confirmed appointment.',
        created_at: '2026-08-16T11:00:00Z',
      },
      {
        id: 'hist-103',
        request_id: 'req-001',
        status: 'IN_PROGRESS',
        notes: 'Engr. Ahmed on-site for inspection.',
        created_at: '2026-08-19T10:00:00Z',
      }
    ]
  },
  {
    id: 'req-002',
    request_id: 'FS-2026-000102',
    service_id: 'srv-004',
    customer_name: 'Chaudhry Zubair',
    customer_phone: '+92 333 7894561',
    customer_email: 'zubair.farms@gmail.com',
    description: 'Need site survey for 35kW agricultural solar tube-well installation with variable frequency inverter drive.',
    preferred_date: '2026-08-27',
    preferred_time: '02:00 PM',
    location_address: 'Mouza Rakh, Sheikhupura Road, Punjab',
    latitude: 31.7131,
    longitude: 73.9850,
    status: 'REVIEWING',
    admin_notes: 'Feasibility survey scheduled for upcoming week.',
    created_at: '2026-08-18T14:15:00Z',
    updated_at: '2026-08-18T16:00:00Z',
    images: [],
    history: [
      {
        id: 'hist-104',
        request_id: 'req-002',
        status: 'PENDING',
        notes: 'Request submitted online.',
        created_at: '2026-08-18T14:15:00Z',
      },
      {
        id: 'hist-105',
        request_id: 'req-002',
        status: 'REVIEWING',
        notes: 'Engineering team assessing solar irradiation & borehole specifications.',
        created_at: '2026-08-18T16:00:00Z',
      }
    ]
  },
  {
    id: 'req-003',
    request_id: 'FS-2026-000103',
    service_id: 'srv-003',
    customer_name: 'Faizan Shafi (Apex Plaza)',
    customer_phone: '+92 321 4455667',
    customer_email: 'faizan@apexplaza.com',
    description: 'Plaza basement CCTV camera 4 & 7 video signal loss. Suspected mouse damage to CAT-6 optical patch cable.',
    preferred_date: '2026-08-23',
    preferred_time: '11:30 AM',
    location_address: 'Commercial Market, Block D, Model Town, Lahore',
    latitude: 31.4826,
    longitude: 74.3219,
    status: 'PENDING',
    admin_notes: 'Urgent ticket.',
    created_at: '2026-08-21T08:20:00Z',
    updated_at: '2026-08-21T08:20:00Z',
    images: [],
    history: [
      {
        id: 'hist-106',
        request_id: 'req-003',
        status: 'PENDING',
        notes: 'Submitted by client.',
        created_at: '2026-08-21T08:20:00Z',
      }
    ]
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-001',
    actor_name: 'Engr. Ahmed Raza (Admin)',
    action: 'STATUS_UPDATED',
    entity_type: 'PROJECT',
    entity_id: 'prj-003',
    details: { project_name: 'Grand Horizon Hospital HVAC Cleanroom Chiller Overhaul', new_status: 'COMPLETED', progress: 100 },
    created_at: '2026-08-17T16:00:00Z',
  },
  {
    id: 'log-002',
    actor_name: 'Engr. Ali Hassan (Manager)',
    action: 'PRODUCT_CONSUMED',
    entity_type: 'PROJECT_PRODUCT',
    entity_id: 'pp-004',
    details: { project_name: 'Grand Horizon Hospital HVAC', product: 'PPRC PN-20 Heavy Duty 50mm Pipe', quantity: 20 },
    created_at: '2026-08-12T16:00:00Z',
  },
  {
    id: 'log-003',
    actor_name: 'Usman Tariq (Employee)',
    action: 'TASK_PROGRESS_UPDATED',
    entity_type: 'TASK',
    entity_id: 'tsk-001',
    details: { task: 'DC Cable Stringing & Combiner Box Terminations', progress: 75, status: 'IN_PROGRESS' },
    created_at: '2026-08-20T10:00:00Z',
  },
  {
    id: 'log-004',
    actor_name: 'Engr. Ahmed Raza (Admin)',
    action: 'CLIENT_CREATED',
    entity_type: 'CLIENT',
    entity_id: 'cli-004',
    details: { company_name: 'Crown Packaging Industries', contact_person: 'Kamran Siddiqui' },
    created_at: '2026-04-05T14:20:00Z',
  }
];

// ============================================================================
// SINGLE SOURCE OF TRUTH LOCAL STORAGE MEMORY STORE
// ============================================================================

class DataStore {
  private companySettings: CompanySettings = { ...INITIAL_COMPANY_SETTINGS };
  private services: Service[] = [...INITIAL_SERVICES];
  private clients: Client[] = [...INITIAL_CLIENTS];
  private employees: Employee[] = [...INITIAL_EMPLOYEES];
  private products: Product[] = [...INITIAL_PRODUCTS];
  private projects: Project[] = [...INITIAL_PROJECTS];
  private tasks: Task[] = [...INITIAL_TASKS];
  private projectProducts: ProjectProduct[] = [...INITIAL_PROJECT_PRODUCTS];
  private serviceRequests: ServiceRequest[] = [...INITIAL_SERVICE_REQUESTS];
  private auditLogs: AuditLog[] = [...INITIAL_AUDIT_LOGS];

  // Helper: Persist to browser localStorage if in client
  private syncToLocalStorage() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('fast_services_db_v1', JSON.stringify({
          companySettings: this.companySettings,
          services: this.services,
          clients: this.clients,
          employees: this.employees,
          products: this.products,
          projects: this.projects,
          tasks: this.tasks,
          projectProducts: this.projectProducts,
          serviceRequests: this.serviceRequests,
          auditLogs: this.auditLogs,
        }));
      } catch (e) {
        console.warn('localStorage sync skipped', e);
      }
    }
  }

  public loadFromLocalStorage() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('fast_services_db_v1');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.companySettings) this.companySettings = parsed.companySettings;
          if (parsed.services) this.services = parsed.services;
          if (parsed.clients) this.clients = parsed.clients;
          if (parsed.employees) this.employees = parsed.employees;
          if (parsed.products) this.products = parsed.products;
          if (parsed.projects) this.projects = parsed.projects;
          if (parsed.tasks) this.tasks = parsed.tasks;
          if (parsed.projectProducts) this.projectProducts = parsed.projectProducts;
          if (parsed.serviceRequests) this.serviceRequests = parsed.serviceRequests;
          if (parsed.auditLogs) this.auditLogs = parsed.auditLogs;
        }
      } catch (e) {
        console.warn('Error loading localStorage', e);
      }
    }
  }

  // --- Company Settings ---
  async getCompanySettings(): Promise<CompanySettings> {
    this.loadFromLocalStorage();
    return { ...this.companySettings };
  }

  async updateCompanySettings(data: Partial<CompanySettings>, actorName = 'Admin'): Promise<CompanySettings> {
    this.loadFromLocalStorage();
    this.companySettings = {
      ...this.companySettings,
      ...data,
      updated_at: new Date().toISOString(),
    };
    this.addAuditLog(actorName, 'UPDATED', 'COMPANY_SETTINGS', this.companySettings.id, data);
    this.syncToLocalStorage();
    return { ...this.companySettings };
  }

  // --- Services ---
  async getServices(activeOnly = false): Promise<Service[]> {
    this.loadFromLocalStorage();
    return this.services.filter((s) => !activeOnly || s.is_active);
  }

  async getServiceBySlug(slug: string): Promise<Service | null> {
    this.loadFromLocalStorage();
    const service = this.services.find((s) => s.slug === slug);
    return service ? { ...service } : null;
  }

  async getServiceById(id: string): Promise<Service | null> {
    this.loadFromLocalStorage();
    const service = this.services.find((s) => s.id === id);
    return service ? { ...service } : null;
  }

  async createService(serviceData: Omit<Service, 'id' | 'created_at' | 'updated_at'>, actorName = 'Admin'): Promise<Service> {
    this.loadFromLocalStorage();
    const newService: Service = {
      ...serviceData,
      id: `srv-${Date.now().toString().slice(-4)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.services.push(newService);
    this.addAuditLog(actorName, 'CREATED', 'SERVICE', newService.id, { name: newService.name, category: newService.category });
    this.syncToLocalStorage();
    return newService;
  }

  async updateService(id: string, updates: Partial<Service>, actorName = 'Admin'): Promise<Service | null> {
    this.loadFromLocalStorage();
    const index = this.services.findIndex((s) => s.id === id);
    if (index === -1) return null;
    this.services[index] = {
      ...this.services[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.addAuditLog(actorName, 'UPDATED', 'SERVICE', id, updates);
    this.syncToLocalStorage();
    return this.services[index];
  }

  async deleteService(id: string, actorName = 'Admin'): Promise<boolean> {
    this.loadFromLocalStorage();
    const service = this.services.find((s) => s.id === id);
    if (!service) return false;
    // Safe toggle to inactive rather than breaking foreign references
    service.is_active = false;
    service.updated_at = new Date().toISOString();
    this.addAuditLog(actorName, 'DEACTIVATED', 'SERVICE', id, { name: service.name });
    this.syncToLocalStorage();
    return true;
  }

  // --- Clients ---
  async getClients(): Promise<Client[]> {
    this.loadFromLocalStorage();
    return [...this.clients];
  }

  async getClientById(id: string): Promise<Client | null> {
    this.loadFromLocalStorage();
    const client = this.clients.find((c) => c.id === id);
    return client ? { ...client } : null;
  }

  async createClient(clientData: Omit<Client, 'id' | 'client_code' | 'created_at' | 'updated_at'>, actorName = 'Admin'): Promise<Client> {
    this.loadFromLocalStorage();
    const count = this.clients.length + 1;
    const year = new Date().getFullYear();
    const newClient: Client = {
      ...clientData,
      id: `cli-${Date.now().toString().slice(-4)}`,
      client_code: `CLI-${year}-${count.toString().padStart(3, '0')}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.clients.push(newClient);
    this.addAuditLog(actorName, 'CREATED', 'CLIENT', newClient.id, { company: newClient.company_name, person: newClient.contact_person });
    this.syncToLocalStorage();
    return newClient;
  }

  async updateClient(id: string, updates: Partial<Client>, actorName = 'Admin'): Promise<Client | null> {
    this.loadFromLocalStorage();
    const index = this.clients.findIndex((c) => c.id === id);
    if (index === -1) return null;
    this.clients[index] = {
      ...this.clients[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.addAuditLog(actorName, 'UPDATED', 'CLIENT', id, updates);
    this.syncToLocalStorage();
    return this.clients[index];
  }

  async deactivateClient(id: string, actorName = 'Admin'): Promise<boolean> {
    this.loadFromLocalStorage();
    const client = this.clients.find((c) => c.id === id);
    if (!client) return false;
    client.status = client.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    client.updated_at = new Date().toISOString();
    this.addAuditLog(actorName, client.status === 'ACTIVE' ? 'ACTIVATED' : 'DEACTIVATED', 'CLIENT', id, { company: client.company_name });
    this.syncToLocalStorage();
    return true;
  }

  async deleteClient(id: string, actorName = 'Admin'): Promise<boolean> {
    this.loadFromLocalStorage();
    const index = this.clients.findIndex((c) => c.id === id);
    if (index === -1) return false;
    const client = this.clients[index];
    this.clients.splice(index, 1);
    this.addAuditLog(actorName, 'DELETED', 'CLIENT', id, { company: client.company_name });
    this.syncToLocalStorage();
    return true;
  }

  // --- Employees ---
  async getEmployees(): Promise<Employee[]> {
    this.loadFromLocalStorage();
    return [...this.employees];
  }

  async getEmployeeById(id: string): Promise<Employee | null> {
    this.loadFromLocalStorage();
    const emp = this.employees.find((e) => e.id === id);
    return emp ? { ...emp } : null;
  }

  async deleteEmployee(id: string, actorName = 'Admin'): Promise<boolean> {
    this.loadFromLocalStorage();
    const index = this.employees.findIndex((e) => e.id === id);
    if (index === -1) return false;
    const emp = this.employees[index];
    this.employees.splice(index, 1);
    this.addAuditLog(actorName, 'DELETED', 'EMPLOYEE', id, { name: emp.profile?.full_name });
    this.syncToLocalStorage();
    return true;
  }

  async createEmployee(
    data: {
      full_name: string;
      email: string;
      phone: string;
      department: string;
      position: string;
      role: UserRole;
      joining_date?: string;
    },
    actorName = 'Admin'
  ): Promise<Employee> {
    this.loadFromLocalStorage();
    const id = `emp-${Date.now().toString().slice(-4)}`;
    const empCount = this.employees.length + 1;
    const employeeCode = `EMP-${empCount.toString().padStart(3, '0')}`;
    const now = new Date().toISOString();

    const profile: Profile = {
      id,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      status: 'ACTIVE',
      created_at: now,
      updated_at: now,
    };

    const newEmp: Employee = {
      id,
      employee_code: employeeCode,
      department: data.department,
      position: data.position,
      joining_date: data.joining_date || new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
      created_at: now,
      updated_at: now,
      profile,
    };

    this.employees.push(newEmp);
    this.addAuditLog(actorName, 'CREATED', 'EMPLOYEE', id, { code: employeeCode, name: data.full_name, role: data.role });
    this.syncToLocalStorage();
    return newEmp;
  }

  async updateEmployee(id: string, updates: Partial<Employee & { full_name?: string; email?: string; phone?: string; role?: UserRole }>, actorName = 'Admin'): Promise<Employee | null> {
    this.loadFromLocalStorage();
    const index = this.employees.findIndex((e) => e.id === id);
    if (index === -1) return null;
    
    const emp = this.employees[index];
    if (updates.department) emp.department = updates.department;
    if (updates.position) emp.position = updates.position;
    if (updates.status) emp.status = updates.status;
    if (updates.joining_date) emp.joining_date = updates.joining_date;

    if (emp.profile) {
      if (updates.full_name) emp.profile.full_name = updates.full_name;
      if (updates.email) emp.profile.email = updates.email;
      if (updates.phone) emp.profile.phone = updates.phone;
      if (updates.role) emp.profile.role = updates.role;
      if (updates.status) emp.profile.status = updates.status;
      emp.profile.updated_at = new Date().toISOString();
    }

    emp.updated_at = new Date().toISOString();
    this.addAuditLog(actorName, 'UPDATED', 'EMPLOYEE', id, updates);
    this.syncToLocalStorage();
    return emp;
  }

  async deactivateEmployee(id: string, actorName = 'Admin'): Promise<boolean> {
    this.loadFromLocalStorage();
    const emp = this.employees.find((e) => e.id === id);
    if (!emp) return false;
    emp.status = emp.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    if (emp.profile) emp.profile.status = emp.status;
    emp.updated_at = new Date().toISOString();
    this.addAuditLog(actorName, emp.status === 'ACTIVE' ? 'ACTIVATED' : 'DEACTIVATED', 'EMPLOYEE', id, { name: emp.profile?.full_name });
    this.syncToLocalStorage();
    return true;
  }

  async resetEmployeePassword(id: string, actorName = 'Admin'): Promise<{ success: boolean; message: string }> {
    this.loadFromLocalStorage();
    const emp = this.employees.find((e) => e.id === id);
    if (!emp) return { success: false, message: 'Employee not found' };
    
    this.addAuditLog(actorName, 'PASSWORD_RESET_TRIGGERED', 'EMPLOYEE', id, {
      email: emp.profile?.email,
      target_employee: emp.profile?.full_name,
    });
    this.syncToLocalStorage();
    return {
      success: true,
      message: `Password reset verification instructions dispatched to ${emp.profile?.email}. Passwords remain secure and hashed at all times.`,
    };
  }

  // --- Projects ---
  async getProjects(filters?: { month?: number; year?: number; status?: ProjectStatus; clientId?: string; employeeId?: string }): Promise<Project[]> {
    this.loadFromLocalStorage();
    let result = [...this.projects];

    if (filters?.year) {
      result = result.filter((p) => {
        const start = new Date(p.start_date);
        return start.getFullYear() === filters.year;
      });
    }

    if (filters?.month !== undefined && filters?.month !== null && filters?.month >= 0) {
      result = result.filter((p) => {
        const start = new Date(p.start_date);
        return start.getMonth() === filters.month;
      });
    }

    if (filters?.status) {
      result = result.filter((p) => p.status === filters.status);
    }

    if (filters?.clientId) {
      result = result.filter((p) => p.client_id === filters.clientId);
    }

    if (filters?.employeeId) {
      const taskProjectIds = this.tasks
        .filter((t) => t.assigned_employee_id === filters.employeeId)
        .map((t) => t.project_id);
      result = result.filter((p) => taskProjectIds.includes(p.id));
    }

    // Attach hydrated relationships
    return result.map((p) => ({
      ...p,
      client: this.clients.find((c) => c.id === p.client_id),
      service: this.services.find((s) => s.id === p.service_id),
      tasks: this.tasks.filter((t) => t.project_id === p.id),
      products_used: this.projectProducts
        .filter((pp) => pp.project_id === p.id)
        .map((pp) => ({
          ...pp,
          product: this.products.find((prod) => prod.id === pp.product_id),
        })),
    }));
  }

  async getProjectById(id: string): Promise<Project | null> {
    const list = await this.getProjects();
    return list.find((p) => p.id === id) || null;
  }

  async createProject(projectData: Omit<Project, 'id' | 'project_code' | 'created_at' | 'updated_at'>, actorName = 'Admin'): Promise<Project> {
    this.loadFromLocalStorage();
    const count = this.projects.length + 1;
    const year = new Date().getFullYear();
    const newProject: Project = {
      ...projectData,
      id: `prj-${Date.now().toString().slice(-4)}`,
      project_code: `PRJ-${year}-${count.toString().padStart(3, '0')}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.projects.push(newProject);
    this.addAuditLog(actorName, 'CREATED', 'PROJECT', newProject.id, { name: newProject.name, code: newProject.project_code });
    this.syncToLocalStorage();
    return newProject;
  }

  async updateProject(id: string, updates: Partial<Project>, actorName = 'Admin'): Promise<Project | null> {
    this.loadFromLocalStorage();
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.projects[index] = {
      ...this.projects[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.addAuditLog(actorName, 'UPDATED', 'PROJECT', id, updates);
    this.syncToLocalStorage();
    return this.projects[index];
  }

  async deleteProject(id: string, actorName = 'Admin'): Promise<boolean> {
    this.loadFromLocalStorage();
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) return false;
    const proj = this.projects[index];
    this.projects.splice(index, 1);
    this.tasks = this.tasks.filter((t) => t.project_id !== id);
    this.projectProducts = this.projectProducts.filter((pp) => pp.project_id !== id);
    this.addAuditLog(actorName, 'DELETED', 'PROJECT', id, { name: proj.name });
    this.syncToLocalStorage();
    return true;
  }

  // --- Tasks ---
  async getTasks(filters?: { employeeId?: string; projectId?: string; status?: TaskStatus }): Promise<Task[]> {
    this.loadFromLocalStorage();
    let result = [...this.tasks];

    if (filters?.employeeId) {
      result = result.filter((t) => t.assigned_employee_id === filters.employeeId);
    }
    if (filters?.projectId) {
      result = result.filter((t) => t.project_id === filters.projectId);
    }
    if (filters?.status) {
      result = result.filter((t) => t.status === filters.status);
    }

    return result.map((t) => ({
      ...t,
      project: this.projects.find((p) => p.id === t.project_id),
      assigned_employee: this.employees.find((e) => e.id === t.assigned_employee_id),
    }));
  }

  async createTask(taskData: Omit<Task, 'id' | 'task_code' | 'created_at' | 'updated_at'>, actorName = 'Admin'): Promise<Task> {
    this.loadFromLocalStorage();
    const count = this.tasks.length + 1;
    const newTask: Task = {
      ...taskData,
      id: `tsk-${Date.now().toString().slice(-4)}`,
      task_code: `TSK-${count.toString().padStart(3, '0')}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.tasks.push(newTask);
    this.addAuditLog(actorName, 'CREATED', 'TASK', newTask.id, { title: newTask.title, project_id: newTask.project_id });
    this.syncToLocalStorage();
    return newTask;
  }

  async deleteTask(id: string, actorName = 'Admin'): Promise<boolean> {
    this.loadFromLocalStorage();
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;
    const task = this.tasks[index];
    this.tasks.splice(index, 1);
    this.addAuditLog(actorName, 'DELETED', 'TASK', id, { title: task.title });
    this.syncToLocalStorage();
    return true;
  }

  async updateTaskProgress(id: string, progress: number, status: TaskStatus, actorName = 'Staff'): Promise<Task | null> {
    this.loadFromLocalStorage();
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return null;

    task.progress = Math.min(100, Math.max(0, progress));
    task.status = status;
    task.updated_at = new Date().toISOString();

    // Auto update overall project progress
    const projectTasks = this.tasks.filter((t) => t.project_id === task.project_id);
    if (projectTasks.length > 0) {
      const avgProgress = Math.round(
        projectTasks.reduce((acc, curr) => acc + curr.progress, 0) / projectTasks.length
      );
      const project = this.projects.find((p) => p.id === task.project_id);
      if (project) {
        project.progress = avgProgress;
        if (avgProgress === 100) project.status = 'COMPLETED';
        else if (project.status === 'PLANNED' && avgProgress > 0) project.status = 'IN_PROGRESS';
        project.updated_at = new Date().toISOString();
      }
    }

    this.addAuditLog(actorName, 'TASK_PROGRESS_UPDATED', 'TASK', id, { progress, status, title: task.title });
    this.syncToLocalStorage();
    return task;
  }

  // --- Products & Inventory ---
  async getProducts(): Promise<Product[]> {
    this.loadFromLocalStorage();
    return [...this.products];
  }

  async createProduct(productData: Omit<Product, 'id' | 'product_code' | 'created_at' | 'updated_at'>, actorName = 'Admin'): Promise<Product> {
    this.loadFromLocalStorage();
    const count = this.products.length + 1;
    const newProduct: Product = {
      ...productData,
      id: `prd-${Date.now().toString().slice(-4)}`,
      product_code: `PRD-${count.toString().padStart(3, '0')}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.products.push(newProduct);
    this.addAuditLog(actorName, 'CREATED', 'PRODUCT', newProduct.id, { name: newProduct.name, code: newProduct.product_code });
    this.syncToLocalStorage();
    return newProduct;
  }

  async updateProduct(id: string, updates: Partial<Product>, actorName = 'Admin'): Promise<Product | null> {
    this.loadFromLocalStorage();
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.products[index] = {
      ...this.products[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.addAuditLog(actorName, 'UPDATED', 'PRODUCT', id, updates);
    this.syncToLocalStorage();
    return this.products[index];
  }

  async deleteProduct(id: string, actorName = 'Admin'): Promise<boolean> {
    this.loadFromLocalStorage();
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    const prod = this.products[index];
    this.products.splice(index, 1);
    this.addAuditLog(actorName, 'DELETED', 'PRODUCT', id, { name: prod.name });
    this.syncToLocalStorage();
    return true;
  }

  async addProductUsage(data: { projectId: string; productId: string; quantity: number; actorName?: string; actorId?: string }): Promise<ProjectProduct | null> {
    this.loadFromLocalStorage();
    const product = this.products.find((p) => p.id === data.productId);
    if (!product) return null;

    // Deduct stock safely
    product.stock = Math.max(0, product.stock - data.quantity);
    product.updated_at = new Date().toISOString();

    const newUsage: ProjectProduct = {
      id: `pp-${Date.now().toString().slice(-4)}`,
      project_id: data.projectId,
      product_id: data.productId,
      quantity: data.quantity,
      unit: product.unit,
      unit_cost: product.price,
      usage_date: new Date().toISOString().split('T')[0],
      added_by: data.actorId || 'emp-001',
      created_at: new Date().toISOString(),
    };

    this.projectProducts.push(newUsage);
    this.addAuditLog(data.actorName || 'Admin', 'PRODUCT_CONSUMED', 'PROJECT_PRODUCT', newUsage.id, {
      project_id: data.projectId,
      product_name: product.name,
      quantity: data.quantity,
      unit: product.unit,
    });
    this.syncToLocalStorage();
    return newUsage;
  }

  // --- Service Requests ---
  async getServiceRequests(filters?: { status?: RequestStatus; customerEmail?: string; clientId?: string }): Promise<ServiceRequest[]> {
    this.loadFromLocalStorage();
    let result = [...this.serviceRequests];

    if (filters?.status) {
      result = result.filter((r) => r.status === filters.status);
    }
    if (filters?.customerEmail) {
      result = result.filter((r) => r.customer_email.toLowerCase() === filters.customerEmail!.toLowerCase());
    }
    if (filters?.clientId) {
      result = result.filter((r) => r.client_id === filters.clientId);
    }

    return result.map((r) => ({
      ...r,
      service: this.services.find((s) => s.id === r.service_id),
    }));
  }

  async getServiceRequestById(id: string): Promise<ServiceRequest | null> {
    const list = await this.getServiceRequests();
    return list.find((r) => r.id === id || r.request_id === id) || null;
  }

  async deleteServiceRequest(id: string, actorName = 'Admin'): Promise<boolean> {
    this.loadFromLocalStorage();
    const index = this.serviceRequests.findIndex((r) => r.id === id || r.request_id === id);
    if (index === -1) return false;
    const req = this.serviceRequests[index];
    this.serviceRequests.splice(index, 1);
    this.addAuditLog(actorName, 'DELETED', 'SERVICE_REQUEST', id, { request_id: req.request_id });
    this.syncToLocalStorage();
    return true;
  }

  async createServiceRequest(
    data: Omit<ServiceRequest, 'id' | 'request_id' | 'status' | 'created_at' | 'updated_at' | 'images' | 'history'> & {
      images?: { image_url: string; file_name?: string }[];
    }
  ): Promise<ServiceRequest> {
    this.loadFromLocalStorage();
    const year = new Date().getFullYear();
    const seq = (this.serviceRequests.length + 101).toString().padStart(6, '0');
    const requestId = `FS-${year}-${seq}`;
    const now = new Date().toISOString();

    const requestImages: ServiceRequestImage[] = (data.images || []).map((img, idx) => ({
      id: `img-${Date.now()}-${idx}`,
      request_id: requestId,
      image_url: img.image_url,
      file_name: img.file_name || 'uploaded_image.jpg',
      created_at: now,
    }));

    const newRequest: ServiceRequest = {
      ...data,
      id: `req-${Date.now().toString().slice(-4)}`,
      request_id: requestId,
      status: 'PENDING',
      created_at: now,
      updated_at: now,
      images: requestImages,
      history: [
        {
          id: `hist-${Date.now()}`,
          request_id: requestId,
          status: 'PENDING',
          notes: 'Service request registered online.',
          created_at: now,
        },
      ],
    };

    this.serviceRequests.unshift(newRequest);
    this.addAuditLog(data.customer_name, 'REQUEST_SUBMITTED', 'SERVICE_REQUEST', newRequest.id, {
      request_id: requestId,
      service_id: data.service_id,
      customer_email: data.customer_email,
    });
    this.syncToLocalStorage();
    return newRequest;
  }

  async updateServiceRequestStatus(
    id: string,
    status: RequestStatus,
    notes?: string,
    changedBy = 'Engr. Ahmed Raza (Admin)'
  ): Promise<ServiceRequest | null> {
    this.loadFromLocalStorage();
    const req = this.serviceRequests.find((r) => r.id === id || r.request_id === id);
    if (!req) return null;

    req.status = status;
    if (notes) req.admin_notes = notes;
    req.updated_at = new Date().toISOString();

    if (!req.history) req.history = [];
    req.history.push({
      id: `hist-${Date.now()}`,
      request_id: req.id,
      status,
      notes: notes || `Status marked as ${status}`,
      changed_by: changedBy,
      created_at: new Date().toISOString(),
    });

    this.addAuditLog(changedBy, 'STATUS_UPDATED', 'SERVICE_REQUEST', req.id, { request_id: req.request_id, status, notes });
    this.syncToLocalStorage();
    return req;
  }

  // --- Audit Logs ---
  async getAuditLogs(): Promise<AuditLog[]> {
    this.loadFromLocalStorage();
    return [...this.auditLogs].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  addAuditLog(actorName: string, action: string, entityType: string, entityId: string, details: Record<string, any> = {}) {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actor_name: actorName,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
      created_at: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
    // Keep max 200 logs in memory
    if (this.auditLogs.length > 200) this.auditLogs.pop();
  }

  // --- Master Unified Monthly Calculations (Single Source of Truth) ---
  async getMonthlyOverview(month: number, year: number) {
    this.loadFromLocalStorage();
    const projects = await this.getProjects({ month, year });
    const allProjects = await this.getProjects();
    const clients = await this.getClients();
    const employees = await this.getEmployees();
    const services = await this.getServices();
    const products = await this.getProducts();
    const requests = await this.getServiceRequests();

    // Filtered by selected Month/Year
    const filteredRequests = requests.filter((r) => {
      const d = new Date(r.created_at);
      return d.getFullYear() === year && d.getMonth() === month;
    });

    const activeClients = clients.filter((c) => c.status === 'ACTIVE').length;
    const activeEmployees = employees.filter((e) => e.status === 'ACTIVE').length;

    const plannedProjects = projects.filter((p) => p.status === 'PLANNED').length;
    const inProgressProjects = projects.filter((p) => p.status === 'IN_PROGRESS').length;
    const completedProjects = projects.filter((p) => p.status === 'COMPLETED').length;
    const onHoldProjects = projects.filter((p) => p.status === 'ON_HOLD').length;

    // Overall month progress calculation
    const overallProgress =
      projects.length > 0
        ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length)
        : 0;

    // Products used in this month
    const monthlyProductUsages = this.projectProducts.filter((pp) => {
      const d = new Date(pp.usage_date);
      return d.getFullYear() === year && d.getMonth() === month;
    });

    const totalProductCost = monthlyProductUsages.reduce(
      (sum, pp) => sum + pp.quantity * pp.unit_cost,
      0
    );

    // Active employees working on tasks
    const activeTaskEmployeeIds = new Set(
      this.tasks
        .filter((t) => t.status === 'IN_PROGRESS' || t.status === 'PENDING')
        .map((t) => t.assigned_employee_id)
        .filter(Boolean)
    );

    return {
      month,
      year,
      monthName: new Date(year, month).toLocaleString('en-US', { month: 'long', year: 'numeric' }),
      kpis: {
        totalClients: clients.length,
        activeClients,
        totalEmployees: employees.length,
        activeEmployees,
        totalServices: services.length,
        totalProducts: products.length,
        monthProjectsCount: projects.length,
        plannedProjects,
        inProgressProjects,
        completedProjects,
        onHoldProjects,
        overallProgress,
        monthRequestsCount: filteredRequests.length,
        monthProductCost: totalProductCost,
        employeesWorking: activeTaskEmployeeIds.size,
      },
      projects,
      recentRequests: filteredRequests.slice(0, 10),
      productUsages: monthlyProductUsages.map((pp) => ({
        ...pp,
        product: products.find((p) => p.id === pp.product_id),
        project: allProjects.find((pr) => pr.id === pp.project_id),
      })),
    };
  }
}

// Singleton repository
export const db = new DataStore();
