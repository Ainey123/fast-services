import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { jsPDF } from "jspdf";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString?: string): string {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString?: string): string {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

export function generateId(prefix: string, length: number = 6): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * Math.pow(10, length))
    .toString()
    .padStart(length, '0');
  return `${prefix}-${year}-${randomNum}`;
}

export function generateRequestId(): string {
  return generateId('FS', 6);
}

export function getStatusBadgeClass(status: string): string {
  switch (status.toUpperCase()) {
    case 'COMPLETED':
    case 'ACTIVE':
    case 'ACCEPTED':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500/20';
    case 'IN_PROGRESS':
    case 'ASSIGNED':
      return 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-500/20';
    case 'REVIEWING':
    case 'PLANNED':
      return 'bg-purple-50 text-purple-700 border-purple-200 ring-1 ring-purple-500/20';
    case 'PENDING':
    case 'ON_HOLD':
      return 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-500/20';
    case 'CANCELLED':
    case 'INACTIVE':
    case 'BLOCKED':
      return 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-500/20';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
}

export function exportToCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row
        .map((val) => {
          const escaped = `${val ?? ''}`.replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToPDF(title: string, headers: string[], rows: (string | number)[][], subtitle?: string) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42); // Brand navy
  doc.text("FAST ENGINEERING SOLUTIONS", 14, 20);
  
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235); // Brand blue
  doc.text(title, 14, 28);
  
  if (subtitle) {
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(subtitle, 14, 34);
  }

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 40);

  let startY = 48;
  const colWidth = 180 / headers.length;

  // Table Headers
  doc.setFillColor(241, 245, 249);
  doc.rect(14, startY - 5, 182, 8, 'F');
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);

  headers.forEach((header, i) => {
    doc.text(header, 16 + i * colWidth, startY);
  });

  startY += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  rows.forEach((row, rowIndex) => {
    if (startY > 270) {
      doc.addPage();
      startY = 20;
    }
    
    if (rowIndex % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, startY - 4, 182, 7, 'F');
    }

    doc.setTextColor(51, 65, 85);
    row.forEach((cell, i) => {
      const text = `${cell ?? ''}`.substring(0, 28);
      doc.text(text, 16 + i * colWidth, startY);
    });
    startY += 7;
  });

  doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.pdf`);
}
