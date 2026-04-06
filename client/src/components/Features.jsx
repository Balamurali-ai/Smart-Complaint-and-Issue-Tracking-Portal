import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Bell, Lock, Activity, Users, Zap } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Bot size={28} />,
      title: 'AI Priority Auto-Assignment',
      desc: 'Our intelligent NLP engine automatically analyzes complaint text to determine urgency, preventing critical issues from falling through the cracks.',
      bg: 'bg-blue-50',
      color: 'text-blue-500'
    },
    {
      icon: <Bell size={28} />,
      title: 'Real-Time Tracking',
      desc: 'Students receive instant updates. Track whether your issue is pending, in progress, or fully resolved without needing to follow up.',
      bg: 'bg-emerald-50',
      color: 'text-emerald-500'
    },
    {
      icon: <Lock size={28} />,
      title: 'Role-Based Dashboards',
      desc: 'Separate, secure portals for Students to submit and track, and specifically tailored dashboards for Admins to overview and manage.',
      bg: 'bg-purple-50',
      color: 'text-purple-500'
    },
    {
      icon: <Activity size={28} />,
      title: 'Advanced Analytics',
      desc: 'Admins gain access to a Complaint Intelligence Center featuring rich visualizations and historical trend analysis to spot recurring issues.',
      bg: 'bg-amber-50',
      color: 'text-amber-500'
    },
    {
      icon: <Zap size={28} />,
      title: 'Lightning Fast Workflow',
      desc: 'A modern, responsive interface ensures submitting and managing grievances takes seconds, optimized for both desktop and mobile devices.',
      bg: 'bg-rose-50',
      color: 'text-rose-500'
    },
    {
      icon: <Users size={28} />,
      title: 'Transparent Communication',
      desc: 'Admins can directly leave structured resolution messages upon fixing an issue, maintaining clear and accountable institutional communication.',
      bg: 'bg-indigo-50',
      color: 'text-indigo-500'
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 font-bold text-sm mb-6"
          >
            Powerful Capabilities
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 font-display"
          >
            Smarter Campus Governance
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 leading-relaxed font-medium"
          >
            We replace manual paperwork with a streamlined, intelligent digital workflow that brings complete transparency and speed to college grievance resolution.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-3xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100 group transition-all duration-300"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${feature.bg} ${feature.color} mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 font-display">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Decorative background blob */}
      <div className="absolute top-1/2 left-0 w-[40rem] h-[40rem] bg-slate-50 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 -z-10" />
    </section>
  );
};

export default Features;
