import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function CandidateApplications() {
  const { applications, candidateProfile, jobs } = useApp();
  const navigate = useNavigate();

  const myApplications = applications.filter(a => a.candidateId === candidateProfile.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Applied': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Screening': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Shortlisted': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Interview Scheduled': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusSteps = (status: string) => {
    const allSteps = ['Applied', 'Screening', 'Shortlisted', 'MCQ Test', 'Interview Scheduled'];
    let mappedStatus = status;
    if (status === 'MCQ Test Pending' || status === 'MCQ Test Completed') mappedStatus = 'MCQ Test';
    let currentStepIndex = allSteps.indexOf(mappedStatus);
    
    if (status === 'Rejected') {
      return (
        <div className="flex items-center w-full mt-6 animate-fade-in">
          <div className="flex flex-col items-center flex-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2),0_4px_10px_rgba(239,68,68,0.3)] flex items-center justify-center relative z-10 transition-transform hover:scale-110">
              <span className="material-symbols-outlined text-[16px] text-white font-bold">close</span>
            </div>
            <span className="text-[12px] font-extrabold text-red-600 mt-3 tracking-wide">Rejected</span>
          </div>
        </div>
      );
    }

    if (status === 'Hired' || status === 'Interview Completed') {
      currentStepIndex = allSteps.length - 1;
    } else if (currentStepIndex === -1) {
      currentStepIndex = 0;
    }

    return (
      <div className="flex items-center w-full mt-6 relative">
        {/* 3D Track Background */}
        <div className="absolute left-[10%] right-[10%] top-4 h-1.5 bg-slate-100 rounded-full shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)] -z-0"></div>
        
        {/* 3D Track Fill */}
        <div 
          className="absolute left-[10%] top-4 h-1.5 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full shadow-[0_2px_6px_rgba(37,99,235,0.4)] transition-all duration-1000 ease-out -z-0" 
          style={{ width: `${(currentStepIndex / (allSteps.length - 1)) * 80}%` }}
        ></div>
        
        {allSteps.map((step, idx) => {
          const isCompleted = idx <= currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          
          return (
            <div key={step} className="flex flex-col items-center flex-1 relative z-10 group" style={{ animationDelay: `${idx * 150}ms` }}>
              <div className={`w-8 h-8 rounded-full shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.1)] border-2 border-white flex items-center justify-center transition-all duration-700 ease-in-out transform group-hover:scale-110 ${isCompleted ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' : 'bg-slate-200'}`}>
                {isCompleted && !isCurrent && <span className="material-symbols-outlined text-[16px] text-white font-bold drop-shadow-md animate-fade-in">check</span>}
                {isCurrent && <div className="w-3 h-3 bg-white rounded-full shadow-sm animate-pulse"></div>}
              </div>
              <span className={`text-[12px] font-bold mt-3 transition-colors duration-500 ${isCurrent ? 'text-emerald-600' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-8 font-sans pb-10">
      <div>
        <h1 className="font-display text-3xl font-bold text-emerald-900 tracking-tight">My Applications</h1>
        <p className="text-[14px] text-slate-500 mt-1">Track the status of your AI-matched job applications.</p>
      </div>

      {myApplications.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[32px] text-slate-300">work_history</span>
          </div>
          <h3 className="font-display text-xl font-bold text-emerald-900 mb-2">No Applications Yet</h3>
          <p className="text-slate-500 max-w-sm mb-6 text-[14px]">
            You haven't applied to any roles yet. Visit your dashboard to see your AI-matched active jobs and apply instantly.
          </p>
          <button 
            onClick={() => navigate('/candidate/dashboard')}
            className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-sm hover:bg-emerald-700 transition-colors"
          >
            View Active Jobs
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {myApplications.map(app => {
            const job = jobs.find(j => j.id === app.jobId);
            if (!job) return null;

            return (
              <div key={app.id} className={`bg-white border ${app.status === 'Rejected' ? 'border-red-100' : 'border-slate-200'} rounded-[24px] p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden`}>
                
                {app.status === 'Rejected' && (
                  <div className="absolute top-0 right-0 w-16 h-16 bg-red-50/50 rounded-bl-full flex items-start justify-end p-3 -z-0">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                  </div>
                )}

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10">
                  
                  {/* Job Info */}
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200 shrink-0">
 <span className=" text-[20px] font-bold text-emerald-900">
                        {app.company?.[0] || job.title[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-display text-[18px] font-bold text-emerald-900 leading-tight">
                        {job.title}
                      </h3>
                      <div className="text-[13px] font-semibold text-slate-500 mt-1 flex items-center gap-2">
                        <span>{app.company || 'Company'}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span>{job.location}</span>
                      </div>
                      <div className="text-[12px] text-slate-400 mt-2 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        Applied Recently
                      </div>
                    </div>
                  </div>

                  {/* Actions & Status Pill */}
                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <div className={`px-3 py-1.5 rounded-lg border text-[12px] font-bold ${getStatusColor(app.status)} flex items-center gap-1.5 shadow-sm`}>
                      {app.status === 'Rejected' && <span className="material-symbols-outlined text-[14px]">cancel</span>}
                      {app.status === 'Interview Scheduled' && <span className="material-symbols-outlined text-[14px]">event_available</span>}
                      {app.status}
                    </div>

                    {app.status === 'Shortlisted' && (
                      <button 
                        onClick={() => navigate(`/candidate/test/${app.id}`)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[12px] font-bold transition-all shadow-md mt-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">quiz</span>
                        Start MCQ Test
                      </button>
                    )}

                    {app.status === 'Interview Scheduled' && (
                      <button 
                        onClick={() => navigate('/candidate/interviews')}
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-900 hover:bg-slate-800 text-white rounded-xl text-[12px] font-bold transition-all shadow-md mt-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">videocam</span>
                        Join Interview
                      </button>
                    )}
                  </div>

                </div>

                {/* Timeline */}
                <div className="mt-8 pt-6 border-t border-slate-100/60">
                  {getStatusSteps(app.status)}
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
