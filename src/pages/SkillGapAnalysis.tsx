import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { generateSkillGapAnalysis } from '../services/geminiService';
import { motion } from 'motion/react';
import { Target, Loader2, AlertTriangle, CheckCircle2, ArrowRight, BookOpen } from 'lucide-react';

export default function SkillGapAnalysis() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [targetJob, setTargetJob] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, 'careerProfiles', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile(data);
          if (data.dreamJob) {
            setTargetJob(data.dreamJob.split(',')[0].trim());
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [user]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetJob.trim() || !profile) return;

    setLoading(true);
    try {
      const result = await generateSkillGapAnalysis(profile, targetJob);
      setAnalysisData(result);
    } catch (error) {
      console.error("Failed to generate analysis", error);
      alert("Failed to perform skill gap analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans pb-8">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Skill Gap Analysis</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Discover what skills you need to land your dream job.</p>
      </header>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Target className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            </div>
            <input
              type="text"
              value={targetJob}
              onChange={(e) => setTargetJob(e.target.value)}
              placeholder="Target Job Title (e.g., Data Scientist)"
              className="block w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || !targetJob.trim() || !profile}
            className="px-8 py-4 bg-emerald-600 text-white font-semibold rounded-2xl hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          >
            {loading ? <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Analyzing...</> : <><Target className="h-5 w-5 mr-2" /> Analyze Skills</>}
          </button>
        </form>
        {!profile && (
          <p className="mt-4 text-sm text-amber-600 dark:text-amber-400">Please complete your Career Profile first to perform an analysis.</p>
        )}
      </div>

      {analysisData && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Matching Skills */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                Matching Skills
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Skills you already have that are required for {analysisData.targetRole}:</p>
              <div className="flex flex-wrap gap-2">
                {analysisData.matchingSkills?.length > 0 ? (
                  analysisData.matchingSkills.map((skill: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-lg text-sm font-medium">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400 italic">No matching skills found. Time to start learning!</p>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
                Missing Skills
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Critical skills you need to acquire for {analysisData.targetRole}:</p>
              <div className="flex flex-wrap gap-2">
                {analysisData.missingSkills?.length > 0 ? (
                  analysisData.missingSkills.map((skill: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-lg text-sm font-medium">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400 italic">You have all the required skills! You're ready to apply.</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Plan */}
          {analysisData.recommendations && analysisData.recommendations.length > 0 && (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-8">
                <ArrowRight className="h-6 w-6 text-indigo-500" />
                Action Plan & Recommendations
              </h2>
              <div className="space-y-8">
                {analysisData.recommendations.map((rec: any, i: number) => (
                  <div key={i} className="relative pl-8 before:absolute before:left-3 before:top-2 before:bottom-[-2rem] before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700 last:before:hidden">
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center border-2 border-white dark:border-slate-900">
                      <div className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></div>
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{rec.skill}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">{rec.actionPlan}</p>
                    
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                        <BookOpen className="h-4 w-4" /> Recommended Resources
                      </h4>
                      <ul className="space-y-2">
                        {rec.resources.map((res: string, j: number) => (
                          <li key={j} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                            <span className="text-indigo-500 mt-0.5">•</span> {res}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
