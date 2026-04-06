import React from 'react';
import { motion } from 'framer-motion';
import { FileEdit, BrainCircuit, CheckCircle2 } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      num: '01',
      icon: <FileEdit size={32} />,
      title: 'Submit Complaint',
      desc: 'Students securely log in and fill out a comprehensive report including text descriptions, categories, and photographic evidence.',
      color: 'from-blue-500 to-cyan-400'
    },
    {
      num: '02',
      icon: <BrainCircuit size={32} />,
      title: 'AI Processing',
      desc: 'Our NLP framework scans the text, identifies sentiment and imperative keywords, and automatically determines severity and priority.',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      num: '03',
      icon: <CheckCircle2 size={32} />,
      title: 'Resolution',
      desc: 'Admins receive the automatically prioritized ticket, assign it to the relevant department, fix the issue, and push a resolution memo.',
      color: 'from-emerald-500 to-teal-400'
    }
  ];

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-6 font-display"
          >
            How it Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-500 font-medium"
          >
            A simple, secure, and intelligent flow connecting student grievances with rapid administrative action.
          </motion.p>
        </div>

        <div className="relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-[110px] left-[15%] right-[15%] h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative"
              >
                <div className="w-24 h-24 mx-auto mb-8 relative group">
                  <div className="absolute inset-0 bg-white rounded-3xl shadow-xl rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-3xl -rotate-3 group-hover:rotate-0 transition-transform duration-300 flex items-center justify-center text-white shadow-lg`}>
                    {step.icon}
                  </div>
                  <div className="absolute -top-4 -right-4 w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold font-display shadow-lg border-4 border-slate-50">
                    {step.num}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-800 mb-4 font-display">{step.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed max-w-sm mx-auto">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
