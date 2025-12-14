"use client";

import React, { useState } from 'react';
import { BookOpen, FileText, Sparkles, CheckCircle2, ChevronLeft, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

// --- کارت ویژگی‌ها (Feature Card) ---
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-black/40 border border-orange-900/30 p-6 rounded-2xl hover:border-orange-500/50 transition-all duration-300 group text-right">
      <div className="bg-orange-950/50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-900/50 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-orange-50 mb-3">{title}</h3>
      <p className="text-orange-200/70 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

// --- کامپوننت اصلی صفحه فرود ---
export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    try {
        // لینک فرم‌اسپری شما
        const response = await fetch('https://formspree.io/f/xpwvbbbd', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, source: "نسخه بتا - تم نارنجی" }), 
        });
        if (response.ok) setIsSubmitted(true);
        else alert('مشکلی پیش آمد. لطفا دوباره تلاش کنید.');
    } catch (error) {
        alert('خطای شبکه. لطفا اتصال خود را بررسی کنید.');
    } finally {
        setIsLoading(false);
        setEmail('');
    }
  };

  return (
    // تنظیم جهت صفحه به راست-به-چپ (RTL)
    <div dir="rtl" className="min-h-screen bg-[#0a0a0a] text-orange-50 font-sans selection:bg-orange-500/30 selection:text-orange-100 overflow-x-hidden">
      
      {/* نورهای پس‌زمینه */}
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center items-center overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[150px] opacity-70" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-red-700/10 rounded-full blur-[150px] opacity-60" />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-16 flex flex-col items-center text-center min-h-[90vh] justify-center">
        
        {/* بج نسخه */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-950/50 border border-orange-500/30 text-orange-400 text-sm font-bold shadow-[0_0_15px_rgba(249,115,22,0.2)]"
        >
          <Zap className="w-4 h-4 fill-orange-400" />
          <span className="tracking-wide">نسخه: بتا ۰.۱</span>
        </motion.div>

        {/* تیتر اصلی */}
        <div className="space-y-6 max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-7xl font-extrabold tracking-tight leading-tight"
          >
            اولین دستیار هوش مصنوعی برای <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 drop-shadow-[0_2px_10px_rgba(249,115,22,0.5)]">
              پژوهش و نگارش آکادمیک فارسی
            </span>
          </motion.h1>

          {/* زیرتیتر */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-orange-200/80 leading-8 font-light max-w-2xl mx-auto"
          >
            سرعت نگارش پایان‌نامه و مقالات خود را ۱۰ برابر کنید. با اسناد PDF چت کنید، متون را به فارسی روان بازنویسی کنید و منابع را مدیریت کنید—همه با قدرت Gemini.
          </motion.p>
        </div>

        {/* فرم ثبت‌نام */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-md mt-14"
        >
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="relative group">
              {/* افکت درخشش دور فرم */}
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-orange-400 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
              
              <div className="relative flex items-center p-1.5 bg-black border border-orange-900/50 rounded-xl shadow-2xl">
                <input 
                  type="email" 
                  required
                  placeholder="ایمیل دانشگاهی خود را وارد کنید..." 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent border-none text-orange-50 placeholder-orange-300/50 focus:ring-0 px-4 py-3 outline-none text-right w-full"
                />
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg whitespace-nowrap"
                >
                  {isLoading ? 'در حال ثبت...' : 'عضویت در بتا'}
                  {!isLoading && <ChevronLeft className="w-5 h-5" />}
                </button>
              </div>
              <p className="mt-4 text-sm text-orange-300/60">
                ظرفیت محدود به ۵۰۰ نفر اول. رایگان در دوره بتا.
              </p>
            </form>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-orange-950/30 border border-orange-500/30 p-8 rounded-2xl flex flex-col items-center gap-4 text-orange-50"
            >
              <CheckCircle2 className="w-12 h-12 text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.6)]" />
              <div>
                <h3 className="font-bold text-2xl mb-2">ثبت‌نام شما با موفقیت انجام شد!</h3>
                <p className="text-orange-200/70">به محض آماده شدن دسترسی، ایمیلی برای شما ارسال خواهیم کرد.</p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* کارت‌های ویژگی‌ها */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-8 mt-24 w-full"
        >
          <FeatureCard 
            icon={<FileText className="w-7 h-7 text-orange-400" />}
            title="چت هوشمند با PDF"
            description="مقالات انگلیسی را آپلود کنید. هوش مصنوعی آن‌ها را می‌خواند و به هر سوالی که به فارسی بپرسید، با ذکر منبع پاسخ می‌دهد."
          />
          <FeatureCard 
            icon={<BookOpen className="w-7 h-7 text-orange-400" />}
            title="دستیار رفرنس‌دهی خودکار"
            description="دیگر نگران فرمت منابع نباشید. تمام استنادات درون‌متنی و لیست منابع (APA, MLA) به صورت خودکار تولید می‌شود."
          />
          <FeatureCard 
            icon={<Sparkles className="w-7 h-7 text-orange-400" />}
            title="نگارش علمی و بازنویسی"
            description="متون خود را به لحن رسمی و آکادمیک تبدیل کنید. گرامر فارسی را اصلاح کنید و پاراگراف‌های منسجم بنویسید."
          />
        </motion.div>

        {/* فوتر */}
        <footer className="mt-32 pt-8 border-t border-orange-900/30 text-orange-300/50 text-sm w-full">
          <p>© ۱۴۰۳ دستیار هوش مصنوعی آکادمیک. ساخته شده برای دانشجویان ایران.</p>
        </footer>

      </main>
    </div>
  );
}