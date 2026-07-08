import { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function CandidateProfile() {
  const { candidateProfile, updateCandidateProfile } = useApp();
  const [isEditing, setIsEditing] = useState(false);

  // Form states when editing
  const [bio, setBio] = useState(candidateProfile.bio || '');
  const [title, setTitle] = useState(candidateProfile.title || '');
  const [location, setLocation] = useState(candidateProfile.location || '');
  const [phone, setPhone] = useState(candidateProfile.phone || '');
  const [email, setEmail] = useState(candidateProfile.email || '');
  const [experience, setExperience] = useState(candidateProfile.experience || '');
  const [projects, setProjects] = useState<string[]>(candidateProfile.projects || []);
  const [education, setEducation] = useState(candidateProfile.education || '');
  const [skills, setSkills] = useState<string[]>(candidateProfile.skills || []);
  const [selectedSkill, setSelectedSkill] = useState('');

  const availableSkills = ['React', 'Node.js', 'TypeScript', 'Python', 'Go', 'AWS', 'Kubernetes', 'GraphQL', 'Next.js', 'Docker', 'PostgreSQL'];

  const isProfileEmpty = !candidateProfile.title && !candidateProfile.bio && candidateProfile.skills.length === 0;

  const handleEdit = () => {
    if (isEditing) {
      updateCandidateProfile({
        title,
        location,
        phone,
        email,
        bio,
        experience,
        projects,
        education,
        skills,
        resumeParsed: true
      });
      alert('💾 Profile Saved Successfully!\n\nYour changes have been updated.');
    } else {
      setBio(candidateProfile.bio || '');
      setTitle(candidateProfile.title || '');
      setLocation(candidateProfile.location || '');
      setPhone(candidateProfile.phone || '');
      setEmail(candidateProfile.email || '');
      setExperience(candidateProfile.experience || '');
      setProjects(candidateProfile.projects || []);
      setEducation(candidateProfile.education || '');
      setSkills(candidateProfile.skills || []);
    }
    setIsEditing(!isEditing);
  };

  const handleAddSkill = () => {
    if (selectedSkill && !skills.includes(selectedSkill)) {
      setSkills([...skills, selectedSkill]);
    }
    setSelectedSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleUploadResume = () => {
    alert('📄 Upload New Resume\n\nThis will parse your new resume and update your profile automatically.');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateCandidateProfile({ imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-xl font-bold text-emerald-700 border-2 border-emerald-200 relative group overflow-hidden">
            {candidateProfile.imageUrl ? (
              <img src={candidateProfile.imageUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              candidateProfile.name.split(' ').map(n => n[0]).join('') || 'U'
            )}
            <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <span className="material-symbols-outlined text-white text-[20px]">photo_camera</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-emerald-900 tracking-tight">{candidateProfile.name}</h1>
            {isEditing ? (
              <div className="flex gap-2 mt-1">
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Job Title" className="px-2 py-1 text-[13px] border border-slate-200 rounded" />
                <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" className="px-2 py-1 text-[13px] border border-slate-200 rounded" />
              </div>
            ) : (
              <p className="text-[14px] text-slate-500">
                {candidateProfile.title ? `${candidateProfile.title} • ${candidateProfile.location}` : 'No title provided'}
              </p>
            )}
            
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded border ${candidateProfile.readinessScore > 50 ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                <span className="material-symbols-outlined text-[12px]">{candidateProfile.readinessScore > 50 ? 'check_circle' : 'pending'}</span> 
                {candidateProfile.readinessScore > 50 ? 'Profile Complete' : 'Profile Incomplete'}
              </span>
              {candidateProfile.skillsVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-semibold rounded border border-emerald-100">
                  <span className="material-symbols-outlined text-[12px]">verified</span> AI Verified
                </span>
              )}
              {candidateProfile.aiConfidence && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-700 text-[11px] font-semibold rounded border border-purple-100">
                  <span className="material-symbols-outlined text-[12px]">psychology</span> {candidateProfile.aiConfidence}% Resume Authenticity
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleUploadResume} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[16px]">upload_file</span>
            Update Resume
          </button>
          <button onClick={handleEdit} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${isEditing ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'border border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
            <span className="material-symbols-outlined text-[16px]">{isEditing ? 'save' : 'edit'}</span>
            {isEditing ? 'Save Profile' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Two Column Layout */}
      {!isEditing && isProfileEmpty ? (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-50 border border-slate-200 rounded-[24px] border-dashed">
           <span className="material-symbols-outlined text-4xl text-slate-400 mb-3">person_off</span>
           <h3 className="font-display text-lg font-bold text-emerald-900 mb-1">Your Profile is Empty</h3>
           <p className="text-sm text-slate-500 text-center max-w-md mb-6">You haven't added any professional details yet. Complete your profile to get matched with top AI and tech companies.</p>
           <button onClick={() => setIsEditing(true)} className="px-5 py-2.5 bg-emerald-600 text-white text-[13px] font-bold rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer shadow-sm">
             Complete Profile
           </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          
          {/* Left Column */}
          <div className="space-y-6">
            
            {/* AI Summary Block */}
            {candidateProfile.resumeSummary && (
              <div className="border border-purple-200 bg-purple-50/50 rounded-[24px] p-6 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[18px] text-purple-600">psychology</span>
                  <h2 className="font-display text-[16px] font-bold text-purple-900">AI Resume Summary</h2>
                </div>
                <p className="text-[14px] text-purple-800 leading-relaxed font-medium">
                  {candidateProfile.resumeSummary}
                </p>
              </div>
            )}

            {/* Professional Summary */}
            <div className="border border-slate-200 rounded-[24px] p-6 bg-white shadow-sm relative animate-fade-in" style={{ animationDelay: '100ms' }}>
              <h2 className="font-display text-[18px] font-bold text-emerald-900 mb-3">Professional Summary</h2>
              {isEditing ? (
                <textarea 
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Write a short professional summary..."
                  className="w-full h-32 p-3 border border-emerald-200 bg-emerald-50/20 rounded-xl text-[14px] text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all resize-y font-medium" 
                />
              ) : (
                <p className="text-[14px] text-slate-600 leading-relaxed font-medium whitespace-pre-wrap transition-opacity duration-300">
                  {candidateProfile.bio || 'No professional summary provided.'}
                </p>
              )}
            </div>

            {/* Experience */}
            <div className="border border-slate-200 rounded-[24px] p-6 bg-white shadow-sm animate-fade-in" style={{ animationDelay: '150ms' }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-[18px] font-bold text-emerald-900">Experience</h2>
              </div>
              <div className="space-y-4">
                {candidateProfile.experience || isEditing ? (
                  <div className="flex items-start gap-3 relative group transition-all duration-300">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">apartment</span>
                    </div>
                    <div className="flex-1 w-full">
                      {isEditing ? (
                        <textarea 
                          value={experience} 
                          onChange={e => setExperience(e.target.value)} 
                          placeholder="e.g. Senior Frontend Engineer at Tech Corp&#10;- Led a team of 5 developers&#10;- Improved performance by 40%" 
                          className="px-3 py-3 text-[13px] border border-emerald-200 bg-emerald-50/20 rounded-xl w-full h-32 resize-y focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all leading-relaxed" 
                        />
                      ) : (
                        <div className="text-[14px] text-slate-700 mt-0.5 leading-relaxed whitespace-pre-wrap">{candidateProfile.experience}</div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">No experience details added.</p>
                )}
              </div>
            </div>

            {/* Projects */}
            <div className="border border-slate-200 rounded-[24px] p-6 bg-white shadow-sm animate-fade-in" style={{ animationDelay: '175ms' }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-[18px] font-bold text-emerald-900">Projects</h2>
              </div>
              <div className="space-y-4">
                {(candidateProfile.projects && candidateProfile.projects.length > 0) || isEditing ? (
                  <div className="flex items-start gap-3 relative group transition-all duration-300">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">integration_instructions</span>
                    </div>
                    <div className="flex-1 w-full">
                      {isEditing ? (
                        <textarea 
                          value={projects.join('\n\n')} 
                          onChange={e => setProjects(e.target.value.split('\n\n'))} 
                          placeholder="Project 1: Developed a full-stack HR app using React..." 
                          className="px-3 py-3 text-[13px] border border-emerald-200 bg-emerald-50/20 rounded-xl w-full h-32 resize-y focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all leading-relaxed" 
                        />
                      ) : (
                        <div className="space-y-4">
                          {candidateProfile.projects.map((proj, idx) => (
                            <div key={idx} className="text-[14px] text-slate-700 mt-0.5 leading-relaxed whitespace-pre-wrap pb-2 border-b border-slate-100 last:border-0">{proj}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">No projects added.</p>
                )}
              </div>
            </div>

            {/* Education */}
            <div className="border border-slate-200 rounded-[24px] p-6 bg-white shadow-sm animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-[18px] font-bold text-emerald-900">Education</h2>
              </div>
              <div className="space-y-4">
                {candidateProfile.education || isEditing ? (
                  <div className="flex items-start gap-3 relative group transition-all duration-300">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">school</span>
                    </div>
                    <div className="flex-1 w-full">
                      {isEditing ? (
                        <textarea 
                          value={education} 
                          onChange={e => setEducation(e.target.value)} 
                          placeholder="e.g. B.S. in Computer Science - University of Tech&#10;Graduated 2022 with 3.8 GPA" 
                          className="px-3 py-3 text-[13px] border border-emerald-200 bg-emerald-50/20 rounded-xl w-full h-24 resize-y focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all leading-relaxed" 
                        />
                      ) : (
                        <div className="text-[14px] text-slate-700 mt-0.5 leading-relaxed whitespace-pre-wrap">{candidateProfile.education}</div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">No education details added.</p>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="border border-slate-200 rounded-[24px] p-6 bg-white shadow-sm animate-fade-in" style={{ animationDelay: '250ms' }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-[18px] font-bold text-emerald-900">Skills</h2>
              </div>
              
              {isEditing ? (
                <div className="mb-5 space-y-4">
                  <div className="flex gap-2 mb-4">
                    <select 
                      value={selectedSkill} 
                      onChange={e => setSelectedSkill(e.target.value)}
                      className="px-4 py-2 text-[13px] border border-emerald-200 bg-emerald-50/20 rounded-xl flex-1 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                    >
                      <option value="" disabled>Select a skill to add...</option>
                      {availableSkills.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <button onClick={handleAddSkill} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-bold rounded-xl transition-all shadow-sm shrink-0 active:scale-95">
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map(skill => (
                      <div key={skill} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-[13px] font-semibold transition-all hover:-translate-y-0.5">
                        {skill}
                        <button onClick={() => handleRemoveSkill(skill)} className="material-symbols-outlined text-[16px] hover:text-red-500 transition-colors ml-1">close</button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mb-5 flex flex-wrap gap-2">
                  {candidateProfile.skills.length > 0 ? candidateProfile.skills.map((skill) => (
                    <div key={skill} className="flex items-center px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-[13px] font-semibold shadow-sm">
                      {skill}
                    </div>
                  )) : (
                    <p className="text-sm text-slate-400 italic w-full">No skills added.</p>
                  )}
                </div>
              )}

              {candidateProfile.missingSkills && candidateProfile.missingSkills.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <h3 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">troubleshoot</span> AI Identified Skill Gaps
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {candidateProfile.missingSkills.map(skill => (
                      <span key={skill} className="px-2 py-0.5 border border-dashed border-slate-300 rounded text-[11px] font-semibold text-slate-500 bg-slate-50">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            
            {/* Interview Readiness */}
            <div className="border border-slate-200 rounded-[24px] p-6 bg-white shadow-sm">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Interview Readiness</h3>
              <div className="flex items-center justify-center mb-3">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90 filter drop-shadow-lg">
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={candidateProfile.readinessScore > 75 ? '#34d399' : '#fbbf24'} />
                        <stop offset="100%" stopColor={candidateProfile.readinessScore > 75 ? '#059669' : '#d97706'} />
                      </linearGradient>
                      <filter id="innerShadow">
                        <feOffset dx="0" dy="4"/>
                        <feGaussianBlur stdDeviation="5" result="offset-blur"/>
                        <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
                        <feFlood floodColor="black" floodOpacity="0.3" result="color"/>
                        <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
                        <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
                      </filter>
                    </defs>
                    <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" filter="url(#innerShadow)" />
                    <circle cx="56" cy="56" r="48" stroke="url(#scoreGradient)" strokeWidth="12" strokeLinecap="round" fill="transparent" strokeDasharray="301.6" strokeDashoffset={301.6 - (301.6 * candidateProfile.readinessScore) / 100} style={{ filter: 'drop-shadow(0px 6px 8px rgba(5, 150, 105, 0.4))' }} />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
 <span className=" text-[28px] font-bold text-emerald-900 leading-none">{candidateProfile.readinessScore}</span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-center font-medium text-slate-500 mt-2">
                {candidateProfile.readinessScore > 75 ? 'You are highly competitive for your target roles.' : 'Complete your profile to improve your readiness score.'}
              </p>
            </div>

            {/* AI Career Suggestions */}
            {candidateProfile.careerSuggestions && candidateProfile.careerSuggestions.length > 0 && (
              <div className="border border-slate-200 rounded-[24px] p-6 bg-white shadow-sm">
                <div className="flex items-center gap-1.5 mb-4">
                  <span className="material-symbols-outlined text-[18px] text-emerald-600">trending_up</span>
                  <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Career Trajectory</h3>
                </div>
                <div className="space-y-2">
                  {candidateProfile.careerSuggestions.map(role => (
                    <div key={role} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[12px] font-semibold text-slate-700">{role}</span>
                      <span className="material-symbols-outlined text-[14px] text-emerald-500">arrow_forward</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Candidate Timeline */}
            {candidateProfile.timeline && (
              <div className="border border-slate-200 rounded-[24px] p-6 bg-white shadow-sm">
                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-5">Your Timeline</h3>
                <div className="space-y-5 pl-2">
                  {candidateProfile.timeline.map((step: any, idx: number) => (
                    <div key={step.stage} className="relative flex items-start gap-4">
                      {idx !== candidateProfile.timeline!.length - 1 && (
                        <div className={`absolute top-5 left-[7px] w-[2px] h-[calc(100%+8px)] ${step.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                      )}
                      <div className={`relative z-10 w-4 h-4 rounded-full mt-0.5 border-2 ${
                        step.status === 'completed' ? 'bg-emerald-500 border-emerald-500' : 
                        step.status === 'current' ? 'bg-white border-emerald-500' : 'bg-white border-slate-300'
                      }`}>
                        {step.status === 'current' && <div className="absolute inset-[2px] bg-emerald-500 rounded-full animate-pulse"></div>}
                      </div>
                      <div>
                        <div className={`text-[13px] font-semibold ${step.status === 'pending' ? 'text-slate-400' : 'text-emerald-900'}`}>{step.stage}</div>
                        <div className="text-[11px] text-slate-400 font-medium">{step.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Info */}
            <div className="border border-slate-200 rounded-[24px] p-6 bg-white shadow-sm animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Contact Information</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[16px] text-slate-400">mail</span>
                  {isEditing ? (
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="px-3 py-1.5 text-[13px] border border-emerald-200 bg-emerald-50/20 rounded-lg w-full focus:outline-none focus:border-emerald-500 transition-all" />
                  ) : (
                    <span className="text-[13px] text-slate-700 font-medium">{candidateProfile.email}</span>
                  )}
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[16px] text-slate-400">call</span>
                  {isEditing ? (
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number" className="px-3 py-1.5 text-[13px] border border-emerald-200 bg-emerald-50/20 rounded-lg w-full focus:outline-none focus:border-emerald-500 transition-all" />
                  ) : (
                    <span className="text-[13px] text-slate-700 font-medium">{candidateProfile.phone || 'No phone added'}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
