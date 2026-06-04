import React, { useState, useEffect } from 'react';
import { Award, ExternalLink, Linkedin, ShieldCheck, X, Eye, Image as ImageIcon, Tag, Upload, Link, AlertCircle, RefreshCw } from 'lucide-react';
import { CERTIFICATES_DATA } from '../data';

import fccResponsiveImg from '../assets/images/fcc_responsive_web_1780512000000_1780503693686.png';
import udemyDsaImg from '../assets/images/udemy_dsa_cpp_1780512000000_1780503709084.png';
import fccJsImg from '../assets/images/fcc_js_algorithms_1780512000000_1780503723073.png';
import profileImg from '../assets/images/regenerated_image_1780485889646.jpg';
import bankingFraudImg from '../assets/images/regenerated_image_1780485891593.png';
import appleRetailImg from '../assets/images/regenerated_image_1780485894971.jpg';
import creditCardFraudImg from '../assets/images/regenerated_image_1780485896467.png';
import vendorPerfImg from '../assets/images/regenerated_image_1780485899217.jpg';
import olaRidesImg from '../assets/images/regenerated_image_1780485900862.jpg';

interface Certificate {
  title: string;
  issuer: string;
  image: string;
  verificationUrl?: string;
  linkedinUrl?: string;
  date?: string;
}

const PRESET_IMAGES = [
  {
    name: 'Responsive Web Design (Credential)',
    url: fccResponsiveImg,
  },
  {
    name: 'Mastering DSA (Udemy Credential)',
    url: udemyDsaImg,
  },
  {
    name: 'JS Algorithms (Credential)',
    url: fccJsImg,
  },
  {
    name: 'Regenerated Portrait Image',
    url: profileImg,
  },
  {
    name: 'Banking Fraud Dashboard',
    url: bankingFraudImg,
  },
  {
    name: 'Apple Retail Analytics',
    url: appleRetailImg,
  },
  {
    name: 'Credit Card Analytics',
    url: creditCardFraudImg,
  },
  {
    name: 'Vendor Inventory Dashboard',
    url: vendorPerfImg,
  },
  {
    name: 'OLA Ride Business Dashboard',
    url: olaRidesImg,
  }
];

export default function Certificates() {
  const [certs, setCerts] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem('jay_certs_images');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return CERTIFICATES_DATA.map(c => ({
          ...c,
          image: parsed[c.title] || c.image
        }));
      } catch (e) {
        // Fallback
      }
    }
    return CERTIFICATES_DATA;
  });

  const [activeImg, setActiveImg] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState<string>('');
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [inputVal, setInputVal] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const openLightbox = (imgUrl: string, titleName: string) => {
    setActiveImg(imgUrl);
    setActiveTitle(titleName);
  };

  const closeLightbox = () => {
    setActiveImg(null);
    setActiveTitle('');
  };

  const handleUpdateImage = (title: string, rawValue: string) => {
    let parsedSrc = rawValue.trim();
    
    // Support complete custom HTML/JSX image tags
    if (parsedSrc.startsWith('<') && parsedSrc.includes('src=')) {
      const match = parsedSrc.match(/src=["']([^"']+)["']/);
      if (match && match[1]) {
        parsedSrc = match[1];
      }
    }
    
    // Strip trailing tags, curly braces if they accidentally pasted jsx style like {src}
    parsedSrc = parsedSrc.replace(/^[{'"]|['"}]$/g, '').trim();

    if (!parsedSrc) {
      setErrorMessage('Please enter a valid image URL, path, or image element tag.');
      return;
    }

    const updated = certs.map(c => {
      if (c.title === title) {
        return { ...c, image: parsedSrc };
      }
      return c;
    });
    setCerts(updated);

    const savedMap: Record<string, string> = {};
    updated.forEach(c => {
      savedMap[c.title] = c.image;
    });
    localStorage.setItem('jay_certs_images', JSON.stringify(savedMap));
    
    setEditingCert(null);
    setInputVal('');
    setErrorMessage('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        if (editingCert) {
          handleUpdateImage(editingCert.title, result);
        }
      }
    };
    reader.onerror = () => {
      setErrorMessage('Could not load image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleResetDefault = (title: string) => {
    const defaultData = CERTIFICATES_DATA.find(c => c.title === title);
    if (!defaultData) return;

    const updated = certs.map(c => {
      if (c.title === title) {
        return { ...c, image: defaultData.image };
      }
      return c;
    });
    setCerts(updated);

    const savedMap: Record<string, string> = {};
    updated.forEach(c => {
      savedMap[c.title] = c.image;
    });
    localStorage.setItem('jay_certs_images', JSON.stringify(savedMap));
    
    setEditingCert(null);
    setInputVal('');
    setErrorMessage('');
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
          {certs.map((cert) => (
            <div 
              id={`cert-item-${cert.title.toLowerCase().replace(/\s+/g, '-')}`}
              key={cert.title}
              className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden flex flex-col group hover:border-blue-500/30 transition-all duration-300 shadow-xl"
            >
              
              {/* Image Preview with Hover Toggler */}
              <div className="relative h-44 overflow-hidden bg-slate-950 border-b border-slate-800 flex items-center justify-center">
                <img
                  src={cert.image}
                  alt={cert.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-85 transition-transform duration-500 group-hover:scale-102 group-hover:opacity-50"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://picsum.photos/seed/" + cert.title + "/600/400";
                  }}
                  loading="lazy"
                />
                
                {/* Custom Overlay with Dual Action Control */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all bg-slate-950/65">
                  <button
                    onClick={() => openLightbox(cert.image, cert.title)}
                    className="flex items-center gap-2 bg-slate-950/90 border border-slate-800 hover:border-blue-500 hover:bg-slate-900 px-4 py-2 rounded-xl text-xs font-semibold scale-95 hover:scale-100 transition-all shadow-xl cursor-pointer"
                  >
                    <Eye className="h-4 w-4 text-blue-400" />
                    Preview Document
                  </button>
                </div>
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
                <div className="flex gap-2.5 pt-6 border-t border-slate-800/80 mt-6">
                  {cert.verificationUrl ? (
                    <a
                      id={`cert-verify-${cert.title.toLowerCase().replace(/\s+/g, '-')}`}
                      href={cert.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-start gap-1.5 bg-slate-950/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold py-2.5 px-3 rounded-xl transition"
                    >
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      Verify Registry
                      <ExternalLink className="h-3 w-3 ml-auto text-slate-500" />
                    </a>
                  ) : (
                    <div className="flex-1 flex items-center gap-1.5 bg-slate-950/40 border border-slate-800/40 text-slate-500 text-xs py-2.5 px-3 rounded-xl">
                      <ShieldCheck className="h-4 w-4 text-slate-600" />
                      Verified on LinkedIn
                    </div>
                  )}

                  {cert.linkedinUrl && (
                    <a
                      id={`cert-social-${cert.title.toLowerCase().replace(/\s+/g, '-')}`}
                      href={cert.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-blue-600/15 border border-blue-500/20 hover:bg-blue-600/25 text-blue-400 rounded-xl transition"
                      title="LinkedIn announcement"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
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

      {/* CUSTOMIZATION DRAWER / EDIT IMAGE MODAL */}
      {editingCert && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 text-left"
          onClick={() => setEditingCert(null)}
        >
          <div 
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative flex flex-col gap-5 text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header info */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="bg-blue-600/10 p-2 rounded-xl text-blue-400">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">Configure Image Tag / URL</h3>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">Customize credential image source properties</p>
                </div>
              </div>
              <button 
                onClick={() => setEditingCert(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg border border-slate-800 hover:bg-slate-850 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Target Cert Information card */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-850 flex gap-3 items-center">
              <div className="h-12 w-16 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                <img 
                  src={inputVal || editingCert.image} 
                  alt="Preview Thumbnail" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://picsum.photos/seed/thumb/200/150";
                  }}
                />
              </div>
              <div className="truncate">
                <span className="block text-[9px] font-mono uppercase text-blue-400 font-bold">{editingCert.issuer} Certification</span>
                <span className="text-xs font-semibold text-white whitespace-pre-wrap">{editingCert.title}</span>
              </div>
            </div>

            {/* Form Input section */}
            <div className="space-y-4">
              
              {/* Paste Image Tag Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-350 flex items-center gap-1">
                  <span>Option 1: Paste Image Tag, JSX source, or URL path</span>
                  <Tag className="h-3. w-3 text-blue-400 ml-1" />
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input 
                      type="text"
                      value={inputVal}
                      onChange={(e) => {
                        setInputVal(e.target.value);
                        setErrorMessage('');
                      }}
                      placeholder='e.g., <img src="/src/assets/images/... " /> or just the URL'
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                  <button
                    onClick={() => handleUpdateImage(editingCert.title, inputVal)}
                    className="bg-blue-600 hover:bg-blue-550 text-white font-semibold text-xs px-5 rounded-xl transition cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Tip: Copy-pasting a full HTML image string like <code className="text-slate-400 bg-slate-950 px-1 py-0.5 rounded">&lt;img src="path" /&gt;</code> is automatically parsed!
                </div>
              </div>

              {/* Upload Certificate File */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-350 flex items-center gap-1">
                  <span>Option 2: Drag and drop / upload custom local file</span>
                  <Upload className="h-3 w-3 text-cyan-400 ml-1" />
                </label>
                <div className="border border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/40 rounded-xl p-5 text-center flex flex-col items-center justify-center gap-2 cursor-pointer relative group transition-all">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  />
                  <div className="p-2 bg-slate-900 border border-slate-850 rounded-xl group-hover:bg-slate-800 text-slate-400 transition">
                    <Upload className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold block text-slate-300">Choose Certificate JPEG/PNG</span>
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">File reads locally in base64 format (no cloud upload)</span>
                  </div>
                </div>
              </div>

              {/* Dynamic gallery quick select */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-350 flex items-center gap-1">
                  <span>Option 3: Quick select from generated media assets</span>
                  <Link className="h-3 w-3 text-emerald-400 ml-1" />
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-40 overflow-y-auto pr-1 pb-2 scrollbar-thin">
                  {PRESET_IMAGES.map((preset) => {
                    const isSelected = preset.url === inputVal;
                    return (
                      <button
                        key={preset.url}
                        onClick={() => {
                          setInputVal(preset.url);
                          setErrorMessage('');
                        }}
                        className={`text-left p-1.5 bg-slate-950/60 rounded-xl border transition-all hover:scale-102 flex flex-col gap-1 cursor-pointer truncate ${
                          isSelected ? 'border-blue-500 bg-blue-600/5' : 'border-slate-850 hover:border-slate-750'
                        }`}
                      >
                        <div className="h-12 w-full rounded-md overflow-hidden bg-slate-900 border border-slate-850">
                          <img 
                            src={preset.url} 
                            alt={preset.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://picsum.photos/seed/preset/100/100";
                            }}
                          />
                        </div>
                        <span className="text-[9px] font-medium text-slate-400 truncate block w-full px-0.5 mt-0.5">{preset.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Error notifications */}
            {errorMessage && (
              <div className="bg-red-900/20 border border-red-500/25 p-3 rounded-xl flex items-center gap-2 text-red-400 text-xs mt-1">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span className="font-mono">{errorMessage}</span>
              </div>
            )}

            {/* Footer controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 mt-2">
              <button
                type="button"
                onClick={() => handleResetDefault(editingCert.title)}
                className="flex items-center gap-1.5 text-[10px] font-mono tracking-wider text-slate-400 hover:text-white uppercase transition cursor-pointer"
                title="Revert modifications to code default image asset"
              >
                <RefreshCw className="h-3 w-3" /> Revert to Default
              </button>
              
              <div className="flex gap-2.5">
                <button
                  onClick={() => setEditingCert(null)}
                  className="px-4.5 py-2 border border-slate-800 hover:bg-slate-850 text-slate-300 hover:text-white text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateImage(editingCert.title, inputVal)}
                  className="bg-blue-600 hover:bg-blue-550 text-white text-xs font-bold px-6 py-2 rounded-xl shadow-lg shadow-blue-500/20 transition cursor-pointer font-sans"
                >
                  Save Image Update
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

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
