import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { auth } from '../firebase';
import { updateProfile, sendPasswordResetEmail, verifyBeforeUpdateEmail } from 'firebase/auth';
import { motion } from 'motion/react';
import { User, Bell, Shield, Key, Save, Loader2, CheckCircle2 } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    if (user?.displayName) {
      setDisplayName(user.displayName);
    }
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      let emailUpdatePending = false;

      if (displayName !== user.displayName) {
        await updateProfile(user, { displayName });
      }

      if (email !== user.email && email.trim() !== '') {
        await verifyBeforeUpdateEmail(user, email);
        emailUpdatePending = true;
      }

      // In a real app, you would also save notifications/email preferences to Firestore here
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);

      if (emailUpdatePending) {
        alert("A verification link has been sent to your new email address. Please check your inbox to complete the update.");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      if (error.code === 'auth/requires-recent-login') {
        alert("Changing your email requires a recent login. Please log out and log back in, then try again.");
      } else {
        alert(error.message || "Failed to update profile.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    try {
      await sendPasswordResetEmail(auth, user.email);
      setResetSent(true);
      setTimeout(() => setResetSent(false), 5000);
    } catch (error) {
      console.error("Error sending password reset:", error);
      alert("Failed to send password reset email. You may have signed in with Google.");
    }
  };

  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <div className="max-w-4xl mx-auto pb-8 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your account preferences and settings.</p>
      </header>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Profile Section */}
        <div className="p-8 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
            <User className="h-5 w-5 mr-2 text-indigo-500" />
            Profile Information
          </h2>
          
          <div className="flex items-center mb-8">
            <div className="h-20 w-20 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-3xl font-bold mr-6 shrink-0">
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{user?.displayName || 'User'}</h3>
              <p className="text-slate-500 dark:text-slate-400">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Display Name</label>
              <input 
                type="text" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="p-8 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
            <Bell className="h-5 w-5 mr-2 text-indigo-500" />
            Preferences
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">Push Notifications</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Receive notifications about study reminders and tasks.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={notifications} onChange={() => setNotifications(!notifications)} />
                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">Email Updates</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Weekly summaries of your learning progress.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={emailUpdates} onChange={() => setEmailUpdates(!emailUpdates)} />
                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">Dark Mode</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Switch to a darker theme for night studying.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={isDarkMode} 
                  onChange={() => setTheme(isDarkMode ? 'light' : 'dark')} 
                />
                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-indigo-500" />
            Security
          </h2>
          
          <div className="space-y-4">
            <button 
              onClick={handlePasswordReset}
              className="flex items-center justify-between w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors group"
            >
              <div className="flex items-center">
                <Key className="h-5 w-5 text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 mr-3" />
                <div className="text-left">
                  <h3 className="font-medium text-slate-900 dark:text-white">Change Password</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Send a password reset email</p>
                </div>
              </div>
              <span className="text-indigo-600 dark:text-indigo-400 font-medium text-sm">
                {resetSent ? 'Email Sent!' : 'Send Email'}
              </span>
            </button>
          </div>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-4">
          {saved && (
            <motion.span 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium text-sm"
            >
              <CheckCircle2 className="h-4 w-4 mr-1" /> Settings saved
            </motion.span>
          )}
          <button 
            onClick={handleSave}
            disabled={loading}
            className="flex items-center px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-70"
          >
            {loading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Save className="h-5 w-5 mr-2" />}
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
