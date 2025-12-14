"use client";

import React, { useState } from 'react';
import { BookOpen, FileText, Sparkles, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

// --- Feature Card Component ---
interface FeatureCardProps {
  icon: React.ReactNode;
  titleFa: string; // Persian Title
  descFa: string;  // Persian Description
  keyFeature: string; // English Tag
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, titleFa, descFa, keyFeature }) => {
  return (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-colors">
      <div className="bg-slate-800/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      
      {/* Title - Right-to-Left (Persian) */}
      <h3 dir="rtl" className="text-lg font-bold text-slate-200 mb-2">{titleFa}</h3>
      
      {/* Description - Right-to-Left (Persian) */}
      <p dir="rtl" className="text-slate-400 text-sm mb-3 leading-relaxed">{descFa}</p>
      
      {/* English Key Feature Tag */}
      <p className="text-slate-500 text-xs font-light border-t border-slate-800 pt-3 uppercase tracking-wider">
        {keyFeature}
      </p>
    </div>
  );
};

// --- Main Landing Page Component ---
export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // --- Form Submission Logic ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    try {
        // Your specific Formspree endpoint
        const response = await fetch('https://formspree.io/f/xpwvbbbd', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              email: email, 
              source: "Persian Copilot Beta Waitlist" 
            }), 
        });

        if (response.ok) {
            setIsSubmitted(true);
        } else {
            console.error('Submission failed');
            alert('Something went wrong. Please try again.');
        }

    } catch (error) {
        console.error('Error:', error);
        alert('Network error. Please check your connection.');
    } finally {
        setIsLoading(false);
        setEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      
      {/* Ambient Background Glow */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[128px]" />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-screen">
        
        {/* Version Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wide"
        >
          <Zap className="w-3 h-3" />
          <span>Version : Beta 0.1</span>
        </motion.div>

        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400"
          >
            The First AI Copilot for <br/>
            <span className="text-indigo-400">Persian Academic Writing</span>
          </motion.h1>

          {/* Persian Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            dir="rtl" 
            className="text-lg md:text-xl text-slate-400 leading-relaxed font-light"
          >
            پایان‌نامه و مقالات خود را ۱۰ برابر سریع‌تر بنویسید. <br className="hidden md:block"/>
            چت با PDF، اصلاح متون فارسی، و مدیریت منابع — همه با هوش مصنوعی.
          </motion.p>
        </div>

        {/* Signup Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-md mt-12"
        >
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-200"></div>
              
              <div className="relative flex items-center bg-slate-900 rounded-lg p-2 border border-slate-800">
                <input 
                  type="email" 
                  required
                  placeholder="name@university.edu" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 px-4 py-2 outline-none"
                />
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Joining...' : 'Join Beta'}
                  {!isLoading && <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
              <p className="mt-3 text-xs text-center text-slate-500">
                Limited to first 500 students. Free during beta.
              </p>
            </form>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-500/10 border border-green-500/20 text-green-200 p-6 rounded-xl text-center flex flex-col items-center gap-3"
            >
              <CheckCircle2 className="w-8 h-8 text-green-400" />
              <div>
                <h3 dir="rtl" className="font-bold text-lg">ثبت نام با موفقیت انجام شد!</h3>
                <p className="text-sm text-green-200/70">We will email you when your access is ready.</p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Feature Grid (Persian Boxes) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 mt-20 w-full"
        >
          <FeatureCard 
            icon={<FileText className="w-6 h-6 text-indigo-400" />}
            titleFa="چت با اسناد PDF"
            descFa="مقالات انگلیسی خود را آپلود کنید و خلاصه و پاسخ سوالات خود را به زبان فارسی دریافت کنید."
            keyFeature="PDF CHAT & SUMMARIZATION"
          />
          <FeatureCard 
            icon={<BookOpen className="w-6 h-6 text-blue-400" />}
            titleFa="رفرنس‌دهی هوشمند"
            descFa="تولید خودکار منابع به فرمت‌های APA، MLA و شیکاگو بدون نگرانی از اشتباهات نگارشی."
            keyFeature="SMART CITATIONS"
          />
          <FeatureCard 
            icon={<Sparkles className="w-6 h-6 text-purple-400" />}
            titleFa="دستیار نگارش علمی"
            descFa="بازنویسی متون، اصلاح گرامر و پیشنهاد جملات آکادمیک برای بهبود کیفیت پایان‌نامه."
            keyFeature="ACADEMIC WRITING ASSISTANT"
          />
        </motion.div>

        {/* Footer */}
        <footer className="mt-24 text-slate-600 text-sm">
          <p>© 2024 Persian Academic Copilot. Built for students.</p>
        </footer>

      </main>
    </div>
  );
}