"use client";

import { motion } from "framer-motion";
import { Code2, Bug, Play, BookOpen, ArrowRight, Zap, Trophy, Flame } from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "AI Code Converter",
    description: "Convert code between languages instantly while preserving logic and complexity.",
    icon: Code2,
    color: "from-blue-500 to-cyan-500",
    path: "/converter"
  },
  {
    title: "Intelligent Debugger",
    description: "Detect syntax, logic, and runtime errors with simple human-readable explanations.",
    icon: Bug,
    color: "from-red-500 to-orange-500",
    path: "/debugger"
  },
  {
    title: "Visual Execution Engine",
    description: "Visualize code execution step-by-step with memory and stack tracing.",
    icon: Play,
    color: "from-green-500 to-emerald-500",
    path: "/visualizer"
  },
  {
    title: "Learning Modules",
    description: "Comprehensive beginner to advanced tutorials for multiple programming languages.",
    icon: BookOpen,
    color: "from-purple-500 to-pink-500",
    path: "/learn"
  }
];

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <header className="flex justify-between items-center mb-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-4xl font-bold">Welcome back, <span className="text-gradient">Developer</span></h1>
          <p className="text-slate-400">Continue your learning journey and build something amazing today.</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex gap-4"
        >
          <div className="glass-panel px-4 py-2 rounded-xl flex items-center gap-2 border-orange-500/30">
            <Flame className="text-orange-500 w-5 h-5" />
            <span className="font-bold">12 Day Streak</span>
          </div>
          <div className="glass-panel px-4 py-2 rounded-xl flex items-center gap-2 border-yellow-500/30">
            <Trophy className="text-yellow-500 w-5 h-5" />
            <span className="font-bold">Level 8</span>
          </div>
        </motion.div>
      </header>

      {/* Main Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={feature.path}>
                <div className="glass-card rounded-2xl p-6 h-full border border-white/5 hover:border-white/20 transition-all group cursor-pointer hover:-translate-y-1 duration-300">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                  <p className="text-slate-400 text-sm mb-6 line-clamp-2">{feature.description}</p>
                  
                  <div className="flex items-center text-sm font-semibold text-violet-400 group-hover:text-violet-300">
                    Explore Module <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-white/5"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Zap className="text-yellow-400" /> Recent Activity
            </h2>
            <button className="text-sm text-violet-400 hover:text-violet-300">View All</button>
          </div>
          
          <div className="space-y-4">
            {[
              { title: "Converted Python to JavaScript", time: "2 hours ago", type: "Converter" },
              { title: "Completed: Intro to OOPS in C++", time: "Yesterday", type: "Learning" },
              { title: "Fixed Memory Leak Bug", time: "2 days ago", type: "Debugger" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-white/10">
                <div>
                  <h4 className="font-semibold text-white">{activity.title}</h4>
                  <span className="text-xs text-slate-400">{activity.type}</span>
                </div>
                <span className="text-sm text-slate-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col items-center justify-center text-center text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-pink-600/20 z-0" />
          <div className="relative z-10 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-violet-500 to-pink-500 flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold">Daily Challenge</h3>
            <p className="text-sm text-slate-300 mb-6">Solve today's algorithmic puzzle and earn 50 XP.</p>
            <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-colors w-full shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              Start Challenge
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
