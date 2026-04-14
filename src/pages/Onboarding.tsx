import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Target, Briefcase, MapPin, Loader2, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { getUniversityProgramsAndLevels } from '../services/geminiService';

const COMMON_JOBS = [
  "Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Scientist", "Data Analyst", "Product Manager", "Project Manager", "UX Designer", "UI Designer", "Marketing Manager", "Financial Analyst", "Business Analyst", "HR Manager", "Sales Representative", "Accountant", "Registered Nurse", "Teacher", "Mechanical Engineer", "Civil Engineer", "Electrical Engineer", "Graphic Designer", "Content Writer", "Social Media Manager", "Operations Manager", "Consultant", "Research Assistant", "Medical Doctor", "Pharmacist", "Lawyer"
];

const COMMON_INDUSTRIES = [
  "Technology", "Software", "Healthcare", "Finance", "Banking", "Education", "E-learning", "Manufacturing", "Retail", "E-commerce", "Real Estate", "Media & Entertainment", "Energy", "Transportation", "Logistics", "Agriculture", "Telecommunications", "Consulting", "Government", "Non-Profit", "Fashion", "Food & Beverage", "Hospitality", "Travel & Tourism", "Automotive", "Aerospace", "Construction", "Pharmaceuticals"
];

const COMMON_LOCATIONS = [
  "Remote", "Hybrid", "On-site", "Accra, Ghana", "Kumasi, Ghana", "Lagos, Nigeria", "Abuja, Nigeria", "Nairobi, Kenya", "Johannesburg, South Africa", "Cape Town, South Africa", "Kigali, Rwanda", "Cairo, Egypt", "New York, USA", "San Francisco, USA", "London, UK", "Toronto, Canada", "Berlin, Germany", "Sydney, Australia", "Singapore", "Dubai, UAE", "Paris, France", "Tokyo, Japan", "Global"
];

const COMMON_SKILLS = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Ruby", "PHP", "Swift", "Kotlin", "Go", "Rust", "React", "Angular", "Vue.js", "Node.js", "Express", "Django", "Flask", "Spring Boot", "SQL", "MySQL", "PostgreSQL", "MongoDB", "Firebase", "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Git", "GitHub", "CI/CD", "Machine Learning", "Deep Learning", "Data Analysis", "Data Visualization", "Tableau", "Power BI", "Excel", "Project Management", "Agile", "Scrum", "Jira", "Public Speaking", "Communication", "Leadership", "Problem Solving", "Critical Thinking", "Teamwork", "Time Management", "Customer Service", "Sales", "Marketing", "SEO", "Content Creation", "Copywriting", "UI/UX Design", "Figma", "Adobe Creative Suite"
];

const COMMON_PROGRAMS = [
  "Accounting", "Aerospace Engineering", "Agriculture", "Anthropology", "Architecture",
  "Artificial Intelligence", "Astronomy", "Biochemistry", "Biology", "Biomedical Engineering",
  "Business Administration", "Chemical Engineering", "Chemistry", "Civil Engineering",
  "Communications", "Computer Science", "Criminal Justice", "Cybersecurity", "Data Science",
  "Dentistry", "E-commerce", "Ecology", "Economics", "Education", "Electrical Engineering",
  "English Literature", "Entrepreneurship", "Environmental Science", "Epidemiology",
  "Fashion Design", "Finance", "Fine Arts", "Forensic Science", "Game Design", "Genetics",
  "Geology", "Graphic Design", "Health Administration", "History", "Hospitality Management",
  "Human Resources", "Industrial Engineering", "Information Systems", "Information Technology",
  "International Business", "International Relations", "Journalism", "Kinesiology", "Law",
  "Linguistics", "Logistics", "Marine Biology", "Marketing", "Mathematics", "Mechanical Engineering",
  "Medicine", "Microbiology", "Music", "Network Engineering", "Neuroscience", "Nursing",
  "Nutrition", "Operations Management", "Pharmacy", "Philosophy", "Photography", "Physics",
  "Political Science", "Project Management", "Psychology", "Public Administration", "Public Health",
  "Public Relations", "Real Estate", "Risk Management", "Social Work", "Sociology",
  "Software Engineering", "Sports Management", "Statistics", "Supply Chain Management",
  "Theology", "Urban Planning", "Veterinary Medicine", "Web Development", "Zoology"
];

const DEGREE_OPTIONS = [
  "Bachelor's Degree (BSc, BA, BEng, etc.)",
  "Master's Degree (MSc, MA, MBA, etc.)",
  "Doctorate (PhD, EdD, etc.)",
  "Associate Degree",
  "Diploma",
  "Certificate",
  "High School / Secondary School",
  "Other"
];

const AutocompleteInput = ({ label, name, value, onChange, placeholder, options, multi = false, maxSelections = Infinity, containerClassName = "" }: any) => {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShow(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentSelections = multi ? value.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
  const currentSearch = multi ? value.split(',').pop()?.trim() || '' : value;
  const results = options.filter((o: string) => o.toLowerCase().includes(currentSearch.toLowerCase()) && currentSearch.length > 0).slice(0, 10);

  const handleSelect = (val: string) => {
    let newValue = val;
    if (multi) {
      const parts = value.split(',');
      parts.pop(); // Remove the current search term
      const previousSelections = parts.map((p: string) => p.trim()).filter(Boolean);
      
      if (previousSelections.length >= maxSelections) {
        setShow(false);
        return;
      }
      
      parts.push(val);
      const newSelections = parts.map((p: string) => p.trim()).filter(Boolean);
      newValue = newSelections.join(', ') + (newSelections.length >= maxSelections ? '' : ', ');
    }
    onChange({ target: { name, value: newValue } });
    setShow(false);
  };

  return (
    <div className={`relative ${containerClassName}`} ref={ref}>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{label}</label>
      <input 
        type="text" name={name} value={value} 
        onChange={(e) => { 
          if (multi && maxSelections !== Infinity) {
            const parts = e.target.value.split(',');
            const selections = parts.map((p: string) => p.trim()).filter(Boolean);
            if (selections.length > maxSelections) return;
          }
          onChange(e); 
          setShow(true); 
        }}
        onFocus={() => setShow(true)}
        autoComplete="off"
        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
        placeholder={placeholder}
      />
      {multi && maxSelections !== Infinity && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {currentSelections.length} / {maxSelections} selected
        </p>
      )}
      {show && results.length > 0 && (
        <div className="absolute z-20 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-60 overflow-y-auto">
          <ul className="py-2">
            {results.map((res: string, idx: number) => (
              <li key={idx} onClick={() => handleSelect(res)} className="px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors">
                <div className="font-medium text-sm text-slate-900 dark:text-white">{res}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default function Onboarding() {
  const { user, checkOnboardingStatus } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.displayName || '',
    school: '',
    degree: '',
    level: '',
    program: '',
    skills: '',
    dreamJob: '',
    preferredIndustries: '',
    preferredLocations: '',
    portfolioUrl: '',
  });

  // University Search State
  const [uniResults, setUniResults] = useState<any[]>([]);
  const [isSearchingUni, setIsSearchingUni] = useState(false);
  const [showUniDropdown, setShowUniDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Program Search State
  const [programResults, setProgramResults] = useState<string[]>([]);
  const [showProgramDropdown, setShowProgramDropdown] = useState(false);
  const programDropdownRef = useRef<HTMLDivElement>(null);

  // Dynamic University Data State
  const [universityPrograms, setUniversityPrograms] = useState<string[]>(COMMON_PROGRAMS);
  const [universityLevels, setUniversityLevels] = useState<string[]>([
    "Level 100", "Level 200", "Level 300", "Level 400", "Level 500", "Level 600", "Recent Graduate", "Masters / Postgrad"
  ]);
  const [isFetchingPrograms, setIsFetchingPrograms] = useState(false);

  // Handle click outside for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUniDropdown(false);
      }
      if (programDropdownRef.current && !programDropdownRef.current.contains(event.target as Node)) {
        setShowProgramDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter programs locally based on dynamic list
  useEffect(() => {
    if (!formData.program || formData.program.length < 1 || !showProgramDropdown) {
      setProgramResults([]);
      return;
    }
    const searchTerm = formData.program.toLowerCase();
    const results = universityPrograms.filter(p => p.toLowerCase().includes(searchTerm)).slice(0, 10);
    setProgramResults(results);
  }, [formData.program, showProgramDropdown, universityPrograms]);

  // Debounced search for universities using Wikipedia API
  useEffect(() => {
    const searchUniversities = async () => {
      if (!formData.school || formData.school.length < 2 || !showUniDropdown) {
        setUniResults([]);
        return;
      }
      setIsSearchingUni(true);
      
      try {
        const searchTerm = formData.school;
        const response = await fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(searchTerm)}&limit=10&namespace=0&format=json&origin=*`);
        const data = await response.json();
        
        if (data && data[1]) {
          const results = data[1].map((title: string) => ({
            name: title,
            country: 'Global Database'
          }));
          setUniResults(results);
        }
      } catch (error) {
        console.error("Error searching universities:", error);
      } finally {
        setIsSearchingUni(false);
      }
    };

    const timeoutId = setTimeout(searchUniversities, 300);
    return () => clearTimeout(timeoutId);
  }, [formData.school, showUniDropdown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSchoolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, school: e.target.value });
    setShowUniDropdown(true);
  };

  const selectUniversity = async (name: string) => {
    setFormData({ ...formData, school: name });
    setShowUniDropdown(false);
    
    setIsFetchingPrograms(true);
    try {
      const data = await getUniversityProgramsAndLevels(name);
      if (data.programs && data.programs.length > 0) setUniversityPrograms(data.programs);
      if (data.levels && data.levels.length > 0) setUniversityLevels(data.levels);
    } catch (error) {
      console.error("Failed to fetch university details", error);
    } finally {
      setIsFetchingPrograms(false);
    }
  };

  const handleProgramChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, program: e.target.value });
    setShowProgramDropdown(true);
  };

  const selectProgram = (name: string) => {
    setFormData({ ...formData, program: name });
    setShowProgramDropdown(false);
  };

  const handleNext = () => {
    setStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleComplete = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await setDoc(doc(db, 'careerProfiles', user.uid), {
        ...formData,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });
      await checkOnboardingStatus(user.uid);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const isStep1Valid = formData.fullName && formData.school && formData.program && formData.level && formData.degree;
  const isStep2Valid = formData.dreamJob && formData.preferredIndustries && formData.preferredLocations;
  const isStep3Valid = formData.skills; // Portfolio is optional

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl px-4 sm:px-0">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome to LearnSync!
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Let's personalize your experience. Tell us a bit about yourself.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>
            
            {[1, 2, 3].map((num) => (
              <div 
                key={num} 
                className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-300 ${
                  step >= num 
                    ? 'bg-indigo-600 border-indigo-600 text-white' 
                    : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400'
                }`}
              >
                {step > num ? <CheckCircle2 className="w-6 h-6" /> : <span className="font-bold">{num}</span>}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Academic Info</span>
            <span>Career Goals</span>
            <span>Skills & Portfolio</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 sm:rounded-3xl sm:px-10 border border-slate-100 dark:border-slate-800 transition-colors duration-300 overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Basic & Academic Info</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name *</label>
                  <input 
                    type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g. John Doe"
                  />
                </div>

                <div className="relative" ref={dropdownRef}>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">School / University *</label>
                  <div className="relative">
                    <input 
                      type="text" name="school" value={formData.school} onChange={handleSchoolChange}
                      onFocus={() => setShowUniDropdown(true)}
                      autoComplete="off"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-4 pr-10 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      placeholder="e.g. University of Ghana"
                    />
                    {isSearchingUni && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  
                  {showUniDropdown && formData.school.length >= 2 && (
                    <div className="absolute z-20 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                      {isSearchingUni && uniResults.length === 0 ? (
                        <div className="p-4 text-sm text-slate-500 dark:text-slate-400 text-center">Searching universities...</div>
                      ) : uniResults.length > 0 ? (
                        <ul className="py-2">
                          {uniResults.map((uni, idx) => (
                            <li 
                              key={idx}
                              onClick={() => selectUniversity(uni.name)}
                              className="px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
                            >
                              <div className="font-medium text-sm text-slate-900 dark:text-white">{uni.name}</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                                <MapPin className="h-3 w-3" /> {uni.country}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="p-4 text-sm text-slate-500 dark:text-slate-400 text-center">No universities found</div>
                      )}
                    </div>
                  )}
                </div>

                <div className="relative" ref={programDropdownRef}>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Program / Course of Study *
                    {isFetchingPrograms && <Loader2 className="inline ml-2 h-3 w-3 animate-spin text-indigo-500" />}
                  </label>
                  <div className="relative">
                    <input 
                      type="text" name="program" value={formData.program} onChange={handleProgramChange}
                      onFocus={() => setShowProgramDropdown(true)}
                      autoComplete="off"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      placeholder="e.g. Computer Science"
                    />
                  </div>
                  
                  {showProgramDropdown && formData.program.length >= 1 && (
                    <div className="absolute z-20 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                      {programResults.length > 0 ? (
                        <ul className="py-2">
                          {programResults.map((prog, idx) => (
                            <li 
                              key={idx}
                              onClick={() => selectProgram(prog)}
                              className="px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
                            >
                              <div className="font-medium text-sm text-slate-900 dark:text-white">{prog}</div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="p-4 text-sm text-slate-500 dark:text-slate-400 text-center">No programs found</div>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Degree / Certification *
                    </label>
                    <select 
                      name="degree" value={formData.degree} onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Select Degree</option>
                      {DEGREE_OPTIONS.map((deg, idx) => (
                        <option key={idx} value={deg}>{deg}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Current Level (e.g., Level 100, 200, 300) *
                      {isFetchingPrograms && <Loader2 className="inline ml-2 h-3 w-3 animate-spin text-indigo-500" />}
                    </label>
                    <select 
                      name="level" value={formData.level} onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Select Level</option>
                      {universityLevels.map((lvl, idx) => (
                        <option key={idx} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-6 flex justify-end">
                  <button
                    onClick={handleNext}
                    disabled={!isStep1Valid}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    Next Step <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <Target className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Career Goals</h3>
                </div>

                <AutocompleteInput 
                  label="Dream Job / Career Goal *" name="dreamJob" value={formData.dreamJob} onChange={handleChange}
                  placeholder="e.g. Software Engineer, Data Analyst" options={COMMON_JOBS} multi={true}
                />
                
                <AutocompleteInput 
                  label="Preferred Industries *" name="preferredIndustries" value={formData.preferredIndustries} onChange={handleChange}
                  placeholder="e.g. Fintech, Healthcare, EdTech" options={COMMON_INDUSTRIES} multi={true}
                />
                
                <AutocompleteInput 
                  label="Preferred Job Locations (Max 3) *" name="preferredLocations" value={formData.preferredLocations} onChange={handleChange}
                  placeholder="e.g. Accra, Remote, Global" options={COMMON_LOCATIONS} multi={true} maxSelections={3}
                />

                <div className="pt-6 flex justify-between">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-4 py-3 font-medium transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" /> Back
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!isStep2Valid}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    Next Step <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Briefcase className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Skills & Portfolio</h3>
                </div>

                <AutocompleteInput 
                  label="Key Skills (comma separated) *" name="skills" value={formData.skills} onChange={handleChange}
                  placeholder="e.g. Python, React, Data Analysis, Public Speaking" options={COMMON_SKILLS} multi={true}
                />
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Portfolio / LinkedIn URL (Optional)</label>
                  <input 
                    type="url" name="portfolioUrl" value={formData.portfolioUrl} onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div className="pt-6 flex justify-between">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-4 py-3 font-medium transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" /> Back
                  </button>
                  <button
                    onClick={handleComplete}
                    disabled={!isStep3Valid || loading}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-70"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Complete Setup <CheckCircle2 className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
