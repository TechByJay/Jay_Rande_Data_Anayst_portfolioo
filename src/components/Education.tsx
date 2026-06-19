import { GraduationCap, Calendar, Award, Building, BookOpen, CheckCircle2 } from 'lucide-react';
import { EDUCATION_DATA } from '../data';

export default function Education() {
  const edu = EDUCATION_DATA[0];

  const focusCoursework = [
    'Database Management Systems',
    'Exploratory Data Analysis',
    'Applied Logic & Mathematics',
    'Structure of Query Languages',
    'Algorithmic Structures & C++',
    'Software Architecture & Agile'
  ];

  return (
    <section id="education" className="py-24 bg-[#0F172A] border-b border-slate-900 select-none relative overflow-hidden">
      {/* Background glow highlights */}
      <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div id="education-heading-block" className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-mono tracking-widest text-blue-400 uppercase mb-2">
            06 / Academic Ledger
          </p>
          <h2 className="section-heading text-white">
            Education
          </h2>
          <div className="h-1.5 w-16 bg-blue-500 mx-auto mt-4 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
        </div>

        <div id="education-layout" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
          
          {/* Main Card: Degree and University */}
          <div className="lg:col-span-8 bg-slate-900/40 border border-slate-800 shadow-xl rounded-3xl p-6 md:p-8 space-y-6">
            
            {/* College & University Info */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <span className="block text-xs font-mono text-blue-400 uppercase tracking-widest mb-1 font-bold">
                    Mumbai University Syllabus
                  </span>
                  <h3 className="text-base sm:text-xl font-display font-bold text-white tracking-tight">
                    {edu.degree}
                  </h3>
                  <span className="block text-sm text-slate-350 font-medium mt-1">
                    {edu.college}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 font-mono text-xs text-slate-500 shrink-0 font-semibold">
                <Calendar className="h-4 w-4 text-blue-400" />
                <span>{edu.duration}</span>
              </div>
            </div>

            <div className="h-px bg-slate-800" />

            {/* Course Curriculum Bullet points */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase font-mono tracking-wider text-slate-450 font-bold flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-400Count" />
                Specialized Coursework & Academic Focus
              </h4>
              
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2">
                {edu.achievements?.map((bullet, idx) => (
                  <li id={`edu-ach-${idx}`} key={idx} className="flex gap-3 text-slate-300 text-xs sm:text-sm font-light leading-relaxed sm:col-span-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="h-px bg-slate-800" />

            {/* Practical Project Stack */}
            <div>
              <h4 className="text-xs uppercase font-mono tracking-wider text-slate-450 font-bold mb-4">
                Core Syllabi Subjects Listed
              </h4>
              <div className="flex flex-wrap gap-2">
                {focusCoursework.map((course, idx) => (
                  <span 
                    key={idx}
                    className="text-[11px] font-mono bg-slate-950/60 border border-slate-800 hover:border-blue-500/30 hover:bg-slate-900/60 transition-all text-slate-300 px-3 py-1.5 rounded-full cursor-default"
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar Stats Widget: Score ledger */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* CGPA gauge card */}
            <div className="bg-slate-900/40 border border-slate-800 shadow-xl rounded-3xl p-6 text-center select-none space-y-4">
              <span className="block text-xs uppercase font-mono text-slate-400 font-bold">
                Grade Metric System
              </span>
              
              <div className="relative h-28 w-28 mx-auto flex items-center justify-center">
                {/* SVG Dial circular indicator */}
                <svg className="absolute inset-0 h-full w-full rotate-270" viewBox="0 0 36 36">
                  <path
                    className="stroke-slate-800"
                    strokeWidth="2.5"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="stroke-blue-500 transition-all duration-1000 shadow-lg"
                    strokeWidth="2.5"
                    strokeDasharray="63, 100" /* Representing 6.3/10 CGPA, so 63% fill */
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                
                <div className="text-center relative z-10">
                  <span className="block text-3xl font-extrabold text-white tracking-tight leading-none mb-1">{edu.cgpa}</span>
                  <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">of 10.0 scale</span>
                </div>
              </div>

              <div>
                <span className="inline-block text-[10px] uppercase font-mono font-bold px-3.5 py-1 bg-blue-500/10 border border-blue-500/15 text-blue-400 rounded-lg">
                  First Class Grade
                </span>
                <p className="text-[10px] text-slate-500 mt-3 max-w-xs mx-auto leading-normal font-light">
                  Reflects strong consistency throughout database development laboratories and computing projects.
                </p>
              </div>
            </div>

            {/* University Board Information */}
            <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-5 flex gap-4 items-center">
              <div className="h-10 w-10 shrink-0 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Building className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-[9px] uppercase font-mono text-slate-500 font-bold">Affiliation Registry</span>
                <span className="block text-xs font-semibold text-slate-200 mt-0.5 leading-snug">Mumbai University (MU), State Board of Maharashtra</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
