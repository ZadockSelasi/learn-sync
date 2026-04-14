import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { generateCV } from '../services/geminiService';
import { motion } from 'motion/react';
import { FileText, Loader2, Download, Briefcase, GraduationCap, Code, Award, Heart, Users, CheckCircle } from 'lucide-react';
import CVForm from '../components/CVForm';

export default function CVBuilder() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [cvData, setCvData] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, 'careerProfiles', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          setProfile({}); // Empty profile if none exists
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setProfile({});
      }
    };
    fetchProfile();
  }, [user]);

  const handleGenerate = async (formData: any, targetJob: string) => {
    setLoading(true);
    try {
      const result = await generateCV(formData, targetJob);
      setCvData(result);
      // Scroll to top to see the generated CV
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Failed to generate CV", error);
      alert("Failed to generate CV. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 font-sans pb-8">
      <header className="print:hidden">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">CV Builder</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Complete your professional profile to generate an ATS-friendly CV tailored to your target role.</p>
      </header>

      {loading && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center print:hidden">
          <Loader2 className="h-12 w-12 text-indigo-500 animate-spin mb-4" />
          <p className="text-white font-medium text-lg">Generating your professional CV...</p>
          <p className="text-slate-300 text-sm mt-2">Our AI is formatting and enhancing your descriptions.</p>
        </div>
      )}

      {/* CV Preview */}
      {cvData && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm print:shadow-none print:border-none print:p-0 mb-12"
        >
          <div className="flex justify-between items-center mb-8 print:hidden border-b border-slate-200 dark:border-slate-700 pb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2" /> Your Generated CV
            </h2>
            <div className="flex gap-4">
              <button
                onClick={() => setCvData(null)}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors"
              >
                Edit Details
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                Print / Save PDF
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-6 text-slate-900 dark:text-slate-100 print:text-black text-sm">
            {/* Header */}
            <div className="text-center border-b-2 border-slate-800 dark:border-slate-200 pb-6 mb-6">
              <h1 className="text-4xl font-bold mb-2 tracking-tight">{cvData.personalInfo?.fullName}</h1>
              {cvData.personalInfo?.title && <p className="text-xl text-slate-600 dark:text-slate-300 print:text-slate-700 mb-3">{cvData.personalInfo.title}</p>}
              
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-slate-600 dark:text-slate-400 print:text-slate-600">
                {cvData.personalInfo?.email && <span>{cvData.personalInfo.email}</span>}
                {cvData.personalInfo?.phone && <span>• {cvData.personalInfo.phone}</span>}
                {cvData.personalInfo?.location && <span>• {cvData.personalInfo.location}</span>}
                {cvData.personalInfo?.linkedin && <span>• {cvData.personalInfo.linkedin}</span>}
                {cvData.personalInfo?.portfolio && <span>• {cvData.personalInfo.portfolio}</span>}
              </div>
            </div>

            {/* Summary */}
            {cvData.personalInfo?.summary && (
              <section className="mb-6">
                <h2 className="text-lg font-bold uppercase tracking-wider mb-2 border-b border-slate-300 dark:border-slate-700 pb-1">Professional Summary</h2>
                <p className="leading-relaxed">{cvData.personalInfo.summary}</p>
              </section>
            )}

            {/* Experience */}
            {cvData.experience && cvData.experience.length > 0 && (
              <section className="mb-6">
                <h2 className="text-lg font-bold uppercase tracking-wider mb-3 border-b border-slate-300 dark:border-slate-700 pb-1 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 print:hidden" /> Experience
                </h2>
                <div className="space-y-5">
                  {cvData.experience.map((exp: any, i: number) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-base">{exp.jobTitle} <span className="font-normal text-slate-600 dark:text-slate-400 print:text-slate-600">| {exp.company}</span></h3>
                        <span className="text-slate-600 dark:text-slate-400 print:text-slate-600 whitespace-nowrap">{exp.startDate} - {exp.endDate}</span>
                      </div>
                      {exp.location && <p className="text-slate-500 dark:text-slate-400 print:text-slate-500 italic mb-2">{exp.location}</p>}
                      <ul className="list-disc list-outside ml-5 space-y-1">
                        {exp.responsibilities?.map((resp: string, j: number) => (
                          <li key={j} className="leading-relaxed">{resp}</li>
                        ))}
                        {exp.achievements?.map((ach: string, j: number) => (
                          <li key={`ach-${j}`} className="leading-relaxed font-medium">{ach}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {cvData.education && cvData.education.length > 0 && (
              <section className="mb-6">
                <h2 className="text-lg font-bold uppercase tracking-wider mb-3 border-b border-slate-300 dark:border-slate-700 pb-1 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 print:hidden" /> Education
                </h2>
                <div className="space-y-4">
                  {cvData.education.map((edu: any, i: number) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-base">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                        <span className="text-slate-600 dark:text-slate-400 print:text-slate-600 whitespace-nowrap">{edu.startDate} - {edu.endDate}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 print:text-slate-700">{edu.school}</p>
                      {edu.description && <p className="mt-1 text-slate-600 dark:text-slate-400 print:text-slate-600">{edu.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {cvData.skills && (Object.keys(cvData.skills).length > 0) && (
              <section className="mb-6">
                <h2 className="text-lg font-bold uppercase tracking-wider mb-3 border-b border-slate-300 dark:border-slate-700 pb-1 flex items-center gap-2">
                  <Code className="h-5 w-5 print:hidden" /> Skills
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {cvData.skills.technical && cvData.skills.technical.length > 0 && (
                    <div><span className="font-bold">Technical:</span> {cvData.skills.technical.join(', ')}</div>
                  )}
                  {cvData.skills.soft && cvData.skills.soft.length > 0 && (
                    <div><span className="font-bold">Soft Skills:</span> {cvData.skills.soft.join(', ')}</div>
                  )}
                  {cvData.skills.tools && cvData.skills.tools.length > 0 && (
                    <div><span className="font-bold">Tools:</span> {cvData.skills.tools.join(', ')}</div>
                  )}
                  {cvData.skills.languages && cvData.skills.languages.length > 0 && (
                    <div><span className="font-bold">Languages:</span> {cvData.skills.languages.join(', ')}</div>
                  )}
                </div>
              </section>
            )}

            {/* Projects */}
            {cvData.projects && cvData.projects.length > 0 && (
              <section className="mb-6">
                <h2 className="text-lg font-bold uppercase tracking-wider mb-3 border-b border-slate-300 dark:border-slate-700 pb-1 flex items-center gap-2">
                  <FileText className="h-5 w-5 print:hidden" /> Projects
                </h2>
                <div className="space-y-4">
                  {cvData.projects.map((proj: any, i: number) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-base">{proj.title} {proj.role && <span className="font-normal text-slate-600 dark:text-slate-400 print:text-slate-600">| {proj.role}</span>}</h3>
                        {proj.link && <span className="text-indigo-600 dark:text-indigo-400 print:text-black">{proj.link}</span>}
                      </div>
                      <p className="leading-relaxed mb-1">{proj.description}</p>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <p className="text-slate-600 dark:text-slate-400 print:text-slate-600"><span className="font-medium">Technologies:</span> {proj.technologies.join(', ')}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {cvData.certifications && cvData.certifications.length > 0 && (
              <section className="mb-6">
                <h2 className="text-lg font-bold uppercase tracking-wider mb-3 border-b border-slate-300 dark:border-slate-700 pb-1 flex items-center gap-2">
                  <Award className="h-5 w-5 print:hidden" /> Certifications
                </h2>
                <div className="space-y-2">
                  {cvData.certifications.map((cert: any, i: number) => (
                    <div key={i} className="flex justify-between items-baseline">
                      <div>
                        <span className="font-bold">{cert.name}</span>
                        <span className="text-slate-600 dark:text-slate-400 print:text-slate-600"> - {cert.issuer}</span>
                      </div>
                      <span className="text-slate-600 dark:text-slate-400 print:text-slate-600 whitespace-nowrap">{cert.issueDate} {cert.expiryDate ? `to ${cert.expiryDate}` : ''}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Awards */}
            {cvData.awards && cvData.awards.length > 0 && (
              <section className="mb-6">
                <h2 className="text-lg font-bold uppercase tracking-wider mb-3 border-b border-slate-300 dark:border-slate-700 pb-1 flex items-center gap-2">
                  <Award className="h-5 w-5 print:hidden" /> Awards & Achievements
                </h2>
                <div className="space-y-3">
                  {cvData.awards.map((award: any, i: number) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-base">{award.title} <span className="font-normal text-slate-600 dark:text-slate-400 print:text-slate-600">| {award.issuer}</span></h3>
                        <span className="text-slate-600 dark:text-slate-400 print:text-slate-600 whitespace-nowrap">{award.date}</span>
                      </div>
                      {award.description && <p className="leading-relaxed">{award.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Volunteer */}
            {cvData.volunteer && cvData.volunteer.length > 0 && (
              <section className="mb-6">
                <h2 className="text-lg font-bold uppercase tracking-wider mb-3 border-b border-slate-300 dark:border-slate-700 pb-1 flex items-center gap-2">
                  <Heart className="h-5 w-5 print:hidden" /> Volunteer Experience
                </h2>
                <div className="space-y-4">
                  {cvData.volunteer.map((vol: any, i: number) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-base">{vol.role} <span className="font-normal text-slate-600 dark:text-slate-400 print:text-slate-600">| {vol.organization}</span></h3>
                        <span className="text-slate-600 dark:text-slate-400 print:text-slate-600 whitespace-nowrap">{vol.startDate} - {vol.endDate}</span>
                      </div>
                      {vol.description && <p className="leading-relaxed">{vol.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* References */}
            {cvData.references && cvData.references.length > 0 && (
              <section className="mb-6">
                <h2 className="text-lg font-bold uppercase tracking-wider mb-3 border-b border-slate-300 dark:border-slate-700 pb-1 flex items-center gap-2">
                  <Users className="h-5 w-5 print:hidden" /> References
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {cvData.references.map((ref: any, i: number) => (
                    <div key={i}>
                      <p className="font-bold">{ref.name}</p>
                      <p className="text-slate-700 dark:text-slate-300 print:text-slate-700">{ref.title}, {ref.company}</p>
                      <p className="text-slate-600 dark:text-slate-400 print:text-slate-600">{ref.email} | {ref.phone}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </motion.div>
      )}

      {/* Form Section */}
      {!cvData && profile !== null && (
        <div className="print:hidden">
          <CVForm initialData={profile} onSubmit={handleGenerate} />
        </div>
      )}
    </div>
  );
}
