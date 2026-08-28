import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { getDbUrl } from './get-db-url.mjs';

const connectionString = getDbUrl();


async function seed() {
  const sql = neon(connectionString);
  console.log('Seeding initial data into Neon PostgreSQL...');

  // 1. Seed Services
  console.log('Seeding Services...');
  const services = [
    {
      name: 'Industrial Electrical & Power Distribution',
      slug: 'industrial-electrical-power-distribution',
      category: 'Electrical Engineering',
      short_description: 'High-voltage wiring, transformer installation, 3-phase switchgear and industrial automation.',
      description: 'Comprehensive industrial and commercial electrical solutions engineered to international standards. From power distribution panels to high-capacity generator synchronization and preventive power audits.',
      price_starting_at: 25000,
      image_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
      features: ['3-Phase Substation & Switchgear Installation', 'Industrial HT/LT Panel Design & Commissioning', 'Power Factor Correction & Harmonic Analysis', 'Emergency Backup & Generator Synchronization', 'Factory Lighting & Cable Tray Traying', 'Thermal Imaging & Preventative Audits'],
      is_active: true
    },
    {
      name: 'Commercial HVAC & Mechanical Systems',
      slug: 'commercial-hvac-mechanical-systems',
      category: 'Mechanical Engineering',
      short_description: 'Chiller plants, VRF systems, industrial ventilation, ducting, and cleanroom air systems.',
      description: 'Turnkey HVAC and climate control engineering for corporate towers, manufacturing plants, and hospitals. Energy-efficient cooling, duct fabrication, ventilation systems, and predictive maintenance.',
      price_starting_at: 40000,
      image_url: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1200&q=80',
      features: ['Central Chilled Water & VRF Air Conditioning', 'Industrial Exhaust & Cleanroom Air Filtration', 'GI / Spiral Duct Fabrication & Insulation', 'BMS (Building Management System) Integration', 'Compressor Overhauling & Refrigerant Balancing', 'Routine Seasonal Maintenance Contracts (SLA)'],
      is_active: true
    },
    {
      name: 'CCTV Surveillance & Security Automation',
      slug: 'cctv-surveillance-security-automation',
      category: 'Security & Automation',
      short_description: 'Enterprise IP cameras, optical fiber backbones, biometric access control, and fire alarms.',
      description: 'State-of-the-art surveillance and physical security systems. High-definition IP monitoring with remote cloud NVRs, perimeter infrared beams, automated barrier gates, and integrated fire suppression.',
      price_starting_at: 18000,
      image_url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80',
      features: ['High-Definition IP & PTZ Camera Deployment', 'Optical Fiber Cable Splicing & Backbone Setup', 'Biometric Time-Attendance & Turnstiles', 'Addressable Fire Alarm & Smoke Detection', 'Central Control Room Video Wall Integration', 'Mobile Phone App Live Streaming & Alerting'],
      is_active: true
    },
    {
      name: 'Solar Energy & Solar Plant Installation',
      slug: 'solar-energy-plant-installation',
      category: 'Renewable Energy',
      short_description: 'On-grid, off-grid and hybrid industrial solar plants with net-metering and tier-1 panels.',
      description: 'Turnkey solar EPC solutions. Reduce operational utility costs with high-efficiency tier-1 mono PERC/TopCon modules, European on-grid inverters, and official net metering support.',
      price_starting_at: 150000,
      image_url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
      features: ['Industrial Rooftop & Ground-Mounted Plants (10kW to 1MW)', 'Tier-1 Certified Monocrystalline Solar Panels', '3-Phase On-Grid Inverters with Remote Telemetry', 'Official DISCO Net-Metering Approval & Licensing', 'Custom Hot-Dip Galvanized Mounting Structures', 'Lithium Iron Phosphate (LiFePO4) Battery Storage'],
      is_active: true
    },
    {
      name: 'Industrial Plumbing & Pipe Network Works',
      slug: 'industrial-plumbing-pipe-network',
      category: 'Civil & Mechanical',
      short_description: 'High-pressure hydraulic lines, RO water treatment, fire hydrant systems, and drainage.',
      description: 'Heavy-duty fluid flow and plumbing engineering. PPRC, UPVC, and seamless stainless steel piping for manufacturing industries, commercial plazas, boiler feeds, and dedicated fire sprinkler loops.',
      price_starting_at: 20000,
      image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
      features: ['Fire Hydrant & Automatic Sprinkler Pipe Routing', 'Industrial RO & Water Demineralization Plants', 'PPRC / Seamless Steel Pipe TIG Welding', 'Hydrostatic Pressure Testing & Leak Detection', 'Heavy Duty Booster Pumps & Variable Frequency Drives', 'Commercial Drainage & Waste Line Traps'],
      is_active: true
    },
    {
      name: 'Instrumentation & Process Automation',
      slug: 'instrumentation-process-automation',
      category: 'Automation & Control',
      short_description: 'PLC programming, SCADA development, sensors, pneumatic actuators, and calibration.',
      description: 'Precision industrial automation and control. Custom Siemens/Delta PLC panels, HMI touch interfaces, SCADA monitoring networks, RTD temperature sensors, and pneumatic control valves.',
      price_starting_at: 35000,
      image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      features: ['Siemens / Delta PLC Architecture & Logic Coding', 'SCADA / HMI Graphical Interface Design', 'Pressure, Flow & Temperature Sensor Calibration', 'Pneumatic & Hydraulic Actuator Maintenance', 'VFD Parameter Tuning', 'Emergency Shutdown (ESD) Safety Loops'],
      is_active: true
    }
  ];

  for (const s of services) {
    await sql`
      INSERT INTO public.services (name, slug, category, description, short_description, price_starting_at, image_url, features, is_active)
      VALUES (${s.name}, ${s.slug}, ${s.category}, ${s.description}, ${s.short_description}, ${s.price_starting_at}, ${s.image_url}, ${JSON.stringify(s.features)}::jsonb, ${s.is_active})
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        description = EXCLUDED.description,
        price_starting_at = EXCLUDED.price_starting_at,
        image_url = EXCLUDED.image_url,
        features = EXCLUDED.features;
    `;
  }

  // 2. Seed Clients
  console.log('Seeding Clients...');
  const clients = [
    {
      client_code: 'CLI-2026-001',
      company_name: 'Apex Textile Mills Ltd',
      contact_person: 'Tariq Mehmood',
      phone: '+92 300 8472910',
      whatsapp: '+923008472910',
      email: 'tariq@apextextiles.com.pk',
      address: 'Plot 45, Manga Mandi Industrial Estate, Lahore',
      status: 'ACTIVE',
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
      status: 'ACTIVE',
      notes: 'High priority solar plant installation and multi-camera optical surveillance contract.'
    }
  ];

  for (const c of clients) {
    await sql`
      INSERT INTO public.clients (client_code, company_name, contact_person, phone, whatsapp, email, address, status, notes)
      VALUES (${c.client_code}, ${c.company_name}, ${c.contact_person}, ${c.phone}, ${c.whatsapp}, ${c.email}, ${c.address}, ${c.status}, ${c.notes})
      ON CONFLICT (client_code) DO NOTHING;
    `;
  }

  // 3. Seed Products
  console.log('Seeding Products...');
  const products = [
    { product_code: 'PRD-001', name: '4-Core 16mm² XLPE Copper Armoured Cable', category: 'Electrical Wiring', unit: 'meters', price: 1850, stock: 2400 },
    { product_code: 'PRD-002', name: 'Schneider 3-Phase 100A MCCB Circuit Breaker', category: 'Switchgear', unit: 'pieces', price: 24500, stock: 35 },
    { product_code: 'PRD-003', name: 'Longi 585W Mono PERC Tier-1 Solar Module', category: 'Solar Hardware', unit: 'panels', price: 22000, stock: 320 },
    { product_code: 'PRD-004', name: 'Hikvision 4MP DarkFighter IP Dome Camera', category: 'Surveillance & CCTV', unit: 'pieces', price: 14200, stock: 90 },
    { product_code: 'PRD-005', name: 'PPRC PN-20 Heavy Duty 50mm Industrial Pipe', category: 'Plumbing & Piping', unit: 'lengths (4m)', price: 3600, stock: 450 }
  ];

  for (const p of products) {
    await sql`
      INSERT INTO public.products (product_code, name, category, unit, price, stock, status)
      VALUES (${p.product_code}, ${p.name}, ${p.category}, ${p.unit}, ${p.price}, ${p.stock}, 'ACTIVE')
      ON CONFLICT (product_code) DO NOTHING;
    `;
  }

  console.log('✓ Seeding complete.');
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
