import { jsPDF } from 'jspdf';
import fs from 'fs';

function generateBrochure() {
  console.log('Generating Fast Services Real Estate & Plot Engineering PDF Brochure...');

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // --- PAGE 1: COVER & EXECUTIVE OVERVIEW ---
  // Header Navy Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 50, 'F');

  // Brand Accent Line
  doc.setFillColor(37, 99, 235); // blue-600
  doc.rect(0, 48, pageWidth, 2.5, 'F');

  // Title Text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('FAST ENGINEERING SOLUTIONS', 15, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(245, 158, 11); // amber-400
  doc.text('TURNKEY REAL ESTATE & PLOT ENGINEERING HUB', 15, 28);

  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text('Operating Since 2012 | General Contractor & Land Development Across Pakistan', 15, 36);
  doc.text('Head Office: 52, Al Jannat Ul Firdous Society, LDA Avenue 1, Raiwind Road, Lahore', 15, 42);

  // Subtitle
  let y = 60;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('WHAT FAST SERVICES DOES FOR YOUR PLOTS & PROPERTIES', 15, y);

  y += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  const introText = 'Fast Engineering Solutions (FES) provides an end-to-end digital and on-ground engineering ecosystem for plot owners, developers, and institutional investors. Whether you own a residential, commercial, industrial, or farmhouse plot, our certified engineering teams and modern digital platform handle everything from initial demarcation to turnkey building construction.';
  const splitIntro = doc.splitTextToSize(introText, pageWidth - 30);
  doc.text(splitIntro, 15, y);
  y += splitIntro.length * 4.5 + 4;

  // 6 Core Pillars (Cards Layout)
  const pillars = [
    {
      num: '01',
      title: 'Laser Plot Demarcation & Soil Testing',
      desc: 'Precision computerized boundary verification, total-station land survey, and certified laboratory soil load-bearing analysis before excavation.'
    },
    {
      num: '02',
      title: 'Boundary Walls & Heavy Security Gates',
      desc: 'Reinforced brick/block boundary walling with RCC pillars, damp-proof courses (DPC), and custom fabricated heavy steel security gates.'
    },
    {
      num: '03',
      title: 'Underground Utilities & Infrastructure',
      desc: 'Turnkey underground water supply pipelines, sewerage drainage, RCC manholes, electric conduit trenches, and transformer substations.'
    },
    {
      num: '04',
      title: 'Town Planning & 3D Architectural Blueprints',
      desc: 'Complete architectural layout planning, 3D exterior elevations, structural calculations, and building authority approval assistance.'
    },
    {
      num: '05',
      title: 'Turnkey House & Plaza Construction',
      desc: 'A+ quality grey structure construction, structural steel roofing, premium porcelain/marble flooring, custom woodwork, and full interior finishing.'
    },
    {
      num: '06',
      title: 'Live App Tracking & Digital Handover',
      desc: 'Real-time online status tracker, photo inspection uploads, milestone billing, digital warranty certificates, and 24/7 dedicated support.'
    }
  ];

  pillars.forEach((p, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const boxX = 15 + col * (pageWidth / 2 - 12);
    const boxY = y + row * 28;
    const boxWidth = pageWidth / 2 - 18;

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(boxX, boxY, boxWidth, 25, 2, 2, 'FD');

    // Number circle
    doc.setFillColor(37, 99, 235);
    doc.rect(boxX, boxY, 4, 25, 'F');

    doc.setTextColor(37, 99, 235);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`${p.num}. ${p.title}`, boxX + 6, boxY + 6);

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    const pDesc = doc.splitTextToSize(p.desc, boxWidth - 8);
    doc.text(pDesc, boxX + 6, boxY + 12);
  });

  y += 3 * 28 + 6;

  // Prime Locations Section
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('PRIME SOCIETIES & ACTIVE DEVELOPMENT SECTORS', 15, y);

  y += 5;
  const locations = [
    '• LDA Avenue 1, Lahore (10 Marla & 1 Kanal Residential)',
    '• Al Jannat Ul Firdous Society, Raiwind Road (5 & 10 Marla)',
    '• Bahria Town & DHA Phases 5-9 (1 & 2 Kanal Luxury Villas)',
    '• Sundar Industrial Estate & Multan Road (2 to 10 Acres Industrial)',
    '• Gulberg & Commercial Boulevards (4 to 8 Marla Commercial Plazas)',
    '• Islamabad / Rawalpindi Prime Sectors (Residential & Farmhouses)'
  ];

  locations.forEach((loc) => {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(loc, 15, y);
    y += 4;
  });

  // Footer on Page 1
  doc.setFillColor(15, 23, 42);
  doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Hotline: +92 300 4545280  |  Email: fastsales.services@gmail.com  |  Web: www.fastengineeringsolutions.pk', 15, pageHeight - 11);
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('Application Architect: AI Engineer Qurat ul Ain Sabir  |  FAST ENGINEERING SOLUTIONS © 2026', 15, pageHeight - 6);

  // --- PAGE 2: HOW THE APP WORKS & TECHNICAL CAPABILITIES ---
  doc.addPage();

  // Header Banner Page 2
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 28, 'F');
  doc.setFillColor(245, 158, 11);
  doc.rect(0, 26, pageWidth, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('DIGITAL APP FEATURES FOR PLOT CLIENTS & BUILDERS', 15, 14);
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text('Streamlined 4-Step Process from Instant Booking to Precision On-Site Handover', 15, 21);

  y = 38;

  // Process Steps Table
  const steps = [
    {
      step: 'Step 1: One-Click Online Inquiry & GPS Pinning',
      details: 'Select your plot location, size, and required engineering service (Demarcation, Boundary Wall, Utilities, or Full Turnkey Build). Attach plot documents and location pin directly in the app.'
    },
    {
      step: 'Step 2: Technical Site Audit & Formal Quotation',
      details: 'Our senior civil & electrical engineers conduct an on-ground site survey, verify zoning laws, and issue an itemized, transparent cost estimate with verifiable milestone schedules.'
    },
    {
      step: 'Step 3: Heavy Equipment Mobilization & Construction',
      details: 'FES deploys heavy machinery (mixers, tractors, total stations, compaction rollers) and skilled workforce. Every stage adheres to IEEE, NFPA, and local regulatory building codes.'
    },
    {
      step: 'Step 4: Real-Time Milestone Tracking & Digital Handover',
      details: 'Track live progress percentage on your personalized Customer Portal. Receive weekly photo logs, milestone sign-offs, completion certificates, and long-term structural warranty.'
    }
  ];

  steps.forEach((st) => {
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(15, y, pageWidth - 30, 20, 2, 2, 'FD');

    doc.setTextColor(37, 99, 235);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(st.step, 20, y + 6);

    doc.setTextColor(71, 85, 105);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    const splitD = doc.splitTextToSize(st.details, pageWidth - 42);
    doc.text(splitD, 20, y + 11);

    y += 24;
  });

  y += 4;

  // Comprehensive Engineering Scope Table
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('COMPLETE FAST SERVICES ENGINEERING SPECTRUM', 15, y);
  y += 6;

  const servicesTable = [
    ['Civil & Structural EPC', 'Multi-Story Grey Structures, Basements, Warehouses, Water Tanks, Steel Sheds'],
    ['Interior Finishing', 'Marble/Porcelain Tiling, Custom Carpentry, False Ceilings, Restroom & Kitchen Builds'],
    ['Electrical & Power', 'HT/LT Switchgear, Substation Transformers, WAPDA Sanctions, PFI Capacitor Banks'],
    ['Solar & Net-Metering', 'Turnkey On-Grid/Hybrid Solar Plants (5kW to 1MW), Tier-1 Modules, Storage Inverters'],
    ['Genset & Sync Panels', '1 kVA to 1000 kVA Diesel/Gas Generators, ATS/AMF Panels, Multi-Genset Auto Load Sharing'],
    ['Plot Engineering', 'Laser Demarcation, Boundary Walls, Sewerage Infrastructure, Turnkey Plot Construction']
  ];

  servicesTable.forEach(([cat, detail]) => {
    doc.setFillColor(248, 250, 252);
    doc.rect(15, y, 45, 9, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(15, y, 45, 9, 'S');

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(cat, 18, y + 6);

    doc.rect(60, y, pageWidth - 75, 9, 'S');
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    const sDetail = doc.splitTextToSize(detail, pageWidth - 80);
    doc.text(sDetail, 63, y + 5.5);

    y += 9.5;
  });

  y += 6;

  // Official Engineering Seal & Contact Card
  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(15, y, pageWidth - 30, 26, 3, 3, 'FD');

  doc.setTextColor(30, 64, 175);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('DIRECT PLOT CONSULTATION & INSTANT DISPATCH', 20, y + 6);

  doc.setTextColor(51, 65, 85);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Phone / Hotline: +92 300 4545280  |  +92 326 4545222', 20, y + 12);
  doc.text('WhatsApp: +92 300 4545280 (Instant 24/7 Response with pre-filled inquiry)', 20, y + 17);
  doc.text('App Link: https://fast-services-ten.vercel.app/real-estate', 20, y + 22);

  // Footer on Page 2
  doc.setFillColor(15, 23, 42);
  doc.rect(0, pageHeight - 16, pageWidth, 16, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('FAST ENGINEERING SOLUTIONS — Certified General Contractor (Founded 2012)', 15, pageHeight - 9);
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('Web App Architect: AI Engineer Qurat ul Ain Sabir  |  www.fastengineeringsolutions.pk', 15, pageHeight - 4);

  const buffer = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync('public/Fast_Services_Real_Estate_Plot_Brochure.pdf', buffer);
  console.log(`✓ Successfully generated PDF brochure: public/Fast_Services_Real_Estate_Plot_Brochure.pdf (${buffer.length} bytes)`);
}

generateBrochure();
