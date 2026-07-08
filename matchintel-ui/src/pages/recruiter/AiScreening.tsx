import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function RecruiterAiScreening() {
  const navigate = useNavigate();
  const { aiScreenings, updateScreeningStatus, updateApplicationStatus, globalCandidates, candidateProfile: localCandidateProfile, applications, currentUser } = useApp();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Best' | 'Average' | 'Worst'>('All');
  const [viewingCandidateId, setViewingCandidateId] = useState<string | null>(null);

  const getCandidateProfile = (c: any) => {
    let profile;
    const application = applications.find((a: any) => a.id === c.applicationId);
    
    if (application) {
      profile = globalCandidates.find(p => p.id === application.candidateId);
      if (!profile && localCandidateProfile.id === application.candidateId) {
        profile = localCandidateProfile;
      }
    }
    
    if (!profile) {
      profile = globalCandidates.find(p => p.name === c.candidateName);
      if (!profile && localCandidateProfile.name === c.candidateName) {
        profile = localCandidateProfile;
      }
    }
    return profile;
  };

  const handleSendEmail = async (candidate: any, statusType: string) => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate_email: candidate.email,
          candidate_name: candidate.name,
          status: statusType,
          job_role: candidate.title || 'Professional Candidate',
          company_name: 'MatchIntel',
          action_url: 'https://matchintel.ai/dashboard',
          admin_email: currentUser?.email,
          admin_name: currentUser?.name,
          google_access_token: currentUser?.googleAccessToken
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log(`Email successfully sent to ${candidate.email}!`);
        // Use a less intrusive notification or alert
      } else {
        console.error('Failed to send email.');
      }
    } catch (error) {
      console.error("Failed to send email notification", error);
    }
  };

  const queue = useMemo(() => {
    let filtered = aiScreenings;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(c => c.candidateName.toLowerCase().includes(q) || c.role.toLowerCase().includes(q));
    }
    if (statusFilter) {
      filtered = filtered.filter(c => c.status === statusFilter);
    }
    if (categoryFilter === 'Best') filtered = filtered.filter(c => c.aiScore >= 90);
    if (categoryFilter === 'Average') filtered = filtered.filter(c => c.aiScore >= 75 && c.aiScore < 90);
    if (categoryFilter === 'Worst') filtered = filtered.filter(c => c.aiScore < 75);
    return filtered;
  }, [searchQuery, statusFilter, categoryFilter, aiScreenings]);

  // Buckets for metrics
  const bestCount = aiScreenings.filter(c => c.aiScore >= 90).length;
  const averageCount = aiScreenings.filter(c => c.aiScore >= 75 && c.aiScore < 90).length;
  const worstCount = aiScreenings.filter(c => c.aiScore < 75).length;

  const bestCandidates = queue.filter(c => c.aiScore >= 90);
  const averageCandidates = queue.filter(c => c.aiScore >= 75 && c.aiScore < 90);
  const worstCandidates = queue.filter(c => c.aiScore < 75);

  const toggleRow = (id: string) => {
    setSelectedRows(prev => prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]);
  };

  const handleAction = async (id: string, applicationId: string, action: 'Shortlist' | 'Reject' | 'Schedule' | 'Pass') => {
    const screening = queue.find(s => s.id === id);
    let profile = null;
    if (screening) {
        profile = getCandidateProfile(screening);
        if (!profile) {
          console.warn('Candidate profile not found in global list. Using fallback profile to ensure email is sent for testing.');
          profile = {
            name: screening.candidateName,
            email: currentUser?.email, // Sends to the Admin's email so they can see it working
            title: screening.role
          };
        }
    }

    if (action === 'Reject') {
      updateScreeningStatus(id, 'Rejected');
      updateApplicationStatus(applicationId, 'Rejected');
      if (profile) await handleSendEmail(profile, 'rejected');
    } else if (action === 'Shortlist') {
      updateScreeningStatus(id, 'Approved');
      updateApplicationStatus(applicationId, 'Shortlisted');
      if (profile) await handleSendEmail(profile, 'approved');
    } else if (action === 'Schedule') {
      updateScreeningStatus(id, 'Approved');
      updateApplicationStatus(applicationId, 'Interview Scheduled');
      if (profile) await handleSendEmail(profile, 'interview_scheduled');
      navigate('/recruiter/interviews');
    } else if (action === 'Pass') {
      updateApplicationStatus(applicationId, 'Hired');
    }
  };

  const handleBatchScreen = () => {
    alert(`🤖 Running AI Batch Screening on ${queue.length} candidates...\n\nThis will process each candidate through the AI pipeline.`);
  };

  // Find actual candidate details for modal
  const viewProfile = (c: any) => {
    const profile = getCandidateProfile(c);

    if (profile) {
      setViewingCandidateId(profile.id);
    } else {
      alert("Candidate profile details not found.");
    }
  };

  const renderCandidateRow = (c: any) => {
    const app = applications.find(a => a.id === c.applicationId);
    return (
    <tr key={c.id} className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${selectedRows.includes(c.id) ? 'bg-emerald-50/30' : ''}`}>
      <td className="px-5 py-3">
        <input type="checkbox" className="rounded border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed" checked={selectedRows.includes(c.id)} onChange={() => toggleRow(c.id)} disabled={c.status !== 'Pending'} />
      </td>
      <td className="px-5 py-3">
        <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => viewProfile(c)}>
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors">
            {c.candidateName.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div>
            <div className="text-[13px] font-semibold text-emerald-900 group-hover:text-emerald-600 transition-colors">{c.candidateName}</div>
            <div className="text-[11px] text-slate-400">{c.role}</div>
          </div>
        </div>
      </td>
      <td className="px-5 py-3">
        <div className="flex items-center gap-2">
          <span className={`text-[14px] font-bold ${c.aiScore >= 90 ? 'text-green-600' : c.aiScore >= 75 ? 'text-emerald-600' : 'text-amber-600'}`}>{c.aiScore}</span>
          <div className="w-14 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${c.aiScore >= 90 ? 'bg-green-500' : c.aiScore >= 75 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{width: `${c.aiScore}%`}} />
          </div>
        </div>
      </td>
      <td className="px-5 py-3">
        {c.strengths && c.strengths[0] ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
            <span className="material-symbols-outlined text-[12px]">verified</span>{c.strengths[0]}
          </span>
        ) : <span className="text-[11px] text-slate-400">—</span>}
      </td>
      <td className="px-5 py-3">
        {c.risks && c.risks[0] ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
            <span className="material-symbols-outlined text-[12px]">warning</span>{c.risks[0]}
          </span>
        ) : <span className="text-[11px] text-slate-400">None</span>}
      </td>
      <td className="px-5 py-3">
        <span className={`text-[12px] font-semibold ${c.status === 'Approved' ? 'text-green-600' : c.status === 'Pending' ? 'text-emerald-600' : 'text-red-600'}`}>{c.status}</span>
        {app?.testScore !== undefined && (
          <div className="mt-1 flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-200">
            <span className="material-symbols-outlined text-[12px]">quiz</span>
            Test: {app.testScore}/100 {app.testPenalties ? `(-${app.testPenalties} penalty)` : ''}
          </div>
        )}
      </td>
      <td className="px-5 py-3 text-right">
        {c.status === 'Pending' ? (
          <div className="flex items-center justify-end gap-2">
            <button onClick={(e) => { e.stopPropagation(); viewProfile(c); }} className="px-2 py-1 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded text-[11px] font-bold transition-colors">View Profile</button>
            <button onClick={(e) => { e.stopPropagation(); handleAction(c.id, c.applicationId, 'Reject'); }} className="px-2 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded text-[11px] font-bold transition-colors">Reject</button>
            <button onClick={(e) => { e.stopPropagation(); handleAction(c.id, c.applicationId, 'Shortlist'); }} className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[11px] font-bold transition-colors">Shortlist</button>
          </div>
        ) : app?.status === 'Shortlisted' ? (
          <div className="flex items-center justify-end gap-2">
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">Waiting for MCQ Test</span>
          </div>
        ) : app?.status === 'MCQ Test Completed' ? (
          <div className="flex items-center justify-end gap-2">
            <button onClick={(e) => { e.stopPropagation(); viewProfile(c); }} className="px-2 py-1 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded text-[11px] font-bold transition-colors">View Profile</button>
            <button onClick={(e) => { e.stopPropagation(); handleAction(c.id, c.applicationId, 'Schedule'); }} className="px-2 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded text-[11px] font-bold transition-colors">Schedule Interview</button>
          </div>
        ) : app?.status === 'Interview Scheduled' || app?.status === 'Interview Completed' ? (
          <div className="flex items-center justify-end gap-2">
            <button onClick={(e) => { e.stopPropagation(); handleAction(c.id, c.applicationId, 'Pass'); }} className="px-3 py-1.5 bg-green-600 text-white hover:bg-green-700 rounded text-[11px] font-bold transition-colors shadow-sm">PASS</button>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-2">
            <button onClick={(e) => { e.stopPropagation(); viewProfile(c); }} className="px-2 py-1 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded text-[11px] font-bold transition-colors">View Profile</button>
            <span className="text-[11px] font-semibold text-slate-400 ml-2">Action Taken</span>
          </div>
        )}
      </td>
    </tr>
  );
  };

  return (
    <div className="space-y-6 pb-10">
      
      {/* Top Filter Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
        <div 
          onClick={() => setCategoryFilter('All')}
          className={`bg-white border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${categoryFilter === 'All' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200'}`}
        >
          <div className="text-[12px] font-bold text-slate-500 uppercase mb-1">Total Screened</div>
 <div className=" text-2xl font-bold text-emerald-900">{aiScreenings.length}</div>
        </div>
        <div 
          onClick={() => setCategoryFilter('Best')}
          className={`bg-white border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${categoryFilter === 'Best' ? 'border-green-500 ring-2 ring-green-100' : 'border-slate-200'}`}
        >
          <div className="text-[12px] font-bold text-green-600 uppercase mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">workspace_premium</span> Top Matches</div>
 <div className=" text-2xl font-bold text-emerald-900">{bestCount}</div>
        </div>
        <div 
          onClick={() => setCategoryFilter('Average')}
          className={`bg-white border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${categoryFilter === 'Average' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200'}`}
        >
          <div className="text-[12px] font-bold text-emerald-600 uppercase mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">thumb_up</span> Good Matches</div>
 <div className=" text-2xl font-bold text-emerald-900">{averageCount}</div>
        </div>
        <div 
          onClick={() => setCategoryFilter('Worst')}
          className={`bg-white border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${categoryFilter === 'Worst' ? 'border-amber-500 ring-2 ring-amber-100' : 'border-slate-200'}`}
        >
          <div className="text-[12px] font-bold text-amber-600 uppercase mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">trending_down</span> Weak Matches</div>
 <div className=" text-2xl font-bold text-emerald-900">{worstCount}</div>
        </div>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-emerald-900 tracking-tight">AI Screening Pipeline</h1>
          <p className="text-[14px] text-slate-500 mt-1">
            {queue.length} candidates {statusFilter ? `(filtered: ${statusFilter})` : 'in queue'} • {selectedRows.length > 0 ? `${selectedRows.length} selected` : 'Select rows for bulk actions'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Status Filter Dropdown */}
          <select
            value={statusFilter || ''}
            onChange={(e) => setStatusFilter(e.target.value || null)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-[13px] font-medium text-slate-700 bg-white focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
          {selectedRows.length > 0 && (
            <button
              onClick={() => { alert(`Bulk rejecting: ${selectedRows.length} candidates`); setSelectedRows([]); }}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 bg-red-50 text-red-700 rounded-lg text-[13px] font-semibold transition-colors cursor-pointer hover:bg-red-100"
            >
              Reject Selected ({selectedRows.length})
            </button>
          )}
          <button
            onClick={handleBatchScreen}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900 hover:bg-black text-white rounded-lg text-[13px] font-semibold transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">psychology</span> Run Batch Screen
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-slate-400">search</span>
        <input
          type="text"
          placeholder="Search candidates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-[13px] border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-400"
        />
      </div>

      {/* Buckets Table */}
      <div className="space-y-8">
        
        {/* Best Candidates (>= 90) */}
        {bestCandidates.length > 0 && (
          <div>
            <h2 className="font-display text-lg font-bold text-green-700 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">workspace_premium</span> Top Matches (90%+)
            </h2>
            <div className="border border-green-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-green-100 bg-green-50/30">
                    <th className="text-left px-5 py-3 w-10">
                      <input type="checkbox" className="rounded border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed" disabled={bestCandidates.filter(c => c.status === 'Pending').length === 0} checked={selectedRows.length > 0 && bestCandidates.filter(c => c.status === 'Pending').length > 0 && bestCandidates.filter(c => c.status === 'Pending').every(c => selectedRows.includes(c.id))} onChange={(e) => e.target.checked ? setSelectedRows(prev => Array.from(new Set([...prev, ...bestCandidates.filter(c => c.status === 'Pending').map(c => c.id)]))) : setSelectedRows(prev => prev.filter(id => !bestCandidates.find(c => c.id === id)))} />
                    </th>
                    <th className="text-left px-5 py-3">Candidate</th>
                    <th className="text-left px-5 py-3">AI Score</th>
                    <th className="text-left px-5 py-3">Trust Signal</th>
                    <th className="text-left px-5 py-3">Risk Flag</th>
                    <th className="text-left px-5 py-3">Status</th>
                    <th className="text-right px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bestCandidates.map(renderCandidateRow)}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Average Candidates (75 - 89) */}
        {averageCandidates.length > 0 && (
          <div>
            <h2 className="font-display text-lg font-bold text-emerald-700 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">thumb_up</span> Good Matches (75% - 89%)
            </h2>
            <div className="border border-emerald-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-emerald-100 bg-emerald-50/30">
                    <th className="text-left px-5 py-3 w-10">
                      <input type="checkbox" className="rounded border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed" disabled={averageCandidates.filter(c => c.status === 'Pending').length === 0} checked={selectedRows.length > 0 && averageCandidates.filter(c => c.status === 'Pending').length > 0 && averageCandidates.filter(c => c.status === 'Pending').every(c => selectedRows.includes(c.id))} onChange={(e) => e.target.checked ? setSelectedRows(prev => Array.from(new Set([...prev, ...averageCandidates.filter(c => c.status === 'Pending').map(c => c.id)]))) : setSelectedRows(prev => prev.filter(id => !averageCandidates.find(c => c.id === id)))} />
                    </th>
                    <th className="text-left px-5 py-3">Candidate</th>
                    <th className="text-left px-5 py-3">AI Score</th>
                    <th className="text-left px-5 py-3">Trust Signal</th>
                    <th className="text-left px-5 py-3">Risk Flag</th>
                    <th className="text-left px-5 py-3">Status</th>
                    <th className="text-right px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {averageCandidates.map(renderCandidateRow)}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Worst Candidates (< 75) */}
        {worstCandidates.length > 0 && (
          <div>
            <h2 className="font-display text-lg font-bold text-amber-700 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">trending_down</span> Weak Matches (&lt; 75%)
            </h2>
            <div className="border border-amber-200 rounded-xl overflow-hidden bg-white shadow-sm opacity-80 hover:opacity-100 transition-opacity">
              <table className="w-full">
                <thead>
                  <tr className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-amber-100 bg-amber-50/30">
                    <th className="text-left px-5 py-3 w-10">
                      <input type="checkbox" className="rounded border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed" disabled={worstCandidates.filter(c => c.status === 'Pending').length === 0} checked={selectedRows.length > 0 && worstCandidates.filter(c => c.status === 'Pending').length > 0 && worstCandidates.filter(c => c.status === 'Pending').every(c => selectedRows.includes(c.id))} onChange={(e) => e.target.checked ? setSelectedRows(prev => Array.from(new Set([...prev, ...worstCandidates.filter(c => c.status === 'Pending').map(c => c.id)]))) : setSelectedRows(prev => prev.filter(id => !worstCandidates.find(c => c.id === id)))} />
                    </th>
                    <th className="text-left px-5 py-3">Candidate</th>
                    <th className="text-left px-5 py-3">AI Score</th>
                    <th className="text-left px-5 py-3">Trust Signal</th>
                    <th className="text-left px-5 py-3">Risk Flag</th>
                    <th className="text-left px-5 py-3">Status</th>
                    <th className="text-right px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {worstCandidates.map(renderCandidateRow)}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {queue.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-[14px] bg-slate-50 border border-slate-200 rounded-2xl">
            No candidates match your current filters.
          </div>
        )}

      </div>

      {/* Candidate Profile Modal - Resume View */}
      {viewingCandidateId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-[#fcfcfc] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col relative animate-slide-up border border-slate-200">
            
            <div className="sticky top-0 bg-[#fcfcfc]/95 backdrop-blur-md border-b border-slate-200 p-4 flex items-center justify-between z-10 rounded-t-lg">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold tracking-widest uppercase rounded-full">
                  Original Resume View
                </span>
              </div>
              <button onClick={() => setViewingCandidateId(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors cursor-pointer text-slate-500 hover:text-slate-900">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-10 md:p-14 space-y-8 font-serif text-slate-800">
              {(() => {
                const p = globalCandidates.find(c => c.id === viewingCandidateId) || localCandidateProfile;
                return (
                  <div className="max-w-3xl mx-auto bg-white p-10 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 relative">
                    
                    {/* Header */}
                    <div className="text-center border-b-[3px] border-emerald-800 pb-6 mb-8">
                      <h1 className="text-4xl md:text-5xl font-bold text-slate-900 uppercase tracking-wide">{p.name}</h1>
                      <div className="text-[14px] md:text-[16px] text-emerald-700 mt-2 font-medium tracking-widest uppercase">
                        {p.title || 'Professional Candidate'}
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-[13px] text-slate-500 font-sans font-medium">
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">mail</span> {p.email}</span>
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">call</span> {p.phone || '+1 (555) 123-4567'}</span>
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">location_on</span> {p.location || 'San Francisco, CA'}</span>
                        {p.preferredLocation && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">map</span> Prefers: {p.preferredLocation}</span>}
                        {p.gender && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">person</span> {p.gender}</span>}
                        {p.dob && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">cake</span> DOB: {p.dob}</span>}
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="mb-8">
                      <h4 className="text-[14px] font-bold text-emerald-800 uppercase tracking-[0.2em] border-b border-slate-200 pb-2 mb-4">Professional Summary</h4>
                      <p className="text-[14px] leading-relaxed text-slate-700 whitespace-pre-wrap font-sans">
                        {p.bio || 'Experienced professional with a proven track record of success. Highly skilled in driving results, collaborating with cross-functional teams, and delivering high-quality solutions.'}
                      </p>
                    </div>

                    {/* Experience */}
                    <div className="mb-8">
                      <h4 className="text-[14px] font-bold text-emerald-800 uppercase tracking-[0.2em] border-b border-slate-200 pb-2 mb-4">Experience</h4>
                      <div className="text-[14px] leading-relaxed text-slate-700 whitespace-pre-wrap font-sans pl-2 border-l-2 border-emerald-100">
                        {p.experience ? p.experience.split('\n').map((line: string, i: number) => (
                          <div key={i} className="mb-2">{line}</div>
                        )) : (
                          <div className="italic text-slate-400">Experience details not available.</div>
                        )}
                      </div>
                    </div>

                    {/* Projects (if available) */}
                    {(p.projects && p.projects.length > 0) && (
                      <div className="mb-8">
                        <h4 className="text-[14px] font-bold text-emerald-800 uppercase tracking-[0.2em] border-b border-slate-200 pb-2 mb-4">Projects</h4>
                        <div className="space-y-3 font-sans">
                          {p.projects.map((proj: string, idx: number) => (
                            <div key={idx} className="text-[14px] text-slate-700 leading-relaxed bg-slate-50 p-3 rounded border border-slate-100">
                              • {proj}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    <div className="mb-8">
                      <h4 className="text-[14px] font-bold text-emerald-800 uppercase tracking-[0.2em] border-b border-slate-200 pb-2 mb-4">Education</h4>
                      <div className="text-[14px] leading-relaxed text-slate-700 whitespace-pre-wrap font-sans pl-2 border-l-2 border-emerald-100">
                        {p.education ? p.education.split('\n').map((line: string, i: number) => (
                          <div key={i} className="mb-2">{line}</div>
                        )) : (
                          <div className="italic text-slate-400">Education details not available.</div>
                        )}
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="mb-2">
                      <h4 className="text-[14px] font-bold text-emerald-800 uppercase tracking-[0.2em] border-b border-slate-200 pb-2 mb-4">Core Competencies</h4>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 font-sans text-[13.5px] text-slate-700 font-medium">
                        {p.skills.length > 0 ? p.skills.map((s: string) => (
                          <span key={s} className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                            {s}
                          </span>
                        )) : <span className="italic text-slate-400">No skills listed.</span>}
                      </div>
                    </div>

                  </div>
                );
              })()}
            </div>
            
            <div className="sticky bottom-0 bg-[#fcfcfc] border-t border-slate-200 p-4 flex justify-end rounded-b-lg">
              <button onClick={() => setViewingCandidateId(null)} className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-black transition-colors cursor-pointer shadow-sm text-[13px] tracking-wide">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
