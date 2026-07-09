import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import PageTransition from '../components/ui/PageTransition';

export default function SuperAdminLayout() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { currentUser } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { to: '/super-admin/dashboard', icon: 'space_dashboard', label: 'Dashboard' },
    { to: '/super-admin/global-candidates', icon: 'groups', label: 'Global Talent Pool' },
    { to: '/super-admin/clients', icon: 'domain', label: 'Client Accounts' },
    { to: '/super-admin/billing', icon: 'payments', label: 'Billing & Plans' },
  ];

  const initials = currentUser.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const getPageTitle = () => {
    switch (currentPath) {
      case '/super-admin/dashboard': return 'Dashboard';
      case '/super-admin/global-candidates': return 'Global Talent Pool';
      case '/super-admin/clients': return 'Client Accounts';
      case '/super-admin/billing': return 'Billing & Plans';
      default: return 'Platform Analytics';
    }
  };

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
          <img src="/logo.png" alt="Venika HR-TECH Logo" className="w-10 h-10 rounded-full object-cover shadow-lg shrink-0" />
          <div className="flex flex-col leading-tight">
            <span className="font-display text-[18px] font-extrabold text-emerald-900 tracking-tight">Venika HR-TECH</span>
            <span className="text-[11px] font-bold text-slate-500 tracking-[0.2em] uppercase">Super Admin</span>
          </div>
        </div>
        
        {/* Nav Items */}
        <div className="flex-1 overflow-y-auto px-4 space-y-8 mt-2">
          
          <div>
            <div className="px-2 mb-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">System Control</div>
            <nav className="space-y-1">
              {navItems.map(item => {
                const isActive = currentPath === item.to || currentPath.startsWith(item.to + '/');
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-[14px] font-semibold transition-all group ${
                      isActive
                        ? 'bg-emerald-900 text-white shadow-md'
                        : 'text-slate-500 hover:text-emerald-900'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-800'}`}>
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

        {/* Bottom Action */}
        <div className="p-3">
          <Link
            to="/super-admin/dashboard"
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 text-emerald-900 text-[13px] font-bold rounded-xl transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
            Platform Settings
          </Link>
        </div>

        {/* Sign Out */}
        <div className="px-3 pb-3 border-t border-slate-100 pt-2">
          <Link to="/login" className="flex items-center gap-2.5 px-3 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg text-[13px] font-medium transition-colors">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Exit System
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
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-600 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors shrink-0"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h2 className="text-xl font-bold text-emerald-900 hidden sm:block">{getPageTitle()}</h2>
          </div>

          <div className="flex items-center gap-4 lg:gap-6 flex-1 justify-end shrink-0 pl-4">
            <div className="hidden md:flex px-3 py-1 bg-green-700/10 text-emerald-800 border border-green-700/20 text-xs rounded-full font-bold items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse"></span>
              All AI Nodes Operational
            </div>
            
            <div className="flex items-center gap-3 cursor-pointer group border-l border-slate-200 pl-4">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-emerald-800 to-indigo-600 text-white flex items-center justify-center text-[14px] font-extrabold shadow-sm shrink-0 group-hover:shadow-md transition-all">
                {initials}
              </div>
              <div className="hidden sm:block">
                <div className="text-[13px] font-extrabold text-emerald-900 leading-tight group-hover:text-emerald-900 transition-colors">{currentUser.name}</div>
                <div className="text-[11px] font-semibold text-slate-500">Super Admin</div>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-[20px] group-hover:text-emerald-900 transition-colors hidden sm:block">expand_more</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <PageTransition>
            <div className="p-4 lg:p-6 max-w-7xl mx-auto w-full">
              <Outlet />
            </div>
          </PageTransition>
        </main>
      </div>
    </div>
  );
}

