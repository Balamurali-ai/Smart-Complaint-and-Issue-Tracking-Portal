import React from 'react';
import { motion } from 'framer-motion';

const DashboardCard = ({ icon, label, value, gradient, trend }) => {
  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
    >
      {/* Decorative background element */}
      <div 
        className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500"
        style={{ background: gradient }}
      />
      
      <div className="flex items-center gap-4 mb-4 relative z-10">
        <div 
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg text-white"
          style={{ background: gradient }}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-slate-500 font-semibold text-sm">{label}</h3>
        </div>
      </div>
      
      <div className="relative z-10">
        <div className="text-3xl font-extrabold text-slate-800 tracking-tight">{value}</div>
        {trend && (
          <div className="mt-2 text-xs font-semibold text-slate-400 bg-slate-50 inline-block px-2 py-1 rounded-md">
            {trend}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DashboardCard;
