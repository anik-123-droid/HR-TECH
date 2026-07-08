import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: string;
  delay?: number;
}

export function MetricCard({ title, value, icon, delay = 0 }: MetricCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</h3>
        {icon && <span className="material-symbols-outlined text-slate-400 text-[18px]">{icon}</span>}
      </div>
      <div className="text-3xl font-extrabold text-emerald-900">[ {value} ]</div>
    </motion.div>
  );
}
