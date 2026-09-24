import { neon } from '@neondatabase/serverless';
import { getDbUrl } from './get-db-url.mjs';

const connectionString = getDbUrl();

async function createAndSeedReviewsTable() {
  const sql = neon(connectionString);

  console.log('Creating customer_reviews table if not exists...');

  await sql`
    CREATE TABLE IF NOT EXISTS public.customer_reviews (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      customer_name TEXT NOT NULL,
      customer_role TEXT,
      company_name TEXT,
      service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
      service_name TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      review_title TEXT NOT NULL,
      comment TEXT NOT NULL,
      location TEXT DEFAULT 'Lahore, Pakistan',
      is_verified BOOLEAN DEFAULT TRUE,
      is_featured BOOLEAN DEFAULT TRUE,
      status TEXT NOT NULL CHECK (status IN ('APPROVED', 'PENDING', 'REJECTED')) DEFAULT 'APPROVED',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_customer_reviews_service_id ON public.customer_reviews(service_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_customer_reviews_status ON public.customer_reviews(status)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_customer_reviews_rating ON public.customer_reviews(rating DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_customer_reviews_created_at ON public.customer_reviews(created_at DESC)`;

  console.log('customer_reviews table & indexes created successfully.');

  // Check if we already have reviews
  const existing = await sql`SELECT count(*)::int as count FROM public.customer_reviews`;
  if (existing[0].count > 0) {
    console.log(`Table already has ${existing[0].count} reviews.`);
    return;
  }

  // Get available services to link
  const services = await sql`SELECT id, name, slug FROM public.services`;
  const getService = (keyword) => {
    const match = services.find(s => s.name.toLowerCase().includes(keyword.toLowerCase()));
    return match ? { id: match.id, name: match.name } : { id: null, name: keyword };
  };

  const electricalService = getService('electrical');
  const constructionService = getService('construction') || getService('building') || getService('turnkey');
  const solarService = getService('solar');
  const generatorService = getService('generator');
  const hvacService = getService('hvac') || getService('air');
  const plumbingService = getService('plumb');
  const realEstateService = getService('plot') || getService('real estate') || { id: null, name: 'Plot Demarcation & Boundary Wall' };

  const seedReviews = [
    {
      customer_name: 'Engr. Tariq Mahmood',
      customer_role: 'Operations Director',
      company_name: 'Crescent Textile Mills Ltd.',
      service_id: electricalService.id,
      service_name: electricalService.name || 'High-Voltage Substation & Industrial Electrical EPC',
      rating: 5,
      review_title: 'Unmatched Electrical Engineering Precision & Fast SLA',
      comment: 'Fast Engineering Solutions executed our 11kV transformer substation upgrade and heavy power distribution panel synchronization flawlessly. Their team arrived fully equipped with calibrated test gear, followed strict safety standards, and completed the commissioning 4 hours ahead of schedule with zero production downtime.',
      location: 'Sundar Industrial Estate, Lahore',
      is_verified: true,
      is_featured: true,
      status: 'APPROVED',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      customer_name: 'Chaudhry Nadeem Ashraf',
      customer_role: 'Plot Owner & Developer',
      company_name: 'LDA Avenue 1 Residents Forum',
      service_id: realEstateService.id,
      service_name: 'Turnkey Plot Demarcation & Boundary Construction',
      rating: 5,
      review_title: 'Transparent Laser Demarcation & Solid Boundary Wall',
      comment: 'I engaged Fast Services for my 1-Kanal corner plot in LDA Avenue 1. They handled everything from laser boundary demarcation and soil compaction testing to constructing a heavy reinforced boundary wall with solid steel gate. The digital progress updates and transparent billing gave our family total peace of mind.',
      location: 'LDA Avenue 1, Raiwind Road, Lahore',
      is_verified: true,
      is_featured: true,
      status: 'APPROVED',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      customer_name: 'Dr. Ayesha Siddiqui',
      customer_role: 'Medical Director',
      company_name: 'Al-Shifa Healthcare Complex',
      service_id: solarService.id,
      service_name: solarService.name || 'Commercial & Industrial Solar Power Systems',
      rating: 5,
      review_title: 'Exceptional 150kW Solar EPC Installation',
      comment: 'From net metering approvals with LESCO to Tier-1 bifacial panels and high-efficiency inverters, Fast Engineering delivered a turnkey 150kW industrial solar project. Our monthly electricity bill reduced by over 78%. Highly recommended for their professional technical team and after-sales support.',
      location: 'Gulberg III, Lahore',
      is_verified: true,
      is_featured: true,
      status: 'APPROVED',
      created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      customer_name: 'Malik Zeeshan Farooq',
      customer_role: 'Chief Engineer',
      company_name: 'Horizon Business Tower',
      service_id: generatorService.id,
      service_name: generatorService.name || 'Heavy Diesel Generator Overhauling & Synchronization',
      rating: 5,
      review_title: 'Emergency Generator Restoration Within 45 Minutes',
      comment: 'During a peak load outage, our 500kVA backup generator experienced ATS failure. Fast Services emergency dispatch team arrived in under 40 minutes, diagnosed the controller issue, replaced the faulty sensor with genuine OEM parts, and restored full facility backup power immediately.',
      location: 'Blue Area, Islamabad',
      is_verified: true,
      is_featured: true,
      status: 'APPROVED',
      created_at: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      customer_name: 'Hassan Raza',
      customer_role: 'Managing Director',
      company_name: 'Apex Logistics & Warehousing',
      service_id: constructionService.id,
      service_name: constructionService.name || 'Turnkey Commercial & Industrial Construction',
      rating: 5,
      review_title: 'Flawless Grey Structure & Heavy Industrial Flooring',
      comment: 'We contracted Fast Engineering Solutions for our 35,000 sq.ft warehouse grey structure and laser screed industrial flooring. Their adherence to structural civil drawings, concrete curing benchmarks, and daily GPS-tracked task progress was truly world class.',
      location: 'Multan Road Industrial Corridor, Lahore',
      is_verified: true,
      is_featured: true,
      status: 'APPROVED',
      created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      customer_name: 'Sarah Salman',
      customer_role: 'Facility Manager',
      company_name: 'Nexus Executive Plaza',
      service_id: hvacService.id,
      service_name: hvacService.name || 'Central HVAC & Chiller Plant Maintenance',
      rating: 5,
      review_title: 'Preventive HVAC Service That Eliminated Frequent Breakdowns',
      comment: 'Their annual preventive maintenance contract for our VRF air conditioning and chilled water coils has dramatically improved indoor air quality and reduced our HVAC operating costs. The technician logs and digital inspection reports are always spotless.',
      location: 'DHA Phase 6, Lahore',
      is_verified: true,
      is_featured: false,
      status: 'APPROVED',
      created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      customer_name: 'Kamran Ali Shah',
      customer_role: 'Property Owner',
      company_name: 'Bahria Town Executive Villas',
      service_id: plumbingService.id,
      service_name: plumbingService.name || 'Industrial & Commercial Plumbing & Drainage Systems',
      rating: 5,
      review_title: 'Prompt Water Pressure & Filtration Overhaul',
      comment: 'Fast Services upgraded our multi-line plumbing infrastructure, booster pumps, and automated reverse osmosis filtration. Clean workmanship, high pressure testing before handover, and zero leaks.',
      location: 'Bahria Town, Lahore',
      is_verified: true,
      is_featured: false,
      status: 'APPROVED',
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      customer_name: 'Bilal Ahmed Qureshi',
      customer_role: 'Site Supervisor',
      company_name: 'Al-Jannat Enclave Development',
      service_id: realEstateService.id,
      service_name: 'Underground Sewerage & Water Infrastructure',
      rating: 5,
      review_title: 'Speedy Pipeline & Manhole Installation',
      comment: 'Top quality RCC pipe laying, gradient precision, and heavy chamber construction for our scheme development. Very professional team with dedicated engineering supervisors on site throughout.',
      location: 'Raiwind Road, Lahore',
      is_verified: true,
      is_featured: true,
      status: 'APPROVED',
      created_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    }
  ];

  console.log(`Seeding ${seedReviews.length} customer reviews...`);
  for (const rev of seedReviews) {
    await sql`
      INSERT INTO public.customer_reviews (
        customer_name, customer_role, company_name, service_id, service_name,
        rating, review_title, comment, location, is_verified, is_featured, status, created_at
      ) VALUES (
        ${rev.customer_name},
        ${rev.customer_role},
        ${rev.company_name},
        ${rev.service_id},
        ${rev.service_name},
        ${rev.rating},
        ${rev.review_title},
        ${rev.comment},
        ${rev.location},
        ${rev.is_verified},
        ${rev.is_featured},
        ${rev.status},
        ${rev.created_at}
      )
    `;
  }

  console.log('Seeded customer reviews successfully!');
}

createAndSeedReviewsTable()
  .then(() => {
    console.log('Reviews table migration finished successfully.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Reviews table migration failed:', err);
    process.exit(1);
  });
