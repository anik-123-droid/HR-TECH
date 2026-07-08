import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';

export default function SuperAdminAiTokenUsage() {
  const { agencies } = useApp();

  const totalTokensAllocated = useMemo(() => {
    return agencies.reduce((sum, agency) => {
      const tokens = parseInt(agency.tokens.replace(/,/g, '') || '0', 10);
      return sum + tokens;
    }, 0);
  }, [agencies]);

  // Mock token usage statistics
  const totalTokensUsed = Math.floor(totalTokensAllocated * 0.42); // 42% used
  const totalCost = totalTokensUsed * 0.00001; // E.g., $0.01 per 1k tokens
  
  const agenciesUsage = useMemo(() => {
    return agencies.map((agency, index) => {
      const allocated = parseInt(agency.tokens.replace(/,/g, '') || '0', 10);
      // Deterministic mock usage percentage based on index
      const usagePercentage = 10 + ((index * 27) % 80); 
      const used = Math.floor(allocated * (usagePercentage / 100));
      return {
        id: agency.id,
        name: agency.name,
        plan: agency.plan,
        allocated,
        used,
        usagePercentage,
        status: agency.status
      };
    }).sort((a, b) => b.used - a.used);
  }, [agencies]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-emerald-900 tracking-tight">AI Token Usage</h1>
          <p className="text-[14px] text-slate-500 mt-1">Monitor platform-wide AI token consumption and optimize costs.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-900 hover:bg-black text-white text-[13px] font-semibold rounded-lg transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          Allocate Tokens
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm flex flex-col justify-center">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center justify-between">
            <span>Total Tokens Allocated</span>
            <span className="material-symbols-outlined text-slate-400 text-[16px]">database</span>
          </div>
          <div className="text-3xl font-bold text-emerald-900">{totalTokensAllocated.toLocaleString()}</div>
        </div>
        <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm flex flex-col justify-center">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center justify-between">
            <span>Tokens Consumed</span>
            <span className="material-symbols-outlined text-orange-400 text-[16px]">electric_bolt</span>
          </div>
          <div className="text-3xl font-bold text-orange-600">{totalTokensUsed.toLocaleString()}</div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-orange-500 h-full rounded-full" style={{ width: `${(totalTokensUsed / (totalTokensAllocated || 1)) * 100}%` }}></div>
          </div>
        </div>
        <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm flex flex-col justify-center">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center justify-between">
            <span>Estimated Cost (API)</span>
            <span className="material-symbols-outlined text-emerald-500 text-[16px]">payments</span>
          </div>
          <div className="text-3xl font-bold text-emerald-600">${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-emerald-900">Organization Token Usage</h3>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-slate-400">search</span>
            <input type="text" placeholder="Search..." className="pl-8 pr-3 py-1.5 w-48 text-[12px] border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-emerald-500" />
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 bg-slate-50/50">
              <th className="text-left px-5 py-3">Organization</th>
              <th className="text-left px-5 py-3">Plan</th>
              <th className="text-left px-5 py-3">Allocated</th>
              <th className="text-left px-5 py-3">Consumed</th>
              <th className="text-left px-5 py-3">Usage %</th>
              <th className="text-right px-5 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {agenciesUsage.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-500 text-[13px]">No organizations found.</td>
              </tr>
            ) : (
              agenciesUsage.map(agency => (
                <tr key={agency.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <span className="text-[13px] font-semibold text-emerald-900">{agency.name}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{agency.plan}</span>
                  </td>
                  <td className="px-5 py-3 text-[13px] font-medium text-slate-600">{agency.allocated.toLocaleString()}</td>
                  <td className="px-5 py-3 text-[13px] font-bold text-slate-800">{agency.used.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${agency.usagePercentage > 80 ? 'bg-red-500' : agency.usagePercentage > 50 ? 'bg-orange-400' : 'bg-emerald-500'}`} 
                          style={{ width: `${agency.usagePercentage}%` }}
                        ></div>
                      </div>
                      <span className={`text-[11px] font-bold ${agency.usagePercentage > 80 ? 'text-red-600' : 'text-slate-600'}`}>{agency.usagePercentage}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => alert(`Allocating more tokens to ${agency.name}`)} className="text-[12px] font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer">Adjust Quota</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
