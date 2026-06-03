import React, { useState, useEffect } from 'react';
import { 
  Lock, Unlock, LayoutDashboard, Database, Key, Send, Trash2, Check,
  RefreshCw, BarChart3, Users, Clock, Globe, ArrowUpRight, ArrowDownRight, 
  Settings, Eye, Download, Sparkles, X, ChevronRight, Mail, Terminal,
  Sliders, Shield, Copy, Plus, AlertCircle, FileText
} from 'lucide-react';
import { JAY_PROFILE } from '../data';

interface AdminAreaProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateProfile?: () => void; // Trigger a reload of customized state in parent
}

interface LeadMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  isRead?: boolean;
}

export default function AdminArea({ isOpen, onClose, onUpdateProfile }: AdminAreaProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Real-time operational states
  const [activeTab, setActiveTab] = useState<'analytics' | 'inbox' | 'portfolio' | 'logs'>('analytics');
  const [submissions, setSubmissions] = useState<LeadMessage[]>([]);
  const [formspreeUrl, setFormspreeUrl] = useState('');
  
  // Custom Profile Editor states
  const [customTagline, setCustomTagline] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [disabledSections, setDisabledSections] = useState<Record<string, boolean>>({});
  
  // Simulated analytics states
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemLogs, setSystemLogs] = useState<string[]>([]);
  const [liveVisitors, setLiveVisitors] = useState(4);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isFormspreeSaveSuccess, setIsFormspreeSaveSuccess] = useState(false);
  const [isPortfolioSaveSuccess, setIsPortfolioSaveSuccess] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<LeadMessage | null>(null);

  // Live analytics state indicators from server database
  const [totalViews, setTotalViews] = useState(45);
  const [uniqueVisitors, setUniqueVisitors] = useState(12);
  const [geographicNodes, setGeographicNodes] = useState<any[]>([]);
  const [referrers, setReferrers] = useState<Record<string, number>>({});
  const [dailyStats, setDailyStats] = useState<Record<string, number>>({});

  const loadBackendStats = async () => {
    try {
      const resStats = await fetch('/api/analytics/stats');
      if (resStats.ok) {
        const data = await resStats.json();
        setTotalViews(data.totalViews || 0);
        setUniqueVisitors(data.uniqueVisitors || 0);
        setGeographicNodes(data.geographicNodes || []);
        setReferrers(data.referrers || {});
        setDailyStats(data.dailyStats || {});
        if (data.logs && data.logs.length > 0) {
          setSystemLogs(data.logs);
        }
      }
    } catch (e) {
      console.warn('Analytics collection bypass:', e);
    }

    try {
      const resLeads = await fetch('/api/leads');
      if (resLeads.ok) {
        const leads = await resLeads.json();
        setSubmissions(leads);
      }
    } catch (e) {
      console.warn('Leads collection bypass:', e);
    }
  };

  // Load configuration & messages
  useEffect(() => {
    if (!isOpen) return;

    // 1. Fetch Formspree Connection URL
    const savedUrl = localStorage.getItem('formspree_url') || 'https://formspree.io/f/mnjyqpvn';
    setFormspreeUrl(savedUrl);

    // 2. Fetch custom profile attributes
    const savedTagline = localStorage.getItem('jay_custom_tagline') || JAY_PROFILE.tagline;
    setCustomTagline(savedTagline);
    
    // Convert array JAY_PROFILE.title back to string comma-separated
    const savedTitle = localStorage.getItem('jay_custom_title') || JAY_PROFILE.title.join(', ');
    setCustomTitle(savedTitle);

    // 3. Fetch disabled sections config
    try {
      const savedSections = localStorage.getItem('jay_disabled_sections');
      if (savedSections) {
        setDisabledSections(JSON.parse(savedSections));
      } else {
        setDisabledSections({
          certificates: false,
          education: false,
          experience: false,
          skills: false
        });
      }
    } catch (e) {
      console.error(e);
    }

    // Check if user has active session
    const adminSession = sessionStorage.getItem('jay_admin_session');
    if (adminSession === 'active') {
      setIsAuthenticated(true);
    }

    // Seed default system lines before database resolves
    const seedLogs = [
      `[${new Date().toLocaleTimeString()}] INF Secure admin shell initialized.`,
      `[${new Date().toLocaleTimeString()}] INF Live pipeline syncing configured.`
    ];
    setSystemLogs(seedLogs);

  }, [isOpen]);

  // Load and poll live statistics from backend once unlocked
  useEffect(() => {
    if (!isOpen || !isAuthenticated) return;

    loadBackendStats();
    
    // Refresh statistics periodically (every 5 seconds)
    const interval = setInterval(() => {
      loadBackendStats();
      setCurrentTime(new Date());
      
      // Keep a lively UI feel with slight active connections variation
      setLiveVisitors(prev => {
        const delta = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        return Math.max(1, Math.min(6, prev + delta));
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isOpen, isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const trimmedEmail = loginEmail.trim().toLowerCase();
    const trimmedPass = loginPass.trim();

    // Allowed authorized emails
    const validEmails = ['jayrande66@gmail.com', 'jayrandecs@gmail.com', 'admin@jay.com'];

    if (!trimmedEmail || !trimmedPass) {
      setLoginError('Security Error: Please input both administration email and passcode.');
      return;
    }

    if (validEmails.includes(trimmedEmail) && trimmedPass === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('jay_admin_session', 'active');
      
      // Write system log
      setSystemLogs(prev => [
        `[${new Date().toLocaleTimeString()}] SEC Administration access granted to user ID: ${trimmedEmail}.`,
        ...prev
      ]);
    } else {
      setLoginError('Access Denied: Invalid administrator email signature or passcode combination.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('jay_admin_session');
  };

  // Submit test mock message
  const handleAddMockSubmission = async () => {
    const mockSenders = [
      { name: 'Amit Sharma', email: 'amit.sharma@tcs.com', subject: 'Integration Analyst Inquiry', msg: 'Hi Rande, interested in your SQL optimization layouts on Apple retail dataset. Can you provide insights on your indexing choices?' },
      { name: 'Deepika Patel', email: 'deepika@mumbaistartups.io', subject: 'Freelance BI Dashboard Redesign', msg: 'Hello Jay! We need a dashboard for our procurement operations utilizing DAX inside Power BI. Excellent style here.' },
      { name: 'John Doe', email: 'john.doe@recruiters.com', subject: 'B.Sc Graduate Placement Opportunity', msg: 'Dear Jay, I found your computer science portfolio via GitHub. We are looking for entry level SQL analysts in Kandivali West area.' }
    ];

    const randomSender = mockSenders[Math.floor(Math.random() * mockSenders.length)];
    
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: randomSender.name,
          email: randomSender.email,
          subject: randomSender.subject,
          message: randomSender.msg
        })
      });
      if (res.ok) {
        await loadBackendStats();
      }
    } catch (e) {
      console.warn('Simulation bypass:', e);
    }
  };

  const handleDeleteSubmission = async (index: number) => {
    try {
      const res = await fetch(`/api/leads/${index}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setSelectedSubmission(null);
        await loadBackendStats();
      }
    } catch (e) {
      console.warn('Deletions bypass:', e);
    }
  };

  const handleClearAllSubmissions = async () => {
    if (window.confirm('Are your instructions absolute? This will flush all messages inside the server database.')) {
      try {
        const res = await fetch('/api/leads-flush', {
          method: 'DELETE'
        });
        if (res.ok) {
          setSelectedSubmission(null);
          await loadBackendStats();
        }
      } catch (e) {
        console.warn('Flush bypass:', e);
      }
    }
  };

  const handleCopyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleSaveFormspree = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormspreeSaveSuccess(false);

    if (!formspreeUrl.trim().startsWith('https://formspree.io/f/')) {
      alert('Formatting validation mismatch. Link must begin with https://formspree.io/f/');
      return;
    }

    localStorage.setItem('formspree_url', formspreeUrl.trim());
    setIsFormspreeSaveSuccess(true);
    setSystemLogs(prev => [
      `[${new Date().toLocaleTimeString()}] SYS Connected formspree target reallocated to: ${formspreeUrl}.`,
      ...prev
    ]);

    setTimeout(() => {
      setIsFormspreeSaveSuccess(false);
    }, 2800);
  };

  const handleSavePortfolioConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPortfolioSaveSuccess(false);

    localStorage.setItem('jay_custom_tagline', customTagline.trim());
    localStorage.setItem('jay_custom_title', customTitle.trim());
    localStorage.setItem('jay_disabled_sections', JSON.stringify(disabledSections));

    setIsPortfolioSaveSuccess(true);
    setSystemLogs(prev => [
      `[${new Date().toLocaleTimeString()}] SYS Transferred custom layout & profiles parameters to local nodes.`,
      ...prev
    ]);

    // Dispatch global event for instant reactive reload
    window.dispatchEvent(new Event('jay-profile-updated'));

    // Fire notification to parent to refresh state
    if (onUpdateProfile) {
      onUpdateProfile();
    }

    setTimeout(() => {
      setIsPortfolioSaveSuccess(false);
    }, 2800);
  };

  const toggleSectionState = (section: string) => {
    setDisabledSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleDownloadSubmissionsJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(submissions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `jay_portfolio_submissions_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!isOpen) return null;

  return (
    <div 
      id="admin-area-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/98 backdrop-blur-xl flex flex-col justify-between select-none"
    >
      {/* 1. Header Navigation Console */}
      <header className="border-b border-slate-900 bg-slate-950/80 sticky top-0 px-6 py-4 flex items-center justify-between z-10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/10">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold font-display tracking-tight text-white flex items-center gap-2">
              JAY CORE OPERATIONS MANAGEMENT
              {isAuthenticated && (
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2 py-0.5 font-mono">
                  SECURE SHELL v1.4
                </span>
              )}
            </h1>
            <p className="text-[10px] text-slate-500 font-mono">
              Authorized admin instance for candidate profiling and leads audit
            </p>
          </div>
        </div>
        
        <button
          id="close-admin-portal-header"
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 rounded-xl transition cursor-pointer border border-slate-800"
          title="Exit Admin View shell"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      {/* 2. Authentication Shield vs Dashboard Wrapper */}
      {!isAuthenticated ? (
        <div id="admin-login-barrier" className="flex-1 flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-950/20 via-slate-950 to-slate-950">
          <div className="w-full max-w-md bg-slate-900/40 border border-slate-800/80 p-8 rounded-3xl shadow-2xl relative overflow-hidden backdrop-blur-md">
            
            {/* Ambient vector highlights */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center space-y-3 mb-8">
              <div className="inline-flex p-3 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20 mb-1">
                <Lock className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">Identity Authentication</h2>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                This area restricts general visitor guest entry. Please submit your primary analyst credential keys.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">
                  Administrative Email ID
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. jayrande66@gmail.com"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none transition font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">
                  Access Passcode Key
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    placeholder="Enter admin passcode"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none transition font-mono"
                  />
                </div>
              </div>

              {loginError && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2.5">
                  <AlertCircle className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-red-400 leading-relaxed font-sans">{loginError}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 px-4 rounded-xl text-xs transition-all shadow-lg shadow-blue-600/10 uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer border border-blue-500"
              >
                <Unlock className="h-4 w-4" />
                Unlock Command Console
              </button>
            </form>

            <div className="mt-8 pt-5 border-t border-slate-800/60 text-center">
              <div className="inline-block bg-slate-950/80 px-4 py-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 font-mono block mb-1">
                  DEV BYPASS CREDENTIAL DIRECTIVE:
                </span>
                <code className="text-xs text-blue-400 font-mono bg-blue-950/20 px-2 py-0.5 rounded">
                  jayrande66@gmail.com
                </code>
                <span className="text-[10px] text-slate-500 font-mono mx-1">and</span>
                <code className="text-xs text-blue-400 font-mono bg-blue-950/20 px-2 py-0.5 rounded">
                  admin123
                </code>
              </div>
            </div>

          </div>
        </div>
      ) : (
        <div id="admin-main-dashboard" className="flex-1 flex flex-col md:flex-row relative">
          
          {/* 2A. Left Sidebar Menu (Admin Control Panel) */}
          <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-900 bg-slate-950 p-4 shrink-0 flex md:flex-col justify-between">
            <div className="w-full space-y-6">
              <div className="hidden md:block py-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/60 rounded-xl border border-slate-800">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                    Secure Node Active
                  </span>
                </div>
              </div>

              <div className="flex overflow-x-auto md:block space-x-1 md:space-x-0 md:space-y-1.5 pb-2 md:pb-0 scrollbar-none">
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition w-full shrink-0 ${
                    activeTab === 'analytics'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <LayoutDashboard className="h-4.5 w-4.5" />
                  <span>Traffic Analytics</span>
                </button>

                <button
                  onClick={() => setActiveTab('inbox')}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition w-full shrink-0 ${
                    activeTab === 'inbox'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Database className="h-4.5 w-4.5" />
                    <span>Leads Mailbox</span>
                  </div>
                  {submissions.length > 0 && (
                    <span className="px-1.5 py-0.5 text-[9px] bg-slate-800 text-slate-300 rounded font-mono">
                      {submissions.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('portfolio')}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition w-full shrink-0 ${
                    activeTab === 'portfolio'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Sliders className="h-4.5 w-4.5" />
                  <span>Customize Portfolio</span>
                </button>

                <button
                  onClick={() => setActiveTab('logs')}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition w-full shrink-0 ${
                    activeTab === 'logs'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Terminal className="h-4.5 w-4.5" />
                  <span>System Terminals</span>
                </button>
              </div>
              
              <div className="hidden md:block h-px bg-slate-900/80 my-4" />
            </div>

            {/* Logout anchor in sidebar */}
            <div className="hidden md:block pt-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900/40 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 border border-slate-800 rounded-xl text-xs font-medium text-slate-500 transition cursor-pointer"
              >
                Sign Out Shell Session
              </button>
            </div>
          </aside>

          {/* 2B. Right Core Activity Board */}
          <main className="flex-1 bg-slate-950 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-140px)] select-text">
            
            {/* A. Live Stat Indicators */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between h-28">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[10px] font-mono uppercase tracking-wider">Total Page Views</span>
                  <BarChart3 className="h-4.5 w-4.5 text-blue-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tight text-white font-mono">{totalViews.toLocaleString()}</div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-1 font-mono">
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                    <span>Actual server-side hits</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between h-28">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[10px] font-mono uppercase tracking-wider">Unique Visitors</span>
                  <Users className="h-4.5 w-4.5 text-amber-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tight text-white font-mono">{uniqueVisitors.toLocaleString()}</div>
                  <div className="text-[10px] text-blue-400 flex items-center gap-1 mt-1 font-mono">
                    <span>Distinct browser sessions</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between h-28">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[10px] font-mono uppercase tracking-wider">Database Leads</span>
                  <Database className="h-4.5 w-4.5 text-indigo-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tight text-white font-mono">{submissions.length}</div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 font-mono">
                    <span>Stored in server backend</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between h-28">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[10px] font-mono uppercase tracking-wider">Formspree Router</span>
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white tracking-widest font-mono truncate max-w-[150px]">
                    {formspreeUrl.split('/').pop() || 'mnjyqpvn'}
                  </div>
                  <div className="text-[10px] text-blue-400 flex items-center gap-0.5 mt-2 font-mono">
                    <Check className="h-3.5 w-3.5 shrink-0" />
                    <span>Status: connected</span>
                  </div>
                </div>
              </div>
            </div>

            {/* B. TAB CONTENT PANELS */}
            
            {/* Tab 1: Traffic Analytics layout */}
            {activeTab === 'analytics' && (() => {
              const daysArray = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
              const maxViews = Math.max(...daysArray.map(d => dailyStats[d] || 0), 5);
              const points = daysArray.map((day, idx) => {
                const x = 10 + (idx * 78);
                const val = dailyStats[day] || 0;
                const y = 170 - ((val / maxViews) * 140);
                return { x, y, val, day };
              });
              
              const areaPath = points.length > 0 
                ? `M ${points[0].x},170 ` + points.map(p => `L ${p.x},${p.y}`).join(' ') + ` L ${points[points.length-1].x},170 Z`
                : '';
              
              const linePath = points.length > 0
                ? points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ')
                : '';

              const linkedinClicks = referrers["LinkedIn Post Links"] || 0;
              const githubClicks = referrers["GitHub Project Referrals"] || 0;
              const directClicks = referrers["Direct Search Traffic"] || 0;
              const qrClicks = referrers["Resume PDF QR Code"] || 0;
              const totalClicks = linkedinClicks + githubClicks + directClicks + qrClicks || 1;

              const linkedinPct = Math.round((linkedinClicks / totalClicks) * 100);
              const githubPct = Math.round((githubClicks / totalClicks) * 100);
              const directPct = Math.round((directClicks / totalClicks) * 100);
              const qrPct = Math.round((qrClicks / totalClicks) * 100);

              return (
                <div id="analytics-tab-panel" className="space-y-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Traffic Daily Plot */}
                    <div className="flex-1 bg-slate-900/30 border border-slate-900 rounded-3xl p-6.5">
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-900">
                        <div>
                          <h3 className="font-display text-sm font-extrabold text-white">Daily Traffic Indicators</h3>
                          <p className="text-[10px] text-slate-500 font-mono">Actual queries and views recorded by the server over the last 7 days</p>
                        </div>
                        <span className="text-[11px] font-mono bg-blue-950/20 border border-blue-900/40 text-blue-400 rounded-lg px-2.5 py-1">
                          Node IP Log: Active
                        </span>
                      </div>

                      {/* Dynamic Interactive SVG Line Graph */}
                      <div className="h-[200px] w-full mt-4 relative">
                        <svg viewBox="0 0 500 200" className="w-full h-full text-blue-500">
                          {/* Grid Lines */}
                          <line x1="0" y1="20" x2="500" y2="20" stroke="#111827" strokeWidth="1" strokeDasharray="3" />
                          <line x1="0" y1="80" x2="500" y2="80" stroke="#111827" strokeWidth="1" strokeDasharray="3" />
                          <line x1="0" y1="140" x2="500" y2="140" stroke="#111827" strokeWidth="1" strokeDasharray="3" />
                          
                          {/* Area Fill */}
                          {areaPath && (
                            <path 
                              d={areaPath} 
                              fill="url(#gradient-blue)" 
                              opacity="0.15" 
                            />
                          )}
                          
                          {/* Line Path */}
                          {linePath && (
                            <path 
                              d={linePath} 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2.5" 
                            />
                          )}

                          {/* Node Dots */}
                          {points.map((p, i) => (
                            <g key={i}>
                              <circle cx={p.x} cy={p.y} r="4" className="fill-blue-500 hover:r-6 cursor-pointer" />
                              <title>{`${p.day}: ${p.val} views`}</title>
                            </g>
                          ))}

                          {/* Defs for gradients */}
                          <defs>
                            <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#2563eb" />
                              <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>

                      <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 mt-3 px-1">
                        {points.map((p, i) => (
                          <span key={i}>{p.day} ({p.val})</span>
                        ))}
                      </div>
                    </div>

                    {/* Referral Interest Profile */}
                    <div className="w-full lg:w-80 bg-slate-900/30 border border-slate-900 rounded-3xl p-6.5 flex flex-col justify-between">
                      <div>
                        <h3 className="font-display text-sm font-extrabold text-white mb-1">Referral Vectors</h3>
                        <p className="text-[10px] text-slate-500 font-mono mb-5">Incoming visitor campaign attribution channels</p>

                        <div className="space-y-3.5">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px] font-mono">
                              <span className="text-slate-350">LinkedIn Post Links</span>
                              <span className="text-white font-semibold">{linkedinPct}% ({linkedinClicks})</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${linkedinPct}%` }} />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px] font-mono">
                              <span className="text-slate-350">GitHub Project Referrals</span>
                              <span className="text-white font-semibold">{githubPct}% ({githubClicks})</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 rounded-full transition-all duration-300" style={{ width: `${githubPct}%` }} />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px] font-mono">
                              <span className="text-slate-350">Direct Search Traffic</span>
                              <span className="text-white font-semibold">{directPct}% ({directClicks})</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${directPct}%` }} />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px] font-mono">
                              <span className="text-slate-350">Resume PDF QR Code</span>
                              <span className="text-white font-semibold">{qrPct}% ({qrClicks})</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-500 rounded-full transition-all duration-300" style={{ width: `${qrPct}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-900 text-[10px] text-slate-500 font-mono flex items-center justify-between mt-4">
                        <span>Attribution: active</span>
                        <span>Views: {totalClicks}</span>
                      </div>
                    </div>
                  </div>

                  {/* City & Location Nodes Table */}
                  <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6.5">
                    <div className="flex items-center justify-between mb-4.5 pb-3 border-b border-slate-900">
                      <h3 className="font-display text-sm font-extrabold text-white">Geographic Node Distribution</h3>
                      <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
                        <Globe className="h-3.5 w-3.5 text-blue-500" />
                        Live location cluster registers
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-mono text-[11px] border-collapse">
                        <thead>
                          <tr className="text-slate-500 border-b border-slate-905">
                            <th className="pb-2">CITY REGION</th>
                            <th className="pb-2">COUNTRY NODE</th>
                            <th className="pb-2">VISITS SUBMITTED</th>
                            <th className="pb-2">CONVERSION INDEX</th>
                            <th className="pb-2">DEVICES CLUSTER</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900/60 text-slate-350">
                          {geographicNodes.length > 0 ? (
                            geographicNodes.map((node: any, idx: number) => (
                              <tr key={idx}>
                                <td className="py-2.5 font-sans font-medium text-white">{node.city}</td>
                                <td className="py-2.5">{node.country}</td>
                                <td className="py-2.5 text-white">{node.visits}</td>
                                <td className={`py-2.5 ${node.conversion === 'Form Sub' ? 'text-emerald-400 font-semibold' : ''}`}>
                                  {node.conversion}
                                </td>
                                <td className="py-2.5">{node.devices}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="py-4 text-center text-slate-500">
                                No location logs collected on node instances yet.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Tab 2: Submissions Mailbox */}
            {activeTab === 'inbox' && (
              <div id="inbox-tab-panel" className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-900">
                  <div>
                    <h3 className="font-display text-sm font-extrabold text-white">Forms Submissions & leads Hub</h3>
                    <p className="text-[10px] text-slate-500 font-mono">
                      Submissions caught through contact form. Total database index size: {submissions.length} messages.
                    </p>
                  </div>

                  <div className="flex gap-2 text-xs">
                    <button
                      onClick={handleAddMockSubmission}
                      className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-blue-400 border border-slate-800 hover:border-blue-500/20 px-3.5 py-2 rounded-xl transition cursor-pointer font-medium"
                      title="Generates a mock submission for live testing"
                    >
                      <Plus className="h-4 w-4" />
                      Add Test Message Lead
                    </button>
                    
                    {submissions.length > 0 && (
                      <>
                        <button
                          onClick={handleDownloadSubmissionsJSON}
                          className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-3.5 py-2 rounded-xl transition cursor-pointer font-medium"
                        >
                          <Download className="h-4 w-4" />
                          Export JSON
                        </button>
                        
                        <button
                          onClick={handleClearAllSubmissions}
                          className="flex items-center gap-1.5 bg-slate-900/60 hover:bg-red-500/10 text-red-400 hover:border-red-500/20 border border-slate-850 px-3.5 py-2 rounded-xl transition cursor-pointer font-medium"
                        >
                          <Trash2 className="h-4 w-4" />
                          Purge Index
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {submissions.length === 0 ? (
                  <div className="text-center py-16 bg-slate-900/20 rounded-3xl border border-slate-900 border-dashed space-y-4">
                    <div className="h-12 w-12 rounded-full bg-slate-900 border border-slate-850 flex items-center justify-center text-slate-500 mx-auto">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">Mailbox database is clean</h4>
                      <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                        No contact forms currently stored. Send an automated test lead or complete the contact form to trigger inputs.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Index List pane */}
                    <div className="lg:col-span-1 space-y-3.5 max-h-[600px] overflow-y-auto pr-1">
                      {submissions.map((msg, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedSubmission(msg)}
                          className={`p-4 rounded-2xl border transition-all text-left cursor-pointer ${
                            selectedSubmission?.timestamp === msg.timestamp
                              ? 'bg-blue-600/10 border-blue-600 shadow-md shadow-blue-500/5'
                              : 'bg-slate-900/30 border-slate-900/80 hover:bg-slate-900/60 hover:border-slate-800'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1 mb-2">
                            <span className="text-xs font-bold text-white block truncate max-w-[120px]">
                              {msg.name}
                            </span>
                            <span className="text-[8.5px] font-mono text-slate-500 block shrink-0">
                              {new Date(msg.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <h4 className="text-[11px] font-semibold text-slate-300 truncate mb-1">
                            {msg.subject}
                          </h4>
                          <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                            {msg.message}
                          </p>

                          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-900/80">
                            <span className="text-[9px] font-mono text-slate-400 hover:text-blue-400 block truncate max-w-[130px]">
                              {msg.email}
                            </span>
                            <div className="flex items-center gap-1">
                              <span className="text-[8.5px] px-1.5 py-0.5 rounded bg-blue-900/20 text-blue-400 border border-blue-800/10 font-mono">
                                active
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Inspection detailed view pane */}
                    <div className="lg:col-span-2">
                      {selectedSubmission ? (
                        <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 h-full flex flex-col justify-between">
                          <div className="space-y-5">
                            {/* Meta node details */}
                            <div className="flex items-center justify-between flex-wrap gap-2.5 pb-4 border-b border-slate-900 text-slate-400">
                              <div className="space-y-1">
                                <span className="text-[9px] font-mono uppercase text-slate-500 block">Sender Name ID</span>
                                <h4 className="text-sm font-bold text-white font-sans">{selectedSubmission.name}</h4>
                              </div>
                              <div className="text-right">
                                <span className="text-[9px] font-mono uppercase text-slate-500 block">Transmission Timestamp</span>
                                <span className="text-[11px] font-mono text-slate-300 block">{new Date(selectedSubmission.timestamp).toLocaleString()}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-slate-950 p-4.5 rounded-2xl border border-slate-900/65">
                                <span className="text-[9px] font-mono uppercase text-slate-500 block mb-1">Electronic Mail Node</span>
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-xs font-mono text-white select-all break-all">{selectedSubmission.email}</span>
                                  <button
                                    onClick={() => handleCopyText(selectedSubmission.email, 999)}
                                    className="p-1.5 hover:bg-slate-900 text-slate-400 hover:text-white rounded-lg transition"
                                    title="Copy email to keyboard"
                                  >
                                    {copiedIndex === 999 ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                                  </button>
                                </div>
                              </div>

                              <div className="bg-slate-950 p-4.5 rounded-2xl border border-slate-900/65">
                                <span className="text-[9px] font-mono uppercase text-slate-500 block mb-1">Transmission Subject Node</span>
                                <span className="text-xs font-semibold text-white block truncate">{selectedSubmission.subject}</span>
                              </div>
                            </div>

                            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-900">
                              <span className="text-[9px] font-mono uppercase text-slate-500 block mb-3 pb-1 border-b border-slate-900">LEAD TEXT MESSAGE BODY</span>
                              <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line select-all">
                                {selectedSubmission.message}
                              </p>
                            </div>
                          </div>

                          <div className="mt-8 pt-4 border-t border-slate-900 flex justify-between items-center gap-3">
                            <a
                              href={`mailto:${selectedSubmission.email}?subject=RE: ${encodeURIComponent(selectedSubmission.subject)}`}
                              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4.5 py-2.5 rounded-xl text-xs transition cursor-pointer"
                            >
                              <Send className="h-4 w-4" />
                              Compose Direct Mail Re-Route
                            </a>

                            <button
                              onClick={() => {
                                const idx = submissions.findIndex(s => s.timestamp === selectedSubmission.timestamp);
                                if (idx !== -1) handleDeleteSubmission(idx);
                              }}
                              className="flex items-center gap-1.5 bg-slate-900 hover:bg-red-500/15 border border-slate-800 hover:border-red-500/20 text-slate-400 hover:text-red-400 font-semibold px-4.5 py-2.5 rounded-xl text-xs transition cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                              Remove Message Segment
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-900/20 border border-slate-900 border-dashed rounded-3xl p-12 text-center flex flex-col justify-center h-full min-h-[300px]">
                          <span className="text-slate-600 text-xs font-mono block mb-1">SYS INBOX SHELL</span>
                          <span className="text-slate-400 font-bold text-sm">Select Submissions Column Profile</span>
                          <span className="text-xs text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
                            Click on any card entry in the left panel list column to open full audit headers, verification, and replying scripts.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Customize Portfolio settings */}
            {activeTab === 'portfolio' && (
              <div id="portfolio-tab-panel" className="space-y-6">
                <div>
                  <h3 className="font-display text-sm font-extrabold text-white">Interactive Customizer & Dynamic Routing</h3>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Modifies active metadata elements, connects external APIs, and filters dashboard layouts live.
                  </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {/* Formspree endpoint management */}
                  <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6">
                    <form onSubmit={handleSaveFormspree} className="space-y-5">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-900">
                        <div className="flex items-center gap-2">
                          <Send className="h-4.5 w-4.5 text-blue-400" />
                          <h4 className="text-xs font-extrabold text-white uppercase tracking-wider font-display">
                            formspree payload target endpoint
                          </h4>
                        </div>
                        <span className="text-[9px] bg-emerald-500/20 border border-emerald-550/10 text-emerald-400 font-mono px-2 py-0.5 rounded">
                          Connected: active
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        All contact forms on the landing page have been linked and are routing active payloads through Formspree. You can re-route submission targets by pasting your custom Formspree hash below.
                      </p>

                      <div className="space-y-2">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                          FORMSPREE API LINK URL
                        </label>
                        <input
                          type="text"
                          value={formspreeUrl}
                          onChange={(e) => setFormspreeUrl(e.target.value)}
                          placeholder="https://formspree.io/f/mnjyqpvn"
                          className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none transition font-mono"
                        />
                      </div>

                      {isFormspreeSaveSuccess && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-[11px] flex items-center gap-1.5 font-sans">
                          <Check className="h-4 w-4 shrink-0" />
                          Formspree target endpoint updated! All dynamic forms are reallocated.
                        </div>
                      )}

                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl text-xs transition uppercase tracking-wider cursor-pointer border border-blue-500"
                      >
                        Update Submission Channel Target
                      </button>
                    </form>
                  </div>

                  {/* Profile bio tagline customizer */}
                  <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6">
                    <form onSubmit={handleSavePortfolioConfig} className="space-y-5">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-900">
                        <div className="flex items-center gap-2">
                          <Sliders className="h-4.5 w-4.5 text-blue-400" />
                          <h4 className="text-xs font-extrabold text-white uppercase tracking-wider font-display">
                            Dynamic Candidate Profiler Settings
                          </h4>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        Customize visual profile text elements and title sequences globally on the landing page dashboard. (Refreshes on save dynamically)
                      </p>

                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                            Home Hero Tagline Description
                          </label>
                          <textarea
                            rows={2}
                            value={customTagline}
                            onChange={(e) => setCustomTagline(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none transition"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                            Primary Professional Title Sequence (Comma separated)
                          </label>
                          <input
                            type="text"
                            value={customTitle}
                            onChange={(e) => setCustomTitle(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none transition"
                          />
                        </div>

                        {/* Toggle section displays */}
                        <div className="space-y-2.5">
                          <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                            Display / Hide Landing Modules
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => toggleSectionState('skills')}
                              className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition cursor-pointer ${
                                !disabledSections.skills 
                                  ? 'bg-slate-900/40 border-slate-800 text-slate-300' 
                                  : 'bg-red-500/5 border-red-500/10 text-slate-500'
                              }`}
                            >
                              <span>Skills and Competencies Module</span>
                              <span className={`h-2 w-2 rounded-full ${!disabledSections.skills ? 'bg-emerald-500' : 'bg-red-550'}`} />
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleSectionState('experience')}
                              className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition cursor-pointer ${
                                !disabledSections.experience 
                                  ? 'bg-slate-900/40 border-slate-800 text-slate-300' 
                                  : 'bg-red-500/5 border-red-500/10 text-slate-500'
                              }`}
                            >
                              <span>Professional Experience Internships</span>
                              <span className={`h-2 w-2 rounded-full ${!disabledSections.experience ? 'bg-emerald-500' : 'bg-red-550'}`} />
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleSectionState('certificates')}
                              className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition cursor-pointer ${
                                !disabledSections.certificates 
                                  ? 'bg-slate-900/40 border-slate-800 text-slate-300' 
                                  : 'bg-red-500/5 border-red-500/10 text-slate-500'
                              }`}
                            >
                              <span>Certification verification list</span>
                              <span className={`h-2 w-2 rounded-full ${!disabledSections.certificates ? 'bg-emerald-500' : 'bg-red-550'}`} />
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleSectionState('education')}
                              className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition cursor-pointer ${
                                !disabledSections.education 
                                  ? 'bg-slate-900/40 border-slate-800 text-slate-300' 
                                  : 'bg-red-500/5 border-red-500/10 text-slate-500'
                              }`}
                            >
                              <span>University Education Credentials</span>
                              <span className={`h-2 w-2 rounded-full ${!disabledSections.education ? 'bg-emerald-500' : 'bg-red-550'}`} />
                            </button>
                          </div>
                        </div>

                      </div>

                      {isPortfolioSaveSuccess && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-[11px] flex items-center gap-1.5 font-sans">
                          <Check className="h-4 w-4 shrink-0" />
                          Interactive layout metadata applied and synchronized successfully!
                        </div>
                      )}

                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl text-xs transition uppercase tracking-wider cursor-pointer border border-blue-500"
                      >
                        Synchronize Layout Settings
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: System Logs and Dev terminals */}
            {activeTab === 'logs' && (
              <div id="logs-tab-panel" className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-900">
                  <div>
                    <h3 className="font-display text-sm font-extrabold text-white">System logs & Dev terminal shell</h3>
                    <p className="text-[10px] text-slate-500 font-mono">
                      Provides full server loop traversal, connection routing log streams, audit queues.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSystemLogs([
                        `[${new Date().toLocaleTimeString()}] INF Flushed log history cache buffers.`,
                        `[${new Date().toLocaleTimeString()}] INF Connected to developer instance host Port 3000.`
                      ]);
                    }}
                    className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-3 py-1.5 rounded-xl text-xs transition font-semibold cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Flush Shell Buffer
                  </button>
                </div>

                <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6 font-mono text-[11px] text-emerald-400 shadow-inner max-h-[480px] overflow-y-auto space-y-1.5 scrollbar-thin select-text relative">
                  <div className="absolute top-4 right-4 text-[9px] bg-slate-900 text-slate-500 border border-slate-800 rounded px-2 py-0.5 select-none pointer-events-none">
                    STDOUT DIRECT
                  </div>
                  
                  {systemLogs.map((log, idx) => {
                    let colorClass = 'text-slate-400';
                    if (log.includes('SEC')) colorClass = 'text-amber-400 font-semibold';
                    else if (log.includes('TRN') || log.includes('DB')) colorClass = 'text-blue-400';
                    else if (log.includes('SYS')) colorClass = 'text-emerald-400';
                    
                    return (
                      <p key={idx} className={`${colorClass} leading-relaxed`}>
                        {log}
                      </p>
                    );
                  })}
                  <p className="text-blue-500/80 animate-pulse mt-3 text-xs">
                    $ jay_analyst_shell_listening_node_port_3000... _
                  </p>
                </div>

                {/* Simulated Server Info Indicators */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-4.5 space-y-2">
                    <span className="text-[9px] text-slate-500 uppercase block">NODE SYSTEM ENVIRONMENT</span>
                    <div className="space-y-1.5 text-xs text-white">
                      <div className="flex justify-between"><span className="text-slate-450">HOST CONTAINER</span><span className="font-mono">cloud-run-ingress</span></div>
                      <div className="flex justify-between"><span className="text-slate-450">SERVER NODE ENGINE</span><span className="font-mono">Node.js v22.14.0</span></div>
                      <div className="flex justify-between"><span className="text-slate-450">RUN STATE TARGET</span><span className="font-mono text-blue-400 font-semibold">PRODUCTION-SPA</span></div>
                    </div>
                  </div>

                  <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-4.5 space-y-2">
                    <span className="text-[9px] text-slate-500 uppercase block">INDEX DATABASE VOLUMES</span>
                    <div className="space-y-1.5 text-xs text-white">
                      <div className="flex justify-between"><span className="text-slate-450">CLIENT PERSIST INDEX</span><span className="font-mono">jay_portfolio_msgs</span></div>
                      <div className="flex justify-between"><span className="text-slate-450">MESSAGES BUFFERED</span><span className="font-mono">{submissions.length} leads loaded</span></div>
                      <div className="flex justify-between"><span className="text-slate-450">FORM STORAGE RATIO</span><span className="font-mono text-emerald-400">100% stable</span></div>
                    </div>
                  </div>

                  <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-4.5 space-y-2 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase block mb-1">RESET COMMAND DIRECT</span>
                      <p className="text-[10px] text-slate-450 leading-relaxed font-sans">
                        Wipe session keys and reset components metadata back to clean build values.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (window.confirm('Wipe out all settings parameters stored?')) {
                          localStorage.clear();
                          sessionStorage.clear();
                          setIsAuthenticated(false);
                          if (onUpdateProfile) onUpdateProfile();
                          onClose();
                          window.location.reload();
                        }
                      }}
                      className="bg-slate-900 hover:bg-red-500/10 text-red-400 hover:border-red-500/20 border border-slate-800 rounded-xl py-2 text-xs font-semibold uppercase mt-2 select-none cursor-pointer"
                    >
                      Purge Local Config and Force Restart
                    </button>
                  </div>
                </div>

              </div>
            )}

          </main>

        </div>
      )}

      {/* 3. Global System Console Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-3 text-center font-mono text-[9px] text-slate-650 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[9px]">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>PORT 3000 REVERSE PROXY NODE ACTIVE ENVELOPE</span>
        </div>
        <div>
          <span>SYSTEM TIME (UTC): {currentTime.toISOString().replace('T', ' ').slice(0, 19)}</span>
        </div>
        <div>
          <span>OPERATOR LOGIN ID: jayrande66@gmail.com</span>
        </div>
      </footer>
    </div>
  );
}
