import { MapPin, Target, Award, Database, BarChart3, GraduationCap, Briefcase } from 'lucide-react';
import { JAY_PROFILE } from '../data';

export default function About() {
  const stats = [
    { label: 'Key Projects Built', value: '5+', icon: BarChart3, color: 'text-blue-400 bg-blue-500/10' },
    { label: 'Professional Certs', value: '3+', icon: Award, color: 'text-cyan-400 bg-cyan-500/10' },
    { label: 'Industry Internship', value: '1', icon: Briefcase, color: 'text-emerald-400 bg-emerald-500/10' },
    { label: 'Technical tools', value: '20+', icon: Database, color: 'text-amber-400 bg-amber-500/10' }
  ];

  const milestones = [
    {
      year: '2026',
      title: 'SEO & Performance Intern',
      subtitle: 'Cinute Digital Pvt Ltd',
      timeframe: 'Feb 2026 – Apr 2026',
      description: 'Researched and created technical content on software testing, API testing, security testing, and page optimization.',
      type: 'internship'
    },
    {
      year: '2025',
      title: 'Advanced Data Science & BI Specialization',
      subtitle: 'Self-Directed & Professional Certifications',
      timeframe: 'Dec 2024 – May 2025',
      description: 'Engineered intensive analytics systems covering fraud metrics, credit modeling, and PostgreSQL database queries on 1M+ rows.',
      type: 'training'
    },
    {
      year: '2023 - 2026',
      title: 'B.Sc. in Computer Science',
      subtitle: 'Bhavans College (Mumbai University)',
      timeframe: 'Graduating Class of 2026',
      description: 'Strengthened core algorithms, relational database principles, information structures, and statistics. Completed with a CGPA of 6.3.',
      type: 'education'
    }
  ];

  return (
    <section id="about" className="py-24 bg-[#0F172A] border-b border-slate-900 select-none relative overflow-hidden">
      {/* Background radial highlights */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[6000ms]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div id="about-heading-block" className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-mono tracking-widest text-blue-400 uppercase mb-2">
            01 / Identity Summary
          </p>
          <h2 className="section-heading text-white font-display">
            About Me
          </h2>
          <div className="h-1.5 w-16 bg-blue-500 mx-auto mt-4 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
        </div>

        <div id="about-content" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Block: Personal Narrative */}
          <div id="about-narrative-col" className="lg:col-span-7 space-y-6">
            <h3 className="text-xl font-display font-bold text-white tracking-tight sm:text-2xl">
              Sensing trends in complex datasets to shape enterprise directives.
            </h3>
            
            <p className="text-slate-300 leading-relaxed font-light text-sm sm:text-base">
              As a Computer Science graduate specializing in <strong className="font-semibold text-blue-400">Data Analytics and Business Intelligence</strong>, I bridge the gap between technical infrastructure and strategic execution. I thrive on translating noisy relational databases into clear, interactive reporting pipelines that clarify operational patterns, risk exposures, and financial metrics.
            </p>

            <p className="text-slate-300 leading-relaxed font-light text-sm sm:text-base">
              During my academic training, I focused on high-record database engines like PostgreSQL, relational joins, analytics libraries, and enterprise business intelligence using Power BI. From cleaning multi-column arrays in Python to writing complex recursive CTE queries and formulating risk-modeling dashboards, I am dedicated to delivering answers, not just summaries.
            </p>

            {/* Structured focus points */}
            <div id="about-focus-points" className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-4 p-5 bg-slate-900/60 border border-slate-800 rounded-2xl shadow-lg">
                <Target className="h-6 w-6 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-sm font-semibold text-white">Operational Mindset</span>
                  <span className="block text-xs text-slate-400 mt-1 font-light leading-relaxed">Continuous drive to answer the "so-what" from columns and metrics.</span>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-slate-900/60 border border-slate-800 rounded-2xl shadow-lg">
                <MapPin className="h-6 w-6 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-sm font-semibold text-white">Current Base</span>
                  <span className="block text-xs text-slate-400 mt-1 font-light leading-relaxed">{JAY_PROFILE.location}</span>
                </div>
              </div>
            </div>

            {/* Stats Dashboard Grid */}
            <div id="about-stats" className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
              {stats.map((s, idx) => {
                const Icon = s.icon;
                return (
                  <div 
                    id={`stat-card-${idx}`}
                    key={idx} 
                    className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl text-center group hover:border-blue-500/50 transition-all hover:-translate-y-1 shadow-md bg-gradient-to-b from-slate-900/60 to-slate-950/60"
                  >
                    <div className="mx-auto h-11 w-11 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-400 border border-blue-500/15 mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="block text-3xl font-extrabold text-white group-hover:text-blue-400 transition-colors tracking-tight">
                      {s.value}
                    </span>
                    <span className="block text-[10px] text-slate-500 mt-1.5 uppercase tracking-widest font-mono font-bold">
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Block: Professional Milestones */}
          <div id="about-timeline-col" className="lg:col-span-5 bg-slate-900/45 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-xl backdrop-blur-sm">
            <h4 className="text-sm font-mono text-slate-400 uppercase tracking-wider mb-8 flex items-center gap-2 font-semibold">
              <GraduationCap className="h-5 w-5 text-blue-400" />
              Career Timeline
            </h4>

            {/* Timeline wrapper */}
            <div id="about-milestones" className="relative border-l border-slate-800 pl-6 space-y-8 py-2">
              {milestones.map((m, idx) => (
                <div id={`milestone-item-${idx}`} key={idx} className="relative group">
                  {/* Timeline point */}
                  <div className={`absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 bg-slate-950 transition-all group-hover:scale-125 ${
                    m.type === 'internship' ? 'border-emerald-500 ring-4 ring-emerald-500/10' :
                    m.type === 'training' ? 'border-blue-400 ring-4 ring-blue-500/10' :
                    'border-slate-500 ring-4 ring-slate-600/10'
                  }`} />
                  
                  {/* Milestone header info */}
                  <div>
                    <span className="inline-block text-[10px] font-mono uppercase bg-slate-900 text-slate-300 px-2.5 py-0.5 rounded-md mb-2 border border-slate-800">
                      {m.timeframe}
                    </span>
                    <h5 className="text-sm sm:text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                      {m.title}
                    </h5>
                    <span className="block text-xs font-semibold text-slate-400 mt-0.5">
                      {m.subtitle}
                    </span>
                    <p className="text-xs text-slate-400 mt-2 font-light leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Download summary button */}
            <div id="about-resume-cta-block" className="mt-8 pt-6 border-t border-slate-800/60 flex justify-center">
              <span className="text-xs text-slate-500 font-light italic text-center">
                Active & open to relocate for Analyst opportunities.
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
