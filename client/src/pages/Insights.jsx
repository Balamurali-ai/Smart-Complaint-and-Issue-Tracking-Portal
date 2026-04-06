import React, { useEffect, useState } from 'react';
import {
  getAnalyticsOverview,
  getAnalyticsCategories,
  getAnalyticsPriorities,
  getAnalyticsTrends
} from '../services/api';
import Navbar from '../components/Navbar';
import AdminSidebar from '../components/AdminSidebar';
import { CategoryPieChart, PriorityBarChart, TrendsLineChart } from '../components/Charts';
import { motion } from 'framer-motion';

const Insights = () => {
  const [overview, setOverview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [oRes, cRes, pRes, tRes] = await Promise.all([
          getAnalyticsOverview(),
          getAnalyticsCategories(),
          getAnalyticsPriorities(),
          getAnalyticsTrends()
        ]);
        setOverview(oRes.data);
        setCategories(cRes.data);
        setPriorities(pRes.data);
        setTrends(tRes.data);
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  const content = (
    <div className={`w-full max-w-[1400px] mx-auto ${isAdmin ? 'p-6 md:p-10' : 'px-6 py-24 sm:py-32'}`}>
      {/* Header Section */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600 mb-2 font-display">
          Complaint Intelligence Center
        </h1>
        <p className="text-slate-500 font-medium">
          {isAdmin ? 'AI-powered campus-wide analytics and trend predictions.' : 'Visual overview of your personal submitted complaints.'}
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-primary-500 rounded-full animate-spin"></div>
          <p className="text-slate-500 mt-4 font-medium animate-pulse">Gathering Intelligence...</p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Complaints', value: overview?.totalComplaints || 0, icon: '📊', color: 'bg-indigo-50 text-indigo-600' },
              { label: 'High Priority', value: overview?.highPriorityComplaints || 0, icon: '🚨', color: 'bg-red-50 text-red-600' },
              { label: 'Most Complained', value: overview?.mostComplainedCategory || 'N/A', icon: '🔥', color: 'bg-orange-50 text-orange-600' },
              { label: 'Resolution Rate', value: `${overview?.resolutionRate || 0}%`, icon: '✅', color: 'bg-emerald-50 text-emerald-600' }
            ].map((card, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 transition-all cursor-default"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-4 ${card.color}`}>
                  {card.icon}
                </div>
                <h3 className="text-slate-500 font-semibold text-sm mb-1">{card.label}</h3>
                <p className="text-3xl font-extrabold text-slate-800 tracking-tight">{card.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Left Column - Charts */}
            <div className="xl:col-span-2 space-y-8">
              {/* Trends Chart */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 mb-6 font-display flex items-center gap-2">
                  <span>📈</span> Monthly Complaint Trends
                </h3>
                {trends.length > 0 ? (
                   <div className="h-[300px]">
                    <TrendsLineChart data={trends} />
                  </div>
                ) : <EmptyState text="No trend data available" />}
              </div>

              {/* Bottom Charts Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                  <h3 className="text-xl font-bold text-slate-800 mb-6 font-display flex items-center gap-2">
                    <span>🥧</span> By Category
                  </h3>
                  {categories.length > 0 ? (
                    <div className="h-[250px]">
                      <CategoryPieChart data={categories} />
                    </div>
                  ) : <EmptyState text="No category data available" />}
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                  <h3 className="text-xl font-bold text-slate-800 mb-6 font-display flex items-center gap-2">
                    <span>📊</span> Priority Distribution
                  </h3>
                  {priorities.length > 0 ? (
                    <div className="h-[250px]">
                      <PriorityBarChart data={priorities} />
                    </div>
                  ) : <EmptyState text="No priority data available" />}
                </div>
              </div>
            </div>

            {/* Right Column - AI Insights */}
            <div className="bg-gradient-to-b from-indigo-900 to-purple-900 rounded-3xl p-8 shadow-2xl shadow-indigo-900/20 text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-700">
                 <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              
              <h3 className="text-2xl font-display font-bold mb-8 flex items-center gap-3">
                <span className="p-2 bg-white/10 rounded-xl">🤖</span> AI Insights
              </h3>
              
              <div className="space-y-6 relative z-10">
                <InsightRow 
                  label="Most Recurring Issue" 
                  value={overview?.insights?.mostRecurringIssue || 'N/A'} 
                  desc="Based on historical complaint frequency"
                />
                <div className="w-full h-px bg-white/10"></div>
                
                <InsightRow 
                  label="Most Active Category" 
                  value={overview?.insights?.mostActiveCategory || 'N/A'} 
                  desc="Category receiving highest interaction"
                />
                <div className="w-full h-px bg-white/10"></div>

                <InsightRow 
                  label="Complaints Trend" 
                  value={overview?.insights?.trend || 'N/A'} 
                  desc="Volume trajectory over the last 30 days"
                />
                <div className="w-full h-px bg-white/10"></div>

                <InsightRow 
                  label="Resolution Performance" 
                  value={overview?.insights?.resolutionPerformance || 'N/A'} 
                  desc="Current speed and success of ticket closures"
                />
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center text-sm text-indigo-200">
                <span className="font-medium">Confidence Score</span>
                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-lg font-bold">94%</span>
              </div>
            </div>
            
          </div>
        </motion.div>
      )}
    </div>
  );

  if (isAdmin) {
    return (
      <div className="flex min-h-screen bg-slate-50 font-sans">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto">
          {content}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <main>
        {content}
      </main>
    </div>
  );
};

const InsightRow = ({ label, value, desc }) => (
  <div>
    <h4 className="text-indigo-200 font-semibold text-sm mb-1">{label}</h4>
    <p className="text-xl font-bold tracking-tight mb-1">{value}</p>
    <p className="text-xs text-indigo-300/70 font-medium">{desc}</p>
  </div>
);

const EmptyState = ({ text }) => (
  <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 space-y-3 py-10">
    <span className="text-4xl opacity-50">📭</span>
    <p className="font-medium text-sm">{text}</p>
  </div>
);

export default Insights;
