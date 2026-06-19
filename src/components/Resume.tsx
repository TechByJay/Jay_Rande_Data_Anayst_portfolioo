import React, { useState } from 'react';
import { Download, Printer, ExternalLink, Mail, Phone, MapPin, Linkedin, Github, FileText, X, Globe } from 'lucide-react';
import { JAY_PROFILE, EXPERIENCE_DATA, EDUCATION_DATA, CERTIFICATES_DATA, PROJECTS_DATA } from '../data';

interface ResumeProps {
  onClose?: () => void;
  isModal?: boolean;
}

export default function Resume({ onClose, isModal = false }: ResumeProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
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
    const link = document.createElement('a');
    link.href = '/Jay_Rande.pdf';
    link.download = 'Jay_Rande.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resumeLayout = (
    <div id="physical-resume-sheet" className="bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-xl max-w-4xl mx-auto font-sans text-left print:border-none print:shadow-none print:p-0 overflow-hidden">
      
      {/* Page 1 */}
      <div id="resume-page-1" className="p-8 sm:p-10 select-all">
        {/* Resume Header */}
        <div className="text-center pb-3">
          <h1 className="text-3xl sm:text-4xl font-display font-medium text-slate-950 tracking-tight mb-2">
            Jay Rande
          </h1>
          {/* Contact Strip */}
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11.5px] sm:text-xs text-slate-800 font-mono tracking-wide">
            <span>Mumbai, India</span>
            <span className="text-slate-950 px-1">•</span>
            <a href="tel:+919321778286" className="hover:text-blue-600 transition">+91 9321778286</a>
            <span className="text-slate-950 px-1">•</span>
            <a href="mailto:jayrandecs@gmail.com" onClick={handleCopyEmail} className="hover:text-blue-600 transition underline cursor-pointer">{copiedEmail ? 'Copied!' : 'jayrandecs@gmail.com'}</a>
            <span className="text-slate-950 px-1">•</span>
            <a href="https://linkedin.com/in/jay-rande" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition underline">LinkedIn</a>
            <span className="text-slate-950 px-1">•</span>
            <a href="https://github.com/TechByJay" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition underline">GitHub</a>
            <span className="text-slate-950 px-1">•</span>
            <a href={portfolioUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition underline">Portfolio</a>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="py-2">
          <h2 className="text-xs sm:text-[13px] font-bold text-slate-950 uppercase tracking-wider border-b border-slate-950 pb-0.5 mb-2">
            SUMMARY
          </h2>
          <p className="text-[11.5px] sm:text-xs text-slate-800 leading-relaxed font-normal text-justify">
            Data Analyst with a Bachelor's degree in Computer Science and hands-on expertise in SQL, Python, and Power BI, specializing in transforming complex data sets into actionable business insights. Proficient in building interactive dashboards, automating ETL pipelines, and conducting end-to-end fraud detection and credit risk analysis across large-scale datasets exceeding 1 million records. Proven ability to identify trends and patterns in data, develop automation solutions, and deliver data-driven recommendations that support strategic decision-making for business partners.
          </p>
        </div>

        {/* SKILLS */}
        <div className="py-2">
          <h2 className="text-xs sm:text-[13px] font-bold text-slate-950 uppercase tracking-wider border-b border-slate-950 pb-0.5 mb-2">
            SKILLS
          </h2>
          <div className="space-y-1.5 text-[11px] sm:text-xs text-slate-800 leading-relaxed font-normal">
            <div>
              <strong className="font-bold text-slate-950">Programming Languages:</strong> Python, SQL, JavaScript, C, C++
            </div>
            <div>
              <strong className="font-bold text-slate-950">Data Analysis & Libraries:</strong> Pandas, NumPy, Matplotlib, Seaborn, Exploratory Data Analysis (EDA), Statistical Analysis
            </div>
            <div>
              <strong className="font-bold text-slate-950">Business Intelligence & Reporting:</strong> Power BI, DAX, Power Query, KPI Dashboards, Data Visualization, Microsoft Excel (PivotTables)
            </div>
            <div>
              <strong className="font-bold text-slate-950">Databases:</strong> PostgreSQL, MySQL
            </div>
            <div>
              <strong className="font-bold text-slate-950">Data Engineering & Tools:</strong> ETL Pipelines, Data Cleaning, Data Transformation, Data Validation, Automation Solutions, Web Scraping
            </div>
            <div>
              <strong className="font-bold text-slate-950">Domain Expertise:</strong> Fraud Detection, Credit Risk Analysis, Risk Modeling, Dashboard Development, Stakeholder Reporting
            </div>
          </div>
        </div>

        {/* PROJECTS */}
        <div className="py-2">
          <h2 className="text-xs sm:text-[13px] font-bold text-slate-950 uppercase tracking-wider border-b border-slate-950 pb-0.5 mb-3">
            PROJECTS
          </h2>
          
          <div className="space-y-3.5">
            {/* Project 1 */}
            <div>
              <div className="flex justify-between items-baseline flex-wrap gap-1.5 mb-1">
                <div className="text-[11.5px] sm:text-[12.5px] text-slate-950 font-bold leading-snug">
                  Banking Fraud Detection & Credit Risk Analysis <span className="font-normal text-slate-800">(Python, Pandas, NumPy, Power BI, DAX, EDA)</span>
                </div>
                <div className="text-[10px] sm:text-[11px] font-mono shrink-0 flex items-center gap-1.5 text-blue-600 font-medium">
                  <a href="https://github.com/TechByJay/Banking-Fraud-Detection-and-Credit-Risk-Analysis-using-python--EDA--and-Power-BI" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
                  <span className="text-slate-300">|</span>
                  <a href="https://www.linkedin.com/posts/jay-rande_banking-fraud-detection-using-python-eda-activity-7466802731022704641-ow39" target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>
                </div>
              </div>
              <ul className="list-disc list-outside ml-4 text-[11px] sm:text-xs text-slate-800 leading-relaxed font-light space-y-1">
                <li>Analyzed 500K+ banking transactions using Python EDA to identify fraud patterns and high-risk customer segments, improving fraud classification accuracy by an estimated 18%.</li>
                <li>Built interactive Power BI dashboards with DAX measures tracking fraud KPIs, credit risk exposure, and transaction anomalies, enabling real-time risk mitigation decisions for business partners.</li>
                <li>Conducted end-to-end data cleaning, preprocessing, and statistical analysis to validate data quality and ensure accurate risk modeling outputs.</li>
              </ul>
            </div>

            {/* Project 2 */}
            <div>
              <div className="flex justify-between items-baseline flex-wrap gap-1.5 mb-1">
                <div className="text-[11.5px] sm:text-[12.5px] text-slate-950 font-bold leading-snug">
                  Apple Retail Sales Analytics — 1M+ Records <span className="font-normal text-slate-800">(PostgreSQL, Advanced SQL, CTEs, Window Functions)</span>
                </div>
                <div className="text-[10px] sm:text-[11px] font-mono shrink-0 flex items-center gap-1.5 text-blue-600 font-medium">
                  <a href="https://github.com/TechByJay/apple-retail-sales-analytics-using-postgresql-with-1m-records" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
                  <span className="text-slate-300">|</span>
                  <a href="https://www.linkedin.com/posts/jay-rande_sql-postgresql-dataanalytics-activity-7464348133225820160-Lckb" target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>
                </div>
              </div>
              <ul className="list-disc list-outside ml-4 text-[11px] sm:text-xs text-slate-800 leading-relaxed font-light space-y-1">
                <li>Analyzed over 1 million retail sales records using PostgreSQL, applying CTEs, Window Functions, Subqueries, and query optimization to reduce execution time by 40%.</li>
                <li>Identified top-performing products, revenue-driving trends, and customer purchasing behavior, delivering 5 strategic insights to support inventory planning and sales optimization.</li>
                <li>Designed SQL-based analytical workflows to disseminate large-scale data insights, directly supporting data-driven decision-making for stakeholders.</li>
              </ul>
            </div>

            {/* Project 3 */}
            <div>
              <div className="flex justify-between items-baseline flex-wrap gap-1.5 mb-1">
                <div className="text-[11.5px] sm:text-[12.5px] text-slate-950 font-bold leading-snug">
                  Credit Card Fraud Detection & Risk Analytics Platform <span className="font-normal text-slate-800">(Power BI, DAX, Risk Analytics, Data Transformation)</span>
                </div>
                <div className="text-[10px] sm:text-[11px] font-mono shrink-0 flex items-center gap-1.5 text-blue-600 font-medium">
                  <a href="https://github.com/TechByJay/Credit_Card_Fraud_Detection_And_Risk_Analytics_Platform" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
                  <span className="text-slate-300">|</span>
                  <a href="https://www.linkedin.com/posts/jay-rande_powerbi-dataanalytics-businessintelligence-activity-7462843136369709057-obpW" target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>
                </div>
              </div>
              <ul className="list-disc list-outside ml-4 text-[11px] sm:text-xs text-slate-800 leading-relaxed font-light space-y-1">
                <li>Built a BI platform monitoring 200K+ credit card transactions for fraudulent activity, customer risk profiles, and anomalies — enabling rapid identification of fraud-prone segments.</li>
                <li>Developed KPI-driven dashboards featuring fraud risk segmentation, transaction monitoring, and performance metrics using DAX, improving reporting accuracy for business partners.</li>
                <li>Performed data transformation and validation routines to ensure data integrity across all analytical reporting pipelines.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Page Break Separator (Hidden on Print & Download) */}
      <div className="h-px bg-slate-200 my-1 border-dashed border-t border-slate-300 relative no-print shrink-0 select-none mx-5 sm:mx-8" title="Page Break">
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-50 px-3 text-[10px] font-mono text-slate-400 uppercase tracking-wider leading-none">
          Page 1 / Page 2 Break
        </span>
      </div>

      {/* Page 2 */}
      <div id="resume-page-2" className="p-8 sm:p-10 select-all">
        {/* Project 4 */}
        <div className="py-2">
          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between items-baseline flex-wrap gap-1.5 mb-1">
                <div className="text-[11.5px] sm:text-[12.5px] text-slate-950 font-bold leading-snug">
                  Vendor Performance & Inventory Analytics System <span className="font-normal text-slate-800">(Power BI, DAX, SQL, ETL)</span>
                </div>
                <div className="text-[10px] sm:text-[11px] font-mono shrink-0 flex items-center gap-1.5 text-blue-600 font-medium">
                  <a href="https://github.com/TechByJay/Vendor_Performance_and_Inventory_Analytics_System" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
                  <span className="text-slate-300">|</span>
                  <a href="https://www.linkedin.com/posts/jay-rande_dataanalytics-powerbi-sql-activity-7462343832634851328-d8Gn" target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>
                </div>
              </div>
              <ul className="list-disc list-outside ml-4 text-[11px] sm:text-xs text-slate-800 leading-relaxed font-light space-y-1">
                <li>Designed a BI solution evaluating vendor performance and procurement efficiency, identifying operational bottlenecks and improving inventory utilization insights by 15%.</li>
                <li>Created KPI dashboards tracking inventory turnover, vendor contribution, and supply chain performance, supporting operational planning decisions for business partners.</li>
                <li>Built ETL routines to organize, transform, and validate procurement datasets, ensuring accuracy and consistency across all analytical reports.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* EXPERIENCE */}
        <div className="py-2.5">
          <h2 className="text-xs sm:text-[13px] font-bold text-slate-950 uppercase tracking-wider border-b border-slate-950 pb-0.5 mb-2.5">
            EXPERIENCE
          </h2>
          <div>
            <div className="flex justify-between items-baseline flex-wrap gap-1.5 mb-1">
              <div>
                <h3 className="text-xs sm:text-[12.5px] font-bold text-slate-950">
                  Cinute Digital Pvt Ltd <span className="font-normal text-slate-800">— SEO Intern</span>
                </h3>
                <span className="block text-[11px] sm:text-xs text-slate-500 font-medium font-mono">
                  Mumbai, India
                </span>
              </div>
              <span className="text-xs font-mono text-slate-600 font-medium">
                Feb 2026 – Apr 2026
              </span>
            </div>
            <ul className="list-disc list-outside ml-4 text-[11px] sm:text-xs text-slate-800 leading-relaxed font-light space-y-1">
              <li>Analyzed website performance data to identify trends in search traffic, contributing to a 20% improvement in content engagement metrics across 50+ digital assets.</li>
              <li>Built reporting dashboards to track SEO KPIs and developed automation solutions for content audit workflows, reducing manual review time by 25%.</li>
            </ul>
          </div>
        </div>

        {/* EDUCATION */}
        <div className="py-2.5">
          <h2 className="text-xs sm:text-[13px] font-bold text-slate-950 uppercase tracking-wider border-b border-slate-950 pb-0.5 mb-2.5">
            EDUCATION
          </h2>
          <div>
            <div className="flex justify-between items-baseline flex-wrap gap-1.5 mb-1">
              <div>
                <h3 className="text-xs sm:text-[12.5px] font-bold text-slate-950">
                  Bachelor of Science in Computer Science
                </h3>
                <span className="block text-[11px] sm:text-xs text-slate-500 font-medium font-mono">
                  Mumbai University, Bhavans College
                </span>
              </div>
              <span className="text-xs font-mono text-slate-600 font-medium">
                2023 – 2026
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-800 leading-relaxed font-light mt-1.5">
              GPA: <strong>2.6 / 4.0</strong> (converted from 6.3/10.0 CGPA) <span className="text-slate-300 mx-1.5">|</span> <strong className="font-semibold text-slate-950">Relevant Coursework:</strong> Database Management Systems, Statistics, Data Structures & Algorithms, Programming
            </p>
          </div>
        </div>

        {/* CERTIFICATIONS */}
        <div className="py-2.5">
          <h2 className="text-xs sm:text-[13px] font-bold text-slate-950 uppercase tracking-wider border-b border-slate-950 pb-0.5 mb-2.5">
            CERTIFICATIONS
          </h2>
          <ul className="list-disc list-outside ml-4 text-[11px] sm:text-xs text-slate-800 leading-relaxed font-light space-y-1.5">
            <li>
              <strong className="font-semibold text-slate-950">Responsive Web Design</strong> — FreeCodeCamp (April 2025) <span className="no-print text-[10px] font-mono text-slate-400">(<a href="https://www.freecodecamp.org/certification/fccaaed2169-bb8c-4820-9f50-dc501137a0cc/responsive-web-design" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Verify</a>)</span>
            </li>
            <li>
              <strong className="font-semibold text-slate-950">JavaScript Algorithms and Data Structures</strong> — FreeCodeCamp (May 2025) <span className="no-print text-[10px] font-mono text-slate-400">(<a href="https://www.freecodecamp.org/certification/fccaaed2169-bb8c-4820-9f50-dc501137a0cc/javascript-algorithms-and-data-structures-v8" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Verify</a>)</span>
            </li>
            <li>
              <strong className="font-semibold text-slate-950">Mastering Data Structures & Algorithms Using C and C++</strong> — Udemy (April 2025) <span className="no-print text-[10px] font-mono text-slate-400">(<a href="https://www.linkedin.com/posts/jay-rande_datastructures-algorithms-cpp-activity-7319466745822437376-3BFN" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Verify</a>)</span>
            </li>
          </ul>
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
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 border border-blue-600 px-4 py-2 rounded-xl text-xs font-semibold text-white transition cursor-pointer"
              >
                <Download className="h-4 w-4" />
                Download PDF
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
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-5.5 py-2.5 rounded-xl text-xs font-semibold transition shadow-md shadow-blue-500/10 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              Download Resume File (PDF)
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
