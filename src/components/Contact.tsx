import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Phone, Send, Github, Linkedin, CheckCircle2, Sparkles, MessageSquare, ShieldAlert, RefreshCw } from 'lucide-react';
import { JAY_PROFILE } from '../data';

interface SentMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
}

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submissionCount, setSubmissionCount] = useState(0);

  // Retrieve submission counts from local storage to show past action log
  useEffect(() => {
    try {
      const stored = localStorage.getItem('jay_portfolio_msgs');
      if (stored) {
        const parsed = JSON.parse(stored) as SentMessage[];
        setSubmissionCount(parsed.length);
      }
    } catch (e) {
      console.error(e);
    }
  }, [success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Field audits
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setErrorMsg('All input fields are required to deliver the directive.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMsg('Please input a valid standard electronic mail address.');
      return;
    }

    setIsSubmitting(true);

    const messageSubject = subject.trim();
    const senderName = name.trim();
    const senderEmail = email.trim();
    const messageContent = message.trim();

    try {
      // Sync a copy dynamically to our server's backend database
      try {
        await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: senderName,
            email: senderEmail,
            subject: messageSubject,
            message: messageContent
          })
        });
      } catch (dbErr) {
        console.warn('Failed to commit database record on backend:', dbErr);
      }

      const formspreeUrl = localStorage.getItem('formspree_url') || 'https://formspree.io/f/mnjyqpvn';
      const response = await fetch(formspreeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: senderName,
          email: senderEmail,
          subject: messageSubject,
          message: messageContent
        })
      });

      if (response.ok) {
        const newMsg: SentMessage = {
          name: senderName,
          email: senderEmail,
          subject: messageSubject,
          message: messageContent,
          timestamp: new Date().toISOString()
        };

        try {
          const stored = localStorage.getItem('jay_portfolio_msgs') || '[]';
          const parsed = JSON.parse(stored) as SentMessage[];
          parsed.push(newMsg);
          localStorage.setItem('jay_portfolio_msgs', JSON.stringify(parsed));
        } catch (err) {
          console.error('Local Storage database simulation full:', err);
        }

        setSuccess(true);
        
        // Flush inputs
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        const data = await response.json().catch(() => ({}));
        const formError = data?.error || data?.errors?.[0]?.message || 'Server error submitting form.';
        setErrorMsg(`Transmission error: ${formError}`);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error. Please check your internet connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#0F172A] text-white select-none relative overflow-hidden border-b border-slate-900">
      
      {/* Dynamic Grid Overlay on Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="contact-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#contact-grid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Heading */}
        <div id="contact-heading-block" className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-mono tracking-widest text-blue-400 uppercase mb-2">
            08 / Communication Matrix
          </p>
          <h2 className="section-heading text-white">
            Get In Touch
          </h2>
          <div className="h-1.5 w-16 bg-blue-500 mx-auto mt-4 rounded-full" />
        </div>

        <div id="contact-grid-layout" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch max-w-5xl mx-auto">
          
          {/* Left Column: Coordinates & vector map projection */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8 bg-slate-950 p-6 md:p-8 rounded-3xl border border-slate-800">
            
            <div className="space-y-6">
              <h3 className="text-lg font-display font-semibold text-slate-100">
                Let's discuss analytics, data modeling, or full-time opportunities.
              </h3>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Available for roles such as Data Analyst, BI Developer, SQL Engineer, and Analytics internships. Based in Mumbai, open to both hybrid, physically local, and fully remote workloads.
              </p>

              {/* Coordinates details */}
              <div id="contact-details-list" className="space-y-4 pt-4">
                <a 
                  id="contact-mail-link"
                  href={`mailto:${JAY_PROFILE.email}`}
                  className="flex items-center gap-4 p-4 bg-slate-900 border border-slate-850 hover:border-blue-500/30 rounded-2xl transition group"
                >
                  <div className="h-10 w-10 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center shrink-0 border border-blue-500/10 group-hover:scale-110 transition-transform">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="block text-[10px] font-mono uppercase text-slate-500">Corporate Email</span>
                    <span className="block text-xs sm:text-sm font-semibold text-slate-250 truncate">{JAY_PROFILE.email}</span>
                  </div>
                </a>

                <a 
                  id="contact-phone-link"
                  href={`tel:${JAY_PROFILE.phone}`}
                  className="flex items-center gap-4 p-4 bg-slate-900 border border-slate-850 hover:border-blue-500/30 rounded-2xl transition group"
                >
                  <div className="h-10 w-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center shrink-0 border border-emerald-500/10 group-hover:scale-110 transition-transform">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono uppercase text-slate-500">Mobile Connection</span>
                    <span className="block text-xs sm:text-sm font-semibold text-slate-250">{JAY_PROFILE.phone}</span>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 bg-slate-900 border border-slate-850 rounded-2xl">
                  <div className="h-10 w-10 bg-cyan-500/10 text-cyan-400 rounded-xl flex items-center justify-center shrink-0 border border-cyan-500/10">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono uppercase text-slate-500">Geographical Location</span>
                    <span className="block text-xs sm:text-sm font-semibold text-slate-250">{JAY_PROFILE.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stylized Modern Interactive SVG Map Mockup */}
            <div id="mumbai-map" className="relative h-44 w-full bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden flex items-center justify-center">
              
              {/* SVG visual outline of mumbai coastline */}
              <svg className="absolute inset-0 h-full w-full opacity-20" viewBox="0 0 200 150">
                <path d="M20 150 C 40 120, 60 110, 40 80 C 30 60, 50 40, 80 20 C 100 10, 130 50, 150 150 Z" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="3, 3" />
                <path d="M10 150 C 25 110, 45 95, 30 70 C 15 50, 40 25, 75 5 C 90 -5, 120 40, 140 150 Z" fill="none" stroke="#06B6D4" strokeWidth="1.5" />
              </svg>

              {/* Map pin with radar circle */}
              <div className="relative z-10 flex flex-col items-center">
                <span className="relative flex h-4 w-4 mb-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 items-center justify-center border border-white/60">
                    <MapPin className="h-2 w-2 text-white" />
                  </span>
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  Kandivali West, Mum
                </span>
                <span className="font-mono text-[8px] text-slate-500 mt-1">19.2056° N, 72.8422° E</span>
              </div>
            </div>

          </div>

          {/* Right Column: Contact form with inline validation */}
          <div className="lg:col-span-7 bg-slate-950 p-6 md:p-8 rounded-3xl border border-slate-800 flex flex-col justify-between">
            
            {success ? (
              <div id="contact-success-screen" className="flex-1 flex flex-col items-center justify-center text-center space-y-6 pt-8 animate-fade-in">
                <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/5 animate-pulse">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono tracking-widest uppercase mb-0.5">
                    <Sparkles className="h-3 w-3" />
                    Delivered successfully
                  </span>
                  <h4 className="text-xl font-display font-extrabold text-slate-100">
                    Message Delivered Into Local Logs!
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed font-light">
                    Your message has been validated and parsed. Jay will contact you back shortly on your listed electronic mail coordinates. Thank you!
                  </p>
                </div>

                <div className="h-px bg-slate-900 w-full pt-4" />

                <button
                  onClick={() => setSuccess(false)}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-6 py-3 rounded-xl transition cursor-pointer"
                >
                  Deliver Another Message
                </button>

                {submissionCount > 0 && (
                  <span className="block text-[9px] font-mono text-slate-500 uppercase">
                    Stored submission counter: {submissionCount} records logged in sandbox
                  </span>
                )}
              </div>
            ) : (
              <form id="contact-form" onSubmit={handleSubmit} className="space-y-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-display font-bold text-slate-200 mb-5 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-500" />
                    Electronic Mail Dispatch Portal
                  </h4>

                  {errorMsg && (
                    <div className="p-3.5 bg-red-950/20 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center gap-2 mb-4 animate-shake">
                      <ShieldAlert className="h-4 w-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Full Name</label>
                      <input
                        id="input-contact-name"
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rachel Adams"
                        className="w-full bg-slate-900 border border-slate-850 hover:border-slate-800 text-slate-200 text-xs rounded-xl p-3 outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Email Address</label>
                      <input
                        id="input-contact-email"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. rachel@enterprise.com"
                        className="w-full bg-slate-900 border border-slate-850 hover:border-slate-800 text-slate-200 text-xs rounded-xl p-3 outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Subject Heading</label>
                    <input
                      id="input-contact-subject"
                      type="text"
                      name="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Open Data Analyst Role"
                      className="w-full bg-slate-900 border border-slate-850 hover:border-slate-800 text-slate-200 text-xs rounded-xl p-3 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Detailed Message</label>
                    <textarea
                      id="input-contact-message"
                      rows={5}
                      name="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="e.g. Hi Jay, I reviewed your Banking Fraud detection dashboards..."
                      className="w-full bg-slate-900 border border-slate-850 hover:border-slate-800 text-slate-200 text-xs rounded-xl p-3 outline-none focus:border-blue-500 resize-none"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-900 mt-6">
                  <button
                    id="contact-form-submit"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white text-xs font-bold py-3.5 px-6 rounded-xl transition shadow-lg shadow-blue-900/30 active:scale-98 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Validating Fields...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Deliver Message Node
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
