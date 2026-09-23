import fs from 'fs';
import path from 'path';
import { jsPDF } from 'jspdf';

const LOGO_PATH = 'C:/Users/SL LAPTOP/.gemini/antigravity/brain/0790ac7e-9e0b-42d6-9d07-859500f2ff36/.user_uploaded/media_1790063049469.jpg';
let logoBase64 = null;

if (fs.existsSync(LOGO_PATH)) {
  logoBase64 = fs.readFileSync(LOGO_PATH).toString('base64');
}

const OUTPUT_DIR = path.resolve('c:/Users/SL LAPTOP/Desktop/fast services/marketing-kit');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Color Palette
const COLORS = {
  navyDark: [11, 25, 44],       // #0B192C
  navyMid: [30, 41, 59],        // #1E293B
  navyLight: [51, 65, 85],      // #334155
  blueAccent: [29, 78, 216],    // #1D4ED8
  blueCyan: [14, 165, 233],     // #0EA5E9
  crimson: [220, 38, 38],       // #DC2626
  gold: [245, 158, 11],         // #F59E0B
  greenSuccess: [16, 185, 129], // #10B981
  white: [255, 255, 255],
  grayBg: [248, 250, 252],      // #F8FAFC
  grayCard: [241, 245, 249],    // #F1F5F9
  grayBorder: [226, 232, 240],  // #E2E8F0
  textDark: [15, 23, 42],       // #0F172A
  textMuted: [100, 116, 139]    // #64748B
};

// Helper: Header bar for multi-page deck
function addDeckHeader(doc, title, subtitle) {
  doc.setFillColor(...COLORS.navyDark);
  doc.rect(0, 0, 210, 22, 'F');
  
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, 'JPEG', 10, 2, 18, 18);
    } catch (e) {}
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.white);
  doc.text('FAST ENGINEERING SOLUTIONS (FES)', 32, 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Smart Digital Platform & Real Estate Engineering', 32, 15);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.gold);
  doc.text(title.toUpperCase(), 200, 12, { align: 'right' });
}

// Helper: Footer bar
function addDeckFooter(doc, pageNum, totalPages) {
  doc.setFillColor(...COLORS.navyDark);
  doc.rect(0, 282, 210, 15, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.white);
  doc.text('T: +92 300 8443912  |  E: fastsales.services@gmail.com  |  W: fast-services-ten.vercel.app', 12, 290);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.gold);
  doc.text(`Page ${pageNum} of ${totalPages}`, 198, 290, { align: 'right' });
}

// Helper: Rounded Card
function drawCard(doc, x, y, w, h, fillColor, borderColor = null, radius = 3) {
  doc.setFillColor(...fillColor);
  if (borderColor) {
    doc.setDrawColor(...borderColor);
    doc.roundedRect(x, y, w, h, radius, radius, 'FD');
  } else {
    doc.roundedRect(x, y, w, h, radius, radius, 'F');
  }
}

// Helper: Badge
function drawBadge(doc, text, x, y, w, h, bgColor, textColor) {
  doc.setFillColor(...bgColor);
  doc.roundedRect(x, y, w, h, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...textColor);
  doc.text(text, x + w / 2, y + h / 2 + 2, { align: 'center' });
}

// Helper: Stylized Phone Mockup (Vector)
function drawPhoneMockup(doc, x, y, w, h, headerText, items) {
  doc.setFillColor(15, 23, 42);
  doc.setDrawColor(51, 65, 85);
  doc.setLineWidth(0.8);
  doc.roundedRect(x, y, w, h, 4, 4, 'FD');

  doc.setFillColor(71, 85, 105);
  doc.roundedRect(x + w / 2 - 6, y + 2, 12, 1.5, 0.7, 0.7, 'F');

  const sx = x + 2.5;
  const sy = y + 5.5;
  const sw = w - 5;
  const sh = h - 9;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(sx, sy, sw, sh, 2, 2, 'F');

  doc.setFillColor(11, 25, 44);
  doc.roundedRect(sx, sy, sw, 8, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text(headerText, sx + sw / 2, sy + 5.5, { align: 'center' });

  let itemY = sy + 11;
  items.forEach((item, idx) => {
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(sx + 2, itemY, sw - 4, 6.5, 1.5, 1.5, 'FD');

    doc.setFillColor(...(item.color || COLORS.blueAccent));
    doc.circle(sx + 4.5, itemY + 3.2, 1.2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.setTextColor(15, 23, 42);
    doc.text(item.title, sx + 7.5, itemY + 3.2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(4.5);
    doc.setTextColor(100, 116, 139);
    doc.text(item.subtitle, sx + 7.5, itemY + 5.5);

    itemY += 7.8;
  });

  doc.setFillColor(148, 163, 184);
  doc.roundedRect(x + w / 2 - 8, y + h - 2.5, 16, 1, 0.5, 0.5, 'F');
}

// 1. MASTER MARKETING & PLOT SALES DECK (6-PAGE PDF)
export function generateMarketingDeck() {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const totalPages = 6;

  // PAGE 1: EXECUTIVE COVER
  doc.setFillColor(...COLORS.navyDark);
  doc.rect(0, 0, 210, 297, 'F');

  doc.setFillColor(...COLORS.crimson);
  doc.rect(0, 0, 8, 297, 'F');

  doc.setFillColor(...COLORS.gold);
  doc.rect(8, 0, 3, 297, 'F');

  if (logoBase64) {
    doc.setFillColor(...COLORS.white);
    doc.roundedRect(25, 30, 48, 48, 4, 4, 'F');
    doc.addImage(logoBase64, 'JPEG', 29, 34, 40, 40);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.gold);
  doc.text('CORPORATE SALES & MARKETING DECK 2026', 82, 42);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...COLORS.white);
  doc.text('FAST SERVICES APP &', 82, 53);
  doc.setTextColor(220, 38, 38);
  doc.text('REAL ESTATE PLOT SALES', 82, 62);
  doc.setTextColor(...COLORS.white);
  doc.text('ACCELERATOR', 82, 71);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(203, 213, 225);
  doc.text('How Our Digital Engineering Platform Helps Plot Owners, Developers', 82, 80);
  doc.text('& Real Estate Agencies Certify, Showcase & Sell Land 3X Faster.', 82, 86);

  const coverCards = [
    { title: 'Smart App Platform', desc: 'Instant bookings, GPS engineer dispatch, and live milestone progress tracking in client hands.' },
    { title: 'Real Estate Plot Portal', desc: '5 Marla to Commercial Acre plots certified with boundary GIS, soil testing & 3D elevations.' },
    { title: 'Turnkey Value Multiplier', desc: 'Instant construction cost estimation that converts raw plot inquiries into closed buyer deals.' },
    { title: 'Nationwide Trust Since 2012', desc: 'PEC-certified engineers, 100+ team strong across Lahore, Karachi, Islamabad & nationwide.' }
  ];

  let cy = 105;
  coverCards.forEach((c, idx) => {
    drawCard(doc, 25, cy, 165, 24, COLORS.navyMid, COLORS.navyLight, 3);
    
    doc.setFillColor(...COLORS.crimson);
    doc.roundedRect(30, cy + 5, 8, 14, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.white);
    doc.text(`0${idx + 1}`, 34, cy + 14, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.white);
    doc.text(c.title, 42, cy + 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(148, 163, 184);
    doc.text(c.desc, 42, cy + 17);

    cy += 28;
  });

  doc.setFillColor(15, 23, 42);
  doc.rect(20, 245, 175, 40, 'F');
  doc.setDrawColor(...COLORS.gold);
  doc.setLineWidth(0.5);
  doc.line(20, 245, 195, 245);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.gold);
  doc.text('EXECUTIVE CONTACT & PLATFORM ACCESS', 25, 254);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.white);
  doc.text('Web App: https://fast-services-ten.vercel.app', 25, 262);
  doc.text('Hotline: +92 300 8443912  |  +92 321 8443912', 25, 268);
  doc.text('Headquarters: Suite 1-2, 2nd Floor, Al-Haram Center, Lahore, Pakistan', 25, 274);
  doc.text('Email: fastsales.services@gmail.com  |  info@fastservices.com', 25, 280);

  // PAGE 2: THE REAL ESTATE & PLOT SALES CHALLENGE
  doc.addPage();
  addDeckHeader(doc, 'Market Analysis', 'The Plot Sales Dilemma');
  addDeckFooter(doc, 2, totalPages);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...COLORS.textDark);
  doc.text('Why Raw Plots Stay Unsold for Months', 15, 33);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.textMuted);
  doc.text('Traditional real estate marketing relies on static phone calls and vague promises. Buyers demand verified technical certainty.', 15, 39);

  const roadblocks = [
    {
      title: '1. Unverified Boundary & Encroachment Fear',
      desc: 'Buyers hesitate to release down payments due to fear of boundary disputes, incorrect survey markers, or missing society approvals.',
      impact: 'Result: 45% of potential buyers drop off during initial negotiation.'
    },
    {
      title: '2. Hidden Soil & Ground Bearing Ambiguity',
      desc: 'Without soil test reports, buyers fear unexpected foundation piling costs, underground water table issues, or structural settling risks.',
      impact: 'Result: Buyers demand steep price discounts to offset unknown risks.'
    },
    {
      title: '3. Inability to Visualize Future Construction',
      desc: 'Buyers see only an empty piece of dirt. They cannot envision the luxury bungalow, commercial plaza, or rental apartments that could be built.',
      impact: 'Result: Extended decision delays and low emotional engagement.'
    },
    {
      title: '4. Lack of Clear Turnkey Budget Transparency',
      desc: 'Prospective buyers have no accurate estimate of total cost (Land + Foundation + Structure + MEP + Finishing), paralyzing purchase decisions.',
      impact: 'Result: Deals stall while buyers seek random external contractor estimates.'
    }
  ];

  let ry = 46;
  roadblocks.forEach((rb) => {
    drawCard(doc, 15, ry, 180, 27, COLORS.grayBg, COLORS.grayBorder, 2.5);

    doc.setFillColor(254, 226, 226);
    doc.roundedRect(18, ry + 3, 5, 21, 1, 1, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.crimson);
    doc.text(rb.title, 26, ry + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.textDark);
    doc.text(rb.desc, 26, ry + 14, { maxWidth: 165 });

    doc.setFont('helvetica', 'bolditalic');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.navyLight);
    doc.text(rb.impact, 26, ry + 22);

    ry += 30;
  });

  drawCard(doc, 15, 172, 180, 102, COLORS.navyDark, null, 3);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...COLORS.gold);
  doc.text('THE FAST SERVICES ADVANTAGE: TURN RAW LAND INTO A HIGH-VALUE ASSET', 22, 184);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(226, 232, 240);
  doc.text('By bundling PEC-certified engineering verification with our live digital tracking app, we transform', 22, 192);
  doc.text('every plot listing into an irresistible, low-risk, ready-to-build investment.', 22, 197);

  const stats = [
    { label: '3X Faster', sub: 'Deal Closing Velocity' },
    { label: '15-20%', sub: 'Higher Plot Valuation' },
    { label: '100% Trust', sub: 'PEC Certified Reports' },
    { label: 'Zero Friction', sub: 'Instant In-App Booking' }
  ];

  let sx = 22;
  stats.forEach((st) => {
    drawCard(doc, sx, 206, 39, 26, COLORS.navyMid, COLORS.navyLight, 2);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...COLORS.gold);
    doc.text(st.label, sx + 19.5, 216, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.white);
    doc.text(st.sub, sx + 19.5, 224, { align: 'center' });
    sx += 42;
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.white);
  doc.text('Target Partners: Real Estate Developers, Housing Societies, Plot Investors & Property Dealers', 22, 243);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Whether managing a single 5 Marla corner plot in DHA or developing an entire 200-Acre residential scheme, Fast Engineering Solutions provides the complete technical and marketing infrastructure.', 22, 250, { maxWidth: 165 });

  // PAGE 3: HOW FES SUPERCHARGES PLOT SALES (PILLARS)
  doc.addPage();
  addDeckHeader(doc, 'Core Solutions', 'Engineered Plot Promotion');
  addDeckFooter(doc, 3, totalPages);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...COLORS.textDark);
  doc.text('The 6-Step Plot Acceleration Engine', 15, 33);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.textMuted);
  doc.text('Comprehensive on-ground engineering paired with digital tools that give your plots an unfair market advantage.', 15, 39);

  const pillars = [
    {
      num: '01',
      title: 'Precision GPS Boundary Demarcation',
      desc: 'Total-station laser surveying and permanent corner pillar installation. Generates a tamper-proof digital coordinate certificate for buyers.',
      badge: 'Zero Boundary Dispute'
    },
    {
      num: '02',
      title: 'Geotechnical Soil & Lab Testing',
      desc: 'Core boring, SPT testing, and certified bearing capacity report (SBC). Guarantees foundation safety for multistory homes or commercial plazas.',
      badge: 'Certified Safe Ground'
    },
    {
      num: '03',
      title: '3D Elevation & Layout Concepts',
      desc: 'Custom modern architectural 3D elevations tailored to the plot dimensions. Enables buyers to see their dream luxury home before buying the plot.',
      badge: 'Instant Buyer Desire'
    },
    {
      num: '04',
      title: 'Turnkey Construction Estimator',
      desc: 'Itemized material & labor estimates for Grey Structure and Premium Finishing. Eliminates budget anxiety and accelerates purchase sign-offs.',
      badge: 'Budget Transparency'
    },
    {
      num: '05',
      title: 'Site Preparation & Boundary Walling',
      desc: 'Heavy grading, jungle clearing, excavation, and perimeter security walling. Transforms messy wild land into a clean, ready-for-construction plot.',
      badge: 'Premium Curb Appeal'
    },
    {
      num: '06',
      title: 'Live App Dispatch & Milestone Tracking',
      desc: 'Client and investor app portal providing real-time photo logs, engineer sign-offs, and downloadable verification dossiers.',
      badge: '100% Digital Visibility'
    }
  ];

  let px = 15;
  let py = 46;
  pillars.forEach((p, idx) => {
    drawCard(doc, px, py, 87, 68, COLORS.grayBg, COLORS.grayBorder, 2.5);

    doc.setFillColor(...COLORS.navyDark);
    doc.circle(px + 8, py + 9, 5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.gold);
    doc.text(p.num, px + 8, py + 11, { align: 'center' });

    drawBadge(doc, p.badge, px + 40, py + 5, 42, 6, [219, 234, 254], COLORS.blueAccent);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...COLORS.navyDark);
    doc.text(p.title, px + 6, py + 22, { maxWidth: 76 });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.8);
    doc.setTextColor(...COLORS.textDark);
    doc.text(p.desc, px + 6, py + 33, { maxWidth: 75, lineHeightFactor: 1.2 });

    doc.setFillColor(...COLORS.greenSuccess);
    doc.circle(px + 8, py + 60, 1.8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(...COLORS.navyLight);
    doc.text('Full Certificate Included', px + 13, py + 61);

    if (idx % 2 === 0) {
      px = 108;
    } else {
      px = 15;
      py += 74;
    }
  });

  // PAGE 4: DIGITAL APP SCREEN SHOWCASE & SMART FEATURES
  doc.addPage();
  addDeckHeader(doc, 'Platform Technology', 'Mobile App & Client Experience');
  addDeckFooter(doc, 4, totalPages);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...COLORS.textDark);
  doc.text('The Fast Services Mobile & Web Application', 15, 33);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.textMuted);
  doc.text('Designed for high velocity: Customers, plot owners, and real estate partners manage everything from their smartphone.', 15, 39);

  drawPhoneMockup(doc, 15, 46, 55, 110, 'FAST SERVICES HUB', [
    { title: 'Real Estate & Plots', subtitle: '5M, 10M, 1K, Plazas', color: COLORS.crimson },
    { title: 'Soil & Demarcation', subtitle: 'Lab Testing & GIS GPS', color: COLORS.blueAccent },
    { title: '3D Elevation Design', subtitle: 'Architectural Renders', color: COLORS.gold },
    { title: 'Turnkey Construction', subtitle: 'Grey + Finishing Specs', color: COLORS.greenSuccess },
    { title: 'Instant Quote Engine', subtitle: 'Real-time PKR Calculator', color: COLORS.blueCyan },
    { title: 'Field Engineer Live', subtitle: '24/7 Verified Dispatch', color: COLORS.navyMid }
  ]);

  drawPhoneMockup(doc, 78, 46, 55, 110, 'PROJECT TRACKER', [
    { title: 'Plot #142 - Sector B', subtitle: 'Boundary Demarcation (Done)', color: COLORS.greenSuccess },
    { title: 'Soil Sample #03', subtitle: 'Lab Density Passed (Done)', color: COLORS.greenSuccess },
    { title: 'Boundary Wall Piling', subtitle: 'Concrete Pouring 85%', color: COLORS.gold },
    { title: 'Turnkey Estimate', subtitle: 'PKR 14.5M Package Ready', color: COLORS.blueAccent },
    { title: 'Download Certificate', subtitle: 'Signed Engineering PDF', color: COLORS.crimson },
    { title: 'WhatsApp Engineer', subtitle: 'Direct Lead Engr Line', color: COLORS.navyLight }
  ]);

  drawPhoneMockup(doc, 140, 46, 55, 110, 'ADMIN COMMAND', [
    { title: 'New Plot Requests', subtitle: '3 Pending Inquiries', color: COLORS.crimson },
    { title: 'Engineer Dispatch', subtitle: '6 Field Teams Active', color: COLORS.blueAccent },
    { title: 'Real-time Reports', subtitle: 'Milestone Auto-Sync', color: COLORS.greenSuccess },
    { title: 'Client Direct Chat', subtitle: 'Instant Quote Delivery', color: COLORS.gold },
    { title: 'Agent Commission', subtitle: 'Tiered Partner Payouts', color: COLORS.blueCyan },
    { title: 'Enterprise Cloud', subtitle: '100% Data Security', color: COLORS.navyMid }
  ]);

  const appFeatures = [
    {
      title: 'Instant 60-Second Booking',
      desc: 'Select plot size, service type, and location. Instant automated pricing and lead engineer assignment.'
    },
    {
      title: 'Verified Digital Dossiers',
      desc: 'One-click downloadable PDF reports for buyers containing soil data, boundary coordinates, and 3D architectural plans.'
    },
    {
      title: 'Live Photo & GPS Progress',
      desc: 'Inspect work from anywhere in the world. Ideal for overseas Pakistani investors purchasing and developing plots.'
    }
  ];

  let afx = 15;
  appFeatures.forEach((af) => {
    drawCard(doc, afx, 164, 57, 52, COLORS.grayBg, COLORS.grayBorder, 2.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.navyDark);
    doc.text(af.title, afx + 5, 178, { maxWidth: 48 });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.textMuted);
    doc.text(af.desc, afx + 5, 188, { maxWidth: 48, lineHeightFactor: 1.25 });

    afx += 62;
  });

  drawCard(doc, 15, 222, 180, 50, COLORS.navyDark, null, 3);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.gold);
  doc.text('ACCESSIBLE ACROSS ALL DEVICES — NO APP STORE DOWNLOAD REQUIRED', 22, 233);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(226, 232, 240);
  doc.text('Fast Services runs as a modern Progressive Web App (PWA). Customers simply open the link on iOS, Android, or desktop to install instantly with full offline synchronization.', 22, 241, { maxWidth: 165 });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.white);
  doc.text('Live Web App: https://fast-services-ten.vercel.app', 22, 258);
  doc.text('Dedicated Real Estate Portal: https://fast-services-ten.vercel.app/real-estate', 22, 264);

  // PAGE 5: PLOT SELLER & AGENT PARTNERSHIP PACKAGES
  doc.addPage();
  addDeckHeader(doc, 'Commercial Offerings', 'Plot Seller & Agent Packages');
  addDeckFooter(doc, 5, totalPages);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...COLORS.textDark);
  doc.text('Commercial Partnership Packages', 15, 33);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.textMuted);
  doc.text('Tailored packages for Individual Plot Owners, Property Dealers, Housing Societies & Developers.', 15, 39);

  const packages = [
    {
      name: 'PLOT VERIFICATION STARTER',
      target: 'Best for Individual Plot Owners',
      color: COLORS.blueAccent,
      price: 'Quick-Sell Certified',
      features: [
        'Total-Station GPS Demarcation',
        'Certified Boundary Marking Pillars',
        'Physical Site Inspection & Geotag',
        'Verified Digital Engineering Dossier',
        'Fast Services App Verification Badge'
      ]
    },
    {
      name: 'PREMIUM BUYER SHOWCASE',
      target: 'Most Popular for High-End Plots',
      color: COLORS.crimson,
      price: 'Maximum Buyer Attraction',
      features: [
        'All Verification Starter Features',
        'Complete Soil Bearing Lab Test (SBC)',
        'Custom 3D Architectural Elevation',
        'Turnkey Construction Costing Sheet',
        'Featured Listing in App Real Estate Hub',
        'Print-Ready Marketing Flyer PDF'
      ]
    },
    {
      name: 'DEVELOPER & SCHEME MASTER',
      target: 'For Housing Schemes & Societies',
      color: COLORS.gold,
      price: 'Full Scale Infrastructure',
      features: [
        'Multi-Acre Layout & Town Planning',
        'Underground Sewerage & Water Supply',
        'Road Grading, Asphalt & Paver Blocks',
        'Electrification & Transformer Yard',
        'Complete Society Sales Deck & App Portal',
        'Dedicated On-Site Project Engineer'
      ]
    }
  ];

  let pbx = 15;
  packages.forEach((pkg) => {
    drawCard(doc, pbx, 46, 57, 142, COLORS.white, COLORS.grayBorder, 3);

    doc.setFillColor(...pkg.color);
    doc.roundedRect(pbx, 46, 57, 24, 3, 3, 'F');
    doc.rect(pbx, 60, 57, 10, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...COLORS.white);
    doc.text(pkg.name, pbx + 28.5, 54, { align: 'center', maxWidth: 52 });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(241, 245, 249);
    doc.text(pkg.target, pbx + 28.5, 63, { align: 'center' });

    doc.setFillColor(248, 250, 252);
    doc.rect(pbx + 1, 71, 55, 14, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...pkg.color);
    doc.text(pkg.price, pbx + 28.5, 79, { align: 'center' });

    let fy = 92;
    pkg.features.forEach((feat) => {
      doc.setFillColor(...pkg.color);
      doc.circle(pbx + 5, fy + 1.5, 1.2, 'F');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(...COLORS.textDark);
      doc.text(feat, pbx + 8, fy + 2.5, { maxWidth: 46 });
      fy += 12;
    });

    doc.setFillColor(...pkg.color);
    doc.roundedRect(pbx + 5, 172, 47, 9, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.white);
    doc.text('Select Package', pbx + 28.5, 178, { align: 'center' });

    pbx += 62;
  });

  drawCard(doc, 15, 195, 180, 78, COLORS.navyMid, COLORS.navyLight, 3);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.gold);
  doc.text('REAL ESTATE AGENT & PROPERTY DEALER PARTNERSHIP PROGRAM', 22, 206);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(226, 232, 240);
  doc.text('Are you an active property dealer, estate agency, or real estate consultant? Partner with Fast Engineering Solutions to earn attractive referral commissions on every engineering survey, 3D design, and construction contract originated through your agency.', 22, 214, { maxWidth: 165 });

  const agentBenefits = [
    { title: 'Generous Referral Payouts', desc: 'Earn lucrative commissions on soil tests, 3D designs, and full turnkey construction projects.' },
    { title: 'Co-Branded Marketing Dossiers', desc: 'Deliver luxury engineering PDFs to your clients featuring both FES and your Agency logo.' },
    { title: 'Exclusive Priority Dispatch', desc: 'Dedicated field engineers dispatched within 24 hours for urgent deal closings.' }
  ];

  let abx = 22;
  agentBenefits.forEach((ab) => {
    drawCard(doc, abx, 228, 51, 38, COLORS.navyDark, COLORS.navyLight, 2);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.white);
    doc.text(ab.title, abx + 4, 236, { maxWidth: 44 });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text(ab.desc, abx + 4, 244, { maxWidth: 44, lineHeightFactor: 1.2 });
    abx += 56;
  });

  // PAGE 6: NATIONWIDE NETWORK, CREDENTIALS & CONTACT CTA
  doc.addPage();
  addDeckHeader(doc, 'Company Profile', 'Nationwide Network & Contact');
  addDeckFooter(doc, 6, totalPages);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...COLORS.textDark);
  doc.text('About Fast Engineering Solutions (FES)', 15, 33);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.textMuted);
  doc.text('Established in 2012, Fast Engineering Solutions has grown into a premier multidisciplinary engineering, construction, and real estate infrastructure firm across Pakistan.', 15, 39, { maxWidth: 180 });

  drawCard(doc, 15, 46, 180, 36, COLORS.grayBg, COLORS.grayBorder, 2.5);

  const corpStats = [
    { label: '2012', sub: 'Established' },
    { label: '500+', sub: 'Projects Completed' },
    { label: '100+', sub: 'Engineers & Staff' },
    { label: '8 Branches', sub: 'Nationwide Network' }
  ];

  let csx = 22;
  corpStats.forEach((cs) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(...COLORS.crimson);
    doc.text(cs.label, csx + 15, 60, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.navyDark);
    doc.text(cs.sub, csx + 15, 68, { align: 'center' });
    csx += 44;
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.navyDark);
  doc.text('Executive Leadership & Engineering Directorate', 15, 92);

  const leaders = [
    { name: 'Abdul Aziz', role: 'Chairman', focus: 'Strategic Vision & Quality Assurance' },
    { name: 'Abdul Manan Aziz', role: 'Chief Executive Officer (CEO)', focus: 'Operations & Business Expansion' },
    { name: 'Abdul Wahid', role: 'Director Operations', focus: 'Field Execution & Site Logistics' }
  ];

  let lx = 15;
  leaders.forEach((ldr) => {
    drawCard(doc, lx, 97, 57, 28, COLORS.grayBg, COLORS.grayBorder, 2);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.navyDark);
    doc.text(ldr.name, lx + 5, 106);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.crimson);
    doc.text(ldr.role, lx + 5, 113);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...COLORS.textMuted);
    doc.text(ldr.focus, lx + 5, 120, { maxWidth: 48 });
    lx += 62;
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.navyDark);
  doc.text('Nationwide Office Network & Service Coverage', 15, 134);

  const offices = [
    { city: 'Lahore (Head Office)', addr: 'Al-Haram Center, Lahore' },
    { city: 'Karachi Office', addr: 'Shahrah-e-Faisal, Karachi' },
    { city: 'Islamabad / Rawalpindi', addr: 'Blue Area, Islamabad' },
    { city: 'Multan Office', addr: 'Bosan Road, Multan' },
    { city: 'Faisalabad Office', addr: 'Jaranwala Road, Faisalabad' },
    { city: 'Peshawar Office', addr: 'University Road, Peshawar' },
    { city: 'Quetta Office', addr: 'Zarghoon Road, Quetta' },
    { city: 'Rahim Yar Khan', addr: 'Model Town, RYK' }
  ];

  let ox = 15;
  let oy = 139;
  offices.forEach((off, idx) => {
    drawCard(doc, ox, oy, 87, 12, COLORS.white, COLORS.grayBorder, 1.5);
    doc.setFillColor(...COLORS.crimson);
    doc.circle(ox + 4, oy + 6, 1.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.navyDark);
    doc.text(off.city, ox + 8, oy + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...COLORS.textMuted);
    doc.text(off.addr, ox + 8, oy + 9.5);

    if (idx % 2 === 0) {
      ox = 108;
    } else {
      ox = 15;
      oy += 14;
    }
  });

  drawCard(doc, 15, 202, 180, 72, COLORS.navyDark, null, 3);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...COLORS.gold);
  doc.text('READY TO ACCELERATE YOUR PLOT SALES OR PROJECT?', 22, 215);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(226, 232, 240);
  doc.text('Contact our commercial team today for a free on-site plot audit, 3D elevation demonstration, or agency partnership onboarding.', 22, 223, { maxWidth: 165 });

  doc.setFillColor(...COLORS.crimson);
  doc.roundedRect(22, 232, 80, 16, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.white);
  doc.text('HOTLINE / WHATSAPP', 26, 239);
  doc.setFontSize(10.5);
  doc.text('+92 300 8443912', 26, 246);

  doc.setFillColor(30, 41, 59);
  doc.roundedRect(106, 232, 80, 16, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.gold);
  doc.text('ONLINE INSTANT BOOKING', 110, 239);
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.white);
  doc.text('fast-services-ten.vercel.app', 110, 246);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Emails: fastsales.services@gmail.com  |  info@fastservices.com', 22, 260);
  doc.text('Office Hours: Monday - Saturday | 9:00 AM - 7:00 PM PST', 22, 266);

  const deckPath = path.join(OUTPUT_DIR, 'FES_Master_Marketing_and_Plot_Sales_Deck.pdf');
  doc.save(deckPath);
  console.log(`[+] Master Marketing Deck saved to: ${deckPath}`);
}

// 2. REAL ESTATE PLOT SALES AD FLYER (1-PAGE A4 POSTER)
export function generatePlotSalesAdFlyer() {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  doc.setFillColor(...COLORS.navyDark);
  doc.rect(0, 0, 210, 297, 'F');

  doc.setFillColor(...COLORS.crimson);
  doc.rect(0, 0, 210, 6, 'F');

  if (logoBase64) {
    doc.setFillColor(...COLORS.white);
    doc.roundedRect(15, 14, 28, 28, 3, 3, 'F');
    doc.addImage(logoBase64, 'JPEG', 17, 16, 24, 24);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...COLORS.white);
  doc.text('FAST ENGINEERING SOLUTIONS', 48, 23);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.gold);
  doc.text('REAL ESTATE PLOT ACCELERATION & ENGINEERING DIVISION', 48, 29);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('PEC Certified Engineers  |  Est. 2012  |  Nationwide Operations', 48, 35);

  drawCard(doc, 15, 48, 180, 36, [15, 23, 42], COLORS.crimson, 3);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.gold);
  doc.text('ATTENTION PLOT OWNERS, REAL ESTATE DEALERS & HOUSING DEVELOPERS!', 20, 58);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...COLORS.white);
  doc.text('SELL YOUR PLOTS 3X FASTER AT FULL VALUE', 20, 68);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text('Transform raw land into certified, buyer-ready assets with complete engineering backing & 3D visual concepts.', 20, 77);

  const adPillars = [
    {
      title: 'GPS BOUNDARY CERTIFICATE',
      sub: 'Zero Boundary Disputes',
      desc: 'Total-station laser survey with permanent demarcation pillars & tamper-proof coordinate certification.'
    },
    {
      title: 'LAB SOIL TEST REPORT (SBC)',
      sub: 'Guaranteed Foundation Safety',
      desc: 'Core drilling & laboratory soil bearing analysis to prove ground suitability for immediate construction.'
    },
    {
      title: 'CUSTOM 3D ELEVATION DESIGNS',
      sub: 'Emotional Buyer Attraction',
      desc: 'Show buyers exactly what luxury home or commercial plaza can be built on the plot.'
    },
    {
      title: 'TURNKEY COST CALCULATOR',
      sub: 'Transparent Budgeting',
      desc: 'Instant Grey Structure + Finishing estimate so prospective buyers make quick, confident decisions.'
    }
  ];

  let ay = 90;
  adPillars.forEach((ap, i) => {
    drawCard(doc, 15, ay, 180, 24, COLORS.navyMid, COLORS.navyLight, 2.5);

    doc.setFillColor(...COLORS.crimson);
    doc.roundedRect(18, ay + 3, 10, 18, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.white);
    doc.text(`0${i + 1}`, 23, ay + 14, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.gold);
    doc.text(ap.title, 32, ay + 9);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.white);
    doc.text(`— ${ap.sub}`, 95, ay + 9);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(203, 213, 225);
    doc.text(ap.desc, 32, ay + 16, { maxWidth: 155 });

    ay += 27;
  });

  drawCard(doc, 15, 202, 180, 24, [24, 34, 52], COLORS.blueAccent, 2.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.gold);
  doc.text('SUPPORTED PLOT CATEGORIES & SIZES:', 20, 210);

  const plotSizes = ['5 Marla', '10 Marla', '1 Kanal', '2 Kanal', 'Commercial Plazas', 'Multi-Acre Schemes'];
  let psx = 20;
  plotSizes.forEach((ps) => {
    doc.setFillColor(30, 58, 138);
    doc.roundedRect(psx, 213, 27, 8, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.white);
    doc.text(ps, psx + 13.5, 218.5, { align: 'center' });
    psx += 29;
  });

  drawCard(doc, 15, 232, 180, 52, COLORS.crimson, null, 3);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...COLORS.white);
  doc.text('BOOK YOUR PLOT DEMARCATION & SOIL AUDIT TODAY!', 22, 243);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('Our senior engineering teams are deployed across Lahore, Karachi, Islamabad & nationwide.', 22, 250);

  doc.setFillColor(...COLORS.navyDark);
  doc.roundedRect(22, 256, 75, 20, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.gold);
  doc.text('CALL / WHATSAPP HOTLINE', 26, 263);
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.white);
  doc.text('+92 300 8443912', 26, 271);

  doc.setFillColor(...COLORS.navyDark);
  doc.roundedRect(103, 256, 87, 20, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.gold);
  doc.text('WEB APP & DIGITAL BOOKING', 107, 263);
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.white);
  doc.text('fast-services-ten.vercel.app', 107, 271);

  const flyerPath = path.join(OUTPUT_DIR, 'FES_Plot_Sales_Ad_Flyer.pdf');
  doc.save(flyerPath);
  console.log(`[+] Real Estate Plot Sales Flyer saved to: ${flyerPath}`);
}

// 3. FAST SERVICES APP PROMOTIONAL FLYER (1-PAGE A4 POSTER)
export function generateAppPromoFlyer() {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  doc.setFillColor(...COLORS.navyDark);
  doc.rect(0, 0, 210, 297, 'F');

  doc.setFillColor(...COLORS.blueAccent);
  doc.rect(0, 0, 210, 6, 'F');

  if (logoBase64) {
    doc.setFillColor(...COLORS.white);
    doc.roundedRect(15, 14, 28, 28, 3, 3, 'F');
    doc.addImage(logoBase64, 'JPEG', 17, 16, 24, 24);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...COLORS.white);
  doc.text('FAST SERVICES SMART MOBILE APP', 48, 23);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.gold);
  doc.text('ENGINEERING, CONSTRUCTION & PROPERTY SOLUTIONS ON DEMAND', 48, 29);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Instant Booking  |  Live Milestone Tracking  |  Certified Engineers', 48, 35);

  drawCard(doc, 15, 48, 180, 28, COLORS.navyMid, COLORS.blueAccent, 3);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...COLORS.white);
  doc.text('ONE APP FOR ALL YOUR ENGINEERING & CONSTRUCTION NEEDS', 20, 59);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text('Book PEC-certified civil, MEP, HVAC, solar, and real estate engineering teams directly from your smartphone.', 20, 67);

  drawPhoneMockup(doc, 15, 82, 60, 126, 'FAST SERVICES APP', [
    { title: 'Real Estate & Plots', subtitle: '5M, 10M, 1K Demarcation', color: COLORS.crimson },
    { title: 'Turnkey Construction', subtitle: 'Grey Structure & Finishes', color: COLORS.blueAccent },
    { title: 'Solar PV Systems', subtitle: 'On-Grid & Hybrid 10kW+', color: COLORS.gold },
    { title: 'Commercial HVAC', subtitle: 'Chillers & VRF Ducting', color: COLORS.blueCyan },
    { title: 'Fire Fighting Systems', subtitle: 'NFPA Hydrants & Alarms', color: COLORS.crimson },
    { title: 'MEP Infrastructure', subtitle: 'Water Supply & Sewerage', color: COLORS.navyLight },
    { title: 'Live Project Tracker', subtitle: 'Photos & Milestones', color: COLORS.greenSuccess }
  ]);

  const appPoints = [
    { title: '1. Instant Price Estimation', desc: 'Real-time online cost calculator for plot work, solar, HVAC, and construction.' },
    { title: '2. Live Milestone Photo Tracking', desc: 'Inspect work daily through geotagged photos and certified milestone sign-offs.' },
    { title: '3. 100% Certified Engineers', desc: 'Direct access to Pakistan Engineering Council (PEC) accredited lead engineers.' },
    { title: '4. Instant Digital Reports (PDF)', desc: 'Download soil reports, demarcation maps, and project receipts instantly.' },
    { title: '5. Zero App Store Friction', desc: 'Install directly from your browser as a Progressive Web App (PWA).' }
  ];

  let ry = 82;
  appPoints.forEach((pt) => {
    drawCard(doc, 80, ry, 115, 23, COLORS.navyMid, COLORS.navyLight, 2);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...COLORS.gold);
    doc.text(pt.title, 84, ry + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(226, 232, 240);
    doc.text(pt.desc, 84, ry + 14, { maxWidth: 106 });

    ry += 25.5;
  });

  drawCard(doc, 15, 214, 180, 68, COLORS.navyDark, COLORS.gold, 3);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.gold);
  doc.text('START USING THE APP NOW — OPEN IN ANY SMARTPHONE BROWSER', 22, 226);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.white);
  doc.text('Visit our official web app platform on your phone or computer to experience instant booking:', 22, 234);

  doc.setFillColor(...COLORS.blueAccent);
  doc.roundedRect(22, 240, 166, 12, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...COLORS.white);
  doc.text('https://fast-services-ten.vercel.app', 105, 248, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Direct Hotline: +92 300 8443912  |  WhatsApp: +92 321 8443912  |  Email: fastsales.services@gmail.com', 22, 262);
  doc.text('Fast Engineering Solutions (FES) — 14+ Years of Engineering Excellence Across Pakistan', 22, 272);

  const appFlyerPath = path.join(OUTPUT_DIR, 'FES_App_Promotional_Flyer.pdf');
  doc.save(appFlyerPath);
  console.log(`[+] App Promotional Flyer saved to: ${appFlyerPath}`);
}

// 4. SOCIAL MEDIA & MARKETING COPY GUIDE (MARKDOWN)
export function generateMarketingGuide() {
  const guideContent = `# FAST SERVICES & REAL ESTATE MARKETING KIT
## Personal Marketing, Sales & Advertising Materials

This marketing kit is prepared for your personal business development, real estate partnerships, social media advertising, and client outreach.

---

### 📁 Generated PDF Documents in \`marketing-kit/\`:

1. **\`FES_Master_Marketing_and_Plot_Sales_Deck.pdf\`** (6 Pages)
   - Comprehensive executive presentation with company logo, problem/solution analysis, 6-step plot acceleration engine, visual app mockups, 3 partnership packages, leadership profile, and nationwide office directory.
   - *Use for:* Corporate clients, large plot owners, housing society developers, real estate expo pitches, and investor meetings.

2. **\`FES_Plot_Sales_Ad_Flyer.pdf\`** (1 Page A4 Poster)
   - High-impact promotional ad flyer specifically for selling plots with engineering verification (GPS Demarcation, Soil Test, 3D Elevation, Turnkey Costing).
   - *Use for:* WhatsApp broadcast messages, printed flyers at real estate agencies, Facebook/Instagram ads, and property expo stalls.

3. **\`FES_App_Promotional_Flyer.pdf\`** (1 Page A4 Poster)
   - High-impact app feature flyer highlighting instant online booking, live project tracking, PWA installation, and 8 core engineering services.
   - *Use for:* Promoting the Fast Services App to homeowners, builders, commercial facility managers, and architects.

---

### 📱 Ready-to-Copy Social Media Marketing Copy

#### Campaign 1: Facebook / Instagram Ad for Real Estate & Plot Sellers
> **Headline:** Sell Your Plots 3X Faster with Certified Engineering Backing! 🏡📐
>
> **Body:**
> Are you struggling to sell your residential or commercial plots? Buyers hesitate when they don't know the exact boundaries, soil quality, or construction costs.
> 
> **Fast Engineering Solutions (FES)** turns raw land into certified, high-value assets:
> ✅ **Precision Total-Station GPS Demarcation** (Zero boundary disputes)
> ✅ **Laboratory Soil Bearing Test (SBC)** (Guaranteed foundation safety)
> ✅ **Custom 3D Architectural Elevations** (Let buyers visualize their luxury home)
> ✅ **Turnkey Construction Cost Calculator** (Clear budget transparency)
> ✅ **Live Project & Milestone Tracking App**
>
> 🚀 Give your plots an unfair advantage in today's market.
>
> 📲 **Book a Plot Survey Today:** https://fast-services-ten.vercel.app/real-estate
> 📞 **Direct WhatsApp / Call:** +92 300 8443912
> 
> #RealEstatePakistan #PlotsForSale #DHALahore #PlotDemarcation #SoilTesting #FastServices #PropertyMarketing

---

#### Campaign 2: Real Estate Agent / Property Dealer Partnership Message (WhatsApp)
> 🤝 **Attention Property Dealers & Real Estate Consultants!**
> 
> Partner with **Fast Engineering Solutions (FES)** to close your plot deals 3x faster and earn lucrative referral commissions!
> 
> 🔹 Offer your buyers verified Soil Testing & GPS Demarcation reports.
> 🔹 Provide stunning 3D home elevations for any plot size (5M, 10M, 1K, Commercial).
> 🔹 Deliver co-branded engineering dossiers to boost your agency's credibility.
> 
> 📑 **Download Our Complete Partner Deck:** https://fast-services-ten.vercel.app/Fast_Services_Real_Estate_Plot_Brochure.pdf
> 📲 **Call / WhatsApp to Join:** +92 300 8443912

---

#### Campaign 3: Fast Services App Promotion (General Audience)
> **Headline:** Pakistan's Premier Smart Engineering & Construction App 📱⚡
> 
> Need PEC-certified civil engineers, solar systems, HVAC, fire fighting, or plot survey services?
> 
> With the **Fast Services App**, you can:
> 🔹 Get instant cost estimates in 60 seconds
> 🔹 Track daily site progress with live photos & milestones
> 🔹 Access 14+ years of engineering excellence across 8 nationwide offices
> 
> 📲 **Experience the App Today (No download required):**
> 👉 https://fast-services-ten.vercel.app
> 
> 📞 **Hotline:** +92 300 8443912 | +92 321 8443912
`;

  const guidePath = path.join(OUTPUT_DIR, 'SOCIAL_MEDIA_MARKETING_ADS_KIT.md');
  fs.writeFileSync(guidePath, guideContent, 'utf-8');
  console.log(`[+] Marketing Guide saved to: ${guidePath}`);
}

generateMarketingDeck();
generatePlotSalesAdFlyer();
generateAppPromoFlyer();
generateMarketingGuide();
console.log('=== ALL MARKETING ASSETS GENERATED SUCCESSFULLY ===');
