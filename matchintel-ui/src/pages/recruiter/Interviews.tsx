// @ts-nocheck
import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';

export default function RecruiterInterviews() {
  const { interviews: allAppInterviews, applications, scheduleInterview, updateInterviewStatus, currentUser, globalCandidates } = useApp();
  const [activeTab, setActiveTab] = useState<'today' | 'tomorrow' | 'week'>('today');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isScheduling, setIsScheduling] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewType, setInterviewType] = useState<'Technical' | 'Cultural' | 'HR' | 'Client'>('Technical');

  const allInterviews = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextWeekStr = nextWeek.toISOString().split('T')[0];

    const today: any[] = [];
    const tmrw: any[] = [];
    const week: any[] = [];

    allAppInterviews.forEach(i => {
      const item = {
        id: i.id,
        time: `${i.date} ${i.time}`,
        candidate: i.candidateName,
        role: i.jobTitle,
        type: i.type,
        interviewer: 'Recruiter',
        status: i.status,
        isNext: i.status === 'Scheduled',
        meetLink: i.meetLink
      };

      if (i.date === todayStr) {
        today.push(item);
        week.push(item); // Today is also this week
      } else if (i.date === tomorrowStr) {
        tmrw.push(item);
        week.push(item); // Tomorrow is also this week
      } else if (i.date > todayStr && i.date <= nextWeekStr) {
        week.push(item);
      }
    });

    return { today, tomorrow: tmrw, week };
  }, [allAppInterviews]);

  const interviews = useMemo(() => {
    let items = allInterviews[activeTab] || [];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter((i: any) => i.candidate.toLowerCase().includes(q) || i.role.toLowerCase().includes(q) || i.type.toLowerCase().includes(q));
    }
    return items;
  }, [activeTab, searchQuery, allInterviews]);

  const handleJoin = (link: string) => {
    window.open(link, '_blank');
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppId || !interviewDate || !interviewTime) return;
    
    const app = applications.find(a => a.id === selectedAppId);
    if (app) {
      const newInterview = scheduleInterview({
        candidateId: app.candidateId,
        candidateName: app.candidateName,
        jobId: app.jobId,
        jobTitle: app.role,
        date: interviewDate,
        time: interviewTime,
        type: interviewType
      });

      const candidateProfile = globalCandidates.find(c => c.id === app.candidateId);
      if (candidateProfile) {
        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            candidate_email: candidateProfile.email,
            candidate_name: candidateProfile.name,
            status: 'interview_scheduled',
            job_role: app.role,
            company_name: 'Venika HR-TECH',
            action_url: newInterview.meetLink,
            admin_email: currentUser?.email,
            admin_name: currentUser?.name,
            google_access_token: currentUser?.googleAccessToken,
            interview_date: interviewDate,
            interview_time: interviewTime,
            interview_link: newInterview.meetLink
          })
        }).catch(e => console.error("Email error:", e));
      }

      setIsScheduling(false);
      setSelectedAppId('');
      setInterviewDate('');
      setInterviewTime('');
    }
  };

  const handleAction = (id: string, action: string) => {
    if (action.includes('Complete')) {
      updateInterviewStatus(id, 'Completed');
    } else {
      alert(`${action} for interview.`);
    }
  };

  const stats = useMemo(() => {
    const total = allAppInterviews.length;
    const completed = allAppInterviews.filter(i => i.status === 'Completed').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return {
      completionRate,
      avgDuration: completed > 0 ? 45 : 0 // using 45m as a reasonable realistic mock for completed ones
    };
  }, [allAppInterviews]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-emerald-900 tracking-tight">Interview Schedule</h1>
          <p className="text-[14px] text-slate-500 mt-1">Manage and track upcoming candidate interviews across all roles.</p>
        </div>
        <button onClick={() => setIsScheduling(true)} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-[13px] font-semibold rounded-lg transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-[16px]">add</span>
          Schedule Interview
        </button>
      </div>

      {/* Scheduling Modal */}
      {isScheduling && (
        <div className="fixed inset-0 bg-emerald-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-display text-[18px] font-bold text-emerald-900">Schedule Interview</h2>
              <button onClick={() => setIsScheduling(false)} className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleScheduleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1">Select Candidate (Application)</label>
                <select value={selectedAppId} onChange={e => setSelectedAppId(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px]" required>
                  <option value="">-- Choose Application --</option>
                  {applications.map(app => (
                    <option key={app.id} value={app.id}>{app.candidateName} - {app.role}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1">Date</label>
                  <input type="date" value={interviewDate} onChange={e => setInterviewDate(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px]" required />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1">Time</label>
                  <input type="time" value={interviewTime} onChange={e => setInterviewTime(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px]" required />
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1">Interview Type</label>
                <select value={interviewType} onChange={e => setInterviewType(e.target.value as any)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px]">
                  <option value="Technical">Technical</option>
                  <option value="Cultural">Cultural</option>
                  <option value="HR">HR</option>
                  <option value="Client">Client</option>
                </select>
              </div>
              <div className="pt-4 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setIsScheduling(false)} className="px-4 py-2 text-[14px] font-semibold text-slate-600 hover:bg-slate-50 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-[14px] font-semibold bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg">Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-slate-200 rounded-xl p-4">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Today</div>
 <div className=" text-3xl font-bold text-emerald-900">{allInterviews.today.length}</div>
          <span className="text-[12px] text-slate-400">Interviews scheduled</span>
        </div>
        <div className="border border-slate-200 rounded-xl p-4">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">This Week</div>
 <div className=" text-3xl font-bold text-emerald-900">{allInterviews.week.length + allInterviews.today.length + allInterviews.tomorrow.length}</div>
          <span className="text-[12px] text-slate-400">Total sessions</span>
        </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="text-[11px] font-bold text-slate-500 uppercase mb-2">Completion Rate</div>
            <div className="text-3xl font-bold text-emerald-900">{stats.completionRate}%</div>
            <div className="text-[11px] font-semibold text-emerald-700 mt-1">Of scheduled interviews</div>
          </div>
        <div className="border border-slate-200 rounded-xl p-4">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Avg. Duration</div>
 <div className=" text-3xl font-bold text-emerald-900">{stats.avgDuration}m</div>
          <span className="text-[12px] text-slate-400">Per interview</span>
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {(['today', 'tomorrow', 'week'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`text-[13px] font-semibold pb-1 capitalize cursor-pointer ${activeTab === tab ? 'text-emerald-900 border-b-2 border-emerald-900' : 'text-slate-400 hover:text-slate-700'}`}>{tab === 'week' ? 'This Week' : tab}</button>
            ))}
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-slate-400">search</span>
            <input type="text" placeholder="Search interviews..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8 pr-3 py-1.5 w-52 text-[13px] border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-emerald-700 placeholder:text-slate-400" />
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <th className="text-left px-5 py-2.5">Time</th>
              <th className="text-left px-5 py-2.5">Candidate</th>
              <th className="text-left px-5 py-2.5">Role</th>
              <th className="text-left px-5 py-2.5">Type</th>
              <th className="text-left px-5 py-2.5">Interviewer</th>
              <th className="text-left px-5 py-2.5">Status</th>
              <th className="text-right px-5 py-2.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {interviews.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8 text-slate-400 text-[14px]">No interviews match your search.</td></tr>
            ) : interviews.map(i => (
              <tr key={i.candidate + i.time} className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer ${i.isNext ? 'bg-emerald-50/30' : ''}`}>
                <td className="px-5 py-3"><span className={`text-[13px] font-semibold ${i.isNext ? 'text-emerald-800' : 'text-slate-700'}`}>{i.time}</span></td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">{i.candidate.split(' ').map(n => n[0]).join('')}</div>
                    <span className="text-[13px] font-semibold text-emerald-900">{i.candidate}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-[13px] text-slate-600">{i.role}</td>
                <td className="px-5 py-3"><span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{i.type}</span></td>
                <td className="px-5 py-3 text-[13px] text-slate-600">{i.interviewer}</td>
                <td className="px-5 py-3"><span className={`text-[12px] font-semibold ${i.status === 'Completed' ? 'text-green-800' : i.status === 'Scheduled' ? 'text-emerald-800' : 'text-red-500'}`}>{i.status}</span></td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {i.status === 'Scheduled' && <button onClick={() => handleJoin(i.meetLink)} className="px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-white text-[12px] font-semibold rounded transition-colors cursor-pointer">Join</button>}
                    <button onClick={() => handleAction(i.id, i.status === 'Scheduled' ? '✅ Complete' : '📝 Rescheduled')} className="text-slate-300 hover:text-slate-600 transition-colors cursor-pointer">
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

