import React, { useState } from 'react';
import { Download, Printer, ExternalLink, Mail, Phone, MapPin, Linkedin, Github, FileText, X, Loader2, Globe } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { JAY_PROFILE, EXPERIENCE_DATA, EDUCATION_DATA, CERTIFICATES_DATA, PROJECTS_DATA } from '../data';

interface ResumeProps {
  onClose?: () => void;
  isModal?: boolean;
}

export default function Resume({ onClose, isModal = false }: ResumeProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const portfolioUrl = typeof window !== 'undefined' ? (window.location.origin || 'https://techbyjay.github.io') : 'https://techbyjay.github.io';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(JAY_PROFILE.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const transformOklchStringToRgb = (str: string): string => {
    if (!str || typeof str !== 'string') return str;
    if (!str.includes('oklch')) return str;

    // Replace oklch(...) matches inside the string with standard rgb(...) or rgba(...) format
    return str.replace(/oklch\(([^)]+)\)/g, (match, content) => {
      try {
        // Handle slashes, commas and normalize spacing
        const normalized = content.replace(/,/g, ' ').replace(/\//g, ' ').trim();
        const parts = normalized.split(/\s+/);
        if (parts.length < 3) return match;

        // Parse L (Lightness, normally 0-1 or 0-100%)
        let l = parseFloat(parts[0]);
        if (parts[0].endsWith('%')) {
          l = parseFloat(parts[0]) / 100;
        }

        // Parse C (Chroma, normally 0-0.4)
        let c = parseFloat(parts[1]);
        if (parts[1].endsWith('%')) {
          c = parseFloat(parts[1]) / 100;
        }

        // Parse H (Hue angle, 0-360)
        const hStr = parts[2];
        let h = parseFloat(hStr);
        if (hStr.endsWith('deg')) {
          h = parseFloat(hStr);
        } else if (hStr.endsWith('rad')) {
          h = (parseFloat(hStr) * 180) / Math.PI;
        } else if (hStr.endsWith('turn')) {
          h = parseFloat(hStr) * 360;
        }

        // Parse Alpha if present
        let a: number | undefined = undefined;
        if (parts.length >= 4) {
          const aStr = parts[3];
          if (aStr.endsWith('%')) {
            a = parseFloat(aStr) / 100;
          } else {
            a = parseFloat(aStr);
          }
        }

        if (isNaN(l) || isNaN(c) || isNaN(h)) {
          return match;
        }

        // Apply standard OKLCH to sRGB math: OKLCH -> OKLAB -> LMS -> Linear sRGB -> sRGB
        const hRad = (h * Math.PI) / 180;
        const a_val = c * Math.cos(hRad);
        const b_val = c * Math.sin(hRad);

        const l_ = l + 0.3963377774 * a_val + 0.2158037573 * b_val;
        const m_ = l - 0.1055613458 * a_val - 0.0638541728 * b_val;
        const s_ = l - 0.0894841775 * a_val - 1.291485548 * b_val;

        const l3 = l_ * l_ * l_;
        const m3 = m_ * m_ * m_;
        const s3 = s_ * s_ * s_;

        const r_lin = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
        const g_lin = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
        const b_lin = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

        const toSRGB = (x: number) => {
          return x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
        };

        const r = Math.round(Math.max(0, Math.min(1, toSRGB(r_lin))) * 255);
        const g = Math.round(Math.max(0, Math.min(1, toSRGB(g_lin))) * 255);
        const b = Math.round(Math.max(0, Math.min(1, toSRGB(b_lin))) * 255);

        if (a !== undefined && !isNaN(a)) {
          return `rgba(${r}, ${g}, ${b}, ${a})`;
        }
        return `rgb(${r}, ${g}, ${b})`;
      } catch (_) {
        return match;
      }
    });
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('physical-resume-sheet');
    if (!element) return;

    setIsGeneratingPdf(true);

    const pdfLinks: Array<{ href: string; x: number; y: number; w: number; h: number }> = [];

    // Patch global computedStyle & getPropertyValue to intercept and convert 'oklch' styles on-the-fly
    const originalGetComputedStyle = window.getComputedStyle;
    const originalGetPropertyValue = CSSStyleDeclaration.prototype.getPropertyValue;

    try {
      window.getComputedStyle = function (elt, pseudoElt) {
        const style = originalGetComputedStyle.call(this, elt, pseudoElt);
        return new Proxy(style, {
          get(target, prop) {
            const val = Reflect.get(target, prop);
            if (typeof val === 'string' && val.includes('oklch')) {
              return transformOklchStringToRgb(val);
            }
            if (typeof val === 'function') {
              return val.bind(target);
            }
            return val;
          }
        });
      };

      CSSStyleDeclaration.prototype.getPropertyValue = function (property) {
        const val = originalGetPropertyValue.call(this, property);
        if (typeof val === 'string' && val.includes('oklch')) {
          return transformOklchStringToRgb(val);
        }
        return val;
      };

      // Create high-resolution canvas render with inline RGB/Hex color fallbacks
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1200,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('physical-resume-sheet');
          
          if (clonedElement) {
            // Apply layout styles
            clonedElement.style.width = '800px';
            clonedElement.style.maxWidth = '800px';
            clonedElement.style.minWidth = '800px';
            clonedElement.style.padding = '0px';
            clonedElement.style.boxSizing = 'border-box';

            // High precision styles injected directly inside cloned document
            const style = clonedDoc.createElement('style');
            style.innerHTML = `
              #physical-resume-sheet {
                padding: 0 !important;
                font-size: 12.5px !important;
                line-height: 1.45 !important;
                height: 2262.857px !important;
                min-height: 2262.857px !important;
                max-height: 2262.857px !important;
                box-sizing: border-box !important;
                background-color: #ffffff !important;
              }

              #resume-page-1, #resume-page-2 {
                box-sizing: border-box !important;
                width: 800px !important;
                height: 1131.4285px !important;
                min-height: 1131.4285px !important;
                max-height: 1131.4285px !important;
                overflow: hidden !important;
                background-color: #ffffff !important;
              }

              #resume-page-1 {
                padding: 32px 40px 16px 40px !important;
              }

              #resume-page-2 {
                padding: 32px 40px 16px 40px !important;
              }
              
              /* Headers styling on Download */
              #physical-resume-sheet h1 {
                font-size: 27px !important;
                margin-bottom: 2px !important;
                letter-spacing: -0.01em !important;
                line-height: 1.15 !important;
              }
              
              #physical-resume-sheet p.text-blue-600 {
                font-size: 11.5px !important;
                font-weight: 700 !important;
                margin-top: 2px !important;
                letter-spacing: 0.04em !important;
              }
              
              #physical-resume-sheet .font-mono {
                font-size: 10px !important;
              }
              
              /* Contact details row - strictly preserves user single line layout */
              #physical-resume-sheet .flex.flex-wrap.items-center.justify-center.font-mono {
                display: flex !important;
                flex-direction: row !important;
                flex-wrap: nowrap !important;
                justify-content: center !important;
                align-items: center !important;
                gap: 8px !important;
                margin-top: 8px !important;
                margin-bottom: 4px !important;
                white-space: nowrap !important;
                width: 100% !important;
                font-size: 10px !important;
              }
              
              #physical-resume-sheet .flex.flex-wrap.items-center.justify-center.font-mono > * {
                font-size: 10px !important;
                white-space: nowrap !important;
                display: flex !important;
                align-items: center !important;
                gap: 2px !important;
              }
              
              #physical-resume-sheet .flex.flex-wrap.items-center.justify-center.font-mono > span {
                display: inline-block !important;
                color: #cbd5e1 !important;
                font-size: 10px !important;
                margin: 0 !important;
              }
              
              /* Increased section headings for elite legibility */
              #physical-resume-sheet h2 {
                font-size: 14.5px !important;
                font-weight: 850 !important;
                letter-spacing: 0.05em !important;
                margin-bottom: 8px !important;
              }
              
              /* Spacing for sections */
              #physical-resume-sheet .py-2\\.5 {
                padding-top: 10px !important;
                padding-bottom: 10px !important;
              }
              
              /* Summary description */
              #physical-resume-sheet p.text-slate-700 {
                font-size: 12.5px !important;
                line-height: 1.5 !important;
              }
              
              /* Skills matrix columns styling */
              #physical-resume-sheet .grid-cols-1.sm\\:grid-cols-3 {
                gap: 12px !important;
              }
              
              #physical-resume-sheet .grid-cols-1.sm\\:grid-cols-3 span.block.font-bold {
                font-size: 12.5px !important;
                margin-bottom: 2px !important;
              }
              
              #physical-resume-sheet .grid-cols-1.sm\\:grid-cols-3 span:not(.font-bold) {
                font-size: 12px !important;
                line-height: 1.45 !important;
              }
              
              /* Key Projects visual layout with larger texts */
              #physical-resume-sheet .space-y-2\\.5 {
                display: flex !important;
                flex-direction: column !important;
                gap: 8px !important;
              }
              
              #physical-resume-sheet .space-y-2\\.5 > * {
                margin: 0 !important;
              }
              
              #physical-resume-sheet h3 {
                font-size: 13px !important;
                font-weight: 750 !important;
              }
              
              #physical-resume-sheet p.text-slate-600 {
                font-size: 12px !important;
                line-height: 1.45 !important;
                margin-top: 3px !important;
              }
              
              /* Field Experience page 2 styling */
              #physical-resume-sheet ul.list-disc {
                margin-top: 6px !important;
                padding-left: 12px !important;
              }
              
              #physical-resume-sheet ul.list-disc li {
                font-size: 12.5px !important;
                line-height: 1.5 !important;
                margin-bottom: 5px !important;
              }
              
              /* Credentials, Certs, and Education */
              #physical-resume-sheet .text-slate-755,
              #physical-resume-sheet .text-slate-750, 
              #physical-resume-sheet .text-xs {
                font-size: 12px !important;
              }
              
              #physical-resume-sheet .space-y-1 > * + * {
                margin-top: 4px !important;
              }
              
              #physical-resume-sheet .mt-1 {
                margin-top: 4px !important;
              }
              
              #physical-resume-sheet span.block.text-xs.font-medium.text-slate-500 {
                font-size: 11.5px !important;
                margin-top: 1px !important;
              }
              
              #physical-resume-sheet span.block.text-xs.font-semibold.text-slate-500 {
                font-size: 11.5px !important;
                margin-top: 1px !important;
              }
              
              /* Personal Interests text sizes */
              #physical-resume-sheet .text-slate-600 {
                font-size: 12px !important;
              }
              
              #physical-resume-sheet .p-5, 
              #physical-resume-sheet .p-6, 
              #physical-resume-sheet .p-8 {
                padding: 0px !important;
              }

              /* Hide developer helpers on real output */
              .no-print, [title="Page Break"] {
                display: none !important;
                height: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
              }
            `;
            clonedDoc.head.appendChild(style);

            const pxPageHeight = 1131.4285;

            // Automatically extract clickable PDF link coordinates relative to the clean document clone
            const anchors = clonedElement.querySelectorAll('a');
            anchors.forEach((a) => {
              const href = a.getAttribute('href');
              if (href && (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:'))) {
                const rect = a.getBoundingClientRect();
                const containerRect = clonedElement.getBoundingClientRect();
                pdfLinks.push({
                  href,
                  x: rect.left - containerRect.left,
                  y: rect.top - containerRect.top,
                  w: rect.width,
                  h: rect.height
                });
              }
            });

            const clonedWindow = clonedDoc.defaultView;
            if (clonedWindow) {
              // Apply the window computedStyle intercept within the cloned iframe context too
              clonedWindow.getComputedStyle = function (elt, pseudoElt) {
                const style = originalGetComputedStyle.call(this, elt, pseudoElt);
                return new Proxy(style, {
                  get(target, prop) {
                    const val = Reflect.get(target, prop);
                    if (typeof val === 'string' && val.includes('oklch')) {
                      return transformOklchStringToRgb(val);
                    }
                    if (typeof val === 'function') {
                      return val.bind(target);
                    }
                    return val;
                  }
                });
              };
            }

            // Traverse all elements in the cloned DOM to clean oklch properties and shadows
            const allNodes = [clonedElement, ...Array.from(clonedElement.querySelectorAll('*'))];
            allNodes.forEach((node) => {
              if (!(node instanceof HTMLElement)) return;
              
              // Remove and normalize shadows that feature oklch elements in Tailwind CSS styles
              node.style.boxShadow = 'none';
              node.style.textShadow = 'none';
              
              // Direct computed style scanning to write safe inline RGB fallbacks over any oklch properties
              try {
                const computed = window.getComputedStyle(node);
                const colorProperties = [
                  'color',
                  'backgroundColor',
                  'borderColor',
                  'borderTopColor',
                  'borderBottomColor',
                  'borderLeftColor',
                  'borderRightColor',
                  'outlineColor',
                  'fill',
                  'stroke'
                ] as const;

                colorProperties.forEach((prop) => {
                  const val = computed[prop];
                  if (typeof val === 'string' && val.includes('oklch')) {
                    const normalized = transformOklchStringToRgb(val);
                    node.style[prop] = normalized;
                  }
                });
              } catch (_) {}

              // Normalize general semantic color attributes manually using standard hex colors
              const classes = Array.from(node.classList);
              classes.forEach((className) => {
                // Background colors
                if (className === 'bg-white') node.style.backgroundColor = '#ffffff';
                if (className === 'bg-slate-50') node.style.backgroundColor = '#f8fafc';
                if (className === 'bg-slate-100') node.style.backgroundColor = '#f1f5f9';
                if (className === 'bg-blue-50') node.style.backgroundColor = '#eff6ff';
                if (className === 'bg-blue-600') node.style.backgroundColor = '#2563eb';
                
                // Text colors
                if (className === 'text-slate-900') node.style.color = '#0f172a';
                if (className === 'text-slate-800') node.style.color = '#1e293b';
                if (className === 'text-slate-700') node.style.color = '#334155';
                if (className === 'text-slate-600') node.style.color = '#475569';
                if (className === 'text-slate-500') node.style.color = '#64748b';
                if (className === 'text-slate-400') node.style.color = '#94a3b8';
                if (className === 'text-slate-300') node.style.color = '#cbd5e1';
                if (className === 'text-blue-600') node.style.color = '#2563eb';
                if (className === 'text-blue-500') node.style.color = '#3b82f6';
                
                // Border colors
                if (className === 'border-slate-200') node.style.borderColor = '#e2e8f0';
                if (className === 'border-slate-300') node.style.borderColor = '#cbd5e1';
                if (className === 'border-slate-900') node.style.borderColor = '#0f172a';
              });
              
              // Enforce standard borders on the main container
              if (node.id === 'physical-resume-sheet') {
                node.style.borderColor = '#cbd5e1';
                node.style.borderWidth = '1px';
                node.style.borderStyle = 'solid';
                node.style.borderRadius = '8px';
              }
            });
          }
        }
      });

      const imgWidth = 210; // A4 page width in mm
      const pageHeight = 297; // A4 page height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pxPageHeight = 1131.4285;
      const mmScale = 210 / 800; // 800px width is mapped to 210mm A4 width

      // Page 1: Centered/Starting at position 0
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, imgWidth, imgHeight);

      // Add clickable active link zone annotations for Page 1
      pdfLinks.forEach((link) => {
        if (link.y < pxPageHeight && link.w > 0 && link.h > 0) {
          pdf.link(
            link.x * mmScale,
            link.y * mmScale,
            link.w * mmScale,
            link.h * mmScale,
            { url: link.href }
          );
        }
      });

      // Page 2: Shifted upwards by exactly the height of one A4 page to render the balanced Page 2 contents
      pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, -pageHeight, imgWidth, imgHeight);

      // Add clickable active link zone annotations for Page 2
      pdfLinks.forEach((link) => {
        if (link.y >= pxPageHeight && link.w > 0 && link.h > 0) {
          pdf.link(
            link.x * mmScale,
            (link.y - pxPageHeight) * mmScale,
            link.w * mmScale,
            link.h * mmScale,
            { url: link.href }
          );
        }
      });

      pdf.save('Jay_Rande_Resume.pdf');
    } catch (error) {
      console.error('Error generating high-fidelity PDF:', error);
      // Fallback to standard window print dialog
      window.print();
    } finally {
      // Restore original handlers
      window.getComputedStyle = originalGetComputedStyle;
      CSSStyleDeclaration.prototype.getPropertyValue = originalGetPropertyValue;
      setIsGeneratingPdf(false);
    }
  };

  const resumeLayout = (
    <div id="physical-resume-sheet" className="bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-xl max-w-4xl mx-auto font-sans text-left print:border-none print:shadow-none print:p-0 overflow-hidden">
      
      {/* Page 1 */}
      <div id="resume-page-1" className="p-5 sm:p-8">
        {/* Resume Header */}
        <div className="text-center pb-3 border-b-2 border-slate-900">
          <h1 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight uppercase">
            {JAY_PROFILE.name}
          </h1>
          <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase mt-0.5">
            Data Analyst · Business Intelligence Enthusiast · SQL Developer
          </p>
          {/* Contact Strip */}
          <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 mt-2 text-[11px] sm:text-xs text-slate-600 font-mono select-none">
            <div className="flex items-center gap-0.5">
              <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
              <span>Kandivali (West), Mumbai</span>
            </div>
            <span className="text-slate-300">|</span>
            <a 
              href={`mailto:${JAY_PROFILE.email}`}
              onClick={handleCopyEmail}
              className="flex items-center gap-0.5 hover:text-blue-600 transition outline-none cursor-pointer"
              title="Click to copy, double click/long press to mail"
            >
              <Mail className="h-3 w-3 text-slate-500 shrink-0" />
              <span>{copiedEmail ? 'Copied!' : JAY_PROFILE.email}</span>
            </a>
            <span className="text-slate-300">|</span>
            <a 
              href={`tel:${JAY_PROFILE.phone}`}
              className="flex items-center gap-0.5 hover:text-blue-600 transition outline-none cursor-pointer"
              title="Call mobile phone"
            >
              <Phone className="h-3 w-3 text-slate-500 shrink-0" />
              <span>{JAY_PROFILE.phone}</span>
            </a>
            <span className="text-slate-300">|</span>
            <a 
              href={portfolioUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-0.5 hover:text-blue-600 transition outline-none"
              title="View my dynamic portfolio website"
            >
              <Globe className="h-3.5 w-3.5 text-blue-500 shrink-0" />
              <span>Portfolio</span>
            </a>
            <span className="text-slate-300">|</span>
            <a 
              href={JAY_PROFILE.linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-0.5 hover:text-blue-600 transition outline-none"
            >
              <Linkedin className="h-3 w-3 text-slate-400 shrink-0" />
              <span>LinkedIn</span>
            </a>
            <span className="text-slate-300">|</span>
            <a 
              href={JAY_PROFILE.github} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-0.5 hover:text-blue-600 transition outline-none"
            >
              <Github className="h-3 w-3 text-slate-400 shrink-0" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        {/* Professional Summary */}
        <div className="py-2.5 border-b border-slate-200">
          <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-1">
            Professional Profile Summary
          </h2>
          <p className="text-xs text-slate-700 leading-normal font-light">
            Detail-oriented Data Analyst with expertise in SQL, Python, Power BI, Excel, and Statistical Analysis. Skilled in data cleaning, EDA, fraud detection, credit risk analysis, and business intelligence reporting. Developed multiple analytics projects using PostgreSQL, Pandas, NumPy, DAX, and Power BI, including large-scale datasets exceeding 1 million records. Strong analytical and problem-solving abilities with a passion for deriving actionable insights and supporting data-driven decision-making.
          </p>
        </div>

        {/* Skills Matrix */}
        <div className="py-2.5 border-b border-slate-200">
          <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-1.5">
            Technical Expertise Matrix
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-1.5 gap-x-6 text-xs text-slate-700 font-light">
            <div>
              <span className="block font-bold text-slate-900 mb-0.5">Query & Computing:</span>
              <span>SQL (MySQL, PostgreSQL, PL/SQL), Python (Pandas, NumPy, Matplotlib, Seaborn)</span>
            </div>
            <div>
              <span className="block font-bold text-slate-900 mb-0.5">Analytics Reporting:</span>
              <span>Power BI (DAX, Power Query ETL, KPI dashboards), Microsoft Excel (PivotTables, charts)</span>
            </div>
            <div>
              <span className="block font-bold text-slate-900 mb-0.5">Key Practices:</span>
              <span>Exploratory Data Analysis (EDA), Fraud & Risk Modeling, ETL Routines, Web Scraping</span>
            </div>
          </div>
        </div>

        {/* Featured Projects */}
        <div id="resume-projects" className="py-2.5">
          <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
            Key Projects & Technical Case Studies
          </h2>
          <div className="space-y-2.5">
            {PROJECTS_DATA.slice(0, 4).map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs font-bold text-slate-900">
                    {proj.title}
                  </h3>
                  <span className="text-[9px] uppercase font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded print:bg-none print:px-0">
                    {proj.technologies.slice(0, 3).join(' · ')}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 leading-tight font-light whitespace-pre-line space-y-0.5">
                  {proj.description}
                </p>
                <div className="flex gap-4 mt-0.5 text-[9px] font-mono text-slate-500 no-print">
                  <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 flex items-center gap-1">
                    <ExternalLink className="h-2.5 w-2.5" /> View Codebase Code
                  </a>
                  <a href={proj.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 flex items-center gap-1">
                    <ExternalLink className="h-2.5 w-2.5" /> Read Summary Case Study
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Visual Page Break Separator (Hidden on Print & Download) */}
      <div className="h-px bg-slate-200 my-2 border-dashed border-t border-slate-300 relative no-print shrink-0 select-none mx-5 sm:mx-8" title="Page Break">
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-50 px-3 text-[10px] font-mono text-slate-400 uppercase tracking-wider leading-none">
          Page 1 / Page 2 Break
        </span>
      </div>

      {/* Page 2 */}
      <div id="resume-page-2" className="p-5 sm:p-8">
        {/* Professional Internship */}
        <div id="resume-field-experience" className="pb-2.5 border-b border-slate-200">
          <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-1.5">
            Field Experience
          </h2>
          <div>
            {EXPERIENCE_DATA.map((exp) => (
              <div key={exp.company}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      SEO & Search Analytics Intern
                    </h3>
                    <span className="block text-xs font-medium text-slate-500">
                      {exp.company}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-600 font-medium">
                    Feb 2026 – Apr 2026
                  </span>
                </div>
                <ul className="list-disc list-inside mt-1.5 space-y-1 text-xs text-slate-600 leading-normal font-light pl-1">
                  {exp.description.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Certifications */}
        <div className="py-2.5 border-b border-slate-200">
          <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-1.5">
            Academic Credentials & Certifications
          </h2>
          <div className="space-y-1 text-xs text-slate-750">
            {CERTIFICATES_DATA.map((c) => (
              <div key={c.title} className="flex justify-between items-baseline">
                <span className="font-medium text-slate-800">
                  <strong>{c.title}</strong> — Verified by {c.issuer}
                </span>
                <span className="font-mono text-slate-500 text-[10px] shrink-0 ml-4">{c.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="py-2.5 border-b border-slate-200">
          <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-1.5">
            Education
          </h2>
          <div className="flex justify-between items-baseline text-xs">
            <div>
              <h3 className="text-xs font-bold text-slate-900">
                Bachelor of Science in Computer Science (B.Sc. CS)
              </h3>
              <span className="block text-xs font-semibold text-slate-500">
                Bhavans College, Mumbai University
              </span>
            </div>
            <span className="font-mono text-slate-600 font-medium">
              2023 – 2026
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-600 font-light">
            CGPA Completed: <strong>7.0 / 10.0 scale</strong> (First Class honors coursework in DBMS, statistics, and programming algorithms)
          </div>
        </div>

        {/* Hobbies & Interests Section */}
        <div className="py-2.5">
          <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-1.5">
            Personal Interests & Hobbies
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-1.5 gap-x-6 text-xs text-slate-600">
            <div>
              <span className="block font-bold text-slate-900 mb-0.5">Swimming:</span>
              <span className="font-light">Excellent for cardiorespiratory fitness, muscle endurance, and deep stress relief.</span>
            </div>
            <div>
              <span className="block font-bold text-slate-900 mb-0.5">Running:</span>
              <span className="font-light">Promotes long-term physical stamina, mental clarity, and persistent daily discipline.</span>
            </div>
            <div>
              <span className="block font-bold text-slate-900 mb-0.5">Cricket:</span>
              <span className="font-light">Develops strategic logic, precision focus, and strong collaborative team coordination.</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );

  // If we are showing this as a layout component inside a modal, wrap, otherwise show section
  if (isModal) {
    return (
      <div 
        id="resume-modal-portal"
        className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md p-4 sm:p-6 lg:p-8 flex justify-center items-start selection:none"
      >
        <div className="w-full max-w-4xl space-y-4">
          
          {/* Controls Bar */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-white no-print">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <div>
                <h4 className="text-sm font-bold">Jay Rande - Professional CV Curriculum</h4>
                <span className="text-[10px] font-mono text-slate-400 uppercase">Print-Ready CSS Grid optimized</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPdf}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-750 disabled:cursor-not-allowed border border-blue-600 px-4 py-2 rounded-xl text-xs font-semibold text-white transition cursor-pointer"
              >
                {isGeneratingPdf ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}
              </button>

              <button
                onClick={onClose}
                className="flex items-center justify-center p-2 text-slate-400 hover:text-white border border-slate-700 rounded-xl hover:bg-slate-800 transition ml-2 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Core sheet rendering */}
          {resumeLayout}
        </div>
      </div>
    );
  }

  return (
    <section id="resume" className="py-24 bg-[#0F172A] border-b border-slate-900 select-none relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div id="resume-heading-block" className="text-center max-w-3xl mx-auto mb-16 no-print">
          <p className="text-xs font-mono tracking-widest text-blue-400 uppercase mb-2">
            07 / Executive Credential File
          </p>
          <h2 className="section-heading text-white">
            Curriculum Vitae Resume
          </h2>
          <div className="h-1.5 w-16 bg-blue-500 mx-auto mt-4 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
          <p className="text-slate-400 font-light text-xs sm:text-sm mt-4">
            Interactive physical layout mirror. Trigger print to save as a standard PDF document locally.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <button
              id="primary-download-pdf-btn"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-700 disabled:cursor-not-allowed text-white px-5.5 py-2.5 rounded-xl text-xs font-semibold transition shadow-md shadow-blue-500/10 cursor-pointer animate-pulse hover:animate-none"
            >
              {isGeneratingPdf ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {isGeneratingPdf ? 'Generating Resume File (PDF)...' : 'Download Resume File (PDF)'}
            </button>
          </div>
        </div>

        {/* Sheet frame */}
        <div>
          {resumeLayout}
        </div>

      </div>
    </section>
  );
}
