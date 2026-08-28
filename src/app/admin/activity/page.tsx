'use client';

import React, { useState, useEffect } from 'react';
import { getAuditLogs } from '@/lib/actions/db';
import { AuditLog } from '@/types/database';
import { formatDate, formatDateTime } from '@/lib/utils';
import { Activity, Search, ShieldCheck, Filter, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');
  const [filterEntity, setFilterEntity] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAuditLogs();
      setLogs(data);
    } catch (err: any) {
      console.error(err);
      setError('Unable to load activity logs from database.');
    } finally {
      setIsLoading(false);
    }
  };


  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      (log.actor_name || '').toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.entity_type.toLowerCase().includes(search.toLowerCase());
    const matchesEntity = filterEntity === 'ALL' || log.entity_type === filterEntity;
    return matchesSearch && matchesEntity;
  });

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
          Compliance & Traceability
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
          System Activity & Audit Trail
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Immutable historical audit log tracking administrative modifications, role changes, status progressions, and resource usage.
        </p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={loadLogs}
            className="flex items-center gap-1.5 px-3 py-1 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs font-bold rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Filter & Search */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">

        <div className="flex items-center gap-3 w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by actor name, action, or entity..."
            className="bg-transparent text-white text-xs w-full focus:outline-none placeholder:text-slate-600"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'PROJECT', 'TASK', 'EMPLOYEE', 'CLIENT', 'SERVICE_REQUEST', 'PRODUCT_CONSUMED'].map(
            (ent) => (
              <button
                key={ent}
                onClick={() => setFilterEntity(ent)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  filterEntity === ent
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {ent}
              </button>
            )
          )}
        </div>
      </div>

      {/* Activity Stream */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-xl overflow-hidden divide-y divide-slate-850">
        {filteredLogs.map((log) => (
          <div key={log.id} className="p-5 hover:bg-slate-900/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">{log.actor_name || 'System Admin'}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {log.action}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-amber-400 border border-slate-800">
                  {log.entity_type}
                </span>
              </div>

              <div className="text-slate-400 text-xs">
                {JSON.stringify(log.details)}
              </div>
            </div>

            <div className="text-[10px] text-slate-500 font-mono flex-shrink-0">
              {formatDateTime(log.created_at)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
