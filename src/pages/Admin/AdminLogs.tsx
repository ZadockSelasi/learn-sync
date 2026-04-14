import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { 
  Activity, 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  Globe, 
  AlertTriangle,
  LogIn,
  LogOut,
  Target,
  HelpCircle,
  ShieldAlert,
  Calendar,
  User as UserIcon
} from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';

export default function AdminLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'activity_logs'), orderBy('timestamp', 'desc'), limit(100));
      const snap = await getDocs(q);
      const logsData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLogs(logsData);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const getLogIcon = (action: string) => {
    switch (action) {
      case 'login': return (
        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg">
          <LogIn className="w-4 h-4" />
        </div>
      );
      case 'logout': return (
        <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg">
          <LogOut className="w-4 h-4" />
        </div>
      );
      case 'quiz_completed': return (
        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
          <HelpCircle className="w-4 h-4" />
        </div>
      );
      case 'roadmap_created': return (
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
          <Target className="w-4 h-4" />
        </div>
      );
      case 'error': return (
        <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg">
          <ShieldAlert className="w-4 h-4" />
        </div>
      );
      default: return (
        <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg">
          <Activity className="w-4 h-4" />
        </div>
      );
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         log.action?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || log.action === filterType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Activity Logs</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Audit trail of all system events and user actions.</p>
      </div>

      <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search logs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {['all', 'login', 'quiz_completed', 'roadmap_created', 'error'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={clsx(
                  "px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap",
                  filterType === type 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                    : "bg-slate-50 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                )}
              >
                {type.toUpperCase().replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-white/[0.02]">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Event</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">User</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Details</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Timestamp</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-sans">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="group hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      {getLogIcon(log.action)}
                      <span className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                        {log.action.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center mr-3">
                        <UserIcon className="w-4 h-4 text-slate-500" />
                      </div>
                      <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {log.userEmail || 'Anonymous'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-xs text-slate-500 dark:text-slate-500 max-w-xs truncate">
                      {log.metadata ? JSON.stringify(log.metadata) : 'No metadata available'}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {log.timestamp ? format(log.timestamp.toDate(), 'h:mm:ss a') : 'Now'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {log.timestamp ? format(log.timestamp.toDate(), 'MMM d, yyyy') : '-'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className={clsx(
                      "inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter",
                      log.action === 'error' 
                        ? "bg-red-50 dark:bg-red-900/20 text-red-600" 
                        : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600"
                    )}>
                      {log.action === 'error' ? 'Failed' : 'Success'}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                   <td colSpan={5} className="px-6 py-20 text-center text-slate-400 italic">
                     No event logs found matching your criteria.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
