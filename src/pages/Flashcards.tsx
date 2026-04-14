import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { generateFlashcards } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, Loader2, ChevronLeft, ChevronRight, RotateCcw, UploadCloud, File as FileIcon, XCircle } from 'lucide-react';

export default function Flashcards() {
  const { user } = useAuth();
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<{ data: string, mimeType: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeSet, setActiveSet] = useState<any | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-powerpoint'
    ];
    
    if (!validTypes.includes(selectedFile.type)) {
      alert('Please upload a PDF, DOCX, or PPTX file.');
      return;
    }
    
    if (selectedFile.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB.');
      return;
    }
    
    setFile(selectedFile);
    
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      setFileData({
        data: base64String,
        mimeType: selectedFile.type
      });
    };
    reader.readAsDataURL(selectedFile);
  };

  const clearFile = () => {
    setFile(null);
    setFileData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || (!content.trim() && !fileData) || !user) return;

    setLoading(true);
    try {
      const flashcardData = await generateFlashcards(subject, content, fileData || undefined);
      setActiveSet(flashcardData);
      setCurrentIndex(0);
      setIsFlipped(false);
      setSubject('');
      setContent('');
      clearFile();

      await addDoc(collection(db, 'flashcards'), {
        userId: user.uid,
        subject: flashcardData.subject,
        cards: JSON.stringify(flashcardData.cards),
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Failed to generate flashcards", error);
      alert("Failed to generate flashcards. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (activeSet && currentIndex < activeSet.cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev - 1), 150);
    }
  };

  return (
    <div className="space-y-8 font-sans pb-8">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Smart Flashcards</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Master concepts quickly with AI-generated flashcards.</p>
      </header>

      {!activeSet && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subject / Topic</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., History: World War II"
                className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Study Material (Paste text or upload file)</label>
              
              {!file ? (
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-700 border-dashed rounded-xl hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors bg-slate-50 dark:bg-slate-800/50">
                  <div className="space-y-1 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                    <div className="flex text-sm text-slate-600 dark:text-slate-400 justify-center">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span>Upload a file</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          className="sr-only" 
                          accept=".pdf,.doc,.docx,.ppt,.pptx" 
                          onChange={handleFileChange}
                          ref={fileInputRef}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      PDF, DOCX, PPTX up to 10MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 rounded-xl mb-4">
                  <div className="flex items-center">
                    <FileIcon className="h-6 w-6 text-indigo-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-indigo-900 dark:text-indigo-300">{file.name}</p>
                      <p className="text-xs text-indigo-700 dark:text-indigo-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button type="button" onClick={clearFile} className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-full transition-colors">
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>
              )}

              <div className="relative mt-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-white dark:bg-slate-900 text-sm text-slate-500 dark:text-slate-400">OR PASTE TEXT</span>
                </div>
              </div>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your notes here..."
                rows={6}
                className="mt-4 block w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                required={!fileData}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !subject.trim() || (!content.trim() && !fileData)}
              className="w-full py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Layers className="h-5 w-5 mr-2" />}
              {loading ? 'Generating Flashcards...' : 'Generate Flashcards'}
            </button>
          </form>
        </div>
      )}

      {activeSet && (
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{activeSet.subject}</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Card {currentIndex + 1} of {activeSet.cards.length}</p>
            </div>
            <button
              onClick={() => setActiveSet(null)}
              className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-lg transition-colors"
            >
              Create New Set
            </button>
          </div>

          <div className="relative h-96 w-full perspective-1000">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex + (isFlipped ? '-back' : '-front')}
                initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setIsFlipped(!isFlipped)}
                className="absolute inset-0 w-full h-full bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 cursor-pointer flex flex-col items-center justify-center p-12 text-center"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="absolute top-6 right-6 text-slate-400 dark:text-slate-500">
                  <RotateCcw className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-indigo-500 uppercase tracking-wider mb-6">
                  {isFlipped ? 'Answer' : 'Question'}
                </p>
                <h3 className={`font-bold text-slate-900 dark:text-white ${isFlipped ? 'text-2xl' : 'text-3xl'}`}>
                  {isFlipped ? activeSet.cards[currentIndex].back : activeSet.cards[currentIndex].front}
                </h3>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-6 mt-10">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-4 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <div className="flex gap-2">
              {activeSet.cards.map((_: any, i: number) => (
                <div 
                  key={i} 
                  className={`h-2 rounded-full transition-all ${i === currentIndex ? 'w-8 bg-indigo-600 dark:bg-indigo-500' : 'w-2 bg-slate-200 dark:bg-slate-700'}`} 
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              disabled={currentIndex === activeSet.cards.length - 1}
              className="p-4 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
