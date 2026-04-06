import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Footer from '../components/Footer';

const Landing = () => {
  return (
    <div className="font-sans min-h-screen bg-slate-900 overflow-hidden">
      <Navbar />

      <main>
        <Hero />
        <Features />
        <HowItWorks />
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
