import { neon } from '@neondatabase/serverless';
import { getDbUrl } from './get-db-url.mjs';

const sql = neon(getDbUrl());

const officialServices = [
  {
    name: 'Civil & Structural Construction (EPC Turnkey)',
    slug: 'civil-structural-construction',
    category: 'Civil & Construction',
    short_description: 'Complete EPC turnkey construction for multi-story grey structures, basements, industrial units, warehouses, foundation pads, and steel structures.',
    description: 'Fast Engineering Solutions delivers end-to-end Civil Engineering, Procurement, and Construction (EPC) services across Pakistan. From architectural site analysis, feasibility studies, and structural designs to multi-story grey structures, basement excavation, industrial warehouses, generator foundation pads, water-proofing masonry, steel fabrication, and historical brick restoration.',
    price_starting_at: 150000,
    image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f8?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Multi-Story Commercial & Residential Grey Structures',
      'Building Basements, Retaining Walls & Corridors',
      'Industrial Warehouses & Manufacturing Units',
      'Heavy Generator Room Foundations & Substation Pads',
      'Underground & Overhead RCC Water Storage Tanks',
      'Structural Steel Fabrication, Roofing & Staircases',
      'Waterproofing, Damp Proofing & Masonry Works',
      'Major Building Renovation, Alteration & Demolition'
    ],
    is_active: true
  },
  {
    name: 'Interior Architecture & Commercial Finishing',
    slug: 'interior-architecture-finishing',
    category: 'Interior & Finishing',
    short_description: 'Architectural interior expansion, custom carpentry, premium tile & marble flooring, false ceilings, and executive workspace renovations.',
    description: 'Elevate commercial and residential spaces with FES interior engineering. We provide comprehensive space planning, custom architectural carpentry, ceramic and porcelain tiling, laminate & hardwood flooring, executive office partitions, acoustic false ceilings, premium paint & polish finishing, and high-spec kitchen and restroom remodeling.',
    price_starting_at: 80000,
    image_url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Building Alteration & Interior Space Expansion',
      'Ceramic, Porcelain & Imported Marble Tiling',
      'Laminate, Hardwood & Vinyl Flooring Solutions',
      'Custom Architectural Carpentry & Cabinetry',
      'Gypsum False Ceilings & Glass Wall Partitions',
      'Executive Kitchen & Modern Restroom Overhauls',
      'Specialized Door, Window Framing & Hardware Fitting',
      'High-Grade Wall Painting, Texture & Wood Polishing'
    ],
    is_active: true
  },
  {
    name: 'Electrical & Commercial Power Works (HV/LV & Transformers)',
    slug: 'electrical-commercial-power',
    category: 'Electrical & Power',
    short_description: 'High & Low Voltage Switchgear, Transformers, WAPDA connections, Power Distribution Boards, PFI capacitor banks, and industrial electrification.',
    description: 'Comprehensive industrial and commercial power engineering. FES executes turnkey electrical infrastructure including High Voltage (HV) and Low Voltage (LV) switchgear, step-down power transformers, new commercial WAPDA connection approvals, Main LT Panels, Power Factor Improvement (PFI) capacitor banks, copper bus-tie ducts, heavy-duty cable trays, motor control centers (MCC), and earth protection grids.',
    price_starting_at: 120000,
    image_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
    features: [
      'HT & LT Electrical Switchgear & Panel Boards',
      'Power Transformer Installation, Testing & Repair',
      'New Commercial Electricity Connections & WAPDA Approvals',
      'Main LT Distribution Panels & Sub-Distribution Boards (PDB)',
      'Power Factor Improvement (PFI) Capacitor Banks',
      'Copper Bus Tie Ducts & Cable Tray Support Systems',
      'Industrial Electric Motor Control Panels (MCC / VFD)',
      'Lightning & Deep Earth Pit Protection Systems'
    ],
    is_active: true
  },
  {
    name: 'Solar Energy Systems & Net Metering',
    slug: 'solar-energy-net-metering',
    category: 'Renewable Energy',
    short_description: 'Turnkey On-Grid, Off-Grid, and Hybrid Solar Power Plants with Tier-1 solar modules, energy storage inverters, and official Net-Metering licensing.',
    description: 'Harness clean energy with FES industrial and residential solar solutions. We provide complete solar plant designing, high-efficiency Tier-1 Mono PERC solar modules, hybrid & bi-directional energy storage inverters, MPPT charge controllers, industrial lithium/tubular battery banks, solar distribution switchboards, and end-to-end WAPDA Net-Metering license processing.',
    price_starting_at: 350000,
    image_url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    features: [
      'On-Grid, Hybrid & Off-Grid Solar Power Plants',
      'Tier-1 High-Efficiency Mono PERC Solar Modules',
      'Bi-Directional Energy Storage & Hybrid Inverters',
      'WAPDA Net-Metering Licensing & Green Meter Setup',
      'Industrial Solar Power Distribution Panels',
      'Heavy-Duty Galvanized Mounting Structures & Elevated Stands',
      'Industrial Lithium & Deep-Cycle Battery Banks',
      '24/7 Remote Generation Monitoring & Yield Optimization'
    ],
    is_active: true
  },
  {
    name: 'Genset Supply, Installation & Synchronization',
    slug: 'genset-power-synchronization',
    category: 'Power Backup & Machinery',
    short_description: '1 kVA to 1000 kVA Diesel & Gas Generators, ATS/AMF panels, auto-synchronization systems, acoustic canopies, fuel systems, and AMC maintenance.',
    description: 'Reliable industrial backup power by Fast Engineering Solutions. We specialize in supply, installation, testing, and commissioning of Diesel & Gas Generators ranging from 1 kVA to 1000 kVA. Services include ATS/AMF/MOR automatic transfer panels, multi-genset load sharing & synchronization boards, sound-attenuated acoustic canopies, external fuel tanks, cooling towers, complete engine overhaul, and Annual Maintenance Contracts (AMC).',
    price_starting_at: 200000,
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Diesel & Gas Generator Sets (1 kVA to 1000 kVA)',
      'ATS / AMF / MOR Automatic Transfer Switch Panels',
      'Multi-Genset Auto Synchronization & Load Sharing Panels',
      'Custom Sound-Attenuated Weatherproof Acoustic Canopies',
      'Industrial Fuel Tanks, Piping & Automatic Refueling Systems',
      'Genset Cooling Towers & Radiator Systems',
      'Complete Engine Overhauling & Electronic ECM Troubleshooting',
      'Monthly Preventive & Corrective Maintenance (AMC)'
    ],
    is_active: true
  },
  {
    name: 'CNC Machines & Industrial Compressors',
    slug: 'cnc-machines-compressors',
    category: 'Industrial Machinery',
    short_description: 'CNC machine supply, precision calibration, PLC software programming, industrial screw/piston air compressors, and pressure balancing.',
    description: 'FES provides specialized industrial machinery engineering services. We handle supply, installation, precision alignment, calibration, tooling, and troubleshooting of modern CNC machinery and PLC control systems. Additionally, we provide industrial screw and reciprocating air compressors, compressed air piping networks, oil/air filtration systems, pressure balancing, and routine maintenance.',
    price_starting_at: 95000,
    image_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
    features: [
      'CNC Machinery Supply, Installation & Commissioning',
      'CNC Machine Parts Supply & Specialized Tooling',
      'CNC Controller & PLC Ladder Logic Programming',
      'Industrial Screw & Piston Air Compressors Supply',
      'Compressed Air Distribution Piping & Pressure Balancing',
      'Compressor Oil, Separator & Filter Replacement',
      'Precision Machine Calibration & Vibration Analysis',
      'Emergency Breakdown Repairs & Mechanical AMC'
    ],
    is_active: true
  },
  {
    name: 'Data Center, Server Rooms & IT Infrastructure',
    slug: 'data-center-it-infrastructure',
    category: 'IT & Networking',
    short_description: 'Server room racks, Cat6/Fiber optic structured cabling, Cisco switches/routers, patch panels, power distribution units, and network racks.',
    description: 'Turnkey enterprise IT infrastructure and server room deployment. Fast Engineering Solutions engineers secure and high-availability data environments including standard server racks, Cat6 / Cat6A / Fiber Optic structured cabling, Cisco network switches and enterprise routers, patch panel termination & labeling, Power Distribution Units (PDU), cable managers, and server room environmental cooling integration.',
    price_starting_at: 75000,
    image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Enterprise Server Racks, Cabinets & Accessories',
      'Cat6 / Cat6A & High-Speed Optical Fiber Splicing & Cabling',
      'Cisco Enterprise Switches, Routers & Firewall Deployment',
      'Patch Panel Termination, Wire Dressing & Fluke Certification',
      'Intelligent Power Distribution Units (PDU) & UPS Integration',
      'Data Center Cable Trays, Wire Baskets & Raised Flooring',
      'Server Room Access Control & Environment Monitoring',
      'Network Infrastructure Troubleshooting & Upgrades'
    ],
    is_active: true
  },
  {
    name: 'Real Estate & Plot Development Engineering',
    slug: 'real-estate-plot-development',
    category: 'Real Estate & Land Development',
    short_description: 'Plot demarcation, topographic soil surveys, town planning, boundary walls, underground utilities (water, power, sewerage), and turnkey plot construction.',
    description: 'Comprehensive plot development and real estate engineering services by Fast Engineering Solutions. We assist property owners, developers, and investors across Pakistan with plot demarcation, boundary wall construction, soil testing, master layout designing, underground utility infrastructure (water lines, sewerage networks, electrical cabling), and turnkey residential and commercial plot construction.',
    price_starting_at: 250000,
    image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Plot Demarcation, Boundary Identification & Soil Testing',
      'Town Planning, Master Layouts & 3D Architectural Elevations',
      'Solid Boundary Wall & Security Gate Construction',
      'Underground Water Supply, Drainage & Sewerage Lines',
      'Underground Electrical Cabling & Transformer Substation Setup',
      'Asphalt / Concrete Road Construction & Kerb Stones',
      'Turnkey House & Commercial Plaza Construction on Plots',
      'Property Verification, Documentation & Engineering Feasibility'
    ],
    is_active: true
  }
];

async function seedFesServices() {
  console.log('=== SEEDING OFFICIAL FAST ENGINEERING SOLUTIONS SERVICES INTO NEON ===\n');

  for (const s of officialServices) {
    console.log(`Inserting/Updating service: "${s.name}" (${s.slug})...`);
    await sql`
      INSERT INTO public.services (
        name,
        slug,
        category,
        description,
        short_description,
        price_starting_at,
        image_url,
        features,
        is_active
      )
      VALUES (
        ${s.name},
        ${s.slug},
        ${s.category},
        ${s.description},
        ${s.short_description},
        ${s.price_starting_at},
        ${s.image_url},
        ${JSON.stringify(s.features)},
        ${s.is_active}
      )
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        description = EXCLUDED.description,
        short_description = EXCLUDED.short_description,
        price_starting_at = EXCLUDED.price_starting_at,
        image_url = EXCLUDED.image_url,
        features = EXCLUDED.features,
        is_active = EXCLUDED.is_active,
        updated_at = NOW();
    `;
  }

  const allServices = await sql`SELECT id, name, slug, category, is_active FROM public.services ORDER BY created_at ASC;`;
  console.log(`\n✓ Successfully synced ${allServices.length} official services in Neon PostgreSQL:`);
  console.log(JSON.stringify(allServices, null, 2));
}

seedFesServices().catch(console.error);
