import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';

export default function SuperAdminBilling() {
  const { clients } = useApp();

  const totalRevenue = useMemo(() => {
    return clients.reduce((sum, client) => sum + (client.revenue || 0), 0);
  }, [clients]);

  const planStats = useMemo(() => {
    const stats = { Basic: 0, Pro: 0, Enterprise: 0 };
    clients.forEach((_, index) => {
      if (index % 3 === 0) stats.Enterprise++;
      else if (index % 2 === 0) stats.Pro++;
      else stats.Basic++;
    });
    return stats;
  }, [clients]);

  const recentTransactions = useMemo(() => {
    // Generate some mock transactions based on real clients for visual appeal
    // In a real app this would come from a backend (e.g. Stripe)
    return clients.slice(0, 5).map((client, index) => ({
      id: `trx_${Date.now()}_${index}`,
      client: client.name,
      amount: client.revenue || 0,
      date: new Date(Date.now() - index * 86400000 * 2).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Paid',
      plan: 'Custom'
    }));
  }, [clients]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-emerald-900 tracking-tight">Billing & Plans</h1>
          <p className="text-[14px] text-slate-500 mt-1">Manage subscription plans and track platform revenue.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-900 hover:bg-black text-white text-[13px] font-semibold rounded-lg transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">download</span>
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm flex flex-col justify-center">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total MRR</div>
 <div className=" text-3xl font-bold text-emerald-800">₹{totalRevenue.toLocaleString()}</div>
        </div>
        <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm flex flex-col justify-center">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Enterprise Plans</div>
 <div className=" text-3xl font-bold text-emerald-900">{planStats.Enterprise}</div>
        </div>
        <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm flex flex-col justify-center">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Pro Plans</div>
 <div className=" text-3xl font-bold text-emerald-900">{planStats.Pro}</div>
        </div>
        <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm flex flex-col justify-center">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Basic Plans</div>
 <div className=" text-3xl font-bold text-emerald-900">{planStats.Basic}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-emerald-900">Recent Transactions</h3>
              <button className="text-[12px] font-semibold text-emerald-800 hover:text-emerald-900">View All</button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left px-5 py-3">Client</th>
                  <th className="text-left px-5 py-3">Date</th>
                  <th className="text-left px-5 py-3">Amount</th>
                  <th className="text-left px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((trx) => (
                  <tr key={trx.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <span className="text-[13px] font-semibold text-emerald-900">{trx.client}</span>
                    </td>
                    <td className="px-5 py-3 text-[13px] text-slate-600">{trx.date}</td>
                    <td className="px-5 py-3 text-[13px] font-bold text-slate-700">₹{trx.amount.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-700"></span>
                        {trx.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentTransactions.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-[13px] text-slate-500">No recent transactions</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-5">
            <h3 className="font-bold text-emerald-900 mb-4">Plan Distribution</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-[12px] font-semibold mb-1">
                  <span className="text-slate-600">Enterprise</span>
                  <span className="text-emerald-900">{planStats.Enterprise}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-800 h-full rounded-full" style={{ width: `${clients.length ? (planStats.Enterprise / clients.length) * 100 : 0}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-[12px] font-semibold mb-1">
                  <span className="text-slate-600">Pro</span>
                  <span className="text-emerald-900">{planStats.Pro}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-800 h-full rounded-full" style={{ width: `${clients.length ? (planStats.Pro / clients.length) * 100 : 0}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-[12px] font-semibold mb-1">
                  <span className="text-slate-600">Basic</span>
                  <span className="text-emerald-900">{planStats.Basic}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${clients.length ? (planStats.Basic / clients.length) * 100 : 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-emerald-900 rounded-xl p-5 text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-800 rounded-full blur-2xl -mr-10 -mt-10 opacity-50"></div>
            <h3 className="font-bold text-lg mb-2 relative z-10">Manage Subscription Plans</h3>
            <p className="text-[13px] text-emerald-100 mb-4 relative z-10">Create, edit, and define features for Basic, Pro, and Enterprise tiers.</p>
            <button className="w-full py-2 bg-white text-emerald-900 text-[13px] font-bold rounded-lg hover:bg-emerald-50 transition-colors relative z-10">
              Configure Plans
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

