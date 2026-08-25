import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const connectionString = "postgresql://neondb_owner:npg_XVOCZUI9gt8q@ep-patient-river-axs53glt-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require";

async function testCreate() {
  const sql = neon(connectionString);
  console.log('Testing create employee in Neon...');
  
  const countRes = await sql`SELECT count(*)::int as cnt FROM public.employees`;
  const count = (countRes[0]?.cnt || 0) + 1;
  const empCode = `EMP-${count.toString().padStart(3, '0')}`;

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Test@123', salt);

  // 1. Create Profile
  const profileRows = await sql`
    INSERT INTO public.profiles (full_name, email, phone, password_hash, role, status)
    VALUES ('Fara Test', 'fara.test@example.com', '+92 300 1234567', ${passwordHash}, 'EMPLOYEE', 'ACTIVE')
    ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name
    RETURNING *
  `;
  const profile = profileRows[0];
  console.log('Profile created:', profile.id, profile.full_name);

  // 2. Create Employee
  const empRows = await sql`
    INSERT INTO public.employees (id, employee_code, department, position, status)
    VALUES (${profile.id}, ${empCode}, 'Engineering', 'Site Specialist', 'ACTIVE')
    ON CONFLICT (id) DO UPDATE SET department = EXCLUDED.department
    RETURNING *
  `;
  console.log('Employee created:', empRows[0].employee_code, empRows[0].id);

  const check = await sql`
    SELECT e.employee_code, e.department, p.full_name, p.email 
    FROM public.employees e 
    JOIN public.profiles p ON e.id = p.id
  `;
  console.log('ALL EMPLOYEES IN NEON:');
  console.table(check);
}

testCreate().catch(console.error);
