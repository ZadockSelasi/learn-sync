import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { generateQuiz } from '../services/geminiService';
import { motion } from 'motion/react';
import { HelpCircle, Loader2, FileText, CheckCircle2, XCircle, UploadCloud, File as FileIcon } from 'lucide-react';

export default function Quiz() {
  const { user } = useAuth();
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<{ data: string, mimeType: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<any | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
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
      const quizData = await generateQuiz(subject, content, fileData || undefined);
      setActiveQuiz(quizData);
      setAnswers({});
      setSubmitted(false);
      setScore(0);
      setSubject('');
      setContent('');
      clearFile();
    } catch (error) {
      console.error("Failed to generate quiz", error);
      alert("Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!activeQuiz || !user) return;
    
    let currentScore = 0;
    activeQuiz.questions.forEach((q: any, i: number) => {
      if (q.type === 'multiple_choice' || q.type === 'true_false') {
        if (answers[i] === q.answer) currentScore++;
      }
    });
    
    setScore(currentScore);
    setSubmitted(true);

    try {
      await addDoc(collection(db, 'quizzes'), {
        userId: user.uid,
        subject: activeQuiz.subject,
        questions: JSON.stringify(activeQuiz.questions),
        score: currentScore,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error saving quiz score", error);
    }
  };

  return (
    <div className="space-y-8 font-sans pb-8">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">AI Quiz Generator</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Turn your notes into interactive quizzes instantly.</p>
      </header>

      {!activeQuiz && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subject / Topic</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Biology: Cell Division"
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
              {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <FileText className="h-5 w-5 mr-2" />}
              {loading ? 'Generating Quiz...' : 'Generate Quiz'}
            </button>
          </form>
        </div>
      )}

      {activeQuiz && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm"
        >
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{activeQuiz.subject} Quiz</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">{activeQuiz.questions.length} Questions</p>
            </div>
            {submitted && (
              <div className="bg-indigo-50 dark:bg-indigo-900/20 px-6 py-3 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 text-center">
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-1">Your Score</p>
                <p className="text-3xl font-bold text-indigo-900 dark:text-indigo-300">{score} <span className="text-lg text-indigo-400 dark:text-indigo-500">/ {activeQuiz.questions.filter((q:any) => q.type !== 'short_answer').length}</span></p>
              </div>
            )}
          </div>

          <div className="space-y-10">
            {activeQuiz.questions.map((q: any, i: number) => (
              <div key={i} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-start">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-sm font-bold mr-3 shrink-0">
                    {i + 1}
                  </span>
                  <span className="pt-1">{q.question}</span>
                </h3>

                {q.type === 'multiple_choice' && (
                  <div className="space-y-3 ml-11">
                    {q.options.map((opt: string, j: number) => {
                      const isSelected = answers[i] === opt;
                      const isCorrect = submitted && opt === q.answer;
                      const isWrong = submitted && isSelected && opt !== q.answer;
                      
                      return (
                        <label 
                          key={j} 
                          className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${
                            submitted 
                              ? isCorrect ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : isWrong ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-50'
                              : isSelected ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 ring-1 ring-indigo-500' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q-${i}`}
                            value={opt}
                            checked={isSelected}
                            onChange={() => !submitted && setAnswers({ ...answers, [i]: opt })}
                            disabled={submitted}
                            className="w-4 h-4 text-indigo-600 dark:text-indigo-500 border-slate-300 dark:border-slate-600 focus:ring-indigo-500"
                          />
                          <span className={`ml-3 text-sm font-medium ${submitted ? (isCorrect ? 'text-emerald-700 dark:text-emerald-400' : isWrong ? 'text-red-700 dark:text-red-400' : 'text-slate-500 dark:text-slate-400') : 'text-slate-700 dark:text-slate-300'}`}>
                            {opt}
                          </span>
                          {submitted && isCorrect && <CheckCircle2 className="ml-auto h-5 w-5 text-emerald-500" />}
                          {submitted && isWrong && <XCircle className="ml-auto h-5 w-5 text-red-500" />}
                        </label>
                      );
                    })}
                  </div>
                )}

                {q.type === 'true_false' && (
                  <div className="flex gap-4 ml-11">
                    {['True', 'False'].map((opt, j) => {
                      const isSelected = answers[i] === opt;
                      const isCorrect = submitted && opt === q.answer;
                      const isWrong = submitted && isSelected && opt !== q.answer;

                      return (
                        <label 
                          key={j} 
                          className={`flex-1 flex items-center justify-center p-4 rounded-xl border cursor-pointer transition-all ${
                            submitted 
                              ? isCorrect ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : isWrong ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-50'
                              : isSelected ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 ring-1 ring-indigo-500' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q-${i}`}
                            value={opt}
                            checked={isSelected}
                            onChange={() => !submitted && setAnswers({ ...answers, [i]: opt })}
                            disabled={submitted}
                            className="sr-only"
                          />
                          <span className={`text-sm font-medium ${submitted ? (isCorrect ? 'text-emerald-700 dark:text-emerald-400' : isWrong ? 'text-red-700 dark:text-red-400' : 'text-slate-500 dark:text-slate-400') : 'text-slate-700 dark:text-slate-300'}`}>
                            {opt}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {q.type === 'short_answer' && (
                  <div className="ml-11">
                    <textarea
                      value={answers[i] || ''}
                      onChange={(e) => !submitted && setAnswers({ ...answers, [i]: e.target.value })}
                      disabled={submitted}
                      placeholder="Type your answer here..."
                      rows={3}
                      className="block w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none disabled:opacity-75 disabled:bg-slate-50 dark:disabled:bg-slate-900"
                    />
                  </div>
                )}

                {submitted && (
                  <div className="mt-4 ml-11 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">Explanation:</p>
                    <p className="text-sm text-blue-800 dark:text-blue-200">{q.explanation}</p>
                    {q.type === 'short_answer' && (
                      <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-800/30">
                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">Suggested Answer:</p>
                        <p className="text-sm text-blue-800 dark:text-blue-200">{q.answer}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {!submitted ? (
            <div className="mt-10 flex justify-end">
              <button
                onClick={handleSubmit}
                className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
              >
                Submit Quiz
              </button>
            </div>
          ) : (
            <div className="mt-10 flex justify-end gap-4">
              <button
                onClick={() => setActiveQuiz(null)}
                className="px-8 py-4 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-semibold rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
              >
                Create New Quiz
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
