import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Plus, Trash2, GripHorizontal, StickyNote } from 'lucide-react';

const COLORS = [
  { id: 'yellow', bg: 'bg-yellow-200 dark:bg-yellow-900/50', border: 'border-yellow-300 dark:border-yellow-700', text: 'text-yellow-900 dark:text-yellow-100' },
  { id: 'blue', bg: 'bg-blue-200 dark:bg-blue-900/50', border: 'border-blue-300 dark:border-blue-700', text: 'text-blue-900 dark:text-blue-100' },
  { id: 'pink', bg: 'bg-pink-200 dark:bg-pink-900/50', border: 'border-pink-300 dark:border-pink-700', text: 'text-pink-900 dark:text-pink-100' },
  { id: 'green', bg: 'bg-emerald-200 dark:bg-emerald-900/50', border: 'border-emerald-300 dark:border-emerald-700', text: 'text-emerald-900 dark:text-emerald-100' },
  { id: 'purple', bg: 'bg-purple-200 dark:bg-purple-900/50', border: 'border-purple-300 dark:border-purple-700', text: 'text-purple-900 dark:text-purple-100' },
];

export default function StickyNotes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'stickyNotes'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotes(notesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching notes:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addNote = async () => {
    if (!user) return;
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)].id;
    
    // Calculate center of screen or container
    const x = Math.floor(Math.random() * 100) + 50;
    const y = Math.floor(Math.random() * 100) + 50;

    try {
      await addDoc(collection(db, 'stickyNotes'), {
        userId: user.uid,
        content: '',
        color: randomColor,
        x,
        y,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const updateNoteContent = async (id: string, content: string) => {
    try {
      await updateDoc(doc(db, 'stickyNotes', id), { content });
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const updateNotePosition = async (id: string, x: number, y: number) => {
    try {
      await updateDoc(doc(db, 'stickyNotes', id), { x, y });
    } catch (error) {
      console.error("Error updating position:", error);
    }
  };

  const updateNoteColor = async (id: string, color: string) => {
    try {
      await updateDoc(doc(db, 'stickyNotes', id), { color });
    } catch (error) {
      console.error("Error updating color:", error);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'stickyNotes', id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] font-sans pb-0">
      <header className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <StickyNote className="h-8 w-8 text-amber-500" />
            Sticky Notes
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Jot down quick thoughts, reminders, or exceptions.</p>
        </div>
        <button
          onClick={addNote}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5" />
          <span className="hidden sm:inline">New Note</span>
        </button>
      </header>

      <div 
        ref={containerRef}
        className="flex-1 relative bg-slate-100/50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : notes.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
            <StickyNote className="h-16 w-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">No sticky notes yet.</p>
            <p className="text-sm">Click "New Note" to create one.</p>
          </div>
        ) : (
          notes.map((note) => {
            const colorTheme = COLORS.find(c => c.id === note.color) || COLORS[0];
            
            return (
              <motion.div
                key={note.id}
                drag
                dragConstraints={containerRef}
                dragMomentum={false}
                initial={{ x: note.x, y: note.y, scale: 0.8, opacity: 0 }}
                animate={{ x: note.x, y: note.y, scale: 1, opacity: 1 }}
                onDragEnd={(e, info) => {
                  // Calculate new position relative to container
                  updateNotePosition(note.id, note.x + info.offset.x, note.y + info.offset.y);
                }}
                className={`absolute w-64 min-h-[200px] flex flex-col rounded-2xl shadow-lg border ${colorTheme.bg} ${colorTheme.border} ${colorTheme.text} overflow-hidden`}
                style={{ touchAction: 'none' }}
              >
                {/* Drag Handle & Controls */}
                <div className="flex items-center justify-between p-2 border-b border-black/5 dark:border-white/5 cursor-grab active:cursor-grabbing">
                  <GripHorizontal className="h-4 w-4 opacity-50 hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-center gap-1">
                    <div className="flex gap-1 mr-2">
                      {COLORS.map(c => (
                        <button
                          key={c.id}
                          onClick={() => updateNoteColor(note.id, c.id)}
                          className={`w-3 h-3 rounded-full border border-black/10 dark:border-white/10 ${c.bg.split(' ')[0]} ${note.color === c.id ? 'ring-2 ring-offset-1 ring-black/20 dark:ring-white/20' : ''}`}
                          aria-label={`Change color to ${c.id}`}
                        />
                      ))}
                    </div>
                    <button 
                      onClick={() => deleteNote(note.id)}
                      className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4 opacity-70 hover:opacity-100" />
                    </button>
                  </div>
                </div>

                {/* Content Area */}
                <textarea
                  value={note.content}
                  onChange={(e) => updateNoteContent(note.id, e.target.value)}
                  placeholder="Type your note here..."
                  className="flex-1 w-full p-4 bg-transparent resize-none outline-none placeholder-black/30 dark:placeholder-white/30"
                  onPointerDownCapture={(e) => e.stopPropagation()} // Prevent drag when typing
                />
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
