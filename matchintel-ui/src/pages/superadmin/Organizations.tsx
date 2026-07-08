import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';

export default function SuperAdminOrganizations() {
  const { agencies, addAgency, updateAgency, deleteAgency } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgency, setEditingAgency] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    plan: 'Pro',
    tokens: '0',
    candidates: '0',
    status: 'Active'
  });

  const filteredAgencies = useMemo(() => {
    let filtered = agencies;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(a => a.name.toLowerCase().includes(q) || a.plan.toLowerCase().includes(q));
    }
    if (statusFilter) {
      filtered = filtered.filter(a => a.status === statusFilter);
    }
    return filtered;
  }, [searchQuery, statusFilter, agencies]);

  const openAddModal = () => {
    setEditingAgency(null);
    setFormData({
      name: '',
      plan: 'Pro',
      tokens: '500,000',
      candidates: '0',
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleSaveAgency = () => {
    if (!formData.name.trim()) {
      alert("Organization name is required.");
      return;
    }
    
    if (editingAgency) {
      updateAgency(editingAgency.id, { ...formData, status: formData.status as any });
      alert(`✅ Updated organization: ${formData.name}`);
    } else {
      addAgency({
        name: formData.name.trim(),
        plan: formData.plan,
        tokens: formData.tokens,
        candidates: formData.candidates,
        status: formData.status as any
      });
      alert(`✅ Added new organization: ${formData.name.trim()}`);
    }
    setIsModalOpen(false);
  };

  const handleManage = (agency: any) => {
    setEditingAgency(agency);
    setFormData({
      name: agency.name,
      plan: agency.plan,
      tokens: agency.tokens,
      candidates: agency.candidates,
      status: agency.status
    });
    setIsModalOpen(true);
  };

  const handleDeleteAgency = () => {
    if (editingAgency && window.confirm(`Are you sure you want to permanently delete the organization "${editingAgency.name}"?`)) {
      deleteAgency(editingAgency.id);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-emerald-900 tracking-tight">Organizations</h1>
          <p className="text-[14px] text-slate-500 mt-1">Manage recruiting agencies and their associated users.</p>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-900 hover:bg-black text-white text-[13px] font-semibold rounded-lg transition-colors cursor-pointer">
          <span className="text-lg leading-none">+</span> Add Organization
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="border border-slate-200 rounded-xl p-4">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Organizations</div>
 <div className=" text-3xl font-bold text-emerald-900">{agencies.length}</div>
        </div>
        <div className="border border-slate-200 rounded-xl p-4">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Active Candidates</div>
 <div className=" text-3xl font-bold text-emerald-800">{agencies.reduce((sum, a) => sum + parseInt(a.candidates.replace(/,/g, '') || '0', 10), 0)}</div>
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-slate-500">search</span>
            <input type="text" placeholder="Search organizations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8 pr-3 py-1.5 w-64 text-[13px] border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-emerald-700 placeholder:text-slate-500" />
          </div>
          <div className="flex items-center gap-2">
            <select value={statusFilter || ''} onChange={(e) => setStatusFilter(e.target.value || null)} className="px-3 py-1.5 border border-slate-200 rounded-lg text-[13px] font-medium text-slate-700 bg-white focus:outline-none focus:border-emerald-700 cursor-pointer">
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <th className="text-left px-5 py-2.5">Organization</th>
              <th className="text-left px-5 py-2.5">Plan</th>
              <th className="text-left px-5 py-2.5">Tokens Usage</th>
              <th className="text-left px-5 py-2.5">Candidates</th>
              <th className="text-left px-5 py-2.5">Status</th>
              <th className="text-right px-5 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {filteredAgencies.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-slate-500 text-[14px]">No organizations match your search.</td></tr>
            ) : filteredAgencies.map(a => (
              <tr key={a.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => handleManage(a)}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
                      <span className="material-symbols-outlined text-[14px] text-slate-500">corporate_fare</span>
                    </div>
                    <span className="text-[13px] font-semibold text-emerald-900">{a.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3"><span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{a.plan}</span></td>
                <td className="px-5 py-3 text-[13px] font-semibold text-emerald-900">{a.tokens}</td>
                <td className="px-5 py-3 text-[13px] text-slate-600">{a.candidates}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${a.status === 'Active' ? 'bg-green-700' : 'bg-red-500'}`} />
                    <span className={`text-[12px] font-semibold ${a.status === 'Active' ? 'text-green-800' : 'text-red-500'}`}>{a.status}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-right">
                  <button onClick={(e) => { e.stopPropagation(); handleManage(a); }} className="text-[12px] font-semibold text-emerald-800 hover:text-emerald-900 cursor-pointer">Manage →</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Organization Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col relative animate-slide-up border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-emerald-900">
                {editingAgency ? 'Edit Organization' : 'Add New Organization'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-900 cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1">Organization Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 text-[14px] border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700" placeholder="e.g. Acme Agency" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1">Plan</label>
                  <select value={formData.plan} onChange={e => setFormData({ ...formData, plan: e.target.value })} className="w-full px-4 py-2 text-[14px] border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 bg-white">
                    <option value="Basic">Basic</option>
                    <option value="Pro">Pro</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as any })} className="w-full px-4 py-2 text-[14px] border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 bg-white">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1">Tokens Usage</label>
                  <input type="text" value={formData.tokens} onChange={e => setFormData({ ...formData, tokens: e.target.value })} className="w-full px-4 py-2 text-[14px] border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700" placeholder="e.g. 500,000" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1">Candidates</label>
                  <input type="text" value={formData.candidates} onChange={e => setFormData({ ...formData, candidates: e.target.value })} className="w-full px-4 py-2 text-[14px] border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700" placeholder="e.g. 150" />
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 flex justify-between gap-3 bg-slate-50">
              <div>
                {editingAgency && (
                  <button onClick={handleDeleteAgency} className="px-5 py-2.5 text-[13px] font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                    Delete Organization
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-[13px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer">
                  Cancel
                </button>
                <button onClick={handleSaveAgency} className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-[13px] font-bold rounded-lg shadow-sm transition-colors cursor-pointer">
                  {editingAgency ? 'Save Changes' : 'Create Organization'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

