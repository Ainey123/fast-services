import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { getDbUrl } from './get-db-url.mjs';

const connectionString = getDbUrl();


async function populateFullEnterprise() {
  const sql = neon(connectionString);
  console.log('Seeding complete enterprise dataset into Neon PostgreSQL...');

  // Default secure hashed password for seed accounts
  const defaultSalt = await bcrypt.genSalt(10);
  const defaultHash = await bcrypt.hash('Fast@2026', defaultSalt);

  // 1. PROFILES & EMPLOYEES
  console.log('1. Seeding Profiles & Employees...');
  const employeesData = [
    {
      full_name: 'Engr. Ahmed Raza',
      email: 'ahmed.raza@fastengineeringsolutions.com',
      phone: '+92 300 5551122',
      role: 'ADMIN',
      employee_code: 'EMP-001',
      department: 'Electrical Engineering',
      position: 'Lead Electrical Engineer',
      joining_date: '2025-06-01',
    },
    {
      full_name: 'Engr. Ali Hassan',
      email: 'ali.hassan@fastengineeringsolutions.com',
      phone: '+92 301 6662233',
      role: 'MANAGER',
      employee_code: 'EMP-002',
      department: 'Mechanical & HVAC',
      position: 'Senior HVAC Systems Engineer',
      joining_date: '2025-08-15',
    },
    {
      full_name: 'Usman Tariq',
      email: 'usman.tariq@fastengineeringsolutions.com',
      phone: '+92 302 7773344',
      role: 'EMPLOYEE',
      employee_code: 'EMP-003',
      department: 'Solar & Renewable',
      position: 'Solar PV Site Specialist',
      joining_date: '2026-01-10',
    },
    {
      full_name: 'Hamza Malik',
      email: 'hamza.malik@fastengineeringsolutions.com',
      phone: '+92 303 8884455',
      role: 'EMPLOYEE',
      employee_code: 'EMP-004',
      department: 'Automation & Security',
      position: 'Automation & Network Specialist',
      joining_date: '2026-03-01',
    },
  ];

  const employeeIdMap = {};

  for (const emp of employeesData) {
    // Upsert Profile
    const profRows = await sql`
      INSERT INTO public.profiles (full_name, email, phone, password_hash, role, status)
      VALUES (${emp.full_name}, ${emp.email.toLowerCase()}, ${emp.phone}, ${defaultHash}, ${emp.role}, 'ACTIVE')
      ON CONFLICT (email) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        phone = EXCLUDED.phone,
        role = EXCLUDED.role,
        status = 'ACTIVE'
      RETURNING id;
    `;
    const profileId = profRows[0].id;
    employeeIdMap[emp.employee_code] = profileId;

    // Upsert Employee
    await sql`
      INSERT INTO public.employees (id, employee_code, department, position, joining_date, status)
      VALUES (${profileId}, ${emp.employee_code}, ${emp.department}, ${emp.position}, ${emp.joining_date}, 'ACTIVE')
      ON CONFLICT (employee_code) DO UPDATE SET
        department = EXCLUDED.department,
        position = EXCLUDED.position,
        joining_date = EXCLUDED.joining_date,
        status = 'ACTIVE';
    `;
  }

  // 2. CLIENTS
  console.log('2. Seeding Clients...');
  const clientsData = [
    {
      client_code: 'CLI-2026-001',
      company_name: 'Apex Textile Mills Ltd',
      contact_person: 'Tariq Mehmood',
      phone: '+92 300 8472910',
      whatsapp: '+923008472910',
      email: 'tariq@apextextiles.com.pk',
      address: 'Plot 45, Manga Mandi Industrial Estate, Lahore',
      notes: 'Key industrial client with annual HVAC and electrical substation maintenance contracts.'
    },
    {
      client_code: 'CLI-2026-002',
      company_name: 'National Logistics & Warehousing',
      contact_person: 'Bilal Farooq',
      phone: '+92 321 9548231',
      whatsapp: '+923219548231',
      email: 'operations@nlwlogistics.com',
      address: 'Warehouse Hub 3, M-2 Motorway Interchange, Rawalpindi',
      notes: 'High priority solar plant installation and multi-camera optical surveillance contract.'
    },
    {
      client_code: 'CLI-2026-003',
      company_name: 'Grand Horizon Medical Complex',
      contact_person: 'Dr. Shahzad Akbar',
      phone: '+92 333 4128905',
      whatsapp: '+923334128905',
      email: 'facility@grandhorizonhealth.com',
      address: 'Main Boulevard, Gulberg III, Lahore',
      notes: 'Cleanroom ventilation, emergency backup synchronization, and medical gas pipeline monitoring.'
    },
    {
      client_code: 'CLI-2026-004',
      company_name: 'Crown Packaging Industries',
      contact_person: 'Kamran Siddiqui',
      phone: '+92 301 5689423',
      whatsapp: '+923015689423',
      email: 'admin@crownpackaging.pk',
      address: 'Sector I-9/2, Industrial Area, Islamabad',
      notes: 'PLC machinery automation and power factor correction project.'
    }
  ];

  const clientIdMap = {};
  for (const c of clientsData) {
    const rows = await sql`
      INSERT INTO public.clients (client_code, company_name, contact_person, phone, whatsapp, email, address, status, notes)
      VALUES (${c.client_code}, ${c.company_name}, ${c.contact_person}, ${c.phone}, ${c.whatsapp}, ${c.email}, ${c.address}, 'ACTIVE', ${c.notes})
      ON CONFLICT (client_code) DO UPDATE SET
        company_name = EXCLUDED.company_name,
        contact_person = EXCLUDED.contact_person,
        phone = EXCLUDED.phone,
        email = EXCLUDED.email,
        address = EXCLUDED.address
      RETURNING id;
    `;
    clientIdMap[c.client_code] = rows[0].id;
  }

  // 3. SERVICES LOOKUP
  const serviceRows = await sql`SELECT id, slug FROM public.services`;
  const serviceIdMap = {};
  serviceRows.forEach(s => { serviceIdMap[s.slug] = s.id; });

  // 4. PROJECTS
  console.log('3. Seeding Projects...');
  const projectsData = [
    {
      project_code: 'PRJ-2026-001',
      name: 'Apex Mills 100kW Rooftop Solar & Power Synchronization',
      client_code: 'CLI-2026-001',
      service_slug: 'solar-energy-plant-installation',
      description: 'Complete turnkey 100kW on-grid solar plant installation, net-metering synchronization with 11kV substation.',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      progress: 75,
      start_date: '2026-07-01',
      expected_completion_date: '2026-08-30',
      notes: 'Structure mounting and string inverter cabling complete. Final net-metering inspection scheduled.',
    },
    {
      project_code: 'PRJ-2026-002',
      name: 'National Logistics CCTV & Biometric Turnstile Security',
      client_code: 'CLI-2026-002',
      service_slug: 'cctv-surveillance-security-automation',
      description: 'Deployment of 64 IP cameras across 3 warehouses, optical fiber trunking, and RFID automatic entry turnstiles.',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      progress: 90,
      start_date: '2026-07-15',
      expected_completion_date: '2026-08-25',
      notes: 'All cameras installed and streaming to central NVR. Turnstile gate testing in progress.',
    },
    {
      project_code: 'PRJ-2026-003',
      name: 'Grand Horizon Hospital HVAC Cleanroom Chiller Overhaul',
      client_code: 'CLI-2026-003',
      service_slug: 'commercial-hvac-mechanical-systems',
      description: 'Comprehensive maintenance, compressor descaling, HEPA filter replacements, and chilled water balancing.',
      priority: 'URGENT',
      status: 'COMPLETED',
      progress: 100,
      start_date: '2026-08-01',
      expected_completion_date: '2026-08-18',
      actual_completion_date: '2026-08-17',
      notes: 'Commissioning successful. Signed off by Hospital Facility Director.',
    },
    {
      project_code: 'PRJ-2026-004',
      name: 'Crown Packaging PLC Automated Conveyor Control Panel',
      client_code: 'CLI-2026-004',
      service_slug: 'instrumentation-process-automation',
      description: 'Siemens S7-1200 PLC panel fabrication, VFD synchronizing for high speed packaging lines, and HMI programming.',
      priority: 'HIGH',
      status: 'PLANNED',
      progress: 20,
      start_date: '2026-08-10',
      expected_completion_date: '2026-09-15',
      notes: 'Schematic drawings approved. Component assembly starting in workshop.',
    }
  ];

  const projectIdMap = {};
  for (const p of projectsData) {
    const cId = clientIdMap[p.client_code];
    const sId = serviceIdMap[p.service_slug];
    if (cId) {
      const rows = await sql`
        INSERT INTO public.projects (
          project_code, name, client_id, service_id, description, priority, status, progress, start_date, expected_completion_date, actual_completion_date, notes
        ) VALUES (
          ${p.project_code}, ${p.name}, ${cId}, ${sId || null}, ${p.description}, ${p.priority}, ${p.status}, ${p.progress}, ${p.start_date}, ${p.expected_completion_date}, ${p.actual_completion_date || null}, ${p.notes}
        )
        ON CONFLICT (project_code) DO UPDATE SET
          name = EXCLUDED.name,
          progress = EXCLUDED.progress,
          status = EXCLUDED.status,
          notes = EXCLUDED.notes
        RETURNING id;
      `;
      projectIdMap[p.project_code] = rows[0].id;
    }
  }

  // 5. TASKS
  console.log('4. Seeding Tasks...');
  const tasksData = [
    {
      task_code: 'TSK-101',
      project_code: 'PRJ-2026-001',
      emp_code: 'EMP-003',
      title: 'DC Cable Stringing & Combiner Box Terminations',
      description: 'Route solar DC cables into IP67 combiner boxes and test open-circuit Voc voltage.',
      status: 'IN_PROGRESS',
      progress: 75,
      deadline: '2026-08-24'
    },
    {
      task_code: 'TSK-102',
      project_code: 'PRJ-2026-001',
      emp_code: 'EMP-001',
      title: 'Main Inverter AC Grid Interconnection & Breaker Setup',
      description: 'Connect 100kW Sungrow Inverter to LT main panel with 100A MCCB and surge protection.',
      status: 'IN_PROGRESS',
      progress: 70,
      deadline: '2026-08-26'
    },
    {
      task_code: 'TSK-103',
      project_code: 'PRJ-2026-002',
      emp_code: 'EMP-004',
      title: 'Warehouse Optical Fiber Splicing & Patch Panel Labelling',
      description: 'Splice 12-core single-mode fiber connecting Hub 1, 2, and 3 server racks.',
      status: 'COMPLETED',
      progress: 100,
      deadline: '2026-08-18'
    },
    {
      task_code: 'TSK-104',
      project_code: 'PRJ-2026-003',
      emp_code: 'EMP-002',
      title: 'Chiller Compressor Oil Replacement & Pressure Balancing',
      description: 'Drain refrigeration oil, replace suction filters, and balance R134a operating head pressure.',
      status: 'COMPLETED',
      progress: 100,
      deadline: '2026-08-16'
    },
    {
      task_code: 'TSK-105',
      project_code: 'PRJ-2026-004',
      emp_code: 'EMP-004',
      title: 'Siemens PLC Ladder Logic Programming & Interlock Coding',
      description: 'Write packaging conveyor sequence code with emergency stop safety routines.',
      status: 'IN_PROGRESS',
      progress: 25,
      deadline: '2026-08-30'
    }
  ];

  for (const t of tasksData) {
    const prjId = projectIdMap[t.project_code];
    const empId = employeeIdMap[t.emp_code];
    if (prjId) {
      await sql`
        INSERT INTO public.tasks (
          task_code, project_id, assigned_employee_id, title, description, status, progress, deadline
        ) VALUES (
          ${t.task_code}, ${prjId}, ${empId || null}, ${t.title}, ${t.description}, ${t.status}, ${t.progress}, ${t.deadline}
        )
        ON CONFLICT (task_code) DO UPDATE SET
          progress = EXCLUDED.progress,
          status = EXCLUDED.status;
      `;
    }
  }

  // 6. SERVICE REQUESTS
  console.log('5. Seeding Service Requests...');
  const requestsData = [
    {
      request_id: 'FS-2026-000101',
      service_slug: 'industrial-electrical-power-distribution',
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
    },
    {
      request_id: 'FS-2026-000102',
      service_slug: 'solar-energy-plant-installation',
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
    }
  ];

  for (const r of requestsData) {
    const sId = serviceIdMap[r.service_slug];
    if (sId) {
      await sql`
        INSERT INTO public.service_requests (
          request_id, service_id, customer_name, customer_phone, customer_email, description, preferred_date, preferred_time, location_address, latitude, longitude, status, admin_notes
        ) VALUES (
          ${r.request_id}, ${sId}, ${r.customer_name}, ${r.customer_phone}, ${r.customer_email}, ${r.description}, ${r.preferred_date}, ${r.preferred_time}, ${r.location_address}, ${r.latitude}, ${r.longitude}, ${r.status}, ${r.admin_notes}
        )
        ON CONFLICT (request_id) DO NOTHING;
      `;
    }
  }

  console.log('==============================================');
  console.log('✓ ALL ENTERPRISE TABLES POPULATED IN NEON!');
  console.log('==============================================');
}

populateFullEnterprise().catch(console.error);
