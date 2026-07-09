import { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function SuperAdminGlobalCandidates() {
  const { globalCandidates, applications } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingCandidateId, setViewingCandidateId] = useState<string | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const handleSendEmail = async (candidate: any, statusType: string) => {
    try {
      setIsSendingEmail(true);
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidate_email: candidate.email,
          candidate_name: candidate.name,
          status: statusType,
          job_role: candidate.title || 'Professional Candidate',
          company_name: 'MatchIntel',
          action_url: 'https://matchintel.ai/dashboard'
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert(`Email successfully sent to ${candidate.email}!`);
      } else {
        alert('Failed to send email.');
      }
    } catch (error) {
      console.error("Failed to send email notification", error);
      alert('Error connecting to email service.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const filteredCandidates = globalCandidates.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-emerald-900 tracking-tight">Global Talent Pool</h1>
          <p className="text-[14px] text-slate-500 mt-1">
            Super Admin view of all candidates across all connected agencies and platforms.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white shadow-sm text-emerald-900 rounded-lg flex items-center px-3 py-2 border border-slate-200">
            <span className="material-symbols-outlined text-[18px] text-slate-500 mr-2">search</span>
            <input
              type="text"
              placeholder="Search talent..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-[13px] w-64 placeholder:text-slate-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-5">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center justify-between">
            <span>Total Candidates</span>
            <span className="material-symbols-outlined text-[18px] text-emerald-400">group</span>
          </div>
 <div className=" text-3xl font-extrabold text-emerald-900">{globalCandidates.length}</div>
        </div>
        <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-5">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center justify-between">
            <span>AI Verified Profiles</span>
            <span className="material-symbols-outlined text-[18px] text-green-400">verified</span>
          </div>
 <div className=" text-3xl font-extrabold text-emerald-900">
            {globalCandidates.filter(c => c.resumeParsed).length}
          </div>
        </div>
        <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-5">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center justify-between">
            <span>Active Applications</span>
            <span className="material-symbols-outlined text-[18px] text-purple-400">send</span>
          </div>
 <div className=" text-3xl font-extrabold text-emerald-900">
            {applications.length}
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-emerald-900 border-b border-slate-200">
            <tr className="text-[11px] font-semibold text-emerald-100 uppercase tracking-wider">
              <th className="px-5 py-3">Candidate</th>
              <th className="px-5 py-3">Role & Location</th>
              <th className="px-5 py-3">AI Score / Trust</th>
              <th className="px-5 py-3">Applications</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCandidates.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-slate-500 text-sm">
                  No candidates found in the global pool.
                </td>
              </tr>
            ) : (
              filteredCandidates.map(candidate => {
                const candidateApps = applications.filter(a => a.candidateId === candidate.id);
                return (
                  <tr key={candidate.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[12px] font-bold text-emerald-900 shrink-0">
                          {candidate.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-[13px] font-bold text-emerald-900">{candidate.name}</div>
                          <div className="text-[11px] text-slate-500">{candidate.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-[13px] font-medium text-slate-700">{candidate.title || 'Not specified'}</div>
                      <div className="text-[11px] text-slate-500">{candidate.location || 'Unknown'}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[13px] font-bold text-emerald-400">
                          {candidate.readinessScore || 0}/100 Match
                        </span>
                        {candidate.resumeParsed && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold uppercase">
                            <span className="material-symbols-outlined text-[12px]">verified</span> AI Parsed
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-[13px] font-medium text-slate-300">
                        {candidateApps.length} active
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button 
                        onClick={() => setViewingCandidateId(candidate.id)}
                        className="px-4 py-1.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded-lg text-[12px] font-semibold transition-colors cursor-pointer"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Candidate Profile Modal - Resume View */}
      {viewingCandidateId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-[#fcfcfc] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col relative animate-slide-up border border-slate-200">
            
            <div className="sticky top-0 bg-[#fcfcfc]/95 backdrop-blur-md border-b border-slate-200 p-4 flex items-center justify-between z-10 rounded-t-lg">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold tracking-widest uppercase rounded-full">
                  Candidate Resume
                </span>
              </div>
              <button onClick={() => setViewingCandidateId(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors cursor-pointer text-slate-500 hover:text-slate-900">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-10 md:p-14 space-y-8 font-serif text-slate-800">
              {(() => {
                const p = globalCandidates.find(c => c.id === viewingCandidateId);
                if (!p) return null;
                return (
                  <div className="max-w-3xl mx-auto bg-white p-10 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 relative">
                    
                    {/* Header */}
                    <div className="text-center border-b-[3px] border-emerald-800 pb-6 mb-8 relative">
                      {/* AI Match Score Badge */}
                      <div className="absolute top-0 right-0 flex flex-col items-end">
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2">
                          <span className="material-symbols-outlined text-emerald-800 text-[18px]">memory</span>
                          <span className="font-bold text-[14px]">AI Score: {p.readinessScore || 0}/100</span>
                        </div>
                        {p.resumeParsed && (
                           <div className="text-[10px] text-emerald-800 font-bold uppercase mt-1 tracking-wider">
                             Verified Profile
                           </div>
                        )}
                      </div>

                      <h1 className="text-4xl md:text-5xl font-bold text-slate-900 uppercase tracking-wide pr-32">{p.name}</h1>
                      <div className="text-[14px] md:text-[16px] text-emerald-900 mt-2 font-medium tracking-widest uppercase">
                        {p.title || 'Candidate Profile'}
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-[13px] text-slate-500 font-sans font-medium">
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">mail</span> {p.email}</span>
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">call</span> {p.phone || '+1 (555) 123-4567'}</span>
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">location_on</span> {p.location || 'Unknown'}</span>
                        {p.preferredLocation && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">map</span> Prefers: {p.preferredLocation}</span>}
                        {p.gender && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">person</span> {p.gender}</span>}
                        {p.dob && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">cake</span> DOB: {p.dob}</span>}
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="mb-8">
                      <h4 className="text-[14px] font-bold text-emerald-800 uppercase tracking-[0.2em] border-b border-slate-200 pb-2 mb-4">Professional Summary</h4>
                      <p className="text-[14px] leading-relaxed text-slate-700 whitespace-pre-wrap font-sans">
                        {p.bio || 'Summary not provided.'}
                      </p>
                    </div>

                    {/* Experience */}
                    <div className="mb-8">
                      <h4 className="text-[14px] font-bold text-emerald-800 uppercase tracking-[0.2em] border-b border-slate-200 pb-2 mb-4">Experience</h4>
                      <div className="text-[14px] leading-relaxed text-slate-700 whitespace-pre-wrap font-sans pl-2 border-l-2 border-emerald-100">
                        {p.experience ? p.experience.split('\n').map((line: string, i: number) => (
                          <div key={i} className="mb-2">{line}</div>
                        )) : (
                          <div className="italic text-slate-400">Experience not provided.</div>
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
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 inline-block"></span>
                            {s}
                          </span>
                        )) : <span className="italic text-slate-400">No skills listed.</span>}
                      </div>
                    </div>

                  </div>
                );
              })()}
            </div>
            
            <div className="sticky bottom-0 bg-[#fcfcfc] border-t border-slate-200 p-4 flex justify-between items-center rounded-b-lg">
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    const p = globalCandidates.find(c => c.id === viewingCandidateId);
                    if (p) handleSendEmail(p, 'approved');
                  }}
                  disabled={isSendingEmail}
                  className="px-4 py-2.5 bg-emerald-800 text-white font-bold rounded-lg hover:bg-emerald-900 transition-colors cursor-pointer shadow-sm text-[13px] tracking-wide flex items-center gap-1 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px]">check_circle</span> Approve
                </button>
                <button 
                  onClick={() => {
                    const p = globalCandidates.find(c => c.id === viewingCandidateId);
                    if (p) handleSendEmail(p, 'interview_scheduled');
                  }}
                  disabled={isSendingEmail}
                  className="px-4 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer shadow-sm text-[13px] tracking-wide flex items-center gap-1 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px]">calendar_month</span> Schedule
                </button>
                <button 
                  onClick={() => {
                    const p = globalCandidates.find(c => c.id === viewingCandidateId);
                    if (p) handleSendEmail(p, 'mcq_test');
                  }}
                  disabled={isSendingEmail}
                  className="px-4 py-2.5 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors cursor-pointer shadow-sm text-[13px] tracking-wide flex items-center gap-1 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px]">quiz</span> MCQ Test
                </button>
              </div>
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

