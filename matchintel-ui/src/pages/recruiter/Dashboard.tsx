import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const { jobs, applications, aiScreenings } = useApp();

  const activeJobsCount = jobs.filter(j => j.status === 'Active').length;
  const pipelineCount = applications.length;
  const screenedCount = aiScreenings.length;
  const highMatchCount = aiScreenings.filter(s => s.aiScore >= 80).length;
  const interviewCount = applications.filter(a => a.status === 'Interview Scheduled' || a.status === 'Shortlisted').length;
  const pendingScreenings = aiScreenings.filter(s => s.status === 'Pending');

  // Compute top skills from active jobs
  const skillCounts: Record<string, number> = {};
  jobs.forEach(job => {
    if (job.requiredSkills) {
      job.requiredSkills.forEach(skill => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    }
  });
  
  const topSkills = Object.entries(skillCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map((entry, index) => {
      const colors = ['bg-emerald-700', 'bg-emerald-800', 'bg-green-700', 'bg-amber-500', 'bg-purple-500'];
      const maxCount = Math.max(...Object.values(skillCounts), 1);
      return {
        skill: entry[0],
        val: Math.round((entry[1] / maxCount) * 100),
        color: colors[index % colors.length]
      };
    });

  // If no jobs/skills, provide fallback
  if (topSkills.length === 0) {
    topSkills.push(
      { skill: 'React', val: 0, color: 'bg-slate-300' },
      { skill: 'Node.js', val: 0, color: 'bg-slate-300' }
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans pb-10">
      
      {/* Page Header */}
      <div className="pt-2">
        <h1 className="font-display text-[32px] font-extrabold text-emerald-900 tracking-tight leading-tight mb-2">Dashboard</h1>
        <p className="text-[15px] text-slate-500 font-medium">Overview of your recruitment operations and AI-powered insights.</p>
      </div>

      {/* Top 2 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Active Requisitions */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group animate-fade-in">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[20px] text-emerald-800">work</span>
                <span className="text-[14px] font-bold text-slate-500 uppercase tracking-widest">Active Requisitions</span>
              </div>
 <div className=" text-4xl font-extrabold text-emerald-900 leading-none">{activeJobsCount}</div>
              <div className="text-[14px] font-medium text-slate-500 mt-2 flex items-center gap-1.5 px-1 w-fit">
                Open roles on your board
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl text-emerald-700">receipt_long</span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/recruiter/jobs')}
            className="w-full py-3.5 bg-emerald-900 hover:bg-black text-white rounded-xl text-[14px] font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Create New Req
          </button>
        </div>

        {/* Talent Pipeline */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[20px] text-emerald-800">groups</span>
                <span className="text-[14px] font-bold text-slate-500 uppercase tracking-widest">Talent Pipeline</span>
              </div>
 <div className=" text-4xl font-extrabold text-emerald-900 leading-none">{pipelineCount}</div>
              <div className="text-[14px] font-medium text-slate-500 mt-2 flex items-center gap-1.5 px-1 w-fit">
                Total applicants
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl text-indigo-500">group_add</span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/recruiter/candidates')}
            className="w-full py-3.5 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-[14px] font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            View Pipeline
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
        
      </div>

      {/* Analytics & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* AI Funnel */}
        <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm animate-fade-in" style={{ animationDelay: '200ms' }}>
          <h2 className="font-display text-[18px] font-bold text-emerald-900 mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-600">filter_alt</span>
            AI Recruitment Funnel
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-[13px] font-semibold text-slate-700 mb-1">
                <span>Total Applicants Sourced</span>
                <span>{pipelineCount}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 shadow-inner">
                <div className="bg-gradient-to-r from-slate-300 to-slate-400 h-2.5 rounded-full transition-all duration-1000 shadow-sm" style={{ width: pipelineCount > 0 ? '100%' : '0%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[13px] font-semibold text-slate-700 mb-1">
                <span>AI Auto-Screened</span>
                <span>{screenedCount}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 shadow-inner">
                <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 h-2.5 rounded-full transition-all duration-1000 shadow-sm" style={{ width: pipelineCount > 0 ? `${(screenedCount / pipelineCount) * 100}%` : '0%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[13px] font-semibold text-slate-700 mb-1">
                <span>High Match (&gt;80%)</span>
                <span>{highMatchCount}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 shadow-inner">
                <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 h-2.5 rounded-full transition-all duration-1000 shadow-sm" style={{ width: screenedCount > 0 ? `${(highMatchCount / screenedCount) * 100}%` : '0%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[13px] font-semibold text-slate-700 mb-1">
                <span>Interview Scheduled / Shortlisted</span>
                <span>{interviewCount}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 shadow-inner">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2.5 rounded-full transition-all duration-1000 shadow-sm" style={{ width: highMatchCount > 0 ? `${(interviewCount / highMatchCount) * 100}%` : '0%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Skills in Demand */}
        <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm animate-fade-in" style={{ animationDelay: '300ms' }}>
          <h2 className="font-display text-[18px] font-bold text-emerald-900 mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-600">insights</span>
            Top Skills in Active Jobs
          </h2>
          <div className="space-y-4">
            {topSkills.map(item => (
              <div key={item.skill} className="flex items-center gap-3">
                <div className="w-20 text-[13px] font-semibold text-slate-700">{item.skill}</div>
                <div className="flex-1 bg-slate-100 rounded-full h-2 shadow-inner">
                  <div className={`${item.color.replace('bg-', 'bg-gradient-to-r from-').replace('500', '400').replace('600', '500')} to-${item.color.replace('bg-', '')} h-2 rounded-full shadow-sm`} style={{ width: `${item.val}%` }}></div>
                </div>
                <div className="w-8 text-right text-[12px] font-bold text-slate-400">{item.val}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Urgent AI Screening Tasks */}
      <div className="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[24px] text-emerald-800">assignment_late</span>
            <h2 className="font-display text-[20px] font-bold text-emerald-900">Urgent AI Screening Tasks</h2>
          </div>
          {pendingScreenings.length > 0 && (
            <div className="flex items-center gap-2 bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-full text-[13px] font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              {pendingScreenings.length} candidates awaiting final review
            </div>
          )}
        </div>

        <div className="divide-y divide-slate-100">
          
          {pendingScreenings.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-medium">No pending screening tasks. You're all caught up!</div>
          ) : (
            pendingScreenings.slice(0, 3).map((task) => (
              <div key={task.id} className="p-6 flex items-center justify-between hover:bg-slate-50/80 transition-colors group">
                <div className="flex items-center gap-5">
 <div className="w-12 h-12 rounded-full bg-emerald-900 text-white flex items-center justify-center text-[16px] font-extrabold shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                    {task.candidateName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-display text-[16px] font-bold text-emerald-900">{task.candidateName}</h3>
                    <p className="text-[13px] font-medium text-slate-500">{task.role}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2.5 py-1 ${task.aiScore >= 90 ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'} border rounded-lg text-[12px] font-bold flex items-center gap-1 shadow-sm`}>
                      <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                      AI Match: {task.aiScore}%
                    </span>
                    <span className="text-[12px] font-medium text-slate-500">Ready for review</span>
                  </div>
                  <button 
                    onClick={() => navigate('/recruiter/ai-screening')}
                    className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-[13px] font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    Review Profile
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}

