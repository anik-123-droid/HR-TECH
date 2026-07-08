// @ts-nocheck
import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';

export default function RecruiterClients() {
  const { clients: contextClients, addClient, updateClient, deleteClient } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    activeRoles: 0,
    pipeline: 0,
    contactName: '',
    contactEmail: '',
    status: 'Account Healthy',
    revenue: 0
  });

  const allClients = useMemo(() => {
    return contextClients.map(c => ({
      id: c.id,
      name: c.name,
      industry: c.industry,
      activeRoles: c.activeRoles || 0,
      pipeline: c.pipeline || 0,
      contact: c.contactName,
      email: c.contactEmail,
      status: c.status === 'Account Healthy' ? 'Healthy' : c.status === 'Action Required' ? 'At Risk' : 'Onboarding',
      statusColor: c.status === 'Account Healthy' ? 'text-green-600' : c.status === 'Action Required' ? 'text-red-500' : 'text-emerald-600',
      revenue: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(c.revenue || 0),
      rawRevenue: c.revenue || 0,
      rawStatus: c.status
    }));
  }, [contextClients]);

  const clients = useMemo(() => {
    let filtered = allClients;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(c => c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q) || c.contact.toLowerCase().includes(q));
    }
    if (statusFilter) {
      filtered = filtered.filter(c => c.status === statusFilter);
    }
    return filtered;
  }, [searchQuery, statusFilter, allClients]);

  const openAddModal = () => {
    setEditingClient(null);
    setFormData({
      name: '',
      industry: 'Enterprise Tech',
      activeRoles: 0,
      pipeline: 0,
      contactName: '',
      contactEmail: '',
      status: 'Onboarding',
      revenue: 0
    });
    setIsModalOpen(true);
  };

  const handleSaveClient = () => {
    if (!formData.name.trim()) {
      alert("Client name is required.");
      return;
    }
    
    if (editingClient) {
      updateClient(editingClient.id, formData);
      alert(`✅ Updated client: ${formData.name}`);
    } else {
      addClient({
        name: formData.name.trim(),
        industry: formData.industry,
        activeRoles: formData.activeRoles,
        pipeline: formData.pipeline,
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        status: formData.status as any,
        revenue: formData.revenue
      });
      alert(`✅ Added new client: ${formData.name.trim()}`);
    }
    setIsModalOpen(false);
  };

  const handleExport = () => {
    const csv = 'Client,Industry,Active Roles,Pipeline,Contact,Revenue,Status\n' +
      clients.map(c => `${c.name},${c.industry},${c.activeRoles},${c.pipeline},${c.contact},${c.revenue},${c.status}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clients_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleManage = (client: any) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      industry: client.industry,
      activeRoles: client.activeRoles,
      pipeline: client.pipeline,
      contactName: client.contact,
      contactEmail: client.email,
      status: client.rawStatus,
      revenue: client.rawRevenue
    });
    setIsModalOpen(true);
  };

  const handleDeleteClient = () => {
    if (editingClient && window.confirm(`Are you sure you want to permanently delete the client "${editingClient.name}"?`)) {
      deleteClient(editingClient.id);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-emerald-900 tracking-tight">Client Accounts</h1>
          <p className="text-[14px] text-slate-500 mt-1">Manage your B2B client relationships and active requisitions.</p>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-900 hover:bg-black text-white text-[13px] font-semibold rounded-lg transition-colors cursor-pointer">
          <span className="text-lg leading-none">+</span> Add New Client
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="border border-slate-200 rounded-xl p-4">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Active Clients</div>
 <div className=" text-3xl font-bold text-emerald-900">{allClients.length}</div>
        </div>
        <div className="border border-slate-200 rounded-xl p-4">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Open Requisitions</div>
 <div className=" text-3xl font-bold text-emerald-600">{allClients.reduce((sum, c) => sum + c.activeRoles, 0)}</div>
        </div>
        <div className="border border-slate-200 rounded-xl p-4">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Revenue (YTD)</div>
 <div className=" text-3xl font-bold text-green-600">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(allClients.reduce((sum, c) => sum + c.rawRevenue, 0))}
          </div>
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-slate-500">search</span>
            <input type="text" placeholder="Search clients..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8 pr-3 py-1.5 w-64 text-[13px] border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-500" />
          </div>
          <div className="flex items-center gap-2">
            <select value={statusFilter || ''} onChange={(e) => setStatusFilter(e.target.value || null)} className="px-3 py-1.5 border border-slate-200 rounded-lg text-[13px] font-medium text-slate-700 bg-white focus:outline-none focus:border-emerald-500 cursor-pointer">
              <option value="">All Status</option>
              <option value="Healthy">Healthy</option>
              <option value="At Risk">At Risk</option>
              <option value="Onboarding">Onboarding</option>
            </select>
            <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[16px]">download</span> Export CSV
            </button>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <th className="text-left px-5 py-2.5">Client</th>
              <th className="text-left px-5 py-2.5">Industry</th>
              <th className="text-left px-5 py-2.5">Active Roles</th>
              <th className="text-left px-5 py-2.5">Pipeline</th>
              <th className="text-left px-5 py-2.5">Primary Contact</th>
              <th className="text-left px-5 py-2.5">Revenue</th>
              <th className="text-left px-5 py-2.5">Status</th>
              <th className="text-right px-5 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-8 text-slate-500 text-[14px]">No clients match your search.</td></tr>
            ) : clients.map(c => (
              <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => handleManage(c)}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
                      <span className="material-symbols-outlined text-[14px] text-slate-500">domain</span>
                    </div>
                    <span className="text-[13px] font-semibold text-emerald-900">{c.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3"><span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{c.industry}</span></td>
                <td className="px-5 py-3 text-[13px] font-semibold text-emerald-900">{c.activeRoles}</td>
                <td className="px-5 py-3 text-[13px] text-slate-600">{c.pipeline}</td>
                <td className="px-5 py-3">
                  <div className="text-[13px] text-emerald-900">{c.contact}</div>
                  <div className="text-[11px] text-slate-500">{c.email}</div>
                </td>
                <td className="px-5 py-3 text-[13px] font-semibold text-emerald-900">{c.revenue}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${c.status === 'Healthy' ? 'bg-green-500' : c.status === 'At Risk' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                    <span className={`text-[12px] font-semibold ${c.statusColor}`}>{c.status}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-right">
                  <button onClick={(e) => { e.stopPropagation(); handleManage(c); }} className="text-[12px] font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer">Manage →</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col relative animate-slide-up border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-emerald-900">
                {editingClient ? 'Edit Client Account' : 'Add New Client'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-900 cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1">Company Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 text-[14px] border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" placeholder="e.g. Acme Corp" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1">Industry</label>
                  <input type="text" value={formData.industry} onChange={e => setFormData({ ...formData, industry: e.target.value })} className="w-full px-4 py-2 text-[14px] border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" placeholder="e.g. Fintech" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as any })} className="w-full px-4 py-2 text-[14px] border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white">
                    <option value="Onboarding">Onboarding</option>
                    <option value="Account Healthy">Account Healthy</option>
                    <option value="Action Required">Action Required</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1">Active Roles</label>
                  <input type="number" value={formData.activeRoles} onChange={e => setFormData({ ...formData, activeRoles: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 text-[14px] border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1">Pipeline Size</label>
                  <input type="number" value={formData.pipeline} onChange={e => setFormData({ ...formData, pipeline: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 text-[14px] border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1">Revenue ($)</label>
                  <input type="number" value={formData.revenue} onChange={e => setFormData({ ...formData, revenue: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 text-[14px] border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-[13px] font-bold text-emerald-900 mb-3">Primary Contact</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[12px] font-bold text-slate-700 mb-1">Name</label>
                    <input type="text" value={formData.contactName} onChange={e => setFormData({ ...formData, contactName: e.target.value })} className="w-full px-4 py-2 text-[14px] border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" placeholder="Contact Name" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-slate-700 mb-1">Email</label>
                    <input type="email" value={formData.contactEmail} onChange={e => setFormData({ ...formData, contactEmail: e.target.value })} className="w-full px-4 py-2 text-[14px] border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" placeholder="contact@company.com" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 flex justify-between gap-3 bg-slate-50">
              <div>
                {editingClient && (
                  <button onClick={handleDeleteClient} className="px-5 py-2.5 text-[13px] font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                    Delete Client
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-[13px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer">
                  Cancel
                </button>
                <button onClick={handleSaveClient} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-bold rounded-lg shadow-sm transition-colors cursor-pointer">
                  {editingClient ? 'Save Changes' : 'Create Client'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
