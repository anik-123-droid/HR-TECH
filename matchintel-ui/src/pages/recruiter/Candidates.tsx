import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
export default function RecruiterCandidates() {
  const navigate = useNavigate();
  const { jobs, applications, updateJob, globalCandidates } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'requisitions' | 'talent'>('requisitions');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Map real jobs to the required format
  const reqs = jobs.map(job => {
    const jobApps = applications.filter(a => a.jobId === job.id);
    const matches = jobApps.filter(a => a.matchScore >= 80).length;
    const inScreening = jobApps.filter(a => a.status === 'Under Review' || a.status === 'Shortlisted' || a.status === 'Interview Scheduled').length;
    const avatars = jobApps.map(a => a.candidateName.charAt(0));

    return {
      id: job.id,
      title: job.title,
      location: `${job.location} • ${job.mode}`,
      status: job.status,
      matches,
      inScreening,
      avatars
    };
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans pb-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <div>
          <h1 className="font-display text-[32px] font-extrabold text-emerald-900 tracking-tight leading-tight mb-2">Requisitions & Talent</h1>
          <p className="text-[15px] text-slate-500 font-medium">Manage your active job postings and explore your talent pool.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('requisitions')} 
            className={`px-5 py-2 text-[13px] font-bold rounded-lg transition-all ${activeTab === 'requisitions' ? 'bg-white text-emerald-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Job Requisitions
          </button>
          <button 
            onClick={() => setActiveTab('talent')} 
            className={`px-5 py-2 text-[13px] font-bold rounded-lg transition-all ${activeTab === 'talent' ? 'bg-white text-emerald-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Talent Pool
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">search</span>
            <input
              type="text"
              placeholder="Search roles or candidates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 pl-11 pr-4 py-3 border-2 border-slate-100 rounded-xl text-[13px] font-medium text-emerald-900 focus:outline-none focus:border-emerald-700 transition-all placeholder:text-slate-400"
            />
          </div>
          {activeTab === 'talent' && (
            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
              <button 
                onClick={() => setViewMode('grid')}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-emerald-800' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <span className="material-symbols-outlined">grid_view</span>
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-emerald-800' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <span className="material-symbols-outlined">view_list</span>
              </button>
            </div>
          )}
          
          <button className="w-12 h-12 rounded-xl border-2 border-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors shrink-0">
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>
          {activeTab === 'requisitions' && (
            <button 
              onClick={() => alert('Create New Req clicked')}
              className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-[14px] font-bold transition-all shadow-sm flex items-center gap-2 shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              New Requisition
            </button>
          )}
        </div>
      </div>

      {/* Requisitions List */}
      {activeTab === 'requisitions' ? (
        <div className="space-y-4">
          {reqs.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase())).map(req => (
            <div key={req.id} className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
              
              <div className="flex-1">
                <h3 className="font-display text-[18px] font-bold text-emerald-900">{req.title}</h3>
                <p className="text-[13px] font-medium text-slate-500 mt-1">{req.location}</p>
              </div>

              <div className="flex items-center gap-3 md:w-1/3">
                <button 
                  onClick={() => updateJob(req.id, { status: req.status === 'Active' ? 'Paused' : 'Active' })}
                  className={`px-3 py-1 rounded-full text-[12px] font-bold border transition-colors cursor-pointer ${req.status === 'Active' ? 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                  title={req.status === 'Active' ? 'Click to Pause' : 'Click to Activate'}
                >
                  <div className="flex items-center gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${req.status === 'Active' ? 'bg-emerald-700' : 'bg-slate-400'}`}></div>
                    {req.status}
                  </div>
                </button>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-full text-[12px] font-bold">
                  {req.matches} Matches
                </span>
                <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-[12px] font-bold">
                  {req.inScreening} In Screening
                </span>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 md:w-1/3">
                <div className="flex -space-x-3">
                  {req.avatars.length === 0 ? (
                    <div className="text-[12px] font-medium text-slate-400">No candidates yet</div>
                  ) : (
                    <>
                      {req.avatars.slice(0, 3).map((avatar, i) => (
                        <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-extrabold text-white border-2 border-white shadow-sm ${
                          i === 0 ? 'bg-emerald-800' : i === 1 ? 'bg-indigo-600' : i === 2 ? 'bg-purple-600' : 'bg-emerald-900'
                        }`}>
                          {avatar}
                        </div>
                      ))}
                      {req.avatars.length > 3 && (
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[12px] font-extrabold text-slate-600 border-2 border-white shadow-sm">
                          +{req.avatars.length - 3}
                        </div>
                      )}
                    </>
                  )}
                </div>
                <button 
                  onClick={() => navigate('/recruiter/ai-screening')}
                  className="px-5 py-2.5 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-[13px] font-bold transition-all shadow-sm whitespace-nowrap"
                >
                  View Candidates
                </button>
              </div>
              
            </div>
          ))}
          {reqs.length === 0 && (
            <div className="text-center py-12 text-slate-500 font-medium">
              No active jobs yet. Create a requisition to start matching.
            </div>
          )}
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {globalCandidates.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.title?.toLowerCase().includes(searchQuery.toLowerCase())).map(candidate => (
            <div key={candidate.id} className={`bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all flex ${viewMode === 'grid' ? 'flex-col items-center text-center gap-4' : 'items-center justify-between gap-6'}`}>
              <div className={`flex ${viewMode === 'grid' ? 'flex-col items-center gap-4' : 'items-center gap-4'}`}>
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-900 border-2 border-emerald-200 flex items-center justify-center text-xl font-bold overflow-hidden shrink-0">
                  {candidate.imageUrl ? (
                    <img src={candidate.imageUrl} alt={candidate.name} className="w-full h-full object-cover" />
                  ) : (
                    candidate.name.split(' ').map(n => n[0]).join('')
                  )}
                </div>
                <div>
                  <h3 className="font-display text-[18px] font-bold text-emerald-900">{candidate.name}</h3>
                  <p className="text-[13px] font-medium text-slate-500">{candidate.title || 'No Title'}</p>
                </div>
              </div>
              
              {viewMode === 'list' && (
                <div className="flex items-center gap-2 flex-1 justify-center max-w-sm flex-wrap">
                  {candidate.skills?.slice(0, 3).map(skill => (
                    <span key={skill} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[11px] font-semibold">{skill}</span>
                  ))}
                </div>
              )}

              <div className="flex flex-col items-center gap-1">
                <span className="text-[20px] font-bold text-emerald-900">{candidate.readinessScore || 0}</span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ATS Score</span>
              </div>
            </div>
          ))}
          {globalCandidates.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500 font-medium">
              No candidates in your talent pool yet.
            </div>
          )}
        </div>
      )}

    </div>
  );
}

