import React from 'react';
import { GraduationCap, Mail, MessageCircle, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 font-sans py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-500/20 text-primary-400 rounded-lg">
            <GraduationCap size={24} />
          </div>
          <span className="text-white text-xl font-bold font-display">SmartPortal</span>
        </div>

        <div className="text-sm font-medium text-center md:text-left">
          &copy; {new Date().getFullYear()} Smart College Grievance Portal. All rights reserved.
        </div>

        <div className="flex items-center gap-4">
          <button type="button" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors">
            <MessageCircle size={18} />
          </button>
          <button type="button" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors">
            <Mail size={18} />
          </button>
          <button type="button" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors">
            <Globe size={18} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
