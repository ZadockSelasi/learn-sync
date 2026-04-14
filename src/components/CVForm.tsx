import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, ChevronLeft, Plus, Trash2, Save } from 'lucide-react';

interface CVFormProps {
  initialData: any;
  onSubmit: (data: any, targetJob: string) => void;
}

const STEPS = [
  'Personal Info',
  'Education',
  'Experience',
  'Skills',
  'Certifications',
  'Projects',
  'Awards',
  'Volunteer',
  'References',
  'Generate'
];

export default function CVForm({ initialData, onSubmit }: CVFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetJob, setTargetJob] = useState('');
  
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: initialData?.fullName || '',
      title: '',
      phone: '',
      email: initialData?.email || '',
      location: '',
      linkedin: '',
      portfolio: initialData?.portfolioUrl || '',
      summary: initialData?.bio || ''
    },
    education: [{ school: initialData?.school || '', degree: '', field: initialData?.program || '', startDate: '', endDate: '', description: '' }],
    experience: [{ jobTitle: '', company: '', location: '', type: '', startDate: '', endDate: '', responsibilities: '', achievements: '' }],
    skills: { technical: initialData?.skills || '', soft: '', tools: '', languages: '' },
    certifications: [{ name: '', issuer: '', issueDate: '', expiryDate: '' }],
    projects: [{ title: '', role: '', description: '', technologies: '', link: '' }],
    awards: [{ title: '', issuer: '', date: '', description: '' }],
    volunteer: [{ role: '', organization: '', startDate: '', endDate: '', description: '' }],
    references: [{ name: '', title: '', company: '', phone: '', email: '', relationship: '' }]
  });

  // Load saved progress
  useEffect(() => {
    const saved = localStorage.getItem('cvFormData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed.formData);
        setTargetJob(parsed.targetJob);
      } catch (e) {
        console.error("Failed to parse saved CV data");
      }
    }
  }, []);

  const saveProgress = () => {
    localStorage.setItem('cvFormData', JSON.stringify({ formData, targetJob }));
    alert('Progress saved!');
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleChange = (section: string, field: string, value: string, index?: number) => {
    setFormData(prev => {
      if (index !== undefined) {
        const newArray = [...(prev as any)[section]];
        newArray[index] = { ...newArray[index], [field]: value };
        return { ...prev, [section]: newArray };
      } else if (section === 'skills') {
        return { ...prev, skills: { ...prev.skills, [field]: value } };
      } else if (section === 'personalInfo') {
        return { ...prev, personalInfo: { ...prev.personalInfo, [field]: value } };
      }
      return prev;
    });
  };

  const addArrayItem = (section: string, emptyItem: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...(prev as any)[section], emptyItem]
    }));
  };

  const removeArrayItem = (section: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [section]: (prev as any)[section].filter((_: any, i: number) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, targetJob);
  };

  const renderInput = (label: string, value: string, onChange: (val: string) => void, type = 'text', required = false, placeholder = '') => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          rows={4}
          className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      )}
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
          <span>Step {currentStep + 1} of {STEPS.length}</span>
          <span>{STEPS[currentStep]}</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Personal Info */}
        {currentStep === 0 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderInput('Full Name', formData.personalInfo.fullName, (v) => handleChange('personalInfo', 'fullName', v), 'text', true)}
              {renderInput('Professional Title', formData.personalInfo.title, (v) => handleChange('personalInfo', 'title', v), 'text', true, 'e.g. Software Engineer')}
              {renderInput('Email Address', formData.personalInfo.email, (v) => handleChange('personalInfo', 'email', v), 'email', true)}
              {renderInput('Phone Number', formData.personalInfo.phone, (v) => handleChange('personalInfo', 'phone', v), 'tel')}
              {renderInput('Location / Address', formData.personalInfo.location, (v) => handleChange('personalInfo', 'location', v))}
              {renderInput('LinkedIn Profile', formData.personalInfo.linkedin, (v) => handleChange('personalInfo', 'linkedin', v), 'url')}
              {renderInput('Portfolio / Website', formData.personalInfo.portfolio, (v) => handleChange('personalInfo', 'portfolio', v), 'url')}
            </div>
            {renderInput('Professional Summary', formData.personalInfo.summary, (v) => handleChange('personalInfo', 'summary', v), 'textarea', true, 'A brief summary of your professional background and goals...')}
          </motion.div>
        )}

        {/* Step 2: Education */}
        {currentStep === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Education</h2>
            {formData.education.map((edu, index) => (
              <div key={index} className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl mb-4 relative">
                {index > 0 && (
                  <button type="button" onClick={() => removeArrayItem('education', index)} className="absolute top-4 right-4 text-red-500 hover:text-red-700">
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderInput('School / University', edu.school, (v) => handleChange('education', 'school', v, index), 'text', true)}
                  {renderInput('Degree / Certificate', edu.degree, (v) => handleChange('education', 'degree', v, index), 'text', true)}
                  {renderInput('Field of Study', edu.field, (v) => handleChange('education', 'field', v, index))}
                  <div className="grid grid-cols-2 gap-2">
                    {renderInput('Start Date', edu.startDate, (v) => handleChange('education', 'startDate', v, index), 'month')}
                    {renderInput('End Date', edu.endDate, (v) => handleChange('education', 'endDate', v, index), 'month')}
                  </div>
                </div>
                {renderInput('Description / Achievements', edu.description, (v) => handleChange('education', 'description', v, index), 'textarea')}
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('education', { school: '', degree: '', field: '', startDate: '', endDate: '', description: '' })} className="flex items-center text-indigo-600 font-medium hover:text-indigo-700">
              <Plus className="h-4 w-4 mr-1" /> Add Education
            </button>
          </motion.div>
        )}

        {/* Step 3: Experience */}
        {currentStep === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Work Experience</h2>
            {formData.experience.map((exp, index) => (
              <div key={index} className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl mb-4 relative">
                {index > 0 && (
                  <button type="button" onClick={() => removeArrayItem('experience', index)} className="absolute top-4 right-4 text-red-500 hover:text-red-700">
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderInput('Job Title', exp.jobTitle, (v) => handleChange('experience', 'jobTitle', v, index), 'text', true)}
                  {renderInput('Company Name', exp.company, (v) => handleChange('experience', 'company', v, index), 'text', true)}
                  {renderInput('Location', exp.location, (v) => handleChange('experience', 'location', v, index))}
                  {renderInput('Employment Type', exp.type, (v) => handleChange('experience', 'type', v, index), 'text', false, 'e.g. Full-time, Internship')}
                  <div className="grid grid-cols-2 gap-2">
                    {renderInput('Start Date', exp.startDate, (v) => handleChange('experience', 'startDate', v, index), 'month', true)}
                    {renderInput('End Date', exp.endDate, (v) => handleChange('experience', 'endDate', v, index), 'text', false, 'e.g. Present or YYYY-MM')}
                  </div>
                </div>
                {renderInput('Key Responsibilities (comma separated)', exp.responsibilities, (v) => handleChange('experience', 'responsibilities', v, index), 'textarea', true)}
                {renderInput('Achievements / Impact (comma separated)', exp.achievements, (v) => handleChange('experience', 'achievements', v, index), 'textarea')}
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('experience', { jobTitle: '', company: '', location: '', type: '', startDate: '', endDate: '', responsibilities: '', achievements: '' })} className="flex items-center text-indigo-600 font-medium hover:text-indigo-700">
              <Plus className="h-4 w-4 mr-1" /> Add Experience
            </button>
          </motion.div>
        )}

        {/* Step 4: Skills */}
        {currentStep === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Skills</h2>
            <p className="text-sm text-slate-500 mb-4">Enter skills separated by commas (e.g., React, Node.js, TypeScript)</p>
            {renderInput('Technical Skills', formData.skills.technical, (v) => handleChange('skills', 'technical', v), 'textarea')}
            {renderInput('Soft Skills', formData.skills.soft, (v) => handleChange('skills', 'soft', v), 'textarea')}
            {renderInput('Tools / Software', formData.skills.tools, (v) => handleChange('skills', 'tools', v), 'textarea')}
            {renderInput('Languages', formData.skills.languages, (v) => handleChange('skills', 'languages', v), 'textarea')}
          </motion.div>
        )}

        {/* Step 5: Certifications */}
        {currentStep === 4 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Certifications</h2>
            {formData.certifications.map((cert, index) => (
              <div key={index} className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl mb-4 relative">
                {index > 0 && (
                  <button type="button" onClick={() => removeArrayItem('certifications', index)} className="absolute top-4 right-4 text-red-500 hover:text-red-700">
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderInput('Certification Name', cert.name, (v) => handleChange('certifications', 'name', v, index))}
                  {renderInput('Issuing Organization', cert.issuer, (v) => handleChange('certifications', 'issuer', v, index))}
                  {renderInput('Issue Date', cert.issueDate, (v) => handleChange('certifications', 'issueDate', v, index), 'month')}
                  {renderInput('Expiry Date', cert.expiryDate, (v) => handleChange('certifications', 'expiryDate', v, index), 'month')}
                </div>
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('certifications', { name: '', issuer: '', issueDate: '', expiryDate: '' })} className="flex items-center text-indigo-600 font-medium hover:text-indigo-700">
              <Plus className="h-4 w-4 mr-1" /> Add Certification
            </button>
          </motion.div>
        )}

        {/* Step 6: Projects */}
        {currentStep === 5 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Projects</h2>
            {formData.projects.map((proj, index) => (
              <div key={index} className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl mb-4 relative">
                {index > 0 && (
                  <button type="button" onClick={() => removeArrayItem('projects', index)} className="absolute top-4 right-4 text-red-500 hover:text-red-700">
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderInput('Project Title', proj.title, (v) => handleChange('projects', 'title', v, index))}
                  {renderInput('Your Role', proj.role, (v) => handleChange('projects', 'role', v, index))}
                  {renderInput('Technologies Used', proj.technologies, (v) => handleChange('projects', 'technologies', v, index), 'text', false, 'Comma separated')}
                  {renderInput('Project Link', proj.link, (v) => handleChange('projects', 'link', v, index), 'url')}
                </div>
                {renderInput('Project Description', proj.description, (v) => handleChange('projects', 'description', v, index), 'textarea')}
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('projects', { title: '', role: '', description: '', technologies: '', link: '' })} className="flex items-center text-indigo-600 font-medium hover:text-indigo-700">
              <Plus className="h-4 w-4 mr-1" /> Add Project
            </button>
          </motion.div>
        )}

        {/* Step 7: Awards */}
        {currentStep === 6 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Awards and Achievements</h2>
            {formData.awards.map((award, index) => (
              <div key={index} className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl mb-4 relative">
                {index > 0 && (
                  <button type="button" onClick={() => removeArrayItem('awards', index)} className="absolute top-4 right-4 text-red-500 hover:text-red-700">
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderInput('Title', award.title, (v) => handleChange('awards', 'title', v, index))}
                  {renderInput('Issuer', award.issuer, (v) => handleChange('awards', 'issuer', v, index))}
                  {renderInput('Date', award.date, (v) => handleChange('awards', 'date', v, index), 'month')}
                </div>
                {renderInput('Description', award.description, (v) => handleChange('awards', 'description', v, index), 'textarea')}
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('awards', { title: '', issuer: '', date: '', description: '' })} className="flex items-center text-indigo-600 font-medium hover:text-indigo-700">
              <Plus className="h-4 w-4 mr-1" /> Add Award
            </button>
          </motion.div>
        )}

        {/* Step 8: Volunteer */}
        {currentStep === 7 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Volunteer Experience</h2>
            {formData.volunteer.map((vol, index) => (
              <div key={index} className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl mb-4 relative">
                {index > 0 && (
                  <button type="button" onClick={() => removeArrayItem('volunteer', index)} className="absolute top-4 right-4 text-red-500 hover:text-red-700">
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderInput('Role', vol.role, (v) => handleChange('volunteer', 'role', v, index))}
                  {renderInput('Organization', vol.organization, (v) => handleChange('volunteer', 'organization', v, index))}
                  {renderInput('Start Date', vol.startDate, (v) => handleChange('volunteer', 'startDate', v, index), 'month')}
                  {renderInput('End Date', vol.endDate, (v) => handleChange('volunteer', 'endDate', v, index), 'month')}
                </div>
                {renderInput('Description', vol.description, (v) => handleChange('volunteer', 'description', v, index), 'textarea')}
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('volunteer', { role: '', organization: '', startDate: '', endDate: '', description: '' })} className="flex items-center text-indigo-600 font-medium hover:text-indigo-700">
              <Plus className="h-4 w-4 mr-1" /> Add Volunteer Experience
            </button>
          </motion.div>
        )}

        {/* Step 9: References */}
        {currentStep === 8 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">References (Optional)</h2>
            {formData.references.map((ref, index) => (
              <div key={index} className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl mb-4 relative">
                {index > 0 && (
                  <button type="button" onClick={() => removeArrayItem('references', index)} className="absolute top-4 right-4 text-red-500 hover:text-red-700">
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderInput('Full Name', ref.name, (v) => handleChange('references', 'name', v, index))}
                  {renderInput('Job Title', ref.title, (v) => handleChange('references', 'title', v, index))}
                  {renderInput('Company / Organization', ref.company, (v) => handleChange('references', 'company', v, index))}
                  {renderInput('Relationship', ref.relationship, (v) => handleChange('references', 'relationship', v, index))}
                  {renderInput('Phone Number', ref.phone, (v) => handleChange('references', 'phone', v, index), 'tel')}
                  {renderInput('Email Address', ref.email, (v) => handleChange('references', 'email', v, index), 'email')}
                </div>
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('references', { name: '', title: '', company: '', phone: '', email: '', relationship: '' })} className="flex items-center text-indigo-600 font-medium hover:text-indigo-700">
              <Plus className="h-4 w-4 mr-1" /> Add Reference
            </button>
          </motion.div>
        )}

        {/* Step 10: Generate */}
        {currentStep === 9 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Ready to Generate</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              You've completed all sections! Enter the target job title to tailor your CV, then click Generate.
            </p>
            {renderInput('Target Job Title', targetJob, setTargetJob, 'text', true, 'e.g. Senior Frontend Developer')}
            
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl mt-6">
              <p className="text-sm text-indigo-800 dark:text-indigo-300">
                <strong>Note:</strong> Our AI will format your data, enhance descriptions to be more impactful, and create a professional, ATS-friendly CV tailored to the target role.
              </p>
            </div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="px-4 py-2 flex items-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </button>
            <button
              type="button"
              onClick={saveProgress}
              className="px-4 py-2 flex items-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Save className="h-4 w-4 mr-1" /> Save Progress
            </button>
          </div>
          
          {currentStep < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 flex items-center transition-colors"
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!targetJob.trim()}
              className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Generate CV
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
