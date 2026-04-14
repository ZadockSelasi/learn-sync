import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Briefcase, Building2, Filter, BookmarkPlus, ExternalLink } from 'lucide-react';

export default function CareerOpportunities() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  // Mock data for opportunities
  const opportunities = [
    {
      id: 1,
      title: 'Software Engineering Intern',
      company: 'MTN Ghana',
      location: 'Accra, Ghana',
      type: 'Internship',
      workplace: 'Hybrid',
      postedAt: '2 days ago',
      tags: ['React', 'Node.js', 'Telecom'],
      match: 95
    },
    {
      id: 2,
      title: 'Graduate Management Trainee',
      company: 'Tullow Oil',
      location: 'Accra, Ghana',
      type: 'Graduate Program',
      workplace: 'On-site',
      postedAt: '1 week ago',
      tags: ['Engineering', 'Management', 'Energy'],
      match: 88
    },
    {
      id: 3,
      title: 'Product Design Intern (Remote)',
      company: 'Paystack',
      location: 'Remote (Africa)',
      type: 'Internship',
      workplace: 'Remote',
      postedAt: '3 days ago',
      tags: ['Figma', 'UX Research', 'Fintech'],
      match: 92
    },
    {
      id: 4,
      title: 'Data Analyst National Service Personnel',
      company: 'Hubtel',
      location: 'Accra, Ghana',
      type: 'National Service',
      workplace: 'On-site',
      postedAt: 'Just now',
      tags: ['SQL', 'Excel', 'Data Visualization'],
      match: 85
    },
    {
      id: 5,
      title: 'Marketing & Comms Intern',
      company: 'Meltwater Entrepreneurial School of Technology (MEST)',
      location: 'Accra, Ghana',
      type: 'Internship',
      workplace: 'Hybrid',
      postedAt: '5 days ago',
      tags: ['Content Creation', 'Social Media', 'Tech'],
      match: 78
    },
    {
      id: 6,
      title: 'Global Software Engineering Internship',
      company: 'Google',
      location: 'London, UK / Remote',
      type: 'Internship',
      workplace: 'Hybrid',
      postedAt: '1 week ago',
      tags: ['C++', 'Java', 'Algorithms'],
      match: 80
    }
  ];

  const filteredOpps = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          opp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          opp.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'All' || opp.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 font-sans pb-8 max-w-7xl mx-auto">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Opportunity Hub</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Discover internships, graduate roles, and national service placements.</p>
      </header>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by role, company, or skill..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {['All', 'Internship', 'Graduate Program', 'National Service'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                filterType === type 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {type}
            </button>
          ))}
          <button className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors">
            <Filter className="h-4 w-4" /> More Filters
          </button>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOpps.map((opp, i) => (
          <motion.div 
            key={opp.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all flex flex-col h-full overflow-hidden group"
          >
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xl text-slate-500 dark:text-slate-400">
                  {opp.company.charAt(0)}
                </div>
                <button className="text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  <BookmarkPlus className="h-6 w-6" />
                </button>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                {opp.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium mb-4 flex items-center gap-2">
                <Building2 className="h-4 w-4" /> {opp.company}
              </p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                  <MapPin className="h-4 w-4 mr-2" /> {opp.location} ({opp.workplace})
                </div>
                <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                  <Briefcase className="h-4 w-4 mr-2" /> {opp.type}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {opp.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-lg">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-auto">
              <span className="text-xs text-slate-500 dark:text-slate-400">{opp.postedAt}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-md">
                  {opp.match}% Match
                </span>
                <button className="flex items-center gap-1 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
                  Apply <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {filteredOpps.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
          <Search className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No opportunities found</h3>
          <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
