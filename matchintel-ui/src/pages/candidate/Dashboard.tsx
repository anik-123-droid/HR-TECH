import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { parseResumeFromPdf } from '../../utils/pdfParser';

export default function CandidateDashboard() {
  const navigate = useNavigate();
  const { currentUser, candidateProfile, jobs, applyForJob, applications, updateCandidateProfile } = useApp();

  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<{id: string, title: string} | null>(null);
  const [modalStep, setModalStep] = useState(0); // 0=upload, 1=loading, 2=review
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState({
    expectedSalary: '',
    noticePeriod: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeJobs = jobs.filter(j => j.status === 'Active');
  const myApplications = applications.filter(a => a.candidateId === candidateProfile.id);

  const calculateProfileCompleteness = () => {
    let score = 0;
    if (candidateProfile.name) score += 10;
    if (candidateProfile.email) score += 10;
    if (candidateProfile.phone) score += 10;
    if (candidateProfile.experience) score += 20;
    if (candidateProfile.education) score += 15;
    if (candidateProfile.skills.length > 0) score += 20;
    if (candidateProfile.resumeParsed) score += 15;
    return score;
  };

  const profileScore = calculateProfileCompleteness();

  const handleApplyClick = (jobId: string, jobTitle: string) => {
    const hasApplied = myApplications.some(a => a.jobId === jobId);
    if (hasApplied) {
      alert(`You have already applied for ${jobTitle}`);
      return;
    }
    setSelectedJob({ id: jobId, title: jobTitle });
    setModalStep(2);
    setFormData({ expectedSalary: '', noticePeriod: '' });
    setApplyModalOpen(true);
  };

  const processFile = async (selectedFile?: File) => {
    if (!selectedFile) return;
    setModalStep(1);
    
    // Parse real data from PDF
    const parsedData = await parseResumeFromPdf(selectedFile);
    
    // Auto update candidate profile with new parsed data
    updateCandidateProfile({
      ...candidateProfile,
      name: parsedData.name || candidateProfile.name,
      email: parsedData.email || candidateProfile.email,
      phone: parsedData.phone || candidateProfile.phone,
      experience: parsedData.experience || candidateProfile.experience,
      skills: Array.from(new Set([...candidateProfile.skills, ...parsedData.skills])),
      readinessScore: parsedData.atsScore || candidateProfile.readinessScore
    });
    
    setTimeout(() => {
      setModalStep(2);
    }, 500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) processFile(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) processFile(e.dataTransfer.files[0]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const confirmApply = async () => {
    if (selectedJob && candidateProfile) {
      updateCandidateProfile({
        ...candidateProfile,
        expectedSalary: formData.expectedSalary,
        noticePeriod: formData.noticePeriod
      });
      await applyForJob(selectedJob.id);
      alert(`✅ Successfully applied for: ${selectedJob.title}`);
      setApplyModalOpen(false);
      setSelectedJob(null);
    }
  };

  return (
    <div className="space-y-10 font-sans pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <div>
          <h3 className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest mb-1.5">Candidate Portal</h3>
          <h1 className="font-display text-[32px] font-extrabold text-emerald-900 tracking-tight leading-tight">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-[15px] text-slate-500 mt-1 font-medium">
            There are {activeJobs.length} active roles you can apply for today
          </p>
        </div>
        <button 
          onClick={() => navigate('/candidate/resume-upload')}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-[14px] font-bold transition-all shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 self-start"
        >
          <span className="material-symbols-outlined text-[20px]">upload_file</span>
          Update Resume
        </button>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Completeness */}
        <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm flex items-center gap-6 relative overflow-hidden group hover:border-slate-200 transition-colors cursor-pointer">
          <div className="relative w-[88px] h-[88px] shrink-0">
            <svg className="w-full h-full -rotate-90 drop-shadow-md" viewBox="0 0 120 120">
              <defs>
                <linearGradient id="green3DGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <filter id="shadow3D" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.3" />
                </filter>
              </defs>
              <circle cx="60" cy="60" r="50" fill="none" stroke="#f1f5f9" strokeWidth="12" style={{ filter: 'drop-shadow(inset 2px 2px 4px rgba(0,0,0,0.1))' }} />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="url(#green3DGradient)"
                strokeWidth="12"
                strokeDasharray="314"
                strokeDashoffset={314 - (314 * profileScore) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                filter="url(#shadow3D)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
 <span className=" text-[22px] font-extrabold text-emerald-900">{profileScore}%</span>
            </div>
          </div>
          <div>
            <div className="text-[13px] text-slate-500 font-medium mb-1">Profile Completeness</div>
 <div className=" text-[28px] font-bold text-emerald-900 leading-none mb-2">{profileScore}%</div>
            <div className="text-[13px] font-medium text-emerald-800 hover:underline" onClick={() => navigate('/candidate/profile')}>Complete your profile</div>
          </div>
        </div>

        {/* Active Applications */}
        <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm relative overflow-hidden group hover:border-slate-200 transition-colors cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">work_outline</span>
            </div>
            <div className="flex items-center gap-1 text-[13px] font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              +3
            </div>
          </div>
          <div className="text-[13px] text-slate-500 font-medium mb-1">Active Applications</div>
 <div className=" text-[32px] font-bold text-emerald-900 leading-none mb-2">{myApplications.length}</div>
          <div className="text-[13px] text-slate-500">{myApplications.filter(a => a.status === 'Interview Scheduled').length} in interview stage</div>
        </div>

        {/* Profile Views */}
        <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm relative overflow-hidden group hover:border-slate-200 transition-colors cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">visibility</span>
            </div>
            <div className="flex items-center gap-1 text-[13px] font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              +24%
            </div>
          </div>
          <div className="text-[13px] text-slate-500 font-medium mb-1">Profile AI Score</div>
 <div className=" text-[32px] font-bold text-emerald-900 leading-none mb-2">{candidateProfile.readinessScore || 0}/100</div>
          <div className="text-[13px] text-slate-500">Based on resume & skills</div>
        </div>

      </div>

      {/* Recommended AI Matches */}
      <div>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-display text-[20px] font-bold text-emerald-900 mb-1">Active Job Requirements</h2>
            <p className="text-[13px] text-slate-500 font-medium">Apply directly to open positions matching your profile.</p>
          </div>
          <button 
            onClick={() => navigate('/candidate/applications')}
            className="text-[13px] font-bold text-emerald-800 hover:text-emerald-900 hover:underline flex items-center gap-1"
          >
            View your applications <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        {activeJobs.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-10 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4">
              <span className="material-symbols-outlined text-[24px] text-slate-400">work_off</span>
            </div>
            <h3 className="text-[16px] font-bold text-emerald-900 mb-1">No Active Jobs</h3>
            <p className="text-[14px] text-slate-500">There are currently no active job requirements posted by the admin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {activeJobs.map((job) => {
              const hasApplied = myApplications.some(a => a.jobId === job.id);
              
              return (
                <div key={job.id} className="relative bg-white border-2 border-emerald-200 hover:border-emerald-400 rounded-[24px] p-6 shadow-sm flex flex-col group hover:shadow-md transition-all overflow-hidden z-10">
                  {/* Subtle top gradient background */}
                  <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-emerald-50/50 to-transparent -z-10"></div>
                  
                  <div className="flex items-start justify-between mb-5">
 <div className="w-12 h-12 bg-white border border-slate-100 rounded-full flex items-center justify-center text-[18px] font-bold text-emerald-900 shadow-sm">
                      {job.title[0]}
                    </div>
                    <div className="flex items-center gap-1 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full text-[12px] font-bold shadow-sm">
                      <span className="material-symbols-outlined text-[14px]">work</span>
                      {job.employmentType}
                    </div>
                  </div>

                  <div className="mb-4 flex-1">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{job.dept}</div>
                    <h3 className="font-display text-[18px] font-bold text-emerald-900 leading-tight mb-4">{job.title}</h3>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {job.requiredSkills?.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-emerald-50/50 border border-emerald-100/50 text-emerald-900 rounded-lg text-[12px] font-semibold">
                          {tag}
                        </span>
                      ))}
                      {job.requiredSkills.length > 3 && (
                        <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-[12px] font-semibold">
                          +{job.requiredSkills.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[13px] text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                        {job.location}
                      </div>
                      <div className="font-bold text-emerald-900">{job.salary}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleApplyClick(job.id, job.title)}
                    disabled={hasApplied || !candidateProfile.resumeParsed}
                    title={!candidateProfile.resumeParsed ? "Please upload your resume first" : ""}
                    className={`w-full py-3.5 rounded-xl text-[14px] font-bold transition-all shadow-sm flex items-center justify-center gap-2 
                      ${hasApplied || !candidateProfile.resumeParsed
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                        : 'bg-emerald-800 hover:bg-emerald-900 text-white group-hover:shadow-[0_4px_12px_rgba(37,99,235,0.2)]'}`}
                  >
                    {hasApplied ? (
                      <>
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        Applied
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                        Apply Now
                        <span className="material-symbols-outlined text-[16px] ml-1">arrow_outward</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Quick Apply Modal */}
      {applyModalOpen && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-emerald-900/40 backdrop-blur-md" onClick={() => setApplyModalOpen(false)}></div>
          
          <div className="bg-white rounded-3xl w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-display text-[20px] font-bold text-emerald-900">Quick Apply via AI</h3>
                <p className="text-[14px] text-slate-500 font-medium">Applying for {selectedJob.title}</p>
              </div>
              <button onClick={() => setApplyModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors text-slate-500">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {modalStep === 0 && (
                <div className="animate-in fade-in duration-300">
                  <h4 className="text-[15px] font-bold text-emerald-900 mb-4">Upload Resume to Auto-Fill Application</h4>
                  <div
                    className={`border-2 border-dashed rounded-[20px] p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                      dragActive ? 'border-emerald-700 bg-emerald-50' : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.doc,.docx" className="hidden" />
                    <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-[28px] text-emerald-800">cloud_upload</span>
                    </div>
                    <h5 className="font-bold text-[16px] text-emerald-900 mb-1">Drag and drop your resume</h5>
                    <p className="text-[13px] text-slate-500 mb-5">or click to browse files</p>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-5 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors text-[13px]"
                    >
                      Browse Files
                    </button>
                  </div>
                </div>
              )}

              {modalStep === 1 && (
                <div className="py-12 flex flex-col items-center justify-center animate-in fade-in duration-300">
                  <div className="relative w-16 h-16 mb-5">
                    <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-emerald-800 rounded-full border-t-transparent animate-spin"></div>
                    <span className="material-symbols-outlined absolute inset-0 flex items-center justify-center text-emerald-800 text-[24px]">auto_awesome</span>
                  </div>
                  <h4 className="font-display text-[18px] font-bold text-emerald-900 mb-2">Analyzing Resume...</h4>
                  <p className="text-[14px] text-slate-500 font-medium">Extracting information for auto-fill</p>
                </div>
              )}

              {modalStep === 2 && (
                <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-6">
                  <div className="pt-2">
                    <h4 className="text-[14px] font-bold text-emerald-900 mb-4">Application Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Expected Salary *</label>
                        <input type="number" min="0" value={formData.expectedSalary} onChange={e => setFormData({...formData, expectedSalary: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] text-emerald-900 focus:outline-none focus:border-emerald-700" placeholder="e.g. 120000" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Notice Period *</label>
                        <input type="number" min="0" value={formData.noticePeriod} onChange={e => setFormData({...formData, noticePeriod: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] text-emerald-900 focus:outline-none focus:border-emerald-700" placeholder="e.g. 30" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 mt-auto">
              <button 
                onClick={() => setApplyModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-[14px] text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              {modalStep === 2 && (
                <button 
                  onClick={confirmApply}
                  disabled={!formData.expectedSalary || !formData.noticePeriod}
                  className={`px-5 py-2.5 rounded-xl font-bold text-[14px] text-white transition-all shadow-sm
                    ${(!formData.expectedSalary || !formData.noticePeriod) 
                      ? 'bg-slate-800/50 cursor-not-allowed' 
                      : 'bg-emerald-900 hover:bg-black cursor-pointer'}`}
                >
                  Submit Application
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

