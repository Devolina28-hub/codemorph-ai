"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { motion } from "framer-motion";
import { Bug, Search, CheckCircle, AlertTriangle, Lightbulb, Play, Loader2, ArrowRight } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const LANGUAGES = [
  { id: "c", name: "C" },
  { id: "cpp", name: "C++" },
  { id: "java", name: "Java" },
  { id: "python", name: "Python" },
  { id: "javascript", name: "JavaScript" },
];

interface ErrorDetail {
  line: string | number;
  type: string;
  message: string;
  explanation: string;
}

interface DebugResult {
  hasError: boolean;
  errors: ErrorDetail[];
  fixedCode: string;
  suggestions: string[];
}

export default function Debugger() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// Write some buggy code here...");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DebugResult | null>(null);

  const handleAnalyze = async () => {
    if (!code.trim()) {
      toast.error("Please enter some code to analyze");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/debug`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      if (!response.ok) throw new Error("Failed to analyze code");

      const data = await response.json();
      setResult(data);
      if (data.hasError) {
        toast.error("Errors found in your code!");
      } else {
        toast.success("No errors found. Your code looks good!");
      }
    } catch (error) {
      toast.error("An error occurred during analysis");
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applyFix = () => {
    if (result?.fixedCode) {
      setCode(result.fixedCode);
      setResult(null);
      toast.success("Fix applied successfully!");
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Toaster position="top-right" />
      
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Bug className="text-red-500" /> Intelligent Debugger
          </h1>
          <p className="text-slate-400 mt-2">Detect and fix syntax, logic, and runtime errors instantly.</p>
        </div>
        
        <button 
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-red-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          {isAnalyzing ? "Analyzing Code..." : "Analyze Code"}
        </button>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        {/* Code Editor */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel rounded-2xl border border-white/10 flex flex-col overflow-hidden h-[calc(100vh-160px)]"
        >
          <div className="p-4 border-b border-white/10 bg-black/20 flex justify-between items-center">
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-white font-semibold outline-none cursor-pointer"
            >
              {LANGUAGES.map(l => <option key={l.id} value={l.id} className="bg-slate-800">{l.name}</option>)}
            </select>
          </div>
          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
              }}
            />
          </div>
        </motion.div>

        {/* Analysis Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel rounded-2xl border border-white/10 flex flex-col overflow-hidden h-[calc(100vh-160px)] overflow-y-auto"
        >
          <div className="p-4 border-b border-white/10 bg-black/20 flex items-center gap-2 font-bold">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            Analysis Results
          </div>
          
          <div className="p-6 space-y-6">
            {!result && !isAnalyzing && (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 py-20">
                <Bug className="w-16 h-16 mb-4 opacity-50" />
                <p>Run analysis to detect errors and get suggestions.</p>
              </div>
            )}

            {isAnalyzing && (
              <div className="flex flex-col items-center justify-center text-violet-400 py-20 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin" />
                <p className="animate-pulse">AI is analyzing your code deeply...</p>
              </div>
            )}

            {result && !result.hasError && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-xl flex flex-col items-center text-center">
                <CheckCircle className="w-12 h-12 text-emerald-400 mb-4" />
                <h3 className="text-xl font-bold text-emerald-400 mb-2">Code looks good!</h3>
                <p className="text-emerald-200/70">No syntax, logical, or runtime errors detected.</p>
              </div>
            )}

            {result && result.hasError && (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="text-red-400 w-6 h-6" />
                    <div>
                      <h3 className="font-bold text-red-400">Errors Detected</h3>
                      <p className="text-sm text-red-300/70">Found {result.errors.length} issue(s) in your code.</p>
                    </div>
                  </div>
                  <button 
                    onClick={applyFix}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors flex items-center gap-2"
                  >
                    Fix All <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {result.errors.map((error, idx) => (
                    <div key={idx} className="bg-black/30 rounded-xl p-5 border border-white/5 border-l-4 border-l-red-500">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-red-400 font-bold uppercase text-xs tracking-wider">
                          Line {error.line} • {error.type}
                        </span>
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-3">{error.message}</h4>
                      
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Why this happens:</span>
                        <p className="text-slate-300 text-sm leading-relaxed">{error.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result && result.suggestions && result.suggestions.length > 0 && (
              <div className="mt-8 border-t border-white/10 pt-8">
                <h3 className="font-bold text-xl flex items-center gap-2 mb-4">
                  <Lightbulb className="text-yellow-400 w-5 h-5" /> 
                  Optimization Suggestions
                </h3>
                <div className="space-y-3">
                  {result.suggestions.map((suggestion, idx) => (
                    <div key={idx} className="flex gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                      <div className="w-6 h-6 rounded-full bg-yellow-400/10 flex items-center justify-center flex-shrink-0 text-yellow-400 text-sm font-bold">
                        {idx + 1}
                      </div>
                      <p className="text-slate-300 text-sm">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
