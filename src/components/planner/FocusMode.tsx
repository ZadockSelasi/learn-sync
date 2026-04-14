import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, X, CheckCircle2, AlertTriangle } from 'lucide-react';

interface FocusModeProps {
  session: any;
  onClose: () => void;
  onComplete: () => void;
}

export const FocusMode: React.FC<FocusModeProps> = ({ session, onClose, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default
  const [isActive, setIsActive] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Calculate duration from session if possible
    if (session.startTime && session.endTime) {
      const start = new Date(`2000-01-01T${session.startTime}`);
      const end = new Date(`2000-01-01T${session.endTime}`);
      const diffMinutes = (end.getTime() - start.getTime()) / 60000;
      if (diffMinutes > 0) {
        setTimeLeft(diffMinutes * 60);
      }
    }
  }, [session]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play sound or notify
      if (Notification.permission === "granted") {
        new Notification("Study Session Complete!", {
          body: `You finished your session on ${session.subject}. Great job!`
        });
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, session]);

  // Distraction blocking logic (simulated for web)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isActive) {
        setIsActive(false);
        setShowWarning(true);
        if (Notification.permission === "granted") {
          new Notification("Focus Interrupted!", {
            body: "You left your study session. Stay focused!"
          });
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    // Request notification permission
    if (Notification.permission !== "denied") {
      Notification.requestPermission();
    }

    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleClose = () => {
    if (isActive) {
      if (window.confirm("Are you sure you want to exit Focus Mode? Your timer will be stopped.")) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="absolute top-6 right-6">
        <button onClick={handleClose} className="p-2 text-slate-400 dark:text-slate-500 hover:text-white bg-slate-800 rounded-full transition-colors">
          <X className="h-6 w-6" />
        </button>
      </div>

      {showWarning && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-2xl shadow-lg flex items-center space-x-3"
        >
          <AlertTriangle className="h-5 w-5" />
          <span>You left your study session! Stay focused.</span>
          <button onClick={() => setShowWarning(false)} className="ml-4 p-1 hover:bg-red-600 rounded-full">
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center max-w-md w-full"
      >
        <div className="mb-8">
          <span className="inline-block px-4 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-full text-sm font-bold tracking-widest uppercase mb-4">
            Focus Mode
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">{session.subject}</h1>
          <p className="text-xl text-slate-400 dark:text-slate-500">{session.topic}</p>
          {session.goal && (
            <p className="mt-4 text-slate-300 dark:text-slate-400 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              Goal: {session.goal}
            </p>
          )}
        </div>

        <div className="relative mb-12 flex justify-center">
          <div className="w-64 h-64 rounded-full border-4 border-slate-800 flex items-center justify-center relative">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="124"
                fill="none"
                stroke="#334155"
                strokeWidth="8"
              />
              <circle
                cx="128"
                cy="128"
                r="124"
                fill="none"
                stroke="#6366f1"
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 124}
                strokeDashoffset={2 * Math.PI * 124 * (1 - timeLeft / (25 * 60))} // Assuming 25min max for visual, adjust as needed
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="text-6xl font-mono font-bold text-white tracking-tighter">
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-6">
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-transform hover:scale-105 ${isActive ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'}`}
          >
            {isActive ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
          </button>
          
          <button 
            onClick={() => {
              onComplete();
              onClose();
            }}
            className="w-20 h-20 rounded-full flex items-center justify-center bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 transition-transform hover:scale-105"
          >
            <CheckCircle2 className="h-8 w-8" />
          </button>
        </div>
        
        <p className="mt-12 text-slate-500 dark:text-slate-400 text-sm italic">
          "Time to study {session.subject} now. You planned this session for your exam success."
        </p>
      </motion.div>
    </div>
  );
};
