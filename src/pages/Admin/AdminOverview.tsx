import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, query, getDocs, limit, orderBy } from 'firebase/firestore';
import { 
  Users, 
  Activity, 
  Clock, 
  TrendingUp,
  UserCheck,
  UserMinus,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';

export default function AdminOverview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    suspendedUsers: 0,
    totalLogs: 0
  });
  const [activityData, setActivityData] = useState<any[]>([]);
  const [loginMethodData, setLoginMethodData] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch all users for high-level stats
        const usersSnap = await getDocs(collection(db, 'users'));
        const users = usersSnap.docs.map(doc => doc.data());
        
        const active = users.filter(u => u.status !== 'suspended').length;
        const suspended = users.length - active;

        // Fetch logs
        const logsQ = query(collection(db, 'activity_logs'), orderBy('timestamp', 'desc'), limit(50));
        const logsSnap = await getDocs(logsQ);
        const logs = logsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setStats({
          totalUsers: users.length,
          activeUsers: active,
          suspendedUsers: suspended,
          totalLogs: logsSnap.size
        });

        // Prepare Area Chart Data (Activity over last 7 days)
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = subDays(new Date(), i);
          return {
            name: format(date, 'MMM d'),
            fullDate: format(date, 'yyyy-MM-dd'),
            count: 0
          };
        }).reverse();

        logs.forEach((log: any) => {
          if (log.timestamp) {
            const dateStr = format(log.timestamp.toDate(), 'yyyy-MM-dd');
            const day = last7Days.find(d => d.fullDate === dateStr);
            if (day) day.count++;
          }
        });
        setActivityData(last7Days);

        // Prepare Pie Chart Data (Login Methods)
        const methods = { google: 0, email: 0 };
        users.forEach((u: any) => {
          if (u.loginMethod === 'google') methods.google++;
          else methods.email++;
        });
        
        setLoginMethodData([
          { name: 'Google', value: methods.google, color: '#4F46E5' },
          { name: 'Email', value: methods.email, color: '#10B981' }
        ]);

        setRecentActivities(logs.slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

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
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Overview</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time platform performance and user engagement metrics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', trend: '+12%', positive: true },
          { label: 'Active Users', value: stats.activeUsers, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', trend: '+5%', positive: true },
          { label: 'Suspended', value: stats.suspendedUsers, icon: UserMinus, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', trend: '-2%', positive: true },
          { label: 'Activity Logs', value: stats.totalLogs, icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', trend: '+24%', positive: true },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-lg ${stat.positive ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'bg-red-50 dark:bg-red-900/20 text-red-600'}`}>
                {stat.positive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111827] p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Activity Trends</h3>
            <select className="bg-slate-50 dark:bg-white/5 border-none text-sm font-bold rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 500 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 500 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#818CF8', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Login Methods Chart */}
        <div className="bg-white dark:bg-[#111827] p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8">Auth Distribution</h3>
          <div className="h-80 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={loginMethodData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {loginMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.totalUsers}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Users</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {loginMethodData.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span className="font-medium text-slate-600 dark:text-slate-400">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{Math.round((item.value / stats.totalUsers) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity List */}
        <div className="bg-white dark:bg-[#111827] p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Activity</h3>
            <button className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">View All</button>
          </div>
          <div className="space-y-6">
            {recentActivities.map((log: any, i) => (
              <div key={i} className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mr-4 flex-shrink-0">
                  <Activity className="w-5 h-5 text-slate-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {log.userEmail || 'Anonymous'} <span className="font-medium text-slate-500 dark:text-slate-400">performed</span> {log.action.replace('_', ' ')}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    {log.timestamp ? format(log.timestamp.toDate(), 'h:mm a · MMM d, yyyy') : 'Just now'}
                  </p>
                </div>
              </div>
            ))}
            {recentActivities.length === 0 && (
              <p className="text-center text-slate-500 py-4 italic">No activity logs found yet.</p>
            )}
          </div>
        </div>

        {/* Quick Insights */}
         <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-3xl shadow-xl shadow-indigo-500/20 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
           <TrendingUp className="w-12 h-12 text-white/30 mb-6" />
           <h3 className="text-2xl font-black text-white mb-2">Platform Insight</h3>
           <p className="text-white/80 leading-relaxed mb-6">User engagement is up by 24% this week. Most users are signing in via Google, indicating a preference for frictionless auth.</p>
           <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white font-bold">Goal Progress</span>
                <span className="text-white/60 text-xs">85% Targeted</span>
              </div>
              <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white w-[85%] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
              </div>
           </div>
         </div>
      </div>
    </div>
  );
}
