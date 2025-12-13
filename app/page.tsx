"use client";

import React, { useState } from 'react';
import { BookOpen, FileText, Sparkles, Send, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // SIMULATED FORM SUBMISSION
  // TODO: Connect this to Supabase or Formspree later
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
      const res = await fetch('https://formspree.io/f/xpwvbbbd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubmitted(true);
        setEmail('');
      } else {
        console.error('Form submission failed:', res.status, await res.text());
      }
    } catch (err) {
      console.error('Form submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      
      {/* BACKGROUND GRADIENTS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[128px]" />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-screen">
        
        {/* BADGE */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium"
        >
          <Sparkles className="w-4 h-4" />
          <span>Coming Soon for Iranian Students</span>
        </motion.div>

        {/* HERO SECTION (Bilingual) */}
        <div className="text-center space-y-6 max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400"
          >
            The First AI Copilot for <br/>
            <span className="text-indigo-400">Persian Academic Writing</span>
          </motion.h1>

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

        {/* EMAIL CAPTURE FORM */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-md mt-12"
        >
          {!submitted ? (
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
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Joining...' : 'Join Beta'}
                  {!loading && <ChevronRight className="w-4 h-4" />}
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
                <h3 className="font-bold text-lg">You're on the list! / ثبت شد</h3>
                <p className="text-sm text-green-200/70">We will email you when your access is ready.</p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* FEATURE GRID */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 mt-20 w-full"
        >
          <FeatureCard 
            icon={<FileText className="w-6 h-6 text-indigo-400" />}
            title="Chat with PDF"
            desc="Upload papers and ask questions in Persian. Summarize literature instantly."
            descFa="با مقالات انگلیسی چت کنید و پاسخ فارسی بگیرید."
          />
          <FeatureCard 
            icon={<BookOpen className="w-6 h-6 text-blue-400" />}
            title="Smart Citations"
            desc="Auto-generate APA/MLA citations. Never worry about formatting again."
            descFa="تولید خودکار رفرنس‌دهی استاندارد."
          />
          <FeatureCard 
            icon={<Sparkles className="w-6 h-6 text-purple-400" />}
            title="Writer's Block"
            desc="AI auto-complete that understands Persian academic tone and grammar."
            descFa="تکمیل خودکار جملات با لحن علمی و رسمی."
          />
        </motion.div>

        {/* FOOTER */}
        <footer className="mt-24 text-slate-600 text-sm">
          <p>© 2024 Persian Academic Copilot. Made for students.</p>
        </footer>

      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc, descFa }: { icon: React.ReactNode, title: string, desc: string, descFa: string }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-colors">
      <div className="bg-slate-800/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-200 mb-2">{title}</h3>
      <p className="text-slate-400 text-sm mb-3 leading-relaxed">{desc}</p>
      <p className="text-slate-500 text-xs font-light border-t border-slate-800 pt-3" dir="rtl">{descFa}</p>
    </div>
  );
}