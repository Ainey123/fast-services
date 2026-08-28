'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileQuickBar } from '@/components/layout/MobileQuickBar';
import { getServices, createServiceRequest } from '@/lib/actions/db';
import { Service, ServiceRequest } from '@/types/database';
import { useAuth } from '@/lib/auth-context';
import {
  MapPin,
  Navigation,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  ShieldCheck,
  Phone,
  Mail,
  User,
  FileText,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

function ServiceRequestForm() {
  const searchParams = useSearchParams();
  const preSelectedServiceId = searchParams.get('service');
  const { user } = useAuth();

  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(preSelectedServiceId || '');
  
  // Form fields
  const [customerName, setCustomerName] = useState(user?.full_name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [description, setDescription] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('10:00 AM');
  const [locationAddress, setLocationAddress] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'detecting' | 'detected' | 'denied'>('idle');
  const [locationMessage, setLocationMessage] = useState('');

  // Image uploads with client-side previews
  const [images, setImages] = useState<{ image_url: string; file_name: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<ServiceRequest | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    getServices(true).then((srvs) => {
      setServices(srvs);
      if (!selectedServiceId && srvs.length > 0) {
        setSelectedServiceId(srvs[0].id);
      }
    }).catch(console.error);


    if (user) {
      if (!customerName) setCustomerName(user.full_name);
      if (!customerEmail) setCustomerEmail(user.email);
      if (!customerPhone && user.phone) setCustomerPhone(user.phone);
    }

    // Set default tomorrow date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setPreferredDate(tomorrow.toISOString().split('T')[0]);
  }, [user]);

  // Handle HTML5 Geolocation with explicit user trigger
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      setLocationMessage('Geolocation is not supported by your browser. Please enter your address manually.');
      return;
    }

    setLocationStatus('detecting');
    setLocationMessage('Requesting GPS location permission...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);
        setLocationStatus('detected');
        setLocationMessage(`Your current location has been detected (${lat.toFixed(4)}, ${lng.toFixed(4)}).`);

        // If address is empty, append coordinates label
        if (!locationAddress) {
          setLocationAddress(`GPS Detected Location (${lat.toFixed(5)}, ${lng.toFixed(5)})`);
        }
      },
      (error) => {
        setLocationStatus('denied');
        setLocationMessage('Location access was not granted. You can enter your address manually.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Handle File Uploads (Photos)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} exceeds 5MB limit.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setImages((prev) => [
            ...prev,
            {
              image_url: uploadEvent.target!.result as string,
              file_name: file.name,
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!customerName || !customerPhone || !customerEmail || !selectedServiceId || !description || !locationAddress) {
      setFormError('Please fill in all required fields (Name, Phone, Email, Service, Description, and Address).');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await createServiceRequest({
        service_id: selectedServiceId,
        user_id: user?.id,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        description,
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        location_address: locationAddress,
        latitude: latitude || undefined,
        longitude: longitude || undefined,
        images,
      });

      setSubmittedRequest(created);
    } catch (err: any) {
      setFormError(err.message || 'Something went wrong submitting your request. Please try again or call our hotline.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* If Request Submitted Successfully */}
          {submittedRequest ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-widest text-emerald-600">
                  Submission Confirmed
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  Your Service Request Has Been Submitted Successfully
                </h1>
                <p className="text-slate-600 text-sm mt-2">
                  Our engineering dispatch team has received your ticket and will contact you shortly to confirm schedule.
                </p>
              </div>

              {/* Highlighted Request ID Box */}
              <div className="bg-slate-900 text-white p-6 rounded-2xl max-w-md mx-auto space-y-2 border border-slate-800 shadow-inner">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                  Official Request ID
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-black text-amber-400">
                  {submittedRequest.request_id}
                </div>
                <div className="text-xs text-slate-400">
                  Status:{' '}
                  <span className="px-2 py-0.5 rounded bg-blue-600/30 text-blue-300 font-bold">
                    {submittedRequest.status}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all"
                >
                  Track in Customer Dashboard
                </Link>
                <button
                  onClick={() => {
                    setSubmittedRequest(null);
                    setDescription('');
                    setImages([]);
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-sm transition-colors"
                >
                  Submit Another Request
                </button>
              </div>
            </div>
          ) : (
            /* Main Service Request Booking Form */
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              {/* Form Banner */}
              <div className="bg-slate-950 text-white p-6 sm:p-8 border-b border-slate-800">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" /> Fast Engineering Dispatch
                </div>
                <h1 className="text-2xl sm:text-3xl font-black">
                  Book an Engineering Service Request
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm mt-1">
                  Fill out the form below. We will assign a certified engineer and dispatch prompt support.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
                {formError && (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Section 1: Customer Information */}
                <div>
                  <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>1. Customer & Contact Details</span>
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Full Name / Company <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Tariq Mehmood"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="e.g. +92 300 1234567"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="e.g. name@company.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Service & Requirements */}
                <div>
                  <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>2. Service Selection & Scope</span>
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div className="sm:col-span-3">
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Select Engineering Service <span className="text-rose-500">*</span>
                      </label>
                      <select
                        required
                        value={selectedServiceId}
                        onChange={(e) => setSelectedServiceId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                      >
                        {services.map((srv) => (
                          <option key={srv.id} value={srv.id}>
                            {srv.name} ({srv.category})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Preferred Date <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Preferred Time Slot <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                      >
                        <option value="09:00 AM">09:00 AM - 12:00 PM (Morning)</option>
                        <option value="01:00 PM">01:00 PM - 04:00 PM (Afternoon)</option>
                        <option value="05:00 PM">05:00 PM - 08:00 PM (Evening)</option>
                        <option value="Emergency (Immediate)">Emergency (Immediate Dispatch)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Description & Work Requirements <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the issue, work scope, machinery details, or site conditions..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    ></textarea>
                  </div>
                </div>

                {/* Section 3: Location Feature with GPS */}
                <div>
                  <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span>3. Job Site Location</span>
                    </span>

                    {/* Geolocation Button */}
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      disabled={locationStatus === 'detecting'}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-all"
                    >
                      <Navigation className={`w-3.5 h-3.5 ${locationStatus === 'detecting' ? 'animate-spin' : ''}`} />
                      <span>{locationStatus === 'detecting' ? 'Detecting GPS...' : 'Use My Current Location'}</span>
                    </button>
                  </h2>

                  {/* Location feedback alert */}
                  {locationStatus !== 'idle' && (
                    <div
                      className={`p-3 rounded-xl mb-3 text-xs flex items-center justify-between ${
                        locationStatus === 'detected'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      <span>{locationMessage}</span>
                      {latitude && longitude && (
                        <a
                          href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold underline flex items-center gap-1 text-emerald-900 ml-2"
                        >
                          <span>Open in Google Maps</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Street Address / Site Location <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={locationAddress}
                      onChange={(e) => setLocationAddress(e.target.value)}
                      placeholder="e.g. Factory Plot #45, Manga Mandi Industrial Estate, Lahore"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      You can manually enter the address or use the GPS detection button above.
                    </p>
                  </div>
                </div>

                {/* Section 4: Image Uploads */}
                <div>
                  <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-blue-600" />
                    <span>4. Upload Site Photos / Issue Images (Optional)</span>
                  </h2>

                  <div className="border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-2xl p-6 text-center transition-colors">
                    <input
                      type="file"
                      ref={fileInputRef}
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-700">
                      Upload photos showing the problem, site or machinery
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      PNG, JPG, JPEG up to 5MB each
                    </p>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-3 px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                    >
                      Browse Photos
                    </button>
                  </div>

                  {/* Uploaded Images Thumbnails */}
                  {images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {images.map((img, index) => (
                        <div
                          key={index}
                          className="relative h-24 rounded-xl overflow-hidden border border-slate-200 group bg-slate-100"
                        >
                          <img
                            src={img.image_url}
                            alt={img.file_name}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity"
                            aria-label="Remove image"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <div className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[10px] text-white px-1.5 py-0.5 truncate">
                            {img.file_name}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Your location and information are encrypted and never shared publicly.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Service Request</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <MobileQuickBar />
    </div>
  );
}

export default function ServiceRequestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
      <ServiceRequestForm />
    </Suspense>
  );
}
