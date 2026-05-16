"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronDown, Award, Star, Zap, Code2, CheckCircle2, X, Loader2, Bot } from "lucide-react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

const CURRICULUM = {
  beginner: [
    "Introduction & Setup", "Hello World & Print Statements", "Variables & Data Types",
    "Taking Input", "Operators", "Conditions (If-Else)", "Loops (For, While)",
    "Functions", "Arrays / Lists", "Strings"
  ],
  intermediate: [
    "Pointers & Memory (C/C++)", "Structures & Enums", "File Handling",
    "Exception Handling", "Modules & Packages", "Recursion",
    "Searching Algorithms", "Sorting Algorithms"
  ],
  advanced: [
    "Object-Oriented Programming (OOPS)", "Classes & Objects", "Inheritance & Polymorphism",
    "Encapsulation & Abstraction", "Generics / Templates", "STL (C++) / Collections (Java)",
    "Decorators & Generators", "Async & Multithreading", "APIs & Web Requests", "Database Connectivity"
  ]
};

const LANGUAGES = [
  { id: "python", name: "Python", icon: "🐍", color: "from-blue-500 to-yellow-500" },
  { id: "javascript", name: "JavaScript", icon: "⚡", color: "from-yellow-400 to-orange-500" },
  { id: "cpp", name: "C++", icon: "⚙️", color: "from-blue-600 to-indigo-600" },
  { id: "java", name: "Java", icon: "☕", color: "from-red-500 to-orange-600" },
  { id: "c", name: "C", icon: "🖥️", color: "from-slate-600 to-slate-800" },
];

export default function Learn() {
  const [activeLang, setActiveLang] = useState("python");
  const [expandedSection, setExpandedSection] = useState<string | null>("beginner");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [lesson, setLesson] = useState<string | null>(null);
  const [isLoadingLesson, setIsLoadingLesson] = useState(false);

  const toggleSection = (section: string) => {
    if (expandedSection === section) setExpandedSection(null);
    else setExpandedSection(section);
  };

  const openLesson = async (topic: string) => {
    setSelectedTopic(topic);
    setLesson(null);
    setIsLoadingLesson(true);

    const langName = LANGUAGES.find(l => l.id === activeLang)?.name || activeLang;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/tutor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "Beginner",
          messages: [
            {
              role: "user",
              content: `Please teach me about "${topic}" in ${langName}. Structure your response like a mini lesson:
1. A short, clear explanation (2-3 sentences max).
2. A real-life analogy to understand the concept.
3. A simple, well-commented code example in ${langName}.
4. One practice exercise I can try myself.
Keep the entire lesson concise and beginner-friendly.`
            }
          ]
        }),
      });
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      setLesson(data.reply);
    } catch (err) {
      toast.error("Failed to load lesson. Please try again.");
      setSelectedTopic(null);
    } finally {
      setIsLoadingLesson(false);
    }
  };

  const closeLesson = () => {
    setSelectedTopic(null);
    setLesson(null);
  };

  const TopicCard = ({ topic, icon: Icon, hoverColor }: { topic: string; icon: any; hoverColor: string }) => (
    <button
      onClick={() => openLesson(topic)}
      className={`flex items-center gap-3 bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-all cursor-pointer group border border-transparent ${hoverColor} text-left w-full`}
    >
      <Icon className={`w-5 h-5 text-slate-600 group-hover:text-current transition-colors flex-shrink-0`} />
      <span className="text-slate-300 font-medium text-sm group-hover:text-white">{topic}</span>
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <Toaster position="top-right" />

      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold flex items-center justify-center gap-3 mb-4">
          <BookOpen className="text-pink-500 w-10 h-10" />
          Interactive Learning Path
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Master programming from scratch. Click any topic to get an instant AI-powered lesson.
        </p>
      </header>

      {/* Language Selector */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.id}
            onClick={() => setActiveLang(lang.id)}
            className={`px-6 py-3 rounded-xl font-bold text-lg flex items-center gap-2 transition-all ${
              activeLang === lang.id
                ? `bg-gradient-to-r ${lang.color} text-white shadow-lg shadow-white/10 scale-105`
                : `glass-panel text-slate-400 hover:text-white hover:bg-white/5`
            }`}
          >
            <span>{lang.icon}</span> {lang.name}
          </button>
        ))}
      </div>

      {/* Curriculum Sections */}
      <div className="space-y-6">
        {/* Beginner */}
        <div className="glass-panel rounded-2xl border border-emerald-500/20 overflow-hidden">
          <button
            onClick={() => toggleSection('beginner')}
            className="w-full p-6 flex justify-between items-center bg-gradient-to-r from-emerald-500/10 to-transparent hover:bg-emerald-500/20 transition-colors text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Star className="text-emerald-400 w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Beginner Level</h2>
                <p className="text-slate-400 text-sm">Master the absolute fundamentals of {LANGUAGES.find(l => l.id === activeLang)?.name}.</p>
              </div>
            </div>
            <ChevronDown className={`w-6 h-6 text-emerald-400 transition-transform duration-300 ${expandedSection === 'beginner' ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {expandedSection === 'beginner' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-black/20 border-t border-emerald-500/20">
                  {CURRICULUM.beginner.map((topic, idx) => (
                    <TopicCard key={idx} topic={topic} icon={CheckCircle2} hoverColor="hover:border-emerald-500/30" />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Intermediate */}
        <div className="glass-panel rounded-2xl border border-yellow-500/20 overflow-hidden">
          <button
            onClick={() => toggleSection('intermediate')}
            className="w-full p-6 flex justify-between items-center bg-gradient-to-r from-yellow-500/10 to-transparent hover:bg-yellow-500/20 transition-colors text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Zap className="text-yellow-400 w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Intermediate Level</h2>
                <p className="text-slate-400 text-sm">Dive deeper into data structures, memory, and algorithms.</p>
              </div>
            </div>
            <ChevronDown className={`w-6 h-6 text-yellow-400 transition-transform duration-300 ${expandedSection === 'intermediate' ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {expandedSection === 'intermediate' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-black/20 border-t border-yellow-500/20">
                  {CURRICULUM.intermediate.map((topic, idx) => (
                    <TopicCard key={idx} topic={topic} icon={Code2} hoverColor="hover:border-yellow-500/30" />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Advanced */}
        <div className="glass-panel rounded-2xl border border-pink-500/20 overflow-hidden">
          <button
            onClick={() => toggleSection('advanced')}
            className="w-full p-6 flex justify-between items-center bg-gradient-to-r from-pink-500/10 to-transparent hover:bg-pink-500/20 transition-colors text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center">
                <Award className="text-pink-400 w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Advanced Level</h2>
                <p className="text-slate-400 text-sm">Master Architecture, OOPS, Concurrency, and Real-World APIs.</p>
              </div>
            </div>
            <ChevronDown className={`w-6 h-6 text-pink-400 transition-transform duration-300 ${expandedSection === 'advanced' ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {expandedSection === 'advanced' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/20 border-t border-pink-500/20">
                  {CURRICULUM.advanced.map((topic, idx) => (
                    <TopicCard key={idx} topic={topic} icon={Award} hoverColor="hover:border-pink-500/30" />
                  ))}

                  <div className="col-span-full mt-4">
                    <Link href="/oops">
                      <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl p-6 text-center hover:scale-[1.02] transition-transform cursor-pointer shadow-lg shadow-pink-500/25">
                        <h3 className="text-xl font-bold text-white mb-2">Want to master OOPS visually?</h3>
                        <p className="text-pink-200 text-sm">Check out our dedicated OOPS Visual Learning System with real-world analogies.</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Lesson Modal */}
      <AnimatePresence>
        {selectedTopic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeLesson}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25 }}
              className="bg-[#0f172a] border border-white/10 rounded-2xl p-8 w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Bot className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedTopic}</h2>
                    <p className="text-xs text-slate-400">AI-Powered Lesson • {LANGUAGES.find(l => l.id === activeLang)?.name}</p>
                  </div>
                </div>
                <button onClick={closeLesson} className="text-slate-400 hover:text-white transition-colors p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isLoadingLesson ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
                  <p className="text-slate-400 animate-pulse">Generating your lesson...</p>
                </div>
              ) : (
                <div className="text-slate-200 leading-relaxed whitespace-pre-wrap text-sm">
                  {lesson}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
