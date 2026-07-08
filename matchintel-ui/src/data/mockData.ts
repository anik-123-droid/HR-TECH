export const candidates = [
  {
    id: "C1",
    name: "Elena Rodriguez",
    role: "Senior React Developer",
    company: "TechFlow Inc.",
    score: 94,
    skills: ["React", "TypeScript", "Node.js", "GraphQL"],
    status: "Ready for Review",
    trustBadge: "Skills Verified (Project Evidence)",
    riskBadge: "Title Inflation Risk"
  },
  {
    id: "C2",
    name: "Michael Chang",
    role: "Backend Engineer",
    company: "DataSync Solutions",
    score: 88,
    skills: ["Python", "Django", "PostgreSQL", "AWS"],
    status: "In Progress",
    trustBadge: "Education Verified",
    riskBadge: null
  },
  {
    id: "C3",
    name: "Sarah Connor",
    role: "Full Stack Developer",
    company: "FutureTech",
    score: 76,
    skills: ["Vue.js", "Ruby on Rails", "Docker"],
    status: "Pending",
    trustBadge: null,
    riskBadge: "High Churn Rate"
  }
];

export const clients = [
  {
    id: "CL1",
    name: "TechFlow Inc.",
    industry: "SaaS",
    activeRoles: 12,
    pipeline: 48,
    contactName: "Sarah Jenkins",
    contactEmail: "sarah@techflow.com",
    status: "Account Healthy",
    icon: "domain"
  },
  {
    id: "CL2",
    name: "Global Pay",
    industry: "FinTech",
    activeRoles: 8,
    pipeline: 32,
    contactName: "Michael Chen",
    contactEmail: "mchen@globalpay.com",
    status: "Account Healthy",
    icon: "account_balance"
  },
  {
    id: "CL3",
    name: "MediCare Health",
    industry: "Healthcare",
    activeRoles: 4,
    pipeline: 15,
    contactName: "Emily Davis",
    contactEmail: "edavis@medicare.com",
    status: "Action Required",
    icon: "local_hospital"
  }
];

export const interviews = [
  {
    id: "I1",
    timeSlot: "10:00 AM - 11:00 AM",
    candidateName: "Michael Chang",
    role: "Backend Engineer",
    type: "Technical Screen",
    isNext: true
  },
  {
    id: "I2",
    timeSlot: "01:30 PM - 02:15 PM",
    candidateName: "Elena Rodriguez",
    role: "Senior React Developer",
    type: "System Design",
    isNext: false
  },
  {
    id: "I3",
    timeSlot: "04:00 PM - 05:00 PM",
    candidateName: "Sarah Connor",
    role: "Product Designer",
    type: "Culture Fit",
    isNext: false
  }
];
