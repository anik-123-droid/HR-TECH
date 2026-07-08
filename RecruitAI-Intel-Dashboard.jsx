import React, { useState } from "react";
import {
  LayoutDashboard, Search, UploadCloud, User, Calendar, Users, ClipboardList,
  Building2, Bell, ChevronDown, MapPin, Sparkles, CheckCircle2, AlertTriangle,
  Video, GraduationCap, TrendingUp, SlidersHorizontal, ShieldCheck, Clock,
  Eye, Mail, ArrowUpRight, Zap, Star, Briefcase, LogOut, Settings, Filter,
  Grid3x3, List, Flag, PauseCircle, DollarSign, ChevronRight, X, Plus
} from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";

/* ----------------------------- DATA ----------------------------- */

const candidate = {
  name: "Anik Khan Pathan",
  email: "anikkhanpathan685@gmail.com",
  role: "Senior Frontend Engineer",
  completeness: 85,
  activeApplications: 12,
  profileViews: 348,
};

const aiMatches = [
  {
    company: "Nexora Cloud", role: "Senior Frontend Engineer", match: 92,
    location: "Bengaluru · Remote", salary: "₹32L – ₹42L",
    tags: ["React", "TypeScript", "GraphQL"], logo: "NX",
  },
  {
    company: "Fintrail Labs", role: "Staff Frontend Architect", match: 88,
    location: "Pune · Hybrid", salary: "₹40L – ₹55L",
    tags: ["Next.js", "Design Systems", "Node.js"], logo: "FT",
  },
  {
    company: "Verdant Health", role: "Lead UI Engineer", match: 85,
    location: "Remote · Global", salary: "$95K – $120K",
    tags: ["Vue", "Accessibility", "Storybook"], logo: "VH",
  },
];

const jobsFeed = [
  {
    company: "Nexora Cloud", logo: "NX", role: "Senior Frontend Engineer",
    location: "Bengaluru", type: "Remote", posted: "2d ago", match: 92,
    tags: ["React", "TypeScript", "GraphQL", "Tailwind"], salary: "₹32L–₹42L",
  },
  {
    company: "Orbit Systems", logo: "OS", role: "Frontend Platform Engineer",
    location: "Hyderabad", type: "Hybrid", posted: "3d ago", match: 81,
    tags: ["React", "Micro-frontends", "Webpack"], salary: "₹28L–₹36L",
  },
  {
    company: "Fintrail Labs", logo: "FT", role: "Staff Frontend Architect",
    location: "Pune", type: "Hybrid", posted: "5d ago", match: 88,
    tags: ["Next.js", "Node.js", "Design Systems"], salary: "₹40L–₹55L",
  },
  {
    company: "Quanta Retail", logo: "QR", role: "UI Engineer II",
    location: "Remote", type: "Remote", posted: "1w ago", match: 74,
    tags: ["Vue", "Nuxt", "Testing"], salary: "₹22L–₹30L",
  },
  {
    company: "Verdant Health", logo: "VH", role: "Lead UI Engineer",
    location: "Remote · Global", type: "Remote", posted: "1w ago", match: 85,
    tags: ["Vue", "A11y", "Storybook"], salary: "$95K–$120K",
  },
];

const experienceTimeline = [
  { org: "Nimbus Fintech", role: "Frontend Engineer II", period: "2023 — Present",
    desc: "Led migration of the trading dashboard to React 18 + TypeScript, cutting load time by 38%." },
  { org: "Codeverve Studio", role: "Frontend Developer", period: "2021 — 2023",
    desc: "Built component libraries used across 6 client products; introduced Storybook-driven workflows." },
  { org: "Freelance", role: "UI Developer", period: "2019 — 2021",
    desc: "Delivered 20+ marketing sites and dashboards for early-stage startups." },
];

const educationTimeline = [
  { org: "IIT Guwahati", role: "B.Tech, Computer Science", period: "2015 — 2019", desc: "Graduated with distinction; thesis on real-time UI rendering." },
  { org: "Coursera / DeepLearning.AI", role: "Machine Learning Specialization", period: "2022", desc: "Completed applied ML coursework alongside full-time work." },
];

const interviews = [
  { company: "Nexora Cloud", role: "Senior Frontend Engineer", stage: "Technical Round 2", when: "Today, 4:30 PM", interviewer: "Priya Menon", status: "upcoming" },
  { company: "Fintrail Labs", role: "Staff Frontend Architect", stage: "System Design", when: "Tomorrow, 11:00 AM", interviewer: "Rahul Iyer", status: "upcoming" },
  { company: "Orbit Systems", role: "Frontend Platform Engineer", stage: "Recruiter Screen", when: "Thu, 2:00 PM", interviewer: "Ananya Das", status: "scheduled" },
  { company: "Quanta Retail", role: "UI Engineer II", stage: "Offer Discussion", when: "Completed", interviewer: "Kabir Shah", status: "done" },
];

const detectedStack = ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL", "Node.js", "Jest", "Figma"];

const recruiterKPIs = [
  { label: "Active Job Reqs", value: "27", delta: "+4 this week", icon: Briefcase, tone: "blue" },
  { label: "New AI Matches", value: "156", delta: "+32 today", icon: Sparkles, tone: "blue" },
  { label: "Pending Screenings", value: "9", delta: "3 overdue", icon: AlertTriangle, tone: "red" },
];

const talentPool = [
  { name: "Meera Nair", role: "Senior Backend Engineer", match: 94, verified: true, skills: ["Java", "Kafka", "AWS"], avatar: "MN" },
  { name: "Devansh Rao", role: "Product Designer", match: 90, verified: true, skills: ["Figma", "Design Systems"], avatar: "DR" },
  { name: "Sara Fernandes", role: "Data Scientist", match: 87, verified: false, skills: ["Python", "PyTorch", "SQL"], avatar: "SF" },
  { name: "Kabir Malhotra", role: "DevOps Engineer", match: 83, verified: true, skills: ["Kubernetes", "Terraform"], avatar: "KM" },
  { name: "Ishita Verma", role: "Frontend Engineer", match: 91, verified: true, skills: ["React", "TypeScript"], avatar: "IV" },
  { name: "Farhan Sheikh", role: "QA Automation Lead", match: 79, verified: false, skills: ["Cypress", "Playwright"], avatar: "FS" },
];

const jobReqs = [
  { title: "Senior Backend Engineer", client: "Nimbus Fintech", applicants: 48, matches: 12, status: "Active" },
  { title: "Product Designer", client: "Orbit Systems", applicants: 31, matches: 8, status: "Active" },
  { title: "Data Scientist", client: "Verdant Health", applicants: 22, matches: 5, status: "Paused" },
];

const screeningCandidates = [
  { name: "Meera Nair", role: "Senior Backend Engineer", match: 94, flags: 0, avatar: "MN" },
  { name: "Ishita Verma", role: "Frontend Engineer", match: 91, flags: 1, avatar: "IV" },
  { name: "Sara Fernandes", role: "Data Scientist", match: 87, flags: 2, avatar: "SF" },
  { name: "Farhan Sheikh", role: "QA Automation Lead", match: 79, flags: 0, avatar: "FS" },
];

const radarData = [
  { skill: "System Design", value: 88 },
  { skill: "Coding Depth", value: 94 },
  { skill: "Communication", value: 76 },
  { skill: "Problem Solving", value: 90 },
  { skill: "Leadership", value: 68 },
  { skill: "Culture Fit", value: 82 },
];

const interviewTimelineFlags = [
  { time: "02:14", label: "Strong answer on distributed caching", tone: "good" },
  { time: "07:41", label: "Browser focus lost for 18s", tone: "warn" },
  { time: "12:03", label: "Clarified trade-offs clearly", tone: "good" },
  { time: "19:52", label: "Long pause before answering (26s)", tone: "warn" },
];

const clients = [
  { name: "Nimbus Fintech", reqs: 6, health: "green", revenue: "₹18.4L", contact: "Rhea Kapoor" },
  { name: "Orbit Systems", reqs: 3, health: "yellow", revenue: "₹9.2L", contact: "Vikram Seth" },
  { name: "Verdant Health", reqs: 4, health: "green", revenue: "₹14.7L", contact: "Ananya Das" },
  { name: "Quanta Retail", reqs: 2, health: "red", revenue: "₹4.1L", contact: "Sameer Joshi" },
  { name: "Fintrail Labs", reqs: 5, health: "green", revenue: "₹21.9L", contact: "Priya Menon" },
];

/* --------------------------- PRIMITIVES --------------------------- */

function Pill({ children, tone = "blue" }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    slate: "bg-slate-50 text-slate-600 border-slate-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${tones[tone]}`}>
      {children}
    </span>
  );
}

function MatchBadge({ value, size = "md" }) {
  const sizeCls = size === "lg" ? "text-2xl px-4 py-1.5" : "text-sm px-3 py-1";
  const color = value >= 90 ? "from-blue-600 to-blue-500" : value >= 80 ? "from-blue-500 to-sky-400" : "from-slate-500 to-slate-400";
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${color} text-white font-bold ${sizeCls} shadow-sm shadow-blue-200`}>
      <Sparkles className="w-4 h-4" />
      {value}% Match
    </div>
  );
}

function CircularProgress({ percentage, size = 96, stroke = 9, label, sublabel }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#e2e8f0" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke="url(#gradBlue)" strokeWidth={stroke} fill="none"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
        />
        <defs>
          <linearGradient id="gradBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-xl font-extrabold text-slate-800">{percentage}%</span>
        {sublabel && <span className="text-[10px] text-slate-400 font-medium">{sublabel}</span>}
      </div>
    </div>
  );
}

function Avatar({ initials, size = "w-10 h-10", tone = "bg-gradient-to-br from-blue-600 to-blue-400" }) {
  return (
    <div className={`${size} ${tone} rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0`}>
      {initials}
    </div>
  );
}

function SectionHeading({ eyebrow, title, action }) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        {eyebrow && <p className="text-xs font-semibold text-blue-600 tracking-wide uppercase mb-1">{eyebrow}</p>}
        <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function PrimaryButton({ children, className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold px-5 py-2.5 text-sm shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function Card({ children, className = "", hover = true }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-2xl p-6 transition-all duration-300 ${hover ? "hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60" : ""} ${className}`}>
      {children}
    </div>
  );
}

/* ----------------------------- LAYOUT ----------------------------- */

function Sidebar({ portal, setPortal, page, setPage }) {
  const candidateNav = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "jobs", label: "Find AI Jobs", icon: Search },
    { id: "resume", label: "AI Resume Import", icon: UploadCloud },
    { id: "profile", label: "My Profile", icon: User },
    { id: "interviews", label: "Interviews", icon: Calendar },
  ];
  const recruiterNav = [
    { id: "dashboard", label: "Intelligence Workspace", icon: LayoutDashboard },
    { id: "talent", label: "Job Reqs & Talent Pool", icon: Users },
    { id: "screening", label: "AI Screening Pipeline", icon: ClipboardList },
    { id: "clients", label: "Client Accounts", icon: Building2 },
  ];
  const nav = portal === "candidate" ? candidateNav : recruiterNav;

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 bg-white border-r border-slate-200 flex flex-col">
      <div className="flex items-center gap-2.5 px-6 h-16 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
          <Zap className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
        </div>
        <span className="font-extrabold text-slate-800 tracking-tight">RecruitAI <span className="text-blue-600">Intel</span></span>
      </div>

      <div className="p-3">
        <div className="flex bg-slate-100 rounded-xl p-1">
          {["candidate", "recruiter"].map((p) => (
            <button
              key={p}
              onClick={() => { setPortal(p); }}
              className={`flex-1 text-xs font-semibold py-2 rounded-lg transition-all duration-200 ${
                portal === p ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {p === "candidate" ? "Candidate" : "Recruiter"}
            </button>
          ))}
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-200"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <Icon className="w-4.5 h-4.5" strokeWidth={2} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-100 space-y-1">
        <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors">
          <Settings className="w-4.5 h-4.5" /> Settings
        </button>
        <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors">
          <LogOut className="w-4.5 h-4.5" /> Sign out
        </button>
      </div>
    </aside>
  );
}

function TopHeader({ title }) {
  return (
    <header className="h-16 sticky top-0 z-10 bg-slate-50/80 backdrop-blur-md flex items-center justify-between px-8 border-b border-slate-200/60">
      <div>
        <h1 className="text-base font-bold text-slate-800">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            placeholder="Search candidates, jobs, clients..."
            className="w-80 pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <button className="relative w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
          <Bell className="w-4.5 h-4.5 text-slate-500" />
          <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
        </button>
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <Avatar initials="AK" size="w-9 h-9" />
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-slate-800 leading-tight">Anik Khan</p>
            <p className="text-xs text-slate-400 leading-tight">Frontend Engineer</p>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </header>
  );
}

/* ------------------------ CANDIDATE: DASHBOARD ------------------------ */

function CandidateDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Welcome back, {candidate.name} 👋</h2>
        <p className="text-slate-500 text-sm mt-1">Here's what's happening with your job search today.</p>
      </div>

      {/* Metric ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="flex items-center gap-5">
          <CircularProgress percentage={candidate.completeness} sublabel="complete" />
          <div>
            <p className="text-sm font-semibold text-slate-800">Profile Completeness</p>
            <p className="text-xs text-slate-400 mt-1">Add 2 more certifications to reach 95%</p>
            <button className="text-xs font-semibold text-blue-600 mt-2 flex items-center gap-1 hover:gap-1.5 transition-all">
              Complete profile <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">Active Applications</p>
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <Briefcase className="w-4.5 h-4.5 text-blue-600" />
            </div>
          </div>
          <p className="text-4xl font-extrabold text-slate-800 mt-4 tracking-tight">{candidate.activeApplications}</p>
          <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +3 this week
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">Profile Views</p>
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <Eye className="w-4.5 h-4.5 text-blue-600" />
            </div>
          </div>
          <p className="text-4xl font-extrabold text-slate-800 mt-4 tracking-tight">{candidate.profileViews}</p>
          <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> 24 recruiters viewed this week
          </p>
        </Card>
      </div>

      {/* AI Matches */}
      <div>
        <SectionHeading
          eyebrow="Powered by RecruitAI"
          title="Recommended AI Matches"
          action={<button className="text-sm font-semibold text-blue-600 flex items-center gap-1">View all <ChevronRight className="w-4 h-4" /></button>}
        />
        <div className="space-y-4">
          {aiMatches.map((job, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/80 via-white to-white backdrop-blur-xl p-6 flex items-center justify-between gap-6 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100 transition-all duration-300"
            >
              <div className="flex items-center gap-5 min-w-0">
                <Avatar initials={job.logo} size="w-14 h-14" tone="bg-white border border-slate-200 !text-blue-600 text-lg shadow-sm" />
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-slate-800 truncate">{job.role}</h3>
                    <MatchBadge value={job.match} />
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{job.company} · <MapPin className="w-3.5 h-3.5 inline -mt-0.5" /> {job.location}</p>
                  <div className="flex gap-2 mt-2.5 flex-wrap">
                    {job.tags.map((t) => <Pill key={t}>{t}</Pill>)}
                    <Pill tone="slate">{job.salary}</Pill>
                  </div>
                </div>
              </div>
              <PrimaryButton className="shrink-0"><Zap className="w-4 h-4" /> 1-Click AI Apply</PrimaryButton>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------ CANDIDATE: FIND JOBS ------------------------ */

function FindJobs() {
  const [remote, setRemote] = useState(true);
  const [hybrid, setHybrid] = useState(false);
  const [salary, setSalary] = useState(35);

  const Toggle = ({ checked, onChange, label }) => (
    <button onClick={onChange} className="w-full flex items-center justify-between py-2.5">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <span className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 ${checked ? "bg-blue-600" : "bg-slate-200"}`} style={{ height: 22, width: 40 }}>
        <span className={`block w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-transform duration-200 ${checked ? "translate-x-[18px]" : "translate-x-0"}`} style={{ height: 18, width: 18 }} />
      </span>
    </button>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Filters */}
      <div className="lg:col-span-1">
        <Card hover={false} className="sticky top-20">
          <div className="flex items-center gap-2 mb-5">
            <SlidersHorizontal className="w-4.5 h-4.5 text-blue-600" />
            <h3 className="font-bold text-slate-800 text-sm">Refine Matches</h3>
          </div>

          <div className="divide-y divide-slate-100">
            <Toggle checked={remote} onChange={() => setRemote(!remote)} label="Remote" />
            <Toggle checked={hybrid} onChange={() => setHybrid(!hybrid)} label="Hybrid" />
          </div>

          <div className="mt-5 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Salary range</span>
              <span className="text-sm font-bold text-blue-600">₹{salary}L+</span>
            </div>
            <input
              type="range" min="10" max="80" value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>₹10L</span><span>₹80L</span>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-slate-100">
            <p className="text-sm font-medium text-slate-600 mb-3">Minimum AI match</p>
            <div className="flex gap-2 flex-wrap">
              {["70%+", "80%+", "90%+"].map((v, i) => (
                <button key={v} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${i === 1 ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-500 border-slate-200 hover:border-blue-300"}`}>{v}</button>
              ))}
            </div>
          </div>

          <PrimaryButton className="w-full mt-6"><Filter className="w-4 h-4" /> Apply Filters</PrimaryButton>
        </Card>
      </div>

      {/* Feed */}
      <div className="lg:col-span-3 space-y-4">
        <SectionHeading title={`${jobsFeed.length} AI-matched roles for you`} />
        {jobsFeed.map((job, i) => (
          <Card key={i} className="flex items-center gap-5">
            <Avatar initials={job.logo} size="w-12 h-12" tone="bg-slate-50 border border-slate-200 !text-slate-600 text-sm" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold text-slate-800">{job.role}</h3>
                <span className="text-xs text-slate-400">{job.posted}</span>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">{job.company} · {job.location} · {job.salary}</p>
              <div className="flex gap-2 mt-2.5 flex-wrap">
                {job.tags.map((t) => <Pill key={t}>{t}</Pill>)}
                <Pill tone="slate">{job.type}</Pill>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-500">AI Match Threshold</span>
                  <span className="text-xs font-bold text-blue-600">{job.match}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" style={{ width: `${job.match}%` }} />
                </div>
              </div>
            </div>
            <PrimaryButton className="shrink-0">Apply</PrimaryButton>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ------------------------ CANDIDATE: RESUME IMPORT ------------------------ */

function ResumeImport() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card hover={false} className="border-dashed border-2 border-blue-200 bg-blue-50/60 flex flex-col items-center justify-center text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-white border border-blue-200 flex items-center justify-center shadow-sm mb-5">
          <UploadCloud className="w-7 h-7 text-blue-600" />
        </div>
        <h3 className="font-bold text-slate-800 text-lg">Drop your resume here</h3>
        <p className="text-sm text-slate-500 mt-1.5 max-w-xs">PDF, DOCX up to 10MB. Our AI parsing engine extracts your profile instantly.</p>
        <PrimaryButton className="mt-6">Browse files</PrimaryButton>
        <p className="text-xs text-slate-400 mt-4">anik_khan_resume_2026.pdf</p>
      </Card>

      <Card hover={false}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="font-bold text-slate-800 text-sm">AI Parsing Engine</h3>
        </div>
        <p className="text-xs text-slate-400 mb-5">Extraction complete · 1.8s</p>

        <div className="space-y-4">
          <Field label="Full Name" value="Anik Khan Pathan" icon={User} />
          <Field label="Email" value="anikkhanpathan685@gmail.com" icon={Mail} />
          <Field label="Current Role" value="Senior Frontend Engineer" icon={Briefcase} />
          <Field label="Experience" value="6.5 years" icon={Clock} />
        </div>

        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-sm font-semibold text-slate-700 mb-3">Detected Tech Stack</p>
          <div className="flex flex-wrap gap-2">
            {detectedStack.map((s) => <Pill key={s}>{s}</Pill>)}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
          <p className="text-xs text-emerald-700 font-medium">Profile auto-filled with 94% confidence. Review before publishing.</p>
        </div>

        <PrimaryButton className="w-full mt-5">Confirm & Update Profile</PrimaryButton>
      </Card>
    </div>
  );
}

function Field({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-blue-600" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-slate-400 font-medium">{label}</p>
        <p className="text-sm font-semibold text-slate-800 truncate">{value}</p>
      </div>
    </div>
  );
}

/* ------------------------ CANDIDATE: PROFILE ------------------------ */

function Timeline({ items }) {
  return (
    <div className="relative pl-6">
      <div className="absolute left-[7px] top-1 bottom-1 w-px bg-slate-200" />
      <div className="space-y-7">
        {items.map((item, i) => (
          <div key={i} className="relative">
            <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-blue-500" />
            <p className="text-xs font-semibold text-blue-600">{item.period}</p>
            <h4 className="font-bold text-slate-800 mt-0.5">{item.role}</h4>
            <p className="text-sm text-slate-500">{item.org}</p>
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CandidateProfile() {
  return (
    <div className="space-y-6">
      <Card className="flex items-center gap-6">
        <Avatar initials="AK" size="w-20 h-20" tone="bg-gradient-to-br from-blue-600 to-blue-400 text-2xl" />
        <div className="flex-1">
          <h2 className="text-xl font-extrabold text-slate-800">{candidate.name}</h2>
          <p className="text-sm text-slate-500 mt-0.5">{candidate.role} · Bengaluru, India</p>
          <div className="flex gap-2 mt-3 flex-wrap">
            {["React", "TypeScript", "System Design"].map((t) => <Pill key={t}>{t}</Pill>)}
          </div>
        </div>
        <PrimaryButton>Edit Profile</PrimaryButton>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card hover={false}>
          <div className="flex items-center gap-2 mb-6">
            <Briefcase className="w-4.5 h-4.5 text-blue-600" />
            <h3 className="font-bold text-slate-800 text-sm">Experience</h3>
          </div>
          <Timeline items={experienceTimeline} />
        </Card>
        <Card hover={false}>
          <div className="flex items-center gap-2 mb-6">
            <GraduationCap className="w-4.5 h-4.5 text-blue-600" />
            <h3 className="font-bold text-slate-800 text-sm">Education</h3>
          </div>
          <Timeline items={educationTimeline} />
        </Card>
      </div>
    </div>
  );
}

/* ------------------------ CANDIDATE: INTERVIEWS ------------------------ */

function Interviews() {
  const columns = [
    { id: "upcoming", label: "Upcoming", tone: "blue" },
    { id: "scheduled", label: "Scheduled", tone: "slate" },
    { id: "done", label: "Completed", tone: "green" },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {columns.map((col) => (
        <div key={col.id}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-700 text-sm">{col.label}</h3>
            <span className="text-xs font-semibold text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">
              {interviews.filter((i) => i.status === col.id).length}
            </span>
          </div>
          <div className="space-y-4">
            {interviews.filter((i) => i.status === col.id).map((iv, i) => (
              <Card key={i} className="!p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{iv.role}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{iv.company}</p>
                  </div>
                  <Pill tone={col.tone === "blue" ? "blue" : col.tone === "green" ? "green" : "slate"}>{iv.stage}</Pill>
                </div>
                <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5" /> {iv.when}
                </div>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                  <User className="w-3.5 h-3.5" /> {iv.interviewer}
                </div>
                {col.id !== "done" && (
                  <PrimaryButton className="w-full mt-4 !py-2"><Video className="w-4 h-4" /> Join Video</PrimaryButton>
                )}
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------ RECRUITER: DASHBOARD ------------------------ */

function RecruiterDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Intelligence Workspace</h2>
        <p className="text-slate-500 text-sm mt-1">Live overview of your pipeline health and AI matching activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {recruiterKPIs.map((kpi, i) => {
          const Icon = kpi.icon;
          const isWarn = kpi.tone === "red";
          return (
            <Card key={i} className={isWarn ? "border-red-100 relative overflow-hidden" : ""}>
              {isWarn && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-400" />}
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500">{kpi.label}</p>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isWarn ? "bg-red-50" : "bg-blue-50"}`}>
                  <Icon className={`w-4.5 h-4.5 ${isWarn ? "text-red-500" : "text-blue-600"}`} />
                </div>
              </div>
              <p className="text-4xl font-extrabold text-slate-800 mt-4 tracking-tight">{kpi.value}</p>
              <p className={`text-xs font-medium mt-2 flex items-center gap-1 ${isWarn ? "text-red-500" : "text-emerald-600"}`}>
                {isWarn ? <AlertTriangle className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />} {kpi.delta}
              </p>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" hover={false}>
          <SectionHeading title="Top Requisitions" />
          <div className="space-y-3">
            {jobReqs.map((req, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{req.title}</p>
                  <p className="text-xs text-slate-400">{req.client} · {req.applicants} applicants</p>
                </div>
                <div className="flex items-center gap-4">
                  <Pill tone="blue">{req.matches} AI matches</Pill>
                  <Pill tone={req.status === "Active" ? "green" : "slate"}>{req.status}</Pill>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card hover={false}>
          <SectionHeading title="Top AI Matches" />
          <div className="space-y-4">
            {talentPool.slice(0, 3).map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                <Avatar initials={t.avatar} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm truncate">{t.name}</p>
                  <p className="text-xs text-slate-400 truncate">{t.role}</p>
                </div>
                <span className="text-sm font-extrabold text-blue-600">{t.match}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ------------------------ RECRUITER: TALENT POOL ------------------------ */

function TalentPool() {
  const [view, setView] = useState("grid");
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeading title="Job Requisitions & Talent Pool" />
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-slate-200 rounded-xl p-1">
            <button onClick={() => setView("grid")} className={`p-2 rounded-lg transition-colors ${view === "grid" ? "bg-blue-50 text-blue-600" : "text-slate-400"}`}><Grid3x3 className="w-4 h-4" /></button>
            <button onClick={() => setView("list")} className={`p-2 rounded-lg transition-colors ${view === "list" ? "bg-blue-50 text-blue-600" : "text-slate-400"}`}><List className="w-4 h-4" /></button>
          </div>
          <PrimaryButton><Plus className="w-4 h-4" /> New Requisition</PrimaryButton>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {jobReqs.map((r) => <Pill key={r.title} tone="slate">{r.title} ({r.client})</Pill>)}
      </div>

      <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5" : "space-y-3"}>
        {talentPool.map((t, i) => (
          <Card key={i} className={view === "list" ? "flex items-center gap-5" : ""}>
            <div className={view === "list" ? "flex items-center gap-4 flex-1" : "flex items-center gap-4 mb-4"}>
              <Avatar initials={t.avatar} size="w-12 h-12" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800">{t.name}</p>
                <p className="text-sm text-slate-500">{t.role}</p>
              </div>
              {view === "list" && (
                <div className="flex gap-2">{t.skills.map((s) => <Pill key={s} tone="slate">{s}</Pill>)}</div>
              )}
            </div>

            {view === "grid" && (
              <div className="flex gap-2 flex-wrap mb-4">
                {t.skills.map((s) => <Pill key={s} tone="slate">{s}</Pill>)}
              </div>
            )}

            <div className={view === "list" ? "flex items-center gap-6 shrink-0" : "flex items-center justify-between"}>
              {t.verified && (
                <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4" /> Skills Verified (AI)
                </div>
              )}
              <p className="text-2xl font-extrabold text-blue-600">{t.match}<span className="text-sm text-slate-400">%</span></p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ------------------------ RECRUITER: SCREENING ------------------------ */

function ScreeningPipeline() {
  const [selected, setSelected] = useState(screeningCandidates[0]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card hover={false} className="lg:col-span-1 !p-4">
        <p className="text-sm font-bold text-slate-800 px-2 mb-3">Pending Review ({screeningCandidates.length})</p>
        <div className="space-y-1">
          {screeningCandidates.map((c, i) => (
            <button
              key={i}
              onClick={() => setSelected(c)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors ${selected.name === c.name ? "bg-blue-50 border border-blue-100" : "hover:bg-slate-50 border border-transparent"}`}
            >
              <Avatar initials={c.avatar} size="w-10 h-10" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{c.name}</p>
                <p className="text-xs text-slate-400 truncate">{c.role}</p>
              </div>
              {c.flags > 0 && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
                  <Flag className="w-3 h-3" /> {c.flags}
                </span>
              )}
              <span className="text-sm font-extrabold text-blue-600">{c.match}%</span>
            </button>
          ))}
        </div>
      </Card>

      <div className="lg:col-span-2 space-y-6">
        <Card hover={false}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Avatar initials={selected.avatar} size="w-14 h-14" />
              <div>
                <h3 className="font-extrabold text-slate-800 text-lg">{selected.name}</h3>
                <p className="text-sm text-slate-500">{selected.role}</p>
              </div>
            </div>
            <MatchBadge value={selected.match} size="lg" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-sm font-bold text-slate-700 mb-2">Skills Radar</p>
              <div style={{ width: "100%", height: 220 }}>
                <ResponsiveContainer>
                  <RadarChart data={radarData} outerRadius={80}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="skill" tick={{ fill: "#64748b", fontSize: 11 }} />
                    <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                    <Radar dataKey="value" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.35} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
                <p className="text-xs text-emerald-700 font-medium">Identity verified via AI proctoring</p>
              </div>
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                <AlertTriangle className="w-4.5 h-4.5 text-amber-600" />
                <p className="text-xs text-amber-700 font-medium">{selected.flags} integrity flags detected during interview</p>
              </div>
              <button className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 text-slate-600 font-semibold px-5 py-2.5 text-sm hover:bg-slate-50 transition-colors">
                <PauseCircle className="w-4 h-4" /> Hold for Manual Review
              </button>
              <PrimaryButton className="w-full">Advance to Client</PrimaryButton>
            </div>
          </div>
        </Card>

        <Card hover={false}>
          <SectionHeading title="Video Interview Timeline" action={<Pill tone="slate">24:08 duration</Pill>} />
          <div className="relative pl-6">
            <div className="absolute left-[7px] top-1 bottom-1 w-px bg-slate-200" />
            <div className="space-y-5">
              {interviewTimelineFlags.map((f, i) => (
                <div key={i} className="relative flex items-start gap-3">
                  <div className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 bg-white ${f.tone === "warn" ? "border-amber-500" : "border-emerald-500"}`} />
                  <span className="text-xs font-mono font-semibold text-slate-400 w-12 shrink-0">{f.time}</span>
                  <p className={`text-sm ${f.tone === "warn" ? "text-amber-700 font-medium" : "text-slate-600"}`}>{f.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ------------------------ RECRUITER: CLIENTS ------------------------ */

function ClientAccounts() {
  const healthColor = { green: "bg-emerald-500", yellow: "bg-amber-500", red: "bg-red-500" };
  const healthLabel = { green: "Healthy", yellow: "At Risk", red: "Critical" };
  return (
    <div className="space-y-6">
      <SectionHeading
        title="Client Accounts"
        action={<PrimaryButton><Plus className="w-4 h-4" /> Add Client</PrimaryButton>}
      />
      <Card hover={false} className="!p-0 overflow-hidden">
        <div className="grid grid-cols-12 px-6 py-3.5 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wide">
          <div className="col-span-4">Client</div>
          <div className="col-span-2">Open Reqs</div>
          <div className="col-span-2">Pipeline Health</div>
          <div className="col-span-2">Revenue (MTD)</div>
          <div className="col-span-2">Account Owner</div>
        </div>
        <div className="divide-y divide-slate-100">
          {clients.map((c, i) => (
            <div key={i} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-slate-50/60 transition-colors">
              <div className="col-span-4 flex items-center gap-3">
                <Avatar initials={c.name.split(" ").map((w) => w[0]).join("").slice(0, 2)} size="w-10 h-10" tone="bg-slate-100 !text-slate-600 border border-slate-200" />
                <span className="font-semibold text-slate-800 text-sm">{c.name}</span>
              </div>
              <div className="col-span-2 text-sm font-semibold text-slate-700">{c.reqs}</div>
              <div className="col-span-2 flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${healthColor[c.health]}`} />
                <span className="text-sm text-slate-600">{healthLabel[c.health]}</span>
              </div>
              <div className="col-span-2 text-sm font-bold text-slate-800">{c.revenue}</div>
              <div className="col-span-2 text-sm text-slate-500">{c.contact}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ----------------------------- APP ROOT ----------------------------- */

export default function App() {
  const [portal, setPortal] = useState("candidate");
  const [candidatePage, setCandidatePage] = useState("dashboard");
  const [recruiterPage, setRecruiterPage] = useState("dashboard");

  const page = portal === "candidate" ? candidatePage : recruiterPage;
  const setPage = portal === "candidate" ? setCandidatePage : setRecruiterPage;

  const titles = {
    candidate: { dashboard: "Dashboard", jobs: "Find AI Jobs", resume: "AI Resume Import", profile: "My Profile", interviews: "Interviews" },
    recruiter: { dashboard: "Intelligence Workspace", talent: "Job Requisitions & Talent Pool", screening: "AI Screening Pipeline", clients: "Client Accounts" },
  };

  function renderContent() {
    if (portal === "candidate") {
      if (page === "dashboard") return <CandidateDashboard />;
      if (page === "jobs") return <FindJobs />;
      if (page === "resume") return <ResumeImport />;
      if (page === "profile") return <CandidateProfile />;
      if (page === "interviews") return <Interviews />;
    } else {
      if (page === "dashboard") return <RecruiterDashboard />;
      if (page === "talent") return <TalentPool />;
      if (page === "screening") return <ScreeningPipeline />;
      if (page === "clients") return <ClientAccounts />;
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
      <Sidebar portal={portal} setPortal={setPortal} page={page} setPage={setPage} />
      <div className="flex-1 min-w-0">
        <TopHeader title={titles[portal][page]} />
        <main className="p-8">{renderContent()}</main>
      </div>
    </div>
  );
}
