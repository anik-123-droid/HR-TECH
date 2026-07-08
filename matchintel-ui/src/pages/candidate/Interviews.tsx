import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';

export default function CandidateInterviews() {
  const { interviews: allAppInterviews, candidateProfile } = useApp();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');

  const interviews = useMemo(() => {
    const myInterviews = allAppInterviews.filter(i => i.candidateId === candidateProfile.id);
    
    if (activeTab === 'upcoming') {
      return myInterviews.filter(i => i.status === 'Scheduled');
    }
    if (activeTab === 'completed') {
      return myInterviews.filter(i => i.status === 'Completed');
    }
    return myInterviews.filter(i => i.status === 'Cancelled');
  }, [allAppInterviews, candidateProfile.id, activeTab]);

  const handleAction = (company: string, action: string) => {
    alert(`${action} interview for ${company}.\n\n(Backend sync required)`);
  };

  const myAllInterviews = allAppInterviews.filter(i => i.candidateId === candidateProfile.id);
  const upcomingCount = myAllInterviews.filter(i => i.status === 'Scheduled').length;
  const completedCount = myAllInterviews.filter(i => i.status === 'Completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-emerald-900 tracking-tight">My Interviews</h1>
        <p className="text-[14px] text-slate-500 mt-1">Upcoming and past interview sessions across your applications.</p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-3 gap-4">
        <div className="border border-slate-200 rounded-xl p-4">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Upcoming</div>
 <div className=" text-3xl font-bold text-emerald-900">{upcomingCount}</div>
          <span className="text-[12px] text-slate-400">Next 7 days</span>
        </div>
        <div className="border border-slate-200 rounded-xl p-4">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Completed</div>
 <div className=" text-3xl font-bold text-green-600">{completedCount}</div>
          <span className="text-[12px] text-slate-400">This month</span>
        </div>
        <div className="border border-slate-200 rounded-xl p-4">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pass Rate</div>
 <div className=" text-3xl font-bold text-emerald-600">87%</div>
          <span className="text-[12px] font-semibold text-emerald-600">Excellent</span>
        </div>
      </div>

      {/* Interviews Table */}
      <div className="border border-slate-200 rounded-xl">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-3">
          {(['upcoming', 'completed', 'cancelled'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[13px] font-semibold pb-1 capitalize cursor-pointer ${activeTab === tab ? 'text-emerald-900 border-b-2 border-emerald-900' : 'text-slate-400 hover:text-slate-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <table className="w-full">
          <thead>
            <tr className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <th className="text-left px-5 py-2.5">Company & Role</th>
              <th className="text-left px-5 py-2.5">Type</th>
              <th className="text-left px-5 py-2.5">Date & Time</th>
              <th className="text-left px-5 py-2.5">Interviewer</th>
              <th className="text-left px-5 py-2.5">Status</th>
              <th className="text-right px-5 py-2.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {interviews.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-slate-400 text-[14px]">No {activeTab} interviews.</td></tr>
            ) : interviews.map(i => (
              <tr key={i.id} className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors`}>
                <td className="px-5 py-3">
                  <div className="text-[14px] font-semibold text-emerald-900">{i.jobTitle}</div>
                  <div className="text-[12px] text-slate-400">RecruitAI Partner</div>
                </td>
                <td className="px-5 py-3">
                  <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{i.type}</span>
                </td>
                <td className="px-5 py-3">
                  <div className="text-[13px] font-semibold text-emerald-900">{i.date}</div>
                  <div className="text-[12px] text-slate-400">{i.time}</div>
                </td>
                <td className="px-5 py-3 text-[13px] text-slate-600">Pending</td>
                <td className="px-5 py-3">
                  <span className={`text-[12px] font-semibold ${i.status === 'Completed' ? 'text-green-600' : i.status === 'Scheduled' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {i.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {activeTab === 'upcoming' && (
                      <button onClick={() => window.open(i.meetLink, '_blank')} className={`px-3 py-1 text-[12px] font-semibold rounded transition-colors flex items-center gap-1.5 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white`}>
                        <span className="material-symbols-outlined text-[14px]">videocam</span> Join Call
                      </button>
                    )}
                    <button onClick={() => handleAction('Role', 'Options')} className="text-slate-300 hover:text-slate-600 transition-colors cursor-pointer">
                      <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
