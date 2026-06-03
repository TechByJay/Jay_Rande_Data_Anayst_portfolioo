import React from 'react';
import { ChevronUp, Github, Linkedin, Cpu, Shield } from 'lucide-react';
import { JAY_PROFILE } from '../data';

interface FooterProps {
  onOpenAdmin: () => void;
}

export default function Footer({ onOpenAdmin }: FooterProps) {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const navLinks = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Skills', id: 'skills' },
    { label: 'Projects', id: 'projects' },
    { label: 'Experience', id: 'experience' },
    { label: 'Certificates', id: 'certificates' },
    { label: 'Education', id: 'education' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleScrollTo = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer id="portfolio-footer" className="bg-slate-950 text-white py-16 px-4 select-none border-t border-slate-900 z-10 relative">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-between gap-8 md:flex-row">
        
        {/* Footprint brand indicator */}
        <div className="text-center md:text-left space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="h-8 w-8 flex items-center justify-center rounded-lg bg-blue-600 font-mono text-white text-sm font-bold shadow-md shadow-blue-500/10">
              JR
            </span>
            <span className="font-display text-md font-extrabold text-white">
              Jay <span className="text-blue-500 font-medium">Rande</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-light max-w-xs leading-relaxed">
            Transforming raw database nodes into readable metrics. Data Analyst & BI Specialist.
          </p>
        </div>

        {/* Categories Link Directory */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-400 font-medium max-w-md">
          {navLinks.map((link) => (
            <a
              id={`footer-nav-${link.id}`}
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleScrollTo(link.id, e)}
              className="hover:text-blue-400 transition-colors uppercase tracking-wider text-[10px]"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Social Indices and Actions */}
        <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
          <div className="flex gap-2">
            <a
              id="footer-linkedin"
              href={JAY_PROFILE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:bg-slate-850 hover:border-blue-500/20 transition-all"
              title="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              id="footer-github"
              href={JAY_PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-850 hover:border-slate-700 transition-all"
              title="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            
            {/* Top triggers scroll back button */}
            <button
              id="footer-scroll-top"
              onClick={handleScrollToTop}
              className="h-8 w-8 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-colors shadow-lg shadow-blue-600/10 cursor-pointer"
              title="Scroll to system top"
            >
              <ChevronUp className="h-4.5 w-4.5" />
            </button>
          </div>
          
          <span className="text-[10px] font-mono text-slate-600">
            © 2026 All Rights Reserved
          </span>
        </div>

      </div>

      <div className="h-px bg-slate-900/60 w-full max-w-7xl mx-auto my-6" />
      
      <div className="max-w-7xl mx-auto text-center font-mono text-[9px] text-slate-705 flex flex-wrap items-center justify-center gap-1.5 leading-relaxed">
        <span>System Node active index · candidate jay_randecs_mumbai ·</span>
        <button 
          onClick={onOpenAdmin}
          className="text-slate-500 hover:text-blue-500 hover:underline hover:decoration-dotted underline-offset-2 transition-colors flex items-center gap-0.5 font-semibold uppercase tracking-wider cursor-pointer"
        >
          <Shield className="h-2.5 w-2.5" />
          admin login console
        </button>
      </div>
    </footer>
  );
}
