'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  Building2,
  MapPin,
  CheckCircle2,
  Phone,
  MessageSquare,
  ShieldCheck,
  Compass,
  Layers,
  Wrench,
  Sparkles,
  ArrowRight,
  TrendingUp,
  X,
  FileCheck,
  Zap,
  HardHat
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface PlotItem {
  id: string;
  title: string;
  category: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'FARMHOUSE';
  location: string;
  size: string;
  priceTag: string;
  image: string;
  description: string;
  servicesAvailable: string[];
  tag: string;
}

const plotListings: PlotItem[] = [
  {
    id: 'plot-1',
    title: '10 Marla & 1 Kanal Prime Residential Plots',
    category: 'RESIDENTIAL',
    location: 'LDA Avenue 1, Raiwind Road, Lahore',
    size: '10 Marla / 1 Kanal (250 - 500 Sq Yards)',
    priceTag: 'Prime Location',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    description: 'Fully developed sector near main boulevard. FES provides certified plot demarcation, soil testing, solid boundary walling, and complete turnkey modern villa construction.',
    servicesAvailable: ['Plot Demarcation & Soil Testing', 'Boundary Wall & Gate Setup', '3D Architectural Blueprint', 'Turnkey House Construction'],
    tag: 'Ready for Construction'
  },
  {
    id: 'plot-2',
    title: '5 & 10 Marla Residential Plots',
    category: 'RESIDENTIAL',
    location: 'Al Jannat Ul Firdous Society, Lahore',
    size: '5 Marla & 10 Marla',
    priceTag: 'Rapidly Developing',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    description: 'Directly adjacent to LDA Avenue 1 on Raiwind Road. Ideal for immediate residential development with underground electricity and sewerage works executed by FES.',
    servicesAvailable: ['Underground Utility Connections', 'RCC Basement Excavation', 'Grey Structure Construction', 'Interior Finishing & Tiling'],
    tag: 'High Investment Yield'
  },
  {
    id: 'plot-3',
    title: '4 & 8 Marla Commercial Plaza Plots',
    category: 'COMMERCIAL',
    location: 'Main Boulevard Commercial Zone, Lahore',
    size: '4 Marla & 8 Marla (Commercial)',
    priceTag: 'High Footfall Zone',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    description: 'Approved commercial plots for multi-story business centers and retail plazas. FES delivers heavy piling, RCC grey structure, transformer substation, and commercial electrification.',
    servicesAvailable: ['Multi-Story Plaza Construction', 'HT/LT Transformer Substation', 'Passenger Lift Structural Shafts', 'Fire Safety & Earth Pits'],
    tag: 'Commercial Grade'
  },
  {
    id: 'plot-4',
    title: '1 Kanal & 2 Kanal Luxury Villa Plots',
    category: 'RESIDENTIAL',
    location: 'DHA Phase 6 / Phase 7, Lahore',
    size: '1 Kanal & 2 Kanal (500 - 1000 Sq Yards)',
    priceTag: 'Ultra Luxury Sector',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
    description: 'High-end residential plots. FES provides bespoke architectural planning, premium marble finishing, solar plant installation, and smart home automation.',
    servicesAvailable: ['Certified Land Surveying', 'Turnkey Luxury Villa EPC', 'Rooftop Solar Plant (On-Grid)', 'Custom Architectural Woodwork'],
    tag: 'Executive Plots'
  },
  {
    id: 'plot-5',
    title: '2 to 10 Acres Industrial & Logistics Land',
    category: 'INDUSTRIAL',
    location: 'Sundar Industrial Estate / Multan Road, Lahore',
    size: '2 to 10 Acres Industrial Zones',
    priceTag: 'Industrial Hub',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    description: 'Heavy industrial land for manufacturing units and storage facilities. FES delivers turnkey warehouse steel sheds, heavy generator pads, and industrial electrical infrastructure.',
    servicesAvailable: ['Industrial Warehouse Construction', 'Pre-Engineered Steel Sheds', 'Industrial Genset & Transformer', 'Heavy Concrete Flooring'],
    tag: 'Industrial Approval'
  },
  {
    id: 'plot-6',
    title: '4 to 8 Kanal Green Farmhouse Land',
    category: 'FARMHOUSE',
    location: 'Bedian Road & Barki Road, Lahore',
    size: '4 Kanal & 8 Kanal Land Parcels',
    priceTag: 'Scenic Environment',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    description: 'Sprawling land for luxury farmhouses and retreats. FES offers perimeter security walling, tube well boring, solar tube well power setups, swimming pools, and country homes.',
    servicesAvailable: ['Perimeter Security Enclosure', 'Solar Tube Well & Irrigation', 'Swimming Pool & Decking', 'Eco-Friendly Farmhouse Build'],
    tag: 'Serene Living'
  }
];

export default function RealEstatePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPlot, setSelectedPlot] = useState<PlotItem | null>(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  // Inquiry Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedService, setSelectedService] = useState('Plot Demarcation & Surveying');
  const [plotNotes, setPlotNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const filteredPlots = selectedCategory === 'ALL'
    ? plotListings
    : plotListings.filter((p) => p.category === selectedCategory);

  const handleOpenInquiry = (plot?: PlotItem) => {
    if (plot) setSelectedPlot(plot);
    setShowInquiryModal(true);
    setIsSubmitted(false);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Build WhatsApp message
    const msg = `Hello FAST Engineering Solutions! I am inquiring about Real Estate & Plot Services.%0A%0A*Name:* ${encodeURIComponent(customerName)}%0A*Phone:* ${encodeURIComponent(customerPhone)}%0A*Service Required:* ${encodeURIComponent(selectedService)}%0A*Plot Details:* ${encodeURIComponent(selectedPlot ? selectedPlot.title + ' (' + selectedPlot.location + ')' : 'General Plot Inquiry')}%0A*Notes:* ${encodeURIComponent(plotNotes)}`;
    window.open(`https://wa.me/923004545280?text=${msg}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 border-b border-slate-800">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Real Estate & Plot Engineering Solutions</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
                Turnkey Plot Development & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-amber-400">Construction Services</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                From certified plot demarcation, soil testing, and solid boundary walls to underground utility networks and turnkey building construction. FAST Engineering Solutions empowers property owners and developers across Pakistan.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={() => handleOpenInquiry()}
                  className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2"
                >
                  <span>Inquire for Your Plot</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="https://wa.me/923004545280?text=Hello%20Fast%20Engineering%20Solutions,%20I%20need%20plot%20development%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-bold text-sm transition-all flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Consultant</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Engineering Services for Plots Grid */}
        <section className="py-16 bg-slate-950 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Engineering Scope</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">What We Build On Your Plots</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                Certified engineering, heavy machinery, and skilled labor for end-to-end land development.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Compass,
                  title: 'Plot Demarcation & Soil Testing',
                  desc: 'Precision laser demarcation, boundary verification, topographic land survey, and laboratory soil load-bearing analysis.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Solid Boundary Walls & Gates',
                  desc: 'Reinforced brick/block boundary walls, foundation damp-proofing, and custom fabricated heavy metal security gates.',
                },
                {
                  icon: Layers,
                  title: 'Underground Utilities Infrastructure',
                  desc: 'Complete underground water piping, sewerage drainage lines, manhole construction, and electrical cable conduit routing.',
                },
                {
                  icon: Zap,
                  title: 'Substations & Electrical Supply',
                  desc: 'High/low voltage electrical poles, dedicated transformer installations, WAPDA load sanctioning, and street lighting.',
                },
                {
                  icon: HardHat,
                  title: 'Roads, Paver Blocks & Levelling',
                  desc: 'Tractor-trolley land levelling, compaction, asphalt & concrete road construction with kerb stones and walk paths.',
                },
                {
                  icon: Building2,
                  title: 'Turnkey House & Plaza Construction',
                  desc: 'Complete architectural blueprints, 3D elevations, grey structure construction, and high-end luxury interior finishing.',
                },
              ].map((svc, i) => {
                const Icon = svc.icon;
                return (
                  <div
                    key={i}
                    className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition-all space-y-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white">{svc.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{svc.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Plots & Societies Showcase */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Available Locations & Projects</span>
              <h2 className="text-2xl sm:text-4xl font-black text-white mt-1">Featured Plots & Development Areas</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl">
                Explore prime sectors where FAST Engineering Solutions actively provides plot development, utility setups, and turnkey building works.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              {['ALL', 'RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'FARMHOUSE'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Plots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPlots.map((plot) => (
              <div
                key={plot.id}
                className="group bg-slate-950 rounded-3xl border border-slate-800 hover:border-slate-700 overflow-hidden shadow-xl flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="relative h-56 w-full overflow-hidden">
                    <img
                      src={plot.image}
                      alt={plot.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-600/90 text-white backdrop-blur-md">
                        {plot.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                        {plot.tag}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-300">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                        {plot.location}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <div className="text-[11px] font-mono text-amber-400 font-bold uppercase">{plot.size}</div>
                      <h3 className="text-lg font-bold text-white mt-1 group-hover:text-blue-400 transition-colors">
                        {plot.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        {plot.description}
                      </p>
                    </div>

                    <div className="space-y-2 border-t border-slate-900 pt-4">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Available FES Services:
                      </div>
                      <div className="space-y-1.5">
                        {plot.servicesAvailable.map((srv, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            <span>{srv}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => handleOpenInquiry(plot)}
                    className="w-full py-3 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 font-bold text-xs transition-all flex items-center justify-center gap-2"
                  >
                    <span>Request Services for this Plot</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Real Estate Contact Hotline Banner */}
        <section className="py-16 bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border-t border-slate-800">
          <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Have a Plot in Any Society Across Pakistan?
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
              We provide complete on-ground engineering support: demarcation, boundary wall construction, utility approvals, 3D architectural elevations, and complete turnkey house construction.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href="tel:03004545280"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-lg shadow-blue-600/30"
              >
                <Phone className="w-4 h-4" />
                <span>Call Hotline: 0300-4545280</span>
              </a>
              <Link
                href="/request?service=real-estate-plot-development"
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all border border-slate-700 flex items-center gap-2"
              >
                <FileCheck className="w-4 h-4 text-blue-400" />
                <span>Submit Online Plot Request</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Plot Service Inquiry Modal */}
      {showInquiryModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-500" />
                  <span>Plot Service & Construction Inquiry</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {selectedPlot ? selectedPlot.title : 'Direct plot development quote'}
                </p>
              </div>
              <button
                onClick={() => setShowInquiryModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isSubmitted ? (
              <div className="py-8 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">Inquiry Forwarded!</h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Your request has been routed to our Real Estate & Plot Engineering specialists. We will contact you immediately.
                </p>
                <button
                  onClick={() => setShowInquiryModal(false)}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Tariq Mehmood"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="0300 1234567"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Service Required on Plot
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Plot Demarcation & Surveying">Plot Demarcation & Soil Testing</option>
                    <option value="Solid Boundary Wall & Gate">Solid Boundary Wall & Security Gate Construction</option>
                    <option value="Underground Utilities Setup">Underground Sewerage, Water & Electrical Setup</option>
                    <option value="Turnkey Grey Structure Construction">Turnkey Grey Structure Construction</option>
                    <option value="Complete Luxury House Build">Complete Luxury House Build (A+ Material)</option>
                    <option value="Commercial Plaza Construction">Commercial Plaza Construction</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Plot Society, Number or Details
                  </label>
                  <textarea
                    rows={3}
                    value={plotNotes}
                    onChange={(e) => setPlotNotes(e.target.value)}
                    placeholder="e.g. LDA Avenue 1 Block C, Plot 240, 10 Marla. Need boundary wall and 3D architectural plan."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send Inquiry to Engineering Team</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
