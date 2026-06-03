import { useState } from 'react';
import { BarChart3, Code2, Database, PieChart, Layers, Wrench, ChevronRight, Sparkles } from 'lucide-react';
import { SKILLS_DATA } from '../data';
import { SkillCategory } from '../types';

export default function Skills() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // Map icon names to lucide components
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'BarChart3': return <BarChart3 className="h-5 w-5" />;
      case 'Code2': return <Code2 className="h-5 w-5" />;
      case 'Database': return <Database className="h-5 w-5" />;
      case 'PieChart': return <PieChart className="h-5 w-5" />;
      case 'Libraries': return <Layers className="h-5 w-5" />;
      case 'Wrench': return <Wrench className="h-5 w-5" />;
      default: return <Wrench className="h-5 w-5" />;
    }
  };

  const categories = ['All', ...SKILLS_DATA.map(c => c.title)];

  const filteredData: SkillCategory[] = selectedCategory === 'All'
    ? SKILLS_DATA
    : SKILLS_DATA.filter(c => c.title === selectedCategory);

  return (
    <section id="skills" className="py-24 bg-[#0F172A] text-white border-b border-slate-900 select-none relative overflow-hidden">
      {/* Background neon glows */}
      <div className="absolute top-1/2 left-3/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none animate-pulse duration-[7000ms]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div id="skills-heading-block" className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-mono tracking-widest text-blue-400 uppercase mb-2">
            02 / Tactical Toolbox
          </p>
          <h2 className="section-heading text-white">
            Skills & Expertise
          </h2>
          <div className="h-1.5 w-16 bg-blue-500 mx-auto mt-4 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
          <p className="text-slate-400 font-light text-xs sm:text-sm mt-4">
            Interactive skill matrix. Explore proficiency levels and tactical applications behind Jay's core stacks.
          </p>
        </div>

        {/* Category Selector Tabs */}
        <div id="skills-tabs" className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              id={`skill-filter-${cat.replace(/\s+/g, '-').toLowerCase()}`}
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 text-xs font-semibold rounded-full tracking-wider transition-all border outline-none cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/30 scale-105'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid Dashboard */}
        <div id="skills-matrix-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((cat, idx) => (
            <div 
              id={`skills-group-${idx}`}
              key={cat.title} 
              className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 hover:border-blue-500/40 hover:bg-slate-900/60 transition-all duration-300 shadow-lg"
            >
              {/* Category Title Header */}
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-800">
                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/15 flex items-center justify-center">
                  {getIcon(cat.icon)}
                </div>
                <div>
                  <h3 className="text-base font-display font-bold text-slate-100">
                    {cat.title}
                  </h3>
                  <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold tracking-wider block mt-0.5">
                    {cat.skills.length} competencies
                  </span>
                </div>
              </div>

              {/* Skills Listing inside this Category */}
              <div id={`skills-list-${idx}`} className="space-y-4">
                {cat.skills.map((skill) => (
                  <div
                    id={`skill-row-${skill.name.replace(/\s+/g, '-').toLowerCase()}`}
                    key={skill.name}
                    className="relative group cursor-help"
                    onMouseEnter={() => setHoveredSkill(skill.name)}
                    onMouseLeave={() => setHoveredSkill(null)}
                  >
                    {/* Label & Rating */}
                    <div className="flex justify-between items-center text-xs font-semibold mb-1.5 px-0.5">
                      <span className="text-slate-300 group-hover:text-blue-400 transition-colors">
                        {skill.name}
                      </span>
                      <span className="font-mono text-slate-500 group-hover:text-cyan-400 transition-colors">
                        {skill.rating}%
                      </span>
                    </div>

                    {/* Gauge Track */}
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 group-hover:from-blue-500 group-hover:to-cyan-300 transition-all duration-700 pointer-events-none shadow-[0_0_8px_rgba(59,130,246,0.4)]"
                        style={{ width: `${skill.rating}%` }}
                      />
                    </div>

                    {/* Mini Dynamic Insight Tooltip on hover */}
                    {skill.description && (
                      <div 
                        className={`mt-2 p-2.5 bg-slate-950/95 rounded-xl text-slate-400 text-xs font-light leading-relaxed border border-slate-800/80 transition-all duration-300 transform ${
                          hoveredSkill === skill.name 
                            ? 'opacity-100 max-h-20 scale-100 mt-2.5' 
                            : 'opacity-0 max-h-0 scale-95 overflow-hidden pointer-events-none mt-0'
                        }`}
                      >
                        <span className="inline-flex items-center gap-1 text-cyan-400 text-[9px] font-mono uppercase mb-1 font-bold tracking-wider">
                          <Sparkles className="h-2.5 w-2.5 animate-pulse" />
                          Application
                        </span>
                        <p className="text-[11px] leading-relaxed text-slate-350">{skill.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tactical Note Badge */}
        <div id="skills-certifications-lead" className="mt-12 text-center p-5 bg-slate-900/30 rounded-2xl border border-slate-800/60 max-w-2xl mx-auto flex items-center justify-center gap-3">
          <ChevronRight className="h-4 w-4 text-blue-400 shrink-0" />
          <span className="text-xs text-slate-400 leading-relaxed font-light">
            Jay specializes in combining <strong className="font-semibold text-slate-200">SQL</strong> and <strong className="font-semibold text-slate-200">Python</strong> to execute programmatic Extract-Transform-Load (ETL) routines, followed by compiling custom data architectures in <strong className="font-semibold text-slate-200">Power BI with DAX</strong> for real-time risk dashboard visual tracking.
          </span>
        </div>

      </div>
    </section>
  );
}
