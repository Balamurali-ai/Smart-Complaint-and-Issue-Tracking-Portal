import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Menu, X, LayoutDashboard, LineChart, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const isLanding = location.pathname === '/';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || !isLanding ? 'bg-slate-900/90 backdrop-blur-md shadow-lg shadow-slate-900/10' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 cursor-pointer select-none group"
        >
          <div className="bg-primary-500 text-white p-1.5 rounded-lg group-hover:scale-110 transition-transform shadow-lg shadow-primary-500/20">
            <GraduationCap size={24} />
          </div>
          <span className="text-white text-xl font-bold tracking-tight font-display">SmartPortal</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <>
              <button 
                onClick={() => navigate('/login?role=student')} 
                className="px-5 py-2 text-sm font-semibold text-slate-200 hover:text-white transition-colors"
              >
                Student Login
              </button>
              <button 
                onClick={() => navigate('/login?role=admin')} 
                className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5 transition-all duration-200"
              >
                Admin Login
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5">
                <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold">
                  {user.name?.[0]?.toUpperCase() || <User size={14} />}
                </div>
                <span className="text-sm font-medium text-slate-200">{user.name}</span>
              </div>
              
              <button
                onClick={() => navigate(user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard')}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </button>
              
              {user.role !== 'admin' && (
                <button
                  onClick={() => navigate('/student/insights')}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                >
                  <LineChart size={16} />
                  Insights
                </button>
              )}
              
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-red-300 hover:text-white hover:bg-red-500/20 rounded-xl transition-all"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Hamburger */}
        <button 
          className="md:hidden text-slate-300 hover:text-white transition-colors" 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-slate-900 border-t border-white/10"
          >
            <div className="px-4 py-4 flex flex-col gap-2">
              {!user ? (
                <>
                  <button 
                    onClick={() => { navigate('/login?role=student'); setMenuOpen(false); }} 
                    className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/5 rounded-xl transition-colors"
                  >
                    Student Login
                  </button>
                  <button 
                    onClick={() => { navigate('/login?role=admin'); setMenuOpen(false); }} 
                    className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/5 rounded-xl transition-colors"
                  >
                    Admin Login
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 mb-2 border-b border-white/10">
                    <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
                      {user.name?.[0]?.toUpperCase() || <User size={16} />}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{user.name}</div>
                      <div className="text-xs text-slate-400 capitalize">{user.role}</div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => { navigate(user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'); setMenuOpen(false); }} 
                    className="flex w-full text-left px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/5 rounded-xl transition-colors gap-3 items-center"
                  >
                    <LayoutDashboard size={18} className="text-primary-400" />
                    Dashboard
                  </button>
                  
                  {user.role !== 'admin' && (
                    <button 
                      onClick={() => { navigate('/student/insights'); setMenuOpen(false); }} 
                      className="flex w-full text-left px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/5 rounded-xl transition-colors gap-3 items-center"
                    >
                      <LineChart size={18} className="text-primary-400" />
                      Insights
                    </button>
                  )}
                  
                  <button 
                    onClick={() => { handleLogout(); setMenuOpen(false); }} 
                    className="flex w-full text-left px-4 py-3 text-sm font-semibold text-red-300 hover:bg-red-500/10 rounded-xl transition-colors gap-3 items-center mt-2 border border-red-500/10"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
