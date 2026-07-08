import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function SuperAdminLogin() {
  const { superadminName } = useParams();
  const navigate = useNavigate();
  const { login, clearAllData } = useApp();

  if (!superadminName || superadminName === 'login' || superadminName === 'candidate' || superadminName === 'recruiter' || superadminName === 'super-admin') {
     return <div className="p-8 font-sans text-center mt-10"><h1 className="text-2xl font-bold">404 Not Found</h1></div>;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const name = superadminName.charAt(0).toUpperCase() + superadminName.slice(1);
    login(name, `${superadminName}@recruitai.com`, 'SuperAdmin', 'RecruitAI Platform');
    clearAllData();
    navigate('/super-admin/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans p-4">
      <div className="w-full max-w-md p-8 bg-white border border-slate-200 rounded-2xl shadow-xl">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-emerald-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-md">
            <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
          </div>
          <h1 className="text-2xl font-bold text-emerald-900">System Admin Access</h1>
          <p className="text-sm text-slate-500 mt-1">Welcome, <span className="text-emerald-700 font-bold">{superadminName}</span></p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="password">
              Security Passcode
            </label>
            <input
              id="password"
              type="password"
              defaultValue="admin123"
              className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-emerald-900 text-sm font-medium placeholder:text-slate-400"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-[0_4px_14px_rgba(16,185,129,0.3)] transition-all duration-200 cursor-pointer"
          >
            Verify & Enter Platform
          </button>
        </form>
      </div>
    </div>
  );
}
