

import { useApp } from '../../context/AppContext';

export default function SuperAdminDashboard() {
  const { clients, globalCandidates } = useApp();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-headline-md text-on-background font-display font-bold text-3xl text-emerald-900">System Overview</h1>
          <p className="text-body-lg text-secondary mt-1 text-slate-500">Platform-wide metrics and multi-tenant health.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-start mb-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Clients</div>
            <span className="material-symbols-outlined text-indigo-600">domain</span>
          </div>
 <div className=" text-3xl font-extrabold text-emerald-900">{clients.length}</div>
          <p className="text-xs text-slate-500 mt-2 font-medium">Active Subscriptions</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-start mb-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI API Requests (24h)</div>
            <span className="material-symbols-outlined text-purple-600">memory</span>
          </div>
 <div className=" text-3xl font-extrabold text-emerald-900">
            {globalCandidates.length * 45} 
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">Real-time LLM Parsing & Embeddings</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-start mb-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Indexed Candidates</div>
            <span className="material-symbols-outlined text-emerald-800">database</span>
          </div>
 <div className=" text-3xl font-extrabold text-emerald-900">{globalCandidates.length}</div>
          <p className="text-xs text-slate-500 mt-2 font-medium">Across all tenant agencies</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden mt-8">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="font-display font-bold text-lg text-emerald-900">Recent Client Activity</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Client Name</th>
                <th className="px-6 py-4">Industry</th>
                <th className="px-6 py-4">Revenue</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {clients.length === 0 ? (
                <tr className="hover:bg-slate-50 transition-colors">
                  <td colSpan={4} className="px-6 py-8 text-center font-medium text-slate-500">No clients found. Add a client to see activity.</td>
                </tr>
              ) : (
                clients.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-emerald-900">{c.name}</td>
                    <td className="px-6 py-4 font-semibold text-indigo-600">{c.industry}</td>
                    <td className="px-6 py-4 font-medium text-slate-600">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(c.revenue || 0)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-full ${c.status === 'Account Healthy' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

