"use client";

import { motion } from "framer-motion";
import { Play, Construction, Rocket, Code2 } from "lucide-react";

export default function Visualizer() {
  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto pb-10">
      <header className="mb-10">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <Play className="text-violet-400 w-10 h-10" /> 
          Execution Flow Visualizer
        </h1>
        <p className="text-slate-400 mt-2">See your code come to life, line by line.</p>
      </header>

      <div className="flex-1 glass-panel rounded-2xl border border-white/10 flex flex-col items-center justify-center p-10 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex flex-col items-center max-w-lg"
        >
          <div className="w-24 h-24 rounded-full bg-black/50 border border-white/10 flex items-center justify-center mb-6 shadow-2xl relative">
            <div className="absolute inset-0 rounded-full border border-violet-500/50 animate-ping opacity-20" />
            <Construction className="w-12 h-12 text-violet-400" />
          </div>

          <h2 className="text-3xl font-bold text-white mb-4">Under Construction</h2>
          
          <p className="text-slate-300 leading-relaxed mb-8">
            We are actively building the ultimate AST-based Code Flow Visualizer. Soon, you'll be able to trace variable states, loops, and call stacks visually in real-time.
          </p>

          <div className="grid grid-cols-2 gap-4 w-full text-left">
             <div className="bg-black/30 border border-white/5 p-4 rounded-xl flex items-start gap-3">
                <Rocket className="w-5 h-5 text-emerald-400 mt-0.5" />
                <div>
                   <h4 className="font-bold text-sm text-white">AST Parsing</h4>
                   <p className="text-xs text-slate-400">Deep code structure analysis.</p>
                </div>
             </div>
             <div className="bg-black/30 border border-white/5 p-4 rounded-xl flex items-start gap-3">
                <Code2 className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                   <h4 className="font-bold text-sm text-white">Live Tracing</h4>
                   <p className="text-xs text-slate-400">Watch variables mutate visually.</p>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
