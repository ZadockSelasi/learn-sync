import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, Target, BookOpen, Calendar, MessageSquare, ArrowRight, 
  CheckCircle2, Users, Briefcase, GraduationCap, Sparkles, 
  PlayCircle, Star, Building2, Globe, Shield, Zap, Menu, X, ChevronDown,
  LayoutDashboard, LineChart, Search
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';

export default function Landing() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  const heroImages = [
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const imageInterval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(imageInterval);
    };
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'For Students', href: '#students' },
    { name: 'For Schools', href: '#schools' },
    { name: 'Pricing', href: '#pricing' },
  ];

  const features = [
    { icon: Calendar, title: 'Study Planner & Tasks', desc: 'Smart scheduling that adapts to your learning pace and deadlines.', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
    { icon: Target, title: 'AI Learning Paths', desc: 'Personalized curriculum generated from your goals and weak points.', color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' },
    { icon: Brain, title: 'AI Quiz Generator', desc: 'Turn any lecture note or PDF into an interactive practice quiz.', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
    { icon: BookOpen, title: 'Smart Flashcards', desc: 'Master concepts quickly with spaced-repetition flashcards.', color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
    { icon: MessageSquare, title: 'Virtual Study Buddy', desc: '24/7 AI tutor to explain complex topics and keep you motivated.', color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' },
    { icon: LineChart, title: 'Career Roadmaps', desc: 'Visual step-by-step guides from your current level to your dream job.', color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
    { icon: Briefcase, title: 'Opportunity Matching', desc: 'Real-time internships, jobs, and scholarships tailored to your profile.', color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400' },
  ];

  const faqs = [
    { q: "Is the platform free for students?", a: "Yes! We offer a robust Free Plan for students that includes basic study planning, flashcards, and career exploration. Premium AI features are available on our Pro plan." },
    { q: "How do career recommendations work?", a: "Our AI analyzes your course of study, skills, interests, and location preferences to match you with real-time job market data, creating a personalized step-by-step roadmap." },
    { q: "Can schools use this for all students?", a: "Absolutely. We offer an Institution Plan that provides schools with analytics dashboards, bulk onboarding, and tools to track overall student career readiness." },
    { q: "How are jobs and internships matched?", a: "We partner with top employers and aggregate opportunities, using our matching engine to connect your specific skills and goals with the right entry-level roles." },
    { q: "What happens during onboarding?", a: "You'll answer a few quick questions about your university, major, dream job, and skills. This allows our AI to instantly personalize your entire dashboard experience." },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50 selection:bg-indigo-200 dark:selection:bg-indigo-900/50 overflow-x-hidden">
      {/* 1. Top Navigation Bar */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="h-10 w-10" />
            <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
              LearnSync
            </span>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors">
                {link.name}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <ThemeToggle />
            <Link to="/login" className="text-sm font-bold text-slate-700 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400 transition-colors">
              Log in
            </Link>
            <Link to="/login" className="text-sm font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-5 py-2.5 rounded-full hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white dark:hover:text-white transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
              Sign Up Free
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-4">
            <ThemeToggle />
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600 dark:text-slate-300">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-6 space-y-4"
            >
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block text-base font-semibold text-slate-700 dark:text-slate-200">
                  {link.name}
                </a>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                <Link to="/login" className="w-full text-center text-base font-bold text-slate-700 dark:text-slate-200 py-3 border border-slate-200 dark:border-slate-700 rounded-xl">
                  Log in
                </Link>
                <Link to="/login" className="w-full text-center text-base font-bold bg-indigo-600 text-white py-3 rounded-xl shadow-md">
                  Sign Up Free
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* 2. Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden z-0">
          {/* Fading Background Images */}
          <div className="absolute inset-0 -z-30 overflow-hidden bg-slate-100 dark:bg-black">
            {heroImages.map((src, index) => (
              <div
                key={src}
                className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${
                  index === currentHeroImage ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
                style={{ backgroundImage: `url(${src})` }}
              />
            ))}
          </div>
          {/* Overlay to blend with theme */}
          <div className="absolute inset-0 -z-20 bg-slate-50/70 dark:bg-slate-950/80 backdrop-blur-[2px] transition-colors duration-300 pointer-events-none" />

          {/* Background Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-400/30 dark:bg-indigo-900/40 blur-[120px]" />
            <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-400/30 dark:bg-purple-900/40 blur-[120px]" />
            <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[40%] rounded-full bg-emerald-400/20 dark:bg-emerald-900/20 blur-[120px]" />
          </div>

          <div className="max-w-7xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.1] mb-8 text-slate-900 dark:text-white"
            >
              From classroom learning <br className="hidden md:block" />
              to career success.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 font-medium mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              One smart platform for every student. Plan your studies, master subjects with AI, and discover your perfect career path—all in one place.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto sm:max-w-none"
            >
              <Link to="/login" className="w-full sm:w-auto flex justify-center items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-1">
                Get Started Free <ArrowRight className="h-5 w-5" />
              </Link>
              <button className="w-full sm:w-auto flex justify-center items-center gap-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm hover:-translate-y-1">
                <PlayCircle className="h-5 w-5" /> Watch Demo
              </button>
            </motion.div>

            {/* Dashboard Mockup */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-20 relative mx-auto max-w-5xl"
            >
              <div className="rounded-2xl md:rounded-[2rem] p-2 md:p-4 bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/60 dark:border-slate-700/60 shadow-2xl shadow-indigo-900/10 dark:shadow-indigo-900/40">
                <div className="rounded-xl md:rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 relative">
                  {/* Mockup Header */}
                  <div className="h-12 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 gap-2 bg-white dark:bg-slate-950">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                    </div>
                    <div className="mx-auto bg-slate-100 dark:bg-slate-800 rounded-md h-6 w-1/3 flex items-center justify-center">
                      <div className="w-1/2 h-2 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                    </div>
                  </div>
                  {/* Mockup Body */}
                  <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <div className="col-span-1 md:col-span-2 space-y-6">
                      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center">
                            <Target className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div>
                            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded-full mb-2"></div>
                            <div className="h-3 w-48 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                          </div>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full w-2/3 bg-indigo-500 rounded-full"></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                          <Brain className="w-8 h-8 text-purple-500 mb-3" />
                          <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded-full mb-2"></div>
                          <div className="h-2 w-16 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                          <Briefcase className="w-8 h-8 text-emerald-500 mb-3" />
                          <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded-full mb-2"></div>
                          <div className="h-2 w-16 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-1 space-y-4">
                      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 h-full">
                        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded-full mb-6"></div>
                        <div className="space-y-4">
                          {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700"></div>
                              <div className="flex-1">
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full mb-1.5"></div>
                                <div className="h-2 w-2/3 bg-slate-50 dark:bg-slate-800 rounded-full"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3. Social Proof / Trust Section */}
        <section className="py-10 border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-2">50k+</div>
                <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">Students Supported</div>
              </div>
              <div>
                <div className="text-4xl font-extrabold text-purple-600 dark:text-purple-400 mb-2">2M+</div>
                <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">Study Tasks Completed</div>
              </div>
              <div>
                <div className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-2">10k+</div>
                <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">Opportunities Matched</div>
              </div>
              <div>
                <div className="text-4xl font-extrabold text-amber-600 dark:text-amber-400 mb-2">500+</div>
                <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">Universities Represented</div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Problem Section */}
        <section className="py-24 bg-slate-50 dark:bg-slate-950" id="problem">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Being a student is harder than ever.</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400">You're expected to ace your classes, build a resume, and figure out your entire life—often with little guidance.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mb-6">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Overwhelming Workloads</h3>
                <p className="text-slate-600 dark:text-slate-400">Poor study planning leads to burnout. It's hard to know what to study and when.</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mb-6">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Unclear Career Paths</h3>
                <p className="text-slate-600 dark:text-slate-400">Confusion about what skills are actually needed for the jobs you want after graduation.</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl flex items-center justify-center mb-6">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Missed Opportunities</h3>
                <p className="text-slate-600 dark:text-slate-400">Little access to the right internships and entry-level jobs that match your profile.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Solution Section */}
        <section className="py-24 bg-indigo-900 text-white overflow-hidden relative">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6">The All-In-One Answer</h2>
              <p className="text-xl text-indigo-200">LearnSync bridges the gap between academic success and career readiness. One seamless journey.</p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 relative">
              {/* Connecting Line */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-indigo-800 -translate-y-1/2 z-0"></div>
              
              {[
                { step: '1', title: 'Learn', icon: BookOpen },
                { step: '2', title: 'Plan', icon: Calendar },
                { step: '3', title: 'Practice', icon: Brain },
                { step: '4', title: 'Explore', icon: Target },
                { step: '5', title: 'Succeed', icon: Briefcase },
              ].map((item, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center group">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-800 border-2 border-indigo-500 flex items-center justify-center mb-4 group-hover:bg-indigo-500 group-hover:scale-110 transition-all duration-300 shadow-xl">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-bold">{item.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Core Features Section */}
        <section className="py-24 bg-white dark:bg-slate-900" id="features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-slate-900 dark:text-white">Powerful tools for every step</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400">Everything you need to excel in class and prepare for the workforce.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, i) => (
                <div key={i} className="group p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.color}`}>
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. How It Works Section */}
        <section className="py-24 bg-slate-50 dark:bg-slate-950" id="how-it-works">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-slate-900 dark:text-white">How it works</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400">Your journey from student to professional in 5 simple steps.</p>
            </div>
            
            <div className="relative">
              {/* Vertical Line for Desktop */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-indigo-100 dark:bg-indigo-900/30 -translate-x-1/2 rounded-full"></div>
              
              <div className="space-y-12 md:space-y-0 relative">
                {[
                  { title: "Create your student profile", desc: "Sign up in seconds and get access to your personalized dashboard.", icon: Users },
                  { title: "Add your academic and career interests", desc: "Tell us what you're studying and where you want to go.", icon: Target },
                  { title: "Receive a personalized study and career roadmap", desc: "Our AI generates a step-by-step guide tailored just for you.", icon: LineChart },
                  { title: "Learn with AI tools and stay on track", desc: "Use smart flashcards, quizzes, and the study planner to ace your classes.", icon: Brain },
                  { title: "Discover real jobs, internships, scholarships", desc: "Get matched with opportunities that fit your unique profile.", icon: Briefcase },
                ].map((step, i) => (
                  <div key={i} className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''} md:pb-16 last:pb-0`}>
                    {/* Center Node */}
                    <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-indigo-600 text-white items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/30 z-10">
                      {i + 1}
                    </div>
                    
                    {/* Content Card */}
                    <div className={`w-full md:w-1/2 ${i % 2 === 0 ? 'text-left md:text-left' : 'text-left md:text-right'}`}>
                      <div className={`bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 inline-block w-full max-w-lg ${i % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
                        <div className={`w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 ${i % 2 === 0 ? '' : 'md:ml-auto'}`}>
                          <step.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                          <span className="md:hidden text-indigo-600 dark:text-indigo-400 mr-2">{i + 1}.</span>
                          {step.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">{step.desc}</p>
                      </div>
                    </div>
                    
                    {/* Empty Space for alignment */}
                    <div className="hidden md:block w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 8. Personalized Onboarding Section */}
        <section className="py-24 bg-slate-50 dark:bg-slate-950 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-bold text-sm mb-6">
                  <Zap className="w-4 h-4" /> Smart Personalization
                </div>
                <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">Tailored to your exact goals.</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                  During onboarding, tell us your university, major, dream job, and skills. Our AI engine instantly configures your dashboard, study recommendations, and career matches specifically for you.
                </p>
                <ul className="space-y-4">
                  {['Customized study planners', 'Industry-specific skill tracking', 'Hyper-relevant job matching'].map((item, i) => (
                    <li key={i} className="flex items-center text-slate-700 dark:text-slate-300 font-medium">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[3rem] blur-3xl opacity-20 dark:opacity-40"></div>
                <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 shadow-2xl">
                  <div className="space-y-6">
                    <div>
                      <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded-full mb-2"></div>
                      <div className="h-12 w-full bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center px-4">
                        <div className="h-4 w-48 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded-full mb-2"></div>
                      <div className="h-12 w-full bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center px-4">
                        <div className="h-4 w-32 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                      </div>
                    </div>
                    <div className="pt-4">
                      <div className="h-12 w-full bg-indigo-600 rounded-xl flex items-center justify-center">
                        <div className="h-4 w-32 bg-white/50 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 9. Career Readiness Section */}
        <section className="py-24 bg-white dark:bg-slate-900" id="career">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-[3rem] blur-3xl opacity-20 dark:opacity-40"></div>
                <div className="relative bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2rem] p-8 shadow-2xl">
                  {/* Mockup Roadmap */}
                  <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-6 before:w-0.5 before:bg-slate-300 dark:before:bg-slate-600">
                    {[
                      { status: 'done', text: 'Learn React Basics' },
                      { status: 'current', text: 'Build Portfolio Project' },
                      { status: 'upcoming', text: 'Apply for Internships' }
                    ].map((item, i) => (
                      <div key={i} className="relative flex items-center gap-6 pl-16">
                        <div className={`absolute left-4 w-5 h-5 rounded-full border-4 border-white dark:border-slate-800 ${item.status === 'done' ? 'bg-emerald-500' : item.status === 'current' ? 'bg-indigo-500 ring-4 ring-indigo-500/30' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 w-full">
                          <div className="font-bold text-slate-900 dark:text-white">{item.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">See your future clearly.</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                  Enter your dream job and let our AI generate a step-by-step roadmap. See exactly what skills you need, track your milestones, and discover the right industries.
                </p>
                <Link to="/login" className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-lg hover:gap-4 transition-all">
                  Explore Career Roadmaps <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 10. AI Learning Support Section */}
        <section className="py-24 bg-slate-900 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Study smarter, not harder.</h2>
              <p className="text-xl text-slate-400">Upload your notes and let AI do the heavy lifting. Generate practice materials in seconds.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 hover:border-indigo-500 transition-colors">
                <Brain className="w-10 h-10 text-purple-400 mb-6" />
                <h3 className="text-2xl font-bold mb-4">AI Quizzes</h3>
                <p className="text-slate-400">Test your knowledge instantly. AI generates multiple-choice questions from your course materials.</p>
              </div>
              <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 hover:border-emerald-500 transition-colors">
                <BookOpen className="w-10 h-10 text-emerald-400 mb-6" />
                <h3 className="text-2xl font-bold mb-4">Smart Flashcards</h3>
                <p className="text-slate-400">Automatically extract key terms and definitions to create spaced-repetition flashcard decks.</p>
              </div>
              <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 hover:border-pink-500 transition-colors">
                <MessageSquare className="w-10 h-10 text-pink-400 mb-6" />
                <h3 className="text-2xl font-bold mb-4">Virtual Tutor</h3>
                <p className="text-slate-400">Stuck on a concept? Chat with your AI study buddy for explanations, examples, and motivation.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 11 & 12. For Schools & Employers */}
        <section className="py-24 bg-white dark:bg-slate-950" id="schools">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-50 dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-8">
                  <Building2 className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">For Schools & Institutions</h3>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                  Improve student outcomes and career readiness visibility. Provide your students with a scalable, AI-driven platform that bridges education and employment.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-slate-700 dark:text-slate-300"><CheckCircle2 className="w-5 h-5 text-blue-500 mr-3" /> Better student planning & support</li>
                  <li className="flex items-center text-slate-700 dark:text-slate-300"><CheckCircle2 className="w-5 h-5 text-blue-500 mr-3" /> Improved academic tracking</li>
                  <li className="flex items-center text-slate-700 dark:text-slate-300"><CheckCircle2 className="w-5 h-5 text-blue-500 mr-3" /> Scalable student engagement</li>
                </ul>
                <button className="font-bold text-blue-600 dark:text-blue-400 hover:underline">Partner with us &rarr;</button>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800">
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mb-8">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">For Employers & Recruiters</h3>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                  Discover emerging talent before they graduate. Post internships and connect with students based on verified skills, interests, and career goals.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-slate-700 dark:text-slate-300"><CheckCircle2 className="w-5 h-5 text-amber-500 mr-3" /> Post entry-level opportunities</li>
                  <li className="flex items-center text-slate-700 dark:text-slate-300"><CheckCircle2 className="w-5 h-5 text-amber-500 mr-3" /> Skill-based talent matching</li>
                  <li className="flex items-center text-slate-700 dark:text-slate-300"><CheckCircle2 className="w-5 h-5 text-amber-500 mr-3" /> Support workforce development</li>
                </ul>
                <button className="font-bold text-amber-600 dark:text-amber-400 hover:underline">Start recruiting &rarr;</button>
              </div>
            </div>
          </div>
        </section>

        {/* 13. Testimonials Section */}
        <section className="py-24 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white">Loved by the community</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { quote: "The AI quizzes completely changed how I study for finals. I also found my summer internship through the career roadmap!", name: "Sarah J.", role: "Computer Science Student", img: "https://i.pravatar.cc/150?img=1" },
                { quote: "Finally, a platform that helps our students see the connection between what they learn today and where they'll work tomorrow.", name: "Dr. Marcus T.", role: "University Counselor", img: "https://i.pravatar.cc/150?img=11" },
                { quote: "We've hired incredible entry-level talent through LearnSync. The skill-matching is far better than traditional job boards.", name: "Elena R.", role: "Tech Recruiter", img: "https://i.pravatar.cc/150?img=5" }
              ].map((t, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="flex text-amber-400 mb-6">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-5 h-5 fill-current" />)}
                  </div>
                  <p className="text-lg text-slate-700 dark:text-slate-300 mb-8 font-medium">"{t.quote}"</p>
                  <div className="flex items-center gap-4">
                    <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{t.name}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 14. Pricing Section */}
        <section className="py-24 bg-white dark:bg-slate-950" id="pricing">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">Simple, transparent pricing</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400">Start for free, upgrade when you need more power.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Free Plan */}
              <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Student Free</h3>
                <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6">$0<span className="text-lg text-slate-500 font-normal">/mo</span></div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center text-slate-700 dark:text-slate-300"><CheckCircle2 className="w-5 h-5 text-indigo-500 mr-3" /> Basic Study Planner</li>
                  <li className="flex items-center text-slate-700 dark:text-slate-300"><CheckCircle2 className="w-5 h-5 text-indigo-500 mr-3" /> Career Roadmap Generator</li>
                  <li className="flex items-center text-slate-700 dark:text-slate-300"><CheckCircle2 className="w-5 h-5 text-indigo-500 mr-3" /> Limited AI Quizzes</li>
                </ul>
                <Link to="/login" className="w-full py-3 px-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  Get Started
                </Link>
              </div>
              
              {/* Pro Plan */}
              <div className="bg-indigo-600 p-8 rounded-3xl border border-indigo-500 flex flex-col transform md:-translate-y-4 shadow-2xl shadow-indigo-500/20 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-400 to-orange-400 text-white px-4 py-1 rounded-full text-sm font-bold shadow-sm">
                  Most Popular
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Student Pro</h3>
                <div className="text-4xl font-extrabold text-white mb-6">$8<span className="text-lg text-indigo-200 font-normal">/mo</span></div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center text-white"><CheckCircle2 className="w-5 h-5 text-indigo-200 mr-3" /> Everything in Free</li>
                  <li className="flex items-center text-white"><CheckCircle2 className="w-5 h-5 text-indigo-200 mr-3" /> Unlimited AI Quizzes & Flashcards</li>
                  <li className="flex items-center text-white"><CheckCircle2 className="w-5 h-5 text-indigo-200 mr-3" /> 24/7 Virtual Study Buddy</li>
                  <li className="flex items-center text-white"><CheckCircle2 className="w-5 h-5 text-indigo-200 mr-3" /> Priority Opportunity Matching</li>
                </ul>
                <Link to="/login" className="w-full py-3 px-4 bg-white text-indigo-600 rounded-xl font-bold text-center hover:bg-slate-50 transition-colors">
                  Upgrade to Pro
                </Link>
              </div>

              {/* Institution Plan */}
              <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Institution</h3>
                <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6">Custom</div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center text-slate-700 dark:text-slate-300"><CheckCircle2 className="w-5 h-5 text-indigo-500 mr-3" /> Pro access for all students</li>
                  <li className="flex items-center text-slate-700 dark:text-slate-300"><CheckCircle2 className="w-5 h-5 text-indigo-500 mr-3" /> Admin Analytics Dashboard</li>
                  <li className="flex items-center text-slate-700 dark:text-slate-300"><CheckCircle2 className="w-5 h-5 text-indigo-500 mr-3" /> Custom Branding</li>
                </ul>
                <button className="w-full py-3 px-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 15. FAQ Section */}
        <section className="py-24 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                  <button 
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                  >
                    <span className="font-bold text-slate-900 dark:text-white">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeFaq === i && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="px-6 pb-4 text-slate-600 dark:text-slate-400"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 16. Final CTA Section */}
        <section className="py-24 bg-indigo-600 text-white text-center px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-8">Help every student study smarter, plan better, and step confidently into the future.</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/login" className="bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-50 transition-colors shadow-lg">
                Start Free Today
              </Link>
              <button className="bg-indigo-800 text-white border border-indigo-500 px-8 py-4 rounded-full text-lg font-bold hover:bg-indigo-700 transition-colors">
                Book a Demo
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 17. Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <Logo className="h-10 w-10" />
                <span className="text-2xl font-bold text-white">LearnSync</span>
              </div>
              <p className="mb-6 max-w-sm">The all-in-one platform bridging the gap between academic learning and career success.</p>
              <div className="flex gap-4">
                {/* Social Icons Placeholder */}
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer">X</div>
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer">in</div>
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer">ig</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Study Planner</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">AI Quizzes</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Career Roadmaps</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; {new Date().getFullYear()} LearnSync. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span>Subscribe to our newsletter</span>
              <div className="flex">
                <input type="email" placeholder="Email address" className="bg-slate-900 border border-slate-700 rounded-l-lg px-4 py-2 focus:outline-none focus:border-indigo-500" />
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg font-bold hover:bg-indigo-700">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
