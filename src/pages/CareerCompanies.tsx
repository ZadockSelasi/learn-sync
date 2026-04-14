import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Globe, Users, ExternalLink, BookmarkPlus, Building2 } from 'lucide-react';

export default function CareerCompanies() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for companies
  const companies = [
    {
      id: 1,
      name: 'MTN Ghana',
      industry: 'Telecommunications',
      location: 'Accra, Ghana',
      size: '1,000-5,000 employees',
      description: 'Leading provider of communication services in Ghana, offering voice, data, and mobile money services.',
      openRoles: 12,
      website: 'mtn.com.gh',
      tags: ['Telecom', 'Tech', 'Mobile Money']
    },
    {
      id: 2,
      name: 'Hubtel',
      industry: 'Technology / Fintech',
      location: 'Accra, Ghana',
      size: '200-500 employees',
      description: 'Ghana\'s leading messaging, payments, and eCommerce provider. We help businesses connect with customers.',
      openRoles: 5,
      website: 'hubtel.com',
      tags: ['Fintech', 'eCommerce', 'Software']
    },
    {
      id: 3,
      name: 'Paystack',
      industry: 'Fintech',
      location: 'Lagos, Nigeria / Accra, Ghana',
      size: '500-1,000 employees',
      description: 'Modern online and offline payments for Africa. A Stripe company.',
      openRoles: 8,
      website: 'paystack.com',
      tags: ['Payments', 'Startup', 'Remote-friendly']
    },
    {
      id: 4,
      name: 'Google',
      industry: 'Technology',
      location: 'Accra, Ghana (AI Center) / Global',
      size: '10,000+ employees',
      description: 'Organizing the world\'s information and making it universally accessible and useful. Home to Google AI Accra.',
      openRoles: 45,
      website: 'careers.google.com',
      tags: ['AI', 'Search', 'Cloud']
    },
    {
      id: 5,
      name: 'Tullow Oil',
      industry: 'Energy',
      location: 'Accra, Ghana',
      size: '1,000-5,000 employees',
      description: 'Independent oil and gas exploration and production company focused on Africa.',
      openRoles: 3,
      website: 'tullowoil.com',
      tags: ['Oil & Gas', 'Engineering', 'Corporate']
    },
    {
      id: 6,
      name: 'Brij',
      industry: 'Fintech',
      location: 'Accra, Ghana',
      size: '10-50 employees',
      description: 'B2B cross-border payments platform connecting African businesses to the world.',
      openRoles: 2,
      website: 'brij.money',
      tags: ['Startup', 'Fintech', 'B2B']
    }
  ];

  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 font-sans pb-8 max-w-7xl mx-auto">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Company Directory</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Explore top companies hiring students and graduates in Ghana and globally.</p>
      </header>

      {/* Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
          <input 
            type="text" 
            placeholder="Search companies by name, industry, or keyword..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Companies List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCompanies.map((company, i) => (
          <motion.div 
            key={company.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all p-6 flex flex-col sm:flex-row gap-6 group"
          >
            <div className="w-20 h-20 shrink-0 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-3xl text-slate-400 dark:text-slate-500">
              {company.name.charAt(0)}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {company.name}
                </h3>
                <button className="text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  <BookmarkPlus className="h-5 w-5" />
                </button>
              </div>
              
              <p className="text-indigo-600 dark:text-indigo-400 font-medium text-sm mb-3">{company.industry}</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">{company.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                  <MapPin className="h-4 w-4 mr-2" /> {company.location}
                </div>
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                  <Users className="h-4 w-4 mr-2" /> {company.size}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {company.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-lg">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-lg">
                  {company.openRoles} Open Roles
                </span>
                <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  <Globe className="h-4 w-4" /> Website
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
          <Building2 className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No companies found</h3>
          <p className="text-slate-500 dark:text-slate-400">Try adjusting your search terms.</p>
        </div>
      )}
    </div>
  );
}
