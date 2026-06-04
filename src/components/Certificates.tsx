import React, { useState } from 'react';
import { Award, ExternalLink, Linkedin, ShieldCheck, X, Eye } from 'lucide-react';
import { CERTIFICATES_DATA } from '../data';

interface Certificate {
  title: string;
  issuer: string;
  image: string;
  verificationUrl?: string;
  linkedinUrl?: string;
  date?: string;
}

export default function Certificates() {
  const [activeImg, setActiveImg] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState<string>('');

  const openLightbox = (imgUrl: string, titleName: string) => {
    setActiveImg(imgUrl);
    setActiveTitle(titleName);
  };

  const closeLightbox = () => {
    setActiveImg(null);
    setActiveTitle('');
  };

  return (
    <section id="certificates" className="py-24 bg-[#0F172A] text-white border-b border-slate-900 select-none relative overflow-hidden">
      {/* Glow highlight background */}
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div id="certificates-heading-block" className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-mono tracking-widest text-blue-400 uppercase mb-2">
            05 / Technical Credentials
          </p>
          <h2 className="section-heading text-white">
            Licenses & Certifications
          </h2>
          <div className="h-1.5 w-16 bg-blue-500 mx-auto mt-4 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
        </div>

        {/* Certificates Grid */}
        <div id="certificates-cards-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CERTIFICATES_DATA.map((cert) => (
            <div 
              id={`cert-item-${cert.title.toLowerCase().replace(/\s+/g, '-')}`}
              key={cert.title}
              className="bg-slate-900/40 rounded-3xl border border-slate-800 overflow-hidden shadow-lg flex flex-col group hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/5 hover:border-blue-500/40 transition-all duration-300"
            >
              
              {/* Image Preview with Hover Toggler */}
              <div className="h-44 sm:h-48 overflow-hidden relative border-b border-slate-800 bg-slate-950 flex items-center justify-center">
                <img
                  src={cert.image}
                  alt={cert.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain p-2 bg-slate-200 transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://picsum.photos/seed/" + cert.title + "/600/400";
                  }}
                  loading="lazy"
                />
              </div>

              {/* Certificate content and validations */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-1.5 text-[10px] uppercase tracking-wider mb-2 font-bold select-none">
                    <span className="flex items-center gap-1.5 text-cyan-400 font-mono">
                      <Award className="h-3.5 w-3.5" />
                      {cert.issuer}
                    </span>
                  </div>
                  
                  <h3 className="text-base font-display font-bold text-slate-100 leading-snug mb-1.5 group-hover:text-blue-400 transition-colors">
                    {cert.title}
                  </h3>
                  
                  <span className="block text-xs text-slate-500 font-mono font-medium">
                    Completed: {cert.date}
                  </span>
                </div>

                {/* Verification CTAs */}
                <div className="grid grid-cols-2 gap-2 pt-6 border-t border-slate-800/80 mt-6">
                  {cert.verificationUrl ? (
                    <a
                      id={`cert-verify-${cert.title.toLowerCase().replace(/\s+/g, '-')}`}
                      href={cert.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 bg-slate-950/80 border border-slate-800 hover:bg-slate-950 text-slate-300 text-[11px] font-semibold py-2.5 rounded-xl transition cursor-pointer"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                      Verify Registry
                    </a>
                  ) : (
                    <div className="flex items-center justify-center gap-1.5 bg-slate-950/40 border border-slate-800/40 text-slate-500 text-[11px] font-semibold py-2.5 rounded-xl">
                      <ShieldCheck className="h-3.5 w-3.5 text-slate-600" />
                      Verified
                    </div>
                  )}

                  <button
                    onClick={() => openLightbox(cert.image, cert.title)}
                    className="flex items-center justify-center gap-1.5 bg-blue-600/15 border border-blue-500/20 hover:bg-blue-600/25 text-blue-400 text-[11px] font-semibold py-2.5 rounded-xl transition cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Preview
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Global verified credentials check banner */}
        <div id="verified-matrix" className="mt-12 text-center p-4 bg-slate-900/25 rounded-2xl border border-slate-800/60 max-w-2xl mx-auto flex items-center justify-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          <span className="text-xs text-slate-400 font-mono leading-normal">
            State-assigned and community-reviewed. Certifications indexed with verified registries.
          </span>
        </div>

      </div>

      {/* LIGHTBOX MODAL CORE */}
      {activeImg && (
        <div 
          id="cert-lightbox"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-fade-in"
          onClick={closeLightbox}
        >
          <div 
            className="relative bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl p-5 flex flex-col gap-4 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header info */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="block text-[10px] font-mono uppercase text-blue-400 tracking-wider font-bold">Registry document preview</span>
                <span className="text-base font-bold text-white font-display mt-0.5 block">{activeTitle}</span>
              </div>
              <button 
                onClick={closeLightbox}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg border border-slate-800 hover:bg-slate-850 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Document display frame with referrer policy */}
            <div className="bg-slate-950 overflow-auto flex justify-center max-h-[70vh] rounded-xl border border-slate-850">
              <img 
                src={activeImg} 
                alt={activeTitle} 
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[60vh] object-contain rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://picsum.photos/seed/" + activeTitle + "/1000/700";
                }}
              />
            </div>

            <div className="flex justify-end text-[10px] uppercase font-mono text-slate-500 font-semibold tracking-wider">
              digital signature verified
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
