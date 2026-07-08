import React, { createContext, useContext, useState, useEffect } from 'react';

// --- Interfaces ---
export interface User {
  name: string;
  email: string;
  role: 'Candidate' | 'Admin' | 'SuperAdmin';
  company?: string;
  avatar?: string;
  googleAccessToken?: string;
  googleRefreshToken?: string;
}

export interface CandidateProfile {
  id: string; // Internal ID
  name: string;
  email: string;
  imageUrl?: string;
  phone: string;
  title: string;
  location: string;
  preferredLocation?: string;
  dob?: string;
  gender?: string;
  currentCompany: string;
  readinessScore: number; // Overall profile completeness
  resumeParsed: boolean;
  skillsVerified: boolean;
  portfolioAdded: boolean;
  skills: string[];
  bio: string;
  experience: string;
  education: string;
  certifications: string[];
  projects: string[];
  
  // AI Generated
  resumeSummary?: string;
  resumeScore?: number;
  aiConfidence?: number;
  missingSkills?: string[];
  careerSuggestions?: string[];
  resumeVersion: number;
  timeline?: { stage: string; date: string; status: 'completed' | 'current' | 'pending' }[];
}

export interface CandidateApplication {
  id: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  role: string;
  company: string;
  status: 'Applied' | 'Under Review' | 'Shortlisted' | 'MCQ Test Pending' | 'MCQ Test Completed' | 'Interview Scheduled' | 'Interview Completed' | 'Client Submitted' | 'Offer Released' | 'Hired' | 'Joined' | 'Rejected';
  appliedDate: string;
  logoLetter: string;
  logoBg: string;
  
  // AI Matching Data
  matchScore: number;
  resumeScore: number;
  confidenceScore: number;
  skillMatch: number;
  experienceMatch: number;
  educationMatch: number;
  missingSkills: string[];
  reasonForMatch: string;

  // Test Results
  testScore?: number;
  testPenalties?: number;
  testPassed?: boolean;
}

export interface RecruiterJob {
  id: string;
  title: string;
  dept: string;
  location: string;
  mode: 'Remote' | 'Hybrid' | 'On-site';
  salary: string;
  status: 'Draft' | 'Active' | 'Paused' | 'Filled';
  postedDate: string;
  urgent: boolean;
  
  // Parsed JD fields
  description: string;
  requiredSkills: string[];
  niceToHave: string[];
  experienceRequired: string;
  industry: string;
  employmentType: string;
  jdSummary: string;
}

// Used for Ai Screening Dashboard
export interface AiScreeningItem {
  id: string;
  applicationId: string;
  candidateName: string;
  role: string;
  aiScore: number; // matchScore
  recommendation: 'Strong Hire' | 'Recommend' | 'Proceed with Caution' | 'High Risk';
  summary: string;
  strengths: string[];
  risks: string[];
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface ClientAccount {
  id: string;
  name: string;
  industry: string;
  activeRoles: number;
  pipeline: number;
  contactName: string;
  contactEmail: string;
  status: 'Account Healthy' | 'Action Required' | 'Onboarding';
  icon: string;
  revenue: number;
}

export interface Agency {
  id: string;
  name: string;
  plan: string;
  tokens: string;
  candidates: string;
  status: 'Active' | 'Pending' | 'Suspended';
}

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  date: string;
  time: string;
  type: 'Technical' | 'Cultural' | 'HR' | 'Client';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  meetLink: string;
}

interface AppContextType {
  currentUser: User;
  login: (name: string, email: string, role: 'Candidate' | 'Admin' | 'SuperAdmin', company?: string, googleTokens?: { access?: string, refresh?: string }) => void;
  logout: () => void;
  isDemoLoaded: boolean;
  loadSampleData: () => void;
  clearAllData: () => void;

  // Global Repositories
  globalCandidates: CandidateProfile[]; // Super Admin view

  // Candidate Actions
  candidateProfile: CandidateProfile;
  updateCandidateProfile: (updates: Partial<CandidateProfile>) => void;
  parseResume: (file: File) => Promise<void>;
  createJobRequisition: (jobData: any) => Promise<void>;
  updateJob: (jobId: string, updates: Partial<RecruiterJob>) => void;
  
  // Applications
  applications: CandidateApplication[]; // Shared application list (Candidate sees theirs, Recruiter sees theirs, Admin sees all)
  applyForJob: (jobId: string) => Promise<void>;
  updateApplicationStatus: (appId: string, status: CandidateApplication['status']) => void;
  submitTestResult: (appId: string, score: number, penalties: number) => void;

  // Interviews
  interviews: Interview[];
  scheduleInterview: (interview: Omit<Interview, 'id' | 'status' | 'meetLink'>) => void;
  updateInterviewStatus: (id: string, status: Interview['status']) => void;

  // Jobs
  jobs: RecruiterJob[];
  
  // AI Screening
  aiScreenings: AiScreeningItem[];
  updateScreeningStatus: (id: string, status: AiScreeningItem['status']) => void;
  
  // Legacy / Other
  clients: ClientAccount[];
  addClient: (client: Omit<ClientAccount, 'id' | 'icon'>) => void;
  updateClient: (id: string, updates: Partial<ClientAccount>) => void;
  deleteClient: (id: string) => void;
  agencies: Agency[];
  addAgency: (agency: Omit<Agency, 'id'>) => void;
  updateAgency: (id: string, updates: Partial<Agency>) => void;
  deleteAgency: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// --- Defaults & Mock Data ---
const DEFAULT_CANDIDATE_PROFILE: CandidateProfile = {
  id: 'c_me',
  name: '',
  email: '',
  phone: '+91 98765 43210',
  title: '',
  location: 'Bangalore, India',
  preferredLocation: '',
  dob: '',
  gender: '',
  currentCompany: 'TechFlow Inc',
  readinessScore: 0,
  resumeParsed: false,
  skillsVerified: false,
  portfolioAdded: false,
  skills: [],
  bio: '',
  experience: '',
  education: '',
  certifications: [],
  projects: [],
  resumeVersion: 0
};

// Initial system jobs removed as they are no longer used

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('recruitai_user');
    return saved ? JSON.parse(saved) : { name: 'Anik Khan Pathan', email: 'anik@company.com', role: 'Candidate', company: 'TechFlow Inc.' };
  });

  const [isDemoLoaded, setIsDemoLoaded] = useState<boolean>(() => localStorage.getItem('recruitai_demo_loaded') === 'true');

  // Core Data Arrays
  const [globalCandidates, setGlobalCandidates] = useState<CandidateProfile[]>(() => {
    const saved = localStorage.getItem('recruitai_global_candidates');
    return saved ? JSON.parse(saved) : [];
  });

  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile>(() => {
    const saved = localStorage.getItem('recruitai_candidate_profile');
    if (saved) return JSON.parse(saved);
    return { ...DEFAULT_CANDIDATE_PROFILE, name: currentUser.name, email: currentUser.email };
  });

  const [jobs, setJobs] = useState<RecruiterJob[]>(() => {
    const saved = localStorage.getItem('recruitai_jobs');
    return saved ? JSON.parse(saved) : [];
  });

  const [applications, setApplications] = useState<CandidateApplication[]>(() => {
    const saved = localStorage.getItem('recruitai_applications');
    return saved ? JSON.parse(saved) : [];
  });

  const [aiScreenings, setAiScreenings] = useState<AiScreeningItem[]>(() => {
    const saved = localStorage.getItem('recruitai_screenings');
    return saved ? JSON.parse(saved) : [];
  });

  const [interviews, setInterviews] = useState<Interview[]>(() => {
    const saved = localStorage.getItem('recruitai_interviews');
    return saved ? JSON.parse(saved) : [];
  });

  const [clients, setClients] = useState<ClientAccount[]>(() => {
    const saved = localStorage.getItem('recruitai_clients');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'cl_1',
        name: 'TechCorp Solutions',
        industry: 'Enterprise Tech',
        activeRoles: 5,
        pipeline: 24,
        contactName: 'Sarah Jenkins',
        contactEmail: 'sarah@techcorp.com',
        status: 'Account Healthy',
        icon: 'domain',
        revenue: 45000
      },
      {
        id: 'cl_2',
        name: 'HealthAI',
        industry: 'HealthTech',
        activeRoles: 2,
        pipeline: 8,
        contactName: 'Dr. Alan Smith',
        contactEmail: 'alan@healthai.io',
        status: 'Action Required',
        icon: 'medical_services',
        revenue: 12000
      }
    ];
  });

  const [agencies, setAgencies] = useState<Agency[]>(() => {
    const saved = localStorage.getItem('recruitai_agencies');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync to local storage
  useEffect(() => { localStorage.setItem('recruitai_user', JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem('recruitai_demo_loaded', isDemoLoaded ? 'true' : 'false'); }, [isDemoLoaded]);
  useEffect(() => { localStorage.setItem('recruitai_global_candidates', JSON.stringify(globalCandidates)); }, [globalCandidates]);
  useEffect(() => { localStorage.setItem('recruitai_candidate_profile', JSON.stringify(candidateProfile)); }, [candidateProfile]);
  useEffect(() => { localStorage.setItem('recruitai_jobs', JSON.stringify(jobs)); }, [jobs]);
  useEffect(() => { localStorage.setItem('recruitai_applications', JSON.stringify(applications)); }, [applications]);
  useEffect(() => { localStorage.setItem('recruitai_screenings', JSON.stringify(aiScreenings)); }, [aiScreenings]);
  useEffect(() => { localStorage.setItem('recruitai_interviews', JSON.stringify(interviews)); }, [interviews]);
  useEffect(() => { localStorage.setItem('recruitai_clients', JSON.stringify(clients)); }, [clients]);
  useEffect(() => { localStorage.setItem('recruitai_agencies', JSON.stringify(agencies)); }, [agencies]);

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'recruitai_user' && e.newValue) setCurrentUser(JSON.parse(e.newValue));
      if (e.key === 'recruitai_global_candidates' && e.newValue) setGlobalCandidates(JSON.parse(e.newValue));
      if (e.key === 'recruitai_candidate_profile' && e.newValue) setCandidateProfile(JSON.parse(e.newValue));
      if (e.key === 'recruitai_jobs' && e.newValue) setJobs(JSON.parse(e.newValue));
      if (e.key === 'recruitai_applications' && e.newValue) setApplications(JSON.parse(e.newValue));
      if (e.key === 'recruitai_screenings' && e.newValue) setAiScreenings(JSON.parse(e.newValue));
      if (e.key === 'recruitai_interviews' && e.newValue) setInterviews(JSON.parse(e.newValue));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Auth Methods
  const login = (name: string, email: string, role: 'Candidate' | 'Admin' | 'SuperAdmin', company?: string, googleTokens?: { access?: string, refresh?: string }) => {
    setCurrentUser({ 
      name, 
      email, 
      role, 
      company: company || 'RecruitAI Partner',
      googleAccessToken: googleTokens?.access,
      googleRefreshToken: googleTokens?.refresh
    });
    if (role === 'Candidate') {
      setCandidateProfile(prev => ({ ...prev, name, email }));
    }
  };

  const logout = () => localStorage.removeItem('recruitai_user');

  const clearAllData = () => {
    setGlobalCandidates([]);
    setCandidateProfile({ ...DEFAULT_CANDIDATE_PROFILE, name: currentUser.name, email: currentUser.email });
    setJobs([]);
    setApplications([]);
    setAiScreenings([]);
    setInterviews([]);
    setClients([]);
    setAgencies([]);
    setIsDemoLoaded(false);
  };

  const loadSampleData = () => {
    setIsDemoLoaded(true);
    // Add sample global candidates, applications, etc if needed.
  };

  // --- CANDIDATE WORKFLOW ---

  const parseResume = async (_file: File): Promise<void> => {
    return new Promise((resolve) => {
      // Simulate AI processing delay
      setTimeout(() => {
        // AI Extraction logic simulated
        const updatedProfile: CandidateProfile = {
          ...candidateProfile,
          name: currentUser.name,
          email: currentUser.email,
          phone: '+1 (555) 123-4567',
          title: 'Senior Software Engineer',
          location: 'San Francisco, CA',
          currentCompany: 'Tech Innovations LLC',
          experience: '6 Years',
          education: 'B.S. Computer Science, UC Berkeley',
          skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'GraphQL'],
          certifications: ['AWS Certified Developer'],
          projects: ['Enterprise E-commerce Platform', 'Real-time Analytics Dashboard'],
          resumeSummary: 'Experienced full-stack engineer specializing in React and Node.js. Proven track record of delivering scalable cloud applications.',
          resumeScore: 92,
          aiConfidence: 96,
          missingSkills: ['Kubernetes'],
          careerSuggestions: ['Lead Frontend Engineer', 'Engineering Manager'],
          resumeParsed: true,
          resumeVersion: candidateProfile.resumeVersion + 1,
          readinessScore: 85
        };
        
        setCandidateProfile(updatedProfile);
        
        // Also update the global candidates repo if they don't exist
        setGlobalCandidates(prev => {
          const exists = prev.find(p => p.id === updatedProfile.id);
          if (exists) return prev.map(p => p.id === updatedProfile.id ? updatedProfile : p);
          return [updatedProfile, ...prev];
        });

        resolve();
      }, 3000); // 3 second delay for dramatic effect
    });
  };

  const updateCandidateProfile = (updates: Partial<CandidateProfile>) => {
    setCandidateProfile(prev => {
      const updated = { ...prev, ...updates };
      
      // Sync to global repository
      setGlobalCandidates(gPrev => {
        const exists = gPrev.find(p => p.id === updated.id);
        if (exists) return gPrev.map(p => p.id === updated.id ? updated : p);
        return [...gPrev, updated];
      });
      
      return updated;
    });
  };

  // --- JOB APPLICATION WORKFLOW ---

  const applyForJob = async (jobId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const job = jobs.find(j => j.id === jobId);
      if (!job) return reject(new Error('Job not found'));
      
      // Prevent duplicate application
      if (applications.some(a => a.jobId === jobId && a.candidateId === candidateProfile.id)) {
        return reject(new Error('Already applied to this job'));
      }

      setTimeout(() => {
        // AI Match Calculation Simulation
        const candidateSkills = candidateProfile.skills.map(s => s.toLowerCase());
        const jobSkills = job.requiredSkills.map(s => s.toLowerCase());
        const matchedSkills = candidateSkills.filter(s => jobSkills.includes(s));
        const missingSkills = jobSkills.filter(s => !candidateSkills.includes(s));
        
        const skillMatch = Math.min(100, Math.round((matchedSkills.length / Math.max(1, jobSkills.length)) * 100));
        const hasExp = candidateProfile.experience && candidateProfile.experience.length > 0;
        const expMatch = hasExp ? 100 : 40; 
        const eduMatch = candidateProfile.education ? 100 : 50;
        const confidenceScore = 90;
        
        // Use the deterministic ATS score (readinessScore) as the overall match score
        const overallMatch = candidateProfile.readinessScore || 85;

        const bgColors = ['bg-emerald-800', 'bg-purple-600', 'bg-emerald-900', 'bg-emerald-800', 'bg-amber-600'];
        
        const newApp: CandidateApplication = {
          id: `app_${Date.now()}`,
          candidateId: candidateProfile.id,
          candidateName: candidateProfile.name,
          jobId: job.id,
          role: job.title,
          company: 'TechFlow Inc', // Assuming agency/company context
          status: 'Applied',
          appliedDate: new Date().toISOString(),
          logoLetter: job.title.charAt(0).toUpperCase(),
          logoBg: bgColors[Math.floor(Math.random() * bgColors.length)],
          
          matchScore: overallMatch,
          resumeScore: candidateProfile.resumeScore || 85,
          confidenceScore: confidenceScore,
          skillMatch,
          experienceMatch: expMatch,
          educationMatch: eduMatch,
          missingSkills,
          reasonForMatch: `Strong alignment in ${matchedSkills.join(', ')}. ${missingSkills.length > 0 ? 'Missing ' + missingSkills.join(', ') : 'Perfect skill match.'}`
        };

        setApplications(prev => [newApp, ...prev]);

        // Automatically trigger AI Screening generation for the recruiter
        const newScreening: AiScreeningItem = {
          id: `scr_${Date.now()}`,
          applicationId: newApp.id,
          candidateName: newApp.candidateName,
          role: newApp.role,
          aiScore: newApp.matchScore,
          recommendation: newApp.matchScore >= 90 ? 'Strong Hire' : newApp.matchScore >= 75 ? 'Recommend' : 'Proceed with Caution',
          summary: newApp.reasonForMatch,
          strengths: ['Verified skills match', 'Solid experience timeline'],
          risks: newApp.missingSkills.length > 0 ? ['Lacks experience in ' + newApp.missingSkills[0]] : [],
          status: 'Pending'
        };

        setAiScreenings(prev => [newScreening, ...prev]);

        resolve();
      }, 1500);
    });
  };

  const updateApplicationStatus = (appId: string, status: CandidateApplication['status']) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
  };

  const submitTestResult = (appId: string, score: number, penalties: number) => {
    setApplications(prev => prev.map(a => a.id === appId ? { 
      ...a, 
      testScore: score, 
      testPenalties: penalties,
      status: 'MCQ Test Completed',
      testPassed: true // Just saving the score for now
    } : a));
  };

  // --- RECRUITER / ADMIN WORKFLOW ---

  const createJobRequisition = async (jobData: any): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Parse JD logic simulation
        const extractedSkills = jobData.description.match(/(React|Node\.js|Python|TypeScript|AWS|Docker|Kubernetes)/gi) || ['General Software Engineering'];
        const uniqueSkills = Array.from(new Set(extractedSkills.map((s: string) => s.trim())));
        
        const newJob: RecruiterJob = {
          id: `job_${Date.now()}`,
          title: jobData.title,
          dept: jobData.dept || 'Engineering',
          location: jobData.location || 'Remote',
          mode: jobData.mode || 'Remote',
          salary: jobData.salary || 'Negotiable',
          status: 'Active',
          postedDate: new Date().toISOString(),
          urgent: jobData.urgent || false,
          
          description: jobData.description,
          requiredSkills: uniqueSkills as string[],
          niceToHave: ['Agile'],
          experienceRequired: '3+ years',
          industry: 'Tech',
          employmentType: 'Full-time',
          jdSummary: `AI Summary: Looking for a ${jobData.title} with expertise in ${(uniqueSkills as string[]).join(', ')}.`
        };

        setJobs(prev => [newJob, ...prev]);
        resolve();
      }, 800);
    });
  };

  const updateJob = (jobId: string, updates: Partial<RecruiterJob>) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, ...updates } : j));
  };

  const updateScreeningStatus = (id: string, status: AiScreeningItem['status']) => {
    setAiScreenings(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const addClient = (client: Omit<ClientAccount, 'id' | 'icon'>) => {
    const id = `cl_${Date.now()}`;
    setClients(prev => [{ ...client, id, icon: 'domain' }, ...prev]);
  };

  const updateClient = (id: string, updates: Partial<ClientAccount>) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
  };

  const addAgency = (agency: Omit<Agency, 'id'>) => {
    const id = `ag_${Date.now()}`;
    setAgencies(prev => [{ ...agency, id }, ...prev]);
  };

  const updateAgency = (id: string, updates: Partial<Agency>) => {
    setAgencies(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const deleteAgency = (id: string) => {
    setAgencies(prev => prev.filter(a => a.id !== id));
  };

  const scheduleInterview = (interview: Omit<Interview, 'id' | 'status' | 'meetLink'>) => {
    const newInterview: Interview = {
      ...interview,
      id: `int_${Date.now()}`,
      status: 'Scheduled',
      meetLink: `https://meet.google.com/abc-defg-hij`
    };
    setInterviews(prev => [newInterview, ...prev]);
  };

  const updateInterviewStatus = (id: string, status: Interview['status']) => {
    setInterviews(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      login,
      logout,
      isDemoLoaded,
      loadSampleData,
      clearAllData,
      
      globalCandidates,
      candidateProfile,
      updateCandidateProfile,
      parseResume,
      createJobRequisition,
      updateJob,
      
      applications,
      applyForJob,
      updateApplicationStatus,
      submitTestResult,
      
      jobs,
      
      aiScreenings,
      updateScreeningStatus,
      
      clients,
      addClient,
      updateClient,
      deleteClient,
      agencies,
      addAgency,
      updateAgency,
      deleteAgency,

      interviews,
      scheduleInterview,
      updateInterviewStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

