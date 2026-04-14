import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Code, CheckCircle2, PlayCircle, Loader2, Award, ChevronRight, Brain } from 'lucide-react';
import { generateSkillDetails } from '../services/geminiService';

interface SkillTrackerModalProps {
  skill: string;
  careerGoal: string;
  onClose: () => void;
  onComplete: (skill: string) => void;
  isCompleted: boolean;
}

export default function SkillTrackerModal({ skill, careerGoal, onClose, onComplete, isCompleted }: SkillTrackerModalProps) {
  const [loading, setLoading] = useState(true);
  const [skillData, setSkillData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'quiz'>('learn');
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    fetchSkillDetails();
  }, [skill]);

  const fetchSkillDetails = async () => {
    setLoading(true);
    try {
      const data = await generateSkillDetails(skill, careerGoal);
      setSkillData(data);
    } catch (error) {
      console.error("Failed to fetch skill details", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    // Calculate score
    let score = 0;
    skillData.quiz?.forEach((q: any, i: number) => {
      if (quizAnswers[i] === q.correctAnswer) score++;
    });
    
    if (score === (skillData.quiz?.length || 0)) {
      onComplete(skill);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{skill}</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Skill Development for {careerGoal}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12">
              <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
              <p className="text-slate-600 dark:text-slate-400">AI is curating learning materials and exercises...</p>
            </div>
          ) : skillData ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 pt-4 gap-6">
                <button
                  onClick={() => setActiveTab('learn')}
                  className={`pb-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'learn' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> Learn</span>
                </button>
                <button
                  onClick={() => setActiveTab('practice')}
                  className={`pb-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'practice' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  <span className="flex items-center gap-2"><Code className="w-4 h-4" /> Practice</span>
                </button>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`pb-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'quiz' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Quiz</span>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-900/50">
                {activeTab === 'learn' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Summary</h3>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{skillData.summary}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Study Materials</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        {skillData.materials?.map((mat: any, i: number) => (
                          <a key={i} href={mat.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors group">
                            <div className="mt-1 text-indigo-500">
                              {mat.type === 'video' ? <PlayCircle className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{mat.title}</h4>
                              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{mat.description}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'practice' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Practical Exercises</h3>
                    {skillData.exercises?.map((ex: any, i: number) => (
                      <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-slate-900 dark:text-white text-lg">{ex.title}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            ex.difficulty === 'Beginner' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                            ex.difficulty === 'Intermediate' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                            'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                          }`}>
                            {ex.difficulty}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 mb-4">{ex.description}</p>
                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                          <h5 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Task:</h5>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{ex.task}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'quiz' && (
                  <div className="space-y-8 max-w-3xl mx-auto">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Knowledge Check</h3>
                      <p className="text-slate-500 dark:text-slate-400 mt-2">Test your understanding of {skill} to master this skill.</p>
                    </div>

                    {skillData.quiz?.map((q: any, i: number) => (
                      <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-4 text-lg">{i + 1}. {q.question}</h4>
                        <div className="space-y-3">
                          {q.options?.map((opt: string, j: number) => {
                            const isSelected = quizAnswers[i] === j;
                            const isCorrect = q.correctAnswer === j;
                            const showResult = quizSubmitted;
                            
                            let btnClass = "w-full text-left p-4 rounded-xl border transition-all ";
                            if (showResult) {
                              if (isCorrect) btnClass += "bg-emerald-50 border-emerald-500 text-emerald-900 dark:bg-emerald-900/20 dark:border-emerald-500 dark:text-emerald-100";
                              else if (isSelected) btnClass += "bg-rose-50 border-rose-500 text-rose-900 dark:bg-rose-900/20 dark:border-rose-500 dark:text-rose-100";
                              else btnClass += "bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 opacity-50";
                            } else {
                              btnClass += isSelected 
                                ? "bg-indigo-50 border-indigo-500 text-indigo-900 dark:bg-indigo-900/30 dark:border-indigo-500 dark:text-indigo-100" 
                                : "bg-white border-slate-200 text-slate-700 hover:border-indigo-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500";
                            }

                            return (
                              <button
                                key={j}
                                disabled={quizSubmitted}
                                onClick={() => setQuizAnswers(prev => ({ ...prev, [i]: j }))}
                                className={btnClass}
                              >
                                <div className="flex items-center justify-between">
                                  <span>{opt}</span>
                                  {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        {quizSubmitted && (
                          <div className={`mt-4 p-4 rounded-xl text-sm ${quizAnswers[i] === q.correctAnswer ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200' : 'bg-rose-50 text-rose-800 dark:bg-rose-900/20 dark:text-rose-200'}`}>
                            <strong>Explanation:</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    ))}

                    {!quizSubmitted ? (
                      <button
                        onClick={handleQuizSubmit}
                        disabled={Object.keys(quizAnswers).length < (skillData.quiz?.length || 0)}
                        className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Submit Answers
                      </button>
                    ) : (
                      <div className="text-center p-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                        <Award className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Quiz Completed!</h3>
                        <p className="text-slate-600 dark:text-slate-300 mb-6">
                          You scored {Object.keys(quizAnswers).filter(k => quizAnswers[parseInt(k)] === skillData.quiz[parseInt(k)].correctAnswer).length} out of {skillData.quiz?.length || 0}.
                        </p>
                        <button
                          onClick={() => {
                            if (Object.keys(quizAnswers).filter(k => quizAnswers[parseInt(k)] === skillData.quiz[parseInt(k)].correctAnswer).length === (skillData.quiz?.length || 0)) {
                              onClose();
                            } else {
                              setQuizSubmitted(false);
                              setQuizAnswers({});
                            }
                          }}
                          className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
                        >
                          {Object.keys(quizAnswers).filter(k => quizAnswers[parseInt(k)] === skillData.quiz[parseInt(k)].correctAnswer).length === (skillData.quiz?.length || 0) ? 'Continue Journey' : 'Try Again'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-12">
              <p className="text-rose-500">Failed to load skill details.</p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
