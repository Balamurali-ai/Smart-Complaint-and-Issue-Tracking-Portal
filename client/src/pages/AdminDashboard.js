import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../services/api';
import DashboardCard from '../components/DashboardCard';
import AdminSidebar from '../components/AdminSidebar';
import { motion } from 'framer-motion';
import { LayoutDashboard, Clock, CheckCircle2, AlertCircle, TrendingUp, PieChart, ArrowRight, List } from 'lucide-react';

const categoryIcon = (c) =>
  c === 'Hostel' ? '🏠' : c === 'Academic' ? '📚' : c === 'Infrastructure' ? '🏗️' : '📋';

const categoryColor = (c) =>
  c === 'Hostel' ? '#4f46e5' : c === 'Academic' ? '#0891b2' : c === 'Infrastructure' ? '#d97706' : '#7c3aed';

const AdminDashboard = () => {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { data } = await getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const maxCat = stats ? Math.max(...stats.categoryStats.map(c => c.count), 1) : 1;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <AdminSidebar />

      <main className="flex-1 p-8 md:p-12 overflow-y-auto max-w-[1200px] mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight font-display mb-1">Admin Dashboard</h1>
            <p className="text-slate-500 font-medium">Manage campus complaints and monitor analytics in real-time.</p>
          </div>
          <button 
            onClick={() => navigate('/admin/complaints')} 
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white rounded-xl shadow-lg shadow-primary-500/20 font-bold transition-all hover:-translate-y-0.5"
          >
            <List size={18} />
            Manage Complaints
          </button>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-primary-500 rounded-full animate-spin shadow-lg"></div>
            <p className="mt-4 text-slate-500 font-semibold animate-pulse">Loading dashboard...</p>
          </div>
        )}

        {stats && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <DashboardCard
                icon={<LayoutDashboard />} label="Total Complaints" value={stats.total}
                gradient="linear-gradient(135deg,#6366f1,#8b5cf6)"
                trend={`${stats.resolved} resolved total`}
              />
              <DashboardCard
                icon={<AlertCircle />} label="High Priority" value={stats.highPriority}
                gradient="linear-gradient(135deg,#ef4444,#dc2626)"
                trend="Needs immediate attention"
              />
              <DashboardCard
                icon={<Clock />} label="Pending" value={stats.pending}
                gradient="linear-gradient(135deg,#f59e0b,#d97706)"
                trend="Awaiting action"
              />
              <DashboardCard
                icon={<CheckCircle2 />} label="Resolved" value={stats.resolved}
                gradient="linear-gradient(135deg,#10b981,#059669)"
                trend={stats.total > 0 ? `${Math.round((stats.resolved / stats.total) * 100)}% resolution rate` : '—'}
              />
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Category Breakdown */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-8 relative z-10">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 font-display">Category Breakdown</h3>
                    <p className="text-sm text-slate-500 font-medium">Complaints distributed by type</p>
                  </div>
                </div>

                <div className="space-y-6 relative z-10">
                  {stats.categoryStats.length === 0 && (
                    <div className="text-center py-12 text-slate-400 font-medium">No data yet</div>
                  )}
                  {stats.categoryStats.map((cat, i) => (
                    <motion.div 
                      key={cat._id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex justify-between items-end mb-2">
                        <span className="font-semibold text-slate-700 text-sm flex items-center gap-2">
                          <span className="text-lg">{categoryIcon(cat._id)}</span> {cat._id}
                        </span>
                        <span className="font-bold text-sm" style={{ color: categoryColor(cat._id) }}>
                          {cat.count}
                        </span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(cat.count / maxCat) * 100}%` }}
                          transition={{ duration: 1, delay: i * 0.1, type: 'spring', stiffness: 50 }}
                          style={{ background: categoryColor(cat._id) }} 
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Status Overview */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-8 relative z-10">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <PieChart size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 font-display">Status Overview</h3>
                    <p className="text-sm text-slate-500 font-medium">Current complaint progression</p>
                  </div>
                </div>

                <div className="space-y-4 relative z-10">
                  {[
                    { label: 'Pending',     value: stats.pending,    color: 'bg-amber-500', text: 'text-amber-600', bg: 'bg-amber-50', icon: '⏳' },
                    { label: 'In Progress', value: stats.inProgress, color: 'bg-blue-500', text: 'text-blue-600', bg: 'bg-blue-50', icon: '🔄' },
                    { label: 'Resolved',    value: stats.resolved,   color: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50', icon: '✅' },
                  ].map((item, i) => (
                    <motion.div 
                      key={item.label} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`flex items-center justify-between p-5 rounded-2xl ${item.bg}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.icon}</span>
                        <span className="font-bold text-slate-800">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-2 bg-white/50 rounded-full overflow-hidden hidden sm:block">
                          <motion.div 
                            className={`h-full rounded-full ${item.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: stats.total > 0 ? `${(item.value / stats.total) * 100}%` : '0%' }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                        <span className={`font-extrabold text-xl w-8 text-right ${item.text}`}>
                          {item.value}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <button
                  onClick={() => navigate('/admin/complaints')}
                  className="w-full mt-8 py-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-2xl transition-colors flex items-center justify-center gap-2 group relative z-10"
                >
                  View All Complaints 
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
