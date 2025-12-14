"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Send, User, Bot, AlertCircle, Paperclip, 
  FileText, Trash2, X, AlertTriangle 
} from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  // --- STATE ---
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "سلام! من دستیار هوشمند شما هستم. فایل PDF خود را آپلود کنید یا هر سوالی دارید بپرسید." }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  
  // Modal State
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // --- REFS ---
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- AUTO-SCROLL EFFECT ---
  // Whenever 'messages' or 'loading' changes, scroll to the bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // --- HANDLERS ---
  
  const handleClearChat = () => {
    setMessages([{ role: "assistant", content: "چت پاک شد. چطور می‌توانم کمکتان کنم؟" }]);
    setShowClearConfirm(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("لطفا فقط فایل PDF انتخاب کنید.");
      return;
    }

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      setCurrentFile(file.name);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: `✅ فایل "${file.name}" با موفقیت پردازش شد.` 
      }]);

    } catch (err) {
      console.error(err);
      setError("خطا در آپلود فایل.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userQuestion = input;
    
    // 1. Create the new message object
    const newUserMessage: Message = { role: "user", content: userQuestion };
    
    // 2. We need to send the history BEFORE this new question
    // We filter out any error messages or 'thinking' states if you have them
    const historyToSend = messages.filter(m => m.role === "user" || m.role === "assistant");

    // 3. Update UI immediately
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          query: userQuestion,
          history: historyToSend // <--- SENDING MEMORY HERE!
        }),
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);

    } catch (err) {
      console.error(err);
      setError("خطا در ارتباط با سرور.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Main Container: Dark Theme, Fixed Height (h-screen), No Page Scroll
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans" dir="rtl">
      
      {/* --- HEADER --- */}
      <header className="bg-gray-800 border-b border-gray-700 p-4 shadow-md flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-600 rounded-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">دستیار هوشمند</h1>
            <p className="text-xs text-gray-400">آماده پاسخگویی</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentFile && (
            <div className="hidden md:flex items-center gap-2 bg-gray-700 text-orange-400 px-3 py-1 rounded-full text-xs border border-gray-600">
              <FileText size={14} />
              <span className="max-w-[100px] truncate">{currentFile}</span>
            </div>
          )}
          
          <button 
            onClick={() => setShowClearConfirm(true)}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-full transition-colors"
            title="پاک کردن چت"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </header>

      {/* --- MESSAGES AREA --- */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex w-full ${msg.role === "user" ? "justify-start" : "justify-end"}`}
          >
            <div className={`flex max-w-[85%] md:max-w-[70%] gap-3 ${msg.role === "user" ? "flex-row" : "flex-row-reverse"}`}>
              
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === "user" ? "bg-gray-700 text-gray-300" : "bg-orange-600 text-white"
              }`}>
                {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>

              {/* Bubble */}
              <div className={`p-3.5 rounded-2xl text-sm md:text-base leading-7 shadow-sm ${
                msg.role === "user"
                  ? "bg-gray-800 text-gray-100 rounded-tr-none border border-gray-700"
                  : "bg-orange-600 text-white rounded-tl-none"
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-end w-full">
            <div className="flex flex-row-reverse items-center gap-3">
              <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center animate-pulse">
                <Bot size={16} className="text-white" />
              </div>
              <div className="text-gray-400 text-sm animate-pulse">در حال نوشتن...</div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex justify-center my-4">
            <div className="bg-red-900/50 border border-red-800 text-red-200 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          </div>
        )}

        {/* Invisible div to auto-scroll to */}
        <div ref={messagesEndRef} />
      </main>

      {/* --- INPUT AREA --- */}
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="max-w-4xl mx-auto flex gap-3 items-center">
          
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:hover:bg-orange-600 text-white p-3.5 rounded-xl transition-all shadow-lg hover:shadow-orange-900/20"
          >
            <Send size={20} className={loading ? "opacity-0" : "rtl:-scale-x-100"} />
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="پیام خود را بنویسید..."
            className="flex-1 bg-gray-900 text-white border border-gray-700 placeholder-gray-500 rounded-xl px-4 py-3.5 text-right focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
          />

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="application/pdf"
          />
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className={`p-3.5 rounded-xl border transition-all ${
              uploading 
                ? "bg-gray-800 border-gray-600 text-gray-500 cursor-wait" 
                : "bg-gray-800 border-gray-600 text-gray-400 hover:text-orange-400 hover:border-orange-400 hover:bg-gray-700"
            }`}
          >
            {uploading ? (
              <div className="w-5 h-5 border-2 border-gray-500 border-t-orange-500 rounded-full animate-spin" />
            ) : (
              <Paperclip size={20} />
            )}
          </button>

        </div>
      </div>

      {/* --- CLEAR CONFIRMATION MODAL --- */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl transform transition-all scale-100">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center text-red-500">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">پاک کردن تاریخچه؟</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                آیا مطمئن هستید؟ تمام پیام‌های فعلی پاک خواهند شد و قابل بازگشت نیستند.
              </p>
              
              <div className="flex gap-3 w-full mt-2">
                <button 
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-700 text-white hover:bg-gray-600 transition-colors font-medium"
                >
                  انصراف
                </button>
                <button 
                  onClick={handleClearChat}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-500 transition-colors font-medium shadow-lg shadow-red-900/20"
                >
                  بله، پاک کن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}