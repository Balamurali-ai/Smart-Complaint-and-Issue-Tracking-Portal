import React from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b1220] via-[#111827] to-[#1e1b4b] text-white overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-purple-600 rounded-full blur-[150px] opacity-30"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-blue-600 rounded-full blur-[150px] opacity-30"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">

        {/* Badge */}
        <div className="inline-flex items-center px-5 py-2 rounded-full 
        bg-white/10 backdrop-blur-md border border-white/20 
        text-white text-sm font-medium shadow-lg mb-6">
          ⚡ AI-Powered Grievance Resolution System
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
          Every Voice Matters.
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Every Issue Gets Resolved.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-300 text-lg md:text-xl mb-8">
          AI-Powered Smart College Complaint & Issue Tracking System for 
          Transparent Governance and Faster Resolutions.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4 flex-wrap">

          {/* Student Login */}
          <button
            onClick={() => navigate("/login?role=student")}
            className="px-6 py-3 rounded-lg 
            bg-gradient-to-r from-indigo-500 to-purple-600 
            hover:opacity-90 transition shadow-lg"
          >
            🎓 Student Login
          </button>

          {/* Admin Login */}
          <button
            onClick={() => navigate("/login?role=admin")}
            className="px-6 py-3 rounded-lg 
            border border-white/20 
            hover:bg-white/10 transition"
          >
            🛡️ Admin Login
          </button>

        </div>

        {/* Stats */}
        <div className="flex justify-center gap-10 mt-12 text-center">

          <div>
            <h3 className="text-2xl font-bold">500+</h3>
            <p className="text-gray-400 text-sm">Complaints Resolved</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold">98%</h3>
            <p className="text-gray-400 text-sm">Satisfaction Rate</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold">24/7</h3>
            <p className="text-gray-400 text-sm">System Uptime</p>
          </div>

        </div>

      </div>

    </section>
  );
};

export default Hero;