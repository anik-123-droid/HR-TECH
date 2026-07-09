import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useGoogleLogin } from '@react-oauth/google';

type Role = 'Candidate' | 'Admin';
type AuthMode = 'SignIn' | 'SignUp';

export default function Login() {
  const [role, setRole] = useState<Role>('Candidate');
  const [mode, setMode] = useState<AuthMode>('SignIn');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('');

  const navigate = useNavigate();
  const { login } = useApp();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
      })
        .then(res => res.json())
        .then(userInfo => {
          const userName = userInfo.name || 'Google User';
          const userEmail = userInfo.email || 'googleuser@example.com';
          const companyName = role === 'Admin' ? 'TechFlow Inc.' : 'Candidate Portal';

          login(userName, userEmail, role === 'Candidate' ? 'Candidate' : 'Admin', companyName, { access: tokenResponse.access_token });

          if (role === 'Candidate') {
            fetch('/api/send-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                candidate_email: userEmail,
                candidate_name: userName,
                status: mode === 'SignUp' ? 'welcome' : 'signin',
                job_role: "Portal Access",
                company_name: "MatchIntel",
                action_url: "https://matchintel.ai/candidate/dashboard"
              })
            }).catch(e => console.error("Email error:", e));
          }
          navigate(role === 'Candidate' ? '/candidate/dashboard' : '/recruiter/dashboard');
        });
    },
    scope: 'https://mail.google.com/ https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
  });

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();

    const userName = name.trim() || (email ? email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()) : (role === 'Candidate' ? 'Elena Rodriguez' : 'Alex Rivera'));
    const userEmail = email.trim() || (role === 'Candidate' ? 'elena@techflow.com' : 'alex@techstaffing.com');
    const companyName = role === 'Admin' ? 'TechFlow Inc.' : 'Candidate Portal';

    login(userName, userEmail, role === 'Candidate' ? 'Candidate' : 'Admin', companyName);

    if (role === 'Candidate') {
      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate_email: userEmail,
          candidate_name: userName,
          status: mode === 'SignUp' ? 'welcome' : 'signin',
          job_role: "Portal Access",
          company_name: "MatchIntel",
          action_url: "https://matchintel.ai/candidate/dashboard"
        })
      }).catch(e => console.error("Email error:", e));
    }

    navigate(role === 'Candidate' ? '/candidate/dashboard' : '/recruiter/dashboard');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50/30 p-4 font-sans text-emerald-900">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-2 border-emerald-700 p-8 sm:p-10 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">

        {/* Header / Logo */}
        <div className="text-center mb-8 transform transition-all duration-500 translate-y-0">
          <div className="inline-flex items-center justify-center mb-5 hover:scale-105 transition-transform duration-300">
            <img src="/logo.png" alt="Venika HR-TECH Logo" className="w-16 h-16 rounded-full object-cover shadow-lg" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-emerald-900">Venika HR-TECH</h1>
          <p className="text-emerald-900 mt-2 text-2xl font-serif italic tracking-wide">
            {mode === 'SignIn' ? 'Welcome Back' : 'Create your smart account'}
          </p>
        </div>



        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-4">

          <div className={`space-y-4 transition-all duration-500 ${mode === 'SignUp' ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden m-0 p-0'}`}>
            {mode === 'SignUp' && (
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-700/10 focus:border-emerald-700 focus:bg-white transition-all text-sm font-medium"
                  placeholder={role === 'Candidate' ? "Name" : "Name"}
                  required={mode === 'SignUp'}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-700/10 focus:border-emerald-700 focus:bg-white transition-all text-sm font-medium"
              placeholder="Email"
              required
            />
          </div>

          <div className={`space-y-4 transition-all duration-500 ${(mode === 'SignUp' && role === 'Admin') ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden m-0 p-0'}`}>
            {(mode === 'SignUp' && role === 'Admin') && (
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Job Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-700/10 focus:border-emerald-700 focus:bg-white transition-all text-sm font-medium"
                  placeholder="e.g. HR Manager"
                  required={mode === 'SignUp' && role === 'Admin'}
                />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[13px] font-bold text-slate-700">Password</label>
              {mode === 'SignIn' && (
                <button type="button" className="text-[12px] font-bold text-emerald-800 hover:text-emerald-900 transition-colors">
                  Forgot?
                </button>
              )}
            </div>
            <input
              type="password"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-700/10 focus:border-emerald-700 focus:bg-white transition-all text-sm font-medium tracking-widest"
              placeholder="password"
              required
            />
          </div>

          {/* Role Toggle (Candidate vs Admin) */}
          <div className="pt-3">
            <label className="block text-[13px] font-bold text-slate-700 mb-2">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`border-2 rounded-xl p-3 flex items-center justify-center cursor-pointer transition-all duration-300 ${role === 'Candidate' ? 'border-emerald-700 bg-emerald-50 text-emerald-900 shadow-sm transform -translate-y-0.5' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}>
                <input type="radio" name="role" className="hidden" checked={role === 'Candidate'} onChange={() => setRole('Candidate')} />
                <span className="text-sm font-bold">Candidate</span>
              </label>
              <label className={`border-2 rounded-xl p-3 flex items-center justify-center cursor-pointer transition-all duration-300 ${role === 'Admin' ? 'border-emerald-700 bg-emerald-50 text-emerald-900 shadow-sm transform -translate-y-0.5' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}>
                <input type="radio" name="role" className="hidden" checked={role === 'Admin'} onChange={() => setRole('Admin')} />
                <span className="text-sm font-bold">Admin</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-8">
            <button
              type="submit"
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3.5 rounded-xl shadow-[0_4px_14px_0_rgba(6,95,70,0.39)] hover:shadow-[0_6px_20px_rgba(6,95,70,0.23)] hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98]"
            >
              {mode === 'SignIn' ? 'Sign In ' : 'Create Account'}
            </button>

            <button
              type="button"
              onClick={() => handleGoogleLogin()}
              className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl shadow-sm hover:bg-slate-50 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              {mode === 'SignIn' ? 'Sign In with Google' : 'Sign Up with Google'}
            </button>
          </div>

          <div className="mt-6 text-center text-[13px] text-slate-600 font-medium">
            {mode === 'SignIn' ? (
              <p>
                Don't have an account?{' '}
                <button type="button" onClick={() => setMode('SignUp')} className="font-bold text-emerald-800 hover:text-emerald-900 hover:underline transition-all">
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button type="button" onClick={() => setMode('SignIn')} className="font-bold text-emerald-800 hover:text-emerald-900 hover:underline transition-all">
                  Sign In
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

