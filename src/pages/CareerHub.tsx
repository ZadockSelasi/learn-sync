import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Briefcase, Building2, UserCircle, Search, ChevronRight, Star, MapPin, GraduationCap, TrendingUp, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CareerHub() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, 'careerProfiles', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching career profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const recommendedOpportunities = [
    { id: 1, title: 'Software Engineering Intern', company: 'MTN Ghana', location: 'Accra, Ghana', type: 'Internship', match: 95 },
    { id: 2, title: 'Data Analyst Graduate Trainee', company: 'Hubtel', location: 'Accra, Ghana', type: 'Graduate Program', match: 88 },
    { id: 3, title: 'Product Design Intern', company: 'Paystack', location: 'Remote', type: 'Internship', match: 82 },
  ];

  const savedCompanies = [
    { id: 1, name: 'Google', industry: 'Technology', location: 'Global / Remote' },
    { id: 2, name: 'Tullow Oil', industry: 'Energy', location: 'Accra, Ghana' },
    { id: 3, name: 'Brij', industry: 'Fintech', location: 'Accra, Ghana' },
  ];

  return (
    <div className="space-y-8 font-sans pb-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Career Pathway Hub</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Connect your studies to real-world opportunities in Ghana and beyond.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/career/profile" className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <UserCircle className="h-5 w-5" />
            My Profile
          </Link>
          <Link to="/career/opportunities" className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors">
            <Search className="h-5 w-5" />
            Find Opportunities
          </Link>
        </div>
      </header>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/career/profile">
          <motion.div whileHover={{ y: -4 }} className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-3xl text-white shadow-lg shadow-blue-500/20 h-full">
            <UserCircle className="h-8 w-8 mb-4 opacity-80" />
            <h3 className="text-xl font-bold mb-2">Career Profile</h3>
            <p className="text-blue-100 text-sm">Build your professional identity, list skills, and set your dream job.</p>
            {!profile && !loading && (
              <div className="mt-4 inline-flex items-center text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                Action Required: Complete Profile
              </div>
            )}
          </motion.div>
        </Link>
        <Link to="/career/opportunities">
          <motion.div whileHover={{ y: -4 }} className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-3xl text-white shadow-lg shadow-emerald-500/20 h-full">
            <Briefcase className="h-8 w-8 mb-4 opacity-80" />
            <h3 className="text-xl font-bold mb-2">Opportunities</h3>
            <p className="text-emerald-100 text-sm">Discover internships, graduate roles, and national service placements.</p>
          </motion.div>
        </Link>
        <Link to="/career/companies">
          <motion.div whileHover={{ y: -4 }} className="bg-gradient-to-br from-purple-500 to-fuchsia-600 p-6 rounded-3xl text-white shadow-lg shadow-purple-500/20 h-full">
            <Building2 className="h-8 w-8 mb-4 opacity-80" />
            <h3 className="text-xl font-bold mb-2">Company Directory</h3>
            <p className="text-purple-100 text-sm">Explore top companies hiring students and graduates in Ghana & globally.</p>
          </motion.div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Recommended Opportunities */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                Recommended for You
              </h2>
              <Link to="/career/opportunities" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {recommendedOpportunities.map((opp) => (
                <div key={opp.id} className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900/50 hover:shadow-md transition-all group cursor-pointer bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{opp.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 font-medium">{opp.company}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-2 py-1 rounded-md mb-2">
                        {opp.match}% Match
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-4 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {opp.location}</span>
                    <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" /> {opp.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Career Readiness */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Career Readiness
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">CV Builder</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-2">Create a professional CV tailored for student opportunities.</p>
                  <Link to="/career/cv-builder" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">Start Building</Link>
                </div>
              </div>
              <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Skill Gap Analysis</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-2">See what skills you need for your dream job.</p>
                  <Link to="/career/skill-gap" className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline">Analyze Skills</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
          {/* Profile Summary Widget */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-center">
            <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-4 text-2xl font-bold">
              {user?.displayName?.charAt(0) || 'U'}
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">{user?.displayName || 'Student'}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              {profile?.program || 'Program not set'} • {profile?.level || 'Level not set'}
            </p>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-left mb-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mb-1">Dream Role</p>
              <p className="font-medium text-slate-900 dark:text-white">{profile?.dreamJob || 'Not specified yet'}</p>
            </div>
            
            <Link to="/career/profile" className="block w-full py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              Edit Profile
            </Link>
          </div>

          {/* Saved Companies */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                Saved Companies
              </h3>
            </div>
            <div className="space-y-3">
              {savedCompanies.map(company => (
                <div key={company.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400">
                    {company.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white text-sm">{company.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{company.industry}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/career/companies" className="block mt-4 text-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
              Discover more companies
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
