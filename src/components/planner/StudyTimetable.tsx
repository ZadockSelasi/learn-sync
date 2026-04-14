import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { Clock, Plus, Trash2, CheckCircle2, Circle, Play } from 'lucide-react';
import { format } from 'date-fns';

interface StudyTimetableProps {
  onStartFocus: (session: any) => void;
}

export const StudyTimetable: React.FC<StudyTimetableProps> = ({ onStartFocus }) => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSession, setNewSession] = useState({
    subject: '',
    topic: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '17:00',
    endTime: '18:00',
    sessionType: 'Revision',
    goal: ''
  });

  useEffect(() => {
    fetchSessions();
  }, [user]);

  const fetchSessions = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'studySessions'), where('userId', '==', user.uid));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
      setSessions(data.sort((a, b) => new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime()));
    } catch (error) {
      console.error("Error fetching sessions", error);
    }
  };

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await addDoc(collection(db, 'studySessions'), {
        ...newSession,
        userId: user.uid,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      setShowAddForm(false);
      setNewSession({ ...newSession, subject: '', topic: '', goal: '' });
      fetchSessions();
    } catch (error) {
      console.error("Error adding session", error);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      await updateDoc(doc(db, 'studySessions', id), { status: newStatus });
      setSessions(sessions.map(s => s.id === id ? { ...s, status: newStatus } : s));
    } catch (error) {
      console.error("Error toggling status", error);
    }
  };

  const deleteSession = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'studySessions', id));
      setSessions(sessions.filter(s => s.id !== id));
    } catch (error) {
      console.error("Error deleting session", error);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
          <Clock className="mr-2 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          Study Timetable
        </h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddSession} className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Subject</label>
              <input type="text" required value={newSession.subject} onChange={e => setNewSession({...newSession, subject: e.target.value})} className="w-full p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl text-sm" placeholder="e.g. Mathematics" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Topic</label>
              <input type="text" required value={newSession.topic} onChange={e => setNewSession({...newSession, topic: e.target.value})} className="w-full p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl text-sm" placeholder="e.g. Integration" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Date</label>
              <input type="date" required value={newSession.date} onChange={e => setNewSession({...newSession, date: e.target.value})} className="w-full p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl text-sm" />
            </div>
            <div className="flex space-x-2">
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Start</label>
                <input type="time" required value={newSession.startTime} onChange={e => setNewSession({...newSession, startTime: e.target.value})} className="w-full p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl text-sm" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">End</label>
                <input type="time" required value={newSession.endTime} onChange={e => setNewSession({...newSession, endTime: e.target.value})} className="w-full p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Type</label>
              <select value={newSession.sessionType} onChange={e => setNewSession({...newSession, sessionType: e.target.value})} className="w-full p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl text-sm">
                <option>Revision</option>
                <option>Reading</option>
                <option>Practice</option>
                <option>Assignment</option>
                <option>Group Study</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Goal</label>
              <input type="text" value={newSession.goal} onChange={e => setNewSession({...newSession, goal: e.target.value})} className="w-full p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl text-sm" placeholder="e.g. Complete 20 practice questions" />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700">Add Session</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {sessions.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No study sessions planned.</p>
        ) : (
          sessions.map((session) => (
            <div key={session.id} className={`flex items-center p-3 rounded-2xl border transition-all ${session.status === 'completed' ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-75' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-500 shadow-sm'}`}>
              <button 
                onClick={() => toggleStatus(session.id, session.status)}
                className="mr-3 text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors focus:outline-none"
              >
                {session.status === 'completed' ? <CheckCircle2 className="h-6 w-6 text-emerald-500" /> : <Circle className="h-6 w-6" />}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-bold text-sm truncate ${session.status === 'completed' ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-900 dark:text-white'}`}>{session.subject}: {session.topic}</h3>
                  <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md whitespace-nowrap ml-2">
                    {session.startTime} - {session.endTime}
                  </span>
                </div>
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                  <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-md mr-2">{session.sessionType}</span>
                  <span className="truncate">{session.goal}</span>
                </div>
              </div>
              <div className="flex items-center ml-3 space-x-1">
                <button 
                  onClick={() => onStartFocus(session)}
                  className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors focus:outline-none"
                  title="Start Focus Mode"
                >
                  <Play className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => deleteSession(session.id)}
                  className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors focus:outline-none"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
