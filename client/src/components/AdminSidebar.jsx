import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, LineChart, LogOut, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const currentPath = location.pathname;

  const menuItems = [
    { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/complaints', icon: <FileText size={20} />, label: 'Complaints' },
    { path: '/admin/insights', icon: <LineChart size={20} />, label: 'Insights' },
  ];

  return (
    <aside className="w-64 shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col sticky top-0 h-screen shadow-2xl z-40 text-slate-300 font-sans">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-800/60 font-display">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white p-2 rounded-xl shadow-lg shadow-primary-500/20">
          <GraduationCap size={24} />
        </div>
        <span className="text-white text-xl font-bold tracking-tight">SmartPortal</span>
      </div>

      <nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">
        <div className="px-3 pr-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Menu
        </div>
        
        {menuItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-sm font-semibold transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-primary-500/10 text-primary-400' 
                  : 'hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-full"
                />
              )}
              <div className={`${isActive ? 'text-primary-400' : 'text-slate-400 group-hover:text-slate-300'}`}>
                {item.icon}
              </div>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800/60">
        <div className="bg-slate-800/50 rounded-2xl p-4 mb-4 flex items-center gap-3 border border-slate-700/50">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-inner">
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-bold text-sm truncate">{user?.name}</div>
            <div className="text-slate-400 text-xs truncate">Administrator</div>
          </div>
        </div>
        
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl font-semibold text-sm transition-all group"
        >
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
