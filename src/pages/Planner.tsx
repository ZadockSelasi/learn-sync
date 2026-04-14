import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { generateStudyPlan } from '../services/geminiService';
import { motion } from 'motion/react';
import { Calendar, Loader2, CheckCircle2, Circle, Clock, Trash2, BrainCircuit, Play } from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';
import { ExamCalendar } from '../components/planner/ExamCalendar';
import { StudyTimetable } from '../components/planner/StudyTimetable';
import { FocusMode } from '../components/planner/FocusMode';

export default function Planner() {
  const { user } = useAuth();
  const [weakSubjects, setWeakSubjects] = useState('');
  const [hours, setHours] = useState(10);
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [activeSession, setActiveSession] = useState<any | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
      setTasks(data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weakSubjects.trim() || !user) return;

    setLoading(true);
    try {
      const subjectsArray = weakSubjects.split(',').map(s => s.trim());
      const planData = await generateStudyPlan(subjectsArray, hours);
      
      const start = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
      const daysMap: Record<string, number> = {
        'Monday': 0, 'Tuesday': 1, 'Wednesday': 2, 'Thursday': 3, 'Friday': 4, 'Saturday': 5, 'Sunday': 6
      };

      for (const task of planData.tasks) {
        const taskDate = addDays(start, daysMap[task.dayOfWeek] || 0);
        await addDoc(collection(db, 'tasks'), {
          userId: user.uid,
          title: task.title,
          subject: task.subject,
          description: task.description,
          durationMinutes: task.durationMinutes,
          date: taskDate.toISOString(),
          completed: false,
          createdAt: new Date().toISOString()
        });
      }
      
      setWeakSubjects('');
      fetchTasks();
    } catch (error) {
      console.error("Failed to generate study plan", error);
      alert("Failed to generate study plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (taskId: string, currentStatus: boolean) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, { completed: !currentStatus });
      setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !currentStatus } : t));
    } catch (error) {
      console.error("Error toggling task", error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  const handleStartFocus = (session: any) => {
    setActiveSession(session);
  };

  const handleCompleteSession = async () => {
    if (activeSession) {
      try {
        await updateDoc(doc(db, 'studySessions', activeSession.id), { status: 'completed' });
        // Optionally refresh timetable here if needed, but it's handled in the component
      } catch (error) {
        console.error("Error completing session", error);
      }
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-8 font-sans pb-8">
      {activeSession && (
        <FocusMode 
          session={activeSession} 
          onClose={() => setActiveSession(null)} 
          onComplete={handleCompleteSession}
        />
      )}

      <header>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Study Center</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Manage exams, plan sessions, and stay focused.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ExamCalendar />
        <StudyTimetable onStartFocus={handleStartFocus} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <BrainCircuit className="mr-2 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              AI Study Assistant
            </h2>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Weak Subjects (comma separated)</label>
                <input
                  type="text"
                  value={weakSubjects}
                  onChange={(e) => setWeakSubjects(e.target.value)}
                  placeholder="e.g., Calculus, Physics"
                  className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Available Hours (per week)</label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={hours}
                  onChange={(e) => setHours(parseInt(e.target.value))}
                  className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading || !weakSubjects.trim()}
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Calendar className="h-5 w-5 mr-2" />}
                {loading ? 'Generating...' : 'Suggest Plan'}
              </button>
            </form>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">AI Plan Progress</h2>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50">
                    Completion
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-indigo-600 dark:text-indigo-400">
                    {progress}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                <div style={{ width: `${progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 transition-all duration-500"></div>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{completedCount} of {tasks.length} AI tasks completed</p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm min-h-[500px]">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">AI Suggested Tasks</h2>
            
            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <BrainCircuit className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">No AI tasks scheduled yet.</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Generate a plan to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task, i) => (
                  <motion.div 
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex flex-col sm:flex-row sm:items-start p-4 rounded-2xl border transition-all gap-3 sm:gap-4 ${task.completed ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-75' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-sm'}`}
                  >
                    <div className="flex items-center justify-between w-full sm:w-auto">
                      <button 
                        onClick={() => toggleTask(task.id, task.completed)}
                        className="mt-0 sm:mt-1 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none"
                      >
                        {task.completed ? <CheckCircle2 className="h-6 w-6 text-emerald-500" /> : <Circle className="h-6 w-6" />}
                      </button>
                      <span className="sm:hidden text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md">
                        {format(new Date(task.date), 'EEEE, MMM d')}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0 w-full">
                      <div className="hidden sm:flex items-center justify-between mb-1">
                        <h3 className={`font-bold truncate pr-4 ${task.completed ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-900 dark:text-white'}`}>{task.title}</h3>
                        <span className="text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md whitespace-nowrap">
                          {format(new Date(task.date), 'EEEE, MMM d')}
                        </span>
                      </div>
                      <h3 className={`sm:hidden font-bold mb-2 ${task.completed ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-900 dark:text-white'}`}>{task.title}</h3>
                      
                      <p className={`text-sm mb-3 ${task.completed ? 'text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-300'}`}>{task.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-md">{task.subject}</span>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" /> {task.durationMinutes} mins
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex sm:flex-col items-center justify-end gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-700">
                      <button 
                        onClick={() => handleStartFocus({
                          subject: task.subject,
                          topic: task.title,
                          goal: task.description,
                          startTime: '00:00', // Mock for AI tasks
                          endTime: '00:00'
                        })}
                        className="flex-1 sm:flex-none flex items-center justify-center p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors focus:outline-none"
                        title="Start Focus Mode"
                      >
                        <Play className="h-4 w-4 sm:mr-0 mr-2" /> <span className="sm:hidden text-sm font-medium">Start</span>
                      </button>
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="flex-1 sm:flex-none flex items-center justify-center p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors focus:outline-none"
                      >
                        <Trash2 className="h-4 w-4 sm:mr-0 mr-2" /> <span className="sm:hidden text-sm font-medium">Delete</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
