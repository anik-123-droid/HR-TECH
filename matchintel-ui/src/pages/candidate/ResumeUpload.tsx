import { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { parseResumeFromPdf } from '../../utils/pdfParser';

export default function CandidateResumeUpload() {
  const { updateCandidateProfile, candidateProfile } = useApp();
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  
  // 0: idle, 1: uploading/parsing, 2: parsed
  const [parseStep, setParseStep] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    preferredLocation: '',
    dob: '',
    gender: '',
    age: '',
    experience: '',
    education: '',
    projects: [] as string[],
    skills: [] as string[],
    softSkills: [] as string[],
    atsScore: 0,
    expectedSalary: '',
    noticePeriod: ''
  });

  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData(prev => ({...prev, age: age > 0 ? age.toString() : ''}));
    } else {
      setFormData(prev => ({...prev, age: ''}));
    }
  }, [formData.dob]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (selectedFile?: File) => {
    if (!selectedFile) return;
    setParseStep(1); 
    
    // Parse real data from PDF
    const parsedData = await parseResumeFromPdf(selectedFile);
    
    // Small delay for smooth UX transition
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        name: parsedData.name || prev.name,
        email: parsedData.email || prev.email,
        phone: parsedData.phone || prev.phone,
        experience: parsedData.experience || prev.experience,
        education: parsedData.education || prev.education,
        projects: parsedData.projects || prev.projects,
        skills: parsedData.skills || prev.skills,
        softSkills: parsedData.softSkills || prev.softSkills,
        atsScore: parsedData.atsScore || prev.atsScore,
      }));
      setParseStep(2);
    }, 500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleConfirm = () => {
    updateCandidateProfile({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      preferredLocation: formData.preferredLocation,
      dob: formData.dob,
      gender: formData.gender,
      experience: formData.experience,
      education: formData.education,
      projects: formData.projects,
      skills: Array.from(new Set([...formData.skills, ...formData.softSkills])),
      readinessScore: formData.atsScore > 0 ? formData.atsScore : candidateProfile.readinessScore,
      resumeParsed: true
    });
    alert('✅ Profile successfully synced with parsed data!');
    navigate('/candidate/profile');
  };

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(skillInput.trim())) {
        setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string, isSoft = false) => {
    if (isSoft) {
      setFormData({ ...formData, softSkills: formData.softSkills.filter(s => s !== skill) });
    } else {
      setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans pb-10">
      
      {/* Page Header */}
      <div className="pt-2">
        <h1 className="font-display text-[32px] font-extrabold text-emerald-900 tracking-tight leading-tight mb-2">AI Resume Import</h1>
        <p className="text-[15px] text-slate-500 font-medium">Upload your resume and our neural engine will build your profile.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-sm flex flex-col relative">
        
        {/* Upload Zone inside the form */}
        <div
          className={`border-b-2 border-dashed p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
            dragActive ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 hover:bg-slate-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleChange}
            className="hidden"
          />
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-[28px] text-emerald-600">
              cloud_upload
            </span>
          </div>
          <h3 className="font-display text-[18px] font-bold text-emerald-900 mb-1">
            Drag and drop your resume here or click to browse
          </h3>
          <p className="text-[12px] font-semibold text-slate-400">Supports: PDF, DOCX (Max 5MB)</p>
        </div>

        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 bg-slate-50 relative z-10">
          <h2 className="font-display text-[18px] font-bold text-emerald-900">Profile Details</h2>
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">
              {parseStep === 0 ? 'Ready to parse' : parseStep === 1 ? '✨ Parsing Resume...' : 'Parsed successfully'}
            </span>
            <div className={`w-2.5 h-2.5 rounded-full ${parseStep === 0 ? 'bg-slate-300' : parseStep === 1 ? 'bg-amber-400 animate-pulse' : 'bg-green-500'}`} />
          </div>
        </div>
        
        <div className="p-6 flex-1 bg-white space-y-6 relative">
          
          {/* Loading Overlay */}
          {parseStep === 1 && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center animate-in fade-in duration-300">
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
                <span className="material-symbols-outlined absolute inset-0 flex items-center justify-center text-emerald-600 text-[24px]">auto_awesome</span>
              </div>
              <h3 className="font-display text-[18px] font-bold text-emerald-900 mb-2">Analyzing Document...</h3>
              <p className="text-[14px] text-slate-500 font-medium">Extracting skills, experience, and metadata</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="space-y-1.5 lg:col-span-1">
              <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] text-emerald-900 focus:outline-none focus:border-emerald-500 bg-white transition-all" />
            </div>
            <div className="space-y-1.5 lg:col-span-1">
              <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] text-emerald-900 focus:outline-none focus:border-emerald-500 bg-white transition-all" />
            </div>
            <div className="space-y-1.5 lg:col-span-1">
              <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Mobile Phone</label>
              <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] text-emerald-900 focus:outline-none focus:border-emerald-500 bg-white transition-all" />
            </div>
            
            <div className="space-y-1.5 lg:col-span-1">
              <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Location</label>
              <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] text-emerald-900 focus:outline-none focus:border-emerald-500 bg-white transition-all" />
            </div>
            <div className="space-y-1.5 lg:col-span-1">
              <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Preferred Location</label>
              <input type="text" value={formData.preferredLocation} onChange={e => setFormData({...formData, preferredLocation: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] text-emerald-900 focus:outline-none focus:border-emerald-500 bg-white transition-all" />
            </div>
            <div className="space-y-1.5 lg:col-span-1">
              <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Gender</label>
              <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] text-emerald-900 focus:outline-none focus:border-emerald-500 bg-white transition-all">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            
            <div className="space-y-1.5 lg:col-span-1">
              <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Date of Birth</label>
              <input type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] text-emerald-900 focus:outline-none focus:border-emerald-500 bg-white transition-all" />
            </div>
            <div className="space-y-1.5 lg:col-span-1">
              <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Age (Auto-calculated)</label>
              <input type="text" value={formData.age} readOnly className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] text-slate-500 bg-slate-50 cursor-not-allowed transition-all" />
            </div>
            <div className="hidden lg:block lg:col-span-1"></div>

            <div className="space-y-1.5 md:col-span-2 lg:col-span-3">
              <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Experience Snippet</label>
              <textarea rows={3} value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] text-emerald-900 focus:outline-none focus:border-emerald-500 bg-white transition-all resize-none" placeholder="Experience details..." />
            </div>
            
            <div className="space-y-1.5 md:col-span-2 lg:col-span-3">
              <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Education</label>
              <textarea rows={2} value={formData.education} onChange={e => setFormData({...formData, education: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] text-emerald-900 focus:outline-none focus:border-emerald-500 bg-white transition-all resize-none" placeholder="Education details..." />
            </div>
            
            <div className="space-y-1.5 md:col-span-2 lg:col-span-3">
              <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Projects</label>
              <textarea rows={3} value={formData.projects.join('\n\n')} onChange={e => setFormData({...formData, projects: e.target.value.split('\n\n')})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] text-emerald-900 focus:outline-none focus:border-emerald-500 bg-white transition-all resize-none" placeholder="Extracted projects..." />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Technical Skills</label>
            <div className="w-full min-h-[42px] px-3 py-2 border border-slate-200 rounded-lg bg-white focus-within:border-emerald-500 transition-all flex flex-wrap gap-2 items-center">
              {formData.skills.map(skill => (
                <span key={skill} className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-[12px] font-bold flex items-center gap-1">
                  {skill}
                  <button onClick={() => removeSkill(skill, false)} className="material-symbols-outlined text-[14px] hover:text-red-500 cursor-pointer">close</button>
                </span>
              ))}
              <input 
                type="text" 
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder={formData.skills.length === 0 ? "Type and press enter..." : ""}
                className="flex-1 min-w-[120px] bg-transparent text-[13px] outline-none text-emerald-900"
              />
            </div>
          </div>
          {formData.softSkills.length > 0 && (
            <div className="space-y-1.5 mt-4">
              <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Soft Skills</label>
              <div className="w-full min-h-[42px] px-3 py-2 border border-slate-200 rounded-lg bg-white focus-within:border-emerald-500 transition-all flex flex-wrap gap-2 items-center">
                {formData.softSkills.map(skill => (
                  <span key={skill} className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[12px] font-bold flex items-center gap-1">
                    {skill}
                    <button onClick={() => removeSkill(skill, true)} className="material-symbols-outlined text-[14px] hover:text-red-500 cursor-pointer">close</button>
                  </span>
                ))}
              </div>
            </div>
          )}


          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-[13px] font-bold text-amber-600 mb-3 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">info</span>
              Additional Details (Not found in Resume)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">
                  Expected Salary <span className="text-red-400">*</span>
                </label>
                <input type="text" value={formData.expectedSalary} onChange={e => setFormData({...formData, expectedSalary: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] text-emerald-900 focus:outline-none focus:border-amber-400 bg-amber-50/10 transition-all" placeholder="e.g. $120k / ₹15LPA" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">
                  Notice Period <span className="text-red-400">*</span>
                </label>
                <input type="text" value={formData.noticePeriod} onChange={e => setFormData({...formData, noticePeriod: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] text-emerald-900 focus:outline-none focus:border-amber-400 bg-amber-50/10 transition-all" placeholder="e.g. 30 Days" />
              </div>
            </div>
          </div>

          <div className="pt-6 mt-auto">
            <button 
              onClick={handleConfirm} 
              className={`w-full py-3.5 rounded-xl text-[14px] font-bold transition-all shadow-sm flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer active:scale-[0.98]`}
            >
              Save & Sync to My Profile
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
