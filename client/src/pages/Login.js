import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { login } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShieldCheck, GraduationCap, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

const Login = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'student';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isAdmin = role === 'admin';
  const roleColor = isAdmin ? 'from-cyan-600 to-cyan-500' : 'from-primary-600 to-primary-500';
  const roleFocus = isAdmin ? 'focus:border-cyan-500 focus:ring-cyan-500/20' : 'focus:border-primary-500 focus:ring-primary-500/20';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const { data } = await login({ ...formData, role });
      setSuccess(`Welcome back, ${data.name}! Redirecting...`);
      localStorage.setItem('user', JSON.stringify(data));
      setTimeout(() => {
        navigate(data.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
      }, 800);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden text-slate-800">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 ${isAdmin ? 'bg-cyan-600/20' : 'bg-primary-600/20'} rounded-full blur-[100px] mix-blend-screen transition-colors duration-700`} />
        <div className={`absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] ${isAdmin ? 'bg-teal-600/20' : 'bg-purple-600/20'} rounded-full blur-[120px] mix-blend-screen transition-colors duration-700`} />
      </div>

      <button 
        onClick={() => navigate('/')} 
        className="fixed top-6 left-6 flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-xl text-sm font-semibold backdrop-blur-md transition-all z-20 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
      </button>

      <div className="w-full max-w-md relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mx-auto mb-4 border border-white/20 shadow-xl">
            {isAdmin ? <ShieldCheck size={32} className="text-cyan-400" /> : <GraduationCap size={32} className="text-primary-400" />}
          </div>
          <h1 className="text-3xl font-extrabold text-white font-display mb-2">SmartPortal</h1>
          <p className="text-slate-400 font-medium">AI-Enabled Grievance Management System</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className={`bg-gradient-to-r ${roleColor} p-8 text-white relative overflow-hidden transition-colors duration-500`}>
            <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <h2 className="text-2xl font-bold mb-1 flex items-center gap-2 relative z-10">
              {isAdmin ? 'Admin Login' : 'Student Login'}
            </h2>
            <p className="text-white/80 text-sm font-medium relative z-10">
              {isAdmin ? 'Manage & resolve student complaints' : 'Submit and track your complaints'}
            </p>
          </div>

          {/* Role Tabs */}
          <div className="flex border-b border-slate-100">
            <button
              onClick={() => navigate('/login?role=student')}
              className={`flex-1 py-4 text-sm font-bold transition-colors border-b-2 flex justify-center items-center gap-2 ${!isAdmin ? 'border-primary-500 text-primary-600 bg-primary-50/50' : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
            >
              <GraduationCap size={18} /> Student
            </button>
            <button
              onClick={() => navigate('/login?role=admin')}
              className={`flex-1 py-4 text-sm font-bold transition-colors border-b-2 flex justify-center items-center gap-2 ${isAdmin ? 'border-cyan-500 text-cyan-600 bg-cyan-50/50' : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
            >
              <ShieldCheck size={18} /> Admin
            </button>
          </div>

          <div className="p-8">
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-start gap-3 font-medium text-sm"
                >
                  <AlertCircle size={20} className="shrink-0 mt-0.5" />
                  <p>{error}</p>
                </motion.div>
              )}
              {success && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl flex items-start gap-3 font-medium text-sm"
                >
                  <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
                  <p>{success}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-600 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className={`w-full bg-slate-50 border border-slate-200 text-slate-800 py-3.5 pl-12 pr-4 rounded-xl font-medium focus:ring-2 focus:outline-none transition-all ${roleFocus}`}
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className={`w-full bg-slate-50 border border-slate-200 text-slate-800 py-3.5 pl-12 pr-12 rounded-xl font-medium focus:ring-2 focus:outline-none transition-all ${roleFocus}`}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-2 py-4 flex flex-row items-center justify-center gap-2 bg-gradient-to-r text-white rounded-xl font-bold shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-80 disabled:hover:translate-y-0 ${roleColor} ${isAdmin ? 'shadow-cyan-500/30' : 'shadow-primary-500/30'}`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Logging in...
                  </>
                ) : (
                  `Login as ${isAdmin ? 'Admin' : 'Student'}`
                )}
              </button>
            </form>

            <div className="mt-8 text-center border-t border-slate-100 pt-6">
              {!isAdmin ? (
                <p className="text-slate-500 font-medium text-sm">
                  New student? <Link to="/register" className={`font-bold transition-colors ${isAdmin ? 'text-cyan-600 hover:text-cyan-700' : 'text-primary-600 hover:text-primary-700'}`}>Register here</Link>
                </p>
              ) : (
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                  <p className="text-slate-500 text-xs font-semibold flex items-center justify-center gap-1.5">
                    <ShieldCheck size={14} className="text-slate-400" />
                    Admin accounts are managed by the IT department.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
      
      <p className="text-slate-500 text-sm font-medium mt-12 relative z-10">
        © {new Date().getFullYear()} Smart College Portal · Secure & Confidential
      </p>
    </div>
  );
};

export default Login;
