import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { 
  Settings, 
  Save, 
  ToggleRight, 
  Eye, 
  EyeOff, 
  MessageSquare, 
  Smartphone, 
  Shield, 
  Globe,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import clsx from 'clsx';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [config, setConfig] = useState({
    featureToggles: {
      enableAiChat: true,
      enableRoadmap: true,
      enableQuizzes: true,
      maintenanceMode: false
    },
    onboarding: {
      requireMajor: true,
      requireYear: true,
      skippedForExisting: false
    },
    platform: {
      siteName: 'LearnSync',
      contactEmail: 'support@learnsync.edu',
      allowPublicSignup: true
    }
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'system', 'config');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setConfig(docSnap.data() as any);
      }
    } catch (error) {
      console.error("Error fetching config:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await setDoc(doc(db, 'system', 'config'), config);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 3000);
    } catch (error) {
      console.error("Error saving config:", error);
    } finally {
      setSaving(false);
    }
  };

  const toggleFeature = (category: keyof typeof config, feature: string) => {
    setConfig(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] as any),
        [feature]: !(prev[category] as any)[feature]
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">System Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Configure platform behavior and feature availability.</p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {showSaved && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Settings saved successfully!</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Feature Toggles */}
        <section className="bg-white dark:bg-[#111827] p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
              <ToggleRight className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Feature Toggles</h2>
          </div>
          
          <div className="space-y-4">
            {Object.entries(config.featureToggles).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Enable/disable this functionality.</p>
                </div>
                <button
                  onClick={() => toggleFeature('featureToggles', key)}
                  className={clsx(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ring-2 ring-offset-2 ring-transparent focus:ring-indigo-500 dark:ring-offset-[#111827]",
                    value ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"
                  )}
                >
                  <span className={clsx(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    value ? "translate-x-6" : "translate-x-1"
                  )} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Onboarding Settings */}
        <section className="bg-white dark:bg-[#111827] p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <Smartphone className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Onboarding</h2>
          </div>
          
          <div className="space-y-4">
             {Object.entries(config.onboarding).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Registration step controls.</p>
                </div>
                <button
                  onClick={() => toggleFeature('onboarding', key)}
                  className={clsx(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    value ? "bg-purple-600" : "bg-slate-300 dark:bg-slate-700"
                  )}
                >
                  <span className={clsx(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    value ? "translate-x-6" : "translate-x-1"
                  )} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Global Platform Info */}
        <section className="md:col-span-2 bg-white dark:bg-[#111827] p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
              <Globe className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Platform Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Site Name</label>
              <input 
                type="text" 
                value={config.platform.siteName}
                onChange={(e) => setConfig({...config, platform: {...config.platform, siteName: e.target.value}})}
                className="w-full px-5 py-3 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Support Email</label>
              <input 
                type="email" 
                value={config.platform.contactEmail}
                onChange={(e) => setConfig({...config, platform: {...config.platform, contactEmail: e.target.value}})}
                className="w-full px-5 py-3 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
              />
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <Shield className="w-5 h-5 text-slate-400" />
               <p className="text-sm text-slate-500">Security & Global Data Access Control</p>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-xs font-bold text-slate-400 uppercase">Allow Signups</span>
               <button
                  onClick={() => toggleFeature('platform', 'allowPublicSignup')}
                  className={clsx(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    config.platform.allowPublicSignup ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"
                  )}
                >
                  <span className={clsx(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    config.platform.allowPublicSignup ? "translate-x-6" : "translate-x-1"
                  )} />
                </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
