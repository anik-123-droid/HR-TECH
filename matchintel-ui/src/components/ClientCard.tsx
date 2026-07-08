import { motion } from 'framer-motion';

interface ClientCardProps {
  client: {
    name: string;
    industry: string;
    activeRoles: number;
    pipeline: number;
    contactName: string;
    contactEmail: string;
    status: string;
    icon: string;
  };
  delay?: number;
}

export function ClientCard({ client, delay = 0 }: ClientCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
      className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex items-start gap-4">
        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 border border-slate-200">
          <span className="material-symbols-outlined text-slate-400">{client.icon}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-emerald-900 leading-tight">[{client.name}]</h3>
          <div className="mt-2 inline-flex items-center px-2 py-0.5 bg-emerald-50 text-emerald-900 border border-emerald-100 text-[10px] font-bold uppercase tracking-wider rounded-md">
            [{client.industry}]
          </div>
        </div>
      </div>
      
      {/* Body */}
      <div className="p-5 space-y-5 flex-1">
        {/* Metrics */}
        <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 grid grid-cols-2 gap-4 divide-x divide-slate-200">
          <div className="text-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Roles</div>
            <div className="text-lg font-extrabold text-emerald-900">[ {client.activeRoles} ]</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pipeline</div>
            <div className="text-lg font-extrabold text-emerald-900">[ {client.pipeline} ]</div>
          </div>
        </div>
        
        {/* Contacts */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="material-symbols-outlined text-[16px] text-slate-400">person</span>
            <span className="font-medium">[{client.contactName}]</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="material-symbols-outlined text-[16px] text-slate-400">mail</span>
            <span>[{client.contactEmail}]</span>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center mt-auto">
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${client.status === 'Account Healthy' ? 'bg-green-700' : 'bg-red-500'}`}></div>
          <span className="text-xs font-bold text-slate-600">{client.status}</span>
        </div>
        <button className="text-xs font-bold text-emerald-800 hover:text-emerald-900 cursor-pointer flex items-center gap-1 transition-colors">
          Manage Account 
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </button>
      </div>
    </motion.div>
  );
}

