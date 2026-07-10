// @ts-nocheck
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function RecruiterCandidates() {
  const navigate = useNavigate();
  const { jobs, applications, createJobRequisition, updateJob, clients } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [dept, setDept] = useState('Engineering');
  const [location, setLocation] = useState('Remote');
  const [skillsInput, setSkillsInput] = useState('');
  const [clientId, setClientId] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await createJobRequisition({
      title: title.trim(),
      dept,
      location,
      mode: 'Remote',
      salary: '$100k - $150k',
      description: `We are looking for a ${title.trim()} to join our ${dept} team.`,
      skills: skillsInput.split(',').map(s => s.trim()).filter(Boolean),
      clientId: clientId || (clients.length > 0 ? clients[0].id : undefined)
    });

    setTitle('');
    setSkillsInput('');
    setShowModal(false);
    alert(`🎉 New Requisition Created: "${title}"\n\nAI is now sourcing matching candidates from the global talent pool.`);
  };

  // Derive counts dynamically
  const jobStats = jobs.map(job => {
    const jobApps = applications.filter(a => a.jobId === job.id);
    return {
      ...job,
      candidatesCount: jobApps.length,
      aiMatchesCount: jobApps.filter(a => a.matchScore >= 80).length
    };
  });

  const sourcingJobs = jobStats.filter(j => j.status === 'Active' && j.candidatesCount === 0);
  const interviewingJobs = jobStats.filter(j => j.status === 'Active' && j.candidatesCount > 0);
  const filledJobs = jobStats.filter(j => j.status === 'Filled');

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-emerald-900 tracking-tight">Requisitions & Talent</h1>
          <p className="text-[14px] text-slate-500 mt-1 font-medium">Manage and monitor the health of your AI-optimized recruitment pipelines.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-bold rounded-xl transition-all shadow-md cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Requisition
        </button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center justify-between">
            <span>Total Open Reqs</span>
            <span className="material-symbols-outlined text-[18px] text-indigo-500">work</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className=" text-3xl font-extrabold text-emerald-900">{jobs.filter(j => j.status === 'Active').length}</span>
            <span className="text-[12px] font-semibold text-indigo-600">Active pipelines</span>
          </div>
        </div>
        <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center justify-between">
            <span>Candidates Sourced</span>
            <span className="material-symbols-outlined text-[18px] text-emerald-700">groups</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className=" text-3xl font-extrabold text-emerald-800">
              {jobStats.reduce((acc, j) => acc + (j.candidatesCount || 0), 0)}
            </span>
            <span className="text-[12px] font-semibold text-green-800">+18% vs manual</span>
          </div>
        </div>
        <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center justify-between">
            <span>AI Matches Generated</span>
            <span className="material-symbols-outlined text-[18px] text-green-700">auto_awesome</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className=" text-3xl font-extrabold text-emerald-900">
              {jobStats.reduce((acc, j) => acc + (j.aiMatchesCount || 0), 0)}
            </span>
            <span className="text-[12px] font-semibold text-green-800">High precision</span>
          </div>
        </div>
      </div>

      {/* Kanban Column Headers */}
      <div className="flex items-center gap-8 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-700" />
          <span className="text-[12px] font-extrabold text-slate-700 uppercase tracking-wider">Sourcing</span>
          <span className="text-[11px] font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">{sourcingJobs.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-[12px] font-extrabold text-slate-700 uppercase tracking-wider">Interviewing</span>
          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">{interviewingJobs.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-green-700" />
          <span className="text-[12px] font-extrabold text-slate-700 uppercase tracking-wider">Filled</span>
          <span className="text-[11px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">{filledJobs.length}</span>
        </div>
      </div>

      {/* Empty State vs Kanban Grid */}
      {jobs.length === 0 ? (
        <div className="border border-slate-200 rounded-2xl bg-white p-14 text-center shadow-xs">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-100 shadow-sm">
            <span className="material-symbols-outlined text-3xl">add_business</span>
          </div>
          <h3 className="font-display text-lg font-bold text-emerald-900 mb-1">No Active Requisitions</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
            Create your first job requisition to start AI sourcing and matching candidates from our global talent pool.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 mx-auto cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Create First Requisition
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sourcing Column */}
          <div className="space-y-3.5">
            {sourcingJobs.map(card => (
              <div key={card.id} className="border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-md transition-all bg-white shadow-xs cursor-pointer flex flex-col h-full">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-display text-[15px] font-bold text-emerald-900 leading-snug">{card.title}</h3>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full text-emerald-900 bg-emerald-50 border border-emerald-200">
                        Sourcing
                      </span>
                      <button onClick={(e) => { e.stopPropagation(); updateJob(card.id, { status: 'Paused' }); }} className="text-[10px] text-red-600 font-bold hover:underline">Deactivate</button>
                    </div>
                  </div>
                  <p className="text-[13px] font-medium text-slate-500 mb-4">{card.dept} • <span className="text-slate-700">{card.location}</span></p>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-1.5 text-slate-600 text-xs font-semibold">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">group</span>
                      {card.candidatesCount} pool
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                      <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                      +{card.aiMatchesCount} AI Matches
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 mt-auto">
                  <button 
                    onClick={(e) => { e.stopPropagation(); navigate(`/recruiter/ai-screening?jobId=${card.id}`); }}
                    className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[13px] font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    View Candidates
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Interviewing Column */}
          <div className="space-y-3.5">
            {interviewingJobs.map(card => (
              <div key={card.id} className="border border-slate-200 rounded-2xl p-5 hover:border-amber-300 hover:shadow-md transition-all bg-white shadow-xs cursor-pointer flex flex-col h-full">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-display text-[15px] font-bold text-emerald-900 leading-snug">{card.title}</h3>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full text-amber-700 bg-amber-50 border border-amber-200">
                        Interviewing
                      </span>
                      <button onClick={(e) => { e.stopPropagation(); updateJob(card.id, { status: 'Paused' }); }} className="text-[10px] text-red-600 font-bold hover:underline">Deactivate</button>
                    </div>
                  </div>
                  <p className="text-[13px] font-medium text-slate-500 mb-4">{card.dept} • <span className="text-slate-700">{card.location}</span></p>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-1.5 text-slate-600 text-xs font-semibold">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">group</span>
                      {card.candidatesCount} in stage
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      In Progress
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 mt-auto">
                  <button 
                    onClick={(e) => { e.stopPropagation(); navigate(`/recruiter/ai-screening?jobId=${card.id}`); }}
                    className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[13px] font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    View Candidates
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Filled Column */}
          <div className="space-y-3.5">
            {filledJobs.map(card => (
              <div key={card.id} className="border border-slate-200 rounded-2xl p-5 hover:border-green-300 hover:shadow-md transition-all bg-white shadow-xs cursor-pointer opacity-90 flex flex-col h-full">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-display text-[15px] font-bold text-emerald-900 leading-snug">{card.title}</h3>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full text-green-700 bg-green-50 border border-green-200">
                      Filled
                    </span>
                  </div>
                  <p className="text-[13px] font-medium text-slate-500 mb-4">{card.dept} • <span className="text-slate-700">{card.location}</span></p>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-1.5 text-slate-600 text-xs font-semibold">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">verified</span>
                      Completed
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      Hired
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 mt-auto">
                  <button 
                    onClick={(e) => { e.stopPropagation(); navigate(`/recruiter/ai-screening?jobId=${card.id}`); }}
                    className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[13px] font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    View Candidates
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-emerald-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </div>
                <h3 className="font-display text-lg font-bold text-emerald-900">New Job Requisition</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Job Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Job Title"
                  required
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Department</label>
                  <input
                    type="text"
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    placeholder="Department"
                    required
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 outline-none transition-all bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Remote"
                    required
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 outline-none transition-all bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Client Account</label>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 outline-none transition-all bg-white"
                >
                  <option value="">Select a Client (Optional)</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Required Skills (Comma Separated)</label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="e.g. Sales, Marketing, Negotiation"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 outline-none transition-all bg-white"
                />
              </div>

              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-start gap-2.5 text-xs text-indigo-900 mt-2">
                <span className="material-symbols-outlined text-[18px] text-indigo-600 shrink-0 mt-0.5">auto_awesome</span>
                <span>When created, RecruitAI Intelligence engine will immediately match candidates from your talent pool.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">check</span>
                  Create & Match AI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
