/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Certificates from './components/Certificates';
import Education from './components/Education';
import Resume from './components/Resume';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminArea from './components/AdminArea';

export default function App() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [disabledSections, setDisabledSections] = useState<Record<string, boolean>>({});

  // Attributive real traffic analytics ping on page load
  useEffect(() => {
    const triggerPing = async () => {
      try {
        let referrer = 'Direct Search Traffic';
        const searchParams = new URLSearchParams(window.location.search);
        const refParam = searchParams.get('ref') || searchParams.get('utm_source');
        
        if (refParam === 'linkedin') {
          referrer = 'LinkedIn Post Links';
        } else if (refParam === 'github') {
          referrer = 'GitHub Project Referrals';
        } else if (refParam === 'qr') {
          referrer = 'Resume PDF QR Code';
        } else if (document.referrer) {
          if (document.referrer.includes('linkedin.com')) {
            referrer = 'LinkedIn Post Links';
          } else if (document.referrer.includes('github.com')) {
            referrer = 'GitHub Project Referrals';
          }
        }
        
        let sessionID = sessionStorage.getItem('jay_session_id');
        if (!sessionID) {
          sessionID = 'session_' + Math.random().toString(36).substring(2, 15);
          sessionStorage.setItem('jay_session_id', sessionID);
        }

        const deviceType = window.innerWidth < 768 ? 'Mobile' : 'Desktop';
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';

        await fetch('/api/analytics/ping', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            referrer,
            sessionId: sessionID,
            timezone,
            deviceType
          })
        });
      } catch (err) {
        console.warn('Analytics bypass:', err);
      }
    };

    triggerPing();
  }, []);

  useEffect(() => {
    const loadDisabledSections = () => {
      try {
        const saved = localStorage.getItem('jay_disabled_sections');
        if (saved) {
          setDisabledSections(JSON.parse(saved));
        } else {
          setDisabledSections({
            skills: false,
            experience: false,
            certificates: false,
            education: false
          });
        }
      } catch (e) {
        console.error(e);
      }
    };

    loadDisabledSections();
    window.addEventListener('jay-profile-updated', loadDisabledSections);
    return () => window.removeEventListener('jay-profile-updated', loadDisabledSections);
  }, []);

  return (
    <div id="app-root-viewport" className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* Dynamic Floating Glass Header */}
      <Navbar 
        onOpenResume={() => setIsResumeOpen(true)} 
        onOpenAdmin={() => setIsAdminOpen(true)} 
      />

      {/* Main Core Viewport Areas */}
      <main id="main-content-flow" className="flex-1">
        <Hero onOpenResume={() => setIsResumeOpen(true)} />
        <About />
        {!disabledSections.skills && <Skills />}
        <Projects />
        {!disabledSections.experience && <Experience />}
        {!disabledSections.certificates && <Certificates />}
        {!disabledSections.education && <Education />}
        <Resume />
        <Contact />
      </main>

      {/* Footer copyright grids */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* High-Contrast Interactive Curriculum Vitae CV Modal Drawer */}
      {isResumeOpen && (
        <Resume 
          isModal={true} 
          onClose={() => setIsResumeOpen(false)} 
        />
      )}

      {/* Secure Private Admin Area Control Dashboard Overlay */}
      <AdminArea 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
      />
    </div>
  );
}

