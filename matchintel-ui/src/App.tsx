import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SuperAdminLogin from './pages/SuperAdminLogin';

// Layouts
import CandidateLayout from './layouts/CandidateLayout';
import RecruiterLayout from './layouts/RecruiterLayout';
import SuperAdminLayout from './layouts/SuperAdminLayout';

// Candidate Pages
import CandidateDashboard from './pages/candidate/Dashboard';
import CandidateProfile from './pages/candidate/Profile';
import CandidateApplications from './pages/candidate/Applications';
import CandidateResumeImport from './pages/candidate/ResumeUpload';
import CandidateInterviews from './pages/candidate/Interviews';
import ProctoredTest from './pages/candidate/ProctoredTest';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/Dashboard';
import RecruiterJobs from './pages/recruiter/Jobs';
import RecruiterCandidates from './pages/recruiter/Candidates';
import RecruiterAiScreening from './pages/recruiter/AiScreening';
import RecruiterInterviews from './pages/recruiter/Interviews';

// Super Admin Pages
import SuperAdminDashboard from './pages/superadmin/Dashboard';
import SuperAdminClients from './pages/superadmin/Clients';
import SuperAdminGlobalCandidates from './pages/superadmin/GlobalCandidates';
import SuperAdminOrganizations from './pages/superadmin/Organizations';
import SuperAdminBilling from './pages/superadmin/Billing';
import SuperAdminAiTokenUsage from './pages/superadmin/AiTokenUsage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/:superadminName" element={<SuperAdminLogin />} />
      
      {/* Candidate Routes */}
      <Route path="/candidate" element={<CandidateLayout />}>
        <Route path="dashboard" element={<CandidateDashboard />} />
        <Route path="profile" element={<CandidateProfile />} />
        <Route path="resume-upload" element={<CandidateResumeImport />} />
        <Route path="applications" element={<CandidateApplications />} />
        <Route path="interviews" element={<CandidateInterviews />} />
        <Route path="test/:appId" element={<ProctoredTest />} />
        <Route path="*" element={<div className="p-8"><h1 className="text-title-lg">Under Construction</h1><p className="text-secondary mt-2">This page is currently being built.</p></div>} />
      </Route>

      {/* Recruiter Routes */}
      <Route path="/recruiter" element={<RecruiterLayout />}>
        <Route path="dashboard" element={<RecruiterDashboard />} />
        <Route path="jobs" element={<RecruiterJobs />} />
        <Route path="candidates" element={<RecruiterCandidates />} />
        <Route path="ai-screening" element={<RecruiterAiScreening />} />
        <Route path="interviews" element={<RecruiterInterviews />} />
        <Route path="*" element={<div className="p-8"><h1 className="text-title-lg">Under Construction</h1><p className="text-secondary mt-2">This page is currently being built.</p></div>} />
      </Route>

      {/* Super Admin Routes */}
      <Route path="/super-admin" element={<SuperAdminLayout />}>
        <Route path="dashboard" element={<SuperAdminDashboard />} />
        <Route path="global-candidates" element={<SuperAdminGlobalCandidates />} />
        <Route path="clients" element={<SuperAdminClients />} />
        <Route path="organizations" element={<SuperAdminOrganizations />} />
        <Route path="billing" element={<SuperAdminBilling />} />
        <Route path="ai-usage" element={<SuperAdminAiTokenUsage />} />
        <Route path="*" element={<div className="p-8"><h1 className="text-title-lg">Under Construction</h1><p className="text-secondary mt-2">This page is currently being built.</p></div>} />
      </Route>
    </Routes>
  );
}

export default App;
