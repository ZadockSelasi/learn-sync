import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Target, BookOpen, Calendar, Award, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    roadmaps: 0,
    quizzes: 0,
    flashcards: 0,
    tasks: 0
  });
  const [upcomingExams, setUpcomingExams] = useState<any[]>([]);
  const [todaySessions, setTodaySessions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        const roadmapsQ = query(collection(db, 'roadmaps'), where('userId', '==', user.uid));
        const quizzesQ = query(collection(db, 'quizzes'), where('userId', '==', user.uid));
        const flashcardsQ = query(collection(db, 'flashcards'), where('userId', '==', user.uid));
        const tasksQ = query(collection(db, 'tasks'), where('userId', '==', user.uid));
        const examsQ = query(collection(db, 'exams'), where('userId', '==', user.uid));
        const sessionsQ = query(collection(db, 'studySessions'), where('userId', '==', user.uid));

        const [rSnap, qSnap, fSnap, tSnap, eSnap, sSnap] = await Promise.all([
          getDocs(roadmapsQ),
          getDocs(quizzesQ),
          getDocs(flashcardsQ),
          getDocs(tasksQ),
          getDocs(examsQ),
          getDocs(sessionsQ)
        ]);

        setStats({
          roadmaps: rSnap.size,
          quizzes: qSnap.size,
          flashcards: fSnap.size,
          tasks: tSnap.size
        });

        const examsData = eSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
        setUpcomingExams(examsData.sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime()).slice(0, 3));

        const todayDateStr = format(new Date(), 'yyyy-MM-dd');
        const sessionsData = sSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
        setTodaySessions(sessionsData.filter(s => s.date === todayDateStr).sort((a, b) => new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime()));

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user]);

  const statCards = [
    { title: 'Active Roadmaps', value: stats.roadmaps, icon: Target, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400', link: '/roadmap' },
    { title: 'Quizzes Taken', value: stats.quizzes, icon: Award, color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400', link: '/quiz' },
    { title: 'Flashcard Sets', value: stats.flashcards, icon: BookOpen, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400', link: '/flashcards' },
    { title: 'Pending Tasks', value: stats.tasks, icon: Calendar, color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400', link: '/planner' },
  ];

  return (
    <div className="space-y-8 font-sans pb-8">
      <header className="relative">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight relative z-10">
          Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">{user?.displayName?.split(' ')[0] || 'Student'}</span>!
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg relative z-10">Here's an overview of your learning journey.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <Link key={i} to={stat.link} className="block group">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative overflow-hidden bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-xl dark:hover:shadow-indigo-500/10 transition-all duration-300 group-hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-white/0 to-slate-100 dark:to-white/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
              
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">{stat.title}</p>
                  <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</p>
                </div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color} shadow-inner`}>
                  <stat.icon className="h-7 w-7" />
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-[#111827] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center mr-3">
                  <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                Today's Study Sessions
              </h2>
              <Link to="/planner" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 rounded-full transition-colors">View Planner</Link>
            </div>
            
            {todaySessions.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
                <div className="w-16 h-16 bg-white dark:bg-[#0B0F19] rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100 dark:border-white/5">
                  <Calendar className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-medium text-lg">No study sessions planned for today.</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 mb-4">Take a break or get ahead of your schedule.</p>
                <Link to="/planner" className="inline-flex items-center justify-center px-6 py-2.5 bg-indigo-600 text-white font-medium text-sm rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-500/20">
                  Plan a session
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {todaySessions.map((session) => (
                  <div key={session.id} className="group flex items-center p-5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-colors">
                    <div className="w-1.5 h-12 rounded-full bg-indigo-500 dark:bg-indigo-400 mr-5 group-hover:scale-y-110 transition-transform"></div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 dark:text-white text-base truncate">{session.subject}: {session.topic}</h3>
                      <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                        <Clock className="w-4 h-4 mr-1.5 opacity-70" />
                        {session.startTime} - {session.endTime} 
                        <span className="mx-2">•</span> 
                        {session.sessionType}
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className={`px-3 py-1.5 text-xs font-bold rounded-lg ${session.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' : 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'}`}>
                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-[#111827] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/roadmap" className="group flex items-center p-5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-blue-200 dark:hover:border-blue-500/30 hover:bg-blue-50/50 dark:hover:bg-blue-500/5 transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <Target className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Career Roadmap</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Plan your path</p>
                </div>
              </Link>
              <Link to="/quiz" className="group flex items-center p-5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/5 transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Create AI Quiz</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Test knowledge</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white dark:bg-[#111827] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-500/10 flex items-center justify-center mr-3">
                  <Calendar className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                Upcoming Exams
              </h2>
            </div>
            
            {upcomingExams.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">No upcoming exams.</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingExams.map((exam) => {
                  const daysLeft = differenceInDays(new Date(exam.examDate), new Date());
                  const isUrgent = daysLeft <= 7;
                  
                  return (
                    <div key={exam.id} className={`p-4 rounded-2xl border ${isUrgent ? 'border-red-200 dark:border-red-500/30 bg-red-50/50 dark:bg-red-500/5' : 'border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5'}`}>
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm pr-2 leading-tight">{exam.courseName}</h3>
                        <span className={`text-xs font-bold px-2 py-1 rounded-md ${isUrgent ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400' : 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400'} flex items-center whitespace-nowrap`}>
                          {isUrgent && <AlertCircle className="h-3 w-3 mr-1" />}
                          {daysLeft > 0 ? `${daysLeft}d` : daysLeft === 0 ? 'Today' : 'Passed'}
                        </span>
                      </div>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 flex justify-between items-center bg-white dark:bg-[#0B0F19] p-2 rounded-lg border border-slate-100 dark:border-white/5">
                        <span className="flex items-center"><Calendar className="w-3 h-3 mr-1.5 opacity-70" /> {format(new Date(exam.examDate), 'MMM d')}</span>
                        <span className="flex items-center"><Clock className="w-3 h-3 mr-1.5 opacity-70" /> {exam.examTime}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <Link to="/planner" className="block mt-6 text-center text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-slate-50 dark:bg-white/5 py-2.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-500/10">
              View All Exams
            </Link>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-1 rounded-3xl shadow-lg shadow-indigo-500/20">
            <div className="bg-white dark:bg-[#111827] p-6 md:p-8 rounded-[22px] h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 relative z-10">Study Buddy</h2>
              <div className="text-center relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-500/20 dark:to-purple-500/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner border border-white/20 dark:border-white/5 transform -rotate-3">
                  <span className="text-4xl">🤖</span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Need help studying?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">Your AI tutor is available 24/7 to answer questions and explain concepts.</p>
                <Link to="/chat" className="flex items-center justify-center w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl text-sm font-bold hover:bg-indigo-600 dark:hover:bg-indigo-400 hover:text-white transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                  Chat Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
