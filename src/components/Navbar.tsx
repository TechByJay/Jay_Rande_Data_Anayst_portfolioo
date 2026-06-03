import React, { useState, useEffect } from 'react';
import { Menu, X, Github, Linkedin, FileText, ChevronRight, Shield } from 'lucide-react';
import { JAY_PROFILE } from '../data';

interface NavbarProps {
  onOpenResume: () => void;
  onOpenAdmin: () => void;
}

export default function Navbar({ onOpenResume, onOpenAdmin }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Skills', id: 'skills' },
    { label: 'Projects', id: 'projects' },
    { label: 'Experience', id: 'experience' },
    { label: 'Certificates', id: 'certificates' },
    { label: 'Education', id: 'education' },
    { label: 'Resume', id: 'resume' },
    { label: 'Contact', id: 'contact' },
  ];

  // Monitor scrolling to change navbar background opacity
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Detect active section on scroll
      const scrollPosition = window.scrollY + 100;
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
    
    if (id === 'resume') {
      onOpenResume();
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const topOffset = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: topOffset,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  return (
    <header 
      id="navbar-header"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-4 py-3 md:px-8 ${
        isScrolled 
          ? 'bg-slate-900/80 backdrop-blur-md shadow-lg shadow-blue-950/20 py-2 border-b border-slate-800' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand/Logo Logo */}
        <a 
          id="navbar-brand"
          href="#home" 
          onClick={(e) => handleScrollTo('home', e)}
          className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-white group"
        >
          <span className="h-9 w-9 flex items-center justify-center rounded-lg bg-blue-600 font-mono text-white group-hover:bg-blue-500 transition-colors shadow-md shadow-blue-500/10">
            JR
          </span>
          <span className="hidden sm:block">
            Jay <span className="text-blue-500 font-medium">Rande</span>
          </span>
          <span className="text-xs bg-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded-full border border-slate-700 hidden lg:inline-block">
            data.analyst
          </span>
        </a>

        {/* Desktop Navigation Items */}
        <nav id="desktop-nav" className="hidden lg:flex items-center gap-1.5 bg-slate-950/40 px-3 py-1.5 rounded-full border border-slate-800/40 backdrop-blur-sm">
          {navItems.map((item) => (
            <a
              id={`nav-link-${item.id}`}
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleScrollTo(item.id, e)}
              className={`text-[13px] font-medium px-3.5 py-1.5 rounded-full transition-all duration-200 uppercase tracking-wider ${
                activeSection === item.id
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Action Controls */}
        <div id="nav-actions" className="hidden lg:flex items-center gap-3">
          <a
            id="nav-social-linkedin"
            href={JAY_PROFILE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800/60 rounded-full transition-colors border border-slate-800/50"
            title="LinkedIn"
          >
            <Linkedin className="h-4.5 w-4.5" />
          </a>
          <a
            id="nav-social-github"
            href={JAY_PROFILE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-full transition-colors border border-slate-800/50"
            title="GitHub"
          >
            <Github className="h-4.5 w-4.5" />
          </a>
          <button
            id="nav-admin-trigger-icon"
            onClick={onOpenAdmin}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-full transition-colors border border-slate-800/50 cursor-pointer"
            title="Portal Command shell"
          >
            <Shield className="h-4.5 w-4.5 text-blue-500" />
          </button>
          <button
            id="nav-resume-download-btn"
            onClick={onOpenResume}
            className="flex items-center gap-1.5 bg-blue-600 text-white hover:bg-blue-500 text-[13px] font-medium px-4 py-2 rounded-lg transition-all border border-blue-500 shadow-lg shadow-blue-600/20 active:scale-95 cursor-pointer"
          >
            <FileText className="h-4 w-4" />
            Resume
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            id="mobile-resume-trigger"
            onClick={onOpenResume}
            className="p-2 text-blue-400 hover:bg-slate-800/60 rounded-lg transition-colors border border-slate-800/50"
            title="View Resume"
          >
            <FileText className="h-5 w-5" />
          </button>
          
          <button
            id="mobile-admin-trigger"
            onClick={() => {
              setIsOpen(false);
              onOpenAdmin();
            }}
            className="p-2 text-blue-400 hover:bg-slate-800/60 rounded-lg transition-colors border border-slate-800/50 cursor-pointer"
            title="Portal console"
          >
            <Shield className="h-5 w-5 text-blue-500" />
          </button>
          
          <button
            id="hamburger-toggle"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors border border-slate-800/50 cursor-pointer"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5.5 w-5.5" /> : <Menu className="h-5.5 w-5.5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div 
        id="mobile-nav-panel"
        className={`fixed inset-x-0 top-[60px] bg-slate-950/98 backdrop-blur-xl border-b border-slate-800 p-6 flex flex-col gap-5 transition-all duration-300 lg:hidden shadow-2xl ${
          isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div id="mobile-nav-links" className="grid grid-cols-2 gap-2">
          {navItems.map((item) => (
            <a
              id={`mobile-nav-link-${item.id}`}
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleScrollTo(item.id, e)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                activeSection === item.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white'
              }`}
            >
              <div className={`h-1.5 w-1.5 rounded-full ${activeSection === item.id ? 'bg-white' : 'bg-slate-600'}`} />
              {item.label}
            </a>
          ))}
        </div>

        <div className="h-px bg-slate-800/80 my-1" />

        <div className="flex items-center justify-between">
          <div className="flex gap-2.5">
            <a
              id="mobile-linkedin-link"
              href={JAY_PROFILE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-slate-900/60 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-xl transition-colors border border-slate-800"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              id="mobile-github-link"
              href={JAY_PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors border border-slate-800"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>

          <button
            id="mobile-resume-full-btn"
            onClick={onOpenResume}
            className="flex items-center justify-center gap-1.5 bg-blue-600 text-white font-medium px-5 py-3 rounded-xl hover:bg-blue-500 transition-colors text-sm shadow-md shadow-blue-900/20"
          >
            <FileText className="h-4.5 w-4.5" />
            View Resume CV
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
