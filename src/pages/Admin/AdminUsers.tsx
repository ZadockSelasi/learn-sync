import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  UserCheck, 
  UserX, 
  Shield, 
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  User as UserIcon
} from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended'>('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const usersData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (user: any) => {
    try {
      const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
      await updateDoc(doc(db, 'users', user.id), { status: newStatus });
      setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const changeUserRole = async (user: any, newRole: 'admin' | 'user') => {
    try {
      await updateDoc(doc(db, 'users', user.id), { role: newRole });
      setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'active' && user.status !== 'suspended') ||
      (filterStatus === 'suspended' && user.status === 'suspended');

    return matchesSearch && matchesStatus;
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">User Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and moderate platform members.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-indigo-500/20 hover:scale-105 transition-transform">
            Invite New Admin
          </button>
        </div>
      </div>

      {/* Filters Table Card */}
      <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
              {(['all', 'active', 'suspended'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={clsx(
                    "px-4 py-2 text-xs font-bold rounded-lg transition-all capitalize",
                    filterStatus === status 
                      ? "bg-white dark:bg-slate-800 text-indigo-600 shadow-sm" 
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
            <button className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl text-slate-500 hover:text-indigo-600 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-white/[0.02]">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">User</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Auth Method</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Joined</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="group hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm">
                          {user.photoURL ? (
                            <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                          )}
                        </div>
                        <div className={clsx(
                          "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900",
                          user.status === 'suspended' ? "bg-red-500" : "bg-emerald-500"
                        )}></div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                          {user.displayName || 'Unnamed User'}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={clsx(
                      "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border",
                      user.role === 'admin' 
                        ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20" 
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/5"
                    )}>
                      {user.role === 'admin' ? <ShieldCheck className="w-3 h-3 mr-1.5" /> : <Shield className="w-3 h-3 mr-1.5 opacity-50" />}
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center text-xs font-bold text-slate-600 dark:text-slate-400">
                      {user.loginMethod === 'google' ? (
                        <span className="flex items-center bg-blue-50 dark:bg-blue-900/20 text-blue-600 px-2 py-1 rounded-lg">
                          <svg className="h-3 w-3 mr-1.5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                          </svg>
                          Google
                        </span>
                      ) : (
                        <span className="flex items-center bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 px-2 py-1 rounded-lg">
                          <Mail className="h-3 w-3 mr-1.5" />
                          Email
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center">
                      <Calendar className="w-3 h-3 mr-1.5 opacity-50" />
                      {user.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => toggleUserStatus(user)}
                        title={user.status === 'suspended' ? "Activate User" : "Suspend User"}
                        className={clsx(
                          "p-2 rounded-xl transition-all",
                          user.status === 'suspended' 
                            ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 hover:bg-emerald-100" 
                            : "bg-red-50 dark:bg-red-500/10 text-red-600 hover:bg-red-100"
                        )}
                      >
                        {user.status === 'suspended' ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                      </button>
                      
                      <button 
                        onClick={() => changeUserRole(user, user.role === 'admin' ? 'user' : 'admin')}
                        title={user.role === 'admin' ? "Make Regular User" : "Promote to Admin"}
                        className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all"
                      >
                        <Shield className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-500 italic">
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
           <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
             Showing {filteredUsers.length} of {users.length} users
           </p>
           <div className="flex gap-2">
             <button disabled className="p-2 border border-slate-200 dark:border-white/10 rounded-xl text-slate-400 disabled:opacity-50">
               <ChevronLeft className="w-5 h-5" />
             </button>
             <button disabled className="p-2 border border-slate-200 dark:border-white/10 rounded-xl text-slate-400 disabled:opacity-50">
               <ChevronRight className="w-5 h-5" />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}
