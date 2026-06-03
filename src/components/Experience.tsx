import { Briefcase, Calendar, MapPin, Sparkles, CheckCircle2, TrendingUp, Monitor } from 'lucide-react';
import { EXPERIENCE_DATA } from '../data';

export default function Experience() {
  const exp = EXPERIENCE_DATA[0];

  const secondarymetrics = [
    { label: 'Site Speed Index', before: '3.4s', after: '1.2s', desc: 'LCP latency compression', icon: Monitor },
    { label: 'Organic Link Impression', before: '+0.5%', after: '+14.2%', desc: 'CTR metadata tuning', icon: TrendingUp }
  ];

  return (
    <section id="experience" className="py-24 bg-[#0F172A] border-b border-slate-900 select-none relative overflow-hidden">
      {/* Background neon elements */}
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-blue-600/5 rounded-full blur-[90px] pointer-events-none animate-pulse duration-[9000ms]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div id="experience-heading-block" className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-mono tracking-widest text-blue-400 uppercase mb-2">
            04 / Corporate Milestones
          </p>
          <h2 className="section-heading text-white">
            Professional Experience
          </h2>
          <div className="h-1.5 w-16 bg-blue-500 mx-auto mt-4 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
        </div>

        <div id="experience-card-wrapper" className="max-w-4xl mx-auto bg-slate-900/40 border border-slate-800 shadow-xl rounded-3xl overflow-hidden transition-all duration-300 hover:border-blue-500/30">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white p-6 md:p-8 relative border-b border-slate-800">
            <div className="absolute top-4 right-4 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-[10px] uppercase font-mono text-blue-400 tracking-wider flex items-center gap-1 font-bold">
              <Sparkles className="h-3 w-3 animate-pulse" />
              Completed tenure
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-blue-600/20 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg shadow-md">
                  CD
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-display font-bold text-white tracking-tight">
                    {exp.role}
                  </h3>
                  <span className="block text-sm text-slate-300 font-medium mt-0.5">
                    {exp.company}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-left md:text-right text-xs text-slate-400 font-mono font-semibold">
                <div className="flex items-center gap-1.5 md:justify-end">
                  <Calendar className="h-3.5 w-3.5 text-blue-400" />
                  <span>{exp.duration}</span>
                </div>
                <div className="flex items-center gap-1.5 md:justify-end">
                  <MapPin className="h-3.5 w-3.5 text-blue-400" />
                  <span>{exp.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Job Core Tasks */}
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Core bullets list */}
            <div className="md:col-span-7 space-y-4">
              <h4 className="text-xs uppercase font-mono tracking-wider text-slate-550 font-bold mb-3 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-blue-400" />
                Core Initiatives & Delivery
              </h4>
              
              <ul className="space-y-4">
                {exp.description.map((bullet, bidx) => (
                  <li id={`exp-bullet-${bidx}`} key={bidx} className="flex gap-3 text-slate-300 text-xs sm:text-sm font-light leading-relaxed">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Simulated analytics impact metrics */}
            <div className="md:col-span-5 bg-slate-950/45 rounded-2xl p-5 border border-slate-800 space-y-4">
              <h4 className="text-xs uppercase font-mono tracking-wider text-slate-450 font-bold mb-2">
                Measured Analytics Impact
              </h4>
              
              {secondarymetrics.map((met, midx) => {
                const Icon = met.icon;
                return (
                  <div key={midx} className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl shadow-md hover:border-blue-500/30 transition-all">
                    <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold mb-2">
                      <Icon className="h-4 w-4 text-blue-400" />
                      {met.label}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-slate-500 line-through">{met.before}</span>
                      <span className="text-lg font-extrabold text-emerald-400 leading-none">{met.after}</span>
                      <span className="text-[9px] font-mono font-bold text-slate-400 ml-auto bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-md uppercase tracking-wide">{met.desc}</span>
                    </div>
                  </div>
                );
              })}

              <p className="text-[10px] text-slate-500 font-light italic leading-normal pt-2">
                Tenure was focused on translating visual crawl statistics into actionable performance adjustments for the technical engineering team.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
