import React, { useState, useEffect } from 'react';
import { Download, ChevronRight, Github, Linkedin, TrendingUp, Cpu, Database, BarChart3 } from 'lucide-react';
import { JAY_PROFILE } from '../data';

interface HeroProps {
  onOpenResume: () => void;
}

export default function Hero({ onOpenResume }: HeroProps) {
  const [titleIdx, setTitleIdx] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Dynamic customization states
  const [tagline, setTagline] = useState(JAY_PROFILE.tagline);
  const [titles, setTitles] = useState<string[]>(JAY_PROFILE.title);

  // Load custom values and listen to live updates
  useEffect(() => {
    const loadProfile = () => {
      const savedTagline = localStorage.getItem('jay_custom_tagline');
      if (savedTagline) setTagline(savedTagline);

      const savedTitle = localStorage.getItem('jay_custom_title');
      if (savedTitle) {
        const parsed = savedTitle.split(',').map(s => s.trim()).filter(Boolean);
        if (parsed.length > 0) {
          setTitles(parsed);
          setTitleIdx((prev) => (prev >= parsed.length ? 0 : prev));
        }
      } else {
        setTitles(JAY_PROFILE.title);
      }
    };

    loadProfile();

    window.addEventListener('jay-profile-updated', loadProfile);
    return () => window.removeEventListener('jay-profile-updated', loadProfile);
  }, []);

  const period = 2000; // time between titles
  const typingSpeed = 100; // character typing offset
  const deletingSpeed = 50; // character deletion offset

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentTitle = titles[titleIdx] || JAY_PROFILE.title[0];
    const fullText = currentTitle;

    const tick = () => {
      if (!isDeleting) {
        setDisplayText(fullText.substring(0, displayText.length + 1));
        if (displayText === fullText) {
          timer = setTimeout(() => setIsDeleting(true), period);
          return;
        }
      } else {
        setDisplayText(fullText.substring(0, displayText.length - 1));
        if (displayText === '') {
          setIsDeleting(false);
          setTitleIdx((prev) => (prev + 1) % titles.length);
          return;
        }
      }

      timer = setTimeout(tick, isDeleting ? deletingSpeed : typingSpeed);
    };

    timer = setTimeout(tick, isDeleting ? deletingSpeed : typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, titleIdx, titles]);

  const handleScrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('projects');
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 85,
        behavior: 'smooth'
      });
    }
  };

  const handleDownloadClick = () => {
    const downloadBtn = document.getElementById('primary-download-pdf-btn');
    if (downloadBtn) {
      downloadBtn.click();
    } else {
      onOpenResume();
    }
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen bg-slate-950 flex items-center justify-center pt-24 pb-16 overflow-hidden select-none border-b border-slate-900"
    >
      {/* Absolute Tech Grid Background */}
      <div className="absolute inset-0 z-0">
        <svg className="absolute w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="1" />
            </pattern>
            <radialGradient id="skyGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(15, 98, 254, 0.4)" />
              <stop offset="100%" stopColor="rgba(15, 23, 42, 0)" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div className="absolute -top-40 -left-40 w-120 h-120 rounded-full fill-blue-500 opacity-20 filter blur-3xl pointer-events-none" style={{ background: 'url(#skyGrad)' }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl pointer-events-none" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Premium Frametight Portrait */}
        <div id="hero-portrait-col" className="lg:col-span-5 flex justify-center order-2 lg:order-1 transition-all duration-700 animate-slide-up">
          <div className="relative group w-72 h-72 sm:w-85 sm:h-85 md:w-96 md:h-96">
            
            {/* Ambient Shadow Halos */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-3xl blur-md opacity-30 group-hover:opacity-50 transition duration-500" />
            
            {/* Tech Corners */}
            <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-blue-500" />
            <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-500" />
            
            {/* Interactive Analytical Floating Badges */}
            <div className="absolute -top-2 -right-4 bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-xl backdrop-blur-sm flex items-center gap-2 animate-bounce duration-[4000ms] hover:scale-105 transition-transform">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <div>
                <span className="block text-[10px] uppercase text-slate-400 font-mono">Clean rate</span>
                <span className="text-xs font-bold text-white">99.8% Accuracy</span>
              </div>
            </div>

            <div className="absolute bottom-8 -left-6 bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-xl backdrop-blur-sm flex items-center gap-2.5 animate-pulse duration-[3000ms] hover:scale-105 transition-transform">
              <Database className="h-5 w-5 text-cyan-400" />
              <div>
                <span className="block text-[10px] uppercase text-slate-400 font-mono">Postgres Index</span>
                <span className="text-xs font-bold text-white">1M+ Records</span>
              </div>
            </div>

            {/* Immersive Portrait Card */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl flex items-center justify-center">
              <img 
                src={JAY_PROFILE.profileImg} 
                alt="Jay Rande - Professional Data Analyst"
                referrerPolicy="no-referrer"
                loading="eager"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  // Fallback if image fails
                  const target = e.target as HTMLImageElement;
                  target.src = "https://picsum.photos/seed/jay/600/600";
                }}
              />
              {/* Slate Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
            </div>
          </div>
        </div>

        {/* Right Side: Identity Core */}
        <div id="hero-identity-col" className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left order-1 lg:order-2">
          
          {/* Greeting Cap */}
          <div className="inline-flex items-center gap-2 bg-blue-900/20 border border-blue-500/20 px-4 py-1.5 rounded-full text-blue-400 font-mono text-xs mb-6 tracking-wide uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Open to new analyst opportunities
          </div>

          {/* User Name */}
          <h1 id="hero-name-heading" className="display-hero text-white mb-2 uppercase font-extrabold">
            {JAY_PROFILE.name}
          </h1>

          {/* Typing Title Display */}
          <div id="hero-scroller" className="h-10 sm:h-12 md:h-14 flex items-center mb-6">
            <span className="text-lg sm:text-2xl md:text-3xl font-display font-bold text-slate-200">
              I am a{' '}
              <span className="text-blue-500 border-r-3 border-blue-500 animate-pulse pr-1 inline-block">
                {displayText || '\u00A0'}
              </span>
            </span>
          </div>

          {/* Paragraph Tagline */}
          <p id="hero-tagline-para" className="text-sm sm:text-base md:text-lg text-slate-400 max-w-xl font-light mb-10 leading-relaxed">
            {tagline}
          </p>

          {/* Call-to-Action Controls */}
          <div id="hero-cta-group" className="flex flex-col sm:flex-row gap-4 mb-10 w-full sm:w-auto">
            <a 
              id="hero-projects-cta"
              href="#projects"
              onClick={handleScrollToProjects}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3.5 rounded-xl transition duration-200 shadow-xl shadow-blue-600/20 group cursor-pointer"
            >
              View Projects
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <button
              id="hero-resume-cta"
              onClick={handleDownloadClick}
              className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 font-medium px-6 py-3.5 rounded-xl transition duration-200 cursor-pointer"
            >
              <Download className="h-4.5 w-4.5 text-blue-500" />
              Download Resume
            </button>
          </div>

          {/* Social connections */}
          <div id="hero-socials" className="flex items-center gap-4">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
              Network:
            </span>
            <a
              id="hero-social-linkedin"
              href={JAY_PROFILE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-400 hover:bg-slate-850 hover:scale-105 transition-all"
              title="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              id="hero-social-github"
              href={JAY_PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850 hover:scale-105 transition-all"
              title="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>

        </div>

      </div>

      {/* Decorative Bottom Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 h-8 bg-slate-950">
        <div className="absolute inset-x-0 bottom-0 h-px bg-slate-900" />
      </div>
    </section>
  );
}
