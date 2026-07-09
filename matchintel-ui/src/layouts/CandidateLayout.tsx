import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import PageTransition from '../components/ui/PageTransition';

export default function CandidateLayout() {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const { currentUser, candidateProfile } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isTestRoute = currentPath.includes('/candidate/test/');

  // Enforce mandatory resume upload
  useEffect(() => {
    if (currentUser.role === 'Candidate' && candidateProfile && !candidateProfile.resumeParsed) {
      if (currentPath !== '/candidate/resume-upload' && currentPath !== '/login') {
        navigate('/candidate/resume-upload', { replace: true });
      }
    }
  }, [currentPath, candidateProfile, currentUser, navigate]);

  const navItems = [
    { to: '/candidate/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { to: '/candidate/applications', icon: 'work', label: 'Applications' },
    { to: '/candidate/resume-upload', icon: 'upload_file', label: 'AI Resume Import' },
    { to: '/candidate/profile', icon: 'person', label: 'My Profile' },
    { to: '/candidate/interviews', icon: 'event', label: 'Interviews' },
  ];

  const initials = currentUser.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);



  return (
    <div className="flex h-[100dvh] bg-white font-sans overflow-hidden">
      
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-emerald-900/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[240px] bg-white border-r border-slate-200 flex flex-col shrink-0 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Logo */}
        <div className="px-6 pt-8 pb-8 flex items-center gap-3">
          <img src="/logo.png" alt="Venika HR-TECH Logo" className="w-10 h-10 rounded-full object-cover shadow-lg" />
          <div className="flex flex-col leading-tight">
            <span className="font-display text-[18px] font-extrabold text-emerald-900 tracking-tight">Venika HR-TECH</span>
            <span className="text-[11px] font-bold text-emerald-800 tracking-[0.2em] uppercase">Intel</span>
          </div>
        </div>
        
        {/* Nav Items */}
        <div className="flex-1 overflow-y-auto px-4 space-y-8 mt-2">
          
          <div>
            <div className="px-2 mb-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Candidate</div>
            <nav className="space-y-1">
              {navItems.map(item => {
                const isActive = currentPath === item.to || currentPath.startsWith(item.to + '/');
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={(e) => {
                      if (isTestRoute) e.preventDefault();
                      else setIsSidebarOpen(false);
                    }}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-[14px] font-semibold transition-all group ${
                      isTestRoute ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
                    } ${
                      isActive
                        ? 'bg-emerald-800 text-white shadow-[0_4px_14px_rgba(37,99,235,0.3)]'
                        : 'text-slate-500 hover:text-emerald-900'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-700'}`}>
                        {item.icon}
                      </span>
                      {item.label}
                    </div>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white mr-1" />}
                  </Link>
                );
              })}
            </nav>
          </div>

        </div>

        {/* AI Copilot Pro Banner Removed */}

        {/* Sign Out */}
        <div className="px-3 pb-3 border-t border-slate-100 pt-2 mt-auto">
          <Link 
            to="/login" 
            onClick={(e) => isTestRoute && e.preventDefault()}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
              isTestRoute 
                ? 'opacity-50 cursor-not-allowed pointer-events-none text-slate-400' 
                : 'text-slate-500 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Navigation Bar */}
        <header className="h-[80px] bg-white flex items-center justify-between px-6 lg:px-10 shrink-0 border-b-2 border-slate-100/50">
          
          <div className="flex items-center gap-3 w-full max-w-2xl">
            {/* Hamburger Menu for Mobile */}
            <button 
              onClick={() => !isTestRoute && setIsSidebarOpen(true)}
              className={`lg:hidden w-10 h-10 flex items-center justify-center rounded-xl border transition-colors shrink-0 ${isTestRoute ? 'opacity-50 cursor-not-allowed text-slate-400 bg-slate-100 border-slate-200' : 'text-slate-600 bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>

            {!isTestRoute && (
              <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">search</span>
              <input
                type="text"
                placeholder="Search candidates, jobs, clients..."
                className="w-full pl-12 pr-12 py-3.5 text-[14px] border-2 border-slate-100 rounded-2xl bg-white focus:outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10 transition-all placeholder:text-slate-400 font-medium text-emerald-900"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-slate-100 text-slate-400 rounded-md text-[11px] font-bold font-sans border border-slate-200">⌘</kbd>
                <kbd className="px-1.5 py-0.5 bg-slate-100 text-slate-400 rounded-md text-[11px] font-bold font-sans border border-slate-200">K</kbd>
              </div>
              </div>
            )}
          </div>

          {!isTestRoute && (
            <div className="flex items-center gap-4 lg:gap-6 flex-1 justify-end shrink-0 pl-4">
            <button className="relative w-11 h-11 shrink-0 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-600 hover:text-emerald-900 hover:bg-slate-50 transition-colors cursor-pointer group">
              <span className="material-symbols-outlined text-[22px] group-hover:scale-110 transition-transform">notifications</span>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-800 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-left hidden sm:block">
                <div className="text-[14px] font-bold text-emerald-900 leading-tight group-hover:text-emerald-800 transition-colors">{currentUser.name}</div>
                <div className="text-[12px] font-medium text-slate-500">Candidate · Pro</div>
              </div>
              <div className="w-11 h-11 rounded-full bg-emerald-900 text-white flex items-center justify-center text-[14px] font-extrabold shadow-sm shrink-0 group-hover:shadow-md transition-all border-2 border-white">
                {initials}
              </div>
            </div>
            </div>
          )}
        </header>

        {/* Main Application Area */}
        <div className="flex-1 overflow-y-auto">
          <main className="max-w-5xl mx-auto w-full p-4 md:p-8 min-h-[calc(100vh-80px)]">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </main>
        </div>
      </div>
    </div>
  );
}

