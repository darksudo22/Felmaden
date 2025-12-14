"use client";

import { useState, useRef } from "react";
import { Send, User, Bot, AlertCircle, Paperclip, FileText, Check } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "سلام! من دستیار هوشمند شما هستم. لطفا یک فایل PDF آپلود کنید تا بتوانم به سوالات شما پاسخ دهم." }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // --- NEW: Upload State ---
  const [uploading, setUploading] = useState(false);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- NEW: Handle File Upload ---
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
    // You can add user_id here if your backend requires it specifically in the form
    // formData.append("user_id", "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"); 

    try {
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setCurrentFile(file.name);
      
      // Add a system message saying upload was successful
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: `✅ فایل "${file.name}" با موفقیت پردازش شد. حالا می‌توانید سوال بپرسید!` 
      }]);

    } catch (err) {
      console.error(err);
      setError("خطا در آپلود فایل. مطمئن شوید Backend روشن است.");
    } finally {
      setUploading(false);
      // Reset input so you can upload the same file again if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userQuestion = input;
    const userMessage: Message = { role: "user", content: userQuestion };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userQuestion,
          user_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11" 
        }),
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      
      const botMessage: Message = { 
        role: "assistant", 
        content: data.answer || "متاسفانه پاسخی پیدا نشد."
      };
      
      setMessages((prev) => [...prev, botMessage]);

    } catch (err) {
      console.error(err);
      setError("خطا در ارتباط با سرور.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800" dir="rtl">
      
      {/* Header */}
      <header className="bg-white shadow-sm p-4 sticky top-0 z-10 flex justify-between items-center">
        <h1 className="text-xl font-bold text-orange-600 flex items-center gap-2">
          <Bot className="w-6 h-6" />
          دستیار هوشمند اسناد
        </h1>
        {currentFile && (
          <div className="text-xs bg-orange-50 text-orange-700 px-3 py-1 rounded-full flex items-center gap-1">
            <FileText size={14} />
            {currentFile}
          </div>
        )}
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl shadow-sm flex items-start gap-3 ${
                msg.role === "user"
                  ? "bg-white text-gray-800 border border-gray-200"
                  : "bg-orange-100 text-gray-900"
              }`}
            >
              {msg.role === "user" ? <User size={20} className="mt-1 text-gray-400" /> : <Bot size={20} className="mt-1 text-orange-600" />}
              <p className="leading-relaxed text-sm md:text-base whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-end">
            <div className="bg-orange-50 p-3 rounded-2xl animate-pulse text-sm text-gray-500 flex items-center gap-2">
              <Bot size={16} />
              در حال فکر کردن...
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div className="bg-red-50 text-red-600 p-2 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          </div>
        )}
      </main>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto flex gap-2 items-center">
          
          {/* --- NEW: Send Button --- */}
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white p-3 rounded-full transition-all shadow-md"
          >
            <Send size={20} className={loading ? "opacity-0" : "rtl:-scale-x-100"} />
          </button>
          
          {/* --- NEW: Text Input --- */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="سوالی درباره اسناد بپرسید..."
            className="flex-1 bg-gray-100 border-none outline-none focus:ring-2 focus:ring-orange-200 rounded-full px-4 py-3 text-right"
          />

          {/* --- NEW: Upload Button --- */}
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
            className={`p-3 rounded-full transition-all border border-gray-200 ${
              uploading 
                ? "bg-gray-100 text-gray-400 cursor-wait" 
                : "bg-white text-gray-500 hover:bg-gray-100 hover:text-orange-600"
            }`}
            title="آپلود فایل PDF"
          >
            {uploading ? (
              <span className="block w-5 h-5 border-2 border-gray-300 border-t-orange-600 rounded-full animate-spin"></span>
            ) : (
              <Paperclip size={20} />
            )}
          </button>

        </div>
      </div>
    </div>
  );
}