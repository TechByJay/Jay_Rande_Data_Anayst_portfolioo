import { useState } from 'react';
import { Github, Linkedin, ExternalLink } from 'lucide-react';
import { PROJECTS_DATA } from '../data';

export default function Projects() {
  const [filter, setFilter] = useState<string>('All');

  // Standard categories filter
  const categories = ['All', 'Power BI', 'SQL'];
  
  const filteredProjects = filter === 'All' 
    ? PROJECTS_DATA 
    : PROJECTS_DATA.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-24 bg-[#0F172A] border-b border-slate-900 select-none relative overflow-hidden">
      {/* Background glow triggers */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div id="projects-heading-block" className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-mono tracking-widest text-blue-400 uppercase mb-2">
            03 / Portfolio Showcase
          </p>
          <h2 className="section-heading text-white">
            Featured Projects
          </h2>
          <div className="h-1.5 w-16 bg-blue-500 mx-auto mt-4 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
          <p className="text-slate-400 font-light text-xs sm:text-sm mt-4">
            Production-grade retail analytics dashboards, credit modeling databases, and predictive systems.
          </p>
        </div>

        {/* Categories Selector Tab */}
        <div id="projects-filters" className="flex items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              id={`project-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4.5 py-2.5 text-xs font-semibold rounded-full border tracking-wide transition-all cursor-pointer ${
                filter === cat
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/30 font-bold scale-105'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Cards Grid */}
        <div id="project-cards-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((proj) => (
            <div
              id={`portfolio-project-${proj.id}`}
              key={proj.id}
              className="bg-slate-900/40 rounded-3xl border border-slate-800 overflow-hidden shadow-lg flex flex-col group hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/5 hover:border-blue-500/40 transition-all duration-300"
            >
              
              {/* Visual Thumbnail Frame */}
              <div className="h-44 sm:h-48 overflow-hidden relative border-b border-slate-800 bg-slate-950 flex items-center justify-center">
                <img
                  src={proj.image}
                  alt={proj.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://picsum.photos/seed/" + proj.id + "/600/400";
                  }}
                  loading="lazy"
                />
                <span className="absolute top-3 right-3 bg-slate-950/90 backdrop-blur-sm text-[10px] font-mono font-bold text-blue-400 border border-slate-800 px-2.5 py-0.5 rounded-full">
                  {proj.category}
                </span>
              </div>

              {/* Card Meta Content */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-base font-display font-bold text-white line-clamp-2 leading-snug tracking-tight mb-2 group-hover:text-blue-400 transition-colors">
                  {proj.title}
                </h3>
                <p className="text-xs text-slate-400 font-light leading-relaxed mb-5 flex-1 whitespace-pre-line space-y-1">
                  {proj.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {proj.technologies.map(t => (
                    <span key={t} className="text-[9px] font-mono font-bold bg-blue-600/10 border border-blue-500/30 text-blue-400 px-2.5 py-1 rounded-md uppercase tracking-wider shadow-[0_0_15px_rgba(59,130,246,0.15)] group-hover:bg-blue-600/20 group-hover:border-blue-500/50 transition-all">
                      {t}
                    </span>
                  ))}
                </div>

                {/* External CTAs */}
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-800/80">
                  <a
                    id={`project-${proj.id}-github`}
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-slate-950/80 border border-slate-800 hover:bg-slate-950 text-slate-300 text-[11px] font-semibold py-2.5 rounded-xl transition cursor-pointer"
                  >
                    <Github className="h-3.5 w-3.5" />
                    Source SQL/Code
                  </a>
                  <a
                    id={`project-${proj.id}-linkedin`}
                    href={proj.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-blue-600/15 border border-blue-500/20 hover:bg-blue-600/25 text-blue-400 text-[11px] font-semibold py-2.5 rounded-xl transition cursor-pointer"
                  >
                    <Linkedin className="h-3.5 w-3.5" />
                    Read Case Study
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
