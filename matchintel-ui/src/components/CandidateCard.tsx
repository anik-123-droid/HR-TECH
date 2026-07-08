import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface CandidateCardProps {
  candidate: {
    name: string;
    role: string;
    company: string;
    score: number;
    skills: string[];
    status: string;
    trustBadge: string | null;
    riskBadge: string | null;
  };
  delay?: number;
}

export function CandidateCard({ candidate, delay = 0 }: CandidateCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={!isExpanded ? { y: -4, scale: 1.01, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" } : {}}
      className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
    >
      <div 
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center shrink-0 border border-slate-200">
              <span className="text-sm font-bold text-slate-600">{candidate.name.charAt(0)}</span>
            </div>
            <div>
              <motion.h3 layout="position" className="text-lg font-extrabold text-emerald-900 tracking-tight">{candidate.name}</motion.h3>
              <motion.p layout="position" className="text-sm font-medium text-slate-500 mt-0.5">{candidate.role}</motion.p>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-2xl font-extrabold text-emerald-600 leading-none">{candidate.score}%</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Match Score</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-100 bg-slate-50/50"
          >
            <div className="p-6 space-y-5">
              {/* Trust/Risk Badges */}
              <div className="flex flex-wrap gap-3">
                {candidate.trustBadge && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-emerald-200 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold shadow-sm">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    {candidate.trustBadge}
                  </div>
                )}
                {candidate.riskBadge && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-red-200 bg-red-50 text-red-700 rounded-full text-xs font-bold shadow-sm">
                    <span className="material-symbols-outlined text-[16px]">warning</span>
                    {candidate.riskBadge}
                  </div>
                )}
              </div>
              
              {/* Skills */}
              <div>
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2">Verified Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map(skill => (
                    <span key={skill} className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-md shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-100 transition-colors shadow-sm">
                  Decline
                </button>
                <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-lg shadow-sm transition-colors">
                  Advance to Interview
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Expand/Collapse affordance */}
      <div 
        className="w-full py-2 bg-slate-50 border-t border-slate-100 flex justify-center items-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 cursor-pointer transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="material-symbols-outlined text-[20px]">
          {isExpanded ? 'expand_less' : 'expand_more'}
        </span>
      </div>
    </motion.div>
  );
}
