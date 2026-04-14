import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logOut } from '../firebase';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { 
  BarChart3, 
  Users, 
  Activity, 
  Settings, 
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import clsx from 'clsx';

export const AdminLayout: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logOut();
    navigate('/login');
  };

  const navItems = [
    { name: 'Overview', path: '/admin', icon: BarChart3 },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Auth Logs', path: '/admin/logs', icon: Activity },
    { name: 'Platform Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-300">
      {/* Admin Sidebar */}
      <aside className="hidden lg:flex w-72 bg-white dark:bg-[#111827]/80 backdrop-blur-xl border-r border-slate-200 dark:border-white/5 flex-col z-20 transition-colors duration-300">
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">Admin</h1>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">Control Panel</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto custom-scrollbar">
          <div className="mb-4">
             <NavLink
              to="/dashboard"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Learner Dashboard
            </NavLink>
          </div>

          <p className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3 mt-6">Main Menu</p>
          
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                clsx(
                  'flex items-center px-3 py-3 text-sm font-bold rounded-xl transition-all duration-200 group',
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={clsx(
                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200",
                    isActive ? "text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                  )} />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 m-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
          <div className="flex items-center mb-3 relative z-10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold mr-3 shadow-md border border-white/20">
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-200 truncate">
                {user?.displayName || 'Admin'}
              </p>
              <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-black uppercase">System Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center px-3 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-all border border-transparent hover:border-red-100 dark:hover:border-red-500/20 group"
          >
            <LogOut className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Sign Out Securely
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col bg-slate-50 dark:bg-[#0B0F19]">
        {/* Header */}
        <header className="bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 px-8 py-4 flex justify-between items-center sticky top-0 z-30 transition-colors duration-300">
           <div className="flex lg:hidden items-center space-x-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Logo className="w-6 h-6" />
          </div>
          <div className="hidden lg:block">
             <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 flex items-center">
               Admin <span className="mx-2 opacity-30">/</span> <span className="text-slate-900 dark:text-white">{navItems.find(item => location.pathname === item.path || (item.path === '/admin' && location.pathname === '/admin'))?.name || 'Dashboard'}</span>
             </h2>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden" 
            onClick={() => setIsMobileMenuOpen(false)} 
          />
        )}

        {/* Mobile Drawer */}
        <div className={clsx(
          "fixed inset-y-0 left-0 w-80 bg-white dark:bg-[#111827] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col border-r border-slate-200 dark:border-white/5",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-6 border-b border-slate-200 dark:border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Admin</h1>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/admin'}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center px-4 py-4 text-base font-bold rounded-2xl transition-all duration-200',
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                  )
                }
              >
                <item.icon className="mr-4 h-6 w-6" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="max-w-7xl mx-auto p-4 md:p-8 w-full min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
