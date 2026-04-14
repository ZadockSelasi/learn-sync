import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { Calendar, Plus, Trash2, Clock, AlertCircle } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

export const ExamCalendar: React.FC = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExam, setNewExam] = useState({
    courseName: '',
    examDate: '',
    examTime: '',
    semester: 'Fall 2026',
    priority: 'High',
    notes: '',
    targetGrade: 'A',
    color: '#4f46e5'
  });

  useEffect(() => {
    fetchExams();
  }, [user]);

  const fetchExams = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'exams'), where('userId', '==', user.uid));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
      setExams(data.sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime()));
    } catch (error) {
      console.error("Error fetching exams", error);
    }
  };

  const handleAddExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await addDoc(collection(db, 'exams'), {
        ...newExam,
        userId: user.uid,
        createdAt: new Date().toISOString()
      });
      setShowAddForm(false);
      setNewExam({ ...newExam, courseName: '', examDate: '', examTime: '', notes: '' });
      fetchExams();
    } catch (error) {
      console.error("Error adding exam", error);
    }
  };

  const deleteExam = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'exams', id));
      setExams(exams.filter(e => e.id !== id));
    } catch (error) {
      console.error("Error deleting exam", error);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          Exam Calendar
        </h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddExam} className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Course Name</label>
              <input type="text" required value={newExam.courseName} onChange={e => setNewExam({...newExam, courseName: e.target.value})} className="w-full p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl text-sm" placeholder="e.g. Biology 101" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Date</label>
              <input type="date" required value={newExam.examDate} onChange={e => setNewExam({...newExam, examDate: e.target.value})} className="w-full p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Time</label>
              <input type="time" required value={newExam.examTime} onChange={e => setNewExam({...newExam, examTime: e.target.value})} className="w-full p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Priority</label>
              <select value={newExam.priority} onChange={e => setNewExam({...newExam, priority: e.target.value})} className="w-full p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl text-sm">
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Notes / Target Grade</label>
              <input type="text" value={newExam.notes} onChange={e => setNewExam({...newExam, notes: e.target.value})} className="w-full p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl text-sm" placeholder="e.g. Target: A, focus on chapters 4-6" />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700">Save Exam</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {exams.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No exams scheduled yet.</p>
        ) : (
          exams.map((exam) => {
            const daysLeft = differenceInDays(new Date(exam.examDate), new Date());
            const isUrgent = daysLeft <= 7;
            
            return (
              <div key={exam.id} className={`p-4 rounded-2xl border ${isUrgent ? 'border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'} relative overflow-hidden group`}>
                <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: exam.color }}></div>
                <div className="flex justify-between items-start pl-2">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{exam.courseName}</h3>
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mt-1 space-x-3">
                      <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> {format(new Date(exam.examDate), 'MMM d, yyyy')}</span>
                      <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> {exam.examTime}</span>
                    </div>
                    {exam.notes && <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">{exam.notes}</p>}
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${isUrgent ? 'text-red-600 dark:text-red-400' : 'text-indigo-600 dark:text-indigo-400'} flex items-center justify-end`}>
                      {isUrgent && <AlertCircle className="h-4 w-4 mr-1" />}
                      {daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? 'Today!' : 'Passed'}
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mt-1 block">{exam.priority} Priority</span>
                  </div>
                </div>
                <button 
                  onClick={() => deleteExam(exam.id)}
                  className="absolute right-2 bottom-2 p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
