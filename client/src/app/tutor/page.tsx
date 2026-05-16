"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Send, User, Bot, GraduationCap, Zap, Target, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const MODES = [
  { id: "Beginner", icon: GraduationCap, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/30" },
  { id: "Intermediate", icon: Zap, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/30" },
  { id: "Advanced", icon: Target, color: "text-pink-400", bg: "bg-pink-400/10", border: "border-pink-400/30" },
];

export default function Tutor() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi there! I'm your AI Programming Tutor. What would you like to learn today? You can ask me to explain a concept, give you a quiz, or help you debug your code." }
  ]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("Beginner");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user" as const, content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/tutor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
          mode 
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch response");

      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      toast.error("Failed to connect to the AI Tutor.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto pb-4">
      <Toaster position="top-right" />
      
      <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <MessageSquare className="text-blue-400" /> AI Tutor
          </h1>
          <p className="text-slate-400 mt-2">Your personal 24/7 programming mentor.</p>
        </div>
        
        <div className="flex gap-2 p-1 glass-panel rounded-xl">
          {MODES.map((m) => {
            const isActive = mode === m.id;
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  isActive ? `${m.bg} ${m.color} ${m.border} border` : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
                {m.id}
              </button>
            )
          })}
        </div>
      </header>

      <div className="flex-1 glass-panel rounded-2xl border border-white/10 flex flex-col overflow-hidden shadow-2xl relative">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx}
              className={`flex gap-4 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === "user" ? "bg-violet-500" : "bg-gradient-to-br from-blue-500 to-cyan-500"
              }`}>
                {msg.role === "user" ? <User className="text-white w-5 h-5" /> : <Bot className="text-white w-6 h-6" />}
              </div>
              
              <div className={`p-4 rounded-2xl ${
                msg.role === "user" 
                  ? "bg-violet-600/20 border border-violet-500/30 text-white" 
                  : "bg-slate-800/50 border border-white/10 text-slate-200"
              }`}>
                <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </div>
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
             <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="flex gap-4 max-w-[85%] mr-auto"
           >
             <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-blue-500 to-cyan-500">
               <Bot className="text-white w-6 h-6" />
             </div>
             
             <div className="p-4 rounded-2xl bg-slate-800/50 border border-white/10 text-slate-200 flex items-center gap-3">
               <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
               <span className="text-slate-400 animate-pulse">Thinking...</span>
             </div>
           </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-black/40 border-t border-white/10">
          <div className="relative flex items-center max-w-4xl mx-auto">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask your ${mode.toLowerCase()} tutor anything...`}
              className="w-full bg-slate-800/50 border border-white/20 rounded-xl pl-4 pr-14 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors resize-none overflow-hidden"
              rows={1}
              style={{ minHeight: '56px', maxHeight: '150px' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 text-white rounded-lg transition-colors flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-center text-xs text-slate-500 mt-2">
            AI can make mistakes. Always verify the code before using it in production.
          </p>
        </div>
      </div>
    </div>
  );
}
