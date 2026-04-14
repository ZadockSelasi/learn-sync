import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, orderBy, doc, getDoc, updateDoc } from 'firebase/firestore';
import { logActivity } from '../services/activityService';
import { generateCareerRoadmap } from '../services/geminiService';
import { motion } from 'motion/react';
import { Target, Loader2, ChevronRight, CheckCircle2, BookOpen, Award, Info, PlayCircle, Star } from 'lucide-react';
import SkillTrackerModal from '../components/SkillTrackerModal';

export default function Roadmap() {
  const { user } = useAuth();
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [activeRoadmap, setActiveRoadmap] = useState<any | null>(null);
  const [activeRoadmapDocId, setActiveRoadmapDocId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  
  // Progress Tracking State
  const [completedSkills, setCompletedSkills] = useState<string[]>([]);
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const [xp, setXp] = useState(0);

  useEffect(() => {
    fetchRoadmaps();
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    try {
      const docRef = doc(db, 'careerProfiles', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserProfile(data);
        if (data.dreamJob) {
          const firstJob = data.dreamJob.split(',')[0].trim();
          if (firstJob) {
            setGoal(prev => prev || firstJob);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching profile", error);
    }
  };

  const fetchRoadmaps = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'roadmaps'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
      setRoadmaps(data);
      if (data.length > 0 && !activeRoadmap) {
        setActiveRoadmap(JSON.parse(data[0].roadmapData));
        setActiveRoadmapDocId(data[0].id);
        setCompletedSkills(data[0].completedSkills || []);
        setXp(data[0].xp || 0);
      }
    } catch (error) {
      console.error("Error fetching roadmaps", error);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim() || !user) return;

    setLoading(true);
    try {
      const roadmapData = await generateCareerRoadmap(goal, userProfile);
      
      const docRef = await addDoc(collection(db, 'roadmaps'), {
        userId: user.uid,
        careerGoal: goal,
        roadmapData: JSON.stringify(roadmapData),
        completedSkills: [],
        xp: 0,
        createdAt: new Date().toISOString()
      });
      
      await logActivity(user.uid, user.email, 'roadmap_created', { careerGoal: goal });
      
      setActiveRoadmap(roadmapData);
      setActiveRoadmapDocId(docRef.id);
      setCompletedSkills([]);
      setXp(0);
      fetchRoadmaps();
    } catch (error) {
      console.error("Failed to generate roadmap", error);
      alert("Failed to generate roadmap. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkillComplete = async (skill: string) => {
    if (!activeRoadmapDocId || completedSkills.includes(skill)) return;
    
    const newCompletedSkills = [...completedSkills, skill];
    const newXp = xp + 100; // Award 100 XP per skill
    
    setCompletedSkills(newCompletedSkills);
    setXp(newXp);
    setActiveSkill(null);

    try {
      const docRef = doc(db, 'roadmaps', activeRoadmapDocId);
      await updateDoc(docRef, {
        completedSkills: newCompletedSkills,
        xp: newXp
      });
      
      await logActivity(user.uid, user.email, 'task_completed', { 
        type: 'skill_completion', 
        skill, 
        roadmapId: activeRoadmapDocId,
        newXp 
      });
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  // Calculate overall progress
  const progressPercentage = activeRoadmap && activeRoadmap.skills 
    ? Math.round((completedSkills.length / (activeRoadmap.skills?.length || 1)) * 100) 
    : 0;

  return (
    <div className="space-y-8 font-sans pb-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Career Roadmap & Skill Tracker</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Your personalized path to mastering your dream career.</p>
        </div>
        
        {activeRoadmap && (
          <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-500">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Total XP</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{xp}</p>
              </div>
            </div>
            <div className="w-px h-10 bg-slate-200 dark:bg-slate-700"></div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-1">Progress</p>
              <div className="flex items-center gap-3">
                <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{progressPercentage}%</span>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        {userProfile && (
          <div className="mb-4 flex items-start gap-2 text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-xl">
            <Info className="h-5 w-5 shrink-0" />
            <p>
              Your roadmap will be personalized using your Career Profile (<strong>{userProfile.program || 'Unknown Program'}</strong>, <strong>{userProfile.level || 'Unknown Level'}</strong>). You can edit your goal below if you want a different roadmap.
            </p>
          </div>
        )}
        <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Target className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            </div>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Enter your dream career (e.g., Data Scientist)"
              className="block w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || !goal.trim()}
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          >
            {loading ? <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Generating...</> : 'Generate Roadmap'}
          </button>
        </form>
      </div>

      {activeRoadmap && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm"
        >
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{activeRoadmap.careerGoal}</h2>
              <p className="text-indigo-600 dark:text-indigo-400 font-medium mt-1">Estimated Timeline: {activeRoadmap.timeline}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-indigo-500" /> Milestones
                </h3>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
                  {activeRoadmap.milestones?.map((milestone: any, i: number) => (
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        {i + 1}
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-slate-900 dark:text-white">{milestone.title}</h4>
                          <span className="text-xs font-medium px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full">{milestone.level}</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{milestone.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                    <CheckCircle2 className="h-5 w-5 mr-2 text-emerald-500" /> Required Skills
                  </h3>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Click to learn</span>
                </div>
                <div className="flex flex-col gap-2">
                  {activeRoadmap.skills?.map((skill: string, i: number) => {
                    const isCompleted = completedSkills.includes(skill);
                    return (
                      <button
                        key={i}
                        onClick={() => setActiveSkill(skill)}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                          isCompleted 
                            ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/50' 
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-sm'
                        }`}
                      >
                        <span className={`text-sm font-medium ${isCompleted ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                          {skill}
                        </span>
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                        ) : (
                          <PlayCircle className="w-5 h-5 text-indigo-400 shrink-0 opacity-50" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-amber-500" /> Certifications
                </h3>
                <ul className="space-y-3">
                  {activeRoadmap.certifications?.map((cert: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-amber-500 shrink-0 mr-1" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{cert}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-500" /> Projects
                </h3>
                <div className="space-y-4">
                  {activeRoadmap.projects?.map((project: any, i: number) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{project.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{project.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeSkill && activeRoadmap && (
        <SkillTrackerModal
          skill={activeSkill}
          careerGoal={activeRoadmap.careerGoal}
          onClose={() => setActiveSkill(null)}
          onComplete={handleSkillComplete}
          isCompleted={completedSkills.includes(activeSkill)}
        />
      )}
    </div>
  );
}
